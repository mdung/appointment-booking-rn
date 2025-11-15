/**
 * Booking Status Tag component
 */

import React from 'react';
import { AppBadge } from '../ui/AppBadge';
import { BookingStatus } from '../../utils/constants';

interface BookingStatusTagProps {
  status: BookingStatus;
}

export const BookingStatusTag: React.FC<BookingStatusTagProps> = ({ status }) => {
  const getVariant = (status: BookingStatus): 'primary' | 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'CONFIRMED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'COMPLETED':
        return 'default';
      default:
        return 'default';
    }
  };

  return <AppBadge text={status} variant={getVariant(status)} />;
};

