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
        colors={[color1, color2]}
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
        <View style={styles.gameCardContent}>
          <Image 
            source={require('../assets/images/placeholder-avatar.png')} 
            style={styles.gameCardImage} 
          />
          <Text style={styles.gameCardTitle} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          <View style={styles.playButtonContainer}>
            <View style={styles.playButton}>
              <Text style={styles.playButtonText}>PLAY</Text>
            </View>
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
      title: 'Memory Sequence',
      icon: 'cards',
      color1: '#F857A6',
      color2: '#FF5858',
      navigateTo: 'MemoryMatchGame',
    },
    {
      id: 2,
      title: 'Sign Language Quiz',
      icon: 'hand-okay',
      color1: '#FF6A88',
      color2: '#FF99AC',
      navigateTo: 'SignLanguageQuiz',
    },
  ];

  const newGames = [
    {
      id: 1,
      title: 'Sign Language Quiz',
      icon: 'hand-okay',
      color1: '#FF6A88',
      color2: '#FF99AC',
      diamonds: 10,
      navigateTo: 'SignLanguageQuiz',
    },
    {
      id: 2,
      title: 'Memory Sequence',
      icon: 'cards',
      color1: '#F857A6',
      color2: '#FF5858',
      diamonds: 15,
      navigateTo: 'MemoryMatchGame',
    },
    {
      id: 3,
      title: 'Card Flipping',
      icon: 'cards-playing-outline',
      color1: '#43E97B',
      color2: '#38F9D7',
      diamonds: 20,
      navigateTo: 'FlipCardGame',
    },
    {
      id: 4,
      title: 'Story Time',
      icon: 'book-open-variant',
      color1: '#FF8489',
      color2: '#D76EAD',
      diamonds: 30,
      navigateTo: 'StoryTimeGame',
    },
    {
      id: 5,
      title: 'Word Association',
      icon: 'connection',
      color1: '#6D78E1',
      color2: '#00B4D8',
      diamonds: 18,
      navigateTo: 'WordAssociationGame',
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
                style={styles.recentGameGradient }
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
    height: 150,
  },
  recentGameCard: {
    width: 250,
    height: 160,
    borderRadius: 15,
    marginRight: 10,

    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  recentGameGradient: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
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
    fontSize: 14,
  },
  categoriesList: {
    paddingVertical: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 25,
    width: 70,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
  },
  categoryText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  gameCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  gameCardContainer: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  gameCardGradient: {
    width: '100%',
    height: 180,
  },
  gameCardContent: {
    padding: 15,
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameCardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  gameCardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    height: 50,
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
    zIndex: 10,
  },
  diamondText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  playButtonContainer: {
    alignItems: 'center',
    marginTop: 5,
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