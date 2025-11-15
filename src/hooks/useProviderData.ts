/**
 * useProviderData hook
 * Custom hook for provider data operations
 */

import { useState, useEffect } from 'react';
import { providerApi } from '../services/providerApi';
import { Provider } from '../models/Provider';
import { ProviderType } from '../utils/constants';

export const useProviderData = (providerId?: string) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (providerId) {
      loadProvider();
    }
  }, [providerId]);

  const loadProvider = async () => {
    if (!providerId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await providerApi.getProviderById(providerId);
      setProvider(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    provider,
    isLoading,
    error,
    refresh: loadProvider,
  };
};

