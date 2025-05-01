/**
 * Samvaad - Sign Language Education App
 * https://github.com/username/samvaad
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar, useColorScheme, LogBox } from 'react-native';
import { enableScreens } from 'react-native-screens';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth and onboarding screens
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';

// Main app navigator
import AppNavigator from './src/navigation/AppNavigator';

// Import theme provider
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

// Import types
import { RootStackParamList } from './src/types/navigation';

// Enable optimized screen container
enableScreens();

// Ignore specific warnings in development
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

// Pre-load icon font to prevent question marks instead of icons
Icon.loadFont().catch(error => {
  console.warn('Failed to load MaterialCommunityIcons font:', error);
});

const Stack = createNativeStackNavigator<RootStackParamList>();

// Customize navigation themes
const createCustomNavigationTheme = (isDarkMode: boolean, appTheme: any) => {
  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;
  
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: appTheme.colors.primary,
      background: appTheme.colors.background,
      card: appTheme.colors.card,
      text: appTheme.colors.text,
      border: appTheme.colors.border,
      notification: appTheme.colors.notification,
    },
  };
};

const AppContent = () => {
  const { theme, isDarkMode } = useTheme();
  const navigationTheme = createCustomNavigationTheme(isDarkMode, theme);
  
  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.background}
      />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
