/**
 * Error Handler Tests
 * Unit tests for error handling utilities
 */

import { handleApiError, isOnline, retryApiCall, AppError } from '../../utils/errorHandler';

// Mock NetInfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(),
}));

describe('Error Handler', () => {
  describe('handleApiError', () => {
    it('should handle network errors', () => {
      const error = { response: null };
      const result = handleApiError(error);
      expect(result.retryable).toBe(true);
      expect(result.code).toBe('NETWORK_ERROR');
    });

    it('should handle 401 errors', () => {
      const error = { response: { status: 401 } };
      const result = handleApiError(error);
      expect(result.status).toBe(401);
      expect(result.retryable).toBe(false);
    });

    it('should handle 500 errors as retryable', () => {
      const error = { response: { status: 500 } };
      const result = handleApiError(error);
      expect(result.status).toBe(500);
      expect(result.retryable).toBe(true);
    });
  });

  describe('retryApiCall', () => {
    it('should retry failed calls', async () => {
      let attempts = 0;
      const apiCall = jest.fn(async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Failed');
        }
        return 'success';
      });

      const result = await retryApiCall(apiCall, 3);
      expect(result).toBe('success');
      expect(attempts).toBe(2);
    });

    it('should throw after max retries', async () => {
      const apiCall = jest.fn(async () => {
        throw new Error('Failed');
      });

      await expect(retryApiCall(apiCall, 2)).rejects.toThrow();
      expect(apiCall).toHaveBeenCalledTimes(2);
    });
  });
});

