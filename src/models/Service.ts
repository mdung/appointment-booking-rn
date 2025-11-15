/**
 * Service model and types
 */

import { ProviderType } from '../utils/constants';

export interface Service {
  id: string;
  providerId: string;
  name: string;
  category: ProviderType;
  description?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceData {
  name: string;
  category: ProviderType;
  description?: string;
  durationMinutes: number;
  price: number;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {
  isActive?: boolean;
}

