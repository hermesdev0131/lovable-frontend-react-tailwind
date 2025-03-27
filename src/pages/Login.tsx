
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useTheme } from "@/components/theme/ThemeProvider";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loginToAccount } = useMasterAccount();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginToAccount(email, password)) {
      navigate('/');
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
      
      <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="dej@avai.vip"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-muted pr-10"
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
            <Button type="submit" className="w-full group relative overflow-hidden">
              <span className="absolute inset-0 w-3 bg-primary-foreground/10 skew-x-[20deg] group-hover:animate-[slide_1s_ease-in-out_infinite_alternate] hidden md:block"></span>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
      
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

export default LoginPage;
