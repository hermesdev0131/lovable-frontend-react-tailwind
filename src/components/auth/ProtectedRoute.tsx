
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentClientId, isInMasterMode } = useMasterAccount();
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while authentication is being checked
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  // Check if user is authenticated with Supabase
  const isSupabaseAuthenticated = !!user;
  
  // User can also be authenticated via the legacy master account system
  const isMasterAuthenticated = isInMasterMode || currentClientId !== null;
  
  // User is authenticated if either authenticated with Supabase or via master account
  const isAuthenticated = isSupabaseAuthenticated || isMasterAuthenticated;
  
  if (!isAuthenticated) {
    // Redirect to auth page with the current location as the redirect target
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};
