
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full p-6 rounded-lg border border-border bg-card shadow-sm">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-4">
          An error occurred in the application. Please try refreshing the page.
        </p>
        
        <div className="mb-6 p-4 bg-destructive/10 rounded-md text-left">
          <p className="font-medium mb-2">Error details:</p>
          <pre className="text-xs overflow-auto whitespace-pre-wrap mb-4">
            {error.message}
          </pre>
          {error.stack && (
            <>
              <p className="font-medium mb-2">Stack trace:</p>
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {error.stack}
              </pre>
            </>
          )}
        </div>
        
        <div className="flex gap-4">
          <Button 
            variant="default" 
            onClick={resetErrorBoundary}
          >
            Try Again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"}
          >
            Go to Homepage
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ErrorBoundary: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
