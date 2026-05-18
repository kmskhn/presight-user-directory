interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasActiveFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 flex-1 min-h-[300px] text-text-muted text-center p-8" role="status" aria-live="polite">
      <div className="text-4xl opacity-50" aria-hidden="true">🔍</div>
      <h2 className="text-base font-semibold text-text-secondary m-0">No users found</h2>
      <p className="text-sm m-0 max-w-[280px] leading-relaxed">
        {hasActiveFilters
          ? 'No users match the current filters. Try adjusting your search or removing some filters.'
          : 'The directory appears to be empty.'}
      </p>
      {hasActiveFilters && (
        <button 
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-transparent text-text-secondary border border-border rounded-md text-sm font-medium hover:bg-surface-raised hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2" 
          onClick={onClearFilters} 
          id="clear-filters-btn"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
