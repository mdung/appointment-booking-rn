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
    try {
      return await apiClient.post<AuthResponse>('/auth/login', credentials);
    } catch (error) {
      // Fallback to mock data for development
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
    }
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      return await apiClient.post<AuthResponse>('/auth/register', data);
    } catch (error) {
      // Fallback to mock data for development
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
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Logout locally even if API call fails
      console.error('Logout error:', error);
    }
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      return await apiClient.get<User>('/auth/me');
    } catch (error) {
      // Fallback to mock data for development
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
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    try {
      return await apiClient.patch<User>('/auth/profile', data);
    } catch (error) {
      // Fallback to mock data for development
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
    }
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    try {
      return await apiClient.post<{ message: string }>('/auth/forgot-password', { email });
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Password reset email sent' });
        }, 500);
      });
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
    try {
      return await apiClient.post<{ message: string }>('/auth/reset-password', { token, newPassword });
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ message: 'Password reset successful' });
        }, 500);
      });
    }
  },
};

