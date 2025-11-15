/**
 * Provider Services Screen
 * Manage services (list, add, edit, deactivate)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { providerApi } from '../../services/providerApi';
import { Service } from '../../models/Service';
import { theme } from '../../config/theme';
import { ProviderStackParamList } from '../../navigation/types';

type ProviderServicesScreenNavigationProp = StackNavigationProp<ProviderStackParamList, 'ProviderTabs'>;

export const ProviderServicesScreen: React.FC = () => {
  const navigation = useNavigation<ProviderServicesScreenNavigationProp>();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      // TODO: Get provider ID from user context or provider profile
      const providerId = '1'; // Mock - should come from provider profile
      const data = await providerApi.getProviderServices(providerId);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddService = () => {
    navigation.navigate('EditService', {});
  };

  const handleEditService = (serviceId: string) => {
    navigation.navigate('EditService', { serviceId });
  };

  const renderService = ({ item }: { item: Service }) => (
    <AppCard style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <Text style={styles.servicePrice}>${item.price}</Text>
        </View>
        <View style={styles.serviceMeta}>
          <Text style={styles.serviceDuration}>{item.durationMinutes} min</Text>
          {!item.isActive && (
            <Text style={styles.inactiveLabel}>Inactive</Text>
          )}
        </View>
      </View>
      {item.description && (
        <Text style={styles.serviceDescription}>{item.description}</Text>
      )}
      <AppButton
        title="Edit"
        onPress={() => handleEditService(item.id)}
        variant="outline"
        size="small"
        style={styles.editButton}
      />
    </AppCard>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <AppButton
          title="Add Service"
          onPress={handleAddService}
          fullWidth
          style={styles.addButton}
        />
        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={loadServices}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    marginBottom: theme.spacing.md,
  },
  list: {
    paddingVertical: theme.spacing.sm,
  },
  serviceCard: {
    marginBottom: theme.spacing.md,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  servicePrice: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  serviceMeta: {
    alignItems: 'flex-end',
  },
  serviceDuration: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  inactiveLabel: {
    fontSize: theme.typography.caption,
    color: theme.colors.error,
    fontWeight: '600',
  },
  serviceDescription: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
});

