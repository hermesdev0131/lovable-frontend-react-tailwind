import { createClient } from '@supabase/supabase-js';

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
      signInWithPassword: async ({ email, password }) => {
        console.log('DEMO MODE: Sign in attempt for', email);
        
        // Very basic demo authentication
        if (demoUsers.has(email) && demoUsers.get(email).password === password) {
          const user = demoUsers.get(email);
          return {
            data: {
              user: {
                id: `demo_${Date.now()}`,
                email,
                user_metadata: { name: user.name || email.split('@')[0] }
              },
              session: { access_token: 'demo_token' }
            },
            error: null
          };
        }
        
        return {
          data: { user: null, session: null },
          error: { message: 'Invalid login credentials' }
        };
      },
      
      // Mock sign up
      signUp: async ({ email, password, options }) => {
        console.log('DEMO MODE: Sign up for', email);
        demoUsers.set(email, { password, name: options?.data?.name });
        return {
          data: {
            user: {
              id: `demo_${Date.now()}`,
              email,
              user_metadata: { name: options?.data?.name || email.split('@')[0] }
            },
            session: null
          },
          error: null
        };
      },
      
      // Mock password reset request
      resetPasswordForEmail: async (email, options) => {
        console.log('DEMO MODE: Password reset requested for', email);
        // Generate a demo reset token
        const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
        const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
        console.log('Reset link:', resetLink);
        return { data: {}, error: null };
      },
      
      // Mock update user (for password reset)
      updateUser: async ({ password }) => {
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
