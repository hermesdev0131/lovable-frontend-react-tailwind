
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentClientId, isInMasterMode } = useMasterAccount();
  
  // If we're in master mode or have a client ID, the user is authenticated
  const isAuthenticated = isInMasterMode || currentClientId !== null;
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <>{children}</>;
};
