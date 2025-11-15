/**
 * Review Submission Screen
 * Allows customers to submit reviews after completed appointments
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { StarRating } from '../../components/ui/StarRating';
import { reviewApi } from '../../services/reviewApi';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';

type ReviewSubmissionScreenRouteProp = RouteProp<CustomerStackParamList, 'ReviewSubmission'>;
type ReviewSubmissionScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'ReviewSubmission'>;

const reviewSchema = yup.object().shape({
  rating: yup.number().min(1, 'Please select a rating').max(5).required('Rating is required'),
  comment: yup.string().required('Please write a review'),
});

export const ReviewSubmissionScreen: React.FC = () => {
  const route = useRoute<ReviewSubmissionScreenRouteProp>();
  const navigation = useNavigation<ReviewSubmissionScreenNavigationProp>();
  const { bookingId, providerId } = route.params || {};

  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: {
      comment: '',
    },
  });

  const onSubmit = async (data: { comment: string }) => {
    if (!bookingId || !providerId) {
      Alert.alert('Error', 'Missing booking or provider information');
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewApi.createReview({
        bookingId,
        providerId,
        rating,
        comment: data.comment,
      });
      Alert.alert('Success', 'Thank you for your review!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Write a Review</Text>
        <Text style={styles.subtitle}>Share your experience</Text>

        <View style={styles.ratingSection}>
          <Text style={styles.label}>Rating</Text>
          <StarRating
            rating={rating}
            onRatingChange={setRating}
            size={40}
          />
          {errors.rating && (
            <Text style={styles.errorText}>{errors.rating.message}</Text>
          )}
        </View>

        <Controller
          control={control}
          name="comment"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              label="Your Review"
              placeholder="Tell others about your experience..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.comment?.message}
              multiline
              numberOfLines={6}
              style={styles.commentInput}
            />
          )}
        />

        <AppButton
          title="Submit Review"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={rating === 0}
          fullWidth
          style={styles.button}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.h2,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  ratingSection: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  commentInput: {
    minHeight: 120,
  },
  button: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

