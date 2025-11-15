/**
 * Admin Bookings Screen
 * List all bookings
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { BookingStatusTag } from '../../components/booking/BookingStatusTag';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { AdminSearchBar } from '../../components/admin/AdminSearchBar';
import { adminApi } from '../../services/adminApi';
import { Booking } from '../../models/Booking';
import { formatDate, formatTime } from '../../utils/dateTime';
import { theme } from '../../config/theme';

export const AdminBookingsScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchQuery]);

  const filterBookings = () => {
    if (!searchQuery.trim()) {
      setFilteredBookings(bookings);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = bookings.filter(
      (booking) =>
        booking.service?.name.toLowerCase().includes(query) ||
        booking.provider?.name.toLowerCase().includes(query) ||
        booking.user?.name.toLowerCase().includes(query) ||
        booking.status.toLowerCase().includes(query)
    );
    setFilteredBookings(filtered);
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadBookings();
    setIsRefreshing(false);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Bookings</Text>
        
        <AdminSearchBar
          onSearch={handleSearch}
          placeholder="Search bookings by service, provider, customer, or status..."
        />

        {isLoading ? (
          <SkeletonLoader type="list" count={5} />
        ) : (
          <FlatList
            data={filteredBookings}
            renderItem={renderBooking}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <EmptyState
                title="No Bookings Found"
                message={searchQuery ? "No bookings match your search" : "No bookings in the system"}
                icon="📅"
              />
            }
          />
        )}
      </View>
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

