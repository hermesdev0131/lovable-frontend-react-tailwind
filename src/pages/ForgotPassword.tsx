
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [demoResetLink, setDemoResetLink] = useState<string | null>(null);
  const { requestPasswordReset } = useAuth();

  // Listen for demo console logs to extract reset link
  useEffect(() => {
    if (import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL) {
      const originalConsoleLog = console.log;
      console.log = function(...args) {
        originalConsoleLog.apply(console, args);
        
        // Look for reset link in console logs
        if (args.length >= 2 && args[0] === 'Reset link:' && typeof args[1] === 'string') {
          setDemoResetLink(args[1]);
        }
      };
      
      return () => {
        console.log = originalConsoleLog;
      };
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Requesting password reset for:', email);
      const success = await requestPasswordReset(email);
      
      if (success) {
        setIsSubmitted(true);
        
        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for a link to reset your password",
        });
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
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
              {isSubmitted 
                ? "Password reset email sent" 
                : "Enter your email to receive password reset instructions"}
            </CardDescription>
          </CardHeader>
          
          {isSubmitted ? (
            <CardContent className="space-y-4">
              <div className="p-4 rounded-md bg-zinc-800">
                <p className="text-zinc-300 mb-2 text-center">
                  We've sent a password reset link to:
                </p>
                <p className="font-medium text-white text-center mb-4">{email}</p>
                
                <div className="bg-zinc-700 p-3 rounded-md mb-4 border border-zinc-600">
                  <p className="text-sm text-zinc-300 mb-2">
                    Check your email inbox for the password reset link. If you don't see it, check your spam folder.
                  </p>
                </div>
                
                {/* Show demo reset link if available */}
                {demoResetLink && (
                  <div className="mt-4 p-3 rounded-md bg-blue-900/30 border border-blue-800">
                    <p className="text-sm text-blue-200 font-medium mb-2">DEMO MODE</p>
                    <p className="text-sm text-zinc-300 mb-3">
                      Since this is a demo, click the link below to reset your password:
                    </p>
                    <a 
                      href={demoResetLink}
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                    >
                      <ExternalLink size={16} />
                      Open Reset Link
                    </a>
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="w-full"
              >
                Back to Reset Form
              </Button>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    autoFocus
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                      Sending Reset Email...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Send Reset Email
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

export default ForgotPassword;
