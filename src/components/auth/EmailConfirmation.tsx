import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { manuallyConfirmUserEmail } from '../../services/authService';

interface EmailConfirmationProps {
  userId: string;
  email: string;
  onConfirmed: () => void;
  onTimeout: () => void;
  onResendEmail?: () => void;
}

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({
  userId,
  email,
  onConfirmed,
  onTimeout,
  onResendEmail,
}) => {
  const { theme } = useTheme();
  const { checkEmailConfirmationStatus } = useAuth();
  
  // 10 minutes in seconds (as requested)
  const CONFIRMATION_TIMEOUT = 10 * 60; 
  
  const [timeLeft, setTimeLeft] = useState<number>(CONFIRMATION_TIMEOUT);
  const [checking, setChecking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [checkCount, setCheckCount] = useState<number>(0);
  const [isManuallyConfirming, setIsManuallyConfirming] = useState<boolean>(false);
  const lastActionTimeRef = useRef<number>(0);

  // Format time as minutes:seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Check confirmation status periodically
  useEffect(() => {
    if (!userId) return;
    
    console.log("Starting email confirmation check for user:", userId);
    
    const checkConfirmation = async () => {
      // Increase check count
      setCheckCount(prev => prev + 1);
      
      try {
        setChecking(true);
        setError(null);
        
        console.log(`Checking confirmation status (attempt ${checkCount + 1})...`);
        const status = await checkEmailConfirmationStatus(userId);
        console.log("Confirmation status:", status);
        
        if (status.confirmed) {
          console.log("Email confirmed successfully");
          onConfirmed();
          return;
        } else if (status.expired) {
          console.log("Confirmation expired");
          onTimeout();
          return;
        } else if (status.minutesLeft !== undefined) {
          // Update timer based on server response if available
          setTimeLeft(status.minutesLeft * 60);
        }
      } catch (err: any) {
        console.error("Error checking confirmation status:", err);
        setError(`Failed to check status: ${err.message || 'Unknown error'}`);
      } finally {
        setChecking(false);
      }
    };

    // Initial check
    checkConfirmation();

    // Check every 15 seconds
    const interval = setInterval(checkConfirmation, 15000);
    
    // Countdown timer (separate from server checks)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          console.log("Timer expired, triggering timeout");
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      console.log("Cleaning up email confirmation timers");
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [userId, checkEmailConfirmationStatus, onConfirmed, onTimeout]);

  // Handle manual refresh with debounce
  const handleRefresh = async () => {
    // Debounce: prevent multiple rapid clicks
    const now = Date.now();
    if (now - lastActionTimeRef.current < 2000) {
      console.log("Action debounced - preventing duplicate request");
      return;
    }
    
    if (checking || isManuallyConfirming) return;
    
    lastActionTimeRef.current = now;
    
    try {
      setChecking(true);
      setError(null);
      
      console.log("Manual confirmation check requested");
      const status = await checkEmailConfirmationStatus(userId);
      
      if (status.confirmed) {
        console.log("Email confirmed on manual check");
        onConfirmed();
        return; // Exit early if confirmed
      } else if (status.expired) {
        console.log("Confirmation expired on manual check");
        onTimeout();
        return; // Exit early if expired
      } else {
        // Ask user if they've clicked the confirmation link, but only if we're not in the middle of another confirmation
        if (!isManuallyConfirming) {
          Alert.alert(
            'Email Confirmation',
            'Have you clicked the confirmation link in the email?',
            [
              { 
                text: 'No, Not Yet', 
                style: 'cancel'
              },
              {
                text: 'Yes, I Clicked It',
                onPress: async () => {
                  if (isManuallyConfirming) return; // Prevent duplicate confirmations
                  
                  try {
                    // Try to manually confirm the user
                    console.log("Attempting manual confirmation for user", userId);
                    setIsManuallyConfirming(true);
                    setChecking(true);
                    
                    const result = await manuallyConfirmUserEmail(userId);
                    if (result.success) {
                      console.log("Manual confirmation successful");
                      // Don't show success alert, just redirect
                      onConfirmed();
                    }
                  } catch (error: any) {
                    console.error("Error in manual confirmation:", error);
                    Alert.alert(
                      'Confirmation Failed',
                      error.message || 'An error occurred while confirming your email.'
                    );
                  } finally {
                    setIsManuallyConfirming(false);
                    setChecking(false);
                  }
                }
              }
            ]
          );
        }
      }
    } catch (err: any) {
      console.error("Error on manual confirmation check:", err);
      setError(`Check failed: ${err.message || 'Unknown error'}`);
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="email-check-outline" size={80} color={theme.primary} style={styles.icon} />
      
      <Text style={[styles.title, { color: theme.text }]}>Verify Your Email</Text>
      
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Icon name="check-circle" size={20} color={theme.success} />
          <Text style={[styles.statusText, { color: theme.success }]}>Account created</Text>
        </View>
        
        <View style={styles.statusDivider} />
        
        <View style={styles.statusItem}>
          <Icon name="clock-outline" size={20} color={theme.warning} />
          <Text style={[styles.statusText, { color: theme.warning }]}>Email verification pending</Text>
        </View>
        
        <View style={styles.statusDivider} />
        
        <View style={styles.statusItem}>
          <Icon name="account-check-outline" size={20} color={theme.textSecondary} />
          <Text style={[styles.statusText, { color: theme.textSecondary }]}>Account activation</Text>
        </View>
      </View>
      
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        We've sent a confirmation email to:
      </Text>
      
      <Text style={[styles.email, { color: theme.primary }]}>{email}</Text>
      
      <Text style={[styles.instruction, { color: theme.text }]}>
        Please click the confirmation link in the email to verify your account and complete the registration.
      </Text>
      
      <View style={styles.timerContainer}>
        <Icon name="clock-outline" size={20} color={theme.warning} style={styles.timerIcon} />
        <Text style={[styles.timerText, { color: theme.warning }]}>
          Time remaining: {formatTime(timeLeft)}
        </Text>
      </View>
      
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Important: Your account will only be fully activated after email confirmation.
        If not confirmed within 10 minutes, your signup data will be deleted and you'll need to register again.
      </Text>
      
      {error && (
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      )}
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.refreshButton, { borderColor: theme.primary }]} 
          onPress={handleRefresh}
          disabled={checking}
        >
          {checking ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Text style={[styles.refreshButtonText, { color: theme.primary }]}>
              I've Confirmed My Email
            </Text>
          )}
        </TouchableOpacity>
        
        {onResendEmail && (
          <TouchableOpacity style={styles.resendButton} onPress={onResendEmail} disabled={checking}>
            <LinearGradient
              colors={theme.gradientPrimary}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.resendButtonText}>Resend Email</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.helpLink} 
        onPress={() => Alert.alert(
          'Need Help?',
          'Check your spam/junk folder if you don\'t see the email. Make sure your email address is correct. Try clicking the "Resend Email" button if needed.',
          [{ text: 'OK' }]
        )}
      >
        <Text style={[styles.helpLinkText, { color: theme.primary }]}>
          Not receiving the email? Get help
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  statusItem: {
    alignItems: 'center',
    width: '30%',
  },
  statusDivider: {
    height: 1,
    backgroundColor: '#ccc',
    width: '5%',
  },
  statusText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  timerIcon: {
    marginRight: 10,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    borderWidth: 1,
  },
  refreshButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  helpLink: {
    marginTop: 10,
    padding: 10,
  },
  helpLinkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default EmailConfirmation; 