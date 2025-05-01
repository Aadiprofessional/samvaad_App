import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SequenceGameProps } from '../types/navigation';

const { width } = Dimensions.get('window');
const GRID_SIZE = 3;
const CARD_MARGIN = 10;
const CARD_SIZE = (width - 60) / GRID_SIZE; // 60 = paddingHorizontal 20 * 2 + margin between cards

type CardType = {
  id: number;
  selected: boolean;
  highlighted: boolean;
  animValue: Animated.Value;
};

const SequenceGame = ({ navigation }: SequenceGameProps) => {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [cards, setCards] = useState<CardType[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const showingRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize cards
  useEffect(() => {
    const initialCards = Array(GRID_SIZE * GRID_SIZE)
      .fill(0)
      .map((_, index) => ({
        id: index,
        selected: false,
        highlighted: false,
        animValue: new Animated.Value(1),
      }));
    setCards(initialCards);
  }, []);
  
  // Start a new level
  const startLevel = () => {
    // Clear any previous timers
    if (showingRef.current) clearTimeout(showingRef.current);
    if (sequenceRef.current) clearTimeout(sequenceRef.current);
    
    setGameStarted(true);
    setPlayerSequence([]);
    
    // Generate a random sequence based on level
    const newSequence = Array(level + 2)
      .fill(0)
      .map(() => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
    
    setSequence(newSequence);
    setIsShowingSequence(true);
    
    // Show sequence to player
    showSequence(newSequence);
  };
  
  // Show the sequence to player
  const showSequence = (seq: number[]) => {
    let currentIndex = 0;
    
    const highlightNext = () => {
      if (currentIndex > 0) {
        // Reset previous card
        setCards((prev) =>
          prev.map((card) =>
            card.id === seq[currentIndex - 1]
              ? { ...card, highlighted: false }
              : card
          )
        );
      }
      
      if (currentIndex < seq.length) {
        // Highlight current card
        setCards((prev) =>
          prev.map((card) =>
            card.id === seq[currentIndex]
              ? { ...card, highlighted: true }
              : card
          )
        );
        
        // Animate the card
        const cardToAnimate = cards.find((c) => c.id === seq[currentIndex]);
        if (cardToAnimate) {
          Animated.sequence([
            Animated.timing(cardToAnimate.animValue, {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(cardToAnimate.animValue, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
        
        currentIndex++;
        sequenceRef.current = setTimeout(highlightNext, 800);
      } else {
        // Sequence finished
        setIsShowingSequence(false);
        setCards((prev) =>
          prev.map((card) => ({ ...card, highlighted: false }))
        );
      }
    };
    
    // Start showing sequence after a short delay
    showingRef.current = setTimeout(highlightNext, 1000);
  };
  
  // Handle player card selection
  const handleCardPress = (cardId: number) => {
    if (isShowingSequence || gameOver) return;
    
    // Animate the card
    const cardToAnimate = cards.find((c) => c.id === cardId);
    if (cardToAnimate) {
      Animated.sequence([
        Animated.timing(cardToAnimate.animValue, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(cardToAnimate.animValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    const newPlayerSequence = [...playerSequence, cardId];
    setPlayerSequence(newPlayerSequence);
    
    // Check if the selection is correct
    const currentIndex = playerSequence.length;
    if (cardId !== sequence[currentIndex]) {
      // Wrong selection
      setGameOver(true);
      Alert.alert(
        'Game Over',
        `Your score: ${score}`,
        [
          {
            text: 'Play Again',
            onPress: restartGame,
          },
        ]
      );
      return;
    }
    
    // Check if the player completed the sequence
    if (newPlayerSequence.length === sequence.length) {
      // Level completed
      const newScore = score + level * 10;
      setScore(newScore);
      setLevel(level + 1);
      
      // Show success message
      Alert.alert(
        'Level Completed',
        `Great job! Moving to level ${level + 1}`,
        [
          {
            text: 'Continue',
            onPress: () => startLevel(),
          },
        ]
      );
    }
  };
  
  // Restart the game
  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setSequence([]);
    setPlayerSequence([]);
    setIsShowingSequence(false);
    setGameOver(false);
    setGameStarted(false);
    
    // Reset cards
    setCards((prev) =>
      prev.map((card) => ({
        ...card,
        selected: false,
        highlighted: false,
      }))
    );
  };
  
  // Generate grid of cards
  const renderCards = () => {
    return (
      <View style={styles.grid}>
        {cards.map((card) => (
          <Animated.View
            key={card.id}
            style={[
              styles.cardContainer,
              {
                transform: [
                  {
                    scale: card.animValue,
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.card,
                card.highlighted && styles.highlightedCard,
                playerSequence.includes(card.id) && styles.selectedCard,
              ]}
              onPress={() => handleCardPress(card.id)}
              disabled={isShowingSequence}
            />
          </Animated.View>
        ))}
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#00C9FF', '#92FE9D']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sequence Memory</Text>
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>Level {level}</Text>
          </View>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        
        <View style={styles.gameArea}>
          {renderCards()}
          
          {isShowingSequence && (
            <View style={styles.overlay}>
              <Text style={styles.overlayText}>Watch the sequence...</Text>
            </View>
          )}
          
          {!gameStarted && !gameOver && (
            <View style={styles.startOverlay}>
              <Text style={styles.gameTitle}>Sequence Memory</Text>
              <Text style={styles.gameInstructions}>
                Watch the pattern, then repeat it by tapping the tiles in the same order
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={startLevel}
              >
                <Text style={styles.startButtonText}>Start Game</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.instructionText}>
            {isShowingSequence
              ? 'Watch carefully...'
              : gameStarted
              ? 'Repeat the sequence!'
              : 'Tap Start to begin'}
          </Text>
          
          {gameStarted && !isShowingSequence && !gameOver && (
            <Text style={styles.progressText}>
              {playerSequence.length}/{sequence.length}
            </Text>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  levelContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: CARD_SIZE * GRID_SIZE + CARD_MARGIN * (GRID_SIZE - 1),
    height: CARD_SIZE * GRID_SIZE + CARD_MARGIN * (GRID_SIZE - 1),
  },
  cardContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: CARD_MARGIN / 2,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
  },
  highlightedCard: {
    backgroundColor: '#FFFFFF',
  },
  selectedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  gameInstructions: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  startButtonText: {
    color: '#00C9FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: '500',
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SequenceGame; 