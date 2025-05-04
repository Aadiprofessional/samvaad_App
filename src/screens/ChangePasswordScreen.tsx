import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { scale, verticalScale } from '../utils/responsive';

interface ChangePasswordScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { updatePassword } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Password visibility toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    // Reset error state
    setError(null);
    
    // Form validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await updatePassword(newPassword);
      setSuccess(true);
      
      // Show success message and navigate back after delay
      setTimeout(() => {
        Alert.alert(
          'Success',
          'Your password has been updated successfully',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
      console.error('Password update error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={[styles.backButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Change Password</Text>
        <View style={styles.placeholder} />
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Create a new password for your account. Your new password must be at least 8 characters long.
            </Text>
            
            {/* Current Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Current Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#333333' : '#F5F5F5' }]}>
                <Icon name="lock-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Enter current password"
                  placeholderTextColor={isDarkMode ? '#999' : '#999'}
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  editable={!isSubmitting}
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Icon name={showCurrentPassword ? "eye-off" : "eye"} size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* New Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>New Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#333333' : '#F5F5F5' }]}>
                <Icon name="lock-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Enter new password"
                  placeholderTextColor={isDarkMode ? '#999' : '#999'}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  editable={!isSubmitting}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Icon name={showNewPassword ? "eye-off" : "eye"} size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Confirm New Password */}
            <View style={styles.inputWrapper}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Confirm New Password</Text>
              <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#333333' : '#F5F5F5' }]}>
                <Icon name="lock-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: theme.colors.text }]}
                  placeholder="Confirm new password"
                  placeholderTextColor={isDarkMode ? '#999' : '#999'}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!isSubmitting}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.colors.primary, opacity: isSubmitting ? 0.7 : 1 }]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>
            
            {success && (
              <View style={styles.successContainer}>
                <Icon name="check-circle-outline" size={40} color="#4CAF50" />
                <Text style={styles.successText}>Password updated successfully!</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
  },
  placeholder: {
    width: scale(40),
  },
  keyboardAvoid: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    padding: scale(20),
  },
  formContainer: {
    width: '100%',
  },
  subtitle: {
    fontSize: scale(14),
    marginBottom: scale(24),
    lineHeight: scale(20),
  },
  inputWrapper: {
    marginBottom: scale(20),
  },
  inputLabel: {
    fontSize: scale(14),
    fontWeight: '500',
    marginBottom: scale(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: scale(10),
    paddingHorizontal: scale(15),
    paddingVertical: scale(4),
    width: '100%',
  },
  inputIcon: {
    marginRight: scale(10),
  },
  input: {
    flex: 1,
    paddingVertical: scale(12),
    fontSize: scale(16),
  },
  errorText: {
    color: '#FF3B30',
    fontSize: scale(14),
    marginTop: scale(8),
    marginBottom: scale(16),
    textAlign: 'center',
  },
  submitButton: {
    height: scale(50),
    borderRadius: scale(25),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: scale(10),
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: scale(16),
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: scale(24),
  },
  successText: {
    color: '#4CAF50',
    fontSize: scale(16),
    fontWeight: '500',
    marginTop: scale(8),
  },
});

export default ChangePasswordScreen; 