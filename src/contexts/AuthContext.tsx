
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMasterAccount } from './MasterAccountContext';

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

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('crm_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Update currentUser when client changes
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
      // Use the MasterAccountContext loginToAccount function
      const success = loginToAccount(email, password);
      
      if (success) {
        // Find the client with matching email
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
      }
      
      return success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('crm_current_user');
  };

  // Password reset functionality
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    // In a real implementation, this would send a request to a server
    // For now, we'll just simulate success
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    // In a real implementation, this would verify the token and update the password
    // For now, we'll just simulate success
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
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
