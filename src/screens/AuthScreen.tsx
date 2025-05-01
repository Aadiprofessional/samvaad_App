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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogin = () => {
    // In a real app, call an API to authenticate user
    console.log('Login with:', { email, password });
    
    // Navigate to main app after successful login
    navigation.replace('Main');
  };

  const handleSignup = () => {
    // In a real app, call an API to create a new user
    console.log('Sign up with:', { name, email, password });
    
    // Navigate to main app after successful signup
    navigation.replace('Main');
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password');
  };

  const renderLoginTab = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color="#6200EE" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color="#6200EE" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#6200EE"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.authButtonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderSignupTab = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Icon name="account-outline" size={20} color="#6200EE" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color="#6200EE" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color="#6200EE" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#6200EE"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.termsContainer}>
        <Icon name="checkbox-marked" size={20} color="#6200EE" />
        <Text style={styles.termsText}>
          I agree to the <Text style={styles.termsHighlight}>Terms of Service</Text> and{' '}
          <Text style={styles.termsHighlight}>Privacy Policy</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.authButton} onPress={handleSignup}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.authButtonText}>Sign Up</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <Text style={styles.headerTitle}>Samvaad</Text>
            <Text style={styles.headerSubtitle}>
              Education for all, barriers for none
            </Text>
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
              onPress={() => setActiveTab('login')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'login' && styles.activeTabText,
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
              onPress={() => setActiveTab('signup')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'signup' && styles.activeTabText,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'login' ? renderLoginTab() : renderSignupTab()}

          <View style={styles.socialAuthContainer}>
            <Text style={styles.socialAuthText}>Or continue with</Text>
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Icon name="google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Icon name="facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Icon name="apple" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: '#EEEEEE',
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888888',
  },
  activeTabText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    paddingVertical: 12,
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#6200EE',
    fontWeight: '500',
  },
  authButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
    flex: 1,
  },
  termsHighlight: {
    color: '#6200EE',
    fontWeight: '500',
  },
  socialAuthContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  socialAuthText: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 15,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default AuthScreen; 