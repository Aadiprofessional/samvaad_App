import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { SignLanguageQuizProps } from '../types/navigation';

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
  {
    id: 1,
    signImage: require('../assets/images/placeholder-avatar.png'),
    options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
    correctAnswer: 'Hello',
    difficulty: 'easy',
  },
  {
    id: 2,
    signImage: require('../assets/images/placeholder-avatar.png'),
    options: ['Morning', 'Evening', 'Night', 'Afternoon'],
    correctAnswer: 'Morning',
    difficulty: 'easy',
  },
  {
    id: 3,
    signImage: require('../assets/images/placeholder-avatar.png'),
    options: ['Water', 'Food', 'Sleep', 'Play'],
    correctAnswer: 'Water',
    difficulty: 'medium',
  },
  {
    id: 4,
    signImage: require('../assets/images/placeholder-avatar.png'),
    options: ['Happy', 'Sad', 'Angry', 'Excited'],
    correctAnswer: 'Happy',
    difficulty: 'medium',
  },
  {
    id: 5,
    signImage: require('../assets/images/placeholder-avatar.png'),
    options: ['School', 'Hospital', 'Library', 'Park'],
    correctAnswer: 'School',
    difficulty: 'hard',
  },
];

const SignLanguageQuiz: React.FC<SignLanguageQuizProps> = ({ navigation, route }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

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
      <Text style={styles.startTitle}>Sign Language Quiz</Text>
      <Text style={styles.startSubtitle}>
        {currentLevel === 1
          ? 'Beginner Level'
          : currentLevel === 2
          ? 'Intermediate Level'
          : 'Advanced Level'}
      </Text>
      <Text style={styles.startDescription}>
        Test your sign language knowledge by identifying the correct meaning for each sign.
      </Text>
      <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
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
          color={percentage >= 70 ? '#FFD700' : '#6200EE'} 
        />
        <Text style={styles.completionTitle}>
          {percentage >= 70 ? 'Congratulations!' : 'Quiz Completed'}
        </Text>
        <Text style={styles.completionScore}>Your Score: {score} points</Text>
        <Text style={styles.completionPercentage}>{percentage}% Correct</Text>
        
        <View style={styles.completionButtonsContainer}>
          <TouchableOpacity 
            style={[styles.completionButton, styles.restartButton]} 
            onPress={restartQuiz}
          >
            <Icon name="refresh" size={20} color="#6200EE" />
            <Text style={styles.restartButtonText}>Try Again</Text>
          </TouchableOpacity>
          
          {percentage >= 70 && (
            <TouchableOpacity 
              style={[styles.completionButton, styles.nextLevelButton]} 
              onPress={nextLevel}
            >
              <LinearGradient
                colors={['#6a11cb', '#2575fc']}
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
      </View>
    );
  };

  // Render question screen
  const renderQuestionScreen = () => {
    if (questions.length === 0) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.timerContainer}>
          <Icon name="clock-outline" size={20} color="#6200EE" />
          <Text 
            style={[
              styles.timerText, 
              timeLeft <= 5 && styles.timerWarning
            ]}
          >
            {timeLeft}s
          </Text>
        </View>
        
        <View style={styles.signImageContainer}>
          <Image 
            source={currentQuestion.signImage} 
            style={styles.signImage}
            resizeMode="contain" 
          />
        </View>
        
        <Text style={styles.questionText}>
          What does this sign mean?
        </Text>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.optionButton,
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#6200EE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Language Quiz</Text>
        <View style={styles.scoreContainer}>
          <Icon name="star" size={16} color="#6200EE" />
          <Text style={styles.scoreText}>{score}</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  scoreText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#6200EE',
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
  questionContainer: {
    flex: 1,
    padding: 20,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 3,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 15,
  },
  timerText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  timerWarning: {
    color: '#F44336',
  },
  signImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    marginBottom: 20,
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
    width: '100%',
    height: '100%',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    color: '#333333',
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
    color: '#333333',
    marginVertical: 15,
  },
  completionScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 5,
  },
  completionPercentage: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
  },
  completionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  restartButton: {
    backgroundColor: '#F0E6FF',
    marginRight: 10,
  },
  restartButtonText: {
    color: '#6200EE',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  nextLevelButton: {
    overflow: 'hidden',
    flex: 1,
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