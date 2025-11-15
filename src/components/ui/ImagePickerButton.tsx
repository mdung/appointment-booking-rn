/**
 * Image Picker Button Component
 */

import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { AppButton } from './AppButton';
import { showImagePickerOptions } from '../../utils/imagePicker';
import { uploadImage } from '../../services/imageUploadApi';
import { theme } from '../../config/theme';

interface ImagePickerButtonProps {
  currentImageUri?: string;
  onImageSelected: (imageUri: string) => void;
  label?: string;
  size?: number;
  circular?: boolean;
}

export const ImagePickerButton: React.FC<ImagePickerButtonProps> = ({
  currentImageUri,
  onImageSelected,
  label = 'Select Image',
  size = 100,
  circular = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handlePickImage = async () => {
    const image = await showImagePickerOptions();
    if (image) {
      try {
        setIsUploading(true);
        const uploadedUrl = await uploadImage(image);
        onImageSelected(uploadedUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {currentImageUri && (
        <Image
          source={{ uri: currentImageUri }}
          style={[
            styles.image,
            { width: size, height: size },
            circular && { borderRadius: size / 2 },
          ]}
        />
      )}
      {isUploading ? (
        <View style={[styles.uploadingContainer, { width: size, height: size }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <AppButton
          title={currentImageUri ? 'Change Image' : label}
          onPress={handlePickImage}
          variant="outline"
          size="small"
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  image: {
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundTertiary,
  },
  uploadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  button: {
    marginTop: theme.spacing.xs,
  },
});

