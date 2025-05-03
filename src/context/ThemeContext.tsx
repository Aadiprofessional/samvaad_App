import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../utils/theme';

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark' | 'system') => void;
  themeMode: 'light' | 'dark' | 'system';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_PREFERENCE_KEY = '@samvaad_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('dark');
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Calculate the effective theme based on preference or system setting
  const isDarkMode = themeMode === 'system' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';
  
  const theme = isDarkMode ? darkTheme : lightTheme;

  const loadThemePreference = async () => {
    try {
      const savedThemeMode = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
      if (savedThemeMode && (savedThemeMode === 'light' || savedThemeMode === 'dark' || savedThemeMode === 'system')) {
        setThemeMode(savedThemeMode);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to load theme preference:', error);
      setIsInitialized(true);
    }
  };

  const saveThemePreference = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  useEffect(() => {
    loadThemePreference();
  }, []);

  // Update StatusBar based on theme
  useEffect(() => {
    if (isInitialized) {
      StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    }
  }, [isDarkMode, isInitialized]);

  const toggleTheme = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setThemeMode(newMode);
    saveThemePreference(newMode);
  };

  const setTheme = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    saveThemePreference(mode);
  };

  if (!isInitialized) {
    // Return a plain provider during initialization to avoid flicker
    return <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme, themeMode }}>
      {children}
    </ThemeContext.Provider>;
  }

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setTheme, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 