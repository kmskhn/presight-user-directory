export function UserCardSkeleton() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-avatar" />
      <div className="skeleton-lines">
        <div className="skeleton" style={{ height: 14, width: '60%' }} />
        <div className="skeleton" style={{ height: 12, width: '40%' }} />
        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
          <div className="skeleton" style={{ height: 18, width: 60, borderRadius: 999 }} />
          <div className="skeleton" style={{ height: 18, width: 50, borderRadius: 999 }} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.75rem 0' }}
      aria-busy="true"
      aria-label="Loading users"
    >
      {Array.from({ length: count }, (_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FacetSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.5rem' }}>
          <div className="skeleton" style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0 }} />
          <div className="skeleton skeleton-facet" style={{ flex: 1 }} />
          <div className="skeleton skeleton-facet" style={{ width: 28, borderRadius: 999 }} />
        </div>
      ))}
    </div>
  );
}
