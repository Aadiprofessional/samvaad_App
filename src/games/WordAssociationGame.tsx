import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  Animated,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WordAssociationGameProps } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useIsFocused } from '@react-navigation/native';

type WordPairType = {
  id: number;
  word1: string;
  word2: string;
  sign1: any; // Using 'any' for the image source to fix type issues
  sign2: any; // Using 'any' for the image source to fix type issues
  isRelated: boolean;
  signLanguageContext?: string; // Description of sign language relationship
};

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Sign language related word pairs for different levels
const wordPairsData = {
  beginner: [
    { id: 1, word1: 'Hand', word2: 'Sign', sign1: require('../assets/Handsign/H.png'), sign2: require('../assets/Handsign/S.png'), isRelated: true, signLanguageContext: 'Hands are used to create signs' },
    { id: 2, word1: 'Hello', word2: 'Wave', sign1: require('../assets/Handsign/H.png'), sign2: require('../assets/Handsign/W.png'), isRelated: true, signLanguageContext: 'The hello sign resembles a wave' },
    { id: 3, word1: 'Family', word2: 'Group', sign1: require('../assets/Handsign/F.png'), sign2: require('../assets/Handsign/G.png'), isRelated: true, signLanguageContext: 'Family signs show relationships' },
    { id: 4, word1: 'Food', word2: 'Mouth', sign1: require('../assets/Handsign/F.png'), sign2: require('../assets/Handsign/M.png'), isRelated: true, signLanguageContext: 'Food signs often touch the mouth' },
    { id: 5, word1: 'Water', word2: 'Drink', sign1: require('../assets/Handsign/W.png'), sign2: require('../assets/Handsign/D.png'), isRelated: true, signLanguageContext: 'The water sign mimics drinking' },
    { id: 6, word1: 'Book', word2: 'Open', sign1: require('../assets/Handsign/B.png'), sign2: require('../assets/Handsign/O.png'), isRelated: true, signLanguageContext: 'The book sign shows opening motion' },
    { id: 7, word1: 'Door', word2: 'Close', sign1: require('../assets/Handsign/D.png'), sign2: require('../assets/Handsign/C.png'), isRelated: true, signLanguageContext: 'Door sign shows opening/closing' },
    { id: 8, word1: 'Hat', word2: 'Head', sign1: require('../assets/Handsign/H.png'), sign2: require('../assets/Handsign/H.png'), isRelated: true, signLanguageContext: 'Hat sign is made at the head' },
    { id: 9, word1: 'Sleep', word2: 'Eyes', sign1: require('../assets/Handsign/S.png'), sign2: require('../assets/Handsign/E.png'), isRelated: true, signLanguageContext: 'Sleep sign shows closing eyes' },
    { id: 10, word1: 'Thank you', word2: 'Polite', sign1: require('../assets/Handsign/T.png'), sign2: require('../assets/Handsign/P.png'), isRelated: true, signLanguageContext: 'Used in polite interactions' },
    
    { id: 11, word1: 'Table', word2: 'Moon', sign1: require('../assets/Handsign/T.png'), sign2: require('../assets/Handsign/M.png'), isRelated: false },
    { id: 12, word1: 'Sign', word2: 'Rocket', sign1: require('../assets/Handsign/S.png'), sign2: require('../assets/Handsign/R.png'), isRelated: false },
    { id: 13, word1: 'Hand', word2: 'Cloud', sign1: require('../assets/Handsign/H.png'), sign2: require('../assets/Handsign/C.png'), isRelated: false },
    { id: 14, word1: 'Hello', word2: 'Mountain', sign1: require('../assets/Handsign/H.png'), sign2: require('../assets/Handsign/M.png'), isRelated: false },
    { id: 15, word1: 'Name', word2: 'Potato', sign1: require('../assets/Handsign/N.png'), sign2: require('../assets/Handsign/P.png'), isRelated: false },
  ],
  
  intermediate: [
    { id: 16, word1: 'Classifier', word2: 'Description', sign1: require('../assets/Handsign/C.png'), sign2: require('../assets/Handsign/D.png'), isRelated: true, signLanguageContext: 'Classifiers describe objects and movements' },
    { id: 17, word1: 'Fingerspell', word2: 'Alphabet', sign1: require('../assets/Handsign/F.png'), sign2: require('../assets/Handsign/A.png'), isRelated: true, signLanguageContext: 'Fingerspelling uses manual alphabet' },
    { id: 18, word1: 'Non-manual', word2: 'Face', sign1: require('../assets/Handsign/N.png'), sign2: require('../assets/Handsign/F.png'), isRelated: true, signLanguageContext: 'Non-manual markers include facial expressions' },
    { id: 19, word1: 'ASL', word2: 'American', sign1: require('../assets/Handsign/A.png'), sign2: require('../assets/Handsign/A.png'), isRelated: true, signLanguageContext: 'American Sign Language' },
    { id: 20, word1: 'BSL', word2: 'British', sign1: require('../assets/Handsign/B.png'), sign2: require('../assets/Handsign/B.png'), isRelated: true, signLanguageContext: 'British Sign Language' },
    { id: 21, word1: 'Iconic', word2: 'Visual', sign1: require('../assets/Handsign/I.png'), sign2: require('../assets/Handsign/V.png'), isRelated: true, signLanguageContext: 'Iconic signs visually represent meaning' },
    { id: 22, word1: 'Orientation', word2: 'Direction', sign1: require('../assets/Handsign/O.png'), sign2: require('../assets/Handsign/D.png'), isRelated: true, signLanguageContext: 'Hand orientation is a sign parameter' },
    { id: 23, word1: 'Movement', word2: 'Action', sign1: require('../assets/Handsign/M.png'), sign2: require('../assets/Handsign/A.png'), isRelated: true, signLanguageContext: 'Movement is a key component of signs' },
    { id: 24, word1: 'Location', word2: 'Space', sign1: require('../assets/Handsign/L.png'), sign2: require('../assets/Handsign/S.png'), isRelated: true, signLanguageContext: 'Signs occur in specific locations' },
    { id: 25, word1: 'Handshape', word2: 'Form', sign1: require('../assets/Handsign/H.png'), sign2: require('../assets/Handsign/F.png'), isRelated: true, signLanguageContext: 'Handshape is a sign parameter' },
    
    { id: 26, word1: 'Classifier', word2: 'Ocean', sign1: require('../assets/Handsign/C.png'), sign2: require('../assets/Handsign/O.png'), isRelated: false },
    { id: 27, word1: 'Fingerspell', word2: 'Furniture', sign1: require('../assets/Handsign/F.png'), sign2: require('../assets/Handsign/U.png'), isRelated: false },
    { id: 28, word1: 'ASL', word2: 'Cooking', sign1: require('../assets/Handsign/A.png'), sign2: require('../assets/Handsign/C.png'), isRelated: false },
    { id: 29, word1: 'Location', word2: 'Chemistry', sign1: require('../assets/Handsign/L.png'), sign2: require('../assets/Handsign/C.png'), isRelated: false },
    { id: 30, word1: 'Movement', word2: 'Instrument', sign1: require('../assets/Handsign/M.png'), sign2: require('../assets/Handsign/I.png'), isRelated: false },
  ],
  
  advanced: [
    { id: 31, word1: 'Interpreter', word2: 'Mediate', sign1: require('../assets/Handsign/I.png'), sign2: require('../assets/Handsign/M.png'), isRelated: true, signLanguageContext: 'Interpreters mediate between languages' },
    { id: 32, word1: 'Simultaneous', word2: 'Concurrent', sign1: require('../assets/Handsign/S.png'), sign2: require('../assets/Handsign/C.png'), isRelated: true, signLanguageContext: 'Signing occurs simultaneously with meaning' },
    { id: 33, word1: 'Syntax', word2: 'Grammar', sign1: require('../assets/Handsign/S.png'), sign2: require('../assets/Handsign/G.png'), isRelated: true, signLanguageContext: 'Sign languages have their own syntax' },
    { id: 34, word1: 'Deixis', word2: 'Pointing', sign1: require('../assets/Handsign/D.png'), sign2: require('../assets/Handsign/P.png'), isRelated: true, signLanguageContext: 'Deictic signs point to establish reference' },
    { id: 35, word1: 'Register', word2: 'Formality', sign1: require('../assets/Handsign/R.png'), sign2: require('../assets/Handsign/F.png'), isRelated: true, signLanguageContext: 'Sign language has formal/informal registers' },
    { id: 36, word1: 'Neologism', word2: 'New', sign1: require('../assets/Handsign/N.png'), sign2: require('../assets/Handsign/E.png'), isRelated: true, signLanguageContext: 'New signs evolve for new concepts' },
    { id: 37, word1: 'Metaphor', word2: 'Conceptual', sign1: require('../assets/Handsign/M.png'), sign2: require('../assets/Handsign/C.png'), isRelated: true, signLanguageContext: 'Signs can express metaphorical concepts' },
    { id: 38, word1: 'Prosody', word2: 'Rhythm', sign1: require('../assets/Handsign/P.png'), sign2: require('../assets/Handsign/R.png'), isRelated: true, signLanguageContext: 'Sign languages have rhythmic patterns' },
    { id: 39, word1: 'Deaf Culture', word2: 'Community', sign1: require('../assets/Handsign/D.png'), sign2: require('../assets/Handsign/C.png'), isRelated: true, signLanguageContext: 'Shared cultural identity and norms' },
    { id: 40, word1: 'Bilingual', word2: 'Multimodal', sign1: require('../assets/Handsign/B.png'), sign2: require('../assets/Handsign/M.png'), isRelated: true, signLanguageContext: 'Many signers are bilingual/multimodal' },
    
    { id: 41, word1: 'Syntax', word2: 'Waterfall', sign1: require('../assets/Handsign/S.png'), sign2: require('../assets/Handsign/W.png'), isRelated: false },
    { id: 42, word1: 'Deixis', word2: 'Strawberry', sign1: require('../assets/Handsign/D.png'), sign2: require('../assets/Handsign/S.png'), isRelated: false },
    { id: 43, word1: 'Interpreter', word2: 'Galaxy', sign1: require('../assets/Handsign/I.png'), sign2: require('../assets/Handsign/G.png'), isRelated: false },
    { id: 44, word1: 'Register', word2: 'Pyramid', sign1: require('../assets/Handsign/R.png'), sign2: require('../assets/Handsign/P.png'), isRelated: false },
    { id: 45, word1: 'Prosody', word2: 'Monument', sign1: require('../assets/Handsign/P.png'), sign2: require('../assets/Handsign/M.png'), isRelated: false },
  ]
};

