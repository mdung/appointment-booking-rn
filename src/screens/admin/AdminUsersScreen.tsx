/**
 * Admin Users Screen
 * List and manage users
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Alert, TouchableOpacity, RefreshControl } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';
import { SkeletonLoader } from '../../components/ui/SkeletonLoader';
import { AdminSearchBar } from '../../components/admin/AdminSearchBar';
import { BulkActionsBar } from '../../components/admin/BulkActionsBar';
import { adminApi } from '../../services/adminApi';
import { User } from '../../models/User';
import { theme } from '../../config/theme';
import { exportUsers, downloadFile } from '../../utils/exportUtils';

export const AdminUsersScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await loadUsers();
    setIsRefreshing(false);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedUsers(new Set(filteredUsers.map((u) => u.id)));
  };

  const handleDeselectAll = () => {
    setSelectedUsers(new Set());
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.size === 0) return;

    switch (action) {
      case 'activate':
        await handleBulkActivate();
        break;
      case 'deactivate':
        await handleBulkDeactivate();
        break;
      case 'export':
        await handleExport();
        break;
    }
  };

  const handleBulkActivate = async () => {
    try {
      await Promise.all(
        Array.from(selectedUsers).map((userId) =>
          adminApi.updateUserStatus(userId, { isActive: true })
        )
      );
      await loadUsers();
      setSelectedUsers(new Set());
      Alert.alert('Success', `${selectedUsers.size} users activated`);
    } catch (error) {
      Alert.alert('Error', 'Failed to activate users');
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      await Promise.all(
        Array.from(selectedUsers).map((userId) =>
          adminApi.updateUserStatus(userId, { isActive: false })
        )
      );
      await loadUsers();
      setSelectedUsers(new Set());
      Alert.alert('Success', `${selectedUsers.size} users deactivated`);
    } catch (error) {
      Alert.alert('Error', 'Failed to deactivate users');
    }
  };

  const handleExport = async () => {
    try {
      const usersToExport = filteredUsers.filter((u) => selectedUsers.has(u.id));
      const csv = exportUsers(usersToExport);
      await downloadFile(csv, 'users.csv', 'text/csv');
      Alert.alert('Success', 'Users exported successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to export users');
    }
  };

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

  const renderUser = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.has(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleUserSelection(item.id)}
        onLongPress={() => toggleUserSelection(item.id)}
      >
        <AppCard
          style={[
            styles.userCard,
            isSelected && styles.selectedCard,
          ]}
        >
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <Text style={styles.userRole}>{item.role}</Text>
            <View style={styles.userStatus}>
              <Text
                style={[
                  styles.statusText,
                  item.isActive ? styles.activeText : styles.inactiveText,
                ]}
              >
                {item.isActive ? '✓ Active' : '✗ Inactive'}
              </Text>
            </View>
          </View>
          {isSelected && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </AppCard>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Users</Text>
        
        <AdminSearchBar
          onSearch={handleSearch}
          placeholder="Search users by name, email, or phone..."
        />

        {selectedUsers.size > 0 && (
          <BulkActionsBar
            selectedCount={selectedUsers.size}
            totalCount={filteredUsers.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onBulkAction={handleBulkAction}
            actions={[
              { label: 'Activate', action: 'activate', variant: 'primary' },
              { label: 'Deactivate', action: 'deactivate', variant: 'outline' },
              { label: 'Export', action: 'export', variant: 'outline' },
            ]}
          />
        )}

        {isLoading ? (
          <SkeletonLoader type="list" count={5} />
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <EmptyState
                title="No Users Found"
                message={searchQuery ? "No users match your search" : "No users in the system"}
                icon="👥"
              />
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.h2,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  list: {
    paddingVertical: theme.spacing.sm,
  },
  userCard: {
    marginBottom: theme.spacing.md,
    position: 'relative',
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
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
    marginBottom: theme.spacing.xs,
  },
  userStatus: {
    marginTop: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.typography.bodySmall,
    fontWeight: '600',
  },
  activeText: {
    color: theme.colors.success,
  },
  inactiveText: {
    color: theme.colors.error,
  },
  checkmark: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

