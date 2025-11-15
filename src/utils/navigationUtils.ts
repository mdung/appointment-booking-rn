/**
 * Navigation Utilities
 * Deep linking and navigation guards
 */

import { NavigationContainerRef } from '@react-navigation/native';
import { UserRole } from '../models/User';

let navigationRef: NavigationContainerRef<any> | null = null;

export const setNavigationRef = (ref: NavigationContainerRef<any> | null) => {
  navigationRef = ref;
};

export const navigate = (name: string, params?: any) => {
  if (navigationRef?.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
};

/**
 * Deep linking configuration
 */
export const linking = {
  prefixes: ['appointmentbooking://', 'https://appointmentbooking.com'],
  config: {
    screens: {
      Customer: {
        screens: {
          CustomerTabs: {
            screens: {
              CustomerHome: 'home',
              CustomerBookings: 'bookings',
              CustomerProfile: 'profile',
            },
          },
          ProviderDetail: 'provider/:providerId',
          BookingDetail: 'booking/:bookingId',
        },
      },
      Provider: {
        screens: {
          ProviderTabs: {
            screens: {
              ProviderDashboard: 'dashboard',
              ProviderBookings: 'bookings',
              ProviderServices: 'services',
            },
          },
        },
      },
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
        },
      },
    },
  },
};

/**
 * Navigation guard - check if user has permission to access route
 */
export const canAccessRoute = (routeName: string, userRole?: UserRole): boolean => {
  const roleBasedRoutes: Record<string, UserRole[]> = {
    'CustomerHome': ['CUSTOMER'],
    'ProviderDashboard': ['PROVIDER'],
    'AdminDashboard': ['ADMIN'],
  };

  const allowedRoles = roleBasedRoutes[routeName];
  if (!allowedRoles) {
    return true; // Public route
  }

  return userRole ? allowedRoles.includes(userRole) : false;
};

/**
 * Handle deep link
 */
export const handleDeepLink = (url: string) => {
  // Parse URL and navigate accordingly
  // This is a simplified version - actual implementation would parse the URL
  if (url.includes('provider/')) {
    const providerId = url.split('provider/')[1];
    navigate('Customer', { screen: 'ProviderDetail', params: { providerId } });
  } else if (url.includes('booking/')) {
    const bookingId = url.split('booking/')[1];
    navigate('Customer', { screen: 'BookingDetail', params: { bookingId } });
  }
};

