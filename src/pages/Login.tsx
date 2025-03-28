
import React, { useEffect } from 'react';
import { LoginForm } from "@/components/auth/LoginForm";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";

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

  // Check if there's an error message in the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorParam = searchParams.get('error');
    
    if (errorParam) {
      toast({
        title: "Login Error",
        description: decodeURIComponent(errorParam),
        variant: "destructive",
      });
    }
  }, [location.search]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;
