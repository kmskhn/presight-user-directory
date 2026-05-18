import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Filters } from '../types/index.js';

const VALID_SORT_BY = ['first_name', 'last_name', 'age', 'nationality'] as const;
const VALID_SORT_DIR = ['asc', 'desc'] as const;

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<Filters>(() => {
    const sortBy = searchParams.get('sortBy') ?? 'first_name';
    const sortDir = searchParams.get('sortDir') ?? 'asc';

    return {
      search: searchParams.get('search') ?? '',
      nationalities: searchParams.getAll('nationality'),
      hobbies: searchParams.getAll('hobby'),
      sortBy: (VALID_SORT_BY as readonly string[]).includes(sortBy)
        ? (sortBy as Filters['sortBy'])
        : 'first_name',
      sortDir: (VALID_SORT_DIR as readonly string[]).includes(sortDir)
        ? (sortDir as Filters['sortDir'])
        : 'asc',
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (updates: Partial<Filters>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (updates.search !== undefined) {
            if (updates.search) {
              next.set('search', updates.search);
            } else {
              next.delete('search');
            }
          }

          if (updates.nationalities !== undefined) {
            next.delete('nationality');
            for (const n of updates.nationalities) next.append('nationality', n);
          }

          if (updates.hobbies !== undefined) {
            next.delete('hobby');
            for (const h of updates.hobbies) next.append('hobby', h);
          }

          if (updates.sortBy !== undefined) next.set('sortBy', updates.sortBy);
          if (updates.sortDir !== undefined) next.set('sortDir', updates.sortDir);

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        // Keep sort settings
        if (prev.has('sortBy')) next.set('sortBy', prev.get('sortBy')!);
        if (prev.has('sortDir')) next.set('sortDir', prev.get('sortDir')!);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  const toggleNationality = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const current = prev.getAll('nationality');
          next.delete('nationality');
          const updated = current.includes(value)
            ? current.filter((n) => n !== value)
            : [...current, value];
          for (const n of updated) next.append('nationality', n);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const toggleHobby = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const current = prev.getAll('hobby');
          next.delete('hobby');
          const updated = current.includes(value)
            ? current.filter((h) => h !== value)
            : [...current, value];
          for (const h of updated) next.append('hobby', h);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const hasActiveFilters =
    filters.search !== '' ||
    filters.nationalities.length > 0 ||
    filters.hobbies.length > 0;

  return {
    filters,
    setFilters,
    clearAllFilters,
    toggleNationality,
    toggleHobby,
    hasActiveFilters,
  };
}
