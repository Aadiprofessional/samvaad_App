import React, { useState, useEffect, useLayoutEffect } from 'react';
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
import { useTheme } from '../context/ThemeContext';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useIsFocused } from '@react-navigation/native';

type StorySegmentType = {
  id: number;
  text: string;
  choices: { text: string; isCorrect: boolean; feedback: string }[];
  signImage?: any; // Optional sign language image for the segment
};

type StoryLevel = 'beginner' | 'intermediate' | 'advanced';

type StoryType = {
  id: number;
  level: StoryLevel;
  title: string;
  description: string;
  segments: StorySegmentType[];
  color1: string;
  color2: string;
  signLanguageFocus: string[];
};

// Multiple stories for different difficulty levels
const storyData: StoryType[] = [
  {
    id: 1,
    title: "Sofia's First Day at Sign Language Class",
    description: "Join Sofia as she learns her first sign language words and makes new friends.",
    level: "beginner",
    color1: '#4776E6',
    color2: '#8E54E9',
    signLanguageFocus: ["Basic greetings", "Name signs", "Simple questions"],
    segments: [
      {
        id: 1,
        text: "Sofia was excited for her first day at sign language class. She had always been fascinated by how people could communicate with their hands. As she entered the classroom, she saw other students practicing different hand movements. The teacher welcomed everyone with a warm smile and a hand gesture.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Sofia sat quietly in the back of the room.", 
            isCorrect: true, 
            feedback: 'Great! Sofia sat quietly in the back of the room.'
          },
          { 
            text: "Sofia waved hello to the teacher.", 
            isCorrect: true, 
            feedback: 'Great! Sofia waved hello to the teacher.'
          },
          { 
            text: "Sofia immediately left the classroom.", 
            isCorrect: false, 
            feedback: 'Not quite. Sofia was excited for her first day at sign language class.'
          },
        ],
      },
      {
        id: 2,
        text: "Sofia waved hello to the teacher. The teacher showed everyone the proper way to sign 'Hello' and 'My name is...' Everyone practiced introducing themselves. Sofia loved how expressive sign language was.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Sofia gave up because it was too difficult.", 
            isCorrect: false, 
            feedback: 'Not quite. Sofia loved how expressive sign language was.'
          },
          { 
            text: "Sofia practiced the signs repeatedly.", 
            isCorrect: true, 
            feedback: 'Great! Sofia practiced the signs repeatedly.'
          },
          { 
            text: "Sofia ignored the lesson and talked to other students.", 
            isCorrect: false, 
            feedback: 'Not quite. Sofia loved how expressive sign language was.'
          },
        ],
      },
      {
        id: 3,
        text: "Sofia practiced the signs repeatedly. By the end of the class, she could confidently introduce herself in sign language. The teacher gave them homework to practice greeting signs with family and friends.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Sofia forgot about the homework.", 
            isCorrect: false, 
            feedback: 'Not quite. Sofia practiced the signs repeatedly.'
          },
          { 
            text: "Sofia practiced with her family that evening.", 
            isCorrect: true, 
            feedback: 'Great! Sofia practiced with her family that evening.'
          },
          { 
            text: "Sofia decided not to come back to class.", 
            isCorrect: false, 
            feedback: 'Not quite. Sofia practiced the signs repeatedly.'
          },
        ],
      },
      {
        id: 4,
        text: "Sofia practiced with her family that evening. Her little brother thought it was a fun game and joined in. Their parents were impressed by how quickly Sofia was learning.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Sofia felt discouraged and quit.", 
            isCorrect: false, 
            feedback: 'Not quite. Sofia practiced with her family that evening.'
          },
          { 
            text: "Sofia signed up for advanced classes.", 
            isCorrect: false, 
            feedback: 'Not quite. Sofia practiced with her family that evening.'
          },
          { 
            text: "Sofia looked forward to the next class and continued practicing.", 
            isCorrect: true, 
            feedback: 'Great! Sofia looked forward to the next class and continued practicing.'
          },
        ],
      },
      {
        id: 5,
        text: "Sofia looked forward to the next class and continued practicing daily. Within weeks, she could have basic conversations in sign language. She made new friends in class who supported each other's learning journey.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "The End", 
            isCorrect: false, 
            feedback: 'Not quite. Sofia looked forward to the next class and continued practicing.'
          },
          { 
            text: "Continue the story", 
            isCorrect: true, 
            feedback: 'Great! Continue the story.'
          },
          { 
            text: "Start over", 
            isCorrect: false, 
            feedback: 'Not quite. Sofia looked forward to the next class and continued practicing.'
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Marco's Sign Language Volunteer Experience",
    description: "Follow Marco as he volunteers at a Deaf community center and improves his signing skills.",
    level: "intermediate",
    color1: '#00B09B',
    color2: '#96C93D',
    signLanguageFocus: ["Conversational phrases", "Community terms", "Expressive signing"],
    segments: [
      {
        id: 1,
        text: "Marco had been learning sign language for six months when he decided to volunteer at the local Deaf community center. He was nervous about his intermediate signing skills but wanted to immerse himself in the language. As he arrived at the center, he saw a group of people engaged in animated conversation through sign.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Marco hesitated at the door, afraid to go in.", 
            isCorrect: true, 
            feedback: 'Great! Marco hesitated at the door, afraid to go in.'
          },
          { 
            text: "Marco confidently walked in and tried to join conversations immediately.", 
            isCorrect: false, 
            feedback: 'Not quite. Marco was nervous about his intermediate signing skills.'
          },
          { 
            text: "Marco approached the volunteer coordinator who was expecting him.", 
            isCorrect: false, 
            feedback: 'Not quite. Marco was nervous about his intermediate signing skills.'
          },
        ],
      },
      {
        id: 2,
        text: "Marco approached the volunteer coordinator who greeted him warmly in sign language. The coordinator introduced Marco to a few regular visitors and explained his role as a volunteer. Marco would help with organizing events and practice his signing with community members.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Marco declined the responsibilities, feeling overwhelmed.", 
            isCorrect: false, 
            feedback: 'Not quite. Marco accepted the role and asked questions in sign language.'
          },
          { 
            text: "Marco accepted and asked clarification questions in sign language.", 
            isCorrect: true, 
            feedback: 'Great! Marco accepted and asked clarification questions in sign language.'
          },
          { 
            text: "Marco nodded silently, not understanding most of what was said.", 
            isCorrect: false, 
            feedback: 'Not quite. Marco accepted and asked clarification questions in sign language.'
          },
        ],
      },
      {
        id: 3,
        text: "Marco accepted the role and asked questions in sign language. Though he made mistakes, people were patient and helpful. He was assigned to help with an upcoming community game night and partnered with Elena, a Deaf artist who frequently visited the center.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Marco relied on written notes to communicate with Elena.", 
            isCorrect: false, 
            feedback: 'Not quite. Marco tried his best to communicate in sign language with Elena.'
          },
          { 
            text: "Marco tried his best to sign with Elena.", 
            isCorrect: true, 
            feedback: 'Great! Marco tried his best to sign with Elena.'
          },
          { 
            text: "Marco asked someone else to translate for him.", 
            isCorrect: false, 
            feedback: 'Not quite. Marco tried his best to sign with Elena.'
          },
        ],
      },
      {
        id: 4,
        text: "Marco tried his best to sign with Elena. When he didn't know a sign, he would fingerspell or ask Elena to teach him. By the end of the day, Marco had learned many new signs related to games, art, and community events.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Marco was exhausted and decided volunteering was too difficult.", 
            isCorrect: false, 
            feedback: 'Not quite. Marco tried his best to sign with Elena.'
          },
          { 
            text: "Marco thanked Elena and made plans to return next week.", 
            isCorrect: true, 
            feedback: 'Great! Marco thanked Elena and made plans to return next week.'
          },
          { 
            text: "Marco asked if he could teach sign language at the center.", 
            isCorrect: false, 
            feedback: 'Not quite. Marco thanked Elena and made plans to return next week.'
          },
        ],
      },
      {
        id: 5,
        text: "Marco thanked Elena and made plans to return next week. Over the following months, his signing improved dramatically through regular immersion. He made many friends at the center and eventually helped coordinate a bridge event between the Deaf community and local schools.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "The End", 
            isCorrect: false, 
            feedback: 'Not quite. Marco thanked Elena and made plans to return next week.'
          },
          { 
            text: "Continue the story", 
            isCorrect: true, 
            feedback: 'Great! Continue the story.'
          },
          { 
            text: "Start over", 
            isCorrect: false, 
            feedback: 'Not quite. Marco thanked Elena and made plans to return next week.'
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Dr. Leila's Journey in Medical Sign Language",
    description: "Experience Dr. Leila's challenges and triumphs as she learns specialized medical sign language to better serve Deaf patients.",
    level: "advanced",
    color1: '#FF416C',
    color2: '#FF4B2B',
    signLanguageFocus: ["Medical terminology", "Emergency signs", "Detailed explanations"],
    segments: [
      {
        id: 1,
        text: "Dr. Leila was already fluent in sign language when she decided to specialize in medical signing. As an ER doctor, she frequently encountered Deaf patients who struggled with medical communication in emergency situations. She enrolled in an advanced medical sign language course taught by Dr. Chen, a Deaf medical professional.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Dr. Leila found the course too specialized and dropped out.", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila committed to the intensive training program.'
          },
          { 
            text: "Dr. Leila committed to the intensive training program.", 
            isCorrect: true, 
            feedback: 'Great! Dr. Leila committed to the intensive training program.'
          },
          { 
            text: "Dr. Leila decided to hire interpreters instead of learning herself.", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila committed to the intensive training program.'
          },
        ],
      },
      {
        id: 2,
        text: "Dr. Leila committed to the intensive training. Dr. Chen taught specialized signs for medical conditions, procedures, and emergency situations. The course also covered cultural aspects of medical care in the Deaf community and the importance of clear consent communication.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Dr. Leila focused only on the vocabulary but ignored the cultural aspects.", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila integrated both medical signing and cultural awareness in her practice.'
          },
          { 
            text: "Dr. Leila integrated both medical signing and cultural awareness in her practice.", 
            isCorrect: true, 
            feedback: 'Great! Dr. Leila integrated both medical signing and cultural awareness in her practice.'
          },
          { 
            text: "Dr. Leila decided medical signing was too complex to use in emergencies.", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila integrated both medical signing and cultural awareness in her practice.'
          },
        ],
      },
      {
        id: 3,
        text: "Dr. Leila integrated both medical signing and cultural awareness in her practice. One night during her shift, a Deaf patient arrived at the ER with severe chest pain. There was no interpreter immediately available, but Dr. Leila was able to obtain critical medical history and explain the needed procedures directly in sign language.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "The patient was confused by Dr. Leila's signing.", 
            isCorrect: true, 
            feedback: 'Great! The patient was confused by Dr. Leila\'s signing.'
          },
          { 
            text: "The patient was relieved to communicate directly with the doctor.", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila was able to obtain critical medical history and explain the needed procedures directly in sign language.'
          },
          { 
            text: "Dr. Leila gave up and waited for the interpreter.", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila was able to obtain critical medical history and explain the needed procedures directly in sign language.'
          },
        ],
      },
      {
        id: 4,
        text: "The patient was relieved to communicate directly with the doctor. Dr. Leila clearly explained the diagnosis of acute pericarditis, the treatment plan, and answered all questions in fluent medical sign language. The patient later told the hospital administration how much of a difference Dr. Leila's signing skills made in a frightening situation.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "Dr. Leila was satisfied with her current level of signing.", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila clearly explained the diagnosis of acute pericarditis, the treatment plan, and answered all questions in fluent medical sign language.'
          },
          { 
            text: "Dr. Leila continued her education by joining a medical sign language research team.", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila clearly explained the diagnosis of acute pericarditis, the treatment plan, and answered all questions in fluent medical sign language.'
          },
          { 
            text: "Dr. Leila decided interpreters were still better than direct communication.", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila clearly explained the diagnosis of acute pericarditis, the treatment plan, and answered all questions in fluent medical sign language.'
          },
        ],
      },
      {
        id: 5,
        text: "Dr. Leila joined a medical sign language research team developing standardized signs for new medical procedures and technologies. Her experiences led to hospital-wide training programs for medical staff and improved protocols for Deaf patient care. She eventually published research on how direct communication improved medical outcomes for Deaf patients.",
        signImage: require('../assets/images/placeholder-avatar.png'),
        choices: [
          { 
            text: "The End", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila joined a medical sign language research team developing standardized signs for new medical procedures and technologies.'
          },
          { 
            text: "Continue the story", 
            isCorrect: true, 
            feedback: 'Great! Continue the story.'
          },
          { 
            text: "Start over", 
            isCorrect: false, 
            feedback: 'Not quite. Dr. Leila joined a medical sign language research team developing standardized signs for new medical procedures and technologies.'
          },
        ],
      },
    ],
  }
];

