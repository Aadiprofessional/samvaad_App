const lightTheme = {
  colors: {
    primary: '#6200EE',
    secondary: '#03DAC6',
    background: '#FFFFFF',
    card: '#F7F7F7',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    notification: '#F50057',
    success: '#00C853',
    warning: '#FFD600',
    error: '#D50000',
    gradients: {
      primary: ['#7F7FD5', '#86A8E7', '#91EAE4'],
      secondary: ['#FF5F6D', '#FFC371'],
      tertiary: ['#11998e', '#38ef7d'],
      quaternary: ['#6a11cb', '#2575fc'],
      learn: ['#4E65FF', '#92EFFD'],
      play: ['#FF6B6B', '#FFE66D'],
      translate: ['#BC00DD', '#E8A0FF'],
    }
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    round: 999,
  },
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
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
  typography: {
    h1: {
      fontWeight: 'bold',
      fontSize: 28,
    },
    h2: {
      fontWeight: 'bold',
      fontSize: 24,
    },
    h3: {
      fontWeight: 'bold',
      fontSize: 20,
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 14,
    },
    caption: {
      fontSize: 12,
    },
    button: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  }
};

const darkTheme = {
  colors: {
    primary: '#BB86FC',
    secondary: '#03DAC6',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    notification: '#FF4081',
    success: '#00E676',
    warning: '#FFEA00',
    error: '#FF1744',
    gradients: {
      primary: ['#4568DC', '#584BDD', '#B06AB3'],
      secondary: ['#FF5F6D', '#FF958C'],
      tertiary: ['#11998e', '#45B69C'],
      quaternary: ['#834D9B', '#514A9D'],
      learn: ['#4E65FF', '#604FFF'],
      play: ['#E02F65', '#FF5F71'],
      translate: ['#9733EE', '#BC00DD'],
    }
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.23,
      shadowRadius: 1.5,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12,
    },
  },
  typography: lightTheme.typography,
};

export { lightTheme, darkTheme };
export type Theme = typeof lightTheme; 