/**
 * Main App Navigator
 * Decides which navigator to show based on authentication and user role
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useAuth } from '../context/AuthContext';
import { SplashScreen } from '../screens/common/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { CustomerNavigator } from './CustomerNavigator';
import { ProviderNavigator } from './ProviderNavigator';
import { AdminNavigator } from './AdminNavigator';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
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

