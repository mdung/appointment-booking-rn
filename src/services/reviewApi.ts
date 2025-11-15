/**
 * Review API service
 */

import { apiClient } from './apiClient';
import { Review, CreateReviewData, UpdateReviewData } from '../models/Review';

export const reviewApi = {
  /**
   * Get reviews for a provider
   */
  getProviderReviews: async (providerId: string): Promise<Review[]> => {
    try {
      return await apiClient.get<Review[]>(`/providers/${providerId}/reviews`);
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              bookingId: '1',
              userId: '1',
              providerId,
              rating: 5,
              comment: 'Great service!',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ]);
        }, 500);
      });
    }
  },

  /**
   * Get review by ID
   */
  getReviewById: async (id: string): Promise<Review> => {
    try {
      return await apiClient.get<Review>(`/reviews/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a review
   */
  createReview: async (data: CreateReviewData): Promise<Review> => {
    try {
      return await apiClient.post<Review>('/reviews', data);
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 'new_' + Date.now(),
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }, 500);
      });
    }
  },

  /**
   * Update a review
   */
  updateReview: async (id: string, data: UpdateReviewData): Promise<Review> => {
    try {
      return await apiClient.patch<Review>(`/reviews/${id}`, data);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a review
   */
  deleteReview: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/reviews/${id}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's reviews
   */
  getMyReviews: async (): Promise<Review[]> => {
    try {
      return await apiClient.get<Review[]>('/reviews/me');
    } catch (error) {
      // Fallback to mock data for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, 500);
      });
    }
  },
};

