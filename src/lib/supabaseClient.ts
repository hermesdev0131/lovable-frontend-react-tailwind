
import { createClient } from '@supabase/supabase-js';
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials, AuthResponse, AuthTokenResponsePassword, AuthError, SupabaseClient } from '@supabase/supabase-js';

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
  // Create the original client
  const client = createClient(supabaseUrl, supabaseAnonKey);
  
  // Override auth methods for demo mode if no real credentials
  if (!import.meta.env.VITE_SUPABASE_URL) {
    // Store for demo users
    const demoUsers = new Map();
    
    // Save the original auth methods we want to override
    const originalSignInWithPassword = client.auth.signInWithPassword.bind(client.auth);
    const originalSignUp = client.auth.signUp.bind(client.auth);
    const originalResetPasswordForEmail = client.auth.resetPasswordForEmail.bind(client.auth);
    const originalUpdateUser = client.auth.updateUser.bind(client.auth);
    
    // Override signInWithPassword
    client.auth.signInWithPassword = async (credentials: SignInWithPasswordCredentials) => {
      console.log('DEMO MODE: Sign in attempt');
      
      // Type guard to check if email exists in credentials
      const hasEmail = 'email' in credentials;
      const email = hasEmail ? credentials.email as string : '';
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
      
      // Fall back to original method if we're not handling this specific case
      // or return error response for demo
      return {
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' } as AuthError
      } as AuthTokenResponsePassword;
    };
    
    // Override signUp
    client.auth.signUp = async (credentials: SignUpWithPasswordCredentials) => {
      console.log('DEMO MODE: Sign up attempt');
      
      // Type guard to check if email exists in credentials
      const hasEmail = 'email' in credentials;
      const email = hasEmail ? credentials.email as string : '';
      const password = credentials.password;
      
      console.log('DEMO MODE: Sign up for', email);
      
      if (!email) {
        return {
          data: { user: null, session: null },
          error: { message: 'Email is required' } as AuthError
        } as AuthResponse;
      }
      
      const options = credentials.options || {};
      const metadata = options.data as Record<string, unknown> | undefined;
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
    };
    
    // Override resetPasswordForEmail
    client.auth.resetPasswordForEmail = async (email: string, options?: { redirectTo?: string }) => {
      console.log('DEMO MODE: Password reset requested for', email);
      // Generate a demo reset token
      const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;
      const resetLink = `${window.location.origin}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
      console.log('Reset link:', resetLink);
      return { data: {}, error: null };
    };
    
    // Override updateUser
    client.auth.updateUser = async (attributes: { password?: string }) => {
      console.log('DEMO MODE: Password updated');
      return { data: { user: null }, error: null };
    };
  }
  
  return client;
};

export const supabase = createDemoClient();
