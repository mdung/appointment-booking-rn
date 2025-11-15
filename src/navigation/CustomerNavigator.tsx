/**
 * Customer Navigator
 * Handles customer-specific navigation with bottom tabs
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomerStackParamList, CustomerTabParamList } from './types';
import { CustomerHomeScreen } from '../screens/customer/CustomerHomeScreen';
import { BookingListScreen } from '../screens/customer/BookingListScreen';
import { ProfileScreen } from '../screens/common/ProfileScreen';
import { CategoryListScreen } from '../screens/customer/CategoryListScreen';
import { ProviderListScreen } from '../screens/customer/ProviderListScreen';
import { ProviderDetailScreen } from '../screens/customer/ProviderDetailScreen';
import { BookingSelectServiceScreen } from '../screens/customer/BookingSelectServiceScreen';
import { BookingSelectDateScreen } from '../screens/customer/BookingSelectDateScreen';
import { BookingSelectTimeScreen } from '../screens/customer/BookingSelectTimeScreen';
import { BookingConfirmScreen } from '../screens/customer/BookingConfirmScreen';
import { BookingDetailScreen } from '../screens/customer/BookingDetailScreen';
import { theme } from '../config/theme';

const Stack = createStackNavigator<CustomerStackParamList>();
const Tab = createBottomTabNavigator<CustomerTabParamList>();

const CustomerTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="CustomerHome"
        component={CustomerHomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="CustomerBookings"
        component={BookingListScreen}
        options={{ tabBarLabel: 'Bookings' }}
      />
      <Tab.Screen
        name="CustomerProfile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const CustomerNavigator: React.FC = () => {
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
        name="CustomerTabs"
        component={CustomerTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryList"
        component={CategoryListScreen}
        options={{ title: 'Categories' }}
      />
      <Stack.Screen
        name="ProviderList"
        component={ProviderListScreen}
        options={{ title: 'Providers' }}
      />
      <Stack.Screen
        name="ProviderDetail"
        component={ProviderDetailScreen}
        options={{ title: 'Provider Details' }}
      />
      <Stack.Screen
        name="BookingSelectService"
        component={BookingSelectServiceScreen}
        options={{ title: 'Select Service' }}
      />
      <Stack.Screen
        name="BookingSelectDate"
        component={BookingSelectDateScreen}
        options={{ title: 'Select Date' }}
      />
      <Stack.Screen
        name="BookingSelectTime"
        component={BookingSelectTimeScreen}
        options={{ title: 'Select Time' }}
      />
      <Stack.Screen
        name="BookingConfirm"
        component={BookingConfirmScreen}
        options={{ title: 'Confirm Booking' }}
      />
      <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{ title: 'Booking Details' }}
      />
    </Stack.Navigator>
  );
};

