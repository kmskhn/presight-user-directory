import { useCallback, useMemo, useState } from 'react';
import { useFilterParams } from '../hooks/useFilterParams.js';
import { useUsersQuery } from '../hooks/useUsersQuery.js';
import { FilterSidebar } from '../components/FilterSidebar.js';
import { UserList } from '../components/UserList.js';
import { SortControls } from '../components/SortControls.js';
import type { Facets, Filters } from '../types/index.js';

const EMPTY_FACETS: Facets = { hobbies: [], nationalities: [] };

function useActiveFacets(apiFacets: Facets, selectedNationalities: string[], selectedHobbies: string[]) {
  return useMemo(() => {
    const hobbiesMap = new Map(apiFacets.hobbies.map(h => [h.value, h.count]));
    const natsMap = new Map(apiFacets.nationalities.map(n => [n.value, n.count]));

    // Ensure actively selected items remain in the list so they can be deselected
    selectedHobbies.forEach(h => {
      if (!hobbiesMap.has(h)) hobbiesMap.set(h, 0);
    });
    selectedNationalities.forEach(n => {
      if (!natsMap.has(n)) natsMap.set(n, 0);
    });

    // Sort alphabetically so items don't jump around when their counts change
    const newHobbies = Array.from(hobbiesMap.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));
    
    const newNats = Array.from(natsMap.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value));

    return { hobbies: newHobbies, nationalities: newNats };
  }, [apiFacets, selectedHobbies, selectedNationalities]);
}

export function DirectoryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Use facets from the latest page, processed to ensure selected items don't vanish and items are alphabetical
  const apiFacets = data?.pages[data.pages.length - 1]?.facets ?? EMPTY_FACETS;
  const facets = useActiveFacets(apiFacets, filters.nationalities, filters.hobbies);

  const handleSortByChange = useCallback(
    (value: Filters['sortBy']) => setFilters({ sortBy: value }),
    [setFilters],
  );

  const handleSortDirChange = useCallback(
    (value: Filters['sortDir']) => setFilters({ sortDir: value }),
    [setFilters],
  );

  const handleClearCategory = useCallback(
    (category: 'nationality' | 'hobby') => {
      setFilters({ [category === 'nationality' ? 'nationalities' : 'hobbies']: [] });
    },
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
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] flex-1">
      <FilterSidebar
        facets={facets}
        filters={filters}
        isLoading={isLoading}
        onToggleNationality={toggleNationality}
        onToggleHobby={toggleHobby}
        onClearAll={clearAllFilters}
        onClearCategory={handleClearCategory}
        hasActiveFilters={hasActiveFilters}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex flex-col h-[calc(100dvh-73px)] relative" id="main-content">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface sticky top-0 z-10 min-h-[60px]">
          <div className="flex gap-2 items-center">
            <button 
              className="md:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-transparent text-text-secondary border border-border hover:bg-surface-raised hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2" 
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open filters"
            >
              Filters
            </button>
            <SortControls
              sortBy={filters.sortBy}
              sortDir={filters.sortDir}
              onSortByChange={handleSortByChange}
              onSortDirChange={handleSortDirChange}
            />
          </div>
          <span className="text-sm font-medium text-text-secondary whitespace-nowrap ml-4" aria-live="polite" aria-atomic="true">
            {isLoading ? '…' : `${totalDisplayed.toLocaleString()} records shown`}
          </span>
        </div>

        {/* Active filter pills with smooth height transition to prevent layout shift */}
        <div 
          className={`grid transition-all duration-300 ease-in-out ${activePills.length > 0 ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
          aria-hidden={activePills.length === 0}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-1.5 px-6 pt-4 pb-2" aria-label="Active filters">
              {activePills.map((pill) => (
                <button
                  key={`${pill.type}-${pill.value}`}
                id={`pill-${pill.type}-${pill.value.replace(/\s+/g, '-')}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-accent-muted text-accent-hover border border-accent/25 cursor-pointer transition-colors hover:bg-accent/25"
                onClick={() => {
                  if (pill.type === 'nationality') toggleNationality(pill.value);
                  else toggleHobby(pill.value);
                }}
                aria-label={`Remove ${pill.type} filter: ${pill.value}`}
                title={`Remove ${pill.value}`}
              >
                <span className="text-[10px] opacity-70">
                  {pill.type === 'nationality' ? '🌍' : '🎯'}
                </span>
                {pill.value}
                <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center opacity-70 hover:opacity-100" aria-hidden="true">×</span>
              </button>
            ))}
            </div>
          </div>
        </div>

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
