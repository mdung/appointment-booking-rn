/**
 * Reusable Avatar component
 */

import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { theme } from '../../config/theme';

interface AppAvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
  onPress?: () => void;
}

export const AppAvatar: React.FC<AppAvatarProps> = ({
  uri,
  name,
  size = 40,
  style,
  onPress,
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

  const AvatarContent = () => {
    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={[styles.avatar, avatarStyle]}
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

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <AvatarContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={style}>
      <AvatarContent />
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

