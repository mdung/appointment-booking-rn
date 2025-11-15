/**
 * Provider Filters Component
 * Filter providers by price, rating, etc.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { AppTextInput } from '../ui/AppTextInput';
import { theme } from '../../config/theme';

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: 'rating' | 'price' | 'name' | 'distance';
  sortOrder?: 'asc' | 'desc';
}

interface ProviderFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const ProviderFilters: React.FC<ProviderFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setIsVisible(false);
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {};
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    setIsVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.filterButtonText}>Filters</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter Providers</Text>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceRow}>
                <AppTextInput
                  placeholder="Min"
                  value={localFilters.minPrice?.toString() || ''}
                  onChangeText={(text) =>
                    setLocalFilters({
                      ...localFilters,
                      minPrice: text ? parseFloat(text) : undefined,
                    })
                  }
                  keyboardType="decimal-pad"
                  style={styles.priceInput}
                />
                <Text style={styles.priceSeparator}>-</Text>
                <AppTextInput
                  placeholder="Max"
                  value={localFilters.maxPrice?.toString() || ''}
                  onChangeText={(text) =>
                    setLocalFilters({
                      ...localFilters,
                      maxPrice: text ? parseFloat(text) : undefined,
                    })
                  }
                  keyboardType="decimal-pad"
                  style={styles.priceInput}
                />
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Minimum Rating</Text>
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingButton,
                      localFilters.minRating === rating && styles.ratingButtonActive,
                    ]}
                    onPress={() =>
                      setLocalFilters({
                        ...localFilters,
                        minRating: localFilters.minRating === rating ? undefined : rating,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.ratingButtonText,
                        localFilters.minRating === rating && styles.ratingButtonTextActive,
                      ]}
                    >
                      {rating}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Sort By</Text>
              <View style={styles.sortRow}>
                {(['rating', 'price', 'name'] as const).map((sort) => (
                  <TouchableOpacity
                    key={sort}
                    style={[
                      styles.sortButton,
                      localFilters.sortBy === sort && styles.sortButtonActive,
                    ]}
                    onPress={() =>
                      setLocalFilters({
                        ...localFilters,
                        sortBy: localFilters.sortBy === sort ? undefined : sort,
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        localFilters.sortBy === sort && styles.sortButtonTextActive,
                      ]}
                    >
                      {sort.charAt(0).toUpperCase() + sort.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <AppButton
                title="Reset"
                onPress={handleReset}
                variant="outline"
                style={styles.actionButton}
              />
              <AppButton
                title="Apply"
                onPress={handleApply}
                style={styles.actionButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonText: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: theme.typography.h3,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  filterSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
  },
  priceSeparator: {
    marginHorizontal: theme.spacing.md,
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  ratingButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  ratingButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  ratingButtonText: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  ratingButtonTextActive: {
    color: '#FFFFFF',
  },
  sortRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  sortButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  sortButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortButtonText: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '600',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
});

