/**
 * Admin Providers Screen
 * List and manage providers
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Alert } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { adminApi } from '../../services/adminApi';
import { Provider } from '../../models/Provider';
import { theme } from '../../config/theme';

export const AdminProvidersScreen: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

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

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer>
      <FlatList
        data={providers}
        renderItem={renderProvider}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadProviders}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
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

