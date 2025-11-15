/**
 * i18n Configuration
 * Multi-language support setup
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';

const LANGUAGE_KEY = '@appointment_booking:language';

const resources = {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  ar: { translation: ar },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.split('-')[0] || 'en',
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Load saved language preference
AsyncStorage.getItem(LANGUAGE_KEY).then((savedLanguage) => {
  if (savedLanguage && resources[savedLanguage as keyof typeof resources]) {
    i18n.changeLanguage(savedLanguage);
  }
});

// Save language preference when changed
i18n.on('languageChanged', (lng) => {
  AsyncStorage.setItem(LANGUAGE_KEY, lng);
});

export const changeLanguage = async (lng: string) => {
  if (resources[lng as keyof typeof resources]) {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  }
};

export const getCurrentLanguage = () => i18n.language;

export const getAvailableLanguages = () => Object.keys(resources);

export default i18n;

