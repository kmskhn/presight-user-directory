import { useCallback, useMemo } from 'react';
import { useFilterParams } from '../hooks/useFilterParams.js';
import { useUsersQuery } from '../hooks/useUsersQuery.js';
import { FilterSidebar } from '../components/FilterSidebar.js';
import { UserList } from '../components/UserList.js';
import { SortControls } from '../components/SortControls.js';
import type { Facets, Filters } from '../types/index.js';

const EMPTY_FACETS: Facets = { hobbies: [], nationalities: [] };

export function DirectoryPage() {
  const {
    filters,
    setFilters,
    clearAllFilters,
    toggleNationality,
    toggleHobby,
    hasActiveFilters,
  } = useFilterParams();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    fetchNextPage,
    error,
  } = useUsersQuery(filters);

  const allUsers = useMemo(
    () => data?.pages.flatMap((p) => p.data) ?? [],
    [data],
  );

  // Use facets from the latest page
  const facets = data?.pages[data.pages.length - 1]?.facets ?? EMPTY_FACETS;

  const handleSortByChange = useCallback(
    (value: Filters['sortBy']) => setFilters({ sortBy: value }),
    [setFilters],
  );

  const handleSortDirChange = useCallback(
    (value: Filters['sortDir']) => setFilters({ sortDir: value }),
    [setFilters],
  );

  const handleLoadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  const isRefetching = isFetching && !isLoading && !isFetchingNextPage;

  // Active filter pills data (search is in header, not as a pill)
  const activePills = useMemo(() => {
    const pills: { type: 'nationality' | 'hobby'; value: string }[] = [];
    for (const n of filters.nationalities) pills.push({ type: 'nationality', value: n });
    for (const h of filters.hobbies) pills.push({ type: 'hobby', value: h });
    return pills;
  }, [filters.nationalities, filters.hobbies]);

  const totalDisplayed = allUsers.length;

  return (
    <div className="app-body">
      <FilterSidebar
        facets={facets}
        filters={filters}
        isLoading={isLoading}
        onToggleNationality={toggleNationality}
        onToggleHobby={toggleHobby}
        onClearAll={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <main className="main-content" id="main-content">
        <div className="main-toolbar">
          <SortControls
            sortBy={filters.sortBy}
            sortDir={filters.sortDir}
            onSortByChange={handleSortByChange}
            onSortDirChange={handleSortDirChange}
          />
          <span className="result-count" aria-live="polite" aria-atomic="true">
            {isLoading ? '…' : `${totalDisplayed.toLocaleString()} shown`}
          </span>
        </div>

        {/* Active filter pills */}
        {activePills.length > 0 && (
          <div className="filter-pills" aria-label="Active filters">
            {activePills.map((pill) => (
              <button
                key={`${pill.type}-${pill.value}`}
                id={`pill-${pill.type}-${pill.value.replace(/\s+/g, '-')}`}
                className="filter-pill"
                onClick={() => {
                  if (pill.type === 'nationality') toggleNationality(pill.value);
                  else toggleHobby(pill.value);
                }}
                aria-label={`Remove ${pill.type} filter: ${pill.value}`}
                title={`Remove ${pill.value}`}
              >
                <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>
                  {pill.type === 'nationality' ? '🌍' : '🎯'}
                </span>
                {pill.value}
                <span className="filter-pill__remove" aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}

        <UserList
          users={allUsers}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          isRefetching={isRefetching}
          hasNextPage={hasNextPage ?? false}
          error={error}
          onLoadMore={handleLoadMore}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearAllFilters}
        />
      </main>
    </div>
  );
}
