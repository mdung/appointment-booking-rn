/**
 * Payment API service
 */

import { apiClient } from './apiClient';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  clientSecret?: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  paymentMethod: string;
  createdAt: string;
}

export const paymentApi = {
  /**
   * Get payment methods
   */
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    try {
      return await apiClient.get<PaymentMethod[]>('/payments/methods');
    } catch (error) {
      // Fallback to mock data
      return [];
    }
  },

  /**
   * Add payment method
   */
  addPaymentMethod: async (methodData: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    try {
      return await apiClient.post<PaymentMethod>('/payments/methods', methodData);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete payment method
   */
  deletePaymentMethod: async (methodId: string): Promise<void> => {
    try {
      await apiClient.delete(`/payments/methods/${methodId}`);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create payment intent for booking
   */
  createPaymentIntent: async (bookingId: string, amount: number): Promise<PaymentIntent> => {
    try {
      return await apiClient.post<PaymentIntent>('/payments/intent', {
        bookingId,
        amount,
        currency: 'USD',
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Confirm payment
   */
  confirmPayment: async (intentId: string, paymentMethodId: string): Promise<Transaction> => {
    try {
      return await apiClient.post<Transaction>('/payments/confirm', {
        intentId,
        paymentMethodId,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get transaction history
   */
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      return await apiClient.get<Transaction[]>('/payments/transactions');
    } catch (error) {
      // Fallback to mock data
      return [];
    }
  },

  /**
   * Request refund
   */
  requestRefund: async (transactionId: string, reason?: string): Promise<Transaction> => {
    try {
      return await apiClient.post<Transaction>(`/payments/refund`, {
        transactionId,
        reason,
      });
    } catch (error) {
      throw error;
    }
  },
};

