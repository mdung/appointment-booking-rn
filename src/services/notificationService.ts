/**
 * Notification Service
 * Handles push notifications for booking reminders and updates
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  /**
   * Request notification permissions
   */
  requestPermissions: async (): Promise<boolean> => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      // Get push token
      if (Platform.OS !== 'web') {
        const token = await Notifications.getExpoPushTokenAsync();
        await AsyncStorage.setItem('@notification_token', token.data);
        // TODO: Send token to backend
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  /**
   * Schedule a local notification
   */
  scheduleNotification: async (
    title: string,
    body: string,
    trigger: Date | number
  ): Promise<string> => {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
        },
        trigger,
      });
      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  },

  /**
   * Schedule booking reminder
   */
  scheduleBookingReminder: async (
    bookingId: string,
    bookingDate: string,
    bookingTime: string,
    providerName: string
  ): Promise<void> => {
    try {
      const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
      const reminderTime = new Date(bookingDateTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours before

      if (reminderTime > new Date()) {
        await notificationService.scheduleNotification(
          'Booking Reminder',
          `You have an appointment with ${providerName} tomorrow at ${bookingTime}`,
          reminderTime
        );
      }
    } catch (error) {
      console.error('Error scheduling booking reminder:', error);
    }
  },

  /**
   * Cancel a scheduled notification
   */
  cancelNotification: async (identifier: string): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },

  /**
   * Cancel all notifications
   */
  cancelAllNotifications: async (): Promise<void> => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  },

  /**
   * Get notification token
   */
  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem('@notification_token');
    } catch (error) {
      console.error('Error getting notification token:', error);
      return null;
    }
  },
};

