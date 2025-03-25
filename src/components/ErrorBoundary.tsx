
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Redirect to the 404 page with error details
      return (
        <Navigate 
          to={{
            pathname: "/not-found",
            search: `?error=${encodeURIComponent(this.state.error?.message || 'Unknown error')}`
          }}
          replace 
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
