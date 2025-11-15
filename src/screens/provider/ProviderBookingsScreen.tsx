/**
 * Provider Bookings Screen
 * Shows all bookings for the provider
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { BookingStatusTag } from '../../components/booking/BookingStatusTag';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { bookingApi } from '../../services/bookingApi';
import { Booking } from '../../models/Booking';
import { formatDate, formatTime } from '../../utils/dateTime';
import { theme } from '../../config/theme';
import { ProviderStackParamList } from '../../navigation/types';

type ProviderBookingsScreenNavigationProp = StackNavigationProp<ProviderStackParamList, 'ProviderTabs'>;

export const ProviderBookingsScreen: React.FC = () => {
  const navigation = useNavigation<ProviderBookingsScreenNavigationProp>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadBookings();
    setIsRefreshing(false);
  }, []);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingApi.getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingPress = (bookingId: string) => {
    navigation.navigate('ProviderBookingDetail', { bookingId });
  };

  const renderBooking = ({ item }: { item: Booking }) => (
    <AppCard
      style={styles.bookingCard}
      onPress={() => handleBookingPress(item.id)}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.bookingService}>{item.service?.name || 'Service'}</Text>
        <BookingStatusTag status={item.status} />
      </View>
      <Text style={styles.bookingCustomer}>{item.user?.name || 'Customer'}</Text>
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
  bookingDateTime: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textTertiary,
  },
});

