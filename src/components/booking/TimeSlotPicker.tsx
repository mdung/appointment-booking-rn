/**
 * Time Slot Picker component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { theme } from '../../config/theme';
import { TimeSlot } from '../../utils/dateTime';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot?: string;
  onSelectSlot: (startTime: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
}) => {
  const renderSlot = ({ item }: { item: TimeSlot }) => {
    const isSelected = selectedSlot === item.startTime;
    const isDisabled = !item.available;

    return (
      <TouchableOpacity
        style={[
          styles.slot,
          isSelected && styles.slotSelected,
          isDisabled && styles.slotDisabled,
        ]}
        onPress={() => !isDisabled && onSelectSlot(item.startTime)}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.slotText,
            isSelected && styles.slotTextSelected,
            isDisabled && styles.slotTextDisabled,
          ]}
        >
          {item.startTime}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={slots}
      renderItem={renderSlot}
      keyExtractor={(item) => item.startTime}
      numColumns={4}
      contentContainerStyle={styles.container}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.sm,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  slot: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  slotDisabled: {
    backgroundColor: theme.colors.backgroundTertiary,
    borderColor: theme.colors.borderLight,
    opacity: 0.5,
  },
  slotText: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: '500',
  },
  slotTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  slotTextDisabled: {
    color: theme.colors.textTertiary,
  },
});

