/**
 * Provider Profile Edit Screen
 * Create or edit provider profile
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ImagePickerButton } from '../../components/ui/ImagePickerButton';
import { useAuth } from '../../context/AuthContext';
import { providerApi } from '../../services/providerApi';
import { Provider } from '../../models/Provider';
import { theme } from '../../config/theme';
import { ProviderStackParamList } from '../../navigation/types';
import { PROVIDER_TYPES } from '../../utils/constants';

type ProviderProfileEditScreenNavigationProp = StackNavigationProp<ProviderStackParamList, 'ProviderProfileEdit'>;

const providerSchema = yup.object().shape({
  name: yup.string().required('Provider name is required'),
  description: yup.string().required('Description is required'),
  address: yup.string().required('Address is required'),
  city: yup.string(),
  state: yup.string(),
  zipCode: yup.string(),
  phone: yup.string(),
  email: yup.string().email('Invalid email'),
  minPrice: yup.number().positive('Must be positive').required('Minimum price is required'),
  maxPrice: yup.number().positive('Must be positive').required('Maximum price is required'),
});

export const ProviderProfileEditScreen: React.FC = () => {
  const navigation = useNavigation<ProviderProfileEditScreenNavigationProp>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingProvider, setExistingProvider] = useState<Provider | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(providerSchema),
    defaultValues: {
      name: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      minPrice: '',
      maxPrice: '',
      type: PROVIDER_TYPES.HAIR,
    },
  });

  useEffect(() => {
    loadProviderProfile();
  }, []);

  const loadProviderProfile = async () => {
    try {
      setIsLoading(true);
      const provider = await providerApi.getMyProviderProfile();
      if (provider) {
        setExistingProvider(provider);
        setPhotos(provider.photos || []);
        reset({
          name: provider.name,
          description: provider.description,
          address: provider.address,
          city: provider.city || '',
          state: provider.state || '',
          zipCode: provider.zipCode || '',
          phone: provider.phone || '',
          email: provider.email || '',
          minPrice: provider.priceRange.min.toString(),
          maxPrice: provider.priceRange.max.toString(),
          type: provider.type,
        });
      }
    } catch (error) {
      console.error('Error loading provider profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      const providerData = {
        name: data.name,
        type: data.type,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        phone: data.phone,
        email: data.email,
        priceRange: {
          min: parseFloat(data.minPrice),
          max: parseFloat(data.maxPrice),
        },
        photos,
      };

      if (existingProvider) {
        await providerApi.updateProvider(existingProvider.id, providerData);
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await providerApi.createProvider(providerData);
        Alert.alert('Success', 'Profile created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
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
        <Text style={styles.title}>
          {existingProvider ? 'Edit Provider Profile' : 'Create Provider Profile'}
        </Text>

        <View style={styles.photosSection}>
          <Text style={styles.sectionLabel}>Photos</Text>
          <ImagePickerButton
            currentImageUri={photos[0]}
            onImageSelected={(uri) => setPhotos([uri, ...photos.slice(1)])}
            label="Add Photo"
            size={120}
          />
          {photos.length > 0 && (
            <AppButton
              title="Remove Photo"
              onPress={() => setPhotos(photos.slice(1))}
              variant="outline"
              size="small"
              style={styles.removeButton}
            />
          )}
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Provider Name"
              placeholder="e.g., Elite Hair Salon"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Description"
              placeholder="Describe your business..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Address"
              placeholder="Street address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.address?.message}
            />
          )}
        />

        <View style={styles.row}>
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                label="City"
                placeholder="City"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.city?.message}
                containerStyle={styles.halfWidth}
              />
            )}
          />
          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                label="State"
                placeholder="State"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.state?.message}
                containerStyle={styles.halfWidth}
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="zipCode"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Zip Code"
              placeholder="Zip code"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.zipCode?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Phone"
              placeholder="Phone number"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.phone?.message}
              keyboardType="phone-pad"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Email (Optional)"
              placeholder="Business email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />

        <View style={styles.row}>
          <Controller
            control={control}
            name="minPrice"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                label="Min Price ($)"
                placeholder="0"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.minPrice?.message}
                keyboardType="decimal-pad"
                containerStyle={styles.halfWidth}
              />
            )}
          />
          <Controller
            control={control}
            name="maxPrice"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppTextInput
                label="Max Price ($)"
                placeholder="0"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.maxPrice?.message}
                keyboardType="decimal-pad"
                containerStyle={styles.halfWidth}
              />
            )}
          />
        </View>

        <AppButton
          title={existingProvider ? 'Update Profile' : 'Create Profile'}
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
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  photosSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  removeButton: {
    marginTop: theme.spacing.sm,
  },
});

