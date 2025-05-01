import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StoryTimeGameProps } from '../types/navigation';

type StorySegmentType = {
  id: number;
  text: string;
  options: string[];
  correctOption: number;
};

type StoryType = {
  id: number;
  title: string;
  description: string;
  segments: StorySegmentType[];
  level: string;
  color1: string;
  color2: string;
};

// Sample story data
const storyData: StoryType = {
  id: 1,
  title: 'The Lost Dog',
  description: 'Help find the lost dog by making the correct choices in this interactive story.',
  level: 'Beginner',
  color1: '#4776E6',
  color2: '#8E54E9',
  segments: [
    {
      id: 1,
      text: 'Once upon a time, there was a small dog named Max. Max lived with a loving family in a cozy house. One day, while the family was at the park, Max saw something interesting and ran away. The family looked everywhere but couldn\'t find him.',
      options: [
        'They decided to go home and wait.',
        'They continued searching in the park.',
        'They called animal control immediately.',
      ],
      correctOption: 1,
    },
    {
      id: 2,
      text: 'The family continued searching in the park. They split up to cover more ground. The youngest child went toward the playground, while the parents searched near the pond.',
      options: [
        'The child found Max playing with other dogs.',
        'The parents found Max swimming in the pond.',
        'They couldn\'t find Max anywhere in the park.',
      ],
      correctOption: 2,
    },
    {
      id: 3,
      text: 'The parents found Max! He was having fun swimming in the pond. He seemed happy but was getting tired. The family was so relieved to find their beloved pet.',
      options: [
        'They scolded Max for running away.',
        'They immediately took Max home.',
        'They dried him off and let him rest before going home.',
      ],
      correctOption: 2,
    },
    {
      id: 4,
      text: 'They dried Max off with a towel they had in their picnic basket and let him rest for a while. Max was tired but happy to be back with his family. After resting, they all walked home together.',
      options: [
        'Max never ran away again.',
        'Max ran away again the next day.',
        'The family got Max a leash after this incident.',
      ],
      correctOption: 2,
    },
    {
      id: 5,
      text: 'After this adventure, the family bought a new leash for Max to ensure he wouldn\'t run away again. Max didn\'t mind the leash because he loved being with his family more than anything else.',
      options: [
        'The End',
        'Continue the story',
        'Start over',
      ],
      correctOption: 0,
    },
  ],
};

const StoryTimeGame = ({ navigation }: StoryTimeGameProps) => {
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  
  const currentSegment = storyData.segments[currentSegmentIndex];
  
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    const correct = optionIndex === currentSegment.correctOption;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 10);
    }
    
    // After a short delay, move to the next segment or end the game
    setTimeout(() => {
      if (currentSegmentIndex < storyData.segments.length - 1) {
        setCurrentSegmentIndex(currentSegmentIndex + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setGameComplete(true);
      }
    }, 1500);
  };
  
  const restartGame = () => {
    setCurrentSegmentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setGameComplete(false);
  };
  
  const getOptionStyle = (index: number) => {
    if (selectedOption === null) {
      return styles.optionButton;
    }
    
    if (index === currentSegment.correctOption) {
      return [styles.optionButton, styles.correctOption];
    }
    
    if (index === selectedOption && selectedOption !== currentSegment.correctOption) {
      return [styles.optionButton, styles.incorrectOption];
    }
    
    return styles.optionButton;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[storyData.color1, storyData.color2]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Story Time</Text>
          <View style={styles.scoreContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.scoreText}>{score}</Text>
          </View>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentSegmentIndex) / storyData.segments.length) * 100}%` }
            ]} 
          />
        </View>
        
        {!gameComplete ? (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.storyContainer}>
              <Text style={styles.storyText}>{currentSegment.text}</Text>
              
              <Text style={styles.questionText}>What happens next?</Text>
              
              {currentSegment.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={getOptionStyle(index)}
                  onPress={() => handleOptionSelect(index)}
                  disabled={selectedOption !== null}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
              
              {isCorrect !== null && (
                <View style={styles.feedbackContainer}>
                  <Icon 
                    name={isCorrect ? "check-circle" : "close-circle"} 
                    size={30} 
                    color={isCorrect ? "#4CAF50" : "#F44336"} 
                  />
                  <Text style={[
                    styles.feedbackText,
                    { color: isCorrect ? "#4CAF50" : "#F44336" }
                  ]}>
                    {isCorrect ? "Correct! Good job!" : "Oops! That's not right."}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.gameCompleteContainer}>
            <Icon name="trophy" size={80} color="#FFD700" />
            <Text style={styles.gameCompleteTitle}>Story Complete!</Text>
            <Text style={styles.gameCompleteScore}>Your Score: {score}</Text>
            
            <View style={styles.storyCompleteCard}>
              <Text style={styles.storyCompleteSummary}>
                You helped Max find his way back to his family and learned about responsible pet ownership!
              </Text>
              
              <View style={styles.moralsContainer}>
                <Text style={styles.moralsTitle}>Story Morals:</Text>
                <View style={styles.moralItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.moralText}>Always keep pets safe and supervised</Text>
                </View>
                <View style={styles.moralItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.moralText}>Be patient and thorough when searching for lost pets</Text>
                </View>
                <View style={styles.moralItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={styles.moralText}>Using proper pet equipment like leashes is important</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.restartButton}
              onPress={restartGame}
            >
              <Icon name="restart" size={20} color="#FFFFFF" />
              <Text style={styles.restartButtonText}>Read Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate('GamesScreen')}
            >
              <Icon name="bookshelf" size={20} color="#6200EE" />
              <Text style={styles.homeButtonText}>More Stories</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginBottom: 10,
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
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreText: {
    marginLeft: 5,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  storyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: '#F0F0F0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  feedbackText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameCompleteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gameCompleteTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  gameCompleteScore: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 30,
  },
  storyCompleteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  storyCompleteSummary: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
    marginBottom: 20,
  },
  moralsContainer: {
    marginTop: 10,
  },
  moralsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  moralItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  moralText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333333',
    flex: 1,
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

export default StoryTimeGame; 