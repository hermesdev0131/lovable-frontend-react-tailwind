
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
    // For this demo, we'll simulate a successful request that generates
    // a "token" that would normally be sent via email
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store the reset token in localStorage to simulate our "database"
        // In a real implementation, this token would be generated on the server
        // and sent to the user's email
        if (email) {
          const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
          localStorage.setItem(`reset_token_${email}`, resetToken);
          console.log(`Reset token for ${email}: ${resetToken}`);
        }
        resolve(true);
      }, 1000);
    });
  };

  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    // In a real implementation, this would verify the token and update the password
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate token validation and password update
        // In a real app, this would verify the token against the database
        // and update the user's password if valid
        
        // For demo purposes, we'll consider any token that starts with "reset_" as valid
        const isValidToken = token.startsWith('reset_');
        
        if (isValidToken && newPassword.length >= 8) {
          // Simulate password update in our "database"
          // In a real app, you would update the password in your database
          localStorage.setItem('last_password_reset', new Date().toISOString());
          console.log(`Password reset successful with token: ${token}`);
          
          // Here you would invalidate the used token in a real application
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
