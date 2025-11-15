/**
 * Provider Dashboard Screen
 * Shows today's appointments and quick stats
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { bookingApi } from '../../services/bookingApi';
import { Booking } from '../../models/Booking';
import { formatTime, formatDate } from '../../utils/dateTime';
import { theme } from '../../config/theme';
import { ProviderStackParamList } from '../../navigation/types';
import { LineChart } from 'react-native-chart-kit';

type ProviderDashboardScreenNavigationProp = StackNavigationProp<ProviderStackParamList, 'ProviderTabs'>;

export const ProviderDashboardScreen: React.FC = () => {
  const navigation = useNavigation<ProviderDashboardScreenNavigationProp>();
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    thisWeek: 0,
    thisMonth: 0,
    totalRevenue: 0,
    averageRating: 4.5,
  });

  useEffect(() => {
    loadTodayBookings();
    loadStats();
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

  const loadStats = async () => {
    try {
      const bookings = await bookingApi.getMyBookings();
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const thisWeek = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate >= weekAgo && b.status === 'COMPLETED';
      }).length;

      const thisMonth = bookings.filter(b => {
        const bookingDate = new Date(b.date);
        return bookingDate >= monthAgo && b.status === 'COMPLETED';
      }).length;

      // Calculate revenue (mock - should come from backend)
      const totalRevenue = bookings
        .filter(b => b.status === 'COMPLETED')
        .reduce((sum, b) => sum + (b.service?.price || 0), 0);

      setStats({
        thisWeek,
        thisMonth,
        totalRevenue,
        averageRating: 4.5, // TODO: Get from provider data
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2, 3, 4, 3, 5, 4, 2], // Mock data - should come from backend
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <View style={styles.statsGrid}>
          <AppCard style={styles.statCard}>
            <Text style={styles.statLabel}>Today</Text>
            <Text style={styles.statValue}>{todayBookings.length}</Text>
          </AppCard>
          <AppCard style={styles.statCard}>
            <Text style={styles.statLabel}>This Week</Text>
            <Text style={styles.statValue}>{stats.thisWeek}</Text>
          </AppCard>
          <AppCard style={styles.statCard}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>{stats.thisMonth}</Text>
          </AppCard>
          <AppCard style={styles.statCard}>
            <Text style={styles.statLabel}>Revenue</Text>
            <Text style={styles.statValue}>${stats.totalRevenue}</Text>
          </AppCard>
        </View>

        <AppCard style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Weekly Bookings</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 64}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.background,
              backgroundGradientFrom: theme.colors.background,
              backgroundGradientTo: theme.colors.background,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.typography.h2,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  chartCard: {
    marginBottom: theme.spacing.lg,
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
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

