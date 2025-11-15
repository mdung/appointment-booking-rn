/**
 * Provider Booking Detail Screen
 * Shows booking details with actions (accept/decline/complete)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { BookingStatusTag } from '../../components/booking/BookingStatusTag';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { bookingApi } from '../../services/bookingApi';
import { Booking } from '../../models/Booking';
import { formatDate, formatTime } from '../../utils/dateTime';
import { theme } from '../../config/theme';
import { ProviderStackParamList } from '../../navigation/types';

type ProviderBookingDetailScreenRouteProp = RouteProp<ProviderStackParamList, 'ProviderBookingDetail'>;
type ProviderBookingDetailScreenNavigationProp = StackNavigationProp<ProviderStackParamList, 'ProviderBookingDetail'>;

export const ProviderBookingDetailScreen: React.FC = () => {
  const route = useRoute<ProviderBookingDetailScreenRouteProp>();
  const navigation = useNavigation<ProviderBookingDetailScreenNavigationProp>();
  const { bookingId } = route.params;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    try {
      setIsLoading(true);
      const data = await bookingApi.getBookingById(bookingId);
      setBooking(data);
    } catch (error) {
      console.error('Error loading booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    try {
      setIsUpdating(true);
      await bookingApi.updateBooking(bookingId, { status });
      await loadBooking();
      Alert.alert('Success', `Booking ${status.toLowerCase()}`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update booking');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!booking) {
    return (
      <ScreenContainer>
        <Text>Booking not found</Text>
      </ScreenContainer>
    );
  }

  const canAccept = booking.status === 'PENDING';
  const canComplete = booking.status === 'CONFIRMED';
  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{booking.service?.name || 'Service'}</Text>
          <BookingStatusTag status={booking.status} />
        </View>

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <Text style={styles.infoText}>{booking.user?.name || 'Customer'}</Text>
          <Text style={styles.infoSubtext}>{booking.user?.email || ''}</Text>
          {booking.user?.phone && (
            <Text style={styles.infoSubtext}>{booking.user.phone}</Text>
          )}
        </AppCard>

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <Text style={styles.infoText}>{formatDate(booking.date, 'EEEE, MMMM dd, yyyy')}</Text>
          <Text style={styles.infoSubtext}>
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </Text>
        </AppCard>

        {booking.notes && (
          <AppCard style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.infoText}>{booking.notes}</Text>
          </AppCard>
        )}

        <View style={styles.actions}>
          {canAccept && (
            <AppButton
              title="Accept Booking"
              onPress={() => handleUpdateStatus('CONFIRMED')}
              loading={isUpdating}
              fullWidth
              style={styles.button}
            />
          )}
          {canComplete && (
            <AppButton
              title="Mark as Completed"
              onPress={() => handleUpdateStatus('COMPLETED')}
              loading={isUpdating}
              fullWidth
              style={styles.button}
            />
          )}
          {canCancel && (
            <AppButton
              title="Cancel Booking"
              onPress={() => handleUpdateStatus('CANCELLED')}
              loading={isUpdating}
              variant="outline"
              fullWidth
              style={[styles.button, { borderColor: theme.colors.error }]}
            />
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  serviceName: {
    fontSize: theme.typography.h2,
    fontWeight: '700',
    color: theme.colors.text,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoSubtext: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  actions: {
    marginTop: theme.spacing.lg,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
});

