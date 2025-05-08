import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import hi from './hi.json';

// Define available translations
const resources = {
  en: {
    translation: en,
  },
  hi: {
    translation: hi,
  },
};

// Get the best available language detected by device
const getDeviceLanguage = () => {
  const locales = RNLocalize.getLocales();
  if (locales.length > 0) {
    // Just consider the first two characters for language code (e.g., 'en' from 'en-US')
    const languageCode = locales[0].languageTag.split('-')[0];
    // Check if we have a translation for this language
    return resources[languageCode] ? languageCode : 'en';
  }
  return 'en'; // Default to English
};

// Initialize i18next
const initializeI18n = async () => {
  // Try to get previously selected language from AsyncStorage
  let selectedLanguage;
  try {
    selectedLanguage = await AsyncStorage.getItem('language');
  } catch (error) {
    console.error('Error reading language from AsyncStorage:', error);
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: selectedLanguage || getDeviceLanguage(),
      fallbackLng: 'en',
      compatibilityJSON: 'v3',
      interpolation: {
        escapeValue: false, // React already does escaping
      },
    });

  return i18n;
};

// Function to change language
export const changeLanguage = async (language: string) => {
  try {
    await AsyncStorage.setItem('language', language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18n.language || 'en';
};

export { initializeI18n };
export default i18n; 