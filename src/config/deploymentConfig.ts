
/**
 * This file contains configuration settings for different environments.
 * You can set different values for development and production.
 */

interface EnvironmentConfig {
  apiUrl: string;
  appName: string;
  isProduction: boolean;
  analyticsEnabled: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

// Determine the current environment
const isProduction = import.meta.env.PROD;

// Development configuration (local development)
const developmentConfig: EnvironmentConfig = {
  apiUrl: 'http://localhost:8000',
  appName: 'CRM System (Development)',
  isProduction: false,
  analyticsEnabled: false,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

// Production configuration
const productionConfig: EnvironmentConfig = {
  apiUrl: 'https://api.yourproductionapi.com', // Change this to your actual production API URL
  appName: 'CRM System',
  isProduction: true,
  analyticsEnabled: true,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
};

// Export the appropriate config based on the environment
export const config: EnvironmentConfig = isProduction ? productionConfig : developmentConfig;

// Export useful environment checks
export const IS_PRODUCTION = config.isProduction;
export const ANALYTICS_ENABLED = config.analyticsEnabled;
export const SUPABASE_URL = config.supabaseUrl;
export const SUPABASE_ANON_KEY = config.supabaseAnonKey;
