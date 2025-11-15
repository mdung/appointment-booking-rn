/**
 * Admin Bookings Screen
 * List all bookings
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { BookingStatusTag } from '../../components/booking/BookingStatusTag';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { adminApi } from '../../services/adminApi';
import { Booking } from '../../models/Booking';
import { formatDate, formatTime } from '../../utils/dateTime';
import { theme } from '../../config/theme';

export const AdminBookingsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <AppCard style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingService}>{item.service?.name || 'Service'}</Text>
        <BookingStatusTag status={item.status} />
      </View>
      <Text style={styles.bookingCustomer}>Customer: {item.user?.name || 'N/A'}</Text>
      <Text style={styles.bookingProvider}>Provider: {item.provider?.name || 'N/A'}</Text>
      <Text style={styles.bookingDateTime}>
        {formatDate(item.date)} at {formatTime(item.startTime)}
      </Text>
    </AppCard>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer>
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadBookings}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: theme.spacing.sm,
  },
  bookingCard: {
    marginBottom: theme.spacing.md,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  bookingService: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
  },
  bookingCustomer: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  bookingProvider: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  bookingDateTime: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textTertiary,
  },
});

