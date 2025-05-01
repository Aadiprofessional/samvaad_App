import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

// Import types
import { 
  HomeStackParamList, 
  GamesStackParamList, 
  StudyStackParamList,
  TranslatorStackParamList,
  LeaderboardStackParamList,
  RootStackParamList
} from '../types/navigation';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const GamesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GamesScreen" component={GamesScreen} />
    <Stack.Screen name="FlipCardGame" component={FlipCardGameScreen} />
    <Stack.Screen name="MemoryMatchGame" component={MemoryMatchGameScreen} />
    <Stack.Screen name="SignLanguageQuiz" component={SignLanguageQuizScreen} />
    <Stack.Screen name="WordMemorizationGame" component={WordMemorizationGameScreen} />
    <Stack.Screen name="WordAssociationGame" component={WordAssociationGameScreen} />
    <Stack.Screen name="SequenceGame" component={SequenceGameScreen} />
    <Stack.Screen name="StoryTimeGame" component={StoryTimeGameScreen} />
  </Stack.Navigator>
);

const LeaderboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LeaderboardMain" component={LeaderboardScreen} />
  </Stack.Navigator>
);

const StudyStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StudyMain" component={StudyScreen} />
    <Stack.Screen name="Lectures" component={LecturesScreen} />
    <Stack.Screen name="TestSeries" component={TestSeriesScreen} />
    <Stack.Screen name="LectureDetail" component={LectureDetailScreen} />
    <Stack.Screen name="TestDetail" component={TestDetailScreen} />
  </Stack.Navigator>
);

const TranslatorStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TranslatorMain" component={TranslatorScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Games') {
            iconName = focused ? 'gamepad-variant' : 'gamepad-variant-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Study') {
            iconName = focused ? 'book-open-page-variant' : 'book-open-outline';
          } else if (route.name === 'Translator') {
            iconName = focused ? 'sign-language' : 'sign-language';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Games" component={GamesStack} />
      <Tab.Screen name="Study" component={StudyStack} />
      <Tab.Screen name="Translator" component={TranslatorStack} />
      <Tab.Screen name="Leaderboard" component={LeaderboardStack} />
    </Tab.Navigator>
  );
};

export default AppNavigator; 