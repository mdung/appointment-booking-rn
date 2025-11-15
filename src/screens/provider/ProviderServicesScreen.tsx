/**
 * Provider Services Screen
 * Manage services (list, add, edit, deactivate)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { ServiceActionsMenu } from '../../components/provider/ServiceActionsMenu';
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadServices();
    setIsRefreshing(false);
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

  const handleServiceLongPress = (service: Service) => {
    setSelectedService(service);
    setShowActionsMenu(true);
  };

  const handleDuplicate = async () => {
    if (!selectedService) return;
    try {
      const providerId = '1'; // Mock
      const duplicateData = {
        name: `${selectedService.name} (Copy)`,
        category: selectedService.category,
        description: selectedService.description,
        durationMinutes: selectedService.durationMinutes,
        price: selectedService.price,
      };
      await providerApi.createService(providerId, duplicateData);
      await loadServices();
      setShowActionsMenu(false);
      Alert.alert('Success', 'Service duplicated');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to duplicate service');
    }
  };

  const handleDeactivate = async () => {
    if (!selectedService) return;
    try {
      const providerId = '1'; // Mock
      await providerApi.updateService(providerId, selectedService.id, {
        isActive: false,
      });
      await loadServices();
      setShowActionsMenu(false);
      Alert.alert('Success', 'Service deactivated');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to deactivate service');
    }
  };

  const handleActivate = async () => {
    if (!selectedService) return;
    try {
      const providerId = '1'; // Mock
      await providerApi.updateService(providerId, selectedService.id, {
        isActive: true,
      });
      await loadServices();
      setShowActionsMenu(false);
      Alert.alert('Success', 'Service activated');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to activate service');
    }
  };

  const handleDelete = async () => {
    if (!selectedService) return;
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const providerId = '1'; // Mock
              await providerApi.deleteService(providerId, selectedService.id);
              await loadServices();
              setShowActionsMenu(false);
              Alert.alert('Success', 'Service deleted');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete service');
            }
          },
        },
      ]
    );
  };

  const renderService = ({ item }: { item: Service }) => (
    <TouchableOpacity
      onLongPress={() => handleServiceLongPress(item)}
      activeOpacity={0.7}
    >
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
        <View style={styles.serviceActions}>
          <AppButton
            title="Edit"
            onPress={() => handleEditService(item.id)}
            variant="outline"
            size="small"
            style={styles.editButton}
          />
        </View>
      </AppCard>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <AppButton
          title="Add Service"
          onPress={handleAddService}
          fullWidth
          style={styles.addButton}
        />
        {isLoading ? (
          <SkeletonLoader type="list" count={5} />
        ) : (
          <FlatList
            data={services}
            renderItem={renderService}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <EmptyState
                title="No Services"
                message="Add your first service to get started"
                icon="💇"
                actionLabel="Add Service"
                onAction={handleAddService}
              />
            }
          />
        )}

        <ServiceActionsMenu
          visible={showActionsMenu}
          onClose={() => setShowActionsMenu(false)}
          onDuplicate={handleDuplicate}
          onDeactivate={handleDeactivate}
          onActivate={handleActivate}
          onDelete={handleDelete}
          isActive={selectedService?.isActive ?? true}
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
  serviceActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  editButton: {
    flex: 1,
  },
});

