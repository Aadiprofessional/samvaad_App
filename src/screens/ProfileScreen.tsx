import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Switch,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useIsFocused, CommonActions } from '@react-navigation/native';
import { HomeScreenProps } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { scale, verticalScale } from '../utils/responsive';
import EditProfileModal from '../components/profile/EditProfileModal';
import { getHiddenTabBarStyle, getVisibleTabBarStyle, manageTabBarVisibility } from '../utils/tabBarStyles';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelectionModal from '../components/profile/LanguageSelectionModal';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }: HomeScreenProps) => {
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  
  // Connect to the theme context
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { t } = useTranslation();
  const { language } = useLanguage();
  
  // Fix to hide bottom tab when viewing profile
  const isFocused = useIsFocused();
  const justFocused = useRef(false);
  
  // Force immediate refresh when returning to this screen
  useEffect(() => {
    if (isFocused && refreshProfile) {
      console.log('ProfileScreen focused, refreshing profile data');
      console.log('Current profile state before refresh:', profile);
      // Force refresh on focus
      refreshProfile()
        .then(() => {
          console.log('Profile refresh completed in ProfileScreen');
          console.log('Updated profile state after refresh:', profile);
        })
        .catch(error => {
          console.error('Error refreshing profile data:', error);
        });
    }
  }, [isFocused]);
  
  // Update userData whenever profile changes
  useEffect(() => {
    console.log('ProfileScreen profile effect triggered');
    console.log('Current profile state in effect:', profile);
    
    // Handle case where profile might be an array
    const profileData = Array.isArray(profile) ? profile[0] : profile;
    
    if (profileData) {
      console.log('Profile data updated in ProfileScreen:', {
        name: profileData.name, 
        profile_image_url: profileData.profile_image_url,
        id: profileData.id
      });
    } else {
      console.log('No profile data available in ProfileScreen');
    }
  }, [profile]);
  
  useLayoutEffect(() => {
    // Use the utility function for consistent tab bar handling
    return manageTabBarVisibility(navigation, isFocused, isDarkMode, true);
  }, [navigation, isFocused, isDarkMode]);
  
  // Create userData object with proper logging
  const userData = React.useMemo(() => {
    console.log('Building userData in ProfileScreen');
    console.log('Current profile for userData:', profile);
    
    // Handle case where profile might be an array
    const profileData = Array.isArray(profile) ? profile[0] : profile;
    
    if (!profileData) {
      console.log('No valid profile data available');
      return {
        name: user?.user_metadata?.name || 'User',
        email: user?.email || 'user@example.com',
        level: 5,
        xp: 750,
        nextLevelXp: 1000,
        achievements: 12,
        totalCompletedLessons: 24,
        totalGamesPlayed: 45,
        profileImage: null,
      };
    }
    
    const data = {
      name: profileData.name || user?.user_metadata?.name || 'User',
      email: profileData.email || user?.email || 'user@example.com',
      level: profileData.level || 5,
      xp: profileData.xp || 750,
      nextLevelXp: profileData.next_level_xp || 1000,
      achievements: profileData.achievements_count || 12,
      totalCompletedLessons: profileData.completed_lessons_count || 24,
      totalGamesPlayed: profileData.games_played_count || 45,
      profileImage: profileData.profile_image_url || null,
    };
    
    console.log('Built userData:', data);
    
    return data;
  }, [profile, user]);

  const toggleNotifications = () => setNotifications(!notifications);
  const toggleSoundEffects = () => setSoundEffects(!soundEffects);

  const handleLogout = async () => {
    Alert.alert(
      t('common.logout'),
      t('common.logoutConfirmation'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.logout'),
          onPress: async () => {
            try {
              const success = await signOut();
              if (success) {
                // Use CommonActions to reset navigation to Auth screen
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Auth' as any }],
                  })
                );
              }
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const navigateToChangePassword = () => {
    navigation.navigate('ChangePassword' as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{t('profile.myProfile')}</Text>
        <TouchableOpacity 
          style={[styles.editButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}
          onPress={() => setShowEditProfileModal(true)}
        >
          <Icon name="pencil" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileSection, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
          {userData.profileImage ? (
            <Image
              source={{ uri: userData.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.defaultProfileImage, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
              <Icon name="account" size={50} color={theme.colors.primary} />
            </View>
          )}
          <Text style={[styles.userName, { color: theme.colors.text }]}>{userData.name}</Text>
          <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>{userData.email}</Text>

          <View style={styles.levelContainer}>
            <View style={styles.levelInfo}>
              <Text style={[styles.levelText, { color: theme.colors.text }]}>{t('profile.level')} {userData.level}</Text>
              <Text style={[styles.xpText, { color: theme.colors.textSecondary }]}>
                {userData.xp}/{userData.nextLevelXp} {t('profile.xp')}
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
              <View
                style={[
                  styles.progressFill,
                  { 
                    width: `${(userData.xp / userData.nextLevelXp) * 100}%`,
                    backgroundColor: theme.colors.primary,
                  }
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('profile.settings')}</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, { backgroundColor: isDarkMode ? '#333333' : theme.colors.card }]}>
              <Icon name="trophy" size={24} color={theme.colors.primary} />
              <Text style={[styles.statCount, { color: theme.colors.text }]}>{userData.achievements}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('profile.achievements')}</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: isDarkMode ? '#333333' : theme.colors.card }]}>
              <Icon name="book-open-page-variant" size={24} color={theme.colors.primary} />
              <Text style={[styles.statCount, { color: theme.colors.text }]}>{userData.totalCompletedLessons}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('profile.completedLessons')}</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: isDarkMode ? '#333333' : theme.colors.card }]}>
              <Icon name="gamepad-variant" size={24} color={theme.colors.primary} />
              <Text style={[styles.statCount, { color: theme.colors.text }]}>{userData.totalGamesPlayed}</Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>{t('profile.gamesPlayed')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('profile.settings')}</Text>
          <View style={[styles.settingItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
            <View style={styles.settingLeft}>
              <Icon name="bell" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>{t('profile.notifications')}</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: isDarkMode ? '#555555' : '#CCCCCC', true: '#D7BEF8' }}
              thumbColor={notifications ? theme.colors.primary : isDarkMode ? '#888888' : '#F4F3F4'}
            />
          </View>
          <View style={[styles.settingItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
            <View style={styles.settingLeft}>
              <Icon name="theme-light-dark" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>{t('profile.darkMode')}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: isDarkMode ? '#555555' : '#CCCCCC', true: '#D7BEF8' }}
              thumbColor={isDarkMode ? theme.colors.primary : '#F4F3F4'}
            />
          </View>
          <View style={[styles.settingItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
            <View style={styles.settingLeft}>
              <Icon name="volume-high" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>{t('profile.soundEffects')}</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={toggleSoundEffects}
              trackColor={{ false: isDarkMode ? '#555555' : '#CCCCCC', true: '#D7BEF8' }}
              thumbColor={soundEffects ? theme.colors.primary : isDarkMode ? '#888888' : '#F4F3F4'}
            />
          </View>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingLeft}>
              <Icon name="translate" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>{t('language.changeLanguage')}</Text>
            </View>
            <View style={styles.languageIndicator}>
              <Text style={[styles.languageText, { color: theme.colors.textSecondary }]}>
                {language === 'en' ? t('language.english') : t('language.hindi')}
              </Text>
              <Icon name="chevron-right" size={20} color={isDarkMode ? '#888888' : '#CCCCCC'} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.accountSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('profile.settings')}</Text>
          <TouchableOpacity style={[styles.accountItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
            <View style={styles.accountItemLeft}>
              <Icon name="shield-account" size={24} color={theme.colors.primary} />
              <Text style={[styles.accountItemText, { color: theme.colors.text }]}>{t('profile.privacy')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={isDarkMode ? '#888888' : '#CCCCCC'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.accountItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}
            onPress={navigateToChangePassword}
          >
            <View style={styles.accountItemLeft}>
              <Icon name="lock-reset" size={24} color={theme.colors.primary} />
              <Text style={[styles.accountItemText, { color: theme.colors.text }]}>{t('profile.changePassword')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={isDarkMode ? '#888888' : '#CCCCCC'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.accountItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
            <View style={styles.accountItemLeft}>
              <Icon name="help-circle" size={24} color={theme.colors.primary} />
              <Text style={[styles.accountItemText, { color: theme.colors.text }]}>{t('profile.helpSupport')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={isDarkMode ? '#888888' : '#CCCCCC'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.accountItem, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
            <View style={styles.accountItemLeft}>
              <Icon name="information" size={24} color={theme.colors.primary} />
              <Text style={[styles.accountItemText, { color: theme.colors.text }]}>{t('profile.aboutApp')}</Text>
            </View>
            <Icon name="chevron-right" size={20} color={isDarkMode ? '#888888' : '#CCCCCC'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.logoutButton, 
            { backgroundColor: isDarkMode ? '#FF6A88' : '#FF6A88' }
          ]} 
          onPress={handleLogout}
        >
          <View style={styles.logoutContent}>
            <Icon name="logout" size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>{t('common.logout')}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Profile Edit Modal */}
      <EditProfileModal 
        visible={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
      />
      
      {/* Language Selection Modal */}
      <LanguageSelectionModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 20,
  },
  levelContainer: {
    width: '100%',
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  xpText: {
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
  },
  accountSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  accountItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountItemText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 25,
    overflow: 'hidden',
    paddingVertical: 12,
  },
  logoutContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  languageIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    marginRight: 5,
    fontSize: 14,
  },
});

export default ProfileScreen; 