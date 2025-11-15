/**
 * Skeleton Loader Component
 * Shows loading placeholders
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { theme } from '../../config/theme';

interface SkeletonLoaderProps {
  type?: 'list' | 'card' | 'detail' | 'custom';
  count?: number;
  children?: React.ReactNode;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'list',
  count = 3,
  children,
}) => {
  if (children) {
    return (
      <SkeletonPlaceholder
        backgroundColor={theme.colors.backgroundTertiary}
        highlightColor={theme.colors.backgroundSecondary}
      >
        {children}
      </SkeletonPlaceholder>
    );
  }

  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.avatar} />
                <View style={styles.content}>
                  <View style={styles.title} />
                  <View style={styles.subtitle} />
                </View>
              </View>
            ))}
          </>
        );
      case 'card':
        return (
          <>
            {Array.from({ length: count }).map((_, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <View style={styles.cardTitle} />
                  <View style={styles.cardSubtitle} />
                </View>
              </View>
            ))}
          </>
        );
      case 'detail':
        return (
          <View style={styles.detail}>
            <View style={styles.detailHeader} />
            <View style={styles.detailContent}>
              <View style={styles.detailLine} />
              <View style={styles.detailLine} />
              <View style={styles.detailLineShort} />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SkeletonPlaceholder
      backgroundColor={theme.colors.backgroundTertiary}
      highlightColor={theme.colors.backgroundSecondary}
    >
      {renderSkeleton()}
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    width: '70%',
    height: 16,
    borderRadius: 4,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    width: '50%',
    height: 14,
    borderRadius: 4,
  },
  card: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  cardTitle: {
    width: '80%',
    height: 18,
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
  },
  cardSubtitle: {
    width: '60%',
    height: 14,
    borderRadius: 4,
  },
  detail: {
    padding: theme.spacing.lg,
  },
  detailHeader: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  detailContent: {
    width: '100%',
  },
  detailLine: {
    width: '100%',
    height: 16,
    borderRadius: 4,
    marginBottom: theme.spacing.md,
  },
  detailLineShort: {
    width: '60%',
    height: 16,
    borderRadius: 4,
  },
});

