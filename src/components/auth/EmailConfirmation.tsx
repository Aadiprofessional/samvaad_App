import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

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
  
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60); // 10 minutes in seconds
  const [checking, setChecking] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Format time as minutes:seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Check confirmation status periodically
  useEffect(() => {
    const checkConfirmation = async () => {
      try {
        setChecking(true);
        setError(null);
        
        const status = await checkEmailConfirmationStatus(userId);
        
        if (status.confirmed) {
          // Email confirmed
          onConfirmed();
          return;
        } else if (status.expired) {
          // Confirmation period expired
          onTimeout();
          return;
        } else if (status.minutesLeft !== undefined) {
          // Update timer
          setTimeLeft(status.minutesLeft * 60);
        }
      } catch (err) {
        setError('Failed to check confirmation status');
        console.error(err);
      } finally {
        setChecking(false);
      }
    };

    // Initial check
    checkConfirmation();

    // Check every 30 seconds
    const interval = setInterval(checkConfirmation, 30000);
    
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, [userId, checkEmailConfirmationStatus, onConfirmed, onTimeout]);

  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      setChecking(true);
      setError(null);
      
      const status = await checkEmailConfirmationStatus(userId);
      
      if (status.confirmed) {
        onConfirmed();
      } else if (status.expired) {
        onTimeout();
      }
    } catch (err) {
      setError('Failed to check confirmation status');
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <Icon name="email-check-outline" size={80} color={theme.primary} style={styles.icon} />
      
      <Text style={[styles.title, { color: theme.text }]}>Check Your Email</Text>
      
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        We've sent a confirmation email to:
      </Text>
      
      <Text style={[styles.email, { color: theme.primary }]}>{email}</Text>
      
      <Text style={[styles.instruction, { color: theme.text }]}>
        Please click the confirmation link in the email to verify your account.
      </Text>
      
      <View style={styles.timerContainer}>
        <Icon name="clock-outline" size={20} color={theme.warning} style={styles.timerIcon} />
        <Text style={[styles.timerText, { color: theme.warning }]}>
          Time remaining: {formatTime(timeLeft)}
        </Text>
      </View>
      
      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Your account will be created only after email confirmation.
        If not confirmed within 10 minutes, you'll need to sign up again.
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
              Check Confirmation Status
            </Text>
          )}
        </TouchableOpacity>
        
        {onResendEmail && (
          <TouchableOpacity style={styles.resendButton} onPress={onResendEmail}>
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
    marginBottom: 10,
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
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EmailConfirmation; 