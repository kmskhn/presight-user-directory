export function UserCardSkeleton() {
  return (
    <div className="grid grid-cols-[52px_1fr] gap-3.5 items-center p-4 mx-5 bg-surface/30 border border-border/30 rounded-xl animate-pulse" aria-hidden="true">
      <div className="w-[52px] h-[52px] rounded-full bg-border/40" />
      <div className="flex flex-col gap-2">
        <div className="h-3.5 bg-border/40 rounded-full w-3/5" />
        <div className="h-3 bg-border/40 rounded-full w-2/5" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-[18px] w-[60px] bg-border/40 rounded-full" />
          <div className="h-[18px] w-[50px] bg-border/40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div
      className="flex flex-col gap-2.5 py-3"
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
    <div className="flex flex-col gap-2 animate-pulse" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex items-center gap-2.5 py-1.5 px-2">
          <div className="w-4 h-4 rounded bg-border/40 shrink-0" />
          <div className="flex-1 h-3.5 bg-border/40 rounded-full" />
          <div className="w-7 h-3.5 bg-border/40 rounded-full" />
        </div>
      ))}
    </div>
  );
}
