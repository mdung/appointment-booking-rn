/**
 * User Context
 * Manages current user profile and related data
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UpdateProfileData } from '../models/User';
import { authApi } from '../services/authApi';
import { useAuth } from './AuthContext';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(authUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const updatedUser = await authApi.getCurrentUser();
      setUser(updatedUser);
      updateUser(updatedUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setIsLoading(true);
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
      updateUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserContextType = {
    user,
    isLoading,
    refreshUser,
    updateProfile,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

