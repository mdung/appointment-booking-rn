/**
 * Dark Theme Configuration
 */

import { theme } from './theme';

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: '#1A1A1A',
    backgroundSecondary: '#2A2A2A',
    backgroundTertiary: '#3A3A3A',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    border: '#404040',
    borderLight: '#2A2A2A',
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    success: theme.colors.success,
    error: theme.colors.error,
    warning: theme.colors.warning,
  },
};

