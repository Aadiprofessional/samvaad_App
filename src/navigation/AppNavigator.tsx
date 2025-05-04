import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Platform, View, StyleSheet } from 'react-native';
import { scale } from '../utils/responsive';
import { useTheme } from '../context/ThemeContext';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import GamesScreen from '../screens/GamesScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import StudyScreen from '../screens/StudyScreen';
import TranslatorScreen from '../screens/TranslatorScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Game screens
import FlipCardGameScreen from '../games/FlipCardGame';
import MemoryMatchGameScreen from '../games/MemoryMatchGame';
import SignLanguageQuizScreen from '../games/SignLanguageQuiz';
import WordMemorizationGameScreen from '../games/WordMemorizationGame';
import WordAssociationGameScreen from '../games/WordAssociationGame';
import SequenceGameScreen from '../games/SequenceGame';
import StoryTimeGameScreen from '../games/StoryTimeGame';

// Study screens
import LecturesScreen from '../screens/study/LecturesScreen';
import TestSeriesScreen from '../screens/study/TestSeriesScreen';
import LectureDetailScreen from '../screens/study/LectureDetailScreen';
import TestDetailScreen from '../screens/study/TestDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create individual stack navigators for each main section
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

const GamesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="GamesScreen">
    <Stack.Screen name="GamesScreen" component={GamesScreen} />
    <Stack.Screen name="MemoryMatchGame" component={MemoryMatchGameScreen} />
    <Stack.Screen name="FlipCardGame" component={FlipCardGameScreen} />
    <Stack.Screen name="SignLanguageQuiz" component={SignLanguageQuizScreen} />
    <Stack.Screen name="WordMemorizationGame" component={WordMemorizationGameScreen} />
    <Stack.Screen name="WordAssociationGame" component={WordAssociationGameScreen} />
    <Stack.Screen name="SequenceGame" component={SequenceGameScreen} />
    <Stack.Screen name="StoryTimeGame" component={StoryTimeGameScreen} />
  </Stack.Navigator>
);

const StudyStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="StudyScreen">
    <Stack.Screen name="StudyScreen" component={StudyScreen} />
    <Stack.Screen name="Lectures" component={LecturesScreen} />
    <Stack.Screen name="TestSeries" component={TestSeriesScreen} />
    <Stack.Screen name="LectureDetail" component={LectureDetailScreen} />
    <Stack.Screen name="TestDetail" component={TestDetailScreen} />
  </Stack.Navigator>
);

const TranslatorStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TranslatorScreen" component={TranslatorScreen} />
  </Stack.Navigator>
);

const LeaderboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LeaderboardScreen" component={LeaderboardScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Games') {
            iconName = focused ? 'gamepad-variant' : 'gamepad-variant-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Study') {
            iconName = focused ? 'book-open-page-variant' : 'book-open-outline';
          } else if (route.name === 'Translator') {
            iconName = focused ? 'hand-front-right' : 'hand-front-right-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: isDarkMode ? '#999999' : '#888888',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5', // Light gray in light mode
          paddingBottom: Platform.OS === 'ios' ? scale(20) : scale(5),
          paddingTop: scale(5),
          height: Platform.OS === 'ios' ? scale(80) : scale(60),
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopColor: 'transparent'
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: Platform.OS === 'ios' ? scale(5) : 0,
        },
        tabBarBackground: () => (
          <View style={[styles.tabBarBackground, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5' }]} />
        ),
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen 
        name="Games" 
        component={GamesStack} 
        options={{ unmountOnBlur: false }}
        listeners={({ navigation }) => ({
          tabPress: e => {
            // Reset to the main games screen when the tab is pressed
            navigation.navigate('Games', { screen: 'GamesScreen' });
          },
        })}
      />
      <Tab.Screen name="Study" component={StudyStack} />
      <Tab.Screen name="Translator" component={TranslatorStack} />
      <Tab.Screen name="Leaderboard" component={LeaderboardStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default AppNavigator; 