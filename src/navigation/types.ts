/**
 * Navigation type definitions
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { UserRole } from '../utils/constants';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type CustomerTabParamList = {
  CustomerHome: undefined;
  CustomerBookings: undefined;
  CustomerProfile: undefined;
};

export type CustomerStackParamList = {
  CustomerTabs: NavigatorScreenParams<CustomerTabParamList>;
  CategoryList: { category: string };
  ProviderList: { category: string };
  ProviderDetail: { providerId: string };
  BookingSelectService: { providerId: string };
  BookingSelectDate: { providerId: string; serviceId: string };
  BookingSelectTime: { providerId: string; serviceId: string; date: string };
  BookingConfirm: { providerId: string; serviceId: string; date: string; startTime: string };
  BookingDetail: { bookingId: string };
};

export type ProviderTabParamList = {
  ProviderDashboard: undefined;
  ProviderBookings: undefined;
  ProviderServices: undefined;
  ProviderProfile: undefined;
};

export type ProviderStackParamList = {
  ProviderTabs: NavigatorScreenParams<ProviderTabParamList>;
  ProviderBookingDetail: { bookingId: string };
  EditService: { serviceId?: string };
  Availability: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
  AdminUsers: undefined;
  AdminProviders: undefined;
  AdminBookings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Customer: NavigatorScreenParams<CustomerStackParamList>;
  Provider: NavigatorScreenParams<ProviderStackParamList>;
  Admin: NavigatorScreenParams<AdminStackParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

