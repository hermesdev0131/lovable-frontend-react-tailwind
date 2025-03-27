import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // If already authenticated, redirect to home
    if (user) {
      navigate('/');
      return;
    }
    
    // Otherwise redirect to the new auth page
    navigate('/auth');
  }, [user, navigate]);
  
  // Display loading screen while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default LoginPage;
