import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMasterAccount } from "@/contexts/MasterAccountContext";
import { useAuth } from '@/contexts/AuthContext';
import { useDeals } from '@/contexts/DealsContext';
import { useTasks } from '@/contexts/TasksContext';
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn } from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchClientsData, clientsLoaded } = useMasterAccount();
  const { fetchDealsData, dealsLoaded} = useDeals();
  const { fetchTasks,tasksLoaded} = useTasks();
  const { login, authState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to handle successful authentication state changes
  useEffect(() => {
    const handleSuccessfulLogin = async () => {
      if (authState.isAuthenticated) {
        // console.log("Auth state detected as authenticated");
        
        try {
          // Load all data in parallel with individual error handling
          // console.log("clientsLoaded", clientsLoaded);
          // console.log("dealsLoaded", dealsLoaded);
          // console.log("tasksLoaded", tasksLoaded);
          const results = await Promise.allSettled([
            !clientsLoaded && fetchClientsData(),
            !dealsLoaded && fetchDealsData(),
            !tasksLoaded && fetchTasks()
          ]);

          // Check for any failures
          const failures = results.filter(result => result.status === 'rejected');
          if (failures.length > 0) {
            console.error("Some data failed to load:", failures);
            toast({
              title: "Warning",
              description: "Some data failed to load. The application may not function correctly.",
              variant: "destructive"
            });
          } else {
            // console.log("All data loaded successfully");
          }
          
          // Navigate to dashboard regardless of data loading status
          navigate('/', { replace: true });
        } catch (error) {
          console.error("Error during data loading:", error);
          toast({
            title: "Error",
            description: "Failed to load application data. Please try refreshing the page.",
            variant: "destructive"
          });
        }
      }
    };
    
    handleSuccessfulLogin();
  }, [authState.isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      // console.error("Login failed:", error);
      // toast({
      //   title: "Login Failed",
      //   description: "Invalid email or password",
      //   variant: "destructive"
      // });
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md px-4">
      {/* Logo above the login form */}
      <div className="mb-8">
        <img 
          src="/lovable-uploads/56808916-d8ae-4d5a-8aa0-f0d671bc7717.png" 
          alt="Company Logo" 
          className="h-20 w-auto"
        />
      </div>
      
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-white">Login</CardTitle>
          <CardDescription className="text-zinc-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                autoFocus
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10 bg-zinc-800 border-zinc-700 text-white"
                />
                <button 
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  Logging in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

