import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import LoginScreen from './screens/auth/LoginScreen';
import SignupScreen from './screens/auth/SignupScreen';
import MainBottomTabs from './navigation/MainBottomTabs';
import ForgotPasswordScreen from './screens/auth/ForgotPasswordScreen';
import OTPVerificationScreen from './screens/auth/OTPVerificationScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';

// Optimize screen containers
enableScreens();

// Suppress warnings in development
LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

// Define stack navigator types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  OTPVerification: { email: string };
  ResetPassword: { email: string };
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Create Auth Stack Navigator
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

// App navigation with theme support
const AppNavigation = () => {
  const { theme, isDarkMode } = useTheme();
  
  // Create a custom navigation theme based on our app theme
  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.primary,
      background: theme.colors.background,
      text: theme.colors.text,
      card: theme.colors.card,
      border: theme.colors.border,
    },
  };
  
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Main" component={MainBottomTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Root component
const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App; 