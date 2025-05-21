
import { useState, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import { logError } from "@/lib/errorHandling";

interface UseFormErrorProps {
  formId?: string;
  logErrors?: boolean;
}

export function useFormError({ formId = "form", logErrors = true }: UseFormErrorProps = {}) {
  const [formError, setFormError] = useState<string | null>(null);
  
  const clearError = useCallback(() => {
    setFormError(null);
  }, []);
  
  const handleError = useCallback((error: unknown, context = "Form submission failed") => {
    let errorMessage = "An unexpected error occurred";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    setFormError(errorMessage);
    
    if (logErrors) {
      logError(error, context);
    } else {
      // Just show toast without detailed logging
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    // Focus the first invalid input if available
    setTimeout(() => {
      const form = document.getElementById(formId);
      if (form) {
        const firstInvalid = form.querySelector(':invalid') as HTMLElement;
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    }, 100);
    
    return errorMessage;
  }, [formId, logErrors]);
  
  return {
    formError,
    setFormError,
    clearError,
    handleError,
  };
}
