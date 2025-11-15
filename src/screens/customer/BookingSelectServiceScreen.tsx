/**
 * Booking Select Service Screen
 * Step 1: Select a service from the provider
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { providerApi } from '../../services/providerApi';
import { Service } from '../../models/Service';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';

type BookingSelectServiceScreenRouteProp = RouteProp<CustomerStackParamList, 'BookingSelectService'>;
type BookingSelectServiceScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'BookingSelectService'>;

export const BookingSelectServiceScreen: React.FC = () => {
  const route = useRoute<BookingSelectServiceScreenRouteProp>();
  const navigation = useNavigation<BookingSelectServiceScreenNavigationProp>();
  const { providerId } = route.params;

  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, [providerId]);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const data = await providerApi.getProviderServices(providerId);
      setServices(data.filter(s => s.isActive));
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedService) {
      navigation.navigate('BookingSelectDate', {
        providerId,
        serviceId: selectedService.id,
      });
    }
  };

  const renderService = ({ item }: { item: Service }) => {
    const isSelected = selectedService?.id === item.id;
    return (
      <AppCard
        style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
        onPress={() => setSelectedService(item)}
      >
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.servicePrice}>${item.price}</Text>
        </View>
        {item.description && (
          <Text style={styles.serviceDescription}>{item.description}</Text>
        )}
        <Text style={styles.serviceDuration}>Duration: {item.durationMinutes} minutes</Text>
      </AppCard>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Select a Service</Text>
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
        <AppButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedService}
          fullWidth
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.h3,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  list: {
    flexGrow: 1,
  },
  serviceCard: {
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceCardSelected: {
    borderColor: theme.colors.primary,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  serviceName: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
  },
  servicePrice: {
    fontSize: theme.typography.h4,
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
  button: {
    marginTop: theme.spacing.md,
  },
});

