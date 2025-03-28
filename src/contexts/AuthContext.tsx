
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMasterAccount } from './MasterAccountContext';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
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
    const savedUser = localStorage.getItem('crm_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
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
        localStorage.setItem('crm_current_user', JSON.stringify(user));
      }
    }
  }, [currentClientId, clients]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = loginToAccount(email, password);
      
      if (success) {
        const client = clients.find(c => c.email === email);
        if (client) {
          const user: User = {
            id: client.id,
            email: client.email || '',
            name: client.name,
            role: 'admin',
          };
          setCurrentUser(user);
          localStorage.setItem('crm_current_user', JSON.stringify(user));
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
          action: <Button variant="ghost" size="sm" className="h-8 px-2"><X size={16} /></Button>
        });
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
        action: <Button variant="ghost" size="sm" className="h-8 px-2"><X size={16} /></Button>
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('crm_current_user');
  };

  // Demo method to simulate password reset request
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email) {
          // Generate and store reset token (in a real app, this would be sent by email)
          const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
          localStorage.setItem(`reset_token_${email}`, resetToken);
          
          // In a real app with a backend, an email would be sent here
          // For demo purposes, we'll create a reset link
          const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
          
          // Store the link so the ForgotPassword component can display it
          localStorage.setItem(`reset_link_${email}`, resetLink);
          
          console.log(`DEMO MODE: Password reset requested for ${email}`);
          console.log(`Reset link: ${resetLink}`);
        }
        resolve(true);
      }, 1000);
    });
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isValidToken = token.startsWith('reset_');
        
        if (isValidToken && newPassword.length >= 8) {
          localStorage.setItem('last_password_reset', new Date().toISOString());
          console.log(`Password reset successful with token: ${token}`);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
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
