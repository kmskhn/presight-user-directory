import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-bg">
          <AlertTriangle size={64} className="text-accent mb-6" />
          <h1 className="mb-2 text-text-primary text-3xl font-bold">500: System Error</h1>
          <p className="text-text-secondary mb-8 max-w-[400px] leading-relaxed">
            We're sorry, but something went unexpectedly wrong in the application. Please try refreshing the page.
          </p>
          <button 
            className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-hover transition-colors focus-visible:outline-2 focus-visible:outline-accent outline-offset-2"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
