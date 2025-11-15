/**
 * useBookings hook
 * Custom hook for booking operations
 */

import { useState, useEffect } from 'react';
import { bookingApi } from '../services/bookingApi';
import { Booking } from '../models/Booking';
import { BookingStatus } from '../utils/constants';

export const useBookings = (status?: BookingStatus) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadBookings();
  }, [status]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await bookingApi.getMyBookings(status);
      setBookings(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bookings,
    isLoading,
    error,
    refresh: loadBookings,
  };
};

