
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background/95">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-xl text-center">Something went wrong</CardTitle>
          <CardDescription className="text-center">
            We're sorry, but we encountered an unexpected error.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded bg-muted overflow-auto max-h-[200px]">
            <p className="font-mono text-sm text-red-600 whitespace-pre-wrap break-words">
              {error.message || 'Unknown error'}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto" 
            onClick={() => window.location.href = '/'}
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button 
            className="w-full sm:w-auto" 
            onClick={resetErrorBoundary}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorFallback;
