import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  BackHandler,
  Platform,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useIsFocused } from '@react-navigation/native';
import { getHiddenTabBarStyle, getDefaultTabBarStyle, getBottomTabBarSpace, manageTabBarVisibility } from '../utils/tabBarStyles';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

// Sample data for the flip card game
// In a real app, these would be loaded from a database or API
const levels = [
  {
    level: 1,
    pairs: [
      { id: 1, symbol: 'A', meaning: 'Apple', image: require('../assets/Handsign/A.png') },
      { id: 2, symbol: 'B', meaning: 'Ball', image: require('../assets/Handsign/B.png') },
      { id: 3, symbol: 'C', meaning: 'Cat', image: require('../assets/Handsign/C.png') },
      { id: 4, symbol: 'D', meaning: 'Dog', image: require('../assets/Handsign/D.png') },
      { id: 5, symbol: 'E', meaning: 'Egg', image: require('../assets/Handsign/E.png') },
      { id: 6, symbol: 'F', meaning: 'Fish', image: require('../assets/Handsign/F.png') },
    ],
  },
  {
    level: 2,
    pairs: [
      { id: 7, symbol: 'G', meaning: 'Goat', image: require('../assets/Handsign/G.png') },
      { id: 8, symbol: 'H', meaning: 'House', image: require('../assets/Handsign/H.png') },
      { id: 9, symbol: 'I', meaning: 'Ice', image: require('../assets/Handsign/I.png') },
      { id: 10, symbol: 'J', meaning: 'Jar', image: require('../assets/Handsign/J.png') },
      { id: 11, symbol: 'K', meaning: 'Kite', image: require('../assets/Handsign/K.png') },
      { id: 12, symbol: 'L', meaning: 'Lion', image: require('../assets/Handsign/L.png') },
    ],
  },
  {
    level: 3,
    pairs: [
      { id: 13, symbol: 'M', meaning: 'Mouse', image: require('../assets/Handsign/M.png') },
      { id: 14, symbol: 'N', meaning: 'Nest', image: require('../assets/Handsign/N.png') },
      { id: 15, symbol: 'O', meaning: 'Orange', image: require('../assets/Handsign/O.png') },
      { id: 16, symbol: 'P', meaning: 'Pen', image: require('../assets/Handsign/P.png') },
      { id: 17, symbol: 'Q', meaning: 'Queen', image: require('../assets/Handsign/Q.png') },
      { id: 18, symbol: 'R', meaning: 'Rabbit', image: require('../assets/Handsign/R.png') },
    ],
  },
];

type NavigationProps = {
  navigation: any;
  route: any;
};

type CardType = {
  id: number;
  symbol: string;
  meaning: string;
  image: any;
  isSymbol?: boolean;
};

