/**
 * App-wide constants
 */

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  PROVIDER: 'PROVIDER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const PROVIDER_TYPES = {
  HAIR: 'HAIR',
  SPA: 'SPA',
  TUTOR: 'TUTOR',
} as const;

export type ProviderType = typeof PROVIDER_TYPES[keyof typeof PROVIDER_TYPES];

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@appointment_booking:auth_token',
  USER_DATA: '@appointment_booking:user_data',
  ONBOARDING_COMPLETED: '@appointment_booking:onboarding_completed',
} as const;

// Time slot intervals (in minutes)
export const TIME_SLOT_INTERVAL = 30;

// Minimum booking advance time (in hours)
export const MIN_BOOKING_ADVANCE_HOURS = 2;

// Maximum booking advance time (in days)
export const MAX_BOOKING_ADVANCE_DAYS = 90;

