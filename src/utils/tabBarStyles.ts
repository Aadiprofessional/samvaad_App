import { Platform, Dimensions, ViewStyle } from 'react-native';
import { scale } from './responsive';

/**
 * Utility functions for consistent tabBar styles across the app
 */

// Get device dimensions
const { height } = Dimensions.get('window');

// Fixed height for tab bar across the app
const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;
const PADDING_BOTTOM = Platform.OS === 'ios' ? 34 : 16;

/**
 * Get the default tabBar style with fixed positioning
 */
export const getDefaultTabBarStyle = (isDarkMode: boolean): ViewStyle => {
  return {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5',
    height: TAB_BAR_HEIGHT,
    paddingBottom: PADDING_BOTTOM,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? '#333333' : '#EEEEEE',
    elevation: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { height: -2, width: 0 },
    zIndex: 1000
  };
};

/**
 * Get the hidden tabBar style
 */
export const getHiddenTabBarStyle = (): ViewStyle => {
  return {
    display: 'none' as const,
  };
};

/**
 * Get the visible tabBar style
 */
export const getVisibleTabBarStyle = (isDarkMode: boolean): ViewStyle => {
  return {
    ...getDefaultTabBarStyle(isDarkMode),
    display: 'flex' as const,
  };
};

/**
 * Get bottom padding for screens to avoid content being hidden behind tab bar
 */
export const getBottomTabBarSpace = (): number => {
  return TAB_BAR_HEIGHT;
};

/**
 * Utility function to manage tab bar visibility in screens
 * This ensures consistent handling of tab bar appearance/hiding
 */
export const manageTabBarVisibility = (
  navigation: any, 
  isFocused: boolean, 
  isDarkMode: boolean, 
  shouldHide = false
): (() => void) => {
  const parentNavigation = navigation.getParent();
  
  if (parentNavigation) {
    if (isFocused) {
      // Set appropriate tab bar style based on if it should be hidden
      const tabBarStyle = shouldHide 
        ? getHiddenTabBarStyle() 
        : getVisibleTabBarStyle(isDarkMode);
      
      parentNavigation.setOptions({ tabBarStyle });
    }
    
    // Return a cleanup function
    return () => {
      if (parentNavigation) {
        // Reset to default on cleanup
        parentNavigation.setOptions({
          tabBarStyle: getDefaultTabBarStyle(isDarkMode)
        });
      }
    };
  }
  
  // Return empty function if no parent navigation
  return () => {};
}; 