import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WordMemorizationGameProps } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Sample sign data
const signs = [
  {
    id: 1,
    letter: 'A',
    image: require('../assets/Handsign/A.png'),
    options: ['A', 'B', 'C', 'X'],
    isCompleted: false,
  },
  {
    id: 2,
    letter: 'B',
    image: require('../assets/Handsign/B.png'),
    options: ['Y', 'B', 'D', 'K'],
    isCompleted: false,
  },
  {
    id: 3,
    letter: 'C',
    image: require('../assets/Handsign/C.png'),
    options: ['Z', 'P', 'C', 'Q'],
    isCompleted: false,
  },
  {
    id: 4,
    letter: 'D',
    image: require('../assets/Handsign/D.png'),
    options: ['D', 'E', 'F', 'G'],
    isCompleted: false,
  },
  {
    id: 5,
    letter: 'E',
    image: require('../assets/Handsign/E.png'),
    options: ['J', 'K', 'E', 'L'],
    isCompleted: false,
  },
];

// Game levels data
const levels = [
  { 
    id: 1, 
    isUnlocked: true, 
    isCompleted: false,
    type: 'reward',
    icon: 'gift',
    color: '#4AE3B5',
    position: { top: 50, left: width / 4 - 30 },
  },
  { 
    id: 2, 
    isUnlocked: false, 
    isCompleted: false,
    type: 'lock',
    icon: 'lock',
    color: '#9D78F3',
    position: { top: 150, left: width / 2 - 30 },
  },
  { 
    id: 3, 
    isUnlocked: false, 
    isCompleted: false,
    type: 'lock',
    icon: 'lock',
    color: '#9D78F3',
    position: { top: 250, left: width / 2 - 30 },
  },
  { 
    id: 4, 
    isUnlocked: false, 
    isCompleted: false,
    type: 'lock',
    icon: 'lock',
    color: '#9D78F3',
    position: { top: 350, left: width / 2 - 30 },
  },
  { 
    id: 5, 
    isUnlocked: false, 
    isCompleted: false,
    type: 'reward',
    icon: 'gift',
    color: '#4AE3B5',
    position: { top: 350, left: width * 3/4 - 30 },
  },
  { 
    id: 6, 
    isUnlocked: false, 
    isCompleted: false,
    type: 'level',
    text: '1',
    color: '#FF6A6A',
    position: { top: 450, left: width / 2 - 30 },
  },
];

// Game paths connecting the levels
const paths = [
  { 
    from: 1, 
    to: 2, 
    isUnlocked: true,
    color: '#9D78F3',
  },
  { 
    from: 2, 
    to: 3, 
    isUnlocked: false,
    color: '#9D78F3',
  },
  { 
    from: 3, 
    to: 4, 
    isUnlocked: false,
    color: '#9D78F3',
  },
  { 
    from: 4, 
    to: 5, 
    isUnlocked: false,
    color: '#4AE3B5',
  },
  { 
    from: 4, 
    to: 6, 
    isUnlocked: false,
    color: '#FF6A6A',
  },
];

