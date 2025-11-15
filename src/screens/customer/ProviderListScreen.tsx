/**
 * Provider List Screen
 * Shows list of providers, optionally filtered by category
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { providerApi } from '../../services/providerApi';
import { Provider } from '../../models/Provider';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';

type ProviderListScreenRouteProp = RouteProp<CustomerStackParamList, 'ProviderList'>;
type ProviderListScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'ProviderList'>;

interface ProviderListScreenProps {
  category?: string;
}

export const ProviderListScreen: React.FC<ProviderListScreenProps> = ({ category: propCategory }) => {
  const route = useRoute<ProviderListScreenRouteProp>();
  const navigation = useNavigation<ProviderListScreenNavigationProp>();
  const routeCategory = route?.params?.category;
  const category = propCategory || routeCategory;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, [category]);

  const loadProviders = async () => {
    try {
      setIsLoading(true);
      const data = await providerApi.getProviders(
        category ? { type: category as any } : undefined
      );
      setProviders(data);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderPress = (providerId: string) => {
    navigation.navigate('ProviderDetail', { providerId });
  };

  const renderProvider = ({ item }: { item: Provider }) => (
    <AppCard
      style={styles.providerCard}
      onPress={() => handleProviderPress(item.id)}
    >
      <Text style={styles.providerName}>{item.name}</Text>
      <Text style={styles.providerType}>{item.type}</Text>
      <Text style={styles.providerDescription}>{item.description}</Text>
      <View style={styles.providerInfo}>
        <Text style={styles.providerRating}>⭐ {item.rating.toFixed(1)} ({item.totalReviews})</Text>
        <Text style={styles.providerPrice}>
          ${item.priceRange.min} - ${item.priceRange.max}
        </Text>
      </View>
      <Text style={styles.providerAddress}>{item.address}</Text>
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
  providerName: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  providerType: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  providerDescription: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  providerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  providerRating: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.rating,
  },
  providerPrice: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  providerAddress: {
    fontSize: theme.typography.caption,
    color: theme.colors.textTertiary,
  },
});

