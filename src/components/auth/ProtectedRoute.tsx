
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMasterAccount?: boolean;
}

export const ProtectedRoute = ({ children, requireMasterAccount = false }: ProtectedRouteProps) => {
  const { currentClientId, isInMasterMode } = useMasterAccount();
  const location = useLocation();
  const navigate = useNavigate();
  
  // User is authenticated if either in master mode or has a client ID selected
  const isAuthenticated = isInMasterMode || currentClientId !== null;
  
  // Check if master account is required for this route
  const hasMasterAccess = !requireMasterAccount || isInMasterMode;
  
  useEffect(() => {
    // If user attempts to access a protected route without authentication, show a toast
    if (!isAuthenticated && location.pathname !== '/login') {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive"
      });
      
      // Force navigation to login page
      navigate('/login', { replace: true, state: { from: location } });
    }
    
    // If user attempts to access a master-only route without proper permissions
    if (isAuthenticated && requireMasterAccount && !isInMasterMode) {
      toast({
        title: "Access Denied",
        description: "You need master account privileges to access this page",
        variant: "destructive"
      });
    }
  }, [isAuthenticated, location.pathname, requireMasterAccount, isInMasterMode, navigate, location]);
  
  if (!isAuthenticated) {
    // Redirect to login page with the intended destination in state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!hasMasterAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};
