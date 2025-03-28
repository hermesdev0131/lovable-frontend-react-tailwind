import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMasterAccount } from './MasterAccountContext';
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabaseClient';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { loginToAccount, currentClientId, clients } = useMasterAccount();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const { user } = data.session;
          if (user) {
            const userRole = ((user.user_metadata?.role as string) || 'user') as 'admin' | 'user';
            const profileData = { 
              name: user.user_metadata?.name, 
              role: userRole
            };

            const authUser: User = {
              id: user.id,
              email: user.email || '',
              name: profileData?.name || user.email?.split('@')[0] || 'User',
              role: profileData?.role || 'user',
            };
            
            setCurrentUser(authUser);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const user = session.user;
          
          const userRole = ((user.user_metadata?.role as string) || 'user') as 'admin' | 'user';
          const profileData = { 
            name: user.user_metadata?.name, 
            role: userRole
          };
          
          const authUser: User = {
            id: user.id,
            email: user.email || '',
            name: profileData?.name || user.email?.split('@')[0] || 'User',
            role: profileData?.role || 'user',
          };
          
          setCurrentUser(authUser);
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (currentClientId) {
      const client = clients.find(c => c.id === currentClientId);
      if (client && client.email) {
        const user: User = {
          id: client.id,
          email: client.email,
          name: client.name,
          role: 'admin',
        };
        setCurrentUser(user);
      }
    }
  }, [currentClientId, clients]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log('Supabase login failed, trying master account login');
        
        const success = loginToAccount(email, password);
        
        if (success) {
          console.log('Master account login successful');
          const client = clients.find(c => c.email === email);
          if (client) {
            const user: User = {
              id: client.id,
              email: client.email || '',
              name: client.name,
              role: 'admin',
            };
            setCurrentUser(user);
            return true;
          }
        }
        return false;
      }
      
      if (data.user) {
        console.log('Supabase login successful');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "An error occurred during logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset request error:', error);
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for a link to reset your password.",
      });
      
      return true;
    } catch (error) {
      console.error('Password reset request error:', error);
      toast({
        title: "Password Reset Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        toast({
          title: "Password Reset Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated. You can now log in with your new password.",
      });
      
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Password Reset Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isLoading, 
      requestPasswordReset, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
