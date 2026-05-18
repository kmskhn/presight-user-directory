import type { Filters, UsersResponse } from '../types/index.js';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchUsers(
  filters: Filters,
  cursor?: string,
  signal?: AbortSignal,
): Promise<UsersResponse> {
  const params = new URLSearchParams();

  if (filters.search) params.set('search', filters.search);
  if (filters.nationalities.length > 0) params.set('nationalities', filters.nationalities.join(','));
  if (filters.hobbies.length > 0) params.set('hobbies', filters.hobbies.join(','));
  params.set('sortBy', filters.sortBy);
  params.set('sortDir', filters.sortDir);
  if (cursor) params.set('cursor', cursor);
  params.set('limit', '30');

  const url = `${BASE_URL}/users?${params.toString()}`;
  const res = await fetch(url, { signal });

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
    throw new ApiError(body?.error?.message ?? 'Request failed', res.status);
  }

  return res.json() as Promise<UsersResponse>;
}
