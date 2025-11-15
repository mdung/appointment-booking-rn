/**
 * Provider Navigator
 * Handles provider-specific navigation with bottom tabs
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProviderStackParamList, ProviderTabParamList } from './types';
import { ProviderDashboardScreen } from '../screens/provider/ProviderDashboardScreen';
import { ProviderBookingsScreen } from '../screens/provider/ProviderBookingsScreen';
import { ProviderServicesScreen } from '../screens/provider/ProviderServicesScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { ProviderBookingDetailScreen } from '../screens/provider/ProviderBookingDetailScreen';
import { EditServiceScreen } from '../screens/provider/EditServiceScreen';
import { AvailabilityScreen } from '../screens/provider/AvailabilityScreen';
import { EnhancedAvailabilityScreen } from '../screens/provider/EnhancedAvailabilityScreen';
import { ProviderProfileEditScreen } from '../screens/provider/ProviderProfileEditScreen';
import { theme } from '../config/theme';

const Stack = createStackNavigator<ProviderStackParamList>();
const Tab = createBottomTabNavigator<ProviderTabParamList>();

const ProviderTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="ProviderDashboard"
        component={ProviderDashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="ProviderBookings"
        component={ProviderBookingsScreen}
        options={{ tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen
        name="ProviderServices"
        component={ProviderServicesScreen}
        options={{ tabBarLabel: 'Services' }}
      />
      <Tab.Screen
        name="ProviderProfile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const ProviderNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Stack.Screen
        name="ProviderTabs"
        component={ProviderTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProviderBookingDetail"
        component={ProviderBookingDetailScreen}
        options={{ title: 'Booking Details' }}
      />
      <Stack.Screen
        name="EditService"
        component={EditServiceScreen}
        options={{ title: 'Edit Service' }}
      />
      <Stack.Screen
        name="Availability"
        component={EnhancedAvailabilityScreen}
        options={{ title: 'Availability' }}
      />
      <Stack.Screen
        name="ProviderProfileEdit"
        component={ProviderProfileEditScreen}
        options={{ title: 'Provider Profile' }}
      />
    </Stack.Navigator>
  );
};

