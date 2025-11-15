/**
 * Provider API service
 */

import { apiClient } from './apiClient';
import { Provider, CreateProviderData, UpdateProviderData, Availability } from '../models/Provider';
import { Service, CreateServiceData, UpdateServiceData } from '../models/Service';
import { ProviderType } from '../utils/constants';
import { TimeSlot } from '../utils/dateTime';

export const providerApi = {
  /**
   * Get all providers (with optional filters)
   */
  getProviders: async (filters?: {
    type?: ProviderType;
    search?: string;
    city?: string;
  }): Promise<Provider[]> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockProviders: Provider[] = [
          {
            id: '1',
            name: 'Elite Hair Salon',
            type: 'HAIR',
            description: 'Premium hair salon with expert stylists',
            address: '123 Main St',
            city: 'New York',
            rating: 4.5,
            totalReviews: 120,
            priceRange: { min: 30, max: 150 },
            photos: [],
            services: [],
            userId: '1',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Relax Spa',
            type: 'SPA',
            description: 'Full service spa and wellness center',
            address: '456 Oak Ave',
            city: 'New York',
            rating: 4.8,
            totalReviews: 89,
            priceRange: { min: 50, max: 200 },
            photos: [],
            services: [],
            userId: '2',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        resolve(mockProviders);
      }, 500);
    });
    
    // const params = filters || {};
    // return apiClient.get<Provider[]>('/providers', { params });
  },

  /**
   * Get provider by ID
   */
  getProviderById: async (id: string): Promise<Provider> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: 'Elite Hair Salon',
          type: 'HAIR',
          description: 'Premium hair salon with expert stylists',
          address: '123 Main St',
          city: 'New York',
          rating: 4.5,
          totalReviews: 120,
          priceRange: { min: 30, max: 150 },
          photos: [],
          services: [
            {
              id: '1',
              providerId: id,
              name: 'Haircut',
              category: 'HAIR',
              durationMinutes: 30,
              price: 50,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          userId: '1',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
    
    // return apiClient.get<Provider>(`/providers/${id}`);
  },

  /**
   * Get current provider profile (for provider users)
   */
  getMyProviderProfile: async (): Promise<Provider | null> => {
    // TODO: Replace with actual API call
    return providerApi.getProviderById('1');
    
    // return apiClient.get<Provider>('/providers/me');
  },

  /**
   * Create provider profile
   */
  createProvider: async (data: CreateProviderData): Promise<Provider> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'new_' + Date.now(),
          ...data,
          rating: 0,
          totalReviews: 0,
          photos: data.photos || [],
          services: [],
          userId: '1',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 1000);
    });
    
    // return apiClient.post<Provider>('/providers', data);
  },

  /**
   * Update provider profile
   */
  updateProvider: async (id: string, data: UpdateProviderData): Promise<Provider> => {
    // TODO: Replace with actual API call
    const existing = await providerApi.getProviderById(id);
    return {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    // return apiClient.patch<Provider>(`/providers/${id}`, data);
  },

  /**
   * Get provider services
   */
  getProviderServices: async (providerId: string): Promise<Service[]> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            providerId,
            name: 'Haircut',
            category: 'HAIR',
            durationMinutes: 30,
            price: 50,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }, 500);
    });
    
    // return apiClient.get<Service[]>(`/providers/${providerId}/services`);
  },

  /**
   * Create service for provider
   */
  createService: async (providerId: string, data: CreateServiceData): Promise<Service> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'new_' + Date.now(),
          providerId,
          ...data,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
    
    // return apiClient.post<Service>(`/providers/${providerId}/services`, data);
  },

  /**
   * Update service
   */
  updateService: async (providerId: string, serviceId: string, data: UpdateServiceData): Promise<Service> => {
    // TODO: Replace with actual API call
    const services = await providerApi.getProviderServices(providerId);
    const existing = services.find(s => s.id === serviceId);
    if (!existing) throw new Error('Service not found');
    
    return {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    // return apiClient.patch<Service>(`/providers/${providerId}/services/${serviceId}`, data);
  },

  /**
   * Get provider availability
   */
  getProviderAvailability: async (providerId: string): Promise<Availability> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          providerId,
          workingDays: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isAvailable: true },
            { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isAvailable: true },
            { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isAvailable: true },
            { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isAvailable: true },
            { dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isAvailable: true },
          ],
          blockedDates: [],
          blockedTimeSlots: [],
        });
      }, 500);
    });
    
    // return apiClient.get<Availability>(`/providers/${providerId}/availability`);
  },

  /**
   * Update provider availability
   */
  updateProviderAvailability: async (providerId: string, availability: Availability): Promise<Availability> => {
    // TODO: Replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(availability);
      }, 500);
    });
    
    // return apiClient.put<Availability>(`/providers/${providerId}/availability`, availability);
  },

  /**
   * Get available time slots for a provider on a specific date
   */
  getAvailableTimeSlots: async (providerId: string, date: string): Promise<TimeSlot[]> => {
    // TODO: Replace with actual API call
    const availability = await providerApi.getProviderAvailability(providerId);
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const workingDay = availability.workingDays.find(wd => wd.dayOfWeek === dayOfWeek);
    
    if (!workingDay || !workingDay.isAvailable) {
      return [];
    }
    
    // Generate time slots based on working hours
    const [startHour, startMin] = workingDay.startTime.split(':').map(Number);
    const [endHour, endMin] = workingDay.endTime.split(':').map(Number);
    
    // TODO: Filter out booked slots from actual bookings
    return [];
    
    // return apiClient.get<TimeSlot[]>(`/providers/${providerId}/time-slots`, { params: { date } });
  },
};