const StoryTimeGame = ({ navigation }: StoryTimeGameProps) => {
  const { theme, isDarkMode } = useTheme();
  const [currentLevel, setCurrentLevel] = useState<StoryLevel>('beginner');
  const [currentStoryId, setCurrentStoryId] = useState(1);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showLevelSelection, setShowLevelSelection] = useState(true);
  
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
  
  // Find current story based on level
  const currentStory = storyData.find(story => story.level === currentLevel) || storyData[0];
  const currentSegment = currentStory.segments[currentSegmentIndex];
  
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    
    const correct = currentSegment.choices[optionIndex].isCorrect;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 10);
    }
    
    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      
      if (correct) {
        handleNextSegment();
      }
    }, 2000);
  };
  
  const restartGame = () => {
    setCurrentSegmentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setGameComplete(false);
  };
  
  const handleLevelSelect = (level: StoryLevel) => {
    const selectedStory = storyData.find(story => story.level === level);
    if (selectedStory) {
      setCurrentLevel(level);
      setShowLevelSelection(false);
      restartGame();
    }
  };
  
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
          text: 'Change Level',
          onPress: () => setShowLevelSelection(true),
        },
        {
          text: 'Quit Game',
          onPress: () => navigation.goBack(),
          style: 'destructive',
        },
      ]
    );
  };
  
  const getOptionStyle = (index: number) => {
    const baseStyle = [styles.optionButton];
    
    if (selectedOption === null) {
      return baseStyle;
    }
    
    if (currentSegment.choices[index].isCorrect) {
      return [...baseStyle, styles.correctOption];
    }
    
    if (index === selectedOption && !currentSegment.choices[selectedOption].isCorrect) {
      return [...baseStyle, styles.incorrectOption];
    }
    
    return baseStyle;
  };
  
  // Update the level selection screen rendering
  const renderLevelSelection = () => {
    return (
      <View style={styles.levelSelectionContainer}>
        <Text style={[styles.headerText, { color: theme.colors.text, marginBottom: 20 }]}>
          Choose a Story Level
        </Text>
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View style={styles.levelsContainer}>
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelCard,
                  { backgroundColor: isDarkMode ? '#333333' : '#FFFFFF' }
                ]}
                onPress={() => handleLevelSelect(level as StoryLevel)}
              >
                <LinearGradient
                  colors={getLevelColors(level as StoryLevel)}
                  style={styles.levelGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                />
                
                <View style={styles.levelContent}>
                  <Text style={[styles.levelLabelText, { 
                    color: level === 'beginner' ? '#4CAF50' : 
                           level === 'intermediate' ? '#2196F3' : '#9C27B0' 
                  }]}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                  
                  <View style={styles.levelIconContainer}>
                    {level === 'beginner' && (
                      <FontAwesome name="hand-paper-o" size={35} color={isDarkMode ? '#E0E0E0' : '#333333'} />
                    )}
                    {level === 'intermediate' && (
                      <FontAwesome name="sign-language" size={35} color={isDarkMode ? '#E0E0E0' : '#333333'} />
                    )}
                    {level === 'advanced' && (
                      <MaterialCommunityIcons name="hand-heart" size={35} color={isDarkMode ? '#E0E0E0' : '#333333'} />
                    )}
                  </View>
                  
                  <Text style={[styles.levelTitle, { color: theme.colors.text }]}>
                    {level === 'beginner' 
                      ? 'Simple stories with basic vocabulary' 
                      : level === 'intermediate'
                        ? 'Moderate complexity with varied concepts'
                        : 'Complex narratives with detailed signing'}
                  </Text>
                  
                  <View style={styles.focusItemsContainer}>
                    {['beginner', 'intermediate', 'advanced'].indexOf(level) !== -1 && (
                      <>
                        <View style={styles.focusItem}>
                          <FontAwesome5 name={getFocusIcon(level as StoryLevel, 0)} size={18} color={isDarkMode ? '#CCCCCC' : '#555555'} />
                          <Text style={[styles.focusText, { color: theme.colors.text }]}>{getFocusText(level as StoryLevel, 0)}</Text>
                        </View>
                        
                        <View style={styles.focusItem}>
                          <FontAwesome5 name={getFocusIcon(level as StoryLevel, 1)} size={18} color={isDarkMode ? '#CCCCCC' : '#555555'} />
                          <Text style={[styles.focusText, { color: theme.colors.text }]}>{getFocusText(level as StoryLevel, 1)}</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };
  
  // Helper functions for the level selection
  const getLevelColors = (level: StoryLevel) => {
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
  
  const getFocusIcon = (level: StoryLevel, index: number) => {
    const icons = {
      beginner: ['hands-helping', 'book-reader'],
      intermediate: ['american-sign-language-interpreting', 'comments'],
      advanced: ['user-graduate', 'language']
    };
    
    return icons[level][index];
  };
  
  const getFocusText = (level: StoryLevel, index: number) => {
    const texts = {
      beginner: ['Basic Signs', 'Simple Choices'],
      intermediate: ['Expressive Signing', 'Cultural Context'],
      advanced: ['Technical Signs', 'Deep Concepts']
    };
    
    return texts[level][index];
  };
  
  // Add the handleNextSegment function
  const handleNextSegment = () => {
    if (currentSegmentIndex < currentStory.segments.length - 1) {
      setCurrentSegmentIndex(currentSegmentIndex + 1);
    } else {
      setGameComplete(true);
    }
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
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Story Time</Text>
        {!showLevelSelection && (
          <TouchableOpacity 
            onPress={handlePause} 
            style={[styles.headerButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}
          >
            <Icon name="pause" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
        {showLevelSelection && (
          <View style={{ width: 40 }} />
        )}
      </View>
      
      {!showLevelSelection && (
        <View style={[styles.progressBarContainer, { backgroundColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${((currentSegmentIndex) / currentStory.segments.length) * 100}%`,
                backgroundColor: currentLevel === 'beginner' ? '#4776E6' : 
                               currentLevel === 'intermediate' ? '#00B09B' : '#FF416C'
              }
            ]} 
          />
        </View>
      )}
      
      {showLevelSelection ? (
        renderLevelSelection()
      ) : !gameComplete ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
        >
          <View style={[styles.storyContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={styles.storyHeader}>
              <Text style={[styles.storyLevel, { 
                color: currentLevel === 'beginner' ? '#4776E6' : 
                       currentLevel === 'intermediate' ? '#00B09B' : '#FF416C' 
              }]}>
                {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level
              </Text>
              <Text style={[styles.storyTitle, { color: theme.colors.text }]}>
                {currentStory.title}
              </Text>
            </View>
            
            {currentSegment.signImage && (
              <View style={[styles.signImageContainer, isDarkMode && { backgroundColor: '#1E1E1E' }]}>
                <Image 
                  source={currentSegment.signImage} 
                  style={styles.signImage}
                  resizeMode="contain"
                />
              </View>
            )}
            
            <Text style={[styles.storyText, { color: theme.colors.text }]}>{currentSegment.text}</Text>
            
            <Text style={[styles.questionText, { color: theme.colors.text }]}>What happens next?</Text>
            
            <View style={styles.choicesContainer}>
              {currentSegment.choices.map((choice, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.choiceButton,
                    isDarkMode && { backgroundColor: '#333333', borderColor: '#555555' }
                  ]}
                  onPress={() => handleOptionSelect(index)}
                >
                  <Text style={[styles.choiceText, isDarkMode && { color: '#FFFFFF' }]}>
                    {choice.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
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
          <Text style={[styles.gameCompleteTitle, { color: theme.colors.text }]}>Story Complete!</Text>
          <Text style={[styles.gameCompleteScore, { color: theme.colors.primary }]}>Your Score: {score}</Text>
          
          <View style={[styles.storyCompleteCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
            <Text style={[styles.storyCompleteSummary, { color: theme.colors.text }]}>
              {currentLevel === 'beginner' ? 
                "You helped Sofia learn the basics of sign language and make new friends!" :
               currentLevel === 'intermediate' ? 
                "You joined Marco on his journey to immerse in the Deaf community and improve his signing skills!" :
                "You experienced Dr. Leila's dedication to learning medical sign language and improving healthcare for Deaf patients!"}
            </Text>
            
            <View style={styles.moralsContainer}>
              <Text style={[styles.moralsTitle, { color: theme.colors.text }]}>Sign Language Concepts:</Text>
              {currentStory.signLanguageFocus.map((focus, index) => (
                <View key={index} style={styles.moralItem}>
                  <Icon name="check-circle" size={20} color="#4CAF50" />
                  <Text style={[styles.moralText, { color: theme.colors.textSecondary }]}>{focus}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.restartButton, {
              backgroundColor: currentLevel === 'beginner' ? '#4776E6' : 
                             currentLevel === 'intermediate' ? '#00B09B' : '#FF416C'
            }]}
            onPress={restartGame}
          >
            <Icon name="restart" size={20} color="#FFFFFF" />
            <Text style={styles.restartButtonText}>Read Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.levelSelectButton}
            onPress={() => setShowLevelSelection(true)}
          >
            <Icon name="bookshelf" size={20} color="#6200EE" />
            <Text style={styles.levelSelectButtonText}>Choose Another Story</Text>
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
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexGrow: 1,
  },
  storyContainer: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  storyHeader: {
    marginBottom: 15,
  },
  storyLevel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  storyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  optionButton: {
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
    marginTop: 20,
  },
  gameCompleteScore: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  storyCompleteCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  storyCompleteSummary: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  moralsContainer: {
    marginTop: 10,
  },
  moralsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    flex: 1,
  },
  restartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  levelSelectionContainer: {
    flex: 1,
    padding: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  levelsContainer: {
    width: '100%',
    paddingBottom: 20,
  },
  levelCard: {
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelGradient: {
    height: 8,
    width: '100%',
  },
  levelContent: {
    padding: 16,
    paddingTop: 20,
  },
  levelLabelText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  levelIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  focusItemsContainer: {
    marginTop: 8,
  },
  focusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  focusText: {
    marginLeft: 10,
    fontSize: 14,
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
  signImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  signImage: {
    width: '90%',
    height: '90%',
  },
  choicesContainer: {
    marginTop: 20,
  },
  choiceButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  choiceText: {
    fontSize: 16,
  },
  levelBadgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default StoryTimeGame; 