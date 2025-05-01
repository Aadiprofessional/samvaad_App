import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 60) / 4;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

// Sample data for memory match game
// In a real app, these would be loaded from a database or API
const gameLevels = [
  {
    level: 1,
    name: 'Beginner',
    grid: { rows: 3, cols: 4 },
    cards: [
      { id: 1, value: 'A', color: '#FF5F6D' },
      { id: 2, value: 'A', color: '#FF5F6D' },
      { id: 3, value: 'B', color: '#FFC371' },
      { id: 4, value: 'B', color: '#FFC371' },
      { id: 5, value: 'C', color: '#11998e' },
      { id: 6, value: 'C', color: '#11998e' },
      { id: 7, value: 'D', color: '#38ef7d' },
      { id: 8, value: 'D', color: '#38ef7d' },
      { id: 9, value: 'E', color: '#6a11cb' },
      { id: 10, value: 'E', color: '#6a11cb' },
      { id: 11, value: 'F', color: '#2575fc' },
      { id: 12, value: 'F', color: '#2575fc' },
    ],
  },
  {
    level: 2,
    name: 'Intermediate',
    grid: { rows: 4, cols: 4 },
    cards: [
      { id: 13, value: 'G', color: '#FBD786' },
      { id: 14, value: 'G', color: '#FBD786' },
      { id: 15, value: 'H', color: '#f5af19' },
      { id: 16, value: 'H', color: '#f5af19' },
      { id: 17, value: 'I', color: '#43cea2' },
      { id: 18, value: 'I', color: '#43cea2' },
      { id: 19, value: 'J', color: '#185a9d' },
      { id: 20, value: 'J', color: '#185a9d' },
      { id: 21, value: 'K', color: '#F86CA7' },
      { id: 22, value: 'K', color: '#F86CA7' },
      { id: 23, value: 'L', color: '#F4D444' },
      { id: 24, value: 'L', color: '#F4D444' },
      { id: 25, value: 'M', color: '#3494E6' },
      { id: 26, value: 'M', color: '#3494E6' },
      { id: 27, value: 'N', color: '#EC6EAD' },
      { id: 28, value: 'N', color: '#EC6EAD' },
    ],
  },
  {
    level: 3,
    name: 'Advanced',
    grid: { rows: 4, cols: 5 },
    cards: [
      { id: 29, value: 'O', color: '#00b09b' },
      { id: 30, value: 'O', color: '#00b09b' },
      { id: 31, value: 'P', color: '#96c93d' },
      { id: 32, value: 'P', color: '#96c93d' },
      { id: 33, value: 'Q', color: '#FDC830' },
      { id: 34, value: 'Q', color: '#FDC830' },
      { id: 35, value: 'R', color: '#F37335' },
      { id: 36, value: 'R', color: '#F37335' },
      { id: 37, value: 'S', color: '#654ea3' },
      { id: 38, value: 'S', color: '#654ea3' },
      { id: 39, value: 'T', color: '#eaafc8' },
      { id: 40, value: 'T', color: '#eaafc8' },
      { id: 41, value: 'U', color: '#00F260' },
      { id: 42, value: 'U', color: '#00F260' },
      { id: 43, value: 'V', color: '#0575E6' },
      { id: 44, value: 'V', color: '#0575E6' },
      { id: 45, value: 'W', color: '#ee9ca7' },
      { id: 46, value: 'W', color: '#ee9ca7' },
      { id: 47, value: 'X', color: '#ffdde1' },
      { id: 48, value: 'X', color: '#ffdde1' },
    ],
  },
];

