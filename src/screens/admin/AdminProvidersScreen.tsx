/**
 * Admin Providers Screen
 * List and manage providers
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Alert, RefreshControl } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { AdminSearchBar } from '../../components/admin/AdminSearchBar';
import { adminApi } from '../../services/adminApi';
import { Provider } from '../../models/Provider';
import { theme } from '../../config/theme';

export const AdminProvidersScreen: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [providers, searchQuery]);

  const filterProviders = () => {
    if (!searchQuery.trim()) {
      setFilteredProviders(providers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = providers.filter(
      (provider) =>
        provider.name.toLowerCase().includes(query) ||
        provider.type.toLowerCase().includes(query) ||
        provider.address.toLowerCase().includes(query) ||
        provider.email?.toLowerCase().includes(query)
    );
    setFilteredProviders(filtered);
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadProviders();
    setIsRefreshing(false);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const loadProviders = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (providerId: string, isActive: boolean) => {
    try {
      await adminApi.updateProvider(providerId, { isActive: !isActive });
      await loadProviders();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update provider');
    }
  };

  const renderProvider = ({ item }: { item: Provider }) => (
    <AppCard style={styles.providerCard}>
      <View style={styles.providerHeader}>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{item.name}</Text>
          <Text style={styles.providerType}>{item.type}</Text>
          <Text style={styles.providerAddress}>{item.address}</Text>
        </View>
        <Switch
          value={item.isActive}
          onValueChange={() => handleToggleActive(item.id, item.isActive)}
        />
      </View>
    </AppCard>
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Providers</Text>
        
        <AdminSearchBar
          onSearch={handleSearch}
          placeholder="Search providers by name, type, or location..."
        />

        {isLoading ? (
          <SkeletonLoader type="list" count={5} />
        ) : (
          <FlatList
            data={filteredProviders}
            renderItem={renderProvider}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <EmptyState
                title="No Providers Found"
                message={searchQuery ? "No providers match your search" : "No providers in the system"}
                icon="🏢"
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
  providerCard: {
    marginBottom: theme.spacing.md,
  },
  providerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  providerType: {
    fontSize: theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  providerAddress: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

