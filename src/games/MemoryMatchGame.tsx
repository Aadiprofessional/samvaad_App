import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useIsFocused } from '@react-navigation/native';
import { GamesStackParamList } from '../types/navigation';

const { width } = Dimensions.get('window');
const GRID_SIZE = 4; // 4x4 grid
const CARD_MARGIN = 3;
const CARD_WIDTH = (width - 60) / GRID_SIZE;
const CARD_HEIGHT = CARD_WIDTH * 1.2;

// Sample images for cards
const cardImages = [
  require('../assets/Handsign/A.png'), // Ideally replace with actual images
  require('../assets/Handsign/B.png'),
  require('../assets/Handsign/C.png'),
  require('../assets/Handsign/D.png'),
  require('../assets/Handsign/E.png'),
  require('../assets/Handsign/F.png'),
  require('../assets/Handsign/G.png'),
  require('../assets/Handsign/H.png'),
  require('../assets/Handsign/I.png'),
  require('../assets/Handsign/J.png'),
  require('../assets/Handsign/K.png'),
  require('../assets/Handsign/L.png'),
  require('../assets/Handsign/M.png'),
  require('../assets/Handsign/N.png'),
  require('../assets/Handsign/O.png'),
  require('../assets/Handsign/P.png'),
  require('../assets/Handsign/Q.png'),
  require('../assets/Handsign/R.png'),
  require('../assets/Handsign/S.png'),
  require('../assets/Handsign/T.png'),
  require('../assets/Handsign/U.png'),
  require('../assets/Handsign/V.png'),
  require('../assets/Handsign/W.png'),
  require('../assets/Handsign/X.png'),
  require('../assets/Handsign/Y.png'),
  require('../assets/Handsign/Z.png'),
];

// Sample data for memory sequence game
// In a real app, these would be loaded from a database or API
const gameLevels = [
  {
    level: 1,
    name: 'Beginner',
    grid: { rows: 4, cols: 4 },
    word: "TEAM",
    wordMeaning: "A group of people working together on a task",
    cards: [
      { id: 1, value: 'T', color: '#FF5F6D', image: cardImages[19] },
      { id: 2, value: 'T', color: '#FF5F6D', image: cardImages[19] },
      { id: 3, value: 'E', color: '#FFC371', image: cardImages[4] },
      { id: 4, value: 'E', color: '#FFC371', image: cardImages[4] },
      { id: 5, value: 'A', color: '#11998e', image: cardImages[0] },
      { id: 6, value: 'A', color: '#11998e', image: cardImages[0] },
      { id: 7, value: 'M', color: '#38ef7d', image: cardImages[12] },
      { id: 8, value: 'M', color: '#38ef7d', image: cardImages[12] },
      { id: 9, value: 'X', color: '#6a11cb', image: cardImages[23] },
      { id: 10, value: 'X', color: '#6a11cb', image: cardImages[23] },
      { id: 11, value: 'Y', color: '#2575fc', image: cardImages[24] },
      { id: 12, value: 'Y', color: '#2575fc', image: cardImages[24] },
      { id: 13, value: 'Z', color: '#3494E6', image: cardImages[25] },
      { id: 14, value: 'Z', color: '#3494E6', image: cardImages[25] },
      { id: 15, value: 'W', color: '#EC6EAD', image: cardImages[22] },
      { id: 16, value: 'W', color: '#EC6EAD', image: cardImages[22] },
    ],
  },
  {
    level: 2,
    name: 'Intermediate',
    grid: { rows: 4, cols: 4 },
    word: "LEARN",
    wordMeaning: "To gain knowledge or skill through study or experience",
    cards: [
      { id: 17, value: 'L', color: '#FBD786', image: cardImages[11] },
      { id: 18, value: 'L', color: '#FBD786', image: cardImages[11] },
      { id: 19, value: 'E', color: '#f5af19', image: cardImages[4] },
      { id: 20, value: 'E', color: '#f5af19', image: cardImages[4] },
      { id: 21, value: 'A', color: '#43cea2', image: cardImages[0] },
      { id: 22, value: 'A', color: '#43cea2', image: cardImages[0] },
      { id: 23, value: 'R', color: '#185a9d', image: cardImages[17] },
      { id: 24, value: 'R', color: '#185a9d', image: cardImages[17] },
      { id: 25, value: 'N', color: '#F86CA7', image: cardImages[13] },
      { id: 26, value: 'N', color: '#F86CA7', image: cardImages[13] },
      { id: 27, value: 'X', color: '#F4D444', image: cardImages[23] },
      { id: 28, value: 'X', color: '#F4D444', image: cardImages[23] },
      { id: 29, value: 'Y', color: '#3494E6', image: cardImages[24] },
      { id: 30, value: 'Y', color: '#3494E6', image: cardImages[24] },
      { id: 31, value: 'Z', color: '#EC6EAD', image: cardImages[25] },
      { id: 32, value: 'Z', color: '#EC6EAD', image: cardImages[25] },
    ],
  },
  {
    level: 3,
    name: 'Advanced',
    grid: { rows: 4, cols: 4 },
    word: "FLUENT",
    wordMeaning: "Able to express oneself easily and articulately",
    cards: [
      { id: 33, value: 'F', color: '#00b09b', image: cardImages[5] },
      { id: 34, value: 'F', color: '#00b09b', image: cardImages[5] },
      { id: 35, value: 'L', color: '#96c93d', image: cardImages[11] },
      { id: 36, value: 'L', color: '#96c93d', image: cardImages[11] },
      { id: 37, value: 'U', color: '#FDC830', image: cardImages[20] },
      { id: 38, value: 'U', color: '#FDC830', image: cardImages[20] },
      { id: 39, value: 'E', color: '#F37335', image: cardImages[4] },
      { id: 40, value: 'E', color: '#F37335', image: cardImages[4] },
      { id: 41, value: 'N', color: '#654ea3', image: cardImages[13] },
      { id: 42, value: 'N', color: '#654ea3', image: cardImages[13] },
      { id: 43, value: 'T', color: '#eaafc8', image: cardImages[19] },
      { id: 44, value: 'T', color: '#eaafc8', image: cardImages[19] },
      { id: 45, value: 'X', color: '#00F260', image: cardImages[23] },
      { id: 46, value: 'X', color: '#00F260', image: cardImages[23] },
      { id: 47, value: 'Y', color: '#0575E6', image: cardImages[24] },
      { id: 48, value: 'Y', color: '#0575E6', image: cardImages[24] },
    ],
  },
];

