/**
 * AppButton Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppButton } from '../../components/ui/AppButton';

describe('AppButton', () => {
  it('should render correctly', () => {
    const { getByText } = render(<AppButton title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<AppButton title="Test" onPress={onPress} />);
    
    fireEvent.press(getByText('Test'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppButton title="Test" onPress={onPress} disabled />
    );
    
    const button = getByText('Test');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});

