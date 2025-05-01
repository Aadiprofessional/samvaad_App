import React from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import { scale, fontScale } from '../utils/responsive';
import Card from './Card';

interface ThemeToggleProps {
  style?: StyleProp<ViewStyle>;
  showLabel?: boolean;
  variant?: 'icon' | 'switch' | 'card';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  style, 
  showLabel = false,
  variant = 'icon',
}) => {
  const { isDarkMode, toggleTheme, theme, themeMode, setTheme } = useTheme();

  // Icon-only toggle
  if (variant === 'icon') {
    return (
      <TouchableOpacity
        style={[styles.iconContainer, style]}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <Icon
          name={isDarkMode ? 'weather-night' : 'white-balance-sunny'}
          size={24}
          color={theme.colors.text}
        />
        {showLabel && (
          <Text style={[styles.label, { color: theme.colors.text }]}>
            {isDarkMode ? 'Dark' : 'Light'}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  // Switch-like toggle
  if (variant === 'switch') {
    return (
      <View style={[styles.switchContainer, style]}>
        <TouchableOpacity
          style={[
            styles.switchOption,
            !isDarkMode && styles.activeOption,
            { backgroundColor: !isDarkMode ? theme.colors.primary : 'transparent' }
          ]}
          onPress={() => setTheme('light')}
        >
          <Icon
            name="white-balance-sunny"
            size={18}
            color={!isDarkMode ? '#FFFFFF' : theme.colors.textSecondary}
          />
          {showLabel && (
            <Text
              style={[
                styles.switchLabel,
                { color: !isDarkMode ? '#FFFFFF' : theme.colors.textSecondary }
              ]}
            >
              Light
            </Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.switchOption,
            isDarkMode && styles.activeOption,
            { backgroundColor: isDarkMode ? theme.colors.primary : 'transparent' }
          ]}
          onPress={() => setTheme('dark')}
        >
          <Icon
            name="weather-night"
            size={18}
            color={isDarkMode ? '#FFFFFF' : theme.colors.textSecondary}
          />
          {showLabel && (
            <Text
              style={[
                styles.switchLabel,
                { color: isDarkMode ? '#FFFFFF' : theme.colors.textSecondary }
              ]}
            >
              Dark
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // Card variant with all options
  return (
    <Card style={[styles.card, style]}>
      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
        Appearance
      </Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            themeMode === 'light' && { 
              borderColor: theme.colors.primary,
              borderWidth: 2,
            }
          ]}
          onPress={() => setTheme('light')}
        >
          <View style={[styles.optionPreview, { backgroundColor: '#FFFFFF' }]}>
            <Text style={{ color: '#000000' }}>Aa</Text>
          </View>
          <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
            Light
          </Text>
          {themeMode === 'light' && (
            <Icon name="check-circle" size={18} color={theme.colors.primary} style={styles.checkIcon} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.optionCard,
            themeMode === 'dark' && { 
              borderColor: theme.colors.primary,
              borderWidth: 2,
            }
          ]}
          onPress={() => setTheme('dark')}
        >
          <View style={[styles.optionPreview, { backgroundColor: '#121212' }]}>
            <Text style={{ color: '#FFFFFF' }}>Aa</Text>
          </View>
          <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
            Dark
          </Text>
          {themeMode === 'dark' && (
            <Icon name="check-circle" size={18} color={theme.colors.primary} style={styles.checkIcon} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.optionCard,
            themeMode === 'system' && { 
              borderColor: theme.colors.primary,
              borderWidth: 2,
            }
          ]}
          onPress={() => setTheme('system')}
        >
          <View style={styles.optionPreview}>
            <View style={styles.halfPreview}>
              <Text style={{ color: '#000000', fontSize: 10 }}>Aa</Text>
            </View>
            <View style={[styles.halfPreview, { backgroundColor: '#121212' }]}>
              <Text style={{ color: '#FFFFFF', fontSize: 10 }}>Aa</Text>
            </View>
          </View>
          <Text style={[styles.optionLabel, { color: theme.colors.text }]}>
            System
          </Text>
          {themeMode === 'system' && (
            <Icon name="check-circle" size={18} color={theme.colors.primary} style={styles.checkIcon} />
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(8),
  },
  label: {
    marginLeft: scale(8),
    fontSize: fontScale(14),
  },
  switchContainer: {
    flexDirection: 'row',
    borderRadius: scale(20),
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: scale(4),
    overflow: 'hidden',
  },
  switchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(6),
    paddingHorizontal: scale(12),
    borderRadius: scale(16),
  },
  activeOption: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  switchLabel: {
    marginLeft: scale(4),
    fontSize: fontScale(12),
    fontWeight: '500',
  },
  card: {
    padding: scale(16),
  },
  cardTitle: {
    fontSize: fontScale(16),
    fontWeight: '600',
    marginBottom: scale(16),
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '30%',
    borderRadius: scale(8),
    padding: scale(8),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  optionPreview: {
    width: '100%',
    height: scale(40),
    borderRadius: scale(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(8),
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  halfPreview: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  optionLabel: {
    fontSize: fontScale(12),
    marginTop: scale(4),
  },
  checkIcon: {
    position: 'absolute',
    top: scale(4),
    right: scale(4),
  },
});

export default ThemeToggle; 