type CardType = {
  id: number;
  value: string;
  color: string;
  image: any;
  isFlipped: boolean;
  isMatched: boolean;
};

type MemoryMatchGameProps = {
  navigation: StackNavigationProp<GamesStackParamList, 'MemoryMatchGame'>;
  route: RouteProp<GamesStackParamList, 'MemoryMatchGame'>;
};

const MemoryMatchGame = ({ navigation, route }: MemoryMatchGameProps) => {
  const { theme, isDarkMode } = useTheme();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Sequence related states
  const [displaySequence, setDisplaySequence] = useState<number[]>([]);
  const [expectedSequence, setExpectedSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [showingSequence, setShowingSequence] = useState(false);
  const [hasSequenceFailed, setHasSequenceFailed] = useState(false);
  const [isShowingResult, setIsShowingResult] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sequenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Add code to hide the bottom tab when in the game
  const isFocused = useIsFocused();
  
  useLayoutEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' }
      });
    }
    
    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: undefined
      });
    };
  }, [navigation, isFocused]);

  // Initialize the game with shuffled cards
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      initializeGame();
    }
  }, [gameStarted, currentLevel]);

  // Timer logic
  useEffect(() => {
    if (gameStarted && !gameCompleted && !showingSequence && !isShowingResult) {
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
  }, [gameStarted, gameCompleted, showingSequence, isShowingResult]);

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
        }, 800);
      }, 1000);
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

  // Check user sequence completion
  useEffect(() => {
    if (userSequence.length > 0) {
      // Check if user has completed the expected sequence
      if (userSequence.length === expectedSequence.length) {
        // Check if sequence is correct
        const isCorrect = userSequence.every((val, index) => val === expectedSequence[index]);
        
        if (isCorrect) {
          // Sequence is correct, show success screen
          const timeBonus = Math.max(0, 300 - timer) * 2;
          const moveBonus = Math.max(0, 200 - moves * 5);
          const levelBonus = currentLevel * 100;
          const totalBonus = timeBonus + moveBonus + levelBonus;
          
          setScore((prevScore) => prevScore + 200 + totalBonus); // Bonus for correct sequence
          setGameCompleted(true);
          
          // Show the word and meaning
          setIsShowingResult(true);
          
          setTimeout(() => {
            const levelData = gameLevels[currentLevel - 1];
            Alert.alert(
              'Level Completed!',
              `Word: ${levelData.word}\n${levelData.wordMeaning}\n\nYou've completed level ${currentLevel} in ${timer} seconds with ${moves} moves.\nBonus points: ${totalBonus}`,
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
            setIsShowingResult(false);
          }, 2000);
        } else {
          // Sequence is wrong
          setHasSequenceFailed(true);
          setTimeout(() => {
            Alert.alert(
              'Oops!',
              'You didn\'t follow the correct sequence. Try again?',
              [
                {
                  text: 'Exit',
                  style: 'cancel',
                  onPress: () => {
                    resetGame();
                    navigation.goBack();
                  }
                },
                { 
                  text: 'Try Again', 
                  onPress: () => {
                    // Reset for a new attempt
                    setUserSequence([]);
                    setCards((prevCards) => 
                      prevCards.map((card) => ({ ...card, isFlipped: false }))
                    );
                    setFlippedCards([]);
                    setHasSequenceFailed(false);
                    
                    // Show the sequence again
                    setShowingSequence(true);
                    setSequenceIndex(0);
                  }
                }
              ]
            );
          }, 1000);
        }
      }
    }
  }, [userSequence, expectedSequence, currentLevel, timer, moves, navigation]);

  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setTimer(0);
    setGameCompleted(false);
    setDisplaySequence([]);
    setExpectedSequence([]);
    setUserSequence([]);
    setSequenceIndex(0);
    setShowingSequence(false);
    setHasSequenceFailed(false);
    setIsShowingResult(false);
  };

  const initializeGame = () => {
    const levelData = gameLevels[currentLevel - 1];
    if (!levelData) return;

    // Create and shuffle cards
    const gameCards = levelData.cards.map((card) => ({
      id: card.id,
      value: card.value,
      color: card.color,
      image: card.image,
      isFlipped: false,
      isMatched: false,
    }));

    const shuffledCards = shuffleArray(gameCards);
    setCards(shuffledCards);

    // Generate a sequence of cards that will form the word
    const wordToForm = levelData.word;
    const sequence: number[] = [];
    const expectedSeq: string[] = [];
    
    // Find cards for each letter in the word
    for (const letter of wordToForm) {
      const cardWithLetter = shuffledCards.find(card => 
        card.value === letter && !sequence.includes(card.id)
      );
      
      if (cardWithLetter) {
        sequence.push(cardWithLetter.id);
        expectedSeq.push(cardWithLetter.value);
      }
    }
    
    // If we couldn't find all letters, add some random cards to the sequence
    const remainingCount = Math.min(4, wordToForm.length) - sequence.length;
    if (remainingCount > 0) {
      const remainingCards = shuffledCards.filter(
        card => !sequence.includes(card.id) && !wordToForm.includes(card.value)
      );
      
      for (let i = 0; i < remainingCount && i < remainingCards.length; i++) {
        sequence.push(remainingCards[i].id);
        expectedSeq.push(remainingCards[i].value);
      }
    }

    setDisplaySequence(sequence);
    setExpectedSequence(expectedSeq);
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
    if (showingSequence || hasSequenceFailed || isShowingResult) return;
    
    // Find the card
    const clickedCard = cards.find((card) => card.id === cardId);
    if (!clickedCard) return;
    
    // Prevent clicking the same card twice
    if (clickedCard.isFlipped) return;
    
    // Add to user sequence
    const newUserSequence = [...userSequence, clickedCard.value];
    setUserSequence(newUserSequence);
    
    // Track the move
    setMoves((prevMoves) => prevMoves + 1);
    
    // Flip the card to show visual feedback
    setCards(
      cards.map((card) => {
        if (card.id === cardId) {
          return { ...card, isFlipped: true };
        }
        return card;
      })
    );
    
    // Check if this selection was correct up to this point
    if (newUserSequence.length <= expectedSequence.length &&
        newUserSequence[newUserSequence.length - 1] !== expectedSequence[newUserSequence.length - 1]) {
      // Wrong selection!
      setHasSequenceFailed(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Card component
  const Card = ({ card }: { card: CardType }) => {
    return (
      <TouchableOpacity
        style={[
          styles.card,
          card.isMatched && styles.cardMatched,
        ]}
        onPress={() => handleCardPress(card.id)}
        disabled={card.isFlipped || card.isMatched || showingSequence || isShowingResult || hasSequenceFailed}
        activeOpacity={0.9}
      >
        <View
          style={[
            styles.cardInner,
            {
              backgroundColor: card.isFlipped 
                ? card.color 
                : isDarkMode ? '#333333' : '#2A2A2A',
            },
          ]}
        >
          {card.isFlipped ? (
            <View style={styles.cardFront}>
              <Text style={styles.cardText}>{card.value}</Text>
              <Image source={card.image} style={styles.cardImage} />
            </View>
          ) : (
            <View style={styles.cardBack}>
              <Icon name="cards-playing-outline" size={22} color={isDarkMode ? '#FFFFFF' : '#FFFFFF'} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Game Status Bar Component
  const GameStatusBar = () => (
    <View style={[styles.gameStatusBar, { backgroundColor: '#FFC371' }]}>
      <Text style={styles.gameStatusText}>
        {showingSequence ? 'Watch the sequence...' : 
         hasSequenceFailed ? 'Incorrect sequence!' :
         'Remember and repeat the sequence!'}
      </Text>
    </View>
  );

  // Word Result Component
  const WordResult = () => {
    const levelData = gameLevels[currentLevel - 1];
    return isShowingResult ? (
      <View style={styles.wordResultContainer}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.wordResultGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.wordResultContent}>
            <Text style={styles.wordResultTitle}>Well Done!</Text>
            <Text style={styles.wordResultWord}>{levelData.word}</Text>
            <View style={styles.wordResultMeaningContainer}>
              <Text style={styles.wordResultMeaning} numberOfLines={2} ellipsizeMode="tail">
                {levelData.wordMeaning}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    ) : null;
  };

  // Re-implement the Card rendering
  const renderGameBoard = () => {
    // Only show the first 16 cards in a 4x4 grid
    const displayCards = cards.slice(0, 16);
    
    // Create rows (4 rows)
    const rows = [];
    for (let i = 0; i < 4; i++) {
      const rowCards = displayCards.slice(i * 4, (i + 1) * 4);
      rows.push(
        <View key={`row-${i}`} style={styles.boardRow}>
          {rowCards.map(card => (
            <Card key={card.id} card={card} />
          ))}
        </View>
      );
    }
    
    return (
      <View style={styles.gameBoardContainer}>
        {rows}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.headerButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Memory Sequence</Text>
        <TouchableOpacity 
          onPress={() => {
            if (gameStarted) {
              Alert.alert(
                'Pause Game',
                'Do you want to exit the game?',
                [
                  { text: 'Resume', style: 'cancel' },
                  { 
                    text: 'Exit', 
                    onPress: () => {
                      resetGame();
                      navigation.goBack();
                    } 
                  },
                ]
              );
            }
          }} 
          style={[styles.headerButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}
        >
          <Icon name={gameStarted ? "pause" : "information"} size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {gameStarted ? (
        <View style={styles.gameContainer}>
          <GameStatusBar />
          
          <View style={styles.gameInfo}>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Level</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{currentLevel}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Score</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{score}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Time</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{formatTime(timer)}</Text>
            </View>
            <View style={[styles.infoItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Moves</Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>{moves}</Text>
            </View>
          </View>

          <View style={styles.progressInfo}>
            <Text style={[styles.progressText, { color: theme.colors.text }]}>
              {userSequence.length} / {expectedSequence.length} selected
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(userSequence.length / expectedSequence.length) * 100}%`,
                    backgroundColor: hasSequenceFailed ? '#FF5F6D' : '#38ef7d' 
                  }
                ]} 
              />
            </View>
          </View>

          {renderGameBoard()}
          
          <WordResult />
        </View>
      ) : (
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>Memory Sequence</Text>
          <Text style={[styles.welcomeSubtitle, { color: theme.colors.textSecondary }]}>
            Watch the sequence of cards and repeat it to form the word
          </Text>

          <View style={styles.levelInfo}>
            <Text style={[styles.levelInfoText, { color: theme.colors.text }]}>
              Level {currentLevel}: {gameLevels[currentLevel - 1].name}
            </Text>
            <Text style={[styles.levelDescription, { color: theme.colors.textSecondary }]}>
              4x4 Grid - {gameLevels[currentLevel - 1].word.length} letter word
            </Text>
            <Text style={[styles.levelDescription, { color: theme.colors.textSecondary, marginTop: 5 }]}>
              Word to form: {gameLevels[currentLevel - 1].word}
            </Text>
          </View>

          <View style={styles.instructionsContainer}>
            <Text style={[styles.instructionsTitle, { color: theme.colors.text }]}>How to play:</Text>
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              1. Watch the sequence of cards carefully
            </Text>
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              2. Tap the cards in the same sequence to form the word
            </Text>
            <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
              3. Complete all levels to win!
            </Text>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={() => setGameStarted(true)}>
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
  gameStatusBar: {
    padding: 10,
    alignItems: 'center',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
  },
  gameStatusText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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
  gameContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  gameBoardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: CARD_MARGIN * 2,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: CARD_MARGIN,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  cardInner: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFront: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: CARD_WIDTH * 0.5,
    height: CARD_WIDTH * 0.5,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardBack: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardMatched: {
    opacity: 0.7,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
  },
  levelInfo: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(106, 17, 203, 0.1)',
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  levelInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  levelDescription: {
    fontSize: 14,
    textAlign: 'center',
  },
  instructionsContainer: {
    width: '100%',
    marginBottom: 25,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 10,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 5,
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
  wordResultContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 10,
  },
  wordResultGradient: {
    width: width * 0.8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  wordResultContent: {
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordResultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  wordResultWord: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 25,
    letterSpacing: 10,
    textAlign: 'center',
  },
  wordResultMeaningContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  wordResultMeaning: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    lineHeight: 26,
  },
});

export default MemoryMatchGame; 