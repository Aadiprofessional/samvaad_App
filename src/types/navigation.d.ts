import { NativeStackScreenProps, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabScreenProps, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Root Navigation Types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  Home: undefined;
  Games: undefined;
  Study: undefined;
  Translator: undefined;
  Leaderboard: undefined;
};

// Home Stack Types
export type HomeStackParamList = {
  HomeScreen: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Games Stack Types
export type GamesStackParamList = {
  GamesScreen: undefined;
  FlipCardGame: undefined;
  MemoryMatchGame: undefined;
  SignLanguageQuiz: undefined;
  WordMemorizationGame: undefined;
  WordAssociationGame: undefined;
  SequenceGame: undefined;
  StoryTimeGame: undefined;
};

// Study Stack Types
export type StudyStackParamList = {
  StudyMain: undefined;
  Lectures: undefined;
  TestSeries: undefined;
  LectureDetail: { courseId: number };
  TestDetail: { testId: number };
};

// Translator Stack Types
export type TranslatorStackParamList = {
  TranslatorMain: undefined;
};

// Leaderboard Stack Types
export type LeaderboardStackParamList = {
  LeaderboardMain: undefined;
};

// Define prop types for each stack navigator
export type HomeScreenProps = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;
export type ProfileScreenProps = NativeStackScreenProps<HomeStackParamList, 'Profile'>;
export type SettingsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Settings'>;

export type GamesScreenProps = NativeStackScreenProps<GamesStackParamList, 'GamesScreen'>;
export type FlipCardGameProps = NativeStackScreenProps<GamesStackParamList, 'FlipCardGame'>;
export type MemoryMatchGameProps = NativeStackScreenProps<GamesStackParamList, 'MemoryMatchGame'>;
export type SignLanguageQuizProps = NativeStackScreenProps<GamesStackParamList, 'SignLanguageQuiz'>;
export type WordMemorizationGameProps = NativeStackScreenProps<GamesStackParamList, 'WordMemorizationGame'>;
export type WordAssociationGameProps = NativeStackScreenProps<GamesStackParamList, 'WordAssociationGame'>;
export type SequenceGameProps = NativeStackScreenProps<GamesStackParamList, 'SequenceGame'>;
export type StoryTimeGameProps = NativeStackScreenProps<GamesStackParamList, 'StoryTimeGame'>;

export type StudyScreenProps = NativeStackScreenProps<StudyStackParamList, 'StudyMain'>;
export type LecturesScreenProps = NativeStackScreenProps<StudyStackParamList, 'Lectures'>;
export type TestSeriesScreenProps = NativeStackScreenProps<StudyStackParamList, 'TestSeries'>;
export type LectureDetailScreenProps = NativeStackScreenProps<StudyStackParamList, 'LectureDetail'>;
export type TestDetailScreenProps = NativeStackScreenProps<StudyStackParamList, 'TestDetail'>;

export type TranslatorScreenProps = NativeStackScreenProps<TranslatorStackParamList, 'TranslatorMain'>;

export type LeaderboardScreenProps = NativeStackScreenProps<LeaderboardStackParamList, 'LeaderboardMain'>;

// Auth screens
export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;
export type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;
export type AuthScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;

// Define navigation types for using navigation outside of screens
export type HomeStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
export type GamesStackNavigationProp = NativeStackNavigationProp<GamesStackParamList>;
export type StudyStackNavigationProp = NativeStackNavigationProp<StudyStackParamList>;
export type TranslatorStackNavigationProp = NativeStackNavigationProp<TranslatorStackParamList>;
export type LeaderboardStackNavigationProp = NativeStackNavigationProp<LeaderboardStackParamList>;

// Root Tab Navigation Prop
export type RootTabNavigationProp = BottomTabNavigationProp<RootStackParamList>;

declare global {
  namespace ReactNavigation {
    interface RootStackParamList extends RootStackParamList {}
  }
} 