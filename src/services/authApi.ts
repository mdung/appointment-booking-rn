/**
 * Authentication API service
 */

import { apiClient } from './apiClient';
import { AuthResponse, LoginCredentials, RegisterData, UpdateProfileData, User } from '../models/User';

export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // TODO: Replace with actual API call when backend is ready
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse: AuthResponse = {
          user: {
            id: '1',
            name: credentials.email.split('@')[0],
            email: credentials.email,
            role: 'CUSTOMER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock_token_' + Date.now(),
        };
        resolve(mockResponse);
      }, 1000);
    });
    
    // Uncomment when backend is ready:
    // return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponse: AuthResponse = {
          user: {
            id: '1',
            name: data.name,
            email: data.email,
            role: data.role,
            phone: data.phone,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock_token_' + Date.now(),
        };
        resolve(mockResponse);
      }, 1000);
    });
    
    // return apiClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    // TODO: Call backend logout endpoint if needed
    // return apiClient.post('/auth/logout');
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CUSTOMER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
    
    // return apiClient.get<User>('/auth/me');
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: data.name || 'John Doe',
          email: 'john@example.com',
          role: 'CUSTOMER',
          phone: data.phone,
          avatarUrl: data.avatarUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
    
    // return apiClient.patch<User>('/auth/profile', data);
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Password reset email sent' });
      }, 500);
    });
    
    // return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: 'Password reset successful' });
      }, 500);
    });
    
    // return apiClient.post('/auth/reset-password', { token, newPassword });
  },
};

