import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { UserCard } from './UserCard.js';
import { SkeletonList } from './UserCardSkeleton.js';
import { InlineLoadingRow, ListOverlay } from './LoadingSpinner.js';
import { EmptyState } from './EmptyState.js';
import { ErrorState } from './ErrorState.js';
import type { UserRow } from '../types/index.js';

interface UserListProps {
  users: UserRow[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isRefetching: boolean;
  hasNextPage: boolean;
  error: Error | null;
  onLoadMore: () => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function UserList({
  users,
  isLoading,
  isFetchingNextPage,
  isRefetching,
  hasNextPage,
  error,
  onLoadMore,
  hasActiveFilters,
  onClearFilters,
}: UserListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtual item count: real items + 1 sentinel for loading row at bottom
  const count = hasNextPage || isFetchingNextPage ? users.length + 1 : users.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 96,
    overscan: 5,
    gap: 8,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Trigger next page when sentinel row is rendered
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= users.length && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  }, [virtualItems, users.length, hasNextPage, isFetchingNextPage, onLoadMore]);

  // Initial loading state
  if (isLoading) {
    return <SkeletonList count={10} />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (users.length === 0) {
    return (
      <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={onClearFilters} />
    );
  }

  const showOverlay = isRefetching && !isFetchingNextPage;

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto relative scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border pt-4"
      role="feed"
      aria-busy={isRefetching}
      aria-label="User directory"
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {showOverlay && <ListOverlay />}

        {virtualItems.map((virtualRow) => {
          const isLoaderRow = virtualRow.index >= users.length;

          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
                paddingBottom: '0',
              }}
            >
              {isLoaderRow ? (
                <InlineLoadingRow />
              ) : (
                <div style={{ paddingBottom: '8px' }}>
                  <UserCard user={users[virtualRow.index]!} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
