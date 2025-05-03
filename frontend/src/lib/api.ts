
import { handleAsyncError, logError } from "./errorHandling";

interface FetchOptions extends RequestInit {
  errorMessage?: string;
  silent?: boolean;
}

export async function fetchWithErrorHandling<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T | null> {
  const { errorMessage = "Failed to fetch data", silent = false, ...fetchOptions } = options;
  
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      // Handle HTTP error responses
      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || `${errorMessage} (${response.status})`;
      throw new Error(message);
    }
    
    return await response.json() as T;
  } catch (error) {
    if (!silent) {
      logError(error, errorMessage);
    }
    return null;
  }
}

// Helper for GET requests
export const getJSON = <T>(url: string, options: FetchOptions = {}): Promise<T | null> => {
  return fetchWithErrorHandling<T>(url, {
    method: 'GET',
    ...options,
  });
};

// Helper for POST requests
export const postJSON = <T>(url: string, data: any, options: FetchOptions = {}): Promise<T | null> => {
  return fetchWithErrorHandling<T>(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
};

// Helper for PUT requests
export const putJSON = <T>(url: string, data: any, options: FetchOptions = {}): Promise<T | null> => {
  return fetchWithErrorHandling<T>(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(data),
    ...options,
  });
};

// Helper for DELETE requests
export const deleteJSON = <T>(url: string, options: FetchOptions = {}): Promise<T | null> => {
  return fetchWithErrorHandling<T>(url, {
    method: 'DELETE',
    ...options,
  });
};
