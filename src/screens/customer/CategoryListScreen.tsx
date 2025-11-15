/**
 * Category List Screen
 * Shows providers filtered by category
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { ProviderListScreen } from './ProviderListScreen';
import { CustomerStackParamList } from '../../navigation/types';

type CategoryListScreenRouteProp = RouteProp<CustomerStackParamList, 'CategoryList'>;

export const CategoryListScreen: React.FC = () => {
  const route = useRoute<CategoryListScreenRouteProp>();
  const { category } = route.params;

  // Reuse ProviderListScreen with category filter
  return <ProviderListScreen category={category} />;
};

