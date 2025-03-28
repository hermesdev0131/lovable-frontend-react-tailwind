
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireMasterAccount?: boolean;
}

export const ProtectedRoute = ({ children, requireMasterAccount = false }: ProtectedRouteProps) => {
  const { currentClientId, isInMasterMode } = useMasterAccount();
  const location = useLocation();
  
  // User is authenticated if either in master mode or has a client ID selected
  const isAuthenticated = isInMasterMode || currentClientId !== null;
  
  // Check if master account is required for this route
  const hasMasterAccess = !requireMasterAccount || isInMasterMode;
  
  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    // Show toast only if not already on login page
    if (location.pathname !== '/login') {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
    }
    
    // Redirect to login page with the intended destination in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If user does not have master access for a master-only route
  if (!hasMasterAccess) {
    toast({
      title: "Access Denied",
      description: "You need master account privileges to access this page",
      variant: "destructive"
    });
    return <Navigate to="/dashboard" replace />;
  }
  
  // If children are provided, render them, otherwise use Outlet for nested routes
  return <>{children || <Outlet />}</>;
};
