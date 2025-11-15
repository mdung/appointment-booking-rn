/**
 * Admin Dashboard Screen
 * Overview of users, providers, and bookings
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { adminApi } from '../../services/adminApi';
import { theme } from '../../config/theme';
import { AdminStackParamList } from '../../navigation/types';

type AdminDashboardScreenNavigationProp = StackNavigationProp<AdminStackParamList, 'AdminDashboard'>;

export const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<AdminDashboardScreenNavigationProp>();
  const [stats, setStats] = useState({
    users: 0,
    providers: 0,
    bookings: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [users, providers, bookings] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getProviders(),
        adminApi.getBookings(),
      ]);
      setStats({
        users: users.length,
        providers: providers.length,
        bookings: bookings.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>

        <View style={styles.statsGrid}>
          <AppCard style={styles.statCard}>
            <Text style={styles.statValue}>{stats.users}</Text>
            <Text style={styles.statLabel}>Users</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminUsers')}
              style={styles.statButton}
            >
              <Text style={styles.statButtonText}>View All</Text>
            </TouchableOpacity>
          </AppCard>

          <AppCard style={styles.statCard}>
            <Text style={styles.statValue}>{stats.providers}</Text>
            <Text style={styles.statLabel}>Providers</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminProviders')}
              style={styles.statButton}
            >
              <Text style={styles.statButtonText}>View All</Text>
            </TouchableOpacity>
          </AppCard>

          <AppCard style={styles.statCard}>
            <Text style={styles.statValue}>{stats.bookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AdminBookings')}
              style={styles.statButton}
            >
              <Text style={styles.statButtonText}>View All</Text>
            </TouchableOpacity>
          </AppCard>
        </View>
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
    marginBottom: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.h1,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  statButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  statButtonText: {
    fontSize: theme.typography.bodySmall,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

