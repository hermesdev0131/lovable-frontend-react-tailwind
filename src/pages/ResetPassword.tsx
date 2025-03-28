
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { ArrowLeft, KeyRound, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  // Get token from URL
  const token = searchParams.get('token');
  
  // Check if token exists
  useEffect(() => {
    if (!token) {
      toast({
        title: "Invalid Request",
        description: "No reset token found. Please request a new password reset.",
        variant: "destructive"
      });
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a new password",
        variant: "destructive"
      });
      return;
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (token) {
        const success = await resetPassword(token, password);
      
        if (success) {
          setIsSuccess(true);
          toast({
            title: "Success",
            description: "Your password has been reset. You can now log in with your new password.",
          });
        } else {
          toast({
            title: "Failed",
            description: "Unable to reset password. The token may be invalid or expired.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center w-full max-w-md px-4">
        {/* Logo above the form */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/56808916-d8ae-4d5a-8aa0-f0d671bc7717.png" 
            alt="Company Logo" 
            className="h-20 w-auto"
          />
        </div>
        
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-white">Reset Password</CardTitle>
            <CardDescription className="text-zinc-400">
              {isSuccess 
                ? "Your password has been reset successfully" 
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="space-y-4">
              <div className="p-4 rounded-md bg-zinc-800 text-center">
                <div className="flex justify-center mb-2">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <Check className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-zinc-300">
                  Password reset successful!
                </p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-300">New Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    autoFocus
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Resetting Password...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Reset Password
                    </span>
                  )}
                </Button>
              </CardFooter>
            </form>
          )}
          
          <div className="p-6 pt-0">
            <Link 
              to="/login" 
              className="flex items-center justify-center text-sm text-primary hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
