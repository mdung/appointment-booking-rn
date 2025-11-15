/**
 * Star Rating Component
 * For displaying and inputting ratings (1-5 stars)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../config/theme';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  showLabel?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  size = 24,
  readonly = false,
  showLabel = false,
}) => {
  const stars = [1, 2, 3, 4, 5];

  const handleStarPress = (starValue: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {stars.map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarPress(star)}
            disabled={readonly || !onRatingChange}
            activeOpacity={readonly ? 1 : 0.7}
          >
            <Text
              style={[
                styles.star,
                { fontSize: size },
                star <= rating ? styles.starFilled : styles.starEmpty,
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {showLabel && (
        <Text style={styles.label}>
          {rating > 0 ? `${rating.toFixed(1)}` : 'No rating'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: theme.spacing.sm,
  },
  star: {
    marginRight: theme.spacing.xs,
  },
  starFilled: {
    color: theme.colors.rating,
  },
  starEmpty: {
    color: theme.colors.border,
  },
  label: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

