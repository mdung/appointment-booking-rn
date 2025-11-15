/**
 * Reusable Badge component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

interface AppBadgeProps {
  text: string;
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'default';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const AppBadge: React.FC<AppBadgeProps> = ({
  text,
  variant = 'default',
  size = 'medium',
  style,
}) => {
  return (
    <View style={[styles.badge, styles[`badge_${variant}`], styles[`badge_${size}`], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`]]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  badge_primary: {
    backgroundColor: theme.colors.primaryLight,
  },
  badge_success: {
    backgroundColor: theme.colors.success + '20',
  },
  badge_error: {
    backgroundColor: theme.colors.error + '20',
  },
  badge_warning: {
    backgroundColor: theme.colors.warning + '20',
  },
  badge_info: {
    backgroundColor: theme.colors.info + '20',
  },
  badge_default: {
    backgroundColor: theme.colors.backgroundTertiary,
  },
  badge_small: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
  },
  badge_medium: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  text: {
    fontWeight: '600',
  },
  text_primary: {
    color: theme.colors.primaryDark,
  },
  text_success: {
    color: theme.colors.success,
  },
  text_error: {
    color: theme.colors.error,
  },
  text_warning: {
    color: theme.colors.warning,
  },
  text_info: {
    color: theme.colors.info,
  },
  text_default: {
    color: theme.colors.text,
  },
  text_small: {
    fontSize: theme.typography.tiny,
  },
  text_medium: {
    fontSize: theme.typography.caption,
  },
});

