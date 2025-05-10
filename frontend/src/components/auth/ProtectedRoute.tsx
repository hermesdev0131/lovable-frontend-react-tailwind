import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const ProtectedRoute = () => {
  const { authState } = useAuth();
  const location = useLocation();
  
  // Allow access to dashboard (Index page) without authentication
  if (location.pathname === '/' && !authState.isAuthenticated) {
    return <Outlet />;
  }
  
  // For all other protected routes, redirect to login if not authenticated
  if (!authState.isAuthenticated) {

    // Check if the user is being redirected from a failed login attempt
    const isRedirectFromLogin = location.state?.from?.pathname === '/login';

    // Show toast notification for unauthorized access attempts
    if (location.pathname !== '/login' && !isRedirectFromLogin) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page 404.",
        variant: "destructive"
      });
    }
    
    // Redirect to login with the intended destination in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check user role for access control if authenticated
  if (authState.user && authState.user.role) {
    const { role } = authState.user;
    
    // Implement role-based access control
    // For example, restrict certain paths to admin only
    const adminOnlyPaths = ['/master-account', '/settings'];
    const editorRestrictedPaths = ['/settings'];
    
    if (role === 'viewer' && (adminOnlyPaths.includes(location.pathname) || editorRestrictedPaths.includes(location.pathname))) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive"
      });
      return <Navigate to="/" replace />;
    }
    
    if (role === 'editor' && adminOnlyPaths.includes(location.pathname)) {
      toast({
        title: "Access Denied",
        description: "Admin access required for this page",
        variant: "destructive"
      });
      return <Navigate to="/" replace />;
    }
  }
  
  return <Outlet />;
}