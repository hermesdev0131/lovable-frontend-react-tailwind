
import React, { useEffect } from 'react';
import { LoginForm } from "@/components/auth/LoginForm";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // If user is already authenticated, redirect to dashboard or the page they were trying to access
  useEffect(() => {
    if (currentUser) {
      console.log('Login page: User already authenticated, redirecting');
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
      console.log('Login page: Error parameter found in URL:', errorParam);
      toast({
        title: "Login Error",
        description: decodeURIComponent(errorParam),
        variant: "destructive",
        action: (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toast.dismiss()}
            className="h-8 px-2"
          >
            <X size={16} />
          </Button>
        ),
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
