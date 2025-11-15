/**
 * Provider model and types
 */

import { ProviderType } from '../utils/constants';
import { Service } from './Service';

export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  description: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  rating: number;
  totalReviews: number;
  priceRange: {
    min: number;
    max: number;
  };
  photos: string[];
  services: Service[];
  availability?: Availability;
  userId: string; // Link to User
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  providerId: string;
  workingDays: WorkingDay[];
  blockedDates: string[]; // ISO date strings
  blockedTimeSlots: string[]; // Format: "YYYY-MM-DD HH:mm-HH:mm"
}

export interface WorkingDay {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isAvailable: boolean;
}

export interface CreateProviderData {
  name: string;
  type: ProviderType;
  description: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  priceRange: {
    min: number;
    max: number;
  };
  photos?: string[];
}

export interface UpdateProviderData extends Partial<CreateProviderData> {
  isActive?: boolean;
}

