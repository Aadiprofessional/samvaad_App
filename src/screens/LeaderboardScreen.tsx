import React, { useState } from 'react';
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

const LeaderboardScreen = () => {
  const [activeTab, setActiveTab] = useState<TabsType>('ranking');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week');
  
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
          isCurrentUser && styles.currentUserRankItem
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
            <Text style={styles.rankPositionText}>{item.rank}</Text>
          )}
        </View>
        
        <Image source={item.avatar} style={styles.userAvatar} />
        
        <View style={styles.userInfo}>
          <Text style={[styles.userName, isCurrentUser && styles.currentUserText]}>
            {item.name} {isCurrentUser && '(You)'}
          </Text>
          <Text style={styles.userScore}>{item.score.toLocaleString()} pts</Text>
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
    <View style={styles.gameStatItem}>
      <LinearGradient
        colors={[item.color1, item.color2]}
        style={styles.gameStatHeader}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Icon name={item.icon} size={24} color="#FFFFFF" />
        <Text style={styles.gameStatName}>{item.name}</Text>
      </LinearGradient>
      
      <View style={styles.gameStatContent}>
        <View style={styles.gameStatRow}>
          <Text style={styles.gameStatLabel}>Current Score:</Text>
          <Text style={styles.gameStatValue}>{item.score}</Text>
        </View>
        
        <View style={styles.gameStatRow}>
          <Text style={styles.gameStatLabel}>High Score:</Text>
          <Text style={styles.gameStatValue}>{item.highScore}</Text>
        </View>
        
        <View style={styles.gameStatProgressContainer}>
          <View style={styles.gameStatProgressLabel}>
            <Text style={styles.gameStatProgressText}>Completion</Text>
            <Text style={styles.gameStatProgressPercent}>{item.completionRate}%</Text>
          </View>
          
          <View style={styles.gameStatProgressBar}>
            <View 
              style={[
                styles.gameStatProgressFill,
                { width: `${item.completionRate}%`,
                  backgroundColor: item.color1 }
              ]} 
            />
          </View>
        </View>
      </View>
    </View>
  );

  const renderAchievementItem = ({ item }: { item: AchievementType }) => (
    <View style={styles.achievementItem}>
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
        <Text style={styles.achievementTitle}>{item.title}</Text>
        <Text style={styles.achievementDescription}>{item.description}</Text>
        
        {!item.completed && (
          <View style={styles.achievementProgress}>
            <View style={styles.achievementProgressBar}>
              <View 
                style={[
                  styles.achievementProgressFill,
                  { width: `${item.progress}%`,
                    backgroundColor: item.color1 }
                ]} 
              />
            </View>
            <Text style={styles.achievementProgressText}>{item.progress}%</Text>
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
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.summaryCardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.summaryCardContent}>
          <View style={styles.summaryUserInfo}>
            <Image source={currentUser.avatar} style={styles.summaryAvatar} />
            <View>
              <Text style={styles.summaryUserName}>{currentUser.name}</Text>
              <View style={styles.summaryRank}>
                <Text style={styles.summaryRankText}>Rank #{currentUser.rank}</Text>
                <View style={styles.summaryRankChange}>
                  {currentUser.change === 'up' && (
                    <Icon name="arrow-up" size={14} color="#4CAF50" />
                  )}
                  {currentUser.change === 'down' && (
                    <Icon name="arrow-down" size={14} color="#F44336" />
                  )}
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>{currentUser.score.toLocaleString()}</Text>
              <Text style={styles.summaryStatLabel}>Points</Text>
            </View>
            
            <View style={styles.summaryStatDivider} />
            
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>
                {achievements.filter(a => a.completed).length}
              </Text>
              <Text style={styles.summaryStatLabel}>Achievements</Text>
            </View>
            
            <View style={styles.summaryStatDivider} />
            
            <View style={styles.summaryStat}>
              <Text style={styles.summaryStatValue}>
                {Math.round(gameStats.reduce((acc, game) => acc + game.completionRate, 0) / gameStats.length)}%
              </Text>
              <Text style={styles.summaryStatLabel}>Completion</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Leaderboard</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Icon name="filter-variant" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>

      {renderSummaryCard()}

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ranking' && styles.activeTab]}
          onPress={() => setActiveTab('ranking')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'ranking' && styles.activeTabText,
            ]}
          >
            Ranking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
          onPress={() => setActiveTab('stats')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'stats' && styles.activeTabText,
            ]}
          >
            Game Stats
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'achievements' && styles.activeTabText,
            ]}
          >
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'ranking' && (
        <View style={styles.timeFilterContainer}>
          <TouchableOpacity
            style={[styles.timeFilter, timeFilter === 'week' && styles.activeTimeFilter]}
            onPress={() => setTimeFilter('week')}
          >
            <Text
              style={[
                styles.timeFilterText,
                timeFilter === 'week' && styles.activeTimeFilterText,
              ]}
            >
              This Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timeFilter, timeFilter === 'month' && styles.activeTimeFilter]}
            onPress={() => setTimeFilter('month')}
          >
            <Text
              style={[
                styles.timeFilterText,
                timeFilter === 'month' && styles.activeTimeFilterText,
              ]}
            >
              This Month
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.timeFilter, timeFilter === 'all' && styles.activeTimeFilter]}
            onPress={() => setTimeFilter('all')}
          >
            <Text
              style={[
                styles.timeFilterText,
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
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'stats' && (
        <FlatList
          data={gameStats}
          renderItem={renderGameStatItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {activeTab === 'achievements' && (
        <FlatList
          data={achievements}
          renderItem={renderAchievementItem}
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
    backgroundColor: '#F8F9FA',
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
    color: '#333333',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
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
  summaryCardGradient: {
    padding: 15,
  },
  summaryCardContent: {
    width: '100%',
  },
  summaryUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
  },
  summaryRankText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 5,
  },
  summaryRankChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
  },
  summaryStat: {
    flex: 1,
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  summaryStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  summaryStatDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tab: {
    paddingVertical: 10,
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
  timeFilterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  timeFilter: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#EEEEEE',
  },
  activeTimeFilter: {
    backgroundColor: '#F0E6FF',
  },
  timeFilterText: {
    fontSize: 12,
    color: '#666666',
  },
  activeTimeFilterText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  currentUserRankItem: {
    backgroundColor: '#F0E6FF',
    borderWidth: 1,
    borderColor: '#6200EE',
  },
  rankPosition: {
    width: 30,
    alignItems: 'center',
  },
  rankPositionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666666',
  },
  topRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 2,
  },
  currentUserText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  userScore: {
    fontSize: 12,
    color: '#666666',
  },
  rankChange: {
    width: 24,
    alignItems: 'center',
  },
  gameStatItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  gameStatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  gameStatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  gameStatContent: {
    padding: 15,
  },
  gameStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gameStatLabel: {
    fontSize: 14,
    color: '#666666',
  },
  gameStatValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  gameStatProgressContainer: {
    marginTop: 5,
  },
  gameStatProgressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  gameStatProgressText: {
    fontSize: 12,
    color: '#666666',
  },
  gameStatProgressPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
  },
  gameStatProgressBar: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
  },
  gameStatProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
  },
  achievementProgress: {
    width: '100%',
  },
  achievementProgressBar: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    marginBottom: 5,
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  achievementProgressText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'right',
  },
  achievementCompleted: {
    marginLeft: 10,
  },
});

export default LeaderboardScreen; 