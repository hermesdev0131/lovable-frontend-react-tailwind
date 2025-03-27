
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMasterAccount?: boolean;
}

export const ProtectedRoute = ({ children, requireMasterAccount = false }: ProtectedRouteProps) => {
  const { currentClientId, isInMasterMode } = useMasterAccount();
  
  // User is authenticated if either in master mode or has a client ID selected
  const isAuthenticated = isInMasterMode || currentClientId !== null;
  
  // Check if master account is required for this route
  const hasMasterAccess = !requireMasterAccount || isInMasterMode;
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  if (!hasMasterAccess) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};
