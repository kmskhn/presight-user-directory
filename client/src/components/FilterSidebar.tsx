import { FacetSection } from './FacetSection.js';
import type { Facets, Filters } from '../types/index.js';

interface FilterSidebarProps {
  facets: Facets;
  filters: Filters;
  isLoading: boolean;
  onToggleNationality: (value: string) => void;
  onToggleHobby: (value: string) => void;
  onClearAll: () => void;
  onClearCategory: (category: 'nationality' | 'hobby') => void;
  hasActiveFilters: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function FilterSidebar({
  facets,
  filters,
  isLoading,
  onToggleNationality,
  onToggleHobby,
  onClearAll,
  onClearCategory,
  hasActiveFilters,
  isOpen,
  onClose,
}: FilterSidebarProps) {
  return (
    <aside className={`md:flex md:flex-col p-6 border-r border-border md:bg-bg/50 ${isOpen ? 'fixed inset-0 z-50 flex flex-col bg-bg border-t border-border mt-[60px] h-[calc(100dvh-60px)] overflow-y-auto' : 'hidden'}`} aria-label="Filter sidebar">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold tracking-wider uppercase text-text-muted m-0">Filters</p>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              id="sidebar-clear-btn"
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-transparent text-text-secondary border border-border rounded text-xs font-medium hover:bg-surface-raised hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2"
              onClick={onClearAll}
            >
              Clear all
            </button>
          )}
          <button 
            className="md:hidden inline-flex items-center justify-center w-7 h-7 bg-transparent text-text-secondary border border-border rounded text-base hover:bg-surface-raised hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2" 
            onClick={onClose}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>
      </div>

      <hr className="border-none h-[1px] bg-border my-6" />

      <FacetSection
        title="Nationality"
        items={facets.nationalities}
        selected={filters.nationalities}
        onToggle={onToggleNationality}
        onClear={() => onClearCategory('nationality')}
        isLoading={isLoading}
        idPrefix="nat"
      />
      <hr className="border-none h-[1px] bg-border my-6" />

      <FacetSection
        title="Hobby"
        items={facets.hobbies}
        selected={filters.hobbies}
        onToggle={onToggleHobby}
        onClear={() => onClearCategory('hobby')}
        isLoading={isLoading}
        idPrefix="hobby"
      />
    </aside>
  );
}
