import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WordAssociationGameProps } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type WordPairType = {
  id: number;
  word1: string;
  word2: string;
  isRelated: boolean;
};

// Sample data for word association game
const generateWordPairs = () => {
  const relatedPairs = [
    { id: 1, word1: 'Sky', word2: 'Blue', isRelated: true },
    { id: 2, word1: 'Fire', word2: 'Hot', isRelated: true },
    { id: 3, word1: 'Water', word2: 'Wet', isRelated: true },
    { id: 4, word1: 'Sun', word2: 'Bright', isRelated: true },
    { id: 5, word1: 'Night', word2: 'Dark', isRelated: true },
    { id: 6, word1: 'Snow', word2: 'Cold', isRelated: true },
    { id: 7, word1: 'Bird', word2: 'Fly', isRelated: true },
    { id: 8, word1: 'Flower', word2: 'Bloom', isRelated: true },
    { id: 9, word1: 'Book', word2: 'Read', isRelated: true },
    { id: 10, word1: 'Run', word2: 'Fast', isRelated: true },
  ];
  
  const unrelatedPairs = [
    { id: 11, word1: 'Cat', word2: 'Computer', isRelated: false },
    { id: 12, word1: 'Tree', word2: 'Dance', isRelated: false },
    { id: 13, word1: 'Ocean', word2: 'Mountain', isRelated: false },
    { id: 14, word1: 'Pen', word2: 'Kitchen', isRelated: false },
    { id: 15, word1: 'Car', word2: 'Butterfly', isRelated: false },
    { id: 16, word1: 'Chair', word2: 'Lightning', isRelated: false },
    { id: 17, word1: 'Phone', word2: 'Cake', isRelated: false },
    { id: 18, word1: 'Shoe', word2: 'Cloud', isRelated: false },
    { id: 19, word1: 'Lamp', word2: 'Fish', isRelated: false },
    { id: 20, word1: 'Door', word2: 'Banana', isRelated: false },
  ];
  
  // Combine and shuffle pairs
  const allPairs = [...relatedPairs, ...unrelatedPairs];
  return allPairs.sort(() => Math.random() - 0.5).slice(0, 10);
};

const WordAssociationGame = ({ navigation, route }: WordAssociationGameProps) => {
  const { theme, isDarkMode } = useTheme();
  const [wordPairs, setWordPairs] = useState<WordPairType[]>(generateWordPairs());
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [correctAnimation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleAnswer = (answer: boolean) => {
    const currentPair = wordPairs[currentPairIndex];
    
    if (answer === currentPair.isRelated) {
      // Correct answer
      setScore(score + 10);
      
      // Play correct animation
      Animated.sequence([
        Animated.timing(correctAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(correctAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Wrong answer
      // Play shake animation
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    // Move to next pair or end game
    if (currentPairIndex < wordPairs.length - 1) {
      setCurrentPairIndex(currentPairIndex + 1);
    } else {
      setGameOver(true);
    }
  };
  
  const restartGame = () => {
    setWordPairs(generateWordPairs());
    setCurrentPairIndex(0);
    setScore(0);
    setGameOver(false);
    setTimeRemaining(60);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const currentPair = wordPairs[currentPairIndex];
  
  const cardScale = correctAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.headerButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Word Association</Text>
        <View style={styles.timerContainer}>
          <Icon name="clock-outline" size={20} color="#FFFFFF" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentPairIndex) / wordPairs.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentPairIndex + 1}/{wordPairs.length}
        </Text>
      </View>
      
      {!gameOver ? (
        <View style={styles.gameContent}>
          <Text style={styles.instructionText}>
            Are these words related to each other?
          </Text>
          
          <Animated.View 
            style={[
              styles.wordPairContainer,
              {
                transform: [
                  { translateX: shakeAnimation },
                  { scale: cardScale }
                ]
              }
            ]}
          >
            <Text style={styles.word}>{currentPair.word1}</Text>
            <Icon name="swap-vertical" size={30} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.word}>{currentPair.word2}</Text>
          </Animated.View>
          
          <View style={styles.answersContainer}>
            <TouchableOpacity
              style={[styles.answerButton, styles.yesButton]}
              onPress={() => handleAnswer(true)}
            >
              <Icon name="check" size={24} color="#FFFFFF" />
              <Text style={styles.answerButtonText}>RELATED</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.answerButton, styles.noButton]}
              onPress={() => handleAnswer(false)}
            >
              <Icon name="close" size={24} color="#FFFFFF" />
              <Text style={styles.answerButtonText}>NOT RELATED</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.gameOverContainer}>
          <Icon name="trophy" size={80} color="#FFD700" />
          <Text style={styles.gameOverTitle}>Game Over!</Text>
          <Text style={styles.gameOverScore}>Your Score: {score}</Text>
          
          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Icon name="check-circle" size={24} color="#4CAF50" />
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Correct Answers: {score / 10}
              </Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
              <Icon name="clock-outline" size={24} color="#2196F3" />
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                Time Taken: {60 - timeRemaining}s
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.restartButton}
            onPress={restartGame}
          >
            <Icon name="restart" size={20} color="#FFFFFF" />
            <Text style={styles.restartButtonText}>Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('GamesScreen')}
          >
            <Icon name="home" size={20} color="#6200EE" />
            <Text style={styles.homeButtonText}>Go to Games</Text>
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    marginLeft: 5,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 20,
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
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'right',
  },
  gameContent: {
    flex: 1,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  wordPairContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 40,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 10,
  },
  icon: {
    marginVertical: 10,
  },
  answersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    width: '48%',
  },
  yesButton: {
    backgroundColor: '#4CAF50',
  },
  noButton: {
    backgroundColor: '#F44336',
  },
  answerButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  gameOverScore: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 30,
  },
  statsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '100%',
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
  },
  homeButtonText: {
    color: '#6200EE',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default WordAssociationGame; 