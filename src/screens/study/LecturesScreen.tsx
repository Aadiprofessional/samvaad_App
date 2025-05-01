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
import { LecturesScreenProps } from '../../types/navigation';

type LectureType = {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  level: string;
  image: string;
  lessonsCount: number;
  color1: string;
  color2: string;
};

const lecturesData: LectureType[] = [
  {
    id: 1,
    title: 'Introduction to Sign Language',
    instructor: 'Dr. Maya Patel',
    duration: '4 weeks',
    level: 'Beginner',
    image: 'placeholder',
    lessonsCount: 12,
    color1: '#FF9A8B',
    color2: '#FF6A88',
  },
  {
    id: 2,
    title: 'Everyday Conversations',
    instructor: 'Prof. James Wilson',
    duration: '6 weeks',
    level: 'Intermediate',
    image: 'placeholder',
    lessonsCount: 18,
    color1: '#FBAB7E',
    color2: '#F7CE68',
  },
  {
    id: 3,
    title: 'Advanced Sign Grammar',
    instructor: 'Dr. Leila Chen',
    duration: '8 weeks',
    level: 'Advanced',
    image: 'placeholder',
    lessonsCount: 24,
    color1: '#FA8BFF',
    color2: '#2BD2FF',
  },
  {
    id: 4,
    title: 'Sign Language for Children',
    instructor: 'Sarah Johnson',
    duration: '5 weeks',
    level: 'Beginner',
    image: 'placeholder',
    lessonsCount: 15,
    color1: '#a8ff78',
    color2: '#78ffd6',
  },
  {
    id: 5,
    title: 'Professional Sign Language',
    instructor: 'Dr. Robert Harris',
    duration: '10 weeks',
    level: 'Expert',
    image: 'placeholder',
    lessonsCount: 30,
    color1: '#8EC5FC',
    color2: '#E0C3FC',
  },
];

const LecturesScreen = ({ navigation }: LecturesScreenProps) => {
  const renderLectureItem = ({ item }: { item: LectureType }) => (
    <TouchableOpacity
      style={styles.lectureCard}
      onPress={() => navigation.navigate('LectureDetail', { courseId: item.id })}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[item.color1, item.color2]}
        style={styles.lectureCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.lectureHeader}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
          <Icon name="bookmark-outline" size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.lectureTitle}>{item.title}</Text>
        <View style={styles.instructorContainer}>
          <Icon name="account" size={18} color="#FFFFFF" />
          <Text style={styles.instructorText}>{item.instructor}</Text>
        </View>
        <View style={styles.lectureDetailsContainer}>
          <View style={styles.lectureDetail}>
            <Icon name="book-open-variant" size={16} color="#FFFFFF" />
            <Text style={styles.detailText}>{item.lessonsCount} Lessons</Text>
          </View>
          <View style={styles.lectureDetail}>
            <Icon name="clock-outline" size={16} color="#FFFFFF" />
            <Text style={styles.detailText}>{item.duration}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.startButton}>
          <Text style={styles.startButtonText}>START LEARNING</Text>
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
        <Text style={styles.headerTitle}>Lectures</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="magnify" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={lecturesData}
        renderItem={renderLectureItem}
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
  searchButton: {
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
  lectureCard: {
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
  lectureCardGradient: {
    padding: 20,
  },
  lectureHeader: {
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
  lectureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  instructorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  instructorText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
  lectureDetailsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  lectureDetail: {
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LecturesScreen; 