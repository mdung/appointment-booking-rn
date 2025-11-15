/**
 * Booking Detail Screen
 * Shows detailed booking information with options to cancel or rebook
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
import { useBooking } from '../../context/BookingContext';
import { bookingApi } from '../../services/bookingApi';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Booking } from '../../models/Booking';
import { formatDate, formatTime } from '../../utils/dateTime';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';

type BookingDetailScreenRouteProp = RouteProp<CustomerStackParamList, 'BookingDetail'>;
type BookingDetailScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'BookingDetail'>;

export const BookingDetailScreen: React.FC = () => {
  const route = useRoute<BookingDetailScreenRouteProp>();
  const navigation = useNavigation<BookingDetailScreenNavigationProp>();
  const { bookingId } = route.params;
  const { cancelBooking } = useBooking();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsCancelling(true);
              await cancelBooking(bookingId);
              Alert.alert('Success', 'Booking cancelled', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel booking');
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ]
    );
  };

  const handleRebook = () => {
    if (booking) {
      navigation.navigate('BookingSelectService', { providerId: booking.providerId });
    }
  };

  const handleReschedule = () => {
    if (booking) {
      navigation.navigate('BookingSelectDate', {
        providerId: booking.providerId,
        serviceId: booking.serviceId,
      });
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

  const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED';
  const canRebook = booking.status === 'COMPLETED' || booking.status === 'CANCELLED';

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.serviceName}>{booking.service?.name || 'Service'}</Text>
          <BookingStatusTag status={booking.status} />
        </View>

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Provider</Text>
          <Text style={styles.infoText}>{booking.provider?.name || 'Provider'}</Text>
          <Text style={styles.infoSubtext}>{booking.provider?.address || ''}</Text>
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
          {canCancel && (
            <>
              <AppButton
                title="Reschedule"
                onPress={handleReschedule}
                variant="outline"
                fullWidth
                style={styles.button}
              />
              <AppButton
                title="Cancel Booking"
                onPress={handleCancel}
                loading={isCancelling}
                variant="outline"
                fullWidth
                style={[styles.button, { borderColor: theme.colors.error }]}
              />
            </>
          )}
          {canRebook && (
            <AppButton
              title="Rebook"
              onPress={handleRebook}
              fullWidth
              style={styles.button}
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

