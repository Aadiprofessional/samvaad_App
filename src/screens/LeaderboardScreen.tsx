import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useIsFocused } from '@react-navigation/native';
import { LeaderboardScreenProps } from '../types/navigation';
import { getVisibleTabBarStyle, getDefaultTabBarStyle, getBottomTabBarSpace, manageTabBarVisibility } from '../utils/tabBarStyles';

const { width } = Dimensions.get('window');

type UserRankingType = {
  id: number;
  name: string;
  avatar: any;
  score: number;
  rank: number;
  change: 'up' | 'down' | 'same';
};

type GameStatsType = {
  id: number;
  name: string;
  icon: string;
  color1: string;
  color2: string;
  score: number;
  highScore: number;
  completionRate: number;
};

type AchievementType = {
  id: number;
  title: string;
  description: string;
  icon: string;
  color1: string;
  color2: string;
  completed: boolean;
  progress: number;
};

// Sample data - in a real app this would come from an API
const userRankings: UserRankingType[] = [
  {
    id: 1,
    name: 'Sophia Kim',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 9850,
    rank: 1,
    change: 'same',
  },
  {
    id: 2,
    name: 'Alex Johnson',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 9240,
    rank: 2,
    change: 'up',
  },
  {
    id: 3,
    name: 'Maria Garcia',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 8970,
    rank: 3,
    change: 'down',
  },
  {
    id: 4,
    name: 'James Wilson',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 8750,
    rank: 4,
    change: 'up',
  },
  {
    id: 5,
    name: 'Emma Brown',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 8520,
    rank: 5,
    change: 'same',
  },
  {
    id: 6,
    name: 'Daniel Martinez',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 8300,
    rank: 6,
    change: 'down',
  },
  {
    id: 7,
    name: 'Olivia Lee',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 8120,
    rank: 7,
    change: 'up',
  },
  {
    id: 8,
    name: 'William Anderson',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 7980,
    rank: 8,
    change: 'down',
  },
  {
    id: 9,
    name: 'Ava Martinez',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 7750,
    rank: 9,
    change: 'same',
  },
  {
    id: 10,
    name: 'Noah Thompson',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 7520,
    rank: 10,
    change: 'up',
  },
];

const gameStats: GameStatsType[] = [
  {
    id: 1,
    name: 'Flip Cards',
    icon: 'cards',
    color1: '#FF9A8B',
    color2: '#FF6A88',
    score: 2500,
    highScore: 3200,
    completionRate: 85,
  },
  {
    id: 2,
    name: 'Memory Match',
    icon: 'brain',
    color1: '#FBAB7E',
    color2: '#F7CE68',
    score: 1850,
    highScore: 2400,
    completionRate: 75,
  },
  {
    id: 3,
    name: 'Sign Quiz',
    icon: 'help-circle',
    color1: '#FA8BFF',
    color2: '#2BD2FF',
    score: 2200,
    highScore: 2800,
    completionRate: 90,
  },
  {
    id: 4,
    name: 'Word Association',
    icon: 'link-variant',
    color1: '#a8ff78',
    color2: '#78ffd6',
    score: 1500,
    highScore: 2000,
    completionRate: 65,
  },
  {
    id: 5,
    name: 'Sequence Game',
    icon: 'arrange-send-backward',
    color1: '#8EC5FC',
    color2: '#E0C3FC',
    score: 950,
    highScore: 1800,
    completionRate: 40,
  },
  {
    id: 6,
    name: 'Story Time',
    icon: 'book-open-variant',
    color1: '#654ea3',
    color2: '#eaafc8',
    score: 850,
    highScore: 1500,
    completionRate: 35,
  },
];

