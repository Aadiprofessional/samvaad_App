import React, { useState, useEffect, useRef } from 'react';
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

const { width, height } = Dimensions.get('window');

// Sample data for the flip card game
// In a real app, these would be loaded from a database or API
const levels = [
  {
    level: 1,
    pairs: [
      { id: 1, symbol: 'A', meaning: 'Apple', image: require('../assets/images/placeholder-avatar.png') },
      { id: 2, symbol: 'B', meaning: 'Ball', image: require('../assets/images/placeholder-avatar.png') },
      { id: 3, symbol: 'C', meaning: 'Cat', image: require('../assets/images/placeholder-avatar.png') },
      { id: 4, symbol: 'D', meaning: 'Dog', image: require('../assets/images/placeholder-avatar.png') },
      { id: 5, symbol: 'E', meaning: 'Egg', image: require('../assets/images/placeholder-avatar.png') },
      { id: 6, symbol: 'F', meaning: 'Fish', image: require('../assets/images/placeholder-avatar.png') },
    ],
  },
  {
    level: 2,
    pairs: [
      { id: 7, symbol: 'G', meaning: 'Goat', image: require('../assets/images/placeholder-avatar.png') },
      { id: 8, symbol: 'H', meaning: 'House', image: require('../assets/images/placeholder-avatar.png') },
      { id: 9, symbol: 'I', meaning: 'Ice', image: require('../assets/images/placeholder-avatar.png') },
      { id: 10, symbol: 'J', meaning: 'Jar', image: require('../assets/images/placeholder-avatar.png') },
      { id: 11, symbol: 'K', meaning: 'Kite', image: require('../assets/images/placeholder-avatar.png') },
      { id: 12, symbol: 'L', meaning: 'Lion', image: require('../assets/images/placeholder-avatar.png') },
    ],
  },
  {
    level: 3,
    pairs: [
      { id: 13, symbol: 'M', meaning: 'Mouse', image: require('../assets/images/placeholder-avatar.png') },
      { id: 14, symbol: 'N', meaning: 'Nest', image: require('../assets/images/placeholder-avatar.png') },
      { id: 15, symbol: 'O', meaning: 'Orange', image: require('../assets/images/placeholder-avatar.png') },
      { id: 16, symbol: 'P', meaning: 'Pen', image: require('../assets/images/placeholder-avatar.png') },
      { id: 17, symbol: 'Q', meaning: 'Queen', image: require('../assets/images/placeholder-avatar.png') },
      { id: 18, symbol: 'R', meaning: 'Rabbit', image: require('../assets/images/placeholder-avatar.png') },
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
            idx === firstIndex || idx === secondIndex || card.matched
          );
          
          if (allMatched) {
            handleLevelComplete();
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map((card, idx) => 
            idx === firstIndex || idx === secondIndex
              ? { ...card, flipped: false }
              : card
          ));
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
        'Level Completed!',
        `You've completed level ${currentLevel} in ${timer} seconds with ${moves} moves.\nBonus points: ${bonusPoints}\nTotal Score: ${totalScore}`,
        [
          {
            text: 'Next Level',
            onPress: () => {
              if (currentLevel < levels.length) {
                setCurrentLevel(currentLevel + 1);
                resetGame();
              } else {
                // Game completed
                Alert.alert('Congratulations!', 'You have completed all levels!');
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
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
    setGameCompleted(false);
  };

  const pauseGame = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    Alert.alert(
      'Game Paused',
      'Do you want to continue or exit?',
      [
        {
          text: 'Continue',
          onPress: () => {
            // Resume timer
            const id = setInterval(() => {
              setTimer(prev => prev + 1);
            }, 1000);
            setIntervalId(id);
          },
        },
        {
          text: 'Exit',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCard = (card: CardType & { flipped: boolean, matched: boolean }, index: number) => {
    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnimations[index]?.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
          }) || '0deg',
        },
      ],
    };

    const backAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnimations[index]?.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '360deg'],
          }) || '180deg',
        },
      ],
    };

    return (
      <TouchableOpacity
        key={index}
        style={styles.cardContainer}
        onPress={() => handleCardPress(index)}
        disabled={card.flipped || card.matched}
      >
        <View style={[styles.card, card.matched && styles.matchedCard]}>
          {/* Card Back */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardBack,
              card.flipped || card.matched ? { opacity: 0 } : { opacity: 1 },
              frontAnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.cardGradient}
            >
              <Icon name="help" size={36} color="#fff" />
            </LinearGradient>
          </Animated.View>

          {/* Card Front */}
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardFront,
              card.flipped || card.matched ? { opacity: 1 } : { opacity: 0 },
              backAnimatedStyle,
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F0F0F0']}
              style={styles.cardGradient}
            >
              {card.isSymbol ? (
                <Text style={styles.cardSymbol}>{card.symbol}</Text>
              ) : (
                <Text style={styles.cardMeaning}>{card.meaning}</Text>
              )}
            </LinearGradient>
          </Animated.View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => gameStarted ? pauseGame() : navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#6200EE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flip Card Game</Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => gameStarted && pauseGame()}>
          <Icon name="pause" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>

      {gameStarted && (
        <View style={styles.gameInfo}>
          <View style={styles.infoItem}>
            <Icon name="trophy" size={20} color="#6200EE" />
            <Text style={styles.infoText}>{score}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="counter" size={20} color="#6200EE" />
            <Text style={styles.infoText}>{moves}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="clock-outline" size={20} color="#6200EE" />
            <Text style={styles.infoText}>{formatTime(timer)}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {currentLevel}</Text>
          </View>
        </View>
      )}

      {!gameStarted ? (
        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>Flip Card Game</Text>
          <Text style={styles.startSubtitle}>Level {currentLevel}</Text>
          <Text style={styles.startDescription}>
            Match sign language symbols with their meanings. Find all pairs to complete the level!
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>Start Game</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.gameContainer}>
          <View style={styles.cardsGrid}>
            {cards.map((card, index) => renderCard(card, index))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  backButton: {
    padding: 5,
  },
  infoButton: {
    padding: 5,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  levelBadge: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  startSubtitle: {
    fontSize: 20,
    color: '#6200EE',
    marginBottom: 20,
  },
  startDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  startButton: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameContainer: {
    padding: 10,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardContainer: {
    width: width / 3 - 20,
    height: width / 3 - 20,
    margin: 8,
  },
  card: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  matchedCard: {
    opacity: 0.7,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#6200EE',
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSymbol: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
  },
  cardMeaning: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    padding: 5,
  },
  unityContainer: {
    flex: 1,
  },
  unityView: {
    flex: 1,
  },
});

export default FlipCardGame; 