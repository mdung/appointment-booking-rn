/**
 * Payment Screen
 * Select payment method and process payment for booking
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { paymentApi, PaymentMethod } from '../../services/paymentApi';
import { theme } from '../../config/theme';
import { CustomerStackParamList } from '../../navigation/types';

type PaymentScreenRouteProp = RouteProp<CustomerStackParamList, 'Payment'>;
type PaymentScreenNavigationProp = StackNavigationProp<CustomerStackParamList, 'Payment'>;

export const PaymentScreen: React.FC = () => {
  const route = useRoute<PaymentScreenRouteProp>();
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const { bookingId, amount } = route.params || {};

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const methods = await paymentApi.getPaymentMethods();
      setPaymentMethods(methods);
      const defaultMethod = methods.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedMethod(defaultMethod.id);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod || !bookingId) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    try {
      setIsProcessing(true);
      const intent = await paymentApi.createPaymentIntent(bookingId, amount);
      const transaction = await paymentApi.confirmPayment(intent.id, selectedMethod);
      
      if (transaction.status === 'completed') {
        Alert.alert('Success', 'Payment processed successfully', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', 'Payment failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ScreenContainer scrollable>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.amount}>${amount?.toFixed(2) || '0.00'}</Text>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && styles.methodCardSelected,
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View style={styles.methodInfo}>
                  <Text style={styles.methodType}>
                    {method.type === 'card' ? '💳' : method.type === 'paypal' ? '💙' : '📱'} {method.type.toUpperCase()}
                  </Text>
                  {method.last4 && (
                    <Text style={styles.methodDetails}>
                      •••• {method.last4} {method.brand && `(${method.brand})`}
                    </Text>
                  )}
                </View>
                {selectedMethod === method.id && (
                  <Text style={styles.selectedIndicator}>✓</Text>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No payment methods</Text>
              <AppButton
                title="Add Payment Method"
                onPress={() => Alert.alert('Add Payment', 'Payment method addition coming soon')}
                variant="outline"
                size="small"
                style={styles.addButton}
              />
            </View>
          )}
        </AppCard>

        <AppButton
          title="Pay Now"
          onPress={handlePayment}
          loading={isProcessing}
          disabled={!selectedMethod}
          fullWidth
          style={styles.payButton}
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
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  amount: {
    fontSize: theme.typography.h1,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
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
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  methodCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  methodInfo: {
    flex: 1,
  },
  methodType: {
    fontSize: theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  methodDetails: {
    fontSize: theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  selectedIndicator: {
    fontSize: theme.typography.h3,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  addButton: {
    marginTop: theme.spacing.sm,
  },
  payButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

