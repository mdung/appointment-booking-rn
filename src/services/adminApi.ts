/**
 * Admin API service
 */

import { apiClient } from './apiClient';
import { providerApi } from './providerApi';
import { bookingApi } from './bookingApi';
import { User } from '../models/User';
import { Provider } from '../models/Provider';
import { Booking } from '../models/Booking';

export const adminApi = {
  /**
   * Get all users
   */
  getUsers: async (): Promise<User[]> => {
    try {
      return await apiClient.get<User[]>('/admin/users');
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              role: 'CUSTOMER',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]);
        }, 500);
      });
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    try {
      return await apiClient.get<User>(`/admin/users/${id}`);
    } catch (error) {
      // Fallback to mock data for development
      const users = await adminApi.getUsers();
      const user = users.find(u => u.id === id);
      if (!user) throw new Error('User not found');
      return user;
    }
  },

  /**
   * Update user (e.g., toggle active status)
   */
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    try {
      return await apiClient.patch<User>(`/admin/users/${id}`, data);
    } catch (error) {
      // Fallback to mock data for development
      const user = await adminApi.getUserById(id);
      return { ...user, ...data, updatedAt: new Date().toISOString() };
    }
  },

  /**
   * Get all providers
   */
  getProviders: async (): Promise<Provider[]> => {
    try {
      return await apiClient.get<Provider[]>('/admin/providers');
    } catch (error) {
      // Fallback to mock data for development
      return providerApi.getProviders();
    }
  },

  /**
   * Update provider (e.g., toggle active status)
   */
  updateProvider: async (id: string, data: Partial<Provider>): Promise<Provider> => {
    try {
      return await apiClient.patch<Provider>(`/admin/providers/${id}`, data);
    } catch (error) {
      // Fallback to mock data for development
      const provider = await providerApi.getProviderById(id);
      return { ...provider, ...data, updatedAt: new Date().toISOString() };
    }
  },

  /**
   * Get all bookings
   */
  getBookings: async (): Promise<Booking[]> => {
    try {
      return await apiClient.get<Booking[]>('/admin/bookings');
    } catch (error) {
      // Fallback to mock data for development
      return bookingApi.getMyBookings();
    }
  },
};

