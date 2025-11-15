/**
 * User model and types
 */

import { UserRole } from '../utils/constants';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

