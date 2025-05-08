import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeI18n, changeLanguage, getCurrentLanguage } from '../i18n';

type LanguageContextType = {
  language: string;
  isLoading: boolean;
  setLanguage: (lang: string) => Promise<void>;
};

const defaultLanguageContext: LanguageContextType = {
  language: 'en',
  isLoading: true,
  setLanguage: async () => {},
};

const LanguageContext = createContext<LanguageContextType>(defaultLanguageContext);

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('en');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize the language on app startup
  useEffect(() => {
    const initLanguage = async () => {
      setIsLoading(true);
      try {
        // Initialize i18n and get the current language
        await initializeI18n();
        const currentLang = getCurrentLanguage();
        setLanguageState(currentLang);
      } catch (error) {
        console.error('Error initializing language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initLanguage();
  }, []);

  // Function to change language
  const setLanguage = async (lang: string) => {
    setIsLoading(true);
    try {
      await changeLanguage(lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error changing language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isLoading,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext; 