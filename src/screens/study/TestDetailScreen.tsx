import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { TestDetailScreenProps } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { useIsFocused } from '@react-navigation/native';

// Sample test data - this would come from an API in a real app
const testData = {
  id: 1,
  title: 'Alphabet Signs Test',
  description: 'Test your knowledge of the sign language alphabet and demonstrate your understanding of basic hand shapes and finger spelling.',
  questions: 25,
  duration: '30 minutes',
  level: 'Beginner',
  completed: false,
  passingScore: 70,
  color1: '#FF9A8B',
  color2: '#FF6A88',
  rules: [
    'You have 30 minutes to complete the test',
    'There are 25 questions in total',
    'Each question is worth 4 points',
    'Passing score is 70%',
    'You can review your answers before submission',
    'Results will be shown immediately after submission',
  ],
  topics: [
    'Finger spelling alphabet A-Z',
    'Basic hand shapes and positions',
    'Common greeting signs',
    'Numbers 1-20',
    'Simple conversation phrases',
  ],
};

const TestDetailScreen = ({ route, navigation }: TestDetailScreenProps) => {
  const { testId } = route.params;
  const [activeSection, setActiveSection] = useState<'overview' | 'rules' | 'topics'>('overview');
  const { theme, isDarkMode } = useTheme();
  const isFocused = useIsFocused();
  
  // Updated code to hide the bottom tab when viewing test detail
  useLayoutEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' }
      });
    }
    
    return () => {
      if (!isFocused) {
        navigation.getParent()?.setOptions({
          tabBarStyle: { 
            display: 'flex',
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            borderTopColor: isDarkMode ? '#333333' : '#EEEEEE' 
          }
        });
      }
    };
  }, [navigation, isFocused, isDarkMode]);
  
  // In a real app, we would fetch test data based on testId
  // For now, we're using sample data
  
  const handleStartTest = () => {
    Alert.alert(
      'Start Test',
      `Are you ready to start the "${testData.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Start',
          onPress: () => {
            // In a real app, we would navigate to the test screen
            Alert.alert('Test started', 'This would navigate to the actual test');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[testData.color1, testData.color2]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Icon name="share-variant" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.testInfo}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{testData.level}</Text>
              </View>
              <Text style={styles.testTitle}>{testData.title}</Text>
              
              <View style={styles.testStats}>
                <View style={styles.statItem}>
                  <Icon name="help-circle-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.statText}>
                    {testData.questions} Questions
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="clock-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.statText}>{testData.duration}</Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="trophy-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.statText}>
                    {testData.passingScore}% to Pass
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
        
        <View style={[styles.sectionsContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'overview' && styles.activeSection]}
            onPress={() => setActiveSection('overview')}
          >
            <Text
              style={[
                styles.sectionText,
                { color: isDarkMode ? '#AAAAAA' : '#666666' },
                activeSection === 'overview' && { color: theme.colors.primary },
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'rules' && styles.activeSection]}
            onPress={() => setActiveSection('rules')}
          >
            <Text
              style={[
                styles.sectionText,
                { color: isDarkMode ? '#AAAAAA' : '#666666' },
                activeSection === 'rules' && { color: theme.colors.primary },
              ]}
            >
              Rules
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'topics' && styles.activeSection]}
            onPress={() => setActiveSection('topics')}
          >
            <Text
              style={[
                styles.sectionText,
                { color: isDarkMode ? '#AAAAAA' : '#666666' },
                activeSection === 'topics' && { color: theme.colors.primary },
              ]}
            >
              Topics
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.contentContainer, { backgroundColor: isDarkMode ? '#121212' : '#FFFFFF' }]}>
          {activeSection === 'overview' && (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About This Test</Text>
              <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
                {testData.description}
              </Text>
              
              <View style={[styles.infoCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
                <View style={styles.infoCardRow}>
                  <View style={styles.infoCardItem}>
                    <Icon name="clock-outline" size={24} color={theme.colors.primary} />
                    <View style={styles.infoCardTextContainer}>
                      <Text style={[styles.infoCardLabel, { color: theme.colors.textSecondary }]}>Duration</Text>
                      <Text style={[styles.infoCardValue, { color: theme.colors.text }]}>{testData.duration}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoCardItem}>
                    <Icon name="signal-cellular-outline" size={24} color={theme.colors.primary} />
                    <View style={styles.infoCardTextContainer}>
                      <Text style={[styles.infoCardLabel, { color: theme.colors.textSecondary }]}>Difficulty</Text>
                      <Text style={[styles.infoCardValue, { color: theme.colors.text }]}>{testData.level}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.infoCardRow}>
                  <View style={styles.infoCardItem}>
                    <Icon name="help-circle-outline" size={24} color={theme.colors.primary} />
                    <View style={styles.infoCardTextContainer}>
                      <Text style={[styles.infoCardLabel, { color: theme.colors.textSecondary }]}>Questions</Text>
                      <Text style={[styles.infoCardValue, { color: theme.colors.text }]}>{testData.questions} Questions</Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoCardItem}>
                    <Icon name="trophy-outline" size={24} color={theme.colors.primary} />
                    <View style={styles.infoCardTextContainer}>
                      <Text style={[styles.infoCardLabel, { color: theme.colors.textSecondary }]}>Pass Score</Text>
                      <Text style={[styles.infoCardValue, { color: theme.colors.text }]}>{testData.passingScore}%</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={[styles.noticeText, { color: theme.colors.textSecondary }]}>
                This test is designed to assess your understanding of basic sign language concepts. 
                Take your time and read each question carefully before answering.
              </Text>
            </View>
          )}
          
          {activeSection === 'rules' && (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Test Rules</Text>
              <Text style={[styles.rulesIntro, { color: theme.colors.textSecondary }]}>
                Please read and understand the following rules before starting the test:
              </Text>
              
              {testData.rules.map((rule, index) => (
                <View key={index} style={[styles.ruleItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                  <View style={[styles.ruleNumber, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
                    <Text style={[styles.ruleNumberText, { color: theme.colors.primary }]}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.ruleText, { color: theme.colors.text }]}>{rule}</Text>
                </View>
              ))}
              
              <View style={[styles.noteCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F0E6FF20' }]}>
                <Icon name="information-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.noteText, { color: theme.colors.text }]}>
                  You can pause the test at any time, but the timer will continue running.
                </Text>
              </View>
            </View>
          )}
          
          {activeSection === 'topics' && (
            <View>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Test Topics</Text>
              <Text style={[styles.topicsIntro, { color: theme.colors.textSecondary }]}>
                This test covers the following topics:
              </Text>
              
              {testData.topics.map((topic, index) => (
                <View key={index} style={[styles.topicItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
                  <View style={styles.topicNumber}>
                    <Text style={styles.topicNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.topicText, { color: theme.colors.text }]}>{topic}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleStartTest}
        >
          <Text style={styles.startButtonText}>Start Test</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testInfo: {
    marginBottom: 20,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  testTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  testStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 8,
  },
  statText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 13,
  },
  sectionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTab: {
    paddingVertical: 15,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeSection: {
    borderBottomColor: '#6200EE',
  },
  sectionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  activeSectionText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666666',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoCardRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoCardItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardTextContainer: {
    marginLeft: 10,
  },
  infoCardLabel: {
    fontSize: 12,
    color: '#666666',
  },
  infoCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  noticeText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
  },
  rulesIntro: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  ruleNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  ruleNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#F0E6FF',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#6200EE',
    flex: 1,
  },
  topicsIntro: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  topicNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  topicNumberText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#6200EE',
  },
  topicText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  preparationCard: {
    backgroundColor: '#FFF8E1',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  preparationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 10,
  },
  preparationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  preparationText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  bottomBar: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  startButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  startButtonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
});

export default TestDetailScreen; 