export interface UserRow {
  id: number;
  avatar: string;
  firstName: string;
  lastName: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface FacetItem {
  value: string;
  count: number;
}

export interface Facets {
  hobbies: FacetItem[];
  nationalities: FacetItem[];
}

export interface Pagination {
  nextCursor: string | null;
  hasMore: boolean;
}

export interface UsersResponse {
  data: UserRow[];
  pagination: Pagination;
  facets: Facets;
}

export interface UsersQuery {
  search: string;
  nationalities: string; // comma-separated
  hobbies: string; // comma-separated
  sortBy: 'first_name' | 'last_name' | 'age' | 'nationality';
  sortDir: 'asc' | 'desc';
  cursor?: string;
  limit: number;
}

export interface CursorPayload {
  sortValue: string | number;
  id: number;
}
