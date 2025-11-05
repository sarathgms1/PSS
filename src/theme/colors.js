/**
 * Theme Colors Configuration
 * Centralized color scheme for the app
 */

import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    card: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    border: isDarkMode ? '#3a3a3a' : '#e0e0e0',
    primary: '#007AFF',
    primaryDark: '#0051D5',
    error: '#FF3B30',
    inputBackground: isDarkMode ? '#2a2a2a' : '#ffffff',
    dropdownBackground: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    isDarkMode,
  };
};

