/**
 * Customer Home Screen
 * Main screen for customers to browse services and providers
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { providerApi } from '../../services/providerApi';
import { Provider } from '../../models/Provider';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';
import { PROVIDER_TYPES } from '../../utils/constants';

type CustomerHomeScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'CustomerTabs'>;

const categories = [
  { id: PROVIDER_TYPES.HAIR, name: 'Hair', color: theme.colors.hair },
  { id: PROVIDER_TYPES.SPA, name: 'Spa', color: theme.colors.spa },
  { id: PROVIDER_TYPES.TUTOR, name: 'Tutors', color: theme.colors.tutor },
];

export const CustomerHomeScreen: React.FC = () => {
  const navigation = useNavigation<CustomerHomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setIsLoading(true);
      const data = await providerApi.getProviders();
      setProviders(data);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('ProviderList', { category: categoryId });
  };

  const handleProviderPress = (providerId: string) => {
    navigation.navigate('ProviderDetail', { providerId });
  };

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderProvider = ({ item }: { item: Provider }) => (
    <AppCard
      style={styles.providerCard}
      onPress={() => handleProviderPress(item.id)}
    >
      <Text style={styles.providerName}>{item.name}</Text>
      <Text style={styles.providerType}>{item.type}</Text>
      <Text style={styles.providerRating}>⭐ {item.rating.toFixed(1)}</Text>
      <Text style={styles.providerAddress}>{item.address}</Text>
    </AppCard>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <AppTextInput
          placeholder="Search services, providers..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />

        <SectionHeader title="Categories" />
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        <SectionHeader title="Featured Providers" />
        <FlatList
          data={providers.slice(0, 5)}
          renderItem={renderProvider}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    marginBottom: theme.spacing.lg,
  },
  categoriesList: {
    paddingVertical: theme.spacing.sm,
  },
  categoryCard: {
    width: 120,
    height: 100,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  categoryName: {
    fontSize: theme.typography.h4,
    fontWeight: '700',
    color: '#FFFFFF',
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
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  providerRating: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.rating,
    marginBottom: theme.spacing.xs,
  },
  providerAddress: {
    fontSize: theme.typography.caption,
    color: theme.colors.textTertiary,
  },
});

