/**
 * Onboarding Screen
 * First-time user tutorial and feature walkthrough
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../layout/ScreenContainer';
import { AppButton } from '../ui/AppButton';
import { theme } from '../../config/theme';
import { RootStackParamList } from '../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../utils/constants';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

const onboardingSteps = [
  {
    title: 'Welcome to Appointment Booking',
    description: 'Book appointments with hair salons, spas, and tutors easily.',
    icon: '📅',
  },
  {
    title: 'Browse & Search',
    description: 'Find the perfect service provider by category, location, or rating.',
    icon: '🔍',
  },
  {
    title: 'Easy Booking',
    description: 'Select service, date, and time in just a few taps.',
    icon: '✅',
  },
  {
    title: 'Manage Everything',
    description: 'Track your bookings, leave reviews, and manage your profile.',
    icon: '📱',
  },
];

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    // Navigation will be handled by AppNavigator
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.icon}>{currentStepData.icon}</Text>
          <Text style={styles.title}>{currentStepData.title}</Text>
          <Text style={styles.description}>{currentStepData.description}</Text>
        </View>

        <View style={styles.indicators}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentStep && styles.indicatorActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.actions}>
          {currentStep > 0 && (
            <AppButton
              title="Previous"
              onPress={() => setCurrentStep(currentStep - 1)}
              variant="outline"
              style={styles.button}
            />
          )}
          <AppButton
            title={currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            style={styles.button}
          />
          {currentStep < onboardingSteps.length - 1 && (
            <AppButton
              title="Skip"
              onPress={handleSkip}
              variant="text"
              style={styles.button}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.h1,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.xl,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  indicatorActive: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
  actions: {
    gap: theme.spacing.md,
  },
  button: {
    width: '100%',
  },
});

