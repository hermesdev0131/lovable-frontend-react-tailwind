
import React, { useEffect } from 'react';
import { LoginForm } from "@/components/auth/LoginForm";
import { useLocation, useNavigate } from 'react-router-dom';
import { useMasterAccount } from '@/contexts/MasterAccountContext';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isInMasterMode, currentClientId } = useMasterAccount();
  
  // If user is already authenticated, redirect to home or the page they were trying to access
  useEffect(() => {
    const isAuthenticated = isInMasterMode || currentClientId !== null;
    
    if (isAuthenticated) {
      // Get the intended destination or default to home page
      const destination = location.state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    }
  }, [isInMasterMode, currentClientId, navigate, location]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;
