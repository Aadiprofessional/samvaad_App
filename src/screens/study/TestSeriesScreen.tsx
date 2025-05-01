import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { TestSeriesScreenProps } from '../../types/navigation';

type TestType = {
  id: number;
  title: string;
  description: string;
  questions: number;
  duration: string;
  level: string;
  completed: boolean;
  color1: string;
  color2: string;
};

const testsData: TestType[] = [
  {
    id: 1,
    title: 'Alphabet Signs Test',
    description: 'Test your knowledge of the sign language alphabet',
    questions: 25,
    duration: '30 minutes',
    level: 'Beginner',
    completed: true,
    color1: '#FF9A8B',
    color2: '#FF6A88',
  },
  {
    id: 2,
    title: 'Common Phrases Quiz',
    description: 'Practice everyday conversational sign language',
    questions: 30,
    duration: '45 minutes',
    level: 'Intermediate',
    completed: true,
    color1: '#FBAB7E',
    color2: '#F7CE68',
  },
  {
    id: 3,
    title: 'Grammar and Syntax Test',
    description: 'Advanced grammar structures and syntax rules',
    questions: 40,
    duration: '60 minutes',
    level: 'Advanced',
    completed: false,
    color1: '#FA8BFF',
    color2: '#2BD2FF',
  },
  {
    id: 4,
    title: 'Real-world Scenarios',
    description: 'Apply your skills in practical situations',
    questions: 35,
    duration: '50 minutes',
    level: 'Intermediate',
    completed: false,
    color1: '#a8ff78',
    color2: '#78ffd6',
  },
  {
    id: 5,
    title: 'Professional Certification',
    description: 'Final test for professional certification',
    questions: 50,
    duration: '90 minutes',
    level: 'Expert',
    completed: false,
    color1: '#8EC5FC',
    color2: '#E0C3FC',
  },
];

const TestSeriesScreen = ({ navigation }: TestSeriesScreenProps) => {
  const renderTestItem = ({ item }: { item: TestType }) => (
    <TouchableOpacity
      style={styles.testCard}
      onPress={() => navigation.navigate('TestDetail', { testId: item.id })}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[item.color1, item.color2]}
        style={styles.testCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.testHeader}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
          <View style={[
            styles.statusBadge, 
            { backgroundColor: item.completed ? '#4CAF50' : '#FF9800' }
          ]}>
            <Text style={styles.statusText}>
              {item.completed ? 'Completed' : 'Available'}
            </Text>
          </View>
        </View>
        <Text style={styles.testTitle}>{item.title}</Text>
        <Text style={styles.testDescription}>{item.description}</Text>
        <View style={styles.testDetailsContainer}>
          <View style={styles.testDetail}>
            <Icon name="help-circle-outline" size={16} color="#FFFFFF" />
            <Text style={styles.detailText}>{item.questions} Questions</Text>
          </View>
          <View style={styles.testDetail}>
            <Icon name="clock-outline" size={16} color="#FFFFFF" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[
            styles.startButton,
            item.completed ? styles.retakeButton : styles.takeButton
          ]}
        >
          <Text style={styles.startButtonText}>
            {item.completed ? 'RETAKE TEST' : 'START TEST'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Series</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-variant" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={testsData}
        renderItem={renderTestItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  testCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  testCardGradient: {
    padding: 20,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  testTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  testDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  testDetailsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  testDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  detailText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
  startButton: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  takeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  retakeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TestSeriesScreen; 