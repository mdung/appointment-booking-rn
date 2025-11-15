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
    // TODO: Replace with actual API call
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
    
    // return apiClient.get<User[]>('/admin/users');
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    // TODO: Replace with actual API call
    const users = await adminApi.getUsers();
    const user = users.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
    
    // return apiClient.get<User>(`/admin/users/${id}`);
  },

  /**
   * Update user (e.g., toggle active status)
   */
  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    // TODO: Replace with actual API call
    const user = await adminApi.getUserById(id);
    return { ...user, ...data, updatedAt: new Date().toISOString() };
    
    // return apiClient.patch<User>(`/admin/users/${id}`, data);
  },

  /**
   * Get all providers
   */
  getProviders: async (): Promise<Provider[]> => {
    // TODO: Replace with actual API call
    return providerApi.getProviders();
    
    // return apiClient.get<Provider[]>('/admin/providers');
  },

  /**
   * Update provider (e.g., toggle active status)
   */
  updateProvider: async (id: string, data: Partial<Provider>): Promise<Provider> => {
    // TODO: Replace with actual API call
    const provider = await providerApi.getProviderById(id);
    return { ...provider, ...data, updatedAt: new Date().toISOString() };
    
    // return apiClient.patch<Provider>(`/admin/providers/${id}`, data);
  },

  /**
   * Get all bookings
   */
  getBookings: async (): Promise<Booking[]> => {
    // TODO: Replace with actual API call
    return bookingApi.getMyBookings();
    
    // return apiClient.get<Booking[]>('/admin/bookings');
  },
};