// Generate word pairs based on difficulty level
const generateWordPairs = (level: DifficultyLevel) => {
  const pairs = wordPairsData[level];
  // Separate related and unrelated pairs
  const relatedPairs = pairs.filter(pair => pair.isRelated);
  const unrelatedPairs = pairs.filter(pair => !pair.isRelated);
  
  // Take 7 related and 3 unrelated pairs, then shuffle
  const selectedPairs = [
    ...relatedPairs.slice(0, 7),
    ...unrelatedPairs.slice(0, 3)
  ];
  
  return selectedPairs.sort(() => Math.random() - 0.5);
};

// Add WordPairDifficulty type definition
type WordPairDifficulty = 'beginner' | 'intermediate' | 'advanced';

const WordAssociationGame = ({ navigation, route }: WordAssociationGameProps) => {
  const { theme, isDarkMode } = useTheme();
  const [level, setLevel] = useState<DifficultyLevel>('beginner');
  const [wordPairs, setWordPairs] = useState<WordPairType[]>(generateWordPairs(level));
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [correctAnimation] = useState(new Animated.Value(0));
  const [showLevelSelection, setShowLevelSelection] = useState(true);
  const [learningPoints, setLearningPoints] = useState<string[]>([]);
  
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
  
  useEffect(() => {
    if (!showLevelSelection && !gameOver) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            // End game immediately
            setTimeout(() => setGameOver(true), 100);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showLevelSelection, gameOver]);
  
  const handleAnswer = (answer: boolean) => {
    const currentPair = wordPairs[currentPairIndex];
    
    if (answer === currentPair.isRelated) {
      // Correct answer - update score immediately
      setScore(prevScore => prevScore + 10);
      
      // Store learning point if available
      if (currentPair.signLanguageContext && currentPair.isRelated) {
        setLearningPoints(prev => [...prev, currentPair.signLanguageContext!]);
      }
      
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
      // Short delay before showing next pair
      setTimeout(() => {
        setCurrentPairIndex(currentPairIndex + 1);
      }, 300);
    } else {
      // End game immediately without delay
      setGameOver(true);
    }
  };
  
  const selectLevel = (selectedLevel: DifficultyLevel) => {
    setLevel(selectedLevel);
    setWordPairs(generateWordPairs(selectedLevel));
    setCurrentPairIndex(0);
    setScore(0);
    setLearningPoints([]);
    setGameOver(false);
    setTimeRemaining(60);
    setShowLevelSelection(false);
  };
  
  const restartGame = () => {
    setWordPairs(generateWordPairs(level));
    setCurrentPairIndex(0);
    setScore(0);
    setLearningPoints([]);
    setGameOver(false);
    setTimeRemaining(60);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getLevelColor = (level: WordPairDifficulty): [string, string] => {
    switch (level) {
      case 'beginner':
        return ['#4CAF50', '#8BC34A'];
      case 'intermediate':
        return ['#2196F3', '#03A9F4'];
      case 'advanced':
        return ['#9C27B0', '#673AB7'];
      default:
        return ['#2196F3', '#03A9F4'];
    }
  };
  
  const currentPair = wordPairs[currentPairIndex];
  
  const cardScale = correctAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });
  
  // Render level selection screen
  const renderLevelSelection = () => {
    const isDarkMode = theme.colors.background === '#000000';
    
    return (
      <View style={styles.levelSelectionContainer}>
        <Text style={[styles.headerText, isDarkMode && { color: '#FFFFFF' }]}>
          Choose Difficulty Level
        </Text>
        
        <View style={styles.levelsContainer}>
          {['beginner', 'intermediate', 'advanced'].map((level) => {
            const typedLevel = level as WordPairDifficulty;
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelCard,
                  { backgroundColor: isDarkMode ? '#333333' : '#FFFFFF' }
                ]}
                onPress={() => handleLevelSelect(typedLevel)}
              >
                <View 
                  style={[
                    styles.levelBadge, 
                    { backgroundColor: getLevelColor(typedLevel)[0] }
                  ]}
                >
                  <Text style={styles.levelBadgeText}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </View>
                
                <View style={styles.levelContent}>
                  <Text style={[styles.levelTitle, isDarkMode && { color: '#FFFFFF' }]}>
                    Sign Language {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                  
                  <Text style={[styles.levelDescription, isDarkMode && { color: '#CCCCCC' }]}>
                    {level === 'beginner' 
                      ? 'Basic signs and everyday words' 
                      : level === 'intermediate'
                        ? 'Sign language terminology and concepts'
                        : 'Technical terms and complex signing concepts'}
                  </Text>
                  
                  <Text style={[styles.pairsCount, isDarkMode && { color: '#AAAAAA' }]}>
                    {wordPairsData[typedLevel].length} word pairs
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };
  
  const renderWordPair = () => {
    if (!currentPair) return null;
    
    const isDarkMode = theme.colors.background === '#000000';

    return (
      <View style={styles.wordPairContainer}>
        <View style={styles.wordPairRow}>
          <View style={[
            styles.wordContainer, 
            { 
              backgroundColor: isDarkMode ? '#333333' : 'rgba(255, 255, 255, 0.9)',
              borderColor: isDarkMode ? '#555555' : '#e0e0e0',
              marginRight: 10,
            }
          ]}>
            <Image
              source={currentPair.sign1}
              style={styles.signImage}
              resizeMode="contain"
            />
            <Text style={[
              styles.wordText, 
              { color: isDarkMode ? '#FFFFFF' : '#333333' }
            ]}>
              {currentPair.word1}
            </Text>
          </View>
          
          <View style={[
            styles.wordContainer, 
            {
              backgroundColor: isDarkMode ? '#333333' : 'rgba(255, 255, 255, 0.9)',
              borderColor: isDarkMode ? '#555555' : '#e0e0e0',
              marginLeft: 10,
            }
          ]}>
            <Image
              source={currentPair.sign2}
              style={styles.signImage}
              resizeMode="contain"
            />
            <Text style={[
              styles.wordText, 
              { color: isDarkMode ? '#FFFFFF' : '#333333' }
            ]}>
              {currentPair.word2}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  // Add the handleLevelSelect method
  const handleLevelSelect = (level: WordPairDifficulty) => {
    // Set the selected level
    setLevel(level);
    setWordPairs(generateWordPairs(level));
    setCurrentPairIndex(0);
    setScore(0);
    setLearningPoints([]);
    setGameOver(false);
    setTimeRemaining(60);
    setShowLevelSelection(false);
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Sign Word Association</Text>
        {!showLevelSelection && !gameOver && (
          <View style={[styles.timerContainer, { backgroundColor: isDarkMode ? '#333333' : 'rgba(255, 255, 255, 0.2)' }]}>
            <Icon name="clock-outline" size={20} color={theme.colors.primary} />
            <Text style={[styles.timerText, { color: theme.colors.primary }]}>{formatTime(timeRemaining)}</Text>
          </View>
        )}
        {(showLevelSelection || gameOver) && (
          <View style={{ width: 80 }} />
        )}
      </View>
      
      {showLevelSelection ? (
        renderLevelSelection()
      ) : !gameOver ? (
        <LinearGradient
          colors={getLevelColor(level as WordPairDifficulty)}
          style={styles.gameBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.levelIndicator}>
            <Text style={styles.levelIndicatorText}>
              {level.charAt(0).toUpperCase() + level.slice(1)} Level
            </Text>
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
          
          <View style={styles.gameContent}>
            <Text style={styles.instructionText}>
              Are these sign language concepts related?
            </Text>
            
            <Animated.View 
              style={[
                styles.wordPairContainer,
                {
                  transform: [
                    { translateX: shakeAnimation },
                    { scale: cardScale }
                  ],
                  backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.2)'
                }
              ]}
            >
              {renderWordPair()}
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
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={getLevelColor(level as WordPairDifficulty)}
          style={styles.gameBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.gameOverContainer}>
            <Icon name="trophy" size={80} color="#FFD700" />
            <Text style={styles.gameOverTitle}>Game Completed!</Text>
            <Text style={styles.gameOverScore}>Your Score: {score}</Text>
            
            <View style={[styles.statsContainer, { backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.2)' }]}>
              <View style={[styles.statItem, { backgroundColor: isDarkMode ? '#222' : '#FFFFFF' }]}>
                <Icon name="check-circle" size={24} color="#4CAF50" />
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Correct Answers: {score / 10}
                </Text>
              </View>
              <View style={[styles.statItem, { backgroundColor: isDarkMode ? '#222' : '#FFFFFF' }]}>
                <Icon name="clock-outline" size={24} color="#2196F3" />
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Time Taken: {60 - timeRemaining}s
                </Text>
              </View>
              
              {learningPoints.length > 0 && (
                <View style={styles.learningPointsContainer}>
                  <Text style={[styles.learningPointsTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                    Sign Language Insights:
                  </Text>
                  {learningPoints.slice(0, 3).map((point, index) => (
                    <View key={index} style={[styles.learningPoint, { backgroundColor: isDarkMode ? '#222' : '#FFFFFF' }]}>
                      <Icon name="lightbulb-on" size={20} color="#FFD700" />
                      <Text style={[styles.learningPointText, { color: theme.colors.textSecondary }]}>
                        {point}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            
            <TouchableOpacity
              style={styles.restartButton}
              onPress={restartGame}
            >
              <Icon name="restart" size={20} color="#FFFFFF" />
              <Text style={styles.restartButtonText}>Play Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.levelSelectButton}
              onPress={() => setShowLevelSelection(true)}
            >
              <Icon name="signal-variant" size={20} color="#6200EE" />
              <Text style={styles.levelSelectButtonText}>Change Level</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  timerText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  gameBackground: {
    flex: 1,
    paddingTop: 20,
  },
  levelIndicator: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  levelIndicatorText: {
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
    marginHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  instructionText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  wordPairContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  wordPairRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  wordContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 12,
    flex: 1,
    maxWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
    color: '#333',
  },
  signImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  answersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingBottom: 30,
    marginBottom: 50,
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
    padding: 20,
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
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
  },
  statLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  learningPointsContainer: {
    marginTop: 15,
  },
  learningPointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  learningPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
  },
  learningPointText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
  levelSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
  },
  levelSelectButtonText: {
    color: '#6200EE',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  // Level selection styles
  levelSelectionContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333333',
  },
  levelsContainer: {
    width: '100%',
  },
  levelCard: {
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelBadge: {
    width: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  levelBadgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    transform: [{ rotate: '-90deg' }],
    width: 100,
    textAlign: 'center',
  },
  levelContent: {
    padding: 20,
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  levelDescription: {
    fontSize: 16,
    marginBottom: 12,
    color: '#666666',
  },
  pairsCount: {
    fontSize: 14,
    color: '#888888',
  },
});

export default WordAssociationGame; 