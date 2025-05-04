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
import { useTheme } from '../context/ThemeContext';

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
  const { theme, isDarkMode } = useTheme();
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
  
  // Add pauseGame function
  const pauseGame = () => {
    if (gameStarted && !isShowingSequence) {
      Alert.alert(
        'Game Paused',
        'What would you like to do?',
        [
          {
            text: 'Resume',
            style: 'cancel',
          },
          {
            text: 'Quit Game',
            onPress: () => navigation.goBack(),
            style: 'destructive',
          },
        ]
      );
    }
  };
  
  // Generate grid of cards
  const renderCards = () => {
    return cards.map((card) => (
      <Animated.View
        key={card.id}
        style={[
          styles.tile,
          card.highlighted && { backgroundColor: '#6A11CB' }, 
          playerSequence.includes(card.id) && { backgroundColor: '#4CAF50' },
          { transform: [{ scale: card.animValue }] },
          { borderColor: isDarkMode ? '#444444' : '#DDDDDD' }
        ]}
      >
        <TouchableOpacity
          style={styles.tileInner}
          onPress={() => handleCardPress(card.id)}
          disabled={isShowingSequence}
        />
      </Animated.View>
    ));
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.headerButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Sequence Game</Text>
        <TouchableOpacity 
          onPress={pauseGame} 
          style={[styles.headerButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}
        >
          <Icon name={gameStarted ? "pause" : "information"} size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      {gameStarted ? (
        <View style={styles.gameContent}>
          <View style={styles.gameInfo}>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Level</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{level}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Score</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{score}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Round</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{level}</Text>
            </View>
          </View>
          
          <View style={styles.gameStatusContainer}>
            {isShowingSequence ? (
              <Text style={[styles.gameStatus, { color: theme.colors.textSecondary }]}>
                Watch the sequence...
              </Text>
            ) : gameStarted ? (
              <Text style={[styles.gameStatus, { color: theme.colors.textSecondary }]}>
                Your turn - Repeat the sequence
              </Text>
            ) : null}
          </View>
          
          <View style={styles.tilesContainer}>
            {renderCards()}
          </View>
        </View>
      ) : (
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Sequence Game</Text>
          <Text style={[styles.welcomeDescription, { color: theme.colors.textSecondary }]}>
            Watch the sequence of sign language symbols and repeat it in the correct order.
          </Text>
          
          <View style={styles.levelInfo}>
            <Text style={[styles.levelInfoText, { color: theme.colors.text }]}>
              Current Level: {level}
            </Text>
            <Text style={[styles.levelInfoSubtext, { color: theme.colors.textSecondary }]}>
              {/* getLevelDescription(level) */}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.startButton} onPress={startLevel}>
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>Start Game</Text>
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
  gameContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
  },
  infoItem: {
    padding: 10,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameStatusContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  gameStatus: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: CARD_SIZE * GRID_SIZE + CARD_MARGIN * (GRID_SIZE - 1),
    maxWidth: width - 40,
  },
  tile: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    margin: CARD_MARGIN / 2,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  tileInner: {
    width: '100%',
    height: '100%',
  },
  tileText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  welcomeDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  levelInfo: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'rgba(106, 17, 203, 0.1)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  levelInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelInfoSubtext: {
    fontSize: 16,
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SequenceGame; 