import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { LectureDetailScreenProps } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { useIsFocused } from '@react-navigation/native';

type LessonType = {
  id: number;
  title: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
};

// Sample course data - this would come from an API in a real app
const courseData = {
  id: 1,
  title: 'Introduction to Sign Language',
  description: 'Learn the basics of sign language and start communicating effectively with the deaf and hard of hearing community.',
  instructor: 'Dr. Maya Patel',
  duration: '4 weeks',
  level: 'Beginner',
  rating: 4.8,
  ratingCount: 124,
  studentsCount: 1245,
  price: 'Free',
  color1: '#FF9A8B',
  color2: '#FF6A88',
  progress: 75,
  lessons: [
    {
      id: 1,
      title: 'Welcome and Introduction',
      duration: '10 min',
      isCompleted: true,
      isLocked: false,
    },
    {
      id: 2,
      title: 'The Sign Language Alphabet',
      duration: '25 min',
      isCompleted: true,
      isLocked: false,
    },
    {
      id: 3,
      title: 'Basic Greetings and Introductions',
      duration: '20 min',
      isCompleted: true,
      isLocked: false,
    },
    {
      id: 4,
      title: 'Numbers and Counting',
      duration: '15 min',
      isCompleted: false,
      isLocked: false,
    },
    {
      id: 5,
      title: 'Common Questions and Responses',
      duration: '30 min',
      isCompleted: false,
      isLocked: true,
    },
    {
      id: 6,
      title: 'Family and Relationships',
      duration: '25 min',
      isCompleted: false,
      isLocked: true,
    },
    {
      id: 7,
      title: 'Daily Activities and Routines',
      duration: '20 min',
      isCompleted: false,
      isLocked: true,
    },
    {
      id: 8,
      title: 'Practice Session 1',
      duration: '45 min',
      isCompleted: false,
      isLocked: true,
    },
  ],
};

type TabsType = 'lessons' | 'details' | 'reviews';

