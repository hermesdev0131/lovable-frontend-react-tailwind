
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { currentClientId, isInMasterMode } = useMasterAccount();
  
  // User is authenticated if either in master mode or has a client ID selected
  const isAuthenticated = isInMasterMode || currentClientId !== null;
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <>{children}</>;
};
