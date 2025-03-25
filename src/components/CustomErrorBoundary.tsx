
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from './ui/button';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-background">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg border border-border">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
        <div className="text-muted-foreground mb-4">
          <p className="mb-2">An error occurred in the application.</p>
          <pre className="bg-muted p-4 rounded text-sm mb-4 overflow-auto max-h-[200px]">
            {error.message}
          </pre>
        </div>
        <Button onClick={resetErrorBoundary} variant="default">
          Try again
        </Button>
      </div>
    </div>
  );
}

const CustomErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};

export default CustomErrorBoundary;
