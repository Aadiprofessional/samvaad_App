import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { GamesScreenProps, GamesStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type GameCategoryType = {
  id: string;
  name: string;
  icon: any;
};

type GameCardProps = {
  title: string;
  description?: string;
  icon: string;
  color1: string;
  color2: string;
  diamonds?: number;
  onPress: () => void;
};

const GameCard = ({
  title,
  icon,
  color1,
  color2,
  diamonds,
  onPress,
}: GameCardProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <TouchableOpacity style={styles.gameCardContainer} onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={isDarkMode ? [color1, color2] : [color1, color2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gameCardGradient}
      >
        {diamonds && (
          <View style={styles.diamondBadge}>
            <Icon name="diamond-stone" size={12} color="#FFFFFF" />
            <Text style={styles.diamondText}>{diamonds}</Text>
          </View>
        )}
        <Image 
          source={require('../assets/images/placeholder-avatar.png')} 
          style={styles.gameCardImage} 
        />
        <Text style={styles.gameCardTitle} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
        <View style={styles.playButtonContainer}>
          <View style={styles.playButton}>
            <Text style={styles.playButtonText}>PLAY</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const GamesScreen = ({ navigation }: GamesScreenProps) => {
  const { width } = useWindowDimensions();
  const { theme, isDarkMode } = useTheme();

  const categories: GameCategoryType[] = [
    { id: 'math', name: 'Math', icon: require('../assets/images/placeholder-avatar.png') },
    { id: 'science', name: 'Science', icon: require('../assets/images/placeholder-avatar.png') },
    { id: 'grammar', name: 'Grammar', icon: require('../assets/images/placeholder-avatar.png') },
    { id: 'music', name: 'Music', icon: require('../assets/images/placeholder-avatar.png') },
  ];

  const recentGames = [
    {
      id: 1,
      title: 'The game of six numbers',
      icon: 'cards',
      color1: '#7F7FD5',
      color2: '#91EAE4',
      navigateTo: 'FlipCardGame',
    },
    {
      id: 2,
      title: 'Around the world',
      icon: 'earth',
      color1: '#43E97B',
      color2: '#38F9D7',
      navigateTo: 'MemoryMatchGame',
    },
  ];

  const newGames = [
    {
      id: 3,
      title: 'Sign Language Quiz',
      icon: 'hand-okay',
      color1: '#FF6A88',
      color2: '#FF99AC',
      diamonds: 10,
      navigateTo: 'SignLanguageQuiz',
    },
    {
      id: 4,
      title: 'Memory Cards',
      icon: 'cards',
      color1: '#F857A6',
      color2: '#FF5858',
      diamonds: 15,
      navigateTo: 'MemoryMatchGame',
    },
    {
      id: 5,
      title: 'Word Memorization',
      icon: 'alphabetical',
      color1: '#7F7FD5',
      color2: '#86A8E7',
      diamonds: 27,
      navigateTo: 'WordMemorizationGame',
    },
    {
      id: 6,
      title: 'Card Flipping',
      icon: 'cards-playing-outline',
      color1: '#43E97B',
      color2: '#38F9D7',
      diamonds: 27,
      navigateTo: 'FlipCardGame',
    },
  ];

  const renderCategoryItem = ({ item }: { item: GameCategoryType }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIconContainer, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
        <Image source={item.icon} style={styles.categoryIcon} />
      </View>
      <Text style={[styles.categoryText, { color: theme.colors.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>What do you want to play today?</Text>
          <View style={[styles.diamondContainer, { backgroundColor: theme.colors.primary }]}>
            <Icon name="diamond-stone" size={16} color="#FFFFFF" />
            <Text style={styles.diamondCountText}>22</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>RECENT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentGamesContainer}>
          {recentGames.map((game) => (
            <TouchableOpacity 
              key={game.id} 
              style={styles.recentGameCard}
              onPress={() => navigation.navigate(game.navigateTo as keyof GamesStackParamList)}
            >
              <LinearGradient
                colors={[game.color1, game.color2]}
                style={styles.recentGameGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.recentGameContent}>
                  <View style={styles.recentGameInfo}>
                    <Text style={styles.recentGameTitle} numberOfLines={2} ellipsizeMode="tail">{game.title}</Text>
                    <Image 
                      source={require('../assets/images/placeholder-avatar.png')} 
                      style={styles.recentGameImage} 
                    />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.categoriesSection}>
          <View style={styles.categoriesHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>CATEGORIES</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See all →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>NEW GAMES</Text>
        <View style={styles.gameCardsContainer}>
          {newGames.map((game) => (
            <GameCard
              key={game.id}
              title={game.title}
              icon={game.icon}
              color1={game.color1}
              color2={game.color2}
              diamonds={game.diamonds}
              onPress={() => navigation.navigate(game.navigateTo as keyof GamesStackParamList)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    width: '75%',
  },
  diamondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  diamondCountText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  recentGamesContainer: {
    marginBottom: 25,
  },
  recentGameCard: {
    width: 250,
    height: 150,
    borderRadius: 15,
    marginRight: 15,
    overflow: 'hidden',
  },
  recentGameGradient: {
    flex: 1,
    padding: 15,
  },
  recentGameContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recentGameInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  recentGameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    maxWidth: '90%',
  },
  recentGameImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  recentGamePlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  recentGamePlayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  categoriesSection: {
    marginBottom: 25,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontWeight: '500',
  },
  categoriesList: {
    paddingVertical: 5,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 60,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  gameCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gameCardContainer: {
    width: '48%',
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  gameCardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  diamondBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  diamondText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  gameCardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  gameCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    maxWidth: '100%',
  },
  playButtonContainer: {
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default GamesScreen; 