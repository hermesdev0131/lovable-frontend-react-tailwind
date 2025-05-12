
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { authService } from './auth';

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // If the error is not 401 or the request has already been retried, reject
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          return api(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    try {
      // Try to refresh the token
      await authService.refreshAccessToken();
      const token = authService.getAccessToken();
      
      // Process the queue with the new token
      processQueue(null, token);
      
      // Update the Authorization header
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`;
      } else {
        originalRequest.headers = { Authorization: `Bearer ${token}` };
      }
      
      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      // If refresh fails, process the queue with the error
      processQueue(refreshError as AxiosError);
      
      // Redirect to login or show error message
      // This will be handled by the error handler in the component
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;