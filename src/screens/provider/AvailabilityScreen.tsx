/**
 * Availability Screen
 * Manage provider availability (working days, blocked dates/times)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { providerApi } from '../../services/providerApi';
import { Availability, WorkingDay } from '../../models/Provider';
import { theme } from '../../config/theme';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const AvailabilityScreen: React.FC = () => {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      const providerId = '1'; // Mock
      const data = await providerApi.getProviderAvailability(providerId);
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (dayOfWeek: number) => {
    if (!availability) return;
    
    const updatedWorkingDays = availability.workingDays.map(wd => {
      if (wd.dayOfWeek === dayOfWeek) {
        return { ...wd, isAvailable: !wd.isAvailable };
      }
      return wd;
    });

    setAvailability({
      ...availability,
      workingDays: updatedWorkingDays,
    });
  };

  const handleSave = async () => {
    if (!availability) return;

    try {
      setIsSaving(true);
      const providerId = '1'; // Mock
      await providerApi.updateProviderAvailability(providerId, availability);
      Alert.alert('Success', 'Availability updated');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update availability');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!availability) {
    return (
      <ScreenContainer>
        <Text>Error loading availability</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Manage Availability</Text>

        <AppCard style={styles.card}>
          <Text style={styles.sectionTitle}>Working Days</Text>
          {daysOfWeek.map((day, index) => {
            const workingDay = availability.workingDays.find(wd => wd.dayOfWeek === index);
            const isAvailable = workingDay?.isAvailable || false;
            
            return (
              <View key={index} style={styles.dayRow}>
                <Text style={styles.dayName}>{day}</Text>
                <Switch
                  value={isAvailable}
                  onValueChange={() => toggleDay(index)}
                />
                {isAvailable && workingDay && (
                  <Text style={styles.timeRange}>
                    {workingDay.startTime} - {workingDay.endTime}
                  </Text>
                )}
              </View>
            );
          })}
        </AppCard>

        <AppButton
          title="Save Changes"
          onPress={handleSave}
          loading={isSaving}
          fullWidth
          style={styles.button}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.h2,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  dayName: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  timeRange: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});

