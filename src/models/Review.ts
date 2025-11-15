/**
 * Review model and types
 */

import { User } from './User';
import { Provider } from './Provider';
import { Booking } from './Booking';

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  updatedAt: string;
  
  // Populated fields
  user?: User;
  provider?: Provider;
  booking?: Booking;
}

export interface CreateReviewData {
  bookingId: string;
  providerId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
}

