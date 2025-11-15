/**
 * Error Handler Utility
 * Centralized error handling with retry mechanisms and offline support
 */

import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import i18n from '../i18n';

export interface ErrorInfo {
  message: string;
  code?: string;
  status?: number;
  retryable?: boolean;
}

export class AppError extends Error {
  code?: string;
  status?: number;
  retryable: boolean;

  constructor(message: string, code?: string, status?: number, retryable = false) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.retryable = retryable;
  }
}

/**
 * Check if device is online
 */
export const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
};

/**
 * Handle API errors with user-friendly messages
 */
export const handleApiError = (error: any): ErrorInfo => {
  if (!error.response) {
    // Network error
    return {
      message: i18n.t('errors.networkError'),
      code: 'NETWORK_ERROR',
      retryable: true,
    };
  }

  const status = error.response.status;
  let message = i18n.t('errors.serverError');
  let retryable = false;

  switch (status) {
    case 400:
      message = error.response.data?.message || i18n.t('errors.validationError');
      break;
    case 401:
      message = i18n.t('errors.unauthorized');
      break;
    case 404:
      message = i18n.t('errors.notFound');
      break;
    case 500:
    case 502:
    case 503:
      message = i18n.t('errors.serverError');
      retryable = true;
      break;
    default:
      message = error.response.data?.message || i18n.t('errors.serverError');
  }

  return {
    message,
    code: `HTTP_${status}`,
    status,
    retryable,
  };
};

/**
 * Retry mechanism for failed API calls
 */
export const retryApiCall = async <T>(
  apiCall: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      const errorInfo = handleApiError(error);

      if (!errorInfo.retryable || attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
};

/**
 * Show error alert to user
 */
export const showErrorAlert = (error: ErrorInfo, onRetry?: () => void) => {
  const buttons: any[] = [{ text: i18n.t('common.close') }];

  if (error.retryable && onRetry) {
    buttons.push({
      text: 'Retry',
      onPress: onRetry,
    });
  }

  Alert.alert(i18n.t('common.error'), error.message, buttons);
};

/**
 * Handle offline mode
 */
export const handleOfflineMode = async (): Promise<boolean> => {
  const online = await isOnline();
  if (!online) {
    Alert.alert(
      i18n.t('errors.offline'),
      'Some features may not work while offline.',
      [{ text: i18n.t('common.close') }]
    );
    return false;
  }
  return true;
};

