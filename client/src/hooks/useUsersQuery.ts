import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUsers } from '../lib/api.js';
import type { Filters, UsersResponse } from '../types/index.js';
import { keepPreviousData } from '@tanstack/react-query';

export function useUsersQuery(filters: Filters) {
  return useInfiniteQuery<UsersResponse, Error>({
    queryKey: ['users', filters],
    queryFn: ({ pageParam, signal }) =>
      fetchUsers(filters, pageParam as string | undefined, signal),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? (lastPage.pagination.nextCursor ?? undefined) : undefined,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    gcTime: 300_000,
  });
}
