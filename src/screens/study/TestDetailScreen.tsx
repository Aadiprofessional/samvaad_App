import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { TestDetailScreenProps } from '../../types/navigation';

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
    <SafeAreaView style={styles.container} edges={['top']}>
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
        
        <View style={styles.sectionsContainer}>
          <TouchableOpacity
            style={[styles.sectionTab, activeSection === 'overview' && styles.activeSection]}
            onPress={() => setActiveSection('overview')}
          >
            <Text
              style={[
                styles.sectionText,
                activeSection === 'overview' && styles.activeSectionText,
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
                activeSection === 'rules' && styles.activeSectionText,
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
                activeSection === 'topics' && styles.activeSectionText,
              ]}
            >
              Topics
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          {activeSection === 'overview' && (
            <View>
              <Text style={styles.sectionTitle}>About This Test</Text>
              <Text style={styles.descriptionText}>
                {testData.description}
              </Text>
              
              <View style={styles.infoCard}>
                <View style={styles.infoCardRow}>
                  <View style={styles.infoCardItem}>
                    <Icon name="clock-outline" size={24} color="#6200EE" />
                    <View style={styles.infoCardTextContainer}>
                      <Text style={styles.infoCardLabel}>Duration</Text>
                      <Text style={styles.infoCardValue}>{testData.duration}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoCardItem}>
                    <Icon name="signal-cellular-outline" size={24} color="#6200EE" />
                    <View style={styles.infoCardTextContainer}>
                      <Text style={styles.infoCardLabel}>Difficulty</Text>
                      <Text style={styles.infoCardValue}>{testData.level}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.infoCardRow}>
                  <View style={styles.infoCardItem}>
                    <Icon name="help-circle-outline" size={24} color="#6200EE" />
                    <View style={styles.infoCardTextContainer}>
                      <Text style={styles.infoCardLabel}>Questions</Text>
                      <Text style={styles.infoCardValue}>{testData.questions} Questions</Text>
                    </View>
                  </View>
                  
                  <View style={styles.infoCardItem}>
                    <Icon name="trophy-outline" size={24} color="#6200EE" />
                    <View style={styles.infoCardTextContainer}>
                      <Text style={styles.infoCardLabel}>Pass Score</Text>
                      <Text style={styles.infoCardValue}>{testData.passingScore}%</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={styles.noticeText}>
                This test is designed to assess your understanding of basic sign language concepts. 
                Take your time and read each question carefully before answering.
              </Text>
            </View>
          )}
          
          {activeSection === 'rules' && (
            <View>
              <Text style={styles.sectionTitle}>Test Rules</Text>
              <Text style={styles.rulesIntro}>
                Please read and understand the following rules before starting the test:
              </Text>
              
              {testData.rules.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <View style={styles.ruleNumber}>
                    <Text style={styles.ruleNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
              
              <View style={styles.noteCard}>
                <Icon name="information-outline" size={24} color="#6200EE" />
                <Text style={styles.noteText}>
                  You can pause the test at any time, but the timer will continue running.
                </Text>
              </View>
            </View>
          )}
          
          {activeSection === 'topics' && (
            <View>
              <Text style={styles.sectionTitle}>Test Topics</Text>
              <Text style={styles.topicsIntro}>
                This test covers the following topics:
              </Text>
              
              {testData.topics.map((topic, index) => (
                <View key={index} style={styles.topicItem}>
                  <Icon name="check-circle" size={20} color="#6200EE" />
                  <Text style={styles.topicText}>{topic}</Text>
                </View>
              ))}
              
              <View style={styles.preparationCard}>
                <Text style={styles.preparationTitle}>Preparation Tips</Text>
                <View style={styles.preparationItem}>
                  <Icon name="lightbulb-outline" size={18} color="#FF9800" />
                  <Text style={styles.preparationText}>
                    Review all alphabet signs before taking the test
                  </Text>
                </View>
                <View style={styles.preparationItem}>
                  <Icon name="lightbulb-outline" size={18} color="#FF9800" />
                  <Text style={styles.preparationText}>
                    Practice finger spelling common words
                  </Text>
                </View>
                <View style={styles.preparationItem}>
                  <Icon name="lightbulb-outline" size={18} color="#FF9800" />
                  <Text style={styles.preparationText}>
                    Make sure you're in a quiet environment for the test
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.startButton}
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
    marginBottom: 15,
  },
  topicText: {
    marginLeft: 10,
    fontSize: 14,
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
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TestDetailScreen; 