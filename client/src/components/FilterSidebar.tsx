import { FacetSection } from './FacetSection.js';
import type { Facets, Filters } from '../types/index.js';

interface FilterSidebarProps {
  facets: Facets;
  filters: Filters;
  isLoading: boolean;
  onToggleNationality: (value: string) => void;
  onToggleHobby: (value: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export function FilterSidebar({
  facets,
  filters,
  isLoading,
  onToggleNationality,
  onToggleHobby,
  onClearAll,
  hasActiveFilters,
}: FilterSidebarProps) {
  return (
    <aside className="sidebar" aria-label="Filter sidebar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p className="sidebar__section-title" style={{ margin: 0 }}>Filters</p>
        {hasActiveFilters && (
          <button
            id="sidebar-clear-btn"
            className="btn btn--ghost"
            onClick={onClearAll}
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.72rem' }}
          >
            Clear all
          </button>
        )}
      </div>

      <hr className="sidebar__divider" />

      <FacetSection
        title="Nationality"
        items={facets.nationalities}
        selected={filters.nationalities}
        onToggle={onToggleNationality}
        isLoading={isLoading}
        idPrefix="nat"
      />

      <hr className="sidebar__divider" />

      <FacetSection
        title="Hobby"
        items={facets.hobbies}
        selected={filters.hobbies}
        onToggle={onToggleHobby}
        isLoading={isLoading}
        idPrefix="hobby"
      />
    </aside>
  );
}