type CardType = {
  id: number;
  value: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const MemoryMatchGame = ({ navigation, route }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [displaySequence, setDisplaySequence] = useState<number[]>([]);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [showingSequence, setShowingSequence] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize the game with shuffled cards
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      initializeGame();
    }
  }, [gameStarted, currentLevel]);

  // Timer logic
  useEffect(() => {
    if (gameStarted && !gameCompleted && !showingSequence) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameStarted, gameCompleted, showingSequence]);

  // Check for game completion
  useEffect(() => {
    const levelData = gameLevels[currentLevel - 1];
    if (gameStarted && matchedPairs.length === levelData.cards.length / 2) {
      setGameCompleted(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // Calculate bonus points
      const timeBonus = Math.max(0, 300 - timer) * 2;
      const moveBonus = Math.max(0, 200 - moves * 5);
      const levelBonus = currentLevel * 100;
      const totalBonus = timeBonus + moveBonus + levelBonus;
      
      setScore((prevScore) => prevScore + totalBonus);
      
      setTimeout(() => {
        Alert.alert(
          'Level Completed!',
          `You've completed level ${currentLevel} in ${timer} seconds with ${moves} moves.\nBonus points: ${totalBonus}`,
          [
            {
              text: 'Next Level',
              onPress: () => {
                if (currentLevel < gameLevels.length) {
                  setCurrentLevel(currentLevel + 1);
                  resetGame();
                  setGameStarted(true);
                } else {
                  // Game completed
                  Alert.alert('Congratulations!', 'You have completed all levels!');
                  navigation.goBack();
                }
              },
            },
          ]
        );
      }, 1000);
    }
  }, [matchedPairs, gameStarted, currentLevel, timer, moves, navigation]);

  // Sequence display logic
  useEffect(() => {
    if (showingSequence && sequenceIndex < displaySequence.length) {
      sequenceTimerRef.current = setTimeout(() => {
        const cardId = displaySequence[sequenceIndex];
        // Flip the card
        setCards((prevCards) => 
          prevCards.map((card) => 
            card.id === cardId 
              ? { ...card, isFlipped: true } 
              : card
          )
        );

        // Flip it back after a short delay
        setTimeout(() => {
          setCards((prevCards) => 
            prevCards.map((card) => 
              card.id === cardId 
                ? { ...card, isFlipped: false } 
                : card
            )
          );
          setSequenceIndex(sequenceIndex + 1);
        }, 600);
      }, 800);
    } else if (sequenceIndex >= displaySequence.length && showingSequence) {
      setShowingSequence(false);
      setSequenceIndex(0);
    }

    return () => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
    };
  }, [showingSequence, sequenceIndex, displaySequence]);

  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimer(0);
    setGameCompleted(false);
    setDisplaySequence([]);
    setSequenceIndex(0);
    setShowingSequence(false);
  };

  const initializeGame = () => {
    const levelData = gameLevels[currentLevel - 1];
    if (!levelData) return;

    // Create and shuffle cards
    const gameCards = levelData.cards.map((card) => ({
      id: card.id,
      value: card.value,
      color: card.color,
      isFlipped: false,
      isMatched: false,
    }));

    const shuffledCards = shuffleArray(gameCards);
    setCards(shuffledCards);

    // Generate a sequence of cards to show initially
    const sequenceLength = Math.min(4, levelData.cards.length / 2);
    const sequence: number[] = [];
    const usedValues = new Set<string>();

    while (sequence.length < sequenceLength) {
      const randomIndex = Math.floor(Math.random() * shuffledCards.length);
      const card = shuffledCards[randomIndex];
      
      if (!usedValues.has(card.value)) {
        usedValues.add(card.value);
        sequence.push(card.id);
        
        // Find the matching card
        const matchingCard = shuffledCards.find(c => c.value === card.value && c.id !== card.id);
        if (matchingCard) {
          sequence.push(matchingCard.id);
        }
      }
    }

    setDisplaySequence(sequence);
    setShowingSequence(true);
  };

  const shuffleArray = (array: CardType[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCardPress = (cardId: number) => {
    if (
      flippedCards.length === 2 || 
      flippedCards.includes(cardId) || 
      showingSequence
    ) return;

    // Find the card
    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard || clickedCard.isMatched) return;

    // Add card to flipped cards
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Update the cards state to show the flipped card
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          return { ...card, isFlipped: true };
        }
        return card;
      })
    );

    // Check for a match if 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves((prevMoves) => prevMoves + 1);

      const firstCardId = newFlippedCards[0];
      const secondCardId = newFlippedCards[1];
      const firstCard = cards.find((card) => card.id === firstCardId);
      const secondCard = cards.find((card) => card.id === secondCardId);

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // It's a match
        setTimeout(() => {
          setMatchedPairs([...matchedPairs, firstCard.value]);
          setCards(
            cards.map((card) => {
              if (card.id === firstCardId || card.id === secondCardId) {
                return { ...card, isMatched: true };
              }
              return card;
            })
          );
          setFlippedCards([]);
          setScore((prevScore) => prevScore + 50); // Add points for a match
        }, 500);
      } else {
        // Not a match, flip them back
        setTimeout(() => {
          setCards(
            cards.map((card) => {
              if (card.id === firstCardId || card.id === secondCardId) {
                return { ...card, isFlipped: false };
              }
              return card;
            })
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Card component
  const Card = ({ card }: { card: CardType }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.spring(animatedValue, {
        toValue: card.isFlipped ? 180 : 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }, [card.isFlipped]);

    const frontInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = {
      transform: [{ rotateY: frontInterpolate }],
    };

    const backAnimatedStyle = {
      transform: [{ rotateY: backInterpolate }],
    };

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => handleCardPress(card.id)}
        disabled={card.isFlipped || card.isMatched || showingSequence}
        activeOpacity={0.9}
      >
        <Animated.View style={[styles.cardFace, styles.cardBack, frontAnimatedStyle]}>
          <LinearGradient
            colors={['#2F80ED', '#56CCF2']}
            style={styles.cardBackContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Icon name="help-circle-outline" size={24} color="#FFFFFF" />
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[styles.cardFace, styles.cardFront, backAnimatedStyle]}>
          <LinearGradient
            colors={[card.color, card.color]}
            style={styles.cardFrontContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.cardValue}>{card.value}</Text>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#6200EE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Match Game</Text>
        <TouchableOpacity onPress={() => {}} style={styles.helpButton}>
          <Icon name="help-circle-outline" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>

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

      {!gameStarted ? (
        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>Memory Match</Text>
          <Text style={styles.startSubtitle}>{gameLevels[currentLevel - 1].name} Level</Text>
          <Text style={styles.startDescription}>
            Remember the sequence shown and find all matching pairs of sign language cards.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={() => setGameStarted(true)}>
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
        <ScrollView contentContainerStyle={styles.gameBoard}>
          {showingSequence && (
            <View style={styles.sequenceOverlay}>
              <Text style={styles.sequenceText}>Watch the sequence...</Text>
            </View>
          )}
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
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
  backButton: {
    padding: 5,
  },
  helpButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  levelBadge: {
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    color: '#6200EE',
    fontWeight: 'bold',
    fontSize: 12,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  startSubtitle: {
    fontSize: 18,
    color: '#6200EE',
    marginBottom: 20,
  },
  startDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  startButton: {
    width: '60%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
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
  gameBoard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: 5,
    position: 'relative',
  },
  cardFace: {
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFrontContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  cardBackContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sequenceOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sequenceText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MemoryMatchGame; 