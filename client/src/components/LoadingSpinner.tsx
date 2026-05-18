interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  center?: boolean;
  message?: string;
}

export function LoadingSpinner({ size = 'md', label = 'Loading…', center = false, message }: LoadingSpinnerProps) {
  if (center) {
    return (
      <div className="spinner-center" role="status" aria-label={label}>
        <div className={`spinner spinner--${size}`} />
        {message && <span>{message}</span>}
      </div>
    );
  }

  return (
    <div
      className={`spinner spinner--${size}`}
      role="status"
      aria-label={label}
    />
  );
}

export function InlineLoadingRow({ message = 'Loading more…' }: { message?: string }) {
  return (
    <div className="spinner-inline-row" role="status" aria-label={message}>
      <LoadingSpinner size="sm" />
      <span>{message}</span>
    </div>
  );
}

export function ListOverlay() {
  return (
    <div className="list-overlay" role="status" aria-label="Updating results…">
      <LoadingSpinner size="lg" />
    </div>
  );
}
