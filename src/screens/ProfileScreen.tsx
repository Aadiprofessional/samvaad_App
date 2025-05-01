import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenProps } from '../types/navigation';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, route }: HomeScreenProps) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);

  // Sample user data (in a real app, this would come from a database or API)
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    level: 5,
    xp: 750,
    nextLevelXp: 1000,
    achievements: 12,
    totalCompletedLessons: 24,
    totalGamesPlayed: 45,
  };

  const toggleNotifications = () => setNotifications(!notifications);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleSoundEffects = () => setSoundEffects(!soundEffects);

  const handleLogout = () => {
    // Handle logout logic
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#6200EE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.editButton}>
          <Icon name="pencil" size={20} color="#6200EE" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={require('../assets/images/placeholder-avatar.png')}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>

          <View style={styles.levelContainer}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {userData.level}</Text>
              <Text style={styles.xpText}>
                {userData.xp}/{userData.nextLevelXp} XP
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(userData.xp / userData.nextLevelXp) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#FFF0F5' }]}>
                <Icon name="trophy" size={24} color="#F86CA7" />
              </View>
              <Text style={styles.statValue}>{userData.achievements}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#F0F8FF' }]}>
                <Icon name="book-open-variant" size={24} color="#2575fc" />
              </View>
              <Text style={styles.statValue}>{userData.totalCompletedLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIconContainer, { backgroundColor: '#F0FFF0' }]}>
                <Icon name="gamepad-variant" size={24} color="#38ef7d" />
              </View>
              <Text style={styles.statValue}>{userData.totalGamesPlayed}</Text>
              <Text style={styles.statLabel}>Games</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="bell-outline" size={24} color="#6200EE" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#CCCCCC', true: '#D7BEF8' }}
              thumbColor={notifications ? '#6200EE' : '#F4F3F4'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="theme-light-dark" size={24} color="#6200EE" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#CCCCCC', true: '#D7BEF8' }}
              thumbColor={darkMode ? '#6200EE' : '#F4F3F4'}
            />
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="volume-high" size={24} color="#6200EE" />
              <Text style={styles.settingText}>Sound Effects</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={toggleSoundEffects}
              trackColor={{ false: '#CCCCCC', true: '#D7BEF8' }}
              thumbColor={soundEffects ? '#6200EE' : '#F4F3F4'}
            />
          </View>
        </View>

        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemLeft}>
              <Icon name="shield-account" size={24} color="#6200EE" />
              <Text style={styles.accountItemText}>Privacy</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#CCCCCC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemLeft}>
              <Icon name="help-circle" size={24} color="#6200EE" />
              <Text style={styles.accountItemText}>Help & Support</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#CCCCCC" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountItemLeft}>
              <Icon name="information" size={24} color="#6200EE" />
              <Text style={styles.accountItemText}>About App</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#CCCCCC" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LinearGradient
            colors={['#FF6A88', '#FF99AC']}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Icon name="logout" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>Logout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  editButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  levelContainer: {
    width: '100%',
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  xpText: {
    fontSize: 14,
    color: '#666666',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6200EE',
    borderRadius: 4,
  },
  statsSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 60) / 3,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  settingsSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 15,
  },
  accountSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountItemText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 15,
  },
  logoutButton: {
    marginVertical: 30,
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ProfileScreen; 