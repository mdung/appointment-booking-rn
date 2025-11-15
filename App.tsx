/**
 * Main App Component
 * Sets up navigation and context providers
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { linking, setNavigationRef } from './src/utils/navigationUtils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import { UserProvider } from './src/context/UserContext';
import { BookingProvider } from './src/context/BookingContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <UserProvider>
          <BookingProvider>
            <NavigationContainer
              ref={setNavigationRef}
              linking={linking}
            >
              <StatusBar style="auto" />
              <AppNavigator />
              <Toast />
            </NavigationContainer>
          </BookingProvider>
        </UserProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
