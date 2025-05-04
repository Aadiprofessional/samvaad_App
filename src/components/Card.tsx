import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { scale } from '../utils/responsive';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  gradient?: string[];
  outlined?: boolean;
  elevated?: boolean;
  rounded?: 'small' | 'medium' | 'large' | 'none';
  onPress?: () => void;
}

// Default border radius values in case theme is missing them
const DEFAULT_BORDER_RADIUS = {
  small: 4,
  medium: 8,
  large: 12,
  none: 0
};

// Default shadow styles
const DEFAULT_SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 6,
  }
};

const Card: React.FC<CardProps> = ({
  children,
  style,
  contentStyle,
  gradient,
  outlined = false,
  elevated = true,
  rounded = 'medium',
  onPress,
  ...props
}) => {
  const { theme } = useTheme();
  
  // Safely get border radius - use theme value or fallback to default
  const getBorderRadius = (size: 'small' | 'medium' | 'large' | 'none') => {
    if (size === 'none') return 0;
    return theme?.borderRadius?.[size] || DEFAULT_BORDER_RADIUS[size] || DEFAULT_BORDER_RADIUS.medium;
  };
  
  // Safely get shadow style - use theme value or fallback to default
  const getShadowStyle = (size: 'small' | 'medium' | 'large') => {
    return theme?.shadows?.[size] || DEFAULT_SHADOWS[size] || DEFAULT_SHADOWS.medium;
  };
  
  // Determine card styles based on props
  const cardStyles: StyleProp<ViewStyle> = [
    styles.card,
    {
      borderRadius: getBorderRadius(rounded),
      borderWidth: outlined ? 1 : 0,
      borderColor: outlined ? theme.border : 'transparent',
      backgroundColor: gradient ? 'transparent' : theme.card,
      overflow: 'hidden',
    },
    elevated && !gradient && !outlined ? getShadowStyle('medium') : {},
    style,
  ];
  
  const content = (
    <View style={[styles.content, contentStyle, { zIndex: 10 }]}>
      {children}
    </View>
  );
  
  // Render card with or without gradient and touchable
  if (gradient) {
    const cardContent = (
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyles}
      >
        {content}
      </LinearGradient>
    );
    
    return onPress ? (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[elevated ? getShadowStyle('medium') : {}, styles.touchableCard]}
        {...props}
      >
        {cardContent}
      </TouchableOpacity>
    ) : cardContent;
  }
  
  return onPress ? (
    <TouchableOpacity
      style={[cardStyles, styles.touchableCard]}
      activeOpacity={0.8}
      onPress={onPress}
      {...props}
    >
      {content}
    </TouchableOpacity>
  ) : (
    <View style={cardStyles}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: scale(8),
  },
  content: {
    padding: scale(16),
  },
  touchableCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  }
});

export default Card; 