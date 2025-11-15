/**
 * Admin Navigator
 * Handles admin-specific navigation
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AdminStackParamList } from './types';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AdminProvidersScreen } from '../screens/admin/AdminProvidersScreen';
import { AdminBookingsScreen } from '../screens/admin/AdminBookingsScreen';
import { theme } from '../config/theme';

const Stack = createStackNavigator<AdminStackParamList>();

export const AdminNavigator: React.FC = () => {
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
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen
        name="AdminUsers"
        component={AdminUsersScreen}
        options={{ title: 'Users' }}
      />
      <Stack.Screen
        name="AdminProviders"
        component={AdminProvidersScreen}
        options={{ title: 'Providers' }}
      />
      <Stack.Screen
        name="AdminBookings"
        component={AdminBookingsScreen}
        options={{ title: 'Bookings' }}
      />
    </Stack.Navigator>
  );
};

