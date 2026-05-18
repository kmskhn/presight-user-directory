import { sqlite } from '../../db/index.js';
import type { UsersQueryParsed } from './users.schema.js';
import type { FacetItem, UserRow } from './users.types.js';
import { decodeCursor } from '../../lib/cursor.js';

// Escape LIKE special characters
function escapeLike(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
}

// Build the base WHERE clause and params (without cursor)
// Returns { whereClauses, params }
function buildBaseFilter(query: UsersQueryParsed): {
  whereClauses: string[];
  params: (string | number)[];
} {
  const whereClauses: string[] = [];
  const params: (string | number)[] = [];

  // Search filter
  if (query.search) {
    const term = `${escapeLike(query.search)}%`;
    whereClauses.push(`(u.first_name LIKE ? ESCAPE '\\' OR u.last_name LIKE ? ESCAPE '\\')`);
    params.push(term, term);
  }

  // Nationality filter (OR)
  const nationalityList = query.nationalities
    ? query.nationalities.split(',').map((n) => n.trim()).filter(Boolean)
    : [];
  if (nationalityList.length > 0) {
    const placeholders = nationalityList.map(() => '?').join(', ');
    whereClauses.push(`u.nationality IN (${placeholders})`);
    params.push(...nationalityList);
  }

  // Hobby filter (AND — user must have ALL selected hobbies)
  const hobbyList = query.hobbies
    ? query.hobbies.split(',').map((h) => h.trim()).filter(Boolean)
    : [];
  if (hobbyList.length > 0) {
    const placeholders = hobbyList.map(() => '?').join(', ');
    whereClauses.push(`
      u.id IN (
        SELECT uh.user_id
        FROM user_hobbies uh
        JOIN hobbies h ON h.id = uh.hobby_id
        WHERE h.name IN (${placeholders})
        GROUP BY uh.user_id
        HAVING COUNT(DISTINCT uh.hobby_id) = ?
      )
    `);
    params.push(...hobbyList, hobbyList.length);
  }

  return { whereClauses, params };
}

// Build filter WITHOUT the nationality clause — used for nationality facets so
// that selecting one nationality keeps all others visible, enabling multi-select.
// Search and hobby filters still apply.
function buildFilterWithoutNationality(query: UsersQueryParsed): {
  whereClauses: string[];
  params: (string | number)[];
} {
  const whereClauses: string[] = [];
  const params: (string | number)[] = [];

  if (query.search) {
    const term = `${escapeLike(query.search)}%`;
    whereClauses.push(`(u.first_name LIKE ? ESCAPE '\\' OR u.last_name LIKE ? ESCAPE '\\')`);
    params.push(term, term);
  }

  // Nationality filter intentionally omitted

  const hobbyList = query.hobbies
    ? query.hobbies.split(',').map((h) => h.trim()).filter(Boolean)
    : [];
  if (hobbyList.length > 0) {
    const placeholders = hobbyList.map(() => '?').join(', ');
    whereClauses.push(`
      u.id IN (
        SELECT uh.user_id
        FROM user_hobbies uh
        JOIN hobbies h ON h.id = uh.hobby_id
        WHERE h.name IN (${placeholders})
        GROUP BY uh.user_id
        HAVING COUNT(DISTINCT uh.hobby_id) = ?
      )
    `);
    params.push(...hobbyList, hobbyList.length);
  }

  return { whereClauses, params };
}

// Column name mapping (safe, not from user input)

const COLUMN_MAP: Record<string, string> = {
  first_name: 'u.first_name',
  last_name: 'u.last_name',
  age: 'u.age',
  nationality: 'u.nationality',
};

interface RawUserRow {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string | null;
}

