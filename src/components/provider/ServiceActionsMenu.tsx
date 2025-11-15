/**
 * Service Actions Menu Component
 * Actions for service management (duplicate, deactivate, delete, etc.)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AppButton } from '../ui/AppButton';
import { theme } from '../../config/theme';

interface ServiceActionsMenuProps {
  visible: boolean;
  onClose: () => void;
  onDuplicate: () => void;
  onDeactivate: () => void;
  onActivate: () => void;
  onDelete: () => void;
  isActive: boolean;
}

export const ServiceActionsMenu: React.FC<ServiceActionsMenuProps> = ({
  visible,
  onClose,
  onDuplicate,
  onDeactivate,
  onActivate,
  onDelete,
  isActive,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.menu}>
          <Text style={styles.menuTitle}>Service Actions</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={onDuplicate}>
            <Text style={styles.menuItemText}>📋 Duplicate Service</Text>
          </TouchableOpacity>

          {isActive ? (
            <TouchableOpacity style={styles.menuItem} onPress={onDeactivate}>
              <Text style={styles.menuItemText}>⏸️ Deactivate</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.menuItem} onPress={onActivate}>
              <Text style={styles.menuItemText}>▶️ Activate</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.menuItem, styles.dangerItem]}
            onPress={onDelete}
          >
            <Text style={[styles.menuItemText, styles.dangerText]}>
              🗑️ Delete Service
            </Text>
          </TouchableOpacity>

          <AppButton
            title="Cancel"
            onPress={onClose}
            variant="outline"
            fullWidth
            style={styles.cancelButton}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  menuTitle: {
    fontSize: theme.typography.h4,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  menuItem: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    marginBottom: theme.spacing.sm,
  },
  menuItemText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  dangerItem: {
    backgroundColor: theme.colors.error + '20',
  },
  dangerText: {
    color: theme.colors.error,
  },
  cancelButton: {
    marginTop: theme.spacing.md,
  },
});

