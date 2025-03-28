
import { toast } from "@/hooks/use-toast";

// Generic error handler for async operations
export const handleAsyncError = (error: unknown, fallbackMessage = "An unexpected error occurred"): void => {
  console.error("Error caught:", error);
  
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
};

// Type for different error severities
export type ErrorSeverity = "info" | "warning" | "error" | "critical";

// More detailed error handler with severity levels
export const logError = (
  error: unknown, 
  context: string, 
  severity: ErrorSeverity = "error",
  showToast = true
): void => {
  const timestamp = new Date().toISOString();
  const errorObj = error instanceof Error ? error : new Error(String(error));
  
  // Log to console with context
  console.group(`[${severity.toUpperCase()}] ${context} - ${timestamp}`);
  console.error(errorObj);
  console.trace();
  console.groupEnd();
  
  // Only show toast for user-facing errors
  if (showToast) {
    const toastVariant = severity === "info" ? "default" : 
                        severity === "warning" ? "warning" : "destructive";
    
    toast({
      title: context,
      description: errorObj.message,
      variant: toastVariant as any,
    });
  }
  
  // Here you could also implement additional error reporting logic:
  // - Send errors to a monitoring service like Sentry
  // - Log to a backend API
  // - Track in analytics
};

// Utility to wrap async functions with error handling
export function withErrorHandling<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  errorContext: string
) {
  return async (...args: Args): Promise<T | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, errorContext);
      return undefined;
    }
  };
}
