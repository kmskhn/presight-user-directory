import { FileQuestion } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[calc(100vh-60px)] p-8 text-center bg-bg">
      <FileQuestion size={64} className="text-text-muted mb-6" />
      <h1 className="mb-2 text-text-primary text-3xl font-bold">404: Page Not Found</h1>
      <p className="text-text-secondary mb-8 leading-relaxed max-w-[400px]">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <a 
        href="/" 
        className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2 no-underline"
      >
        Return Home
      </a>
    </div>
  );
}
