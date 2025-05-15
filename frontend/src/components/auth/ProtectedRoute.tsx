import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const ProtectedRoute = () => {
  const { authState } = useAuth();
  const location = useLocation();
  

  
  console.log("Don't put");
  if (!authState.isAuthenticated) {
    console.log("Don't come");
    const isRedirectFromLogin = location.state?.from?.pathname === '/login';
    // const isRedirectFromLogout = location.state?.from?.pathname === '/logout';
    console.log(location.state?.from?.pathname);
    if (location.pathname !== '/login' && location.pathname !== '/' && !isRedirectFromLogin) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive"
      });
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (authState.user && authState.user.role) {
    const { role } = authState.user;
    const adminOnlyPaths = ['/master-account'];
    const editorRestrictedPaths = ['/settings'];

    // if (role === 'admin') {
    //   return <Outlet />;
    // }

    if (role === 'viewer' && (adminOnlyPaths.includes(location.pathname))) {
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
  
  // If we reach here, the user is authenticated and has the right permissions
  return <Outlet />;
}
