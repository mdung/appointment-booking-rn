/**
 * Security Service
 * Token refresh, biometric authentication, session management
 */

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';
import { STORAGE_KEYS } from '../utils/constants';

export interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

class SecurityService {
  private refreshTokenTimer: NodeJS.Timeout | null = null;
  private sessionTimeoutTimer: NodeJS.Timeout | null = null;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  /**
   * Check if biometric authentication is available
   */
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) return false;

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return enrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  }

  /**
   * Authenticate with biometrics
   */
  async authenticateWithBiometrics(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  /**
   * Store sensitive data securely
   */
  async storeSecureData(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing secure data:', error);
      throw error;
    }
  }

  /**
   * Get sensitive data securely
   */
  async getSecureData(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error getting secure data:', error);
      return null;
    }
  }

  /**
   * Delete secure data
   */
  async deleteSecureData(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error deleting secure data:', error);
    }
  }

  /**
   * Refresh auth token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getSecureData('refresh_token');
      if (!refreshToken) {
        return null;
      }

      const response = await apiClient.post<TokenRefreshResponse>('/auth/refresh', {
        refreshToken,
      });

      // Store new tokens
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
      await this.storeSecureData('refresh_token', response.refreshToken);

      // Set up next refresh
      this.scheduleTokenRefresh(response.expiresIn);

      return response.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear tokens on refresh failure
      await this.clearTokens();
      return null;
    }
  }

  /**
   * Schedule token refresh
   */
  scheduleTokenRefresh(expiresIn: number): void {
    // Clear existing timer
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
    }

    // Refresh 5 minutes before expiration
    const refreshTime = (expiresIn - 300) * 1000;
    this.refreshTokenTimer = setTimeout(() => {
      this.refreshToken();
    }, refreshTime);
  }

  /**
   * Start session timeout
   */
  startSessionTimeout(onTimeout: () => void): void {
    this.clearSessionTimeout();
    this.sessionTimeoutTimer = setTimeout(() => {
      onTimeout();
    }, this.SESSION_TIMEOUT);
  }

  /**
   * Clear session timeout
   */
  clearSessionTimeout(): void {
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
      this.sessionTimeoutTimer = null;
    }
  }

  /**
   * Reset session timeout (call on user activity)
   */
  resetSessionTimeout(onTimeout: () => void): void {
    this.startSessionTimeout(onTimeout);
  }

  /**
   * Clear all tokens
   */
  async clearTokens(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    await this.deleteSecureData('refresh_token');
  }

  /**
   * Cleanup timers
   */
  cleanup(): void {
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
    }
    if (this.sessionTimeoutTimer) {
      clearTimeout(this.sessionTimeoutTimer);
    }
  }
}

export const securityService = new SecurityService();

