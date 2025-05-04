import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { StudyScreenProps } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type TabsType = 'courses' | 'tests' | 'certificates';

type CourseType = {
  id: number;
  title: string;
  duration: string;
  lessons: number;
  level: string;
  progress: number;
  image: string;
  color1: string;
  color2: string;
};

type TestType = {
  id: number;
  title: string;
  questions: number;
  duration: string;
  level: string;
  completed: boolean;
  color1: string;
  color2: string;
};

type CertificateType = {
  id: number;
  title: string;
  issueDate: string;
  progress: number;
  color1: string;
  color2: string;
};

// Sample data - in a real app this would come from an API
const courses: CourseType[] = [
  {
    id: 1,
    title: 'Introduction to Sign Language',
    duration: '4 weeks',
    lessons: 12,
    level: 'Beginner',
    progress: 75,
    image: 'placeholder',
    color1: '#FF9A8B',
    color2: '#FF6A88',
  },
  {
    id: 2,
    title: 'Everyday Conversations',
    duration: '6 weeks',
    lessons: 18,
    level: 'Intermediate',
    progress: 45,
    image: 'placeholder',
    color1: '#FBAB7E',
    color2: '#F7CE68',
  },
  {
    id: 3,
    title: 'Advanced Sign Grammar',
    duration: '8 weeks',
    lessons: 24,
    level: 'Advanced',
    progress: 20,
    image: 'placeholder',
    color1: '#FA8BFF',
    color2: '#2BD2FF',
  },
  {
    id: 4,
    title: 'Sign Language for Children',
    duration: '5 weeks',
    lessons: 15,
    level: 'Beginner',
    progress: 10,
    image: 'placeholder',
    color1: '#a8ff78',
    color2: '#78ffd6',
  },
  {
    id: 5,
    title: 'Professional Sign Language',
    duration: '10 weeks',
    lessons: 30,
    level: 'Expert',
    progress: 5,
    image: 'placeholder',
    color1: '#8EC5FC',
    color2: '#E0C3FC',
  },
];

const tests: TestType[] = [
  {
    id: 1,
    title: 'Alphabet Signs Test',
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
    questions: 50,
    duration: '90 minutes',
    level: 'Expert',
    completed: false,
    color1: '#8EC5FC',
    color2: '#E0C3FC',
  },
];

const certificates: CertificateType[] = [
  {
    id: 1,
    title: 'Sign Language Basics Certificate',
    issueDate: 'May 15, 2023',
    progress: 100,
    color1: '#FF9A8B',
    color2: '#FF6A88',
  },
  {
    id: 2,
    title: 'Intermediate Signing Proficiency',
    issueDate: 'July 20, 2023',
    progress: 85,
    color1: '#FBAB7E',
    color2: '#F7CE68',
  },
  {
    id: 3,
    title: 'Advanced Communication Skills',
    issueDate: 'Ongoing',
    progress: 60,
    color1: '#FA8BFF',
    color2: '#2BD2FF',
  },
];

