/**
 * Edit Service Screen
 * Create or edit a service
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { providerApi } from '../../services/providerApi';
import { Service } from '../../models/Service';
import { theme } from '../../config/theme';
import { ProviderStackParamList } from '../../navigation/types';

type EditServiceScreenRouteProp = RouteProp<ProviderStackParamList, 'EditService'>;
type EditServiceScreenNavigationProp = StackNavigationProp<ProviderStackParamList, 'EditService'>;

const serviceSchema = yup.object().shape({
  name: yup.string().required('Service name is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
  durationMinutes: yup.number().positive('Duration must be positive').required('Duration is required'),
  description: yup.string(),
});

export const EditServiceScreen: React.FC = () => {
  const route = useRoute<EditServiceScreenRouteProp>();
  const navigation = useNavigation<EditServiceScreenNavigationProp>();
  const { serviceId } = route.params || {};
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(!!serviceId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(serviceSchema),
    defaultValues: {
      name: '',
      price: '',
      durationMinutes: '',
      description: '',
    },
  });

  useEffect(() => {
    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  const loadService = async () => {
    try {
      setIsLoading(true);
      const providerId = '1'; // Mock
      const services = await providerApi.getProviderServices(providerId);
      const service = services.find(s => s.id === serviceId);
      if (service) {
        reset({
          name: service.name,
          price: service.price.toString(),
          durationMinutes: service.durationMinutes.toString(),
          description: service.description || '',
        });
      }
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const providerId = '1'; // Mock
      // Get provider type from provider profile
      const provider = await providerApi.getMyProviderProfile();
      const providerType = provider?.type || 'HAIR';
      
      const serviceData = {
        name: data.name,
        price: parseFloat(data.price),
        durationMinutes: parseInt(data.durationMinutes, 10),
        description: data.description,
        category: providerType,
      };

      if (serviceId) {
        await providerApi.updateService(providerId, serviceId, serviceData);
        Alert.alert('Success', 'Service updated', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await providerApi.createService(providerId, serviceData);
        Alert.alert('Success', 'Service created', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{serviceId ? 'Edit Service' : 'Add Service'}</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Service Name"
              placeholder="e.g., Haircut, Massage"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Price ($)"
              placeholder="0.00"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.price?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="durationMinutes"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Duration (minutes)"
              placeholder="30"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.durationMinutes?.message}
              keyboardType="number-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Description (Optional)"
              placeholder="Service description"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              multiline
              numberOfLines={4}
            />
          )}
        />

        <AppButton
          title={serviceId ? 'Update Service' : 'Create Service'}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
          style={styles.button}
        />
      </ScrollView>
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
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});

