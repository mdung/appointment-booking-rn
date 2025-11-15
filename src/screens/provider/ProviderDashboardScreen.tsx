/**
 * Provider Dashboard Screen
 * Shows today's appointments and quick stats
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { bookingApi } from '../../services/bookingApi';
import { Booking } from '../../models/Booking';
import { formatTime } from '../../utils/dateTime';
import { theme } from '../../config/theme';
import { ProviderStackParamList } from '../../navigation/types';

type ProviderDashboardScreenNavigationProp = StackNavigationProp<ProviderStackParamList, 'ProviderTabs'>;

export const ProviderDashboardScreen: React.FC = () => {
  const navigation = useNavigation<ProviderDashboardScreenNavigationProp>();
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTodayBookings();
  }, []);

  const loadTodayBookings = async () => {
    try {
      setIsLoading(true);
      const bookings = await bookingApi.getMyBookings();
      const today = new Date().toISOString().split('T')[0];
      const todayBookingsList = bookings.filter(b => b.date === today);
      setTodayBookings(todayBookingsList);
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
        <Text style={styles.bookingTime}>{formatTime(item.startTime)}</Text>
        <Text style={styles.bookingService}>{item.service?.name || 'Service'}</Text>
      </View>
      <Text style={styles.bookingCustomer}>{item.user?.name || 'Customer'}</Text>
    </AppCard>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <AppCard style={styles.statsCard}>
          <Text style={styles.statsTitle}>Today's Appointments</Text>
          <Text style={styles.statsValue}>{todayBookings.length}</Text>
        </AppCard>

        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        {todayBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No appointments today</Text>
          </View>
        ) : (
          <FlatList
            data={todayBookings}
            renderItem={renderBooking}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
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
  statsCard: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  statsTitle: {
    fontSize: theme.typography.body,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  statsValue: {
    fontSize: theme.typography.h1,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: theme.typography.h3,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
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
  bookingTime: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  bookingService: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  bookingCustomer: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
});

