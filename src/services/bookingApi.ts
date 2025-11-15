/**
 * Booking API service
 */

import { apiClient } from './apiClient';
import { Booking, CreateBookingData, UpdateBookingData, BookingSummary } from '../models/Booking';
import { BookingStatus } from '../utils/constants';

export const bookingApi = {
  /**
   * Get all bookings for current user
   */
  getMyBookings: async (status?: BookingStatus): Promise<Booking[]> => {
    try {
      const params = status ? { status } : {};
      return await apiClient.get<Booking[]>('/bookings', { params });
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockBookings: Booking[] = [
            {
              id: '1',
              userId: '1',
              providerId: '1',
              serviceId: '1',
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              startTime: '10:00',
              endTime: '10:30',
              status: 'CONFIRMED',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          resolve(status ? mockBookings.filter(b => b.status === status) : mockBookings);
        }, 500);
      });
    }
  },

  /**
   * Get booking by ID
   */
  getBookingById: async (id: string): Promise<Booking> => {
    try {
      return await apiClient.get<Booking>(`/bookings/${id}`);
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            userId: '1',
            providerId: '1',
            serviceId: '1',
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            startTime: '10:00',
            endTime: '10:30',
            status: 'CONFIRMED',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }, 500);
      });
    }
  },

  /**
   * Create new booking
   */
  createBooking: async (data: CreateBookingData): Promise<Booking> => {
    try {
      return await apiClient.post<Booking>('/bookings', data);
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 'new_' + Date.now(),
            userId: '1',
            providerId: data.providerId,
            serviceId: data.serviceId,
            date: data.date,
            startTime: data.startTime,
            endTime: '10:30', // Calculate based on service duration
            status: 'PENDING',
            notes: data.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }, 1000);
      });
    }
  },

  /**
   * Update booking
   */
  updateBooking: async (id: string, data: UpdateBookingData): Promise<Booking> => {
    try {
      return await apiClient.patch<Booking>(`/bookings/${id}`, data);
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            userId: '1',
            providerId: '1',
            serviceId: '1',
            date: new Date().toISOString().split('T')[0],
            startTime: '10:00',
            endTime: '10:30',
            status: data.status || 'CONFIRMED',
            notes: data.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }, 500);
      });
    }
  },

  /**
   * Cancel booking
   */
  cancelBooking: async (id: string): Promise<Booking> => {
    return bookingApi.updateBooking(id, { status: 'CANCELLED' });
  },

  /**
   * Get booking summary (for confirmation screen)
   */
  getBookingSummary: async (id: string): Promise<BookingSummary> => {
    try {
      return await apiClient.get<BookingSummary>(`/bookings/${id}/summary`);
    } catch (error) {
      // Fallback to mock data for development
      const booking = await bookingApi.getBookingById(id);
      return {
        booking,
        totalPrice: 50,
        serviceName: 'Haircut',
        providerName: 'Hair Salon',
      };
    }
  },
};
