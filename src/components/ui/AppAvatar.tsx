/**
 * Reusable Avatar component
 */

import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../../config/theme';

interface AppAvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const AppAvatar: React.FC<AppAvatarProps> = ({
  uri,
  name,
  size = 40,
  style,
}) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.avatar, avatarStyle, style]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        styles.avatarPlaceholder,
        avatarStyle,
        { backgroundColor: theme.colors.primary },
        style,
      ]}
    >
      {name && (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.primary,
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

