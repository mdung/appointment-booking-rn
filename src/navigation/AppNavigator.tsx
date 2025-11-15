/**
 * Main App Navigator
 * Decides which navigator to show based on authentication and user role
 */

import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';
import { SplashScreen } from '../screens/common/SplashScreen';
import { OnboardingScreen } from '../screens/common/OnboardingScreen';
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { ProviderNavigator } from './ProviderNavigator';
import { AdminNavigator } from './AdminNavigator';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';
import { linking, setNavigationRef } from '../utils/navigationUtils';
import { securityService } from '../services/securityService';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [showOnboarding, setShowOnboarding] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    // Set up session timeout
    if (isAuthenticated) {
      securityService.startSessionTimeout(() => {
        logout();
      });
    }

    // Cleanup on unmount
    return () => {
      securityService.cleanup();
    };
  }, [isAuthenticated, logout]);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
      setShowOnboarding(completed !== 'true');
    } catch (error) {
      setShowOnboarding(false);
    }
  };

  if (isLoading || showOnboarding === null) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isAuthenticated ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </>
      ) : (
        <>
          {user?.role === 'CUSTOMER' && (
            <Stack.Screen name="Customer" component={CustomerNavigator} />
          )}
          {user?.role === 'PROVIDER' && (
            <Stack.Screen name="Provider" component={ProviderNavigator} />
          )}
          {user?.role === 'ADMIN' && (
            <Stack.Screen name="Admin" component={AdminNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

