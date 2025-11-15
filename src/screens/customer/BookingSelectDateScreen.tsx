/**
 * Booking Select Date Screen
 * Step 2: Select a date for the booking
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { getAvailableDates, formatDate } from '../../utils/dateTime';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';

type BookingSelectDateScreenRouteProp = RouteProp<CustomerStackParamList, 'BookingSelectDate'>;
type BookingSelectDateScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'BookingSelectDate'>;

export const BookingSelectDateScreen: React.FC = () => {
  const route = useRoute<BookingSelectDateScreenRouteProp>();
  const navigation = useNavigation<BookingSelectDateScreenNavigationProp>();
  const { providerId, serviceId } = route.params;

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const availableDates = getAvailableDates(30);

  const handleContinue = () => {
    if (selectedDate) {
      navigation.navigate('BookingSelectTime', {
        providerId,
        serviceId,
        date: selectedDate.toISOString().split('T')[0],
      });
    }
  };

  const renderDate = ({ item }: { item: Date }) => {
    const isSelected = selectedDate && selectedDate.toDateString() === item.toDateString();
    return (
      <TouchableOpacity
        style={[styles.dateCard, isSelected && styles.dateCardSelected]}
        onPress={() => setSelectedDate(item)}
      >
        <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
          {formatDate(item, 'EEE')}
        </Text>
        <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
          {formatDate(item, 'dd')}
        </Text>
        <Text style={[styles.dateMonth, isSelected && styles.dateMonthSelected]}>
          {formatDate(item, 'MMM')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Select a Date</Text>
        <FlatList
          data={availableDates}
          renderItem={renderDate}
          keyExtractor={(item) => item.toISOString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesList}
        />
        <AppButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedDate}
          fullWidth
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.h3,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  datesList: {
    paddingVertical: theme.spacing.md,
  },
  dateCard: {
    width: 80,
    height: 100,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  dateCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  dateText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  dateNumber: {
    fontSize: theme.typography.h3,
    fontWeight: '700',
    color: theme.colors.text,
  },
  dateNumberSelected: {
    color: '#FFFFFF',
  },
  dateMonth: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  dateMonthSelected: {
    color: '#FFFFFF',
  },
  button: {
    marginTop: theme.spacing.xl,
  },
});

