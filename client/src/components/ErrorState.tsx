interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 flex-1 min-h-[300px] text-center p-8" role="alert" aria-live="assertive">
      <div className="text-3xl" aria-hidden="true">⚠️</div>
      <h2 className="text-[0.95rem] font-semibold text-error m-0">Something went wrong</h2>
      <p className="text-sm text-text-muted m-0">{error.message}</p>
      {onRetry && (
        <button 
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 mt-2 bg-transparent text-text-secondary border border-border rounded-md text-sm font-medium hover:bg-surface-raised hover:text-text-primary transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2" 
          onClick={onRetry} 
          id="retry-btn"
        >
          Try again
        </button>
      )}
    </div>
  );
}
