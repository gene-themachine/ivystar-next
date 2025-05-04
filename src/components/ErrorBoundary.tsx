'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  // Add a method to retry loading the component
  retryLoad = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // Check if it's a chunk loading error
      const isChunkError = error?.message?.includes('ChunkLoadError') || 
                           error?.message?.includes('Loading chunk') ||
                           error?.message?.includes('Failed to fetch');
      
      // If custom fallback is provided, use it
      if (fallback) {
        return fallback;
      }

      // Otherwise, render a default error UI
      return (
        <div className="p-6 bg-gray-900 text-white rounded-lg border border-red-600">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          
          {isChunkError ? (
            <>
              <p className="mb-4">
                Failed to load a required component. This might be due to a temporary network issue.
              </p>
              <button 
                onClick={this.retryLoad}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry Loading
              </button>
            </>
          ) : (
            <p className="text-gray-300">
              An unexpected error occurred. Please try refreshing the page.
            </p>
          )}
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary; 