const FlipCardGame = ({ navigation, route }: NavigationProps) => {
  const { theme, isDarkMode } = useTheme();
  const { t } = useTranslation();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [cards, setCards] = useState<(CardType & { flipped: boolean, matched: boolean })[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const flipAnimations = useRef<{ [key: number]: Animated.Value }>({}).current;

  // Add code to hide the bottom tab when in the game
  const isFocused = useIsFocused();
  
  useLayoutEffect(() => {
    // Use the utility function to hide tab bar during game
    return manageTabBarVisibility(navigation, isFocused, isDarkMode, true);
  }, [navigation, isFocused, isDarkMode]);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (gameStarted) {
        pauseGame();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [gameStarted]);

  // Initialize game when component mounts
  useEffect(() => {
    if (gameStarted) {
      initializeGame();
      
      // Start timer
      const id = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      setIntervalId(id);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [gameStarted, currentLevel]);

  // Check for match when two cards are selected
  useEffect(() => {
    if (selectedCards.length === 2) {
      const [firstIndex, secondIndex] = selectedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      
      // Increment moves
      setMoves(prev => prev + 1);
      
      // Check if pair matches
      if (firstCard.id === secondCard.id && firstCard.isSymbol !== secondCard.isSymbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === firstIndex || idx === secondIndex
              ? { ...card, matched: true }
              : card
          ));
          setScore(prev => prev + 10);
          setSelectedCards([]);
          
          // Check if all cards are matched
          const allMatched = cards.every((card, idx) => 
            (idx === firstIndex || idx === secondIndex || card.matched)
          );
          
          if (allMatched) {
            handleLevelComplete();
          }
        }, 500);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          // Animate the cards back
          Animated.parallel([
            Animated.timing(flipAnimations[firstIndex], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(flipAnimations[secondIndex], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Update the cards state after animation
            setCards(prev => prev.map((card, idx) => 
              idx === firstIndex || idx === secondIndex
                ? { ...card, flipped: false }
                : card
            ));
          });
          
          // Clear selected cards
          setSelectedCards([]);
        }, 1000);
      }
    }
  }, [selectedCards]);

  const initializeGame = () => {
    const levelData = levels[currentLevel - 1];
    
    // Create pairs of cards (symbol and meaning)
    const gameCards = levelData.pairs.flatMap(pair => [
      { ...pair, isSymbol: true, flipped: false, matched: false },
      { ...pair, isSymbol: false, flipped: false, matched: false }
    ]);
    
    // Shuffle cards
    const shuffledCards = shuffleArray(gameCards);
    
    // Initialize flip animations
    shuffledCards.forEach((_, index) => {
      flipAnimations[index] = new Animated.Value(0);
    });
    
    setCards(shuffledCards);
    setSelectedCards([]);
    setScore(0);
    setMoves(0);
    setTimer(0);
  };

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleCardPress = (index: number) => {
    if (
      selectedCards.length >= 2 || 
      selectedCards.includes(index) || 
      cards[index].flipped || 
      cards[index].matched
    ) {
      return;
    }
    
    // Flip card
    setCards(prev => prev.map((card, idx) => 
      idx === index ? { ...card, flipped: true } : card
    ));
    
    // Add to selected cards
    setSelectedCards(prev => [...prev, index]);
    
    // Animate flip
    Animated.timing(flipAnimations[index], {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleLevelComplete = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    setGameCompleted(true);
    
    const bonusPoints = Math.max(0, 100 - (timer * 2) - (moves * 5));
    const totalScore = score + bonusPoints;
    
    setTimeout(() => {
      Alert.alert(
        t('games.levelCompleted'),
        t('games.levelCompletedMessage', { level: currentLevel, time: timer, moves: moves, bonus: bonusPoints, total: totalScore }),
        [
          {
            text: t('games.nextLevel'),
            onPress: () => {
              if (currentLevel < levels.length) {
                setCurrentLevel(currentLevel + 1);
                resetGame();
              } else {
                // Game completed
                Alert.alert(t('games.congratulations'), t('games.allLevelsCompleted'));
                navigation.goBack();
              }
            },
          },
        ]
      );
    }, 500);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setMoves(0);
    setTimer(0);
    setCards([]);
    setSelectedCards([]);
    
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const pauseGame = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    Alert.alert(
      t('games.gamePaused'),
      t('games.continuePlaying'),
      [
        {
          text: t('games.resume'),
          onPress: () => {
            const id = setInterval(() => {
              setTimer(prev => prev + 1);
            }, 1000);
            setIntervalId(id);
          },
        },
        {
          text: t('games.quit'),
          onPress: () => {
            resetGame();
            navigation.goBack();
          },
          style: 'cancel',
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderCard = (card: CardType & { flipped: boolean, matched: boolean }, index: number) => {
    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
    };

    const backAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '360deg'],
          }),
        },
      ],
    };

    return (
      <TouchableOpacity
        key={index}
        style={styles.cardContainer}
        onPress={() => handleCardPress(index)}
        activeOpacity={0.8}
        disabled={card.matched}
      >
        <View style={styles.cardWrapper}>
          {/* Front of card (icon side) */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardFront,
              frontAnimatedStyle,
              { backgroundColor: isDarkMode ? '#2D2D2D' : '#F5F5F5' },
              card.matched && styles.cardMatched,
            ]}
          >
            <View style={styles.questionMarkContainer}>
              <Icon name="card-account-details-outline" size={36} color="#FFFFFF" />
            </View>
          </Animated.View>

          {/* Back of card (content side) */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardBack,
              backAnimatedStyle,
              { backgroundColor: isDarkMode ? '#333333' : '#FFFFFF' },
              card.matched && styles.cardMatched,
            ]}
          >
            {card.isSymbol ? (
              <View style={styles.cardContent}>
                <Image source={card.image} style={styles.cardImage} />
                <Text style={[styles.cardSymbol, { color: theme.colors.text }]}>{card.symbol}</Text>
              </View>
            ) : (
              <View style={styles.cardContent}>
                <Text style={[styles.cardMeaning, { color: theme.colors.text }]}>{card.meaning}</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.headerButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('games.flipCard')}</Text>
        <TouchableOpacity onPress={pauseGame} style={[styles.headerButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
          <Icon name={gameStarted ? "pause" : "information"} size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {gameStarted ? (
        <>
          <View style={styles.gameInfo}>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{t('games.level')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{currentLevel}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{t('games.score')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{score}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{t('games.time')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{formatTime(timer)}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>{t('games.moves')}</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{moves}</Text>
            </View>
          </View>

          <ScrollView 
            contentContainerStyle={[
              styles.gameContent,
              { paddingBottom: Platform.OS === 'ios' ? 34 : 16 }
            ]}
          >
            <View style={styles.cardsContainer}>
              {cards.map((card, index) => renderCard(card, index))}
            </View>
          </ScrollView>
        </>
      ) : (
        <View style={styles.welcomeContainer}>
          <Image 
            source={require('../assets/images/placeholder-avatar.png')} 
            style={styles.welcomeImage} 
          />
          
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>{t('games.flipCard')}</Text>
          <Text style={[styles.welcomeDescription, { color: theme.colors.textSecondary }]}>
            {t('games.flipCardDescription')}
          </Text>
          
          <View style={styles.levelInfo}>
            <Text style={[styles.levelInfoText, { color: theme.colors.text }]}>
              {t('games.youAreOnLevel', { level: currentLevel })}
            </Text>
            <Text style={[styles.levelInfoSubtext, { color: theme.colors.textSecondary }]}>
              {t('games.completeLevelsToUnlock')}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>{t('games.startGame')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  infoItem: {
    width: '22%',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: width / 2 - 25,
    height: width / 2 - 25,
    marginBottom: 20,
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cardFace: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardFront: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardMatched: {
    opacity: 0.7,
  },
  questionMarkContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#B39DDB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionMark: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
    height: '100%',
  },
  cardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  cardSymbol: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  cardMeaning: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  welcomeDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  levelInfo: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(179, 157, 219, 0.1)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  levelInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  levelInfoSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  startButton: {
    width: width - 60,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FlipCardGame;