const achievements: AchievementType[] = [
  {
    id: 1,
    title: 'Beginner Signer',
    description: 'Complete 10 lessons in the basics course',
    icon: 'star',
    color1: '#FF9A8B',
    color2: '#FF6A88',
    completed: true,
    progress: 100,
  },
  {
    id: 2,
    title: 'Memory Master',
    description: 'Achieve a perfect score in Memory Match game',
    icon: 'brain',
    color1: '#FBAB7E',
    color2: '#F7CE68',
    completed: true,
    progress: 100,
  },
  {
    id: 3,
    title: 'Quiz Champion',
    description: 'Answer 50 quiz questions correctly',
    icon: 'help-circle',
    color1: '#FA8BFF',
    color2: '#2BD2FF',
    completed: false,
    progress: 70,
  },
  {
    id: 4,
    title: 'Daily Streak',
    description: 'Use the app for 30 consecutive days',
    icon: 'calendar',
    color1: '#a8ff78',
    color2: '#78ffd6',
    completed: false,
    progress: 60,
  },
  {
    id: 5,
    title: 'Translation Pro',
    description: 'Translate 100 signs using the translator',
    icon: 'translate',
    color1: '#8EC5FC',
    color2: '#E0C3FC',
    completed: false,
    progress: 45,
  },
  {
    id: 6,
    title: 'Grammar Expert',
    description: 'Complete the advanced grammar course',
    icon: 'book',
    color1: '#654ea3',
    color2: '#eaafc8',
    completed: false,
    progress: 30,
  },
];

type TabsType = 'ranking' | 'stats' | 'achievements';