const LectureDetailScreen = ({ route, navigation }: LectureDetailScreenProps) => {
  const { courseId } = route.params;
  const [activeTab, setActiveTab] = useState<TabsType>('lessons');
  const { theme, isDarkMode } = useTheme();
  const isFocused = useIsFocused();
  
  // Updated code to hide the bottom tab when viewing lecture detail
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
  
  // In a real app, we would fetch the course data based on courseId
  // For now, we're using the sample data
  
  const renderLessonItem = ({ item }: { item: LessonType }) => (
    <TouchableOpacity 
      style={[
        styles.lessonItem, 
        { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' },
        item.isLocked && styles.lockedLesson
      ]}
      disabled={item.isLocked}
    >
      <View style={styles.lessonContent}>
        <View style={styles.lessonLeftContent}>
          {item.isCompleted ? (
            <View style={styles.completedIcon}>
              <Icon name="check" size={14} color="#FFFFFF" />
            </View>
          ) : (
            <View style={[
              styles.lessonNumber, 
              { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' },
              item.isLocked && styles.lockedNumber
            ]}>
              <Text style={[
                styles.lessonNumberText,
                { color: item.isLocked ? '#AAAAAA' : theme.colors.primary }
              ]}>{item.id}</Text>
            </View>
          )}
          <View>
            <Text style={[
              styles.lessonTitle,
              { color: isDarkMode ? '#FFFFFF' : '#333333' },
              item.isLocked && { color: isDarkMode ? '#777777' : '#AAAAAA' }
            ]}>
              {item.title}
            </Text>
            <Text style={[
              styles.lessonDuration,
              { color: isDarkMode ? '#AAAAAA' : '#666666' }
            ]}>
              {item.duration}
            </Text>
          </View>
        </View>
        
        {item.isLocked ? (
          <Icon name="lock" size={20} color={isDarkMode ? "#777777" : "#AAAAAA"} />
        ) : (
          <TouchableOpacity style={[
            styles.playButton,
            { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }
          ]}>
            <Icon name="play" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[courseData.color1, courseData.color2]}
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
              <TouchableOpacity style={styles.bookmarkButton}>
                <Icon name="bookmark-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.courseInfo}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{courseData.level}</Text>
              </View>
              <Text style={styles.courseTitle}>{courseData.title}</Text>
              <View style={styles.instructorContainer}>
                <Icon name="account" size={18} color="#FFFFFF" />
                <Text style={styles.instructorText}>{courseData.instructor}</Text>
              </View>
              
              <View style={styles.courseStats}>
                <View style={styles.statItem}>
                  <Icon name="star" size={16} color="#FFFFFF" />
                  <Text style={styles.statText}>
                    {courseData.rating} ({courseData.ratingCount})
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="account-group" size={16} color="#FFFFFF" />
                  <Text style={styles.statText}>
                    {courseData.studentsCount} students
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Icon name="clock-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.statText}>{courseData.duration}</Text>
                </View>
              </View>
              
              <View style={styles.courseProgress}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${courseData.progress}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>
                  {courseData.progress}% Complete
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        
        <View style={[styles.tabsContainer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'lessons' && styles.activeTab]}
            onPress={() => setActiveTab('lessons')}
          >
            <Text
              style={[
                styles.tabText,
                { color: isDarkMode ? '#AAAAAA' : '#666666' },
                activeTab === 'lessons' && { color: theme.colors.primary }
              ]}
            >
              Lessons
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'details' && styles.activeTab]}
            onPress={() => setActiveTab('details')}
          >
            <Text
              style={[
                styles.tabText,
                { color: isDarkMode ? '#AAAAAA' : '#666666' },
                activeTab === 'details' && { color: theme.colors.primary }
              ]}
            >
              Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text
              style={[
                styles.tabText,
                { color: isDarkMode ? '#AAAAAA' : '#666666' },
                activeTab === 'reviews' && { color: theme.colors.primary }
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.contentContainer, { backgroundColor: isDarkMode ? '#121212' : '#F8F9FA' }]}>
          {activeTab === 'lessons' && (
            <View>
              <FlatList
                data={courseData.lessons}
                renderItem={renderLessonItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              />
            </View>
          )}
          
          {activeTab === 'details' && (
            <View style={styles.detailsContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About This Course</Text>
              <Text style={[styles.courseDescription, { color: theme.colors.textSecondary }]}>
                {courseData.description}
              </Text>
              
              <View style={[styles.detailCard, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Icon name="account" size={24} color={theme.colors.primary} />
                    <View>
                      <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Instructor</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.text }]}>{courseData.instructor}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Icon name="clock-outline" size={24} color={theme.colors.primary} />
                    <View>
                      <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Duration</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.text }]}>{courseData.duration}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Icon name="book-open-variant" size={24} color={theme.colors.primary} />
                    <View>
                      <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Lessons</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.text }]}>{courseData.lessons.length} lessons</Text>
                    </View>
                  </View>
                  
                  <View style={styles.detailItem}>
                    <Icon name="signal-cellular-outline" size={24} color={theme.colors.primary} />
                    <View>
                      <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>Level</Text>
                      <Text style={[styles.detailValue, { color: theme.colors.text }]}>{courseData.level}</Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>What You'll Learn</Text>
              <View style={styles.learnList}>
                <View style={[styles.learnItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                  <View style={[styles.learnBullet, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
                    <Icon name="check" size={14} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.learnText, { color: theme.colors.text }]}>
                    Master finger spelling of the complete alphabet
                  </Text>
                </View>
                
                <View style={[styles.learnItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                  <View style={[styles.learnBullet, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
                    <Icon name="check" size={14} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.learnText, { color: theme.colors.text }]}>
                    Learn common greetings and introductions
                  </Text>
                </View>
                
                <View style={[styles.learnItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                  <View style={[styles.learnBullet, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
                    <Icon name="check" size={14} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.learnText, { color: theme.colors.text }]}>
                    Understand basic grammar and syntax of sign language
                  </Text>
                </View>
                
                <View style={[styles.learnItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                  <View style={[styles.learnBullet, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
                    <Icon name="check" size={14} color={theme.colors.primary} />
                  </View>
                  <Text style={[styles.learnText, { color: theme.colors.text }]}>
                    Communicate simple concepts and ideas through signing
                  </Text>
                </View>
              </View>
            </View>
          )}
          
          {activeTab === 'reviews' && (
            <View style={styles.reviewsContainer}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Student Reviews</Text>
              <View style={[styles.reviewSummary, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
                <View style={styles.ratingContainer}>
                  <Text style={[styles.ratingNumber, { color: theme.colors.text }]}>{courseData.rating}</Text>
                  <View style={styles.starsContainer}>
                    <Icon name="star" size={18} color="#FFD700" />
                    <Icon name="star" size={18} color="#FFD700" />
                    <Icon name="star" size={18} color="#FFD700" />
                    <Icon name="star" size={18} color="#FFD700" />
                    <Icon name="star-half" size={18} color="#FFD700" />
                  </View>
                  <Text style={[styles.ratingsCount, { color: theme.colors.textSecondary }]}>
                    {courseData.ratingCount} ratings
                  </Text>
                </View>
                
                <View style={styles.ratingBarContainer}>
                  <View style={styles.ratingBarItem}>
                    <Text style={[styles.ratingBarText, { color: theme.colors.textSecondary }]}>5</Text>
                    <View style={[styles.ratingBar, { backgroundColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                      <View style={[styles.ratingFill, { width: '80%' }]} />
                    </View>
                  </View>
                  
                  <View style={styles.ratingBarItem}>
                    <Text style={[styles.ratingBarText, { color: theme.colors.textSecondary }]}>4</Text>
                    <View style={[styles.ratingBar, { backgroundColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                      <View style={[styles.ratingFill, { width: '15%' }]} />
                    </View>
                  </View>
                  
                  <View style={styles.ratingBarItem}>
                    <Text style={[styles.ratingBarText, { color: theme.colors.textSecondary }]}>3</Text>
                    <View style={[styles.ratingBar, { backgroundColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                      <View style={[styles.ratingFill, { width: '5%' }]} />
                    </View>
                  </View>
                  
                  <View style={styles.ratingBarItem}>
                    <Text style={[styles.ratingBarText, { color: theme.colors.textSecondary }]}>2</Text>
                    <View style={[styles.ratingBar, { backgroundColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                      <View style={[styles.ratingFill, { width: '0%' }]} />
                    </View>
                  </View>
                  
                  <View style={styles.ratingBarItem}>
                    <Text style={[styles.ratingBarText, { color: theme.colors.textSecondary }]}>1</Text>
                    <View style={[styles.ratingBar, { backgroundColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
                      <View style={[styles.ratingFill, { width: '0%' }]} />
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Sample review items would go here */}
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
        <TouchableOpacity 
          style={[styles.continueButton, { backgroundColor: theme.colors.primary }]}
        >
          <Text style={styles.continueButtonText}>Continue Learning</Text>
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
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseInfo: {
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
  courseTitle: {
    fontSize: 24,
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
  courseStats: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    color: '#FFFFFF',
    marginLeft: 5,
    fontSize: 13,
  },
  courseProgress: {
    marginTop: 5,
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    paddingVertical: 15,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6200EE',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9E9E9E',
  },
  activeTabText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  lessonsContainer: {
    padding: 20,
  },
  lessonItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  lessonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lessonLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lessonNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lessonNumberText: {
    color: '#6200EE',
    fontWeight: 'bold',
    fontSize: 14,
  },
  completedIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedLesson: {
    opacity: 0.7,
  },
  lockedNumber: {
    backgroundColor: '#F0F0F0',
  },
  lockedText: {
    color: '#AAAAAA',
  },
  detailsContainer: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    marginTop: 15,
  },
  detailsText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666666',
  },
  learningPoints: {
    marginTop: 5,
  },
  learningPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  learningPointText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
    flex: 1,
  },
  reviewsContainer: {
    padding: 20,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
  },
  ratingNumber: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 15,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  noReviewsText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  writeReviewButton: {
    backgroundColor: '#F0E6FF',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  writeReviewText: {
    color: '#6200EE',
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomBar: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  continueButton: {
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666666',
  },
  detailCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  detailValue: {
    fontSize: 14,
    color: '#666666',
  },
  learnList: {
    marginTop: 5,
  },
  learnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  learnBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  learnText: {
    fontSize: 14,
    color: '#666666',
  },
  reviewSummary: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingsCount: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  ratingBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  ratingBarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  ratingBar: {
    height: 20,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    marginRight: 10,
  },
  ratingFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 10,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
});

export default LectureDetailScreen; 