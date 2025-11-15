/**
 * Booking model and types
 */

import { BookingStatus } from '../utils/constants';
import { User } from './User';
import { Provider } from './Provider';
import { Service } from './Service';

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Populated fields (when fetched with relations)
  user?: User;
  provider?: Provider;
  service?: Service;
}

export interface CreateBookingData {
  providerId: string;
  serviceId: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  notes?: string;
}

export interface UpdateBookingData {
  status?: BookingStatus;
  notes?: string;
}

export interface BookingSummary {
  booking: Booking;
  totalPrice: number;
  serviceName: string;
  providerName: string;
}

