/**
 * Admin Users Screen
 * List and manage users
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Alert } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { adminApi } from '../../services/adminApi';
import { User } from '../../models/User';
import { theme } from '../../config/theme';

export const AdminUsersScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await adminApi.updateUser(userId, { isActive: !isActive } as any);
      await loadUsers();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update user');
    }
  };

  const renderUser = ({ item }: { item: User }) => (
    <AppCard style={styles.userCard}>
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userRole}>{item.role}</Text>
        </View>
        <Switch
          value={true} // TODO: Add isActive to User model
          onValueChange={() => handleToggleActive(item.id, true)}
        />
      </View>
    </AppCard>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={loadUsers}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: theme.spacing.sm,
  },
  userCard: {
    marginBottom: theme.spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userRole: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