const LeaderboardScreen = ({ navigation }: LeaderboardScreenProps) => {
  const [activeTab, setActiveTab] = useState<TabsType>('ranking');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  const { theme, isDarkMode } = useTheme();
  const isFocused = useIsFocused();
  
  // Update the useLayoutEffect block
  useLayoutEffect(() => {
    // Use the utility function to ensure tab bar is visible
    return manageTabBarVisibility(navigation, isFocused, isDarkMode, false);
  }, [navigation, isFocused, isDarkMode]);
  
  // Current user - in a real app, this would come from an auth system
  const currentUser = {
    id: 2,
    name: 'Alex Johnson',
    avatar: require('../assets/images/placeholder-avatar.png'),
    score: 9240,
    rank: 2,
    change: 'up' as const,
  };

  const renderUserRankItem = ({ item }: { item: UserRankingType }) => {
    const isCurrentUser = item.id === currentUser.id;
    
    return (
      <View 
        style={[
          styles.rankItem,
          { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' },
          isCurrentUser && [styles.currentUserRankItem, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]
        ]}
      >
        <View style={styles.rankPosition}>
          {item.rank <= 3 ? (
            <View style={[styles.topRankBadge, { 
              backgroundColor: 
                item.rank === 1 ? '#FFD700' : 
                item.rank === 2 ? '#C0C0C0' : 
                '#CD7F32'
            }]}>
              <Text style={styles.topRankText}>{item.rank}</Text>
            </View>
          ) : (
            <Text style={[styles.rankPositionText, { color: theme.colors.text }]}>{item.rank}</Text>
          )}
        </View>
        
        <Image source={item.avatar} style={styles.userAvatar} />
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.colors.text }, isCurrentUser && styles.currentUserText]} numberOfLines={1} ellipsizeMode="tail">
            {item.name} {isCurrentUser && '(You)'}
          </Text>
          <Text style={[styles.userScore, { color: theme.colors.textSecondary }]}>{item.score.toLocaleString()} pts</Text>
        </View>
        
        <View style={styles.rankChange}>
          {item.change === 'up' && <Icon name="arrow-up" size={18} color="#4CAF50" />}
          {item.change === 'down' && <Icon name="arrow-down" size={18} color="#F44336" />}
          {item.change === 'same' && <Icon name="minus" size={18} color="#9E9E9E" />}
        </View>
      </View>
    );
  };

  const renderGameStatItem = ({ item }: { item: GameStatsType }) => (
    <View style={styles.gameStatCard}>
      <View style={[styles.gameStatCardContainer, { backgroundColor: isDarkMode ? '#333333' : '#FFFFFF' }]}>
        <LinearGradient
          colors={[item.color1, item.color2]}
          style={styles.gameStatCardGradientStrip}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <View style={styles.gameStatCardContent}>
          <View style={styles.gameStatHeader}>
            <View style={[styles.gameStatIconContainer, { backgroundColor: item.color1 }]}>
              <Icon name={item.icon} size={24} color="#FFFFFF" />
            </View>
            <Text style={[styles.gameStatTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>{item.name}</Text>
          </View>
          
          <View style={styles.gameStatDetails}>
            <View style={styles.gameStatDetail}>
              <Text style={[styles.gameStatLabel, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }]}>
                Current Score:
              </Text>
              <Text style={[styles.gameStatValue, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                {item.score}
              </Text>
            </View>
            
            <View style={styles.gameStatDetail}>
              <Text style={[styles.gameStatLabel, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }]}>
                High Score:
              </Text>
              <Text style={[styles.gameStatValue, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                {item.highScore}
              </Text>
            </View>
            
            <View style={styles.gameStatDetail}>
              <Text style={[styles.gameStatLabel, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }]}>
                Completion:
              </Text>
              <Text style={[styles.gameStatValue, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                {item.completionRate}%
              </Text>
            </View>
            
            <View style={[styles.gameStatProgressBar, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]}>
              <View 
                style={[
                  styles.gameStatProgressFill, 
                  { width: `${item.completionRate}%`, backgroundColor: item.color1 }
                ]} 
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAchievementItem = ({ item }: { item: AchievementType }) => (
    <View style={[styles.achievementItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
      <LinearGradient
        colors={[item.color1, item.color2]}
        style={[
          styles.achievementIcon, 
          !item.completed && styles.incompleteAchievementIcon
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Icon 
          name={item.icon} 
          size={24} 
          color={item.completed ? "#FFFFFF" : "rgba(255,255,255,0.6)"} 
        />
      </LinearGradient>
      
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, { color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
        <Text style={[styles.achievementDescription, { color: theme.colors.textSecondary }]} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
        
        {!item.completed && (
          <View style={styles.achievementProgress}>
            <View style={[styles.achievementProgressBar, { backgroundColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
              <View 
                style={[
                  styles.achievementProgressFill,
                  { width: `${item.progress}%`,
                    backgroundColor: item.color1 }
                ]} 
              />
            </View>
            <Text style={[styles.achievementProgressText, { color: theme.colors.textSecondary }]}>{item.progress}%</Text>
          </View>
        )}
      </View>
      
      {item.completed && (
        <View style={styles.achievementCompleted}>
          <Icon name="check-circle" size={24} color="#4CAF50" />
        </View>
      )}
    </View>
  );

  const renderSummaryCard = () => (
    <View style={styles.summaryCard}>
      <View style={[styles.summaryCardContainer, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.summaryCardContent}>
          <View style={styles.summaryUserInfo}>
            <Image 
              source={currentUser.avatar} 
              style={styles.summaryAvatar} 
            />
            <View style={styles.userTextInfo}>
              <Text style={styles.summaryUserName} numberOfLines={1} ellipsizeMode="tail">
                {currentUser.name}
              </Text>
              <View style={styles.summaryRank}>
                <Text style={styles.summaryRankText} numberOfLines={1} ellipsizeMode="tail">
                  Rank #{currentUser.rank}
                </Text>
                <View style={styles.summaryRankChange}>
                  {currentUser.change === 'up' ? (
                    <Icon name="arrow-up" size={14} color="#4CAF50" />
                  ) : currentUser.change === 'down' ? (
                    <Icon name="arrow-down" size={14} color="#F44336" />
                  ) : null}
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue} adjustsFontSizeToFit numberOfLines={1} ellipsizeMode="tail">
                {currentUser.score.toLocaleString()}
              </Text>
              <Text style={styles.summaryStatLabel}>Points</Text>
            </View>
            
            <View style={styles.summaryStatDivider} />
            
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue} adjustsFontSizeToFit numberOfLines={1} ellipsizeMode="tail">
                {achievements.filter(a => a.completed).length}
              </Text>
              <Text style={styles.summaryStatLabel}>Achievements</Text>
            </View>
            
            <View style={styles.summaryStatDivider} />
            
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue} adjustsFontSizeToFit numberOfLines={1} ellipsizeMode="tail">
                {Math.round(gameStats.reduce((acc, game) => acc + game.completionRate, 0) / gameStats.length)}%
              </Text>
              <Text style={styles.summaryStatLabel}>Completion</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.screenTitle, { color: theme.colors.text }]}>Leaderboard</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
          <Icon name="filter-variant" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {renderSummaryCard()}

      <View style={[styles.tabsContainer, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ranking' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]]}
          onPress={() => setActiveTab('ranking')}
        >
          <Text
            style={[
              styles.tabText,
              { color: isDarkMode ? '#9E9E9E' : '#9E9E9E' },
              activeTab === 'ranking' && [styles.activeTabText, { color: theme.colors.primary }],
            ]}
          >
            Ranking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]]}
          onPress={() => setActiveTab('stats')}
        >
          <Text
            style={[
              styles.tabText,
              { color: isDarkMode ? '#9E9E9E' : '#9E9E9E' },
              activeTab === 'stats' && [styles.activeTabText, { color: theme.colors.primary }],
            ]}
          >
            Game Stats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && [styles.activeTab, { borderBottomColor: theme.colors.primary }]]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text
            style={[
              styles.tabText,
              { color: isDarkMode ? '#9E9E9E' : '#9E9E9E' },
              activeTab === 'achievements' && [styles.activeTabText, { color: theme.colors.primary }],
            ]}
          >
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'ranking' && (
        <View style={[styles.timeFilterContainer, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
          <TouchableOpacity
            style={[styles.timeFilter, timeFilter === 'week' && [styles.activeTimeFilter, { backgroundColor: theme.colors.primary }]]}
            onPress={() => setTimeFilter('week')}
          >
            <Text
              style={[
                styles.timeFilterText,
                { color: theme.colors.textSecondary },
                timeFilter === 'week' && styles.activeTimeFilterText,
              ]}
            >
              This Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timeFilter, timeFilter === 'month' && [styles.activeTimeFilter, { backgroundColor: theme.colors.primary }]]}
            onPress={() => setTimeFilter('month')}
          >
            <Text
              style={[
                styles.timeFilterText,
                { color: theme.colors.textSecondary },
                timeFilter === 'month' && styles.activeTimeFilterText,
              ]}
            >
              This Month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timeFilter, timeFilter === 'all' && [styles.activeTimeFilter, { backgroundColor: theme.colors.primary }]]}
            onPress={() => setTimeFilter('all')}
          >
            <Text
              style={[
                styles.timeFilterText,
                { color: theme.colors.textSecondary },
                timeFilter === 'all' && styles.activeTimeFilterText,
              ]}
            >
              All Time
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === 'ranking' && (
        <FlatList
          data={userRankings}
          renderItem={renderUserRankItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[styles.listContainer, { paddingBottom: getBottomTabBarSpace() }]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'stats' && (
        <FlatList
          data={gameStats}
          renderItem={renderGameStatItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[styles.listContainer, { paddingBottom: getBottomTabBarSpace() }]}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'achievements' && (
        <FlatList
          data={achievements}
          renderItem={renderAchievementItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[styles.listContainer, { paddingBottom: getBottomTabBarSpace() }]}
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryCardContainer: {
    width: '100%',
    padding: 20,
  },
  summaryCardContent: {
    width: '100%',
  },
  summaryUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  userTextInfo: {
    flex: 1,
  },
  summaryUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  summaryRank: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  summaryRankText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    flexShrink: 1,
  },
  summaryRankChange: {
    marginLeft: 5,
    width: 14,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    width: '100%',
    textAlign: 'center',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  summaryStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
  timeFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  timeFilter: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTimeFilter: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  timeFilterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeTimeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
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
  currentUserRankItem: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rankPosition: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
  },
  topRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRankText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  rankPositionText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
  },
  currentUserText: {
    fontWeight: 'bold',
  },
  userScore: {
    fontSize: 13,
  },
  rankChange: {
    width: 30,
    alignItems: 'center',
  },
  gameStatCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gameStatCardContainer: {
    flex: 1,
  },
  gameStatCardGradientStrip: {
    height: 10,
  },
  gameStatCardContent: {
    padding: 20,
  },
  gameStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  gameStatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  gameStatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameStatDetails: {
    width: '100%',
  },
  gameStatDetail: {
    marginBottom: 10,
  },
  gameStatLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  gameStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameStatProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  gameStatProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
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
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  incompleteAchievementIcon: {
    opacity: 0.7,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 3,
  },
  achievementDescription: {
    fontSize: 13,
    marginBottom: 8,
  },
  achievementProgress: {
    width: '100%',
  },
  achievementProgressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 5,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 12,
  },
  achievementCompleted: {
    marginLeft: 10,
  },
});

export default LeaderboardScreen; 