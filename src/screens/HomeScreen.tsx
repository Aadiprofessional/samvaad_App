import React, { useEffect, useState } from 'react';
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
import { scale, fontScale, moderateScale, isTablet } from '../utils/responsive';
import Card from '../components/Card';
import Button from '../components/Button';
import ThemeToggle from '../components/ThemeToggle';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = isTablet() ? width / 3 - scale(24) : width / 2 - scale(24);
const FEATURE_CARD_WIDTH = width - scale(32);

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Game {
  id: number;
  title: string;
  image: any;
  gradient: string[];
  level?: string;
  navigateTo: string;
}

interface LearningPath {
  id: number;
  title: string;
  progress: number;
  lessons: number;
  image: any;
  gradient: string[];
}

interface HomeScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const scrollY = new Animated.Value(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  
  // Header animation values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [scale(130), scale(70)],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  // Auto-scroll featured items
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prevIndex) => (prevIndex + 1) % featuredItems.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const categories: Category[] = [
    { id: 'alphabet', name: 'Alphabet', icon: 'alphabetical' },
    { id: 'numbers', name: 'Numbers', icon: 'numeric' },
    { id: 'phrases', name: 'Phrases', icon: 'message-text' },
    { id: 'conversation', name: 'Conversation', icon: 'account-group' },
  ];

  const popularGames: Game[] = [
    {
      id: 1,
      title: 'Memory Match',
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: theme.colors.gradients.play,
      level: 'Beginner',
      navigateTo: 'MemoryMatchGame',
    },
    {
      id: 2,
      title: 'Sign Quiz',
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: theme.colors.gradients.play,
      level: 'Intermediate',
      navigateTo: 'SignLanguageQuiz',
    },
    {
      id: 3,
      title: 'Word Association',
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: theme.colors.gradients.play,
      level: 'Advanced',
      navigateTo: 'WordAssociationGame',
    },
    {
      id: 4,
      title: 'Story Time',
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: theme.colors.gradients.play,
      level: 'Beginner',
      navigateTo: 'StoryTimeGame',
    },
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 1,
      title: 'Sign Language Basics',
      progress: 40,
      lessons: 12,
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: theme.colors.gradients.learn,
    },
    {
      id: 2,
      title: 'Daily Conversations',
      progress: 25,
      lessons: 18,
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: theme.colors.gradients.learn,
    },
    {
      id: 3,
      title: 'Advanced Signing',
      progress: 10,
      lessons: 24,
      image: require('../assets/images/placeholder-avatar.png'),
      gradient: theme.colors.gradients.learn,
    },
  ];
  
  const featuredItems = [
    {
      id: 1,
      title: 'Learn Sign Language Now',
      description: 'Master the basics with our interactive lessons',
      buttonText: 'Start Learning',
      icon: 'school',
      onPress: () => navigation.navigate('Study'),
      gradient: theme.colors.gradients.learn,
    },
    {
      id: 2,
      title: 'Play & Learn',
      description: 'Fun games to improve your signing skills',
      buttonText: 'Play Now',
      icon: 'gamepad-variant',
      onPress: () => navigation.navigate('Games'),
      gradient: theme.colors.gradients.play,
    },
    {
      id: 3,
      title: 'Translate in Real-time',
      description: 'Use our camera to translate sign language instantly',
      buttonText: 'Try Now',
      icon: 'translate',
      onPress: () => navigation.navigate('Translator'),
      gradient: theme.colors.gradients.translate,
    },
  ];

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[
        styles.categoryItem, 
        { backgroundColor: theme.colors.card }
      ]}
      onPress={() => {}}
    >
      <View style={[
        styles.categoryIconContainer, 
        { backgroundColor: `${theme.colors.primary}20` }
      ]}>
        <Icon name={item.icon} size={24} color={theme.colors.primary} />
      </View>
      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderGameCard = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate(item.navigateTo)}
    >
      <Card gradient={item.gradient}>
        <View style={styles.gameCardContent}>
          <Image source={item.image} style={styles.gameImage} />
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>{item.title}</Text>
            {item.level && (
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
            )}
          </View>
          <View style={styles.playButton}>
            <Icon name="play" size={20} color="#FFFFFF" />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  const renderLearningPath = ({ item }: { item: LearningPath }) => (
    <Card 
      gradient={item.gradient}
      style={styles.learningPathCard}
      onPress={() => {}}
    >
      <View style={styles.learningPathContent}>
        <Text style={styles.learningPathTitle}>{item.title}</Text>
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonCount}>{item.lessons} Lessons</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{item.progress}% Complete</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${item.progress}%` }
                ]} 
              />
            </View>
          </View>
        </View>
        <Button 
          title="Continue" 
          size="small" 
          rightIcon="arrow-right"
          variant="ghost"
          onPress={() => {}}
          style={styles.continueButton}
          textStyle={{ color: '#FFFFFF' }}
        />
      </View>
    </Card>
  );

  const renderFeaturedItem = ({ item, index }: { item: any; index: number }) => (
    <Card
      gradient={item.gradient}
      style={[
        styles.featuredCard,
        { width: FEATURE_CARD_WIDTH }
      ]}
      onPress={item.onPress}
    >
      <View style={styles.featuredContent}>
        <View style={styles.featuredIconContainer}>
          <Icon name={item.icon} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.featuredTextContainer}>
          <Text style={styles.featuredTitle}>{item.title}</Text>
          <Text style={styles.featuredDescription}>{item.description}</Text>
        </View>
        <Button
          title={item.buttonText}
          size="small"
          rightIcon="arrow-right"
          onPress={item.onPress}
          style={styles.featuredButton}
          gradient={['#FFFFFF33', '#FFFFFF20']}
          textStyle={{ color: '#FFFFFF' }}
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
 
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
              Sarah
            </Text>
          </View>
          <View style={styles.headerRight}>
            <ThemeToggle style={styles.themeToggle} />
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Image 
                source={require('../assets/images/placeholder-avatar.png')}
                style={styles.profileImage}
              />
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
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === 'ios' ? scale(40) : scale(20) }
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Featured Carousel */}
        <View style={styles.featuredContainer}>
          <FlatList
            data={featuredItems}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={FEATURE_CARD_WIDTH + scale(16)}
            decelerationRate="fast"
            contentContainerStyle={styles.featuredList}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / (FEATURE_CARD_WIDTH + scale(16))
              );
              setFeaturedIndex(newIndex);
            }}
            initialScrollIndex={featuredIndex}
            getItemLayout={(data, index) => ({
              length: FEATURE_CARD_WIDTH + scale(16),
              offset: (FEATURE_CARD_WIDTH + scale(16)) * index,
              index,
            })}
          />
          <View style={styles.paginationContainer}>
            {featuredItems.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor: index === featuredIndex 
                      ? theme.colors.primary 
                      : `${theme.colors.primary}50`,
                  },
                ]}
              />
            ))}
          </View>
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
          <FlatList
            data={learningPaths}
            renderItem={renderLearningPath}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.learningPathsList}
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
          <FlatList
            data={popularGames}
            renderItem={renderGameCard}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.gamesList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {

  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scale(8),
  },
  headerTitle: {
    fontSize: fontScale(18),
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    bottom: scale(15),
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
    paddingTop: scale(130),
    paddingBottom: scale(20),
  },
  featuredContainer: {
    marginBottom: scale(20),
  },
  featuredList: {
    paddingHorizontal: scale(16),
  },
  featuredCard: {
    marginHorizontal: scale(8),
    height: scale(160),
  },
  featuredContent: {
    flex: 1,
    padding: scale(16),
  },
  featuredIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  featuredTextContainer: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: fontScale(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: scale(4),
  },
  featuredDescription: {
    fontSize: fontScale(14),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuredButton: {
    alignSelf: 'flex-start',
    marginTop: scale(8),
    borderRadius: scale(16),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(12),
  },
  paginationDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginHorizontal: scale(4),
  },
  sectionContainer: {
    marginBottom: scale(20),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    marginBottom: scale(12),
  },
  sectionTitle: {
    fontSize: fontScale(18),
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: fontScale(14),
    fontWeight: '500',
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
  learningPathsList: {
    paddingHorizontal: scale(16),
  },
  learningPathCard: {
    width: scale(260),
    height: scale(150),
    marginRight: scale(12),
  },
  learningPathContent: {
    flex: 1,
    padding: scale(16),
  },
  learningPathTitle: {
    fontSize: fontScale(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: scale(8),
  },
  lessonInfo: {
    flex: 1,
  },
  lessonCount: {
    fontSize: fontScale(14),
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: scale(4),
  },
  progressContainer: {
    marginTop: scale(8),
  },
  progressText: {
    fontSize: fontScale(12),
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: scale(4),
  },
  progressBar: {
    height: scale(6),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: scale(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(3),
  },
  continueButton: {
    alignSelf: 'flex-start',
    marginTop: scale(8),
  },
  gamesList: {
    paddingHorizontal: scale(16),
  },
  gameCard: {
    width: CARD_WIDTH,
    marginRight: scale(12),
  },
  gameCardContent: {
    alignItems: 'center',
    padding: scale(12),
  },
  gameImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    marginBottom: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  gameInfo: {
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: fontScale(14),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: scale(4),
    textAlign: 'center',
  },
  levelBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  levelText: {
    fontSize: fontScale(10),
    color: '#FFFFFF',
  },
  playButton: {
    position: 'absolute',
    top: scale(12),
    right: scale(12),
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen; 