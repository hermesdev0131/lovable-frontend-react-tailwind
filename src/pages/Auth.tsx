
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);
    
    if (!error) {
      navigate('/');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      return; // Error message is handled in UI
    }
    
    setIsSubmitting(true);
    const { error } = await signUp(email, password);
    setIsSubmitting(false);
    
    if (!error) {
      setActiveTab('login');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-muted/50 relative">
      {/* Theme toggle in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      {/* Logo section */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <LogIn className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Avai CRM</h1>
        <p className="text-muted-foreground mt-1">Marketing agency management platform</p>
      </div>
      
      <Tabs 
        defaultValue="login" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full max-w-md space-y-6"
      >
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignIn}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-muted"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="login-password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2 border-muted pr-10"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Default master account: dej@avai.vip / FilthyRich2025!\
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full group relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  <span className="absolute inset-0 w-3 bg-primary-foreground/10 skew-x-[20deg] group-hover:animate-[slide_1s_ease-in-out_infinite_alternate] hidden md:block"></span>
                  <LogIn className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="register">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Register to access all features
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignUp}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-muted"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="register-password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-2 border-muted pr-10"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`border-2 ${password && confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-muted'}`}
                    required
                  />
                  {password && confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-primary/90 hover:bg-primary"
                  disabled={isSubmitting || (password !== confirmPassword && !!confirmPassword)}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Registering..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Footer with animated gradient bar */}
      <div className="mt-8 text-center">
        <div className="h-1 w-60 bg-gradient-to-r from-primary/20 via-primary to-primary/20 rounded-full mb-4"></div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Avai. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
