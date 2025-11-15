/**
 * Settings Screen
 * App settings, preferences, and account management
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../config/theme';
import { changeLanguage, getCurrentLanguage, getAvailableLanguages } from '../../i18n';
import { useTranslation } from 'react-i18next';
import { securityService } from '../../services/securityService';
import { useState, useEffect } from 'react';

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState(getCurrentLanguage());
  const [darkMode, setDarkMode] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await securityService.isBiometricAvailable();
    setBiometricAvailable(available);
  };

  const handleLanguageChange = async (newLanguage: string) => {
    await changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement account deletion
            Alert.alert('Account Deletion', 'Account deletion feature coming soon');
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Settings</Text>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>Receive app notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          {notificationsEnabled && (
            <>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Email Notifications</Text>
                  <Text style={styles.settingDescription}>Receive email updates</Text>
                </View>
                <Switch
                  value={emailNotifications}
                  onValueChange={setEmailNotifications}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Receive push notifications</Text>
                </View>
                <Switch
                  value={pushNotifications}
                  onValueChange={setPushNotifications}
                />
              </View>
            </>
          )}
        </AppCard>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{t('settings.language')}</Text>
              <Text style={styles.settingDescription}>
                {getAvailableLanguages().map(lang => lang.toUpperCase()).join(', ')}
              </Text>
            </View>
            {getAvailableLanguages().map((lang) => (
              <AppButton
                key={lang}
                title={lang.toUpperCase()}
                onPress={() => handleLanguageChange(lang)}
                variant={language === lang ? 'primary' : 'outline'}
                size="small"
                style={styles.languageButton}
              />
            ))}
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Use dark theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>
        </AppCard>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <AppButton
            title="Edit Profile"
            onPress={() => {
              // Navigate to profile edit
              if (user?.role === 'PROVIDER') {
                navigation.navigate('Provider' as any, { screen: 'ProviderProfileEdit' });
              }
            }}
            variant="outline"
            fullWidth
            style={styles.accountButton}
          />

          <AppButton
            title="Change Password"
            onPress={() => Alert.alert('Change Password', 'Password change feature coming soon')}
            variant="outline"
            fullWidth
            style={styles.accountButton}
          />
        </AppCard>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <AppButton
            title="Delete Account"
            onPress={handleDeleteAccount}
            variant="outline"
            fullWidth
            style={[styles.accountButton, styles.deleteButton]}
          />
        </AppCard>

        <AppButton
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          fullWidth
          style={styles.logoutButton}
        />
      </ScrollView>
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
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  accountButton: {
    marginBottom: theme.spacing.sm,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  logoutButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