export function queryUsers(query: UsersQueryParsed): {
  users: UserRow[];
  hasMore: boolean;
} {
  const { whereClauses, params } = buildBaseFilter(query);
  const sortCol = COLUMN_MAP[query.sortBy] ?? 'u.first_name';
  const dir = query.sortDir === 'desc' ? 'DESC' : 'ASC';
  const limit = query.limit;

  // Cursor condition
  const cursorWhereClauses = [...whereClauses];
  const cursorParams = [...params];

  if (query.cursor) {
    const decoded = decodeCursor(query.cursor);
    if (decoded) {
      if (dir === 'ASC') {
        cursorWhereClauses.push(
          `(${sortCol} > ? OR (${sortCol} = ? AND u.id > ?))`,
        );
      } else {
        cursorWhereClauses.push(
          `(${sortCol} < ? OR (${sortCol} = ? AND u.id > ?))`,
        );
      }
      cursorParams.push(decoded.sortValue, decoded.sortValue, decoded.id);
    }
  }

  const whereStr =
    cursorWhereClauses.length > 0
      ? `WHERE ${cursorWhereClauses.join(' AND ')}`
      : '';

  // Fetch users with their hobbies using GROUP_CONCAT
  const sql = `
    SELECT
      u.id,
      u.avatar,
      u.first_name,
      u.last_name,
      u.age,
      u.nationality,
      GROUP_CONCAT(h.name, '|||') AS hobbies
    FROM users u
    LEFT JOIN user_hobbies uh ON uh.user_id = u.id
    LEFT JOIN hobbies h ON h.id = uh.hobby_id
    ${whereStr}
    GROUP BY u.id
    ORDER BY ${sortCol} ${dir}, u.id ASC
    LIMIT ?
  `;

  const rows = sqlite
    .prepare(sql)
    .all([...cursorParams, limit + 1]) as RawUserRow[];

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;

  const users: UserRow[] = pageRows.map((row) => ({
    id: row.id,
    avatar: row.avatar,
    firstName: row.first_name,
    lastName: row.last_name,
    age: row.age,
    nationality: row.nationality,
    hobbies: row.hobbies ? row.hobbies.split('|||') : [],
  }));

  return { users, hasMore };
}

interface RawFacetRow {
  value: string;
  count: number;
}

export function queryFacets(query: UsersQueryParsed): {
  hobbies: FacetItem[];
  nationalities: FacetItem[];
} {
  // Hobby facets: ALL filters applied per spec (including nationality + hobby own dimension)
  const { whereClauses: hobbyWhere, params: hobbyParams } = buildBaseFilter(query);
  const hobbyWhereStr =
    hobbyWhere.length > 0 ? `WHERE ${hobbyWhere.join(' AND ')}` : '';

  const hobbySql = `
    WITH all_hobbies AS (
      SELECT name AS value FROM hobbies
    )
    SELECT a.value, COALESCE(c.count, 0) AS count
    FROM all_hobbies a
    LEFT JOIN (
      SELECT h.name AS value, COUNT(DISTINCT uh.user_id) AS count
      FROM user_hobbies uh
      JOIN hobbies h ON h.id = uh.hobby_id
      WHERE uh.user_id IN (
        SELECT u.id FROM users u ${hobbyWhereStr}
      )
      GROUP BY h.name
    ) c ON a.value = c.value
    ORDER BY a.value ASC
  `;

  const hobbyRows = sqlite.prepare(hobbySql).all([...hobbyParams]) as RawFacetRow[];

  // Nationality facets: exclude the nationality filter from their own query so
  // that selecting one nationality keeps all others visible in the sidebar,
  // enabling multi-select. Search and hobby filters still apply.
  const { whereClauses: natWhere, params: natParams } = buildFilterWithoutNationality(query);
  const natWhereStr =
    natWhere.length > 0 ? `WHERE ${natWhere.join(' AND ')}` : '';

  const nationalitySql = `
    WITH all_nats AS (
      SELECT DISTINCT nationality AS value FROM users
    )
    SELECT a.value, COALESCE(c.count, 0) AS count
    FROM all_nats a
    LEFT JOIN (
      SELECT nationality AS value, COUNT(*) AS count
      FROM users u
      ${natWhereStr}
      GROUP BY nationality
    ) c ON a.value = c.value
    ORDER BY a.value ASC
  `;

  const nationalityRows = sqlite
    .prepare(nationalitySql)
    .all([...natParams]) as RawFacetRow[];

  return {
    hobbies: hobbyRows,
    nationalities: nationalityRows,
  };
}
