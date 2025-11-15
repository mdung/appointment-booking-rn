/**
 * Admin Search Bar Component
 * Search and filter functionality for admin screens
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppTextInput } from '../ui/AppTextInput';
import { AppButton } from '../ui/AppButton';
import { AppCard } from '../ui/AppCard';
import { theme } from '../../config/theme';
import { debounce } from '../../utils/debounce';

interface AdminSearchBarProps {
  onSearch: (query: string) => void;
  onFilter?: () => void;
  placeholder?: string;
  showFilter?: boolean;
}

export const AdminSearchBar: React.FC<AdminSearchBarProps> = ({
  onSearch,
  onFilter,
  placeholder = 'Search...',
  showFilter = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = debounce((query: string) => {
    onSearch(query);
  }, 300);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      <AppCard style={styles.searchCard}>
        <View style={styles.searchRow}>
          <AppTextInput
            placeholder={placeholder}
            value={searchQuery}
            onChangeText={handleSearchChange}
            style={styles.searchInput}
          />
          {showFilter && onFilter && (
            <AppButton
              title="Filter"
              onPress={onFilter}
              variant="outline"
              size="small"
              style={styles.filterButton}
            />
          )}
        </View>
      </AppCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  searchCard: {
    padding: theme.spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
  },
  filterButton: {
    minWidth: 80,
  },
});

