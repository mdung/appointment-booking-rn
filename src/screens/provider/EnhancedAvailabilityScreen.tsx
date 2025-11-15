/**
 * Enhanced Availability Screen
 * Manage working hours, block dates/times, handle holidays
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { providerApi } from '../../services/providerApi';
import { Availability, WorkingDay } from '../../models/Provider';
import { formatDate } from '../../utils/dateTime';
import { theme } from '../../config/theme';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const EnhancedAvailabilityScreen: React.FC = () => {
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [blockedDate, setBlockedDate] = useState('');
  const [showBlockDateModal, setShowBlockDateModal] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setIsLoading(true);
      const providerId = '1'; // TODO: Get from context
      const data = await providerApi.getProviderAvailability(providerId);
      setAvailability(data);
    } catch (error) {
      console.error('Error loading availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDay = (dayOfWeek: number) => {
    if (!availability) return;
    
    const updatedWorkingDays = availability.workingDays.map(wd => {
      if (wd.dayOfWeek === dayOfWeek) {
        return { ...wd, isAvailable: !wd.isAvailable };
      }
      return wd;
    });

    setAvailability({
      ...availability,
      workingDays: updatedWorkingDays,
    });
  };

  const editWorkingHours = (dayOfWeek: number) => {
    const workingDay = availability?.workingDays.find(wd => wd.dayOfWeek === dayOfWeek);
    if (workingDay) {
      setStartTime(workingDay.startTime);
      setEndTime(workingDay.endTime);
    }
    setEditingDay(dayOfWeek);
  };

  const saveWorkingHours = () => {
    if (!availability || editingDay === null) return;

    const updatedWorkingDays = availability.workingDays.map(wd => {
      if (wd.dayOfWeek === editingDay) {
        return { ...wd, startTime, endTime };
      }
      return wd;
    });

    setAvailability({
      ...availability,
      workingDays: updatedWorkingDays,
    });
    setEditingDay(null);
  };

  const addBlockedDate = () => {
    if (!blockedDate || !availability) return;

    const blockedDates = [...(availability.blockedDates || []), blockedDate];
    setAvailability({
      ...availability,
      blockedDates: [...new Set(blockedDates)], // Remove duplicates
    });
    setBlockedDate('');
    setShowBlockDateModal(false);
  };

  const removeBlockedDate = (date: string) => {
    if (!availability) return;

    setAvailability({
      ...availability,
      blockedDates: availability.blockedDates.filter(d => d !== date),
    });
  };

  const handleSave = async () => {
    if (!availability) return;

    try {
      setIsSaving(true);
      const providerId = '1'; // TODO: Get from context
      await providerApi.updateProviderAvailability(providerId, availability);
      Alert.alert('Success', 'Availability updated');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update availability');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!availability) {
    return (
      <ScreenContainer>
        <Text>Error loading availability</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Manage Availability</Text>

        <AppCard style={styles.card}>
          <Text style={styles.sectionTitle}>Working Days</Text>
          {daysOfWeek.map((day, index) => {
            const workingDay = availability.workingDays.find(wd => wd.dayOfWeek === index);
            const isAvailable = workingDay?.isAvailable || false;
            const isEditing = editingDay === index;
            
            return (
              <View key={index} style={styles.dayRow}>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayName}>{day}</Text>
                  {isAvailable && workingDay && !isEditing && (
                    <Text style={styles.timeRange}>
                      {workingDay.startTime} - {workingDay.endTime}
                    </Text>
                  )}
                  {isEditing && (
                    <View style={styles.timeInputs}>
                      <AppTextInput
                        placeholder="09:00"
                        value={startTime}
                        onChangeText={setStartTime}
                        style={styles.timeInput}
                      />
                      <Text style={styles.timeSeparator}>-</Text>
                      <AppTextInput
                        placeholder="18:00"
                        value={endTime}
                        onChangeText={setEndTime}
                        style={styles.timeInput}
                      />
                      <AppButton
                        title="Save"
                        onPress={saveWorkingHours}
                        size="small"
                        style={styles.saveTimeButton}
                      />
                    </View>
                  )}
                </View>
                <View style={styles.dayActions}>
                  {isAvailable && !isEditing && (
                    <AppButton
                      title="Edit"
                      onPress={() => editWorkingHours(index)}
                      variant="outline"
                      size="small"
                      style={styles.editButton}
                    />
                  )}
                  <Switch
                    value={isAvailable}
                    onValueChange={() => toggleDay(index)}
                  />
                </View>
              </View>
            );
          })}
        </AppCard>

        <AppCard style={styles.card}>
          <View style={styles.blockedHeader}>
            <Text style={styles.sectionTitle}>Blocked Dates</Text>
            <AppButton
              title="Add Date"
              onPress={() => setShowBlockDateModal(true)}
              size="small"
            />
          </View>
          {availability.blockedDates && availability.blockedDates.length > 0 ? (
            <FlatList
              data={availability.blockedDates}
              renderItem={({ item }) => (
                <View style={styles.blockedDateRow}>
                  <Text style={styles.blockedDateText}>{formatDate(item, 'MMM dd, yyyy')}</Text>
                  <AppButton
                    title="Remove"
                    onPress={() => removeBlockedDate(item)}
                    variant="outline"
                    size="small"
                  />
                </View>
              )}
              keyExtractor={(item) => item}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noBlockedDates}>No blocked dates</Text>
          )}
        </AppCard>

        <AppButton
          title="Save Changes"
          onPress={handleSave}
          loading={isSaving}
          fullWidth
          style={styles.button}
        />

        <Modal
          visible={showBlockDateModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowBlockDateModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Block Date</Text>
              <AppTextInput
                label="Date"
                placeholder="YYYY-MM-DD"
                value={blockedDate}
                onChangeText={setBlockedDate}
              />
              <View style={styles.modalActions}>
                <AppButton
                  title="Cancel"
                  onPress={() => setShowBlockDateModal(false)}
                  variant="outline"
                  style={styles.modalButton}
                />
                <AppButton
                  title="Add"
                  onPress={addBlockedDate}
                  style={styles.modalButton}
                />
              </View>
            </View>
          </View>
        </Modal>
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
  card: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.h4,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  timeRange: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  timeInput: {
    flex: 1,
  },
  timeSeparator: {
    marginHorizontal: theme.spacing.sm,
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  saveTimeButton: {
    marginLeft: theme.spacing.sm,
  },
  dayActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  editButton: {
    marginRight: theme.spacing.sm,
  },
  blockedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  blockedDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  blockedDateText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  noBlockedDates: {
    fontSize: theme.typography.body,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '80%',
  },
  modalTitle: {
    fontSize: theme.typography.h3,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
});

