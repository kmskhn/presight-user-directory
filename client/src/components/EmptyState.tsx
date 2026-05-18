interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasActiveFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <div className="empty-state__icon" aria-hidden="true">🔍</div>
      <h2 className="empty-state__title">No users found</h2>
      <p className="empty-state__body">
        {hasActiveFilters
          ? 'No users match the current filters. Try adjusting your search or removing some filters.'
          : 'The directory appears to be empty.'}
      </p>
      {hasActiveFilters && (
        <button className="btn btn--ghost" onClick={onClearFilters} id="clear-filters-btn">
          Clear all filters
        </button>
      )}
    </div>
  );
}
