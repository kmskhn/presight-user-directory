import { queryFacets, queryUsers } from './users.repository.js';
import type { UsersQueryParsed } from './users.schema.js';
import type { UsersResponse } from './users.types.js';
import { encodeCursor } from '../../lib/cursor.js';

export function getUsersResponse(query: UsersQueryParsed): UsersResponse {
  const { users, hasMore } = queryUsers(query);
  const facets = queryFacets(query);

  // Build cursor from last user in page
  let nextCursor: string | null = null;
  if (hasMore && users.length > 0) {
    const lastUser = users[users.length - 1];
    const sortValueMap: Record<string, string | number> = {
      first_name: lastUser.firstName,
      last_name: lastUser.lastName,
      age: lastUser.age,
      nationality: lastUser.nationality,
    };
    nextCursor = encodeCursor({
      sortValue: sortValueMap[query.sortBy] ?? lastUser.firstName,
      id: lastUser.id,
    });
  }

  return {
    data: users,
    pagination: { nextCursor, hasMore },
    facets,
  };
}
