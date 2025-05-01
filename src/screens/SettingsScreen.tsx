import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import Card from '../components/Card';
import Button from '../components/Button';
import { scale, fontScale, moderateScale } from '../utils/responsive';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

interface SettingsScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

interface SettingItemProps {
  icon: string;
  title: string;
  description?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showBorder?: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [soundEffects, setSoundEffects] = React.useState(true);
  const [hapticFeedback, setHapticFeedback] = React.useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            navigation.navigate('Auth');
          },
        },
      ]
    );
  };
  
  const SettingItem: React.FC<SettingItemProps> = ({ 
    icon, 
    title, 
    description, 
    onPress, 
    rightElement,
    showBorder = true,
  }) => (
    <TouchableOpacity 
      style={[
        styles.settingItem, 
        showBorder && { 
          borderBottomWidth: 1, 
          borderBottomColor: theme.colors.border,
        }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[
        styles.settingIconContainer,
        { backgroundColor: `${theme.colors.primary}15` }
      ]}>
        <Icon name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.settingAction}>
        {rightElement || (
          <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Platform.OS === 'ios' ? scale(40) : scale(20) }
        ]}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Appearance
          </Text>
          <Card contentStyle={styles.themeCardContent}>
            <ThemeToggle variant="switch" showLabel={true} />
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            App Settings
          </Text>
          <Card>
            <SettingItem
              icon="bell-outline"
              title="Notifications"
              description="Receive app notifications"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ 
                    false: theme.colors.border, 
                    true: theme.colors.primary 
                  }}
                  thumbColor={Platform.OS === 'ios' ? undefined : "#FFFFFF"}
                  ios_backgroundColor={`${theme.colors.border}50`}
                />
              }
            />
            <SettingItem
              icon="volume-high"
              title="Sound Effects"
              description="Play sounds during games"
              rightElement={
                <Switch
                  value={soundEffects}
                  onValueChange={setSoundEffects}
                  trackColor={{ 
                    false: theme.colors.border, 
                    true: theme.colors.primary 
                  }}
                  thumbColor={Platform.OS === 'ios' ? undefined : "#FFFFFF"}
                  ios_backgroundColor={`${theme.colors.border}50`}
                />
              }
            />
            <SettingItem
              icon="vibrate"
              title="Haptic Feedback"
              description="Vibrate on interactions"
              rightElement={
                <Switch
                  value={hapticFeedback}
                  onValueChange={setHapticFeedback}
                  trackColor={{ 
                    false: theme.colors.border, 
                    true: theme.colors.primary 
                  }}
                  thumbColor={Platform.OS === 'ios' ? undefined : "#FFFFFF"}
                  ios_backgroundColor={`${theme.colors.border}50`}
                />
              }
              showBorder={false}
            />
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            Account
          </Text>
          <Card>
            <SettingItem
              icon="account-outline"
              title="Profile"
              description="Edit your profile information"
              onPress={() => navigation.navigate('Profile')}
            />
            <SettingItem
              icon="shield-account-outline"
              title="Privacy"
              description="Manage your privacy settings"
              onPress={() => {}}
            />
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              description="Get help or contact support"
              onPress={() => {}}
              showBorder={false}
            />
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
            About
          </Text>
          <Card>
            <SettingItem
              icon="information-outline"
              title="About Samvaad"
              description="Learn more about the app"
              onPress={() => {}}
            />
            <SettingItem
              icon="file-document-outline"
              title="Terms & Conditions"
              description="Read our terms and conditions"
              onPress={() => {}}
            />
            <SettingItem
              icon="shield-check-outline"
              title="Privacy Policy"
              description="Read our privacy policy"
              onPress={() => {}}
              showBorder={false}
            />
          </Card>
        </View>
        
        <View style={styles.section}>
          <Button
            title="Logout"
            variant="outline"
            leftIcon="logout"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
        
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(16),
    paddingHorizontal: scale(16),
  },
  backButton: {
    padding: scale(8),
    borderRadius: scale(20),
  },
  headerRight: {
    width: scale(40),
  },
  title: {
    fontSize: fontScale(20),
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(40),
  },
  section: {
    marginBottom: scale(24),
    paddingHorizontal: scale(16),
  },
  sectionTitle: {
    fontSize: fontScale(14),
    fontWeight: '600',
    marginBottom: scale(8),
    marginLeft: scale(4),
  },
  themeCardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(16),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
  },
  settingIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: fontScale(16),
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: fontScale(14),
    marginTop: scale(2),
  },
  settingAction: {
    width: scale(40),
    alignItems: 'flex-end',
  },
  logoutButton: {
    marginTop: scale(8),
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: scale(8),
    marginBottom: scale(16),
  },
  versionText: {
    fontSize: fontScale(12),
  },
});

export default SettingsScreen; 