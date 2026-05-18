interface ErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <div style={{ fontSize: '2rem' }} aria-hidden="true">⚠️</div>
      <h2 className="error-state__title">Something went wrong</h2>
      <p className="error-state__body">{error.message}</p>
      {onRetry && (
        <button className="btn btn--ghost" onClick={onRetry} id="retry-btn">
          Try again
        </button>
      )}
    </div>
  );
}
