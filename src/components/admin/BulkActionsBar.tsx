/**
 * Bulk Actions Bar Component
 * For selecting multiple items and performing bulk operations
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { theme } from '../../config/theme';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkAction: (action: string) => void;
  actions?: Array<{ label: string; action: string; variant?: 'primary' | 'outline' | 'danger' }>;
}

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onBulkAction,
  actions = [],
}) => {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.selectionInfo}>
        <Text style={styles.countText}>
          {selectedCount} of {totalCount} selected
        </Text>
        <TouchableOpacity onPress={allSelected ? onDeselectAll : onSelectAll}>
          <Text style={styles.selectAllText}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
      </View>
      {selectedCount > 0 && (
        <View style={styles.actionsRow}>
          {actions.map((action) => (
            <AppButton
              key={action.action}
              title={action.label}
              onPress={() => onBulkAction(action.action)}
              variant={action.variant || 'outline'}
              size="small"
              style={styles.actionButton}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  countText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  selectAllText: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
  },
  actionButton: {
    marginRight: theme.spacing.xs,
  },
});

