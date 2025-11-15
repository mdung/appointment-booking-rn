/**
 * Booking Context
 * Manages booking-related state and operations
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, CreateBookingData } from '../models/Booking';
import { bookingApi } from '../services/bookingApi';
import { BookingStatus } from '../utils/constants';

interface BookingContextType {
  currentBooking: CreateBookingData | null;
  setCurrentBooking: (booking: CreateBookingData | null) => void;
  createBooking: (data: CreateBookingData) => Promise<Booking>;
  cancelBooking: (id: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentBooking, setCurrentBooking] = useState<CreateBookingData | null>(null);

  const createBooking = async (data: CreateBookingData): Promise<Booking> => {
    try {
      const booking = await bookingApi.createBooking(data);
      setCurrentBooking(null); // Clear current booking after creation
      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const cancelBooking = async (id: string) => {
    try {
      await bookingApi.cancelBooking(id);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  };

  const refreshBookings = async () => {
    // This can be used to trigger a refresh in components that use bookings
    // Components can listen to this and refetch their data
  };

  const value: BookingContextType = {
    currentBooking,
    setCurrentBooking,
    createBooking,
    cancelBooking,
    refreshBookings,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

