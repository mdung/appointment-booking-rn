/**
 * Booking List Screen
 * Shows customer's bookings (upcoming and past)
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
import { CustomerStackParamList } from '../../navigation/types';

type BookingListScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'CustomerTabs'>;

export const BookingListScreen: React.FC = () => {
  const navigation = useNavigation<BookingListScreenNavigationProp>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    loadBookings();
  }, [activeTab]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadBookings();
    setIsRefreshing(false);
  }, [activeTab]);

  const loadBookings = async () => {
    try {
      setIsLoading(true);
      const status = activeTab === 'upcoming' ? undefined : 'COMPLETED';
      const data = await bookingApi.getMyBookings(status);
      // Filter by date for upcoming vs past
      const now = new Date();
      const filtered = activeTab === 'upcoming'
        ? data.filter(b => new Date(`${b.date}T${b.startTime}`) >= now)
        : data.filter(b => new Date(`${b.date}T${b.startTime}`) < now);
      setBookings(filtered);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingPress = (bookingId: string) => {
    navigation.navigate('BookingDetail', { bookingId });
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
      <Text style={styles.bookingProvider}>{item.provider?.name || 'Provider'}</Text>
      <Text style={styles.bookingDateTime}>
        {formatDate(item.date)} at {formatTime(item.startTime)}
      </Text>
    </AppCard>
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.tabs}>
          <View
            style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
            onTouchEnd={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
              Upcoming
            </Text>
          </View>
          <View
            style={[styles.tab, activeTab === 'past' && styles.tabActive]}
            onTouchEnd={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
              Past
            </Text>
          </View>
        </View>

        {isLoading ? (
          <SkeletonLoader type="list" count={5} />
        ) : (
          <FlatList
            data={bookings}
            renderItem={renderBooking}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <EmptyState
                title={activeTab === 'upcoming' ? 'No Upcoming Bookings' : 'No Past Bookings'}
                message={
                  activeTab === 'upcoming'
                    ? "You don't have any upcoming appointments"
                    : "You haven't completed any appointments yet"
                }
                icon={activeTab === 'upcoming' ? '📅' : '📋'}
                actionLabel="Browse Providers"
                onAction={() => navigation.navigate('CustomerTabs', { screen: 'CustomerHome' })}
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
  tabs: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
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

