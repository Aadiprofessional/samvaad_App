import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole, UserSignupData } from '../services/authService';
import { testSupabaseConnection } from '../services/supabaseClient';
import NetworkStatusBar from '../components/NetworkStatusBar';
import NetInfo from '@react-native-community/netinfo';

// Import user type form components
import DeafUserForm from '../components/auth/DeafUserForm';
import ParentUserForm from '../components/auth/ParentUserForm';
import TeacherUserForm from '../components/auth/TeacherUserForm';
import EmailConfirmation from '../components/auth/EmailConfirmation';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { signUp, signIn, resendConfirmationEmail } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // State for auth UI
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  
  // Basic auth fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // User type selection
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null);
  
  // Role-specific data
  const [deafUserData, setDeafUserData] = useState<Partial<UserSignupData>>({});
  const [parentUserData, setParentUserData] = useState<Partial<UserSignupData>>({});
  const [teacherUserData, setTeacherUserData] = useState<Partial<UserSignupData>>({});
  
  // Email confirmation
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  // New state to track form validity
  const [isSignupFormValid, setIsSignupFormValid] = useState(false);

  // State to track Supabase connection
  const [supabaseConnectionTested, setSupabaseConnectionTested] = useState(false);
  const [supabaseConnectionError, setSupabaseConnectionError] = useState<string | null>(null);

  // Validate signup form whenever relevant fields change
  useEffect(() => {
    if (activeTab === 'signup') {
      const baseFieldsValid = email && password && name && selectedUserRole;
      let roleFieldsValid = false;
      
      // Check role-specific required fields
      switch (selectedUserRole) {
        case 'deaf':
          roleFieldsValid = !!deafUserData.proficiency;
          break;
        case 'parent':
          roleFieldsValid = !!parentUserData.relationship;
          break;
        case 'teacher':
          roleFieldsValid = !!teacherUserData.subjects && teacherUserData.subjects.length > 0;
          break;
        default:
          roleFieldsValid = false;
      }
      
      setIsSignupFormValid(!!baseFieldsValid && !!roleFieldsValid);
    }
  }, [activeTab, email, password, name, selectedUserRole, deafUserData, parentUserData, teacherUserData]);

  // Test Supabase connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true);
        const result = await testSupabaseConnection();
        
        if (!result.success) {
          setSupabaseConnectionError(result.error || 'Unknown connection error');
        } else {
          setSupabaseConnectionError(null);
        }
        
        setSupabaseConnectionTested(true);
      } catch (err) {
        setSupabaseConnectionError('Failed to connect to the server');
        setSupabaseConnectionTested(true);
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn(email, password);
      
      if (result && result.user) {
        navigation.replace('Main');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.message?.includes('Invalid') || err.message?.includes('password') || err.message?.includes('email')) {
        setError('Invalid email or password. Please try again.');
      } else if (err.message?.includes('network') || err.message?.includes('failed') || err.message?.includes('connect')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(err.message || 'Failed to login. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isSignupFormValid) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Validate email format
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`Starting signup process for ${email} as ${selectedUserRole}`);
      
      // Prepare signup data based on selected role
      const userData: UserSignupData = {
        email,
        password,
        name,
        role: selectedUserRole!,
      };
      
      // Add role-specific data
      switch (selectedUserRole) {
        case 'deaf':
          Object.assign(userData, deafUserData);
          break;
        case 'parent':
          Object.assign(userData, parentUserData);
          break;
        case 'teacher':
          Object.assign(userData, teacherUserData);
          break;
      }
      
      // Simple signup call
      const result = await signUp(userData);
      console.log('SignUp API response:', result);
      
      // Store user ID for confirmation check
      if (result && result.user) {
        setPendingUserId(result.user.id);
        setShowEmailConfirmation(true);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      
      // Handle common error cases
      if (err.message?.includes('already registered')) {
        setError('This email is already registered. Please try logging in instead.');
      } else if (err.message?.includes('network') || err.message?.includes('failed') || err.message?.includes('connect')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Failed to sign up. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };
  
  const handleEmailConfirmed = () => {
    console.log("Email confirmed, transitioning to login screen");
    Alert.alert(
      'Account Confirmed!',
      'Your account has been successfully confirmed. You can now log in.',
      [
        { 
          text: 'Login Now', 
          onPress: () => {
            setShowEmailConfirmation(false);
            setActiveTab('login');
            setPendingUserId(null);
            // Pre-fill the email field for login convenience
            // Password will need to be entered again for security
          } 
        }
      ]
    );
  };
  
  const handleConfirmationTimeout = () => {
    console.log("Email confirmation timed out");
    Alert.alert(
      'Confirmation Expired',
      'Your email confirmation has expired. Please sign up again.',
      [
        { 
          text: 'OK', 
          onPress: () => {
            setShowEmailConfirmation(false);
            setActiveTab('signup');
            setPendingUserId(null);
            resetForm();
          } 
        }
      ]
    );
  };
  
  const handleResendEmail = async () => {
    if (!email) {
      Alert.alert('Error', 'Email address is missing');
      return;
    }
    
    try {
      setIsLoading(true);
      console.log("Attempting to resend confirmation email to:", email);
      await resendConfirmationEmail(email);
      
      Alert.alert(
        'Email Resent',
        'A new confirmation email has been sent to your address.',
        [{ text: 'OK' }]
      );
    } catch (err: any) {
      console.error("Error resending email:", err);
      Alert.alert(
        'Error',
        err.message || 'Failed to resend confirmation email',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setSelectedUserRole(null);
    setDeafUserData({});
    setParentUserData({});
    setTeacherUserData({});
    setError(null);
  };

  const getMissingFieldsMessage = () => {
    if (isSignupFormValid) return null;
    
    const missing = [];
    
    if (!email) missing.push('email');
    if (!password) missing.push('password');
    if (!name) missing.push('name');
    if (!selectedUserRole) missing.push('user type');
    
    if (selectedUserRole) {
      switch (selectedUserRole) {
        case 'deaf':
          if (!deafUserData.proficiency) missing.push('proficiency level');
          break;
        case 'parent':
          if (!parentUserData.relationship) missing.push('relationship to child');
          break;
        case 'teacher':
          if (!teacherUserData.subjects || teacherUserData.subjects.length === 0) missing.push('subjects');
          break;
      }
    }
    
    if (missing.length === 0) return null;
    
    return `Required: ${missing.join(', ')}`;
  };

  const renderLoginTab = () => (
    <View style={styles.formContainer}>
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="email-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Email"
          placeholderTextColor={theme.inputPlaceholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="lock-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Password"
          placeholderTextColor={theme.inputPlaceholder}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
          <Icon
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton} disabled={isLoading}>
        <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>Forgot Password?</Text>
      </TouchableOpacity>

      {error && (
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      )}

      <TouchableOpacity style={styles.authButton} onPress={handleLogin} disabled={isLoading}>
        <LinearGradient
          colors={theme.gradientPrimary}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.authButtonText}>Login</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderUserTypeSelection = () => (
    <View style={styles.userTypeContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>I am a...</Text>
      
      <View style={styles.userTypeButtonsContainer}>
        <TouchableOpacity
          style={[
            styles.userTypeButton,
            selectedUserRole === 'deaf' && { backgroundColor: theme.primary + '20' },
            { borderColor: theme.border }
          ]}
          onPress={() => setSelectedUserRole('deaf')}
          disabled={isLoading}
        >
          <Icon 
            name="ear-hearing-off" 
            size={32} 
            color={selectedUserRole === 'deaf' ? theme.primary : theme.textSecondary} 
          />
          <Text style={[
            styles.userTypeText,
            { color: selectedUserRole === 'deaf' ? theme.primary : theme.text }
          ]}>
            Deaf/Mute User
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.userTypeButton,
            selectedUserRole === 'parent' && { backgroundColor: theme.primary + '20' },
            { borderColor: theme.border }
          ]}
          onPress={() => setSelectedUserRole('parent')}
          disabled={isLoading}
        >
          <Icon 
            name="account-child" 
            size={32}
            color={selectedUserRole === 'parent' ? theme.primary : theme.textSecondary} 
          />
          <Text style={[
            styles.userTypeText,
            { color: selectedUserRole === 'parent' ? theme.primary : theme.text }
          ]}>
            Parent/Guardian
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.userTypeButton,
            selectedUserRole === 'teacher' && { backgroundColor: theme.primary + '20' },
            { borderColor: theme.border }
          ]}
          onPress={() => setSelectedUserRole('teacher')}
          disabled={isLoading}
        >
          <Icon 
            name="account-tie" 
            size={32} 
            color={selectedUserRole === 'teacher' ? theme.primary : theme.textSecondary} 
          />
          <Text style={[
            styles.userTypeText,
            { color: selectedUserRole === 'teacher' ? theme.primary : theme.text }
          ]}>
            Teacher
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRoleSpecificForm = () => {
    if (!selectedUserRole) return null;
    
    switch (selectedUserRole) {
      case 'deaf':
        return <DeafUserForm onDataChange={setDeafUserData} />;
      case 'parent':
        return <ParentUserForm onDataChange={setParentUserData} />;
      case 'teacher':
        return <TeacherUserForm onDataChange={setTeacherUserData} />;
      default:
        return null;
    }
  };

  const renderSignupTab = () => (
    <View style={styles.formContainer}>
      {/* Basic Info */}
      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="account-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Full Name"
          placeholderTextColor={theme.inputPlaceholder}
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="email-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Email"
          placeholderTextColor={theme.inputPlaceholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground }]}>
        <Icon name="lock-outline" size={20} color={theme.primary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: theme.inputText }]}
          placeholder="Password"
          placeholderTextColor={theme.inputPlaceholder}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          editable={!isLoading}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
          <Icon
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>
      
      {/* User Type Selection */}
      {renderUserTypeSelection()}
      
      {/* Role-specific Form */}
      {renderRoleSpecificForm()}
      
      {/* Missing fields message */}
      {!isSignupFormValid && !isLoading && (
        <Text style={[styles.missingFieldsText, { color: theme.warning }]}>
          {getMissingFieldsMessage()}
        </Text>
      )}
      
      {error && (
        <Text style={[styles.errorText, { color: theme.error }]}>
          {error}
        </Text>
      )}
      
      <TouchableOpacity 
        style={[
          styles.authButton, 
          !isSignupFormValid && styles.disabledButton
        ]} 
        onPress={handleSignup} 
        disabled={isLoading || !isSignupFormValid}
      >
        <LinearGradient
          colors={isSignupFormValid ? theme.gradientPrimary : [theme.disabledBackground, theme.disabledBackground]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={[styles.authButtonText, styles.loadingText]}>Creating Account...</Text>
            </View>
          ) : (
            <Text style={[
              styles.authButtonText,
              !isSignupFormValid && styles.disabledButtonText
            ]}>
              Sign Up
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // Show email confirmation screen if needed
  if (showEmailConfirmation && pendingUserId) {
    console.log("Showing email confirmation screen for user:", pendingUserId);
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <EmailConfirmation
          userId={pendingUserId}
          email={email}
          onConfirmed={handleEmailConfirmed}
          onTimeout={handleConfirmationTimeout}
          onResendEmail={handleResendEmail}
        />
      </SafeAreaView>
    );
  }

  // Show connection error banner if needed
  const renderConnectionError = () => {
    if (!supabaseConnectionTested || !supabaseConnectionError) return null;
    
    return (
      <View style={styles.connectionErrorContainer}>
        <Icon name="wifi-off" size={20} color="#fff" />
        <Text style={styles.connectionErrorText}>
          {supabaseConnectionError.includes('network') || supabaseConnectionError.includes('internet')
            ? 'Cannot connect to server. Please check your internet connection.'
            : supabaseConnectionError}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetryConnection}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Retry connection function
  const handleRetryConnection = async () => {
    try {
      setIsLoading(true);
      setSupabaseConnectionError(null);
      
      const result = await testSupabaseConnection();
      if (!result.success) {
        setSupabaseConnectionError(result.error || 'Unknown connection error');
      } else {
        setSupabaseConnectionError(null);
      }
      
      setSupabaseConnectionTested(true);
    } catch (err) {
      setSupabaseConnectionError('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Network Status Bar */}
      <NetworkStatusBar onRetry={handleRetryConnection} />
      
      {/* Theme Toggle Button - Top Right */}
      <TouchableOpacity 
        style={[
          styles.themeToggle, 
          styles.themeToggleTopRight,
          { 
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
          }
        ]} 
        onPress={toggleTheme}
      >
        <Icon 
          name={isDarkMode ? "white-balance-sunny" : "moon-waning-crescent"} 
          size={20} 
          color={theme.primary}
        />
      </TouchableOpacity>

      {renderConnectionError()}

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* App Logo and Title */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
            <Text style={[styles.appTitle, { color: theme.text }]}>Samvaad</Text>
            <Text style={[styles.appSubtitle, { color: theme.textSecondary }]}>
              Bridging communication gaps
            </Text>
          </View>
          
          {/* Auth Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'login' && styles.activeTab,
                { borderBottomColor: activeTab === 'login' ? theme.primary : 'transparent' }
              ]}
              onPress={() => {
                setActiveTab('login');
                resetForm();
              }}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'login' ? theme.primary : theme.textSecondary }
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'signup' && styles.activeTab,
                { borderBottomColor: activeTab === 'signup' ? theme.primary : 'transparent' }
              ]}
              onPress={() => {
                setActiveTab('signup');
                resetForm();
              }}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'signup' ? theme.primary : theme.textSecondary }
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Form Body */}
          <View style={styles.formContent}>
            {activeTab === 'login' ? renderLoginTab() : renderSignupTab()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        visible={showForgotPasswordModal} 
        onClose={() => setShowForgotPasswordModal(false)} 
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
  },
  appSubtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formContent: {
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  authButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gradient: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  errorText: {
    marginBottom: 15,
    fontSize: 14,
  },
  userTypeContainer: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  userTypeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userTypeButton: {
    width: '31%',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  userTypeText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 15,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  themeToggleTopRight: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 100,
    marginTop: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 0,
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledButtonText: {
    color: '#AAAAAA',
  },
  missingFieldsText: {
    fontSize: 14,
    marginBottom: 10,
    marginTop: 5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
  },
  connectionErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  connectionErrorText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AuthScreen; 