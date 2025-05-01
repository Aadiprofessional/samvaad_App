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
  
  // Determine card styles based on props
  const cardStyles: StyleProp<ViewStyle> = [
    styles.card,
    {
      borderRadius: rounded === 'none' 
        ? 0 
        : theme.borderRadius[rounded],
      borderWidth: outlined ? 1 : 0,
      borderColor: outlined ? theme.colors.border : 'transparent',
      backgroundColor: gradient ? 'transparent' : theme.colors.card,
      overflow: 'hidden',
    },
    elevated && !gradient && !outlined ? theme.shadows.medium : {},
    style,
  ];
  
  const content = (
    <View style={[styles.content, contentStyle]}>
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
        style={elevated ? theme.shadows.medium : {}}
        {...props}
      >
        {cardContent}
      </TouchableOpacity>
    ) : cardContent;
  }
  
  return onPress ? (
    <TouchableOpacity
      style={cardStyles}
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
});

export default Card; 