
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, X, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState('');
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
        
        // For demo purposes, retrieve and display the reset link that would normally be sent via email
        const storedResetLink = localStorage.getItem(`reset_link_${email}`);
        if (storedResetLink) {
          setResetLink(storedResetLink);
        }
        
        toast({
          title: "Reset Link Generated",
          description: "In a real application, a password reset link would be sent to your email.",
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
                ? "Demo Mode: Use the reset link below" 
                : "Enter your email to receive password reset instructions"}
            </CardDescription>
          </CardHeader>
          
          {isSubmitted ? (
            <CardContent className="space-y-4">
              <div className="p-4 rounded-md bg-zinc-800">
                <p className="text-zinc-300 mb-2 text-center">
                  We've generated a reset link for:
                </p>
                <p className="font-medium text-white text-center mb-4">{email}</p>
                
                <div className="bg-zinc-700 p-3 rounded-md mb-4 border border-zinc-600">
                  <p className="text-sm text-zinc-300 mb-2 font-medium">Demo Mode: Password Reset Link</p>
                  <div className="flex items-center">
                    <a 
                      href={resetLink} 
                      className="text-primary text-sm break-all hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {resetLink}
                    </a>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <a 
                    href={resetLink} 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Open Reset Link
                  </a>
                </div>
              </div>
              
              <div className="text-sm text-zinc-400 bg-zinc-800/50 p-3 rounded-md border border-zinc-700">
                <h4 className="font-medium mb-1 text-zinc-300">About This Demo</h4>
                <p className="mb-2">
                  This is a frontend demo without a real email service. In a production app:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The reset link would be emailed to you</li>
                  <li>The token would expire after a short time</li>
                  <li>The process would be handled securely on a backend</li>
                </ul>
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
                      Generating Reset Link...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Generate Reset Link
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
