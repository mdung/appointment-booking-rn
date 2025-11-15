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
import { bookingApi } from '../../services/bookingApi';
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
      // Get actual available slots from API (with fallback to generated slots)
      let slots: TimeSlot[];
      try {
        slots = await providerApi.getAvailableTimeSlots(providerId, date);
        // If API returns empty, generate slots as fallback
        if (slots.length === 0) {
          const availability = await providerApi.getProviderAvailability(providerId);
          const dateObj = new Date(date);
          const dayOfWeek = dateObj.getDay();
          const workingDay = availability.workingDays.find(wd => wd.dayOfWeek === dayOfWeek);
          
          if (workingDay && workingDay.isAvailable) {
            const [startHour] = workingDay.startTime.split(':').map(Number);
            const [endHour] = workingDay.endTime.split(':').map(Number);
            // Get booked slots to filter out
            const bookings = await bookingApi.getMyBookings();
            const bookedSlots = bookings
              .filter(b => b.date === date && b.status !== 'CANCELLED')
              .map(b => b.startTime);
            slots = generateTimeSlots(startHour, endHour, 30, bookedSlots);
          } else {
            slots = [];
          }
        }
      } catch (error) {
        // Fallback: generate slots
        const availability = await providerApi.getProviderAvailability(providerId);
        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay();
        const workingDay = availability.workingDays.find(wd => wd.dayOfWeek === dayOfWeek);
        
        if (workingDay && workingDay.isAvailable) {
          const [startHour] = workingDay.startTime.split(':').map(Number);
          const [endHour] = workingDay.endTime.split(':').map(Number);
          slots = generateTimeSlots(startHour, endHour, 30, []);
        } else {
          slots = [];
        }
      }
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

