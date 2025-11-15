/**
 * Provider Detail Screen
 * Shows detailed information about a provider and allows booking
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { StarRating } from '../../components/ui/StarRating';
import { providerApi } from '../../services/providerApi';
import { reviewApi } from '../../services/reviewApi';
import { Provider, Service } from '../../models/Provider';
import { Review } from '../../models/Review';
import { formatDate } from '../../utils/dateTime';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';

type ProviderDetailScreenRouteProp = RouteProp<CustomerStackParamList, 'ProviderDetail'>;
type ProviderDetailScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'ProviderDetail'>;

export const ProviderDetailScreen: React.FC = () => {
  const route = useRoute<ProviderDetailScreenRouteProp>();
  const navigation = useNavigation<ProviderDetailScreenNavigationProp>();
  const { providerId } = route.params;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    loadProvider();
    loadReviews();
  }, [providerId]);

  const loadProvider = async () => {
    try {
      setIsLoading(true);
      const data = await providerApi.getProviderById(providerId);
      setProvider(data);
    } catch (error) {
      console.error('Error loading provider:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      setIsLoadingReviews(true);
      const data = await reviewApi.getProviderReviews(providerId);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const handleBookNow = () => {
    if (provider) {
      navigation.navigate('BookingSelectService', { providerId: provider.id });
    }
  };

  const renderService = (service: Service) => (
    <AppCard key={service.id} style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.servicePrice}>${service.price}</Text>
      </View>
      {service.description && (
        <Text style={styles.serviceDescription}>{service.description}</Text>
      )}
      <Text style={styles.serviceDuration}>{service.durationMinutes} minutes</Text>
    </AppCard>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!provider) {
    return (
      <ScreenContainer>
        <Text>Provider not found</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {provider.rating.toFixed(1)}</Text>
            <Text style={styles.reviews}>({provider.totalReviews} reviews)</Text>
          </View>
        </View>

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{provider.description}</Text>
        </AppCard>

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.address}>{provider.address}</Text>
          {provider.city && (
            <Text style={styles.address}>{provider.city}, {provider.state} {provider.zipCode}</Text>
          )}
        </AppCard>

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Services</Text>
          {provider.services && provider.services.length > 0 ? (
            provider.services.map(renderService)
          ) : (
            <Text style={styles.noServices}>No services available</Text>
          )}
        </AppCard>

        <AppCard style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Reviews ({provider.totalReviews})</Text>
          {isLoadingReviews ? (
            <LoadingSpinner />
          ) : reviews.length > 0 ? (
            <FlatList
              data={reviews.slice(0, 5)}
              renderItem={({ item }) => (
                <View style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>{item.user?.name || 'Anonymous'}</Text>
                    <StarRating rating={item.rating} readonly size={16} />
                  </View>
                  <Text style={styles.reviewComment}>{item.comment}</Text>
                  <Text style={styles.reviewDate}>{formatDate(item.createdAt, 'MMM dd, yyyy')}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noReviews}>No reviews yet</Text>
          )}
        </AppCard>

        <AppButton
          title="Book Now"
          onPress={handleBookNow}
          fullWidth
          style={styles.bookButton}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  providerName: {
    fontSize: theme.typography.h2,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: theme.typography.body,
    color: theme.colors.rating,
    fontWeight: '600',
    marginRight: theme.spacing.xs,
  },
  reviews: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.body,
  },
  address: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  serviceCard: {
    marginBottom: theme.spacing.sm,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  serviceName: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  servicePrice: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  serviceDescription: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  serviceDuration: {
    fontSize: theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  noServices: {
    fontSize: theme.typography.body,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },
  bookButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  reviewItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  reviewUser: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  reviewComment: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  reviewDate: {
    fontSize: theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  noReviews: {
    fontSize: theme.typography.body,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.md,
  },
});

