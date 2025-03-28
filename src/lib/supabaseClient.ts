
import { createClient } from '@supabase/supabase-js';
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials, AuthResponse, AuthTokenResponsePassword, AuthError } from '@supabase/supabase-js';

// Default values for development mode
const DEMO_SUPABASE_URL = 'https://demo.supabase.com';
const DEMO_SUPABASE_ANON_KEY = 'demo-anon-key';

// Get from environment variables or use demo values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEMO_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEMO_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Using demo mode:', !import.meta.env.VITE_SUPABASE_URL);

// Create a custom Supabase client with demo capabilities
const createDemoClient = () => {
  // This is a mock implementation for demo purposes
  const mockClient = createClient(supabaseUrl, supabaseAnonKey);
  
  // Override auth methods for demo mode if no real credentials
  if (!import.meta.env.VITE_SUPABASE_URL) {
    // Store for demo users
    const demoUsers = new Map();
    
    // Override auth object with demo implementations
    const originalAuth = mockClient.auth;
    mockClient.auth = {
      ...originalAuth,
      // Mock sign in
      signInWithPassword: async (credentials: SignInWithPasswordCredentials) => {
        // Type guard to check if email exists in credentials
        const email = 'email' in credentials ? credentials.email as string : '';
        const password = credentials.password;
        
        console.log('DEMO MODE: Sign in attempt for', email);
        
        // Very basic demo authentication
        if (email && demoUsers.has(email) && demoUsers.get(email).password === password) {
          const user = demoUsers.get(email);
          return {
            data: {
              user: {
                id: `demo_${Date.now()}`,
                email: email,
                user_metadata: { name: user.name || email.split('@')[0] }
              },
              session: { access_token: 'demo_token' }
            },
            error: null
          } as AuthTokenResponsePassword;
        }
        
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials' } as AuthError
        } as AuthTokenResponsePassword;
      },
      
      // Mock sign up
      signUp: async (credentials: SignUpWithPasswordCredentials) => {
        // Type guard to check if email exists in credentials
        const email = 'email' in credentials ? credentials.email as string : '';
        const password = credentials.password;
        
        console.log('DEMO MODE: Sign up for', email);
        
        if (!email) {
          return {
            data: { user: null, session: null },
            error: { message: 'Email is required' } as AuthError
          } as AuthResponse;
        }
        
        const metadata = credentials.options?.data as Record<string, unknown> | undefined;
        const name = metadata?.name as string | undefined;
        
        demoUsers.set(email, { 
          password: password,
          name: name || email.split('@')[0]
        });
        
        return {
          data: {
            user: {
              id: `demo_${Date.now()}`,
              email: email,
              user_metadata: { 
                name: name || email.split('@')[0] 
              }
            },
            session: null
          },
          error: null
        } as AuthResponse;
      },
      
      // Mock password reset request
      resetPasswordForEmail: async (email: string, options?: { redirectTo?: string }) => {
        console.log('DEMO MODE: Password reset requested for', email);
        // Generate a demo reset token
        const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
        const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
        console.log('Reset link:', resetLink);
        return { data: {}, error: null };
      },
      
      // Mock update user (for password reset)
      updateUser: async (attributes: { password?: string }) => {
        console.log('DEMO MODE: Password updated');
        return { data: { user: null }, error: null };
      },
      
      // Mock get session
      getSession: async () => {
        const storedSession = localStorage.getItem('supabase.auth.token');
        if (storedSession) {
          try {
            const session = JSON.parse(storedSession);
            return { data: { session }, error: null };
          } catch (e) {
            return { data: { session: null }, error: null };
          }
        }
        return { data: { session: null }, error: null };
      },
      
      // Other methods remain from the original auth object
      onAuthStateChange: originalAuth.onAuthStateChange,
      signOut: async () => {
        localStorage.removeItem('supabase.auth.token');
        return { error: null };
      }
    };
  }
  
  return mockClient;
};

export const supabase = createDemoClient();