const StudyScreen = ({ navigation }: StudyScreenProps) => {
  const { width } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<TabsType>('courses');
  const { theme, isDarkMode } = useTheme();

  const renderCourseItem = ({ item }: { item: CourseType }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('LectureDetail', { courseId: item.id })}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[item.color1, item.color2]}
        style={styles.courseCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.courseCardContent}>
          <View>
            <Text style={styles.courseCardLevel}>{item.level.toUpperCase()}</Text>
            <Text style={styles.courseCardTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
            <View style={styles.courseCardDetails}>
              <View style={styles.courseCardDetail}>
                <Icon name="book-open-variant" size={14} color="#FFFFFF" />
                <Text style={styles.courseCardDetailText}>{item.lessons} Lessons</Text>
              </View>
              <View style={styles.courseCardDetail}>
                <Icon name="clock-outline" size={14} color="#FFFFFF" />
                <Text style={styles.courseCardDetailText}>{item.duration}</Text>
              </View>
            </View>
          </View>
          <View style={styles.courseCardProgress}>
            <Text style={styles.courseCardProgressText}>{item.progress}%</Text>
            <View style={styles.courseCardProgressBar}>
              <View style={[styles.courseCardProgressFill, { width: `${item.progress}%` }]} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

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
        <View style={styles.testCardHeader}>
          <Text style={styles.testCardTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <View style={[styles.testCardBadge, { backgroundColor: item.completed ? '#4CAF50' : '#FF9800' }]}>
            <Text style={styles.testCardBadgeText}>
              {item.completed ? 'Completed' : 'Available'}
            </Text>
          </View>
        </View>
        <View style={styles.testCardDetails}>
          <View style={styles.testCardDetail}>
            <Icon name="help-circle-outline" size={14} color="#FFFFFF" />
            <Text style={styles.testCardDetailText}>{item.questions} Questions</Text>
          </View>
          <View style={styles.testCardDetail}>
            <Icon name="clock-outline" size={14} color="#FFFFFF" />
            <Text style={styles.testCardDetailText}>{item.duration}</Text>
          </View>
          <View style={styles.testCardDetail}>
            <Icon name="signal-cellular-outline" size={14} color="#FFFFFF" />
            <Text style={styles.testCardDetailText}>{item.level}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCertificateItem = ({ item }: { item: CertificateType }) => (
    <TouchableOpacity
      style={styles.certificateCard}
      onPress={() => {}}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={[item.color1, item.color2]}
        style={styles.certificateCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.certificateCardContent}>
          <Icon name="certificate" size={30} color="#FFFFFF" style={styles.certificateIcon} />
          <Text style={styles.certificateTitle} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <Text style={styles.certificateDate}>
            {item.progress === 100 ? `Issued: ${item.issueDate}` : 'In Progress'}
          </Text>
          {item.progress < 100 && (
            <View style={styles.certificateProgress}>
              <View style={styles.certificateProgressBar}>
                <View
                  style={[styles.certificateProgressFill, { width: `${item.progress}%` }]}
                />
              </View>
              <Text style={styles.certificateProgressText}>{item.progress}% Complete</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return '#4CAF50';
      case 'intermediate':
        return '#FF9800';
      case 'advanced':
        return '#F44336';
      case 'expert':
        return '#9C27B0';
      default:
        return '#4CAF50';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: theme.colors.text }]}>Study</Text>
        <TouchableOpacity style={[styles.searchButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
          <Icon name="magnify" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.featuredSection}>
        <ImageBackground
          source={require('../assets/images/placeholder-avatar.png')}
          style={[styles.featuredCourse, { width: width - 40 }]}
          imageStyle={{ borderRadius: 15 }}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
            style={styles.featuredGradient}
          >
            <View style={styles.featuredContent}>
              <View style={[styles.featuredBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.featuredBadgeText}>NEW COURSE</Text>
              </View>
              <Text style={styles.featuredTitle} numberOfLines={2} ellipsizeMode="tail">Master Sign Language in 12 Weeks</Text>
              <Text style={styles.featuredDescription}>
                A comprehensive course for all skill levels
              </Text>
              <TouchableOpacity style={styles.featuredButton}>
                <Text style={[styles.featuredButtonText, { color: theme.colors.primary }]}>Enroll Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      <View style={[styles.tabsContainer, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'courses' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]]}
          onPress={() => setActiveTab('courses')}
        >
          <Text
            style={[
              styles.tabText,
              { color: isDarkMode ? '#9E9E9E' : '#9E9E9E' },
              activeTab === 'courses' && [styles.activeTabText, { color: theme.colors.primary }],
            ]}
          >
            Courses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'tests' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]]}
          onPress={() => setActiveTab('tests')}
        >
          <Text
            style={[
              styles.tabText,
              { color: isDarkMode ? '#9E9E9E' : '#9E9E9E' },
              activeTab === 'tests' && [styles.activeTabText, { color: theme.colors.primary }],
            ]}
          >
            Tests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'certificates' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]]}
          onPress={() => setActiveTab('certificates')}
        >
          <Text
            style={[
              styles.tabText,
              { color: isDarkMode ? '#9E9E9E' : '#9E9E9E' },
              activeTab === 'certificates' && [styles.activeTabText, { color: theme.colors.primary }],
            ]}
          >
            Certificates
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'courses' && (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'tests' && (
        <FlatList
          data={tests}
          renderItem={renderTestItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'certificates' && (
        <FlatList
          data={certificates}
          renderItem={renderCertificateItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featuredCourse: {
    height: 180,
    borderRadius: 15,
    overflow: 'hidden',
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredContent: {
    width: '100%',
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    maxWidth: '90%',
  },
  featuredDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  featuredButton: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featuredButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  tab: {
    paddingVertical: 10,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  courseCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  courseCardGradient: {
    padding: 15,
  },
  courseCardContent: {
    justifyContent: 'space-between',
  },
  courseCardLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 5,
  },
  courseCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    maxWidth: '90%',
  },
  courseCardDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  courseCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  courseCardDetailText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  courseCardProgress: {
    marginTop: 10,
  },
  courseCardProgressText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'right',
    marginBottom: 5,
  },
  courseCardProgressBar: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  courseCardProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  testCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
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
    padding: 15,
  },
  testCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  testCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    width: '70%',
    maxWidth: '70%',
  },
  testCardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  testCardBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  testCardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  testCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 8,
  },
  testCardDetailText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 5,
  },
  certificateCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  certificateCardGradient: {
    padding: 20,
  },
  certificateCardContent: {
    alignItems: 'center',
  },
  certificateIcon: {
    marginBottom: 10,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
    maxWidth: '95%',
  },
  certificateDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 15,
  },
  certificateProgress: {
    width: '100%',
  },
  certificateProgressBar: {
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 5,
  },
  certificateProgressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  certificateProgressText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default StudyScreen; 