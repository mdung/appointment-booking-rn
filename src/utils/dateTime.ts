/**
 * Date and time utility functions
 */

import { format, addDays, addMinutes, isSameDay, isBefore, isAfter, startOfDay, parseISO } from 'date-fns';
import { TIME_SLOT_INTERVAL } from './constants';

export interface TimeSlot {
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  available: boolean;
}

/**
 * Format date to display string
 */
export const formatDate = (date: Date | string, formatStr: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr);
};

/**
 * Format time to display string
 */
export const formatTime = (time: string | Date, formatStr: string = 'HH:mm'): string => {
  if (typeof time === 'string') {
    return time; // Assume already in HH:mm format
  }
  return format(time, formatStr);
};

/**
 * Generate time slots for a given day
 * @param startHour - Starting hour (0-23)
 * @param endHour - Ending hour (0-23)
 * @param intervalMinutes - Interval between slots (default: 30)
 * @param bookedSlots - Array of booked time slots to mark as unavailable
 */
export const generateTimeSlots = (
  startHour: number = 9,
  endHour: number = 18,
  intervalMinutes: number = TIME_SLOT_INTERVAL,
  bookedSlots: string[] = []
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const start = new Date();
  start.setHours(startHour, 0, 0, 0);
  
  const end = new Date();
  end.setHours(endHour, 0, 0, 0);
  
  let current = new Date(start);
  
  while (current < end) {
    const startTime = format(current, 'HH:mm');
    const endTime = format(addMinutes(current, intervalMinutes), 'HH:mm');
    
    // Check if this slot is booked
    const isBooked = bookedSlots.some(booked => {
      const [bookedStart] = booked.split('-');
      return bookedStart === startTime;
    });
    
    slots.push({
      startTime,
      endTime,
      available: !isBooked,
    });
    
    current = addMinutes(current, intervalMinutes);
  }
  
  return slots;
};

/**
 * Check if a date is available for booking
 */
export const isDateAvailable = (date: Date, blockedDates: Date[] = []): boolean => {
  const today = startOfDay(new Date());
  const checkDate = startOfDay(date);
  
  // Can't book in the past
  if (isBefore(checkDate, today)) {
    return false;
  }
  
  // Check if date is blocked
  return !blockedDates.some(blocked => isSameDay(blocked, checkDate));
};

/**
 * Get available dates for booking (next N days)
 */
export const getAvailableDates = (days: number = 30, blockedDates: Date[] = []): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = 1; i <= days; i++) {
    const date = addDays(today, i);
    if (isDateAvailable(date, blockedDates)) {
      dates.push(date);
    }
  }
  
  return dates;
};

/**
 * Combine date and time into a Date object
 */
export const combineDateAndTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const combined = new Date(date);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
};

/**
 * Check if time slot is in the past
 */
export const isTimeSlotPast = (date: Date, time: string): boolean => {
  const slotDateTime = combineDateAndTime(date, time);
  return isBefore(slotDateTime, new Date());
};

