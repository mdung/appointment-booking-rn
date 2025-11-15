/**
 * Image Upload API service
 */

import { apiClient } from './apiClient';
import { ImagePickerResult } from '../utils/imagePicker';

/**
 * Upload image to server
 * Returns the URL of the uploaded image
 */
export const uploadImage = async (image: ImagePickerResult): Promise<string> => {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.name || 'image.jpg',
    } as any);

    // Upload to server
    const response = await apiClient.post<{ url: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.url;
  } catch (error) {
    // Fallback: return local URI for development
    console.error('Image upload error:', error);
    return image.uri;
  }
};

/**
 * Upload multiple images
 */
export const uploadImages = async (images: ImagePickerResult[]): Promise<string[]> => {
  try {
    const uploadPromises = images.map(image => uploadImage(image));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading images:', error);
    return images.map(img => img.uri);
  }
};

/**
 * Delete image from server
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    await apiClient.delete('/upload/image', {
      params: { url: imageUrl },
    });
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

