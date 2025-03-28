import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
        action: <Button variant="ghost" size="sm" className="h-8 px-2"><X size={16} /></Button>
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await requestPasswordReset(email);
      
      if (success) {
        setIsSubmitted(true);
        
        // For demo purposes, generate a reset link that the user can click
        // In a real app, this link would be sent to the user's email
        const resetToken = localStorage.getItem(`reset_token_${email}`);
        
        // Create a demo reset link
        if (resetToken) {
          console.log(`DEMO: Reset link: ${window.location.origin}/reset-password?token=${resetToken}`);
        }
        
        toast({
          title: "Request Sent",
          description: "If this email is associated with an account, you'll receive password reset instructions shortly.",
          action: <Button variant="ghost" size="sm" className="h-8 px-2"><X size={16} /></Button>
        });
      }
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        action: <Button variant="ghost" size="sm" className="h-8 px-2"><X size={16} /></Button>
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
                ? "Check your email for reset instructions" 
                : "Enter your email to receive password reset instructions"}
            </CardDescription>
          </CardHeader>
          
          {isSubmitted ? (
            <CardContent className="space-y-4">
              <div className="p-4 rounded-md bg-zinc-800 text-center">
                <p className="text-zinc-300 mb-2">
                  We've sent reset instructions to:
                </p>
                <p className="font-medium text-white">{email}</p>
              </div>
              
              <div className="text-sm text-zinc-400">
                <p>Didn't receive an email? Check your spam folder or try again.</p>
                <p className="mt-2">
                  <strong>For demo purposes only:</strong> Check the browser console for a reset link you can use.
                </p>
              </div>
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
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Send Reset Instructions
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
