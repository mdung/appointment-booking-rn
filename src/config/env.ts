/**
 * Environment configuration
 * Centralized API base URL and environment flags
 * TODO: Use environment variables for different environments (dev, staging, prod)
 */

export const env = {
  // API Configuration
  apiBaseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  
  // Environment flags
  isDevelopment: __DEV__,
  isProduction: !__DEV__,
  
  // Feature flags (can be toggled here)
  features: {
    enableAnalytics: false,
    enablePushNotifications: false,
    enableLocalization: true,
  },
  
  // API Timeout
  apiTimeout: 30000, // 30 seconds
};

/**
 * Update this when backend is ready
 * Example:
 * - Development: 'http://localhost:3000/api'
 * - Staging: 'https://staging-api.yourapp.com/api'
 * - Production: 'https://api.yourapp.com/api'
 */

