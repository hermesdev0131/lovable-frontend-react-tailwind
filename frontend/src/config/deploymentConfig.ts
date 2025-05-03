/**
 * This file contains configuration settings for different environments.
 * You can set different values for development and production.
 */

export interface DeploymentConfig {
  // Add other configuration properties as needed
}

// Determine the current environment
const isProduction = import.meta.env.PROD;

// Get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  const value = import.meta.env[key];
  return value !== undefined ? String(value) : fallback;
};

// Development configuration (local development)
const developmentConfig: DeploymentConfig = {
  apiUrl: 'http://localhost:8000',
  appName: 'CRM System (Development)',
  isProduction: false,
  analyticsEnabled: false,
};

// Production configuration
const productionConfig: DeploymentConfig = {
  apiUrl: 'https://api.yourproductionapi.com', // Change this to your actual production API URL
  appName: 'CRM System',
  isProduction: true,
  analyticsEnabled: true,
};

// Export the appropriate config based on the environment
export const config: DeploymentConfig = isProduction ? productionConfig : developmentConfig;

// Export useful environment checks
export const IS_PRODUCTION = config.isProduction;
export const ANALYTICS_ENABLED = config.analyticsEnabled;