const WordMemorizationGame = ({ navigation }: WordMemorizationGameProps) => {
  const { theme, isDarkMode } = useTheme();
  const [gameStarted, setGameStarted] = useState(false);
  const [showLevelMap, setShowLevelMap] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameLevels, setGameLevels] = useState(levels);
  const [gamePaths, setGamePaths] = useState(paths);
  const [shakeAnimation] = useState(new Animated.Value(0));

  const handlePause = () => {
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
  };

  const handleStartGame = (levelId: number) => {
    // Check if level is unlocked
    const level = gameLevels.find(l => l.id === levelId);
    if (!level || !level.isUnlocked) return;

    setCurrentLevel(levelId);
    setShowLevelMap(false);
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameCompleted(false);
  };

  const handleAnswer = (answer: string) => {
    const correct = answer === signs[currentQuestion].letter;
    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 10);
    } else {
      // Shake animation for wrong answer
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }

    setTimeout(() => {
      if (currentQuestion < signs.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // Game completed logic
        completeLevel();
      }
    }, 1000);
  };

  const completeLevel = () => {
    // Mark the current level as completed
    const updatedLevels = gameLevels.map(level => 
      level.id === currentLevel ? { ...level, isCompleted: true } : level
    );
    
    // Unlock the next levels
    const nextLevels = updatedLevels.map(level => {
      if ((level.id === currentLevel + 1) || 
          (currentLevel === 4 && (level.id === 5 || level.id === 6))) {
        return { ...level, isUnlocked: true };
      }
      return level;
    });
    
    // Update paths
    const updatedPaths = gamePaths.map(path => {
      if (path.from === currentLevel) {
        return { ...path, isUnlocked: true };
      }
      return path;
    });
    
    setGameLevels(nextLevels);
    setGamePaths(updatedPaths);
    setGameCompleted(true);
  };

  const renderLevelMap = () => {
    return (
      <View style={styles.levelMapContainer}>
        <Text style={styles.levelMapTitle}>Word Memorization</Text>
        
        <View style={styles.levelMap}>
          {/* Render level paths */}
          {gamePaths.map((path, index) => {
            const fromLevel = gameLevels.find(l => l.id === path.from);
            const toLevel = gameLevels.find(l => l.id === path.to);
            
            if (!fromLevel || !toLevel) return null;
            
            // Calculate path position and angle
            const fromX = fromLevel.position.left + 30;
            const fromY = fromLevel.position.top + 30;
            const toX = toLevel.position.left + 30;
            const toY = toLevel.position.top + 30;
            
            const angle = Math.atan2(toY - fromY, toX - fromX) * (180 / Math.PI);
            const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
            
            const pathStyle = {
              width: distance,
              height: 3,
              backgroundColor: path.isUnlocked ? path.color : '#888888',
              position: 'absolute' as const,
              top: fromY,
              left: fromX,
              transform: [
                { translateX: 0 },
                { translateY: 0 },
                { rotate: `${angle}deg` },
                { translateX: 0 },
                { translateY: 0 },
              ],
              transformOrigin: '0 0',
            };
            
            return <View key={`path-${index}`} style={pathStyle} />;
          })}
          
          {/* Render level nodes */}
          {gameLevels.map((level) => (
            <TouchableOpacity
              key={`level-${level.id}`}
              style={[
                styles.levelNode,
                { backgroundColor: level.color },
                { top: level.position.top, left: level.position.left },
                !level.isUnlocked && styles.lockedLevel,
              ]}
              onPress={() => handleStartGame(level.id)}
              disabled={!level.isUnlocked}
            >
              {level.type === 'reward' ? (
                <Icon name="gift" size={24} color="#FFFFFF" />
              ) : level.type === 'lock' ? (
                <Icon name="lock" size={24} color="#FFFFFF" />
              ) : (
                <Text style={styles.levelNodeText}>{level.text}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.beginButton} 
          onPress={() => handleStartGame(1)}
        >
          <Text style={styles.beginButtonText}>Begin!</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGameQuestion = () => {
    if (currentQuestion >= signs.length) return null;
    
    const sign = signs[currentQuestion];
    
    return (
      <View style={styles.gameContainer}>
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={['#FF6A88', '#FF99AC']}
            style={[styles.progressBar, { width: `${((currentQuestion) / signs.length) * 100}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        
        <View style={styles.questionContainer}>
          <Text style={styles.questionTitle}>Question {currentQuestion + 1}</Text>
          
          <View style={styles.signImageContainer}>
            <Image source={sign.image} style={styles.signImage} />
          </View>
          
          <Text style={styles.questionText}>Which word starts with this letter?</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {sign.options.map((option) => (
            <TouchableOpacity
              key={`option-${option}`}
              style={[
                styles.optionButton,
                selectedAnswer === option && isCorrect && styles.correctOption,
                selectedAnswer === option && !isCorrect && styles.wrongOption,
                selectedAnswer && option === sign.letter && styles.correctOption,
              ]}
              onPress={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <Animated.Text
                style={[
                  styles.optionText,
                  selectedAnswer === option && !isCorrect && {
                    transform: [{ translateX: shakeAnimation }],
                  },
                ]}
              >
                {option}
              </Animated.Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderCompletionScreen = () => {
    return (
      <View style={styles.completionContainer}>
        <Icon name="trophy" size={60} color="#FFD700" />
        <Text style={styles.completionTitle}>Level Completed!</Text>
        <Text style={styles.completionScore}>Your Score: {score}</Text>
        <Text style={styles.completionMessage}>
          {score >= 40
            ? 'Excellent! You\'re a sign language pro!'
            : score >= 30
            ? 'Great job! Keep practicing!'
            : 'Good effort! Try again to improve!'}
        </Text>
        
        <View style={styles.completionButtonsContainer}>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => handleStartGame(currentLevel)}
          >
            <Text style={styles.tryAgainButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.nextLevelButton}
            onPress={() => setShowLevelMap(true)}
          >
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.nextLevelGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextLevelButtonText}>Back to Map</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Word Memorization</Text>
        <TouchableOpacity 
          onPress={handlePause}
          style={[styles.headerButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}
        >
          <Icon name="pause" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      {showLevelMap && renderLevelMap()}
      {gameStarted && !gameCompleted && !showLevelMap && renderGameQuestion()}
      {gameCompleted && !showLevelMap && renderCompletionScreen()}
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
  levelMapContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  levelMapTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 40,
  },
  levelMap: {
    flex: 1,
    position: 'relative',
  },
  levelNode: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  lockedLevel: {
    opacity: 0.6,
  },
  levelNodeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  beginButton: {
    backgroundColor: '#333333',
    paddingVertical: 15,
    marginBottom: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  beginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    padding: 20,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    marginBottom: 30,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  signImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#FF6A88',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#F44336',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  completionScore: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  completionMessage: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 40,
  },
  completionButtonsContainer: {
    width: '100%',
  },
  tryAgainButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  tryAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextLevelButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  nextLevelGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextLevelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WordMemorizationGame;