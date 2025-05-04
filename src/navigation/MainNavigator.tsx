import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import { getDefaultTabBarStyle } from '../utils/tabBarStyles';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import TranslatorScreen from '../screens/TranslatorScreen';
import StudyScreen from '../screens/StudyScreen';
import GamesScreen from '../screens/GamesScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import types
import { MainTabParamList } from '../types/navigation';

// Create bottom tab navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main navigator with bottom tabs
const MainNavigator = () => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: getDefaultTabBarStyle(isDarkMode),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? 8 : 4,
        },
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        lazy: false, // Ensures tab screens are ready to prevent flickering
      }}
      safeAreaInsets={{ bottom: 0 }} // Override default safe area behavior
      sceneContainerStyle={{ backgroundColor: 'transparent' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Translator"
        component={TranslatorScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="sign-language" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Study"
        component={StudyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book-open-variant" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Games"
        component={GamesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="gamepad-variant" color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator; 