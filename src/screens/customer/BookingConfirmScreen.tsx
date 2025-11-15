/**
 * Booking Confirm Screen
 * Step 4: Review and confirm booking
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useBooking } from '../../context/BookingContext';
import { notificationService } from '../../services/notificationService';
import { providerApi } from '../../services/providerApi';
import { Provider, Service } from '../../models/Provider';
import { formatDate, formatTime } from '../../utils/dateTime';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';

type BookingConfirmScreenRouteProp = RouteProp<CustomerStackParamList, 'BookingConfirm'>;
type BookingConfirmScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'BookingConfirm'>;

export const BookingConfirmScreen: React.FC = () => {
  const route = useRoute<BookingConfirmScreenRouteProp>();
  const navigation = useNavigation<BookingConfirmScreenNavigationProp>();
  const { providerId, serviceId, date, startTime } = route.params;
  const { createBooking } = useBooking();

  const [provider, setProvider] = useState<Provider | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [providerData, services] = await Promise.all([
        providerApi.getProviderById(providerId),
        providerApi.getProviderServices(providerId),
      ]);
      setProvider(providerData);
      setService(services.find(s => s.id === serviceId) || null);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      const booking = await createBooking({
        providerId,
        serviceId,
        date,
        startTime,
        notes: notes.trim() || undefined,
      });
      
      // Schedule notification reminder
      if (provider) {
        await notificationService.scheduleBookingReminder(
          booking.id,
          date,
          startTime,
          provider.name
        );
      }
      
      Alert.alert(
        'Success',
        'Booking confirmed!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CustomerTabs', { screen: 'CustomerBookings' }),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!provider || !service) {
    return (
      <ScreenContainer>
        <Text>Error loading booking details</Text>
      </ScreenContainer>
    );
  }

  // Calculate end time (simplified - should use service duration)
  const [hours, minutes] = startTime.split(':').map(Number);
  const endTime = `${String(hours).padStart(2, '0')}:${String(minutes + service.durationMinutes).padStart(2, '0')}`;

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Confirm Booking</Text>

        <AppCard style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Provider</Text>
          <Text style={styles.summaryText}>{provider.name}</Text>
          <Text style={styles.summarySubtext}>{provider.address}</Text>
        </AppCard>

        <AppCard style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Service</Text>
          <Text style={styles.summaryText}>{service.name}</Text>
          <Text style={styles.summarySubtext}>Duration: {service.durationMinutes} minutes</Text>
        </AppCard>

        <AppCard style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <Text style={styles.summaryText}>{formatDate(date, 'EEEE, MMMM dd, yyyy')}</Text>
          <Text style={styles.summarySubtext}>{formatTime(startTime)} - {formatTime(endTime)}</Text>
        </AppCard>

        <AppCard style={styles.summaryCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.priceValue}>${service.price}</Text>
          </View>
        </AppCard>

        <AppCard style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Special Requests (Optional)</Text>
          <AppTextInput
            placeholder="Any special requests or notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={styles.notesInput}
          />
        </AppCard>

        <AppButton
          title="Confirm Booking"
          onPress={handleConfirm}
          loading={isSubmitting}
          fullWidth
          style={styles.confirmButton}
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
  summaryCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  summaryText: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  summarySubtext: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
  },
  priceValue: {
    fontSize: theme.typography.h3,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  notesInput: {
    minHeight: 80,
  },
  confirmButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

