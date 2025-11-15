/**
 * Booking Select Time Screen
 * Step 3: Select a time slot
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { TimeSlotPicker } from '../../components/booking/TimeSlotPicker';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { providerApi } from '../../services/providerApi';
import { TimeSlot, generateTimeSlots } from '../../utils/dateTime';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';

type BookingSelectTimeScreenRouteProp = RouteProp<CustomerStackParamList, 'BookingSelectTime'>;
type BookingSelectTimeScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'BookingSelectTime'>;

export const BookingSelectTimeScreen: React.FC = () => {
  const route = useRoute<BookingSelectTimeScreenRouteProp>();
  const navigation = useNavigation<BookingSelectTimeScreenNavigationProp>();
  const { providerId, serviceId, date } = route.params;

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTimeSlots();
  }, [providerId, date]);

  const loadTimeSlots = async () => {
    try {
      setIsLoading(true);
      // TODO: Get actual available slots from API
      // const slots = await providerApi.getAvailableTimeSlots(providerId, date);
      // For now, generate mock slots
      const slots = generateTimeSlots(9, 18, 30, []);
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error loading time slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedTime) {
      navigation.navigate('BookingConfirm', {
        providerId,
        serviceId,
        date,
        startTime: selectedTime,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Select a Time</Text>
        <Text style={styles.dateText}>{date}</Text>
        <TimeSlotPicker
          slots={timeSlots}
          selectedSlot={selectedTime}
          onSelectSlot={setSelectedTime}
        />
        <AppButton
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedTime}
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
    marginBottom: theme.spacing.sm,
  },
  dateText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.xl,
  },
});

