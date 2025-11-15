/**
 * Performance Utilities
 * Image optimization, caching, list virtualization
 */

import { Image } from 'react-native';
import { CacheManager } from 'react-native-expo-image-cache';

/**
 * Image cache configuration
 */
export const configureImageCache = () => {
  // Configure image cache settings
  // This is a placeholder - actual implementation depends on the image caching library
};

/**
 * Preload images
 */
export const preloadImages = async (urls: string[]): Promise<void> => {
  try {
    await Promise.all(
      urls.map((url) => {
        return Image.prefetch(url).catch((error) => {
          console.warn(`Failed to preload image: ${url}`, error);
        });
      })
    );
  } catch (error) {
    console.error('Error preloading images:', error);
  }
};

/**
 * Get optimized image URL
 */
export const getOptimizedImageUrl = (
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // In production, this would use an image CDN or optimization service
  // For now, return the original URL
  if (width || height) {
    // Example: Add query parameters for image optimization
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', quality.toString());
    return `${url}?${params.toString()}`;
  }
  return url;
};

/**
 * Clear image cache
 */
export const clearImageCache = async (): Promise<void> => {
  try {
    // Clear image cache
    // Implementation depends on the caching library used
    console.log('Image cache cleared');
  } catch (error) {
    console.error('Error clearing image cache:', error);
  }
};

/**
 * List virtualization helper
 * Use React Native's FlatList with proper configuration for large lists
 */
export const getListOptimizationProps = (itemCount: number) => {
  return {
    // Use windowSize for better performance
    windowSize: 10,
    // Initial number of items to render
    initialNumToRender: 10,
    // Maximum number of items to render per batch
    maxToRenderPerBatch: 10,
    // Number of items to render outside visible area
    updateCellsBatchingPeriod: 50,
    // Remove clipped subviews for better performance
    removeClippedSubviews: true,
    // Use getItemLayout if item heights are fixed
    // getItemLayout: (data: any, index: number) => ({
    //   length: ITEM_HEIGHT,
    //   offset: ITEM_HEIGHT * index,
    //   index,
    // }),
  };
};

