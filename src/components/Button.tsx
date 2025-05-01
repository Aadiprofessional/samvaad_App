import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';
import { scale, fontScale } from '../utils/responsive';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  gradient?: string[];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  gradient,
  style,
  textStyle,
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Determine button styles based on variant and size
  const getButtonStyles = (): StyleProp<ViewStyle> => {
    let baseStyle: ViewStyle = {
      ...styles.button,
      borderRadius: theme.borderRadius.medium,
      opacity: disabled ? 0.6 : 1,
    };
    
    // Size styles
    switch (size) {
      case 'small':
        baseStyle = {
          ...baseStyle,
          paddingVertical: scale(6),
          paddingHorizontal: scale(12),
          minWidth: scale(80),
        };
        break;
      case 'large':
        baseStyle = {
          ...baseStyle,
          paddingVertical: scale(16),
          paddingHorizontal: scale(24),
          minWidth: scale(180),
        };
        break;
      case 'medium':
      default:
        baseStyle = {
          ...baseStyle,
          paddingVertical: scale(12),
          paddingHorizontal: scale(16),
          minWidth: scale(120),
        };
    }
    
    // Variant styles (only for non-gradient buttons)
    if (!gradient) {
      switch (variant) {
        case 'secondary':
          baseStyle = {
            ...baseStyle,
            backgroundColor: theme.colors.secondary,
          };
          break;
        case 'outline':
          baseStyle = {
            ...baseStyle,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: theme.colors.primary,
          };
          break;
        case 'ghost':
          baseStyle = {
            ...baseStyle,
            backgroundColor: 'transparent',
            borderWidth: 0,
          };
          break;
        case 'primary':
        default:
          baseStyle = {
            ...baseStyle,
            backgroundColor: gradient ? 'transparent' : theme.colors.primary,
          };
      }
    }
    
    return baseStyle;
  };
  
  // Determine text styles based on variant
  const getTextStyles = (): StyleProp<TextStyle> => {
    const fontSize = size === 'small' ? 14 : size === 'large' ? 18 : 16;
    
    // We'll construct this manually to avoid type issues
    const baseTextStyle: TextStyle = {
      textAlign: 'center',
      fontSize: fontScale(fontSize),
      fontWeight: 'bold'
    };
    
    let textColor: string;
    switch (variant) {
      case 'outline':
      case 'ghost':
        textColor = theme.colors.primary;
        break;
      case 'primary':
      case 'secondary':
      default:
        textColor = '#FFFFFF';
    }
    
    return {
      ...baseTextStyle,
      color: textColor
    };
  };
  
  // Get default gradients from theme if not provided
  const getGradient = (): string[] | undefined => {
    if (gradient) return gradient;
    
    if (variant === 'primary') {
      return theme.colors.gradients.primary;
    } else if (variant === 'secondary') {
      return theme.colors.gradients.secondary;
    }
    
    return undefined;
  };
  
  const buttonStyles = getButtonStyles();
  const textStyles = getTextStyles();
  const buttonGradient = getGradient();
  
  // Render button with or without gradient
  const renderButton = () => {
    const content = (
      <>
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'} 
          />
        ) : (
          <>
            {leftIcon && !isLoading && (
              <Icon 
                name={leftIcon} 
                size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
                color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'}
                style={styles.leftIcon} 
              />
            )}
            <Text style={[textStyles, textStyle]}>
              {title}
            </Text>
            {rightIcon && !isLoading && (
              <Icon 
                name={rightIcon} 
                size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
                color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'} 
                style={styles.rightIcon}
              />
            )}
          </>
        )}
      </>
    );
    
    if (buttonGradient && (variant === 'primary' || variant === 'secondary')) {
      return (
        <TouchableOpacity 
          style={[style]}
          activeOpacity={0.8}
          onPress={onPress}
          disabled={disabled || isLoading}
          {...props}
        >
          <LinearGradient
            colors={buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[buttonStyles, styles.gradientButton]}
          >
            {content}
          </LinearGradient>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={[buttonStyles, style]}
          activeOpacity={0.8}
          onPress={onPress}
          disabled={disabled || isLoading}
          {...props}
        >
          {content}
        </TouchableOpacity>
      );
    }
  };
  
  return renderButton();
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  gradientButton: {
    borderRadius: 8,
  },
  text: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button; 