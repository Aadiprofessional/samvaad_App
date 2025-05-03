import React, { useState } from 'react';
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

// Import user type form components
import DeafUserForm from '../components/auth/DeafUserForm';
import ParentUserForm from '../components/auth/ParentUserForm';
import TeacherUserForm from '../components/auth/TeacherUserForm';
import EmailConfirmation from '../components/auth/EmailConfirmation';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const { theme } = useTheme();
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

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await signIn(email, password);
      navigation.replace('Main');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!selectedUserRole) {
      setError('Please select your user type');
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
      
      // Prepare signup data based on selected role
      const userData: UserSignupData = {
        email,
        password,
        name,
        role: selectedUserRole,
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
      
      // Sign up user
      const result = await signUp(userData);
      
      // Store user ID for confirmation check
      if (result && result.user) {
        setPendingUserId(result.user.id);
        setShowEmailConfirmation(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
  };
  
  const handleEmailConfirmed = () => {
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
          } 
        }
      ]
    );
  };
  
  const handleConfirmationTimeout = () => {
    Alert.alert(
      'Confirmation Expired',
      'Your email confirmation has expired. Please sign up again.',
      [
        { 
          text: 'OK', 
          onPress: () => {
            setShowEmailConfirmation(false);
            setPendingUserId(null);
          } 
        }
      ]
    );
  };
  
  const handleResendEmail = async () => {
    try {
      if (!email) return;
      
      setIsLoading(true);
      await resendConfirmationEmail(email);
      
      Alert.alert(
        'Email Resent',
        'A new confirmation email has been sent to your address.',
        [{ text: 'OK' }]
      );
    } catch (err: any) {
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
      
      {error && (
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      )}
      
      <TouchableOpacity style={styles.authButton} onPress={handleSignup} disabled={isLoading}>
        <LinearGradient
          colors={theme.gradientPrimary}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.authButtonText}>Sign Up</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // Show email confirmation screen if needed
  if (showEmailConfirmation) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <EmailConfirmation
          userId={pendingUserId || ''}
          email={email}
          onConfirmed={handleEmailConfirmed}
          onTimeout={handleConfirmationTimeout}
          onResendEmail={handleResendEmail}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
          <View style={[
            styles.tabContainer,
            {backgroundColor: theme.cardBackground || 'rgba(240, 240, 255, 0.2)'}
          ]}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'login' && styles.activeTab,
                { 
                  borderBottomColor: activeTab === 'login' ? theme.primary : 'transparent',
                  backgroundColor: activeTab === 'login' ? 'rgba(80, 50, 250, 0.1)' : 'transparent'
                }
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
                  { color: activeTab === 'login' ? theme.primary : theme.textSecondary },
                  activeTab === 'login' && styles.activeTabText
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'signup' && styles.activeTab,
                { 
                  borderBottomColor: activeTab === 'signup' ? theme.primary : 'transparent',
                  backgroundColor: activeTab === 'signup' ? 'rgba(80, 50, 250, 0.1)' : 'transparent'
                }
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
                  { color: activeTab === 'signup' ? theme.primary : theme.textSecondary },
                  activeTab === 'signup' && styles.activeTabText
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Form Body */}
          <View style={[
            styles.formContent,
            {
              backgroundColor: theme.cardBackground || 'rgba(255, 255, 255, 0.1)',
              borderRadius: 15,
              padding: 20,
              paddingBottom: 30,
              marginHorizontal: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 2
            }
          ]}>
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    marginHorizontal: 5,
  },
  activeTab: {
    borderBottomWidth: 3,
    backgroundColor: 'rgba(80, 50, 250, 0.15)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 18,
    fontWeight: '600',
  },
  activeTabText: {
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContent: {
    paddingBottom: 20,
  },
  formContainer: {
    width: '100%',
    paddingBottom: 10,
    marginBottom: 10,
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
});

export default AuthScreen; 