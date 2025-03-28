
import React, { useEffect } from 'react';
import { LoginForm } from "@/components/auth/LoginForm";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // If user is already authenticated, redirect to dashboard or the page they were trying to access
  useEffect(() => {
    if (currentUser) {
      // Get the intended destination or default to dashboard
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    }
  }, [currentUser, navigate, location]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;
