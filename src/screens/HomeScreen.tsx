import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';
import { scale, fontScale, moderateScale, isTablet } from '../utils/responsive';
import Card from '../components/Card';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import SliderComponent from '../components/SliderComponent';
import GameCard from '../components/GameCard';
import { NavigationProp, ParamListBase, useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - scale(32); // 2 cards per row with more spacing
const FEATURE_CARD_WIDTH = width - scale(32);

// Add SliderItem type definition to match the one in SliderComponent
interface SliderItem {
  id: number;
  title: string;
  description?: string;
  tag?: string;
  buttonText?: string;
  icon?: string;
  gradient: string[];
  progress?: number;
  lessons?: number;
  type?: 'learn' | 'play' | 'translate';
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Game {
  id: number;
  title: string;
  description?: string;
  image: any;
  gradient: string[];
  level?: string;
  navigateTo: string;
}

interface HomeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

interface UserData {
  name?: string;
  [key: string]: any;
}

// Update DEFAULT_GRADIENTS with even lighter, more vibrant gradients
const DEFAULT_GRADIENTS = {
  play: ['#7F53AC', '#647DEE'], // Vibrant purple gradient
  learn: ['#56CCF2', '#2F80ED'], // Bright blue gradient
  translate: ['#FF9966', '#FF5E62'] // Bright orange-red gradient
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { profile, user, refreshProfile } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const isFocused = useIsFocused();
  const justFocused = useRef(false);
  
  // Animated header values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [scale(80), scale(50)],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 40, 80],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 40, 80],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  // Update userData when profile changes
  useEffect(() => {
    console.log('HomeScreen profile effect triggered');
    console.log('Current profile state:', profile);
    console.log('Current user state:', user);
    
    // Handle case where profile might be an array (from API response)
    const profileData = Array.isArray(profile) ? profile[0] : profile;
    
    if (profileData) {
      console.log('Setting userData with profile:', {
        name: profileData.name,
        profileImage: profileData.profile_image_url
      });
      
      setUserData({
        name: profileData.name || user?.user_metadata?.name || 'User',
        profileImage: profileData.profile_image_url
      });
      console.log('Profile data updated in HomeScreen:', profileData.name, profileData.profile_image_url);
    } else if (user) {
      console.log('No profile available, using user data only');
      setUserData({
        name: user.user_metadata?.name || 'User'
      });
    } else {
      console.log('No profile or user data available in HomeScreen');
    }
  }, [profile, user]);

  // Force immediate refresh when returning to this screen
  useEffect(() => {
    if (isFocused && refreshProfile) {
      console.log('HomeScreen focused, refreshing profile data');
      // Force refresh on focus
      refreshProfile()
        .then(() => {
          console.log('Profile refresh completed in HomeScreen');
        })
        .catch(error => {
          console.error('Error refreshing profile data:', error);
        });
    }
  }, [isFocused]);
  
  const getGradient = (type: 'play' | 'learn' | 'translate') => {
    return DEFAULT_GRADIENTS[type];
  };
  
  // Update featured items with lighter gradients
  const featuredItems: SliderItem[] = [
    {
      id: 1,
      title: 'Learn Sign Language Basics',
      description: 'Get started with basic sign language training through interactive lessons.',
      tag: 'Beginner',
      buttonText: 'Start Learning',
      icon: 'handshake',
      gradient: ['#36D1DC', '#5B86E5'], // Light blue gradient
      type: 'learn'
    },
    {
      id: 2,
      title: 'Play Sign Language Games',
      description: 'Enhance your skills with fun memory games and challenges.',
      tag: 'Fun',
      buttonText: 'Play Now',
      icon: 'gamepad-variant',
      gradient: ['#4776E6', '#8E54E9'], // Light purple gradient
      type: 'play'
    },
    {
      id: 3,
      title: 'Translate Signs in Real-time',
      description: 'Use your camera to translate sign language into text instantly.',
      tag: 'Tool',
      buttonText: 'Try it',
      icon: 'translate',
      gradient: ['#FF9966', '#FF5E62'], // Light orange-red gradient
      type: 'translate'
    }
  ];
  
  // Categories
  const categories = [
    { id: 'alphabet', name: 'Alphabet', icon: 'alphabetical' },
    { id: 'numbers', name: 'Numbers', icon: 'numeric' },
    { id: 'phrases', name: 'Phrases', icon: 'message-text' },
    { id: 'conversations', name: 'Conversations', icon: 'account-group' },
    { id: 'practice', name: 'Practice', icon: 'handshake' },
  ];
  
  // Update learning paths with lighter gradients
  const learningPaths = [
    {
      id: 1,
      title: 'Basics of Sign Language',
      description: 'Learn the fundamental concepts of sign language',
      progress: 65,
      lessons: 10,
      gradient: ['#36D1DC', '#5B86E5'], // Light blue gradient
    },
    {
      id: 2,
      title: 'Everyday Conversations',
      description: 'Practice common phrases for daily communication',
      progress: 30,
      lessons: 8,
      gradient: ['#FF9966', '#FF5E62'], // Light orange-red gradient
    },
    {
      id: 3,
      title: 'Advanced Techniques',
      description: 'Master complex sign language expressions',
      progress: 10,
      lessons: 12,
      gradient: ['#4776E6', '#8E54E9'], // Light purple gradient
    }
  ];
  
  // Update popular games with lighter gradients
  const popularGames: Game[] = [
    {
      id: 1,
      title: 'Memory Match',
      description: 'Match signs with their meanings in this fun memory game',
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: ['#7F53AC', '#647DEE'], // Vibrant purple gradient
      level: 'Beginner',
      navigateTo: 'MemoryMatchGame'
    },
    {
      id: 2,
      title: 'Sign Quiz',
      description: 'Test your knowledge with interactive quizzes',
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: ['#FF9966', '#FF5E62'], // Bright orange-red gradient
      level: 'Intermediate',
      navigateTo: 'SignLanguageQuiz'
    },
    {
      id: 3,
      title: 'Word Association',
      description: 'Associate signs with words in this challenging game',
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: ['#C471ED', '#F64F59'], // Vibrant pink-purple gradient
      level: 'Advanced',
      navigateTo: 'WordAssociationGame'
    },
    {
      id: 4,
      title: 'Story Time',
      description: 'Follow along with interactive sign language stories',
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: ['#56CCF2', '#2F80ED'], // Bright blue gradient
      level: 'All Levels',
      navigateTo: 'StoryTimeGame'
    }
  ];
  
  const handleFeaturePress = (item: SliderItem) => {
    if (item.type === 'learn') {
      navigation.navigate('Study');
    } else if (item.type === 'play') {
      navigation.navigate('Games');
    } else if (item.type === 'translate') {
      navigation.navigate('Translator');
    }
  };
  
  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('Study')}
      style={[
        styles.categoryItem,
        { backgroundColor: theme.colors.card }
      ]}
    >
      <View 
        style={[
          styles.categoryIconContainer,
          { backgroundColor: theme.colors.primary + '20' }
        ]}
      >
        <Icon name={item.icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      edges={['top']}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.headerContainer, 
          { 
            height: headerHeight,
            backgroundColor: theme.colors.background 
          }
        ]}
      >
        <Animated.View 
          style={[
            styles.headerContent, 
            { opacity: headerOpacity }
          ]}
        >
          <View>
            <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
              Good Morning
            </Text>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {userData?.name || 'User'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <ThemeToggle style={styles.themeToggle} />
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              {userData?.profileImage ? (
                <Image 
                  source={{ uri: userData.profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <Image 
                  source={require('../assets/images/placeholder-avatar.png')}
                  style={styles.profileImage}
                />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
        
        <Animated.Text 
          style={[
            styles.headerTitle, 
            { 
              opacity: headerTitleOpacity,
              color: theme.colors.text
            }
          ]}
        >
          Samvaad
        </Animated.Text>
      </Animated.View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Feature Slider Section */}
        <View style={styles.sectionContainer}>
        
          <SliderComponent 
            data={featuredItems} 
            onItemPress={handleFeaturePress} 
            sliderType="feature"
            cardHeight={scale(200)}
          />
        </View>
        
        {/* Categories */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Categories
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
        
        {/* Continue Learning */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Continue Learning
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Study')}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <SliderComponent
            data={learningPaths}
            onItemPress={() => navigation.navigate('Study')}
            sliderType="learning"
            cardWidth={scale(260)}
            cardHeight={scale(150)}
          />
        </View>
        
        {/* Popular Games */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Popular Games
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Games')}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                Play All
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gamesRow}>
            {popularGames.slice(0, 2).map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                description={game.description}
                image={game.image}
                gradient={game.gradient}
                level={game.level}
                onPress={() => navigation.navigate('Games', { screen: game.navigateTo })}
                width={CARD_WIDTH}
                height={scale(220)}
              />
            ))}
          </View>
          <View style={styles.gamesRow}>
            {popularGames.slice(2, 4).map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                description={game.description}
                image={game.image}
                gradient={game.gradient}
                level={game.level}
                onPress={() => navigation.navigate('Games', { screen: game.navigateTo })}
                width={CARD_WIDTH}
                height={scale(220)}
              />
            ))}
          </View>
        </View>
        
        {/* Add padding at the bottom to prevent content from being hidden behind tab bar */}
        <View style={{ height: scale(100) }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: scale(20),
    zIndex: 10,
    marginBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(4),
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    bottom: scale(5),
    left: 0,
    right: 0,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginRight: scale(8),
  },
  profileButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  greeting: {
    fontSize: fontScale(14),
  },
  username: {
    fontSize: fontScale(20),
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingTop: 0, // No gap between header and content
  },
  sectionContainer: {
    marginVertical: scale(12), // Increased vertical margins for better spacing
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    marginBottom: scale(12), // Increased margin
  },
  sectionTitle: {
    fontSize: fontScale(22), // Larger font for section titles
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: fontScale(14),
    fontWeight: '500',
    color: '#6200EE', // Keep this purple for highlighting
  },
  categoriesList: {
    paddingHorizontal: scale(16),
  },
  categoryItem: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(12),
    padding: scale(12),
    marginRight: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  categoryIconContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  categoryName: {
    fontSize: fontScale(12),
    fontWeight: '500',
    textAlign: 'center',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: scale(16),
    justifyContent: 'space-between',
  },
  gamesRow: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
});

export default HomeScreen; 