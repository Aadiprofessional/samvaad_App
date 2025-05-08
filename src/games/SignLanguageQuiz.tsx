import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SignLanguageQuizProps } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useIsFocused } from '@react-navigation/native';

// Quiz question type definition
type QuizQuestion = {
  id: number;
  signImage: ImageSourcePropType;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

// Sample quiz data - in a real app, this would come from an API
const quizQuestions: QuizQuestion[] = [
  // Level 1 - Beginner (7 questions)
  {
    id: 1,
    signImage: require('../assets/Handsign/H.png'),
    options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
    correctAnswer: 'Hello',
    difficulty: 'easy',
  },
  {
    id: 2,
    signImage: require('../assets/Handsign/G.png'),
    options: ['Help', 'Goodbye', 'Sorry', 'Friend'],
    correctAnswer: 'Goodbye',
    difficulty: 'easy',
  },
  {
    id: 3,
    signImage: require('../assets/Handsign/T.png'),
    options: ['Please', 'Sorry', 'Thank you', 'Welcome'],
    correctAnswer: 'Thank you',
    difficulty: 'easy',
  },
  {
    id: 4,
    signImage: require('../assets/Handsign/Y.png'),
    options: ['Yes', 'No', 'Maybe', 'Ok'],
    correctAnswer: 'Yes',
    difficulty: 'easy',
  },
  {
    id: 5,
    signImage: require('../assets/Handsign/N.png'),
    options: ['Stop', 'No', 'Bad', 'Don\'t'],
    correctAnswer: 'No',
    difficulty: 'easy',
  },
  {
    id: 6,
    signImage: require('../assets/Handsign/P.png'),
    options: ['Help', 'Please', 'Want', 'Need'],
    correctAnswer: 'Please',
    difficulty: 'easy',
  },
  {
    id: 7,
    signImage: require('../assets/Handsign/S.png'),
    options: ['Sorry', 'Sad', 'Mistake', 'Forgive'],
    correctAnswer: 'Sorry',
    difficulty: 'easy',
  },
  
  // Level 2 - Intermediate (10 questions)
  {
    id: 8,
    signImage: require('../assets/Handsign/F.png'),
    options: ['Group', 'Team', 'Family', 'Friends'],
    correctAnswer: 'Family',
    difficulty: 'medium',
  },
  {
    id: 9,
    signImage: require('../assets/Handsign/F.png'),
    options: ['Brother', 'Friend', 'Partner', 'Classmate'],
    correctAnswer: 'Friend',
    difficulty: 'medium',
  },
  {
    id: 10,
    signImage: require('../assets/Handsign/W.png'),
    options: ['Build', 'Create', 'Work', 'Make'],
    correctAnswer: 'Work',
    difficulty: 'medium',
  },
  {
    id: 11,
    signImage: require('../assets/Handsign/S.png'),
    options: ['Building', 'Library', 'School', 'College'],
    correctAnswer: 'School',
    difficulty: 'medium',
  },
  {
    id: 12,
    signImage: require('../assets/Handsign/E.png'),
    options: ['Drink', 'Eat', 'Food', 'Hungry'],
    correctAnswer: 'Eat',
    difficulty: 'medium',
  },
  {
    id: 13,
    signImage: require('../assets/Handsign/D.png'),
    options: ['Water', 'Drink', 'Thirsty', 'Cup'],
    correctAnswer: 'Drink',
    difficulty: 'medium',
  },
  {
    id: 14,
    signImage: require('../assets/Handsign/H.png'),
    options: ['Assist', 'Help', 'Support', 'Aid'],
    correctAnswer: 'Help',
    difficulty: 'medium',
  },
  {
    id: 15,
    signImage: require('../assets/Handsign/H.png'),
    options: ['Happy', 'Smile', 'Laugh', 'Joy'],
    correctAnswer: 'Happy',
    difficulty: 'medium',
  },
  {
    id: 16,
    signImage: require('../assets/Handsign/S.png'),
    options: ['Cry', 'Sad', 'Upset', 'Unhappy'],
    correctAnswer: 'Sad',
    difficulty: 'medium',
  },
  {
    id: 17,
    signImage: require('../assets/Handsign/T.png'),
    options: ['Clock', 'Watch', 'Time', 'Hour'],
    correctAnswer: 'Time',
    difficulty: 'medium',
  },
  
  // Level 3 - Advanced (15 questions)
  {
    id: 18,
    signImage: require('../assets/Handsign/L.png'),
    options: ['Like', 'Care', 'Love', 'Heart'],
    correctAnswer: 'Love',
    difficulty: 'hard',
  },
  {
    id: 19,
    signImage: require('../assets/Handsign/I.png'),
    options: ['Serious', 'Critical', 'Important', 'Necessary'],
    correctAnswer: 'Important',
    difficulty: 'hard',
  },
  {
    id: 20,
    signImage: require('../assets/Handsign/L.png'),
    options: ['Talk', 'Speak', 'Language', 'Communication'],
    correctAnswer: 'Language',
    difficulty: 'hard',
  },
  {
    id: 21,
    signImage: require('../assets/Handsign/W.png'),
    options: ['Climate', 'Weather', 'Temperature', 'Forecast'],
    correctAnswer: 'Weather',
    difficulty: 'hard',
  },
  {
    id: 22,
    signImage: require('../assets/Handsign/Q.png'),
    options: ['Ask', 'What', 'Question', 'Why'],
    correctAnswer: 'Question',
    difficulty: 'hard',
  },
  {
    id: 23,
    signImage: require('../assets/Handsign/U.png'),
    options: ['Know', 'Learn', 'Understand', 'Comprehend'],
    correctAnswer: 'Understand',
    difficulty: 'hard',
  },
  {
    id: 24,
    signImage: require('../assets/Handsign/T.png'),
    options: ['Later', 'Soon', 'Future', 'Tomorrow'],
    correctAnswer: 'Tomorrow',
    difficulty: 'hard',
  },
  {
    id: 25,
    signImage: require('../assets/Handsign/Y.png'),
    options: ['Before', 'Past', 'Yesterday', 'Earlier'],
    correctAnswer: 'Yesterday',
    difficulty: 'hard',
  },
  {
    id: 26,
    signImage: require('../assets/Handsign/N.png'),
    options: ['Identity', 'Name', 'Call', 'Title'],
    correctAnswer: 'Name',
    difficulty: 'hard',
  },
  {
    id: 27,
    signImage: require('../assets/Handsign/D.png'),
    options: ['Deaf', 'Hearing', 'Listen', 'Ear'],
    correctAnswer: 'Deaf',
    difficulty: 'hard',
  },
  {
    id: 28,
    signImage: require('../assets/Handsign/I.png'),
    options: ['Translator', 'Interpreter', 'Helper', 'Assistant'],
    correctAnswer: 'Interpreter',
    difficulty: 'hard',
  },
  {
    id: 29,
    signImage: require('../assets/Handsign/C.png'),
    options: ['Group', 'Society', 'Community', 'People'],
    correctAnswer: 'Community',
    difficulty: 'hard',
  },
  {
    id: 30,
    signImage: require('../assets/Handsign/C.png'),
    options: ['Tradition', 'Heritage', 'Culture', 'Custom'],
    correctAnswer: 'Culture',
    difficulty: 'hard',
  },
  {
    id: 31,
    signImage: require('../assets/Handsign/I.png'),
    options: ['Self', 'Identity', 'Person', 'Individual'],
    correctAnswer: 'Identity',
    difficulty: 'hard',
  },
  {
    id: 32,
    signImage: require('../assets/Handsign/A.png'),
    options: ['Support', 'Defend', 'Advocate', 'Promote'],
    correctAnswer: 'Advocate',
    difficulty: 'hard',
  },
];

const SignLanguageQuiz: React.FC<SignLanguageQuizProps> = ({ navigation, route }) => {
  const { theme, isDarkMode } = useTheme();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

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

  // Initialize the quiz
  useEffect(() => {
    if (quizStarted) {
      // Filter questions based on current level
      const difficultyMap = {
        1: 'easy',
        2: 'medium',
        3: 'hard',
      };
      
      const filteredQuestions = quizQuestions.filter(
        (q) => q.difficulty === difficultyMap[currentLevel as keyof typeof difficultyMap]
      );
      
      setQuestions(filteredQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
      setTimeLeft(15);
      setQuizCompleted(false);
    }
  }, [quizStarted, currentLevel]);

  // Timer logic
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0 && selectedAnswer === null) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && selectedAnswer === null) {
      handleAnswer('');
    }
  }, [quizStarted, quizCompleted, timeLeft, selectedAnswer]);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answer);
    setIsAnswerCorrect(correct);
    
    if (correct) {
      // Add points based on time left
      const points = 10 + timeLeft;
      setScore((prevScore) => prevScore + points);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsAnswerCorrect(null);
        setTimeLeft(15);
      } else {
        // Quiz completed
        setQuizCompleted(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setTimeLeft(15);
    setQuizCompleted(false);
  };

  const nextLevel = () => {
    if (currentLevel < 3) {
      setCurrentLevel(currentLevel + 1);
      restartQuiz();
    } else {
      // All levels completed
      Alert.alert('Congratulations!', 'You have completed all quiz levels!');
      navigation.goBack();
    }
  };

  // Render quiz start screen
  const renderStartScreen = () => (
    <View style={styles.startContainer}>
      <Text style={[styles.startTitle, { color: theme.colors.text }]}>Sign Language Quiz</Text>
      <Text style={styles.startSubtitle}>
        {currentLevel === 1
          ? 'Beginner Level'
          : currentLevel === 2
          ? 'Intermediate Level'
          : 'Advanced Level'}
      </Text>
      <Text style={[styles.startDescription, { color: theme.colors.textSecondary }]}>
        Test your sign language knowledge by identifying the correct meaning for each sign.
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
        <LinearGradient
          colors={isDarkMode ? theme.gradientPrimary : ['#6a11cb', '#2575fc']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // Render quiz completion screen
  const renderCompletionScreen = () => {
    const totalPossibleScore = questions.length * 25; // Max score per question
    const percentage = Math.round((score / totalPossibleScore) * 100);
    
    return (
      <View style={styles.completionContainer}>
        <Icon 
          name={percentage >= 70 ? 'trophy' : 'information-outline'} 
          size={60} 
          color={percentage >= 70 ? '#FFD700' : theme.colors.primary} 
        />
        <Text style={[styles.completionTitle, { color: theme.colors.text }]}>
          {percentage >= 70 ? 'Congratulations!' : 'Quiz Completed'}
        </Text>
        <Text style={[styles.completionScore, { color: theme.colors.primary }]}>Your Score: {score} points</Text>
        <Text style={[styles.completionPercentage, { color: theme.colors.textSecondary }]}>{percentage}% Correct</Text>
        
        <TouchableOpacity 
          style={[styles.completionButton, styles.restartButton, { backgroundColor: isDarkMode ? '#333' : '#F0E6FF' }]} 
          onPress={restartQuiz}
        >
          <Icon name="refresh" size={20} color={theme.colors.primary} />
          <Text style={[styles.restartButtonText, { color: theme.colors.primary }]}>Try Again</Text>
        </TouchableOpacity>
        
        {percentage >= 70 && (
          <TouchableOpacity 
            style={[styles.completionButton, styles.nextLevelButton]} 
            onPress={nextLevel}
          >
            <LinearGradient
              colors={isDarkMode ? theme.gradientPrimary : ['#6a11cb', '#2575fc']}
              style={styles.completionButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextLevelButtonText}>
                {currentLevel < 3 ? 'Next Level' : 'Finish Quiz'}
              </Text>
              <Icon name="arrow-right" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Render question screen without card flip
  const renderQuestionScreen = () => {
    if (questions.length === 0) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#333' : '#EEEEEE' }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  backgroundColor: theme.colors.primary
                }
              ]} 
            />
          </View>
        </View>
        
        <View style={[styles.timerContainer, { backgroundColor: isDarkMode ? '#333' : '#F0E6FF' }]}>
          <Icon name="clock-outline" size={20} color={theme.colors.primary} />
          <Text 
            style={[
              styles.timerText, 
              { color: theme.colors.primary },
              timeLeft <= 5 && styles.timerWarning
            ]}
          >
            {timeLeft}s
          </Text>
        </View>
        
        {/* Sign Image Container */}
        <View style={[
          styles.signImageContainer, 
          { 
            backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF',
            borderColor: isDarkMode ? '#333' : '#EEEEEE',
          }
        ]}>
          <Image 
            source={currentQuestion.signImage} 
            style={styles.signImage}
            resizeMode="contain" 
          />
          <Text style={[styles.questionText, { color: theme.colors.text }]}>
            Which word does start with this sign?
          </Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.optionButton,
                { 
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#FFFFFF',
                  borderColor: isDarkMode ? '#333' : '#EEEEEE',
                },
                selectedAnswer === option && 
                  (isAnswerCorrect ? styles.correctOption : styles.incorrectOption),
                selectedAnswer !== null && 
                  option === currentQuestion.correctAnswer && 
                  styles.correctOption
              ]}
              onPress={() => selectedAnswer === null && handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              <Text 
                style={[
                  styles.optionText,
                  { color: isDarkMode ? '#E0E0E0' : '#333333' },
                  (selectedAnswer === option && isAnswerCorrect) || 
                  (selectedAnswer !== null && option === currentQuestion.correctAnswer) 
                    ? styles.correctOptionText 
                    : selectedAnswer === option ? styles.incorrectOptionText : null
                ]}
              >
                {option}
              </Text>
              
              {selectedAnswer !== null && (
                option === currentQuestion.correctAnswer ? (
                  <Icon name="check-circle" size={24} color="#4CAF50" />
                ) : selectedAnswer === option ? (
                  <Icon name="close-circle" size={24} color="#F44336" />
                ) : null
              )}
            </TouchableOpacity>
          ))}
        </View>
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Sign Language Quiz</Text>
        <View style={[styles.scoreContainer, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
          <Icon name="star" size={16} color={theme.colors.primary} />
          <Text style={[styles.scoreText, { color: theme.colors.primary }]}>{score}</Text>
        </View>
      </View>

      {!quizStarted && renderStartScreen()}
      {quizStarted && !quizCompleted && renderQuestionScreen()}
      {quizCompleted && renderCompletionScreen()}
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
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  scoreText: {
    marginLeft: 5,
    fontWeight: 'bold',
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
    marginBottom: 5,
  },
  startSubtitle: {
    fontSize: 18,
    color: '#6200EE',
    marginBottom: 20,
  },
  startDescription: {
    fontSize: 16,
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
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 15,
  },
  timerText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  timerWarning: {
    color: '#F44336',
  },
  signImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  signImage: {
    width: '70%',
    height: '70%',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
  },
  correctOptionText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  incorrectOptionText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  completionScore: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  completionPercentage: {
    fontSize: 16,
    marginBottom: 30,
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignSelf: 'center',
    minWidth: 150,
  },
  restartButton: {
    marginRight: 0,
  },
  restartButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  nextLevelButton: {
    overflow: 'hidden',
    minWidth: 200,
  },
  completionButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  nextLevelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 5,
  },
});

export default SignLanguageQuiz; 