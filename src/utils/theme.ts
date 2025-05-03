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
  
  // Colors object with nested gradients for specific components
  colors: {
    primary: string;
    secondary: string;
    text?: string;
    textSecondary?: string;
    background?: string;
    border?: string;
    card?: string;
    gradients: {
      play: string[];
      learn: string[];
      translate: string[];
    }
  };
  
  // Shadow styles for elevated elements
  shadows: {
    small: object;
    medium: object;
    large: object;
  };
  
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
  disabledBackground: string;
  
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
  
  // Colors object with nested gradients for specific components
  colors: {
    primary: '#6200EE',
    secondary: '#03DAC6',
    text: '#333333',
    textSecondary: '#666666',
    background: '#F8F9FA',
    border: '#E0E0E0',
    card: '#FFFFFF',
    gradients: {
      play: ['#6a11cb', '#2575fc'],
      learn: ['#00cdac', '#8ddad5'],
      translate: ['#6a11cb', '#2575fc']
    }
  },
  
  // Shadow styles for elevated components
  shadows: {
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
    },
  },
  
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
  disabledBackground: '#CCCCCC',
  
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
  
  // Colors object with nested gradients for specific components
  colors: {
    primary: '#BB86FC',
    secondary: '#03DAC6',
    text: '#E0E0E0',
    textSecondary: '#AAAAAA',
    background: '#121212',
    border: '#333333',
    card: '#1E1E1E',
    gradients: {
      play: ['#8E2DE2', '#4A00E0'],
      learn: ['#00b09b', '#96c93d'],
      translate: ['#8E2DE2', '#4A00E0']
    }
  },
  
  // Shadow styles for elevated components
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.20,
      shadowRadius: 1.41,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 7 },
      shadowOpacity: 0.30,
      shadowRadius: 9.11,
      elevation: 10,
    },
  },
  
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
  disabledBackground: '#444444',
  
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