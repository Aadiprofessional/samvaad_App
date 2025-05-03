// Define theme colors and styles
export interface Theme {
  // Colors
  primary: string;
  secondary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  notification: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // Gradients
  gradientPrimary: string[];
  gradientSecondary: string[];
  
  // Component specific colors
  inputBackground: string;
  inputText: string;
  inputPlaceholder: string;
  buttonText: string;
  headerBackground: string;
  headerText: string;
  tabBarActive: string;
  tabBarInactive: string;
  cardBackground: string;
  shadow: string;
  
  // Opacity values
  disabledOpacity: number;
  
  // Component sizes
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    pill: number;
  };
  
  // Font sizes
  fontSize: {
    xs: number;
    small: number;
    medium: number;
    large: number;
    xl: number;
    xxl: number;
  };
  
  // Spacing
  spacing: {
    xs: number;
    small: number;
    medium: number;
    large: number;
    xl: number;
    xxl: number;
  };
}

// Light theme
export const lightTheme: Theme = {
  // Colors
  primary: '#6200EE',
  secondary: '#03DAC6',
  background: '#F8F9FA',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  notification: '#F50057',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Gradients
  gradientPrimary: ['#6a11cb', '#2575fc'],
  gradientSecondary: ['#00cdac', '#8ddad5'],
  
  // Component specific colors
  inputBackground: '#FFFFFF',
  inputText: '#333333',
  inputPlaceholder: '#9E9E9E',
  buttonText: '#FFFFFF',
  headerBackground: '#FFFFFF',
  headerText: '#333333',
  tabBarActive: '#6200EE',
  tabBarInactive: '#888888',
  cardBackground: '#FFFFFF',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  // Opacity values
  disabledOpacity: 0.6,
  
  // Component sizes
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    pill: 24,
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    small: 14,
    medium: 16,
    large: 18,
    xl: 22,
    xxl: 28,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
    xxl: 48,
  },
};

// Dark theme
export const darkTheme: Theme = {
  // Colors
  primary: '#BB86FC',
  secondary: '#03DAC6',
  background: '#121212',
  card: '#1E1E1E',
  text: '#E0E0E0',
  textSecondary: '#AAAAAA',
  border: '#333333',
  notification: '#FF4081',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
  
  // Gradients
  gradientPrimary: ['#8E2DE2', '#4A00E0'],
  gradientSecondary: ['#00b09b', '#96c93d'],
  
  // Component specific colors
  inputBackground: '#2C2C2C',
  inputText: '#E0E0E0',
  inputPlaceholder: '#777777',
  buttonText: '#FFFFFF',
  headerBackground: '#1E1E1E',
  headerText: '#E0E0E0',
  tabBarActive: '#BB86FC',
  tabBarInactive: '#777777',
  cardBackground: '#1E1E1E',
  shadow: 'rgba(0, 0, 0, 0.2)',
  
  // Opacity values
  disabledOpacity: 0.4,
  
  // Component sizes
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    pill: 24,
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    small: 14,
    medium: 16,
    large: 18,
    xl: 22,
    xxl: 28,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
    xxl: 48,
  },
}; 