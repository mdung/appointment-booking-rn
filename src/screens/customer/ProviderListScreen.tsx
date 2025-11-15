/**
 * Provider List Screen
 * Shows list of providers, optionally filtered by category
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ProviderFilters, FilterOptions } from '../../components/filters/ProviderFilters';
import { providerApi } from '../../services/providerApi';
import { Provider } from '../../models/Provider';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';
import { debounce } from '../../utils/debounce';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    loadProviders();
  }, [category, filters]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      loadProviders(query);
    }, 500),
    [category, filters]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const loadProviders = async (search?: string) => {
    try {
      setIsLoading(true);
      const apiFilters: any = {
        ...(category ? { type: category as any } : {}),
        ...(search ? { search } : {}),
        ...filters,
      };
      const data = await providerApi.getProviders(apiFilters);
      
      // Client-side sorting if needed
      let sorted = [...data];
      if (filters.sortBy) {
        sorted.sort((a, b) => {
          if (filters.sortBy === 'rating') {
            return (b.rating - a.rating) * (filters.sortOrder === 'desc' ? 1 : -1);
          } else if (filters.sortBy === 'price') {
            return (a.priceRange.min - b.priceRange.min) * (filters.sortOrder === 'desc' ? -1 : 1);
          } else if (filters.sortBy === 'name') {
            return a.name.localeCompare(b.name) * (filters.sortOrder === 'desc' ? -1 : 1);
          }
          return 0;
        });
      }
      
      setProviders(sorted);
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


  return (
    <ScreenContainer>
      <View style={styles.header}>
        <AppTextInput
          placeholder="Search providers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
        <ProviderFilters filters={filters} onFiltersChange={setFilters} />
      </View>
      {isLoading ? (
        <SkeletonLoader type="list" count={5} />
      ) : (
        <FlatList
          data={providers}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="No Providers Found"
              message={searchQuery || filters ? "No providers match your search or filters" : "No providers available"}
              icon="🏢"
            />
          }
        />
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    marginBottom: theme.spacing.sm,
  },
  list: {
    paddingVertical: theme.spacing.sm,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
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

