import { Dimensions, PixelRatio, Platform, ScaledSize } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimension that UI is designed for
const baseWidth = 375; // iPhone X width
const baseHeight = 812; // iPhone X height

/**
 * Scale a size based on the device's screen width
 * @param size The size to scale in pixels
 * @returns The scaled size
 */
export const scale = (size: number): number => {
  return (SCREEN_WIDTH / baseWidth) * size;
};

/**
 * Scale a size based on the device's screen height
 * @param size The size to scale in pixels
 * @returns The scaled size
 */
export const verticalScale = (size: number): number => {
  return (SCREEN_HEIGHT / baseHeight) * size;
};

/**
 * Scale a size based on the device's screen width, less strictly than scale
 * @param size The size to scale in pixels
 * @param factor The factor to scale by, default is 0.5
 * @returns The scaled size
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

/**
 * Convert dp to px
 * @param dp The dp value
 * @returns The px value
 */
export const dpToPx = (dp: number): number => {
  return PixelRatio.getPixelSizeForLayoutSize(dp);
};

/**
 * Convert px to dp
 * @param px The px value
 * @returns The dp value
 */
export const pxToDp = (px: number): number => {
  return PixelRatio.roundToNearestPixel(px);
};

/**
 * Check if the device is a tablet
 * @returns Boolean indicating if the device is a tablet
 */
export const isTablet = (): boolean => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else {
    return pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920);
  }
};

/**
 * Font scaling utility to handle different device font settings
 * @param size The font size to scale
 * @returns The scaled font size
 */
export const fontScale = (size: number): number => {
  const scaleFactor = Math.min(SCREEN_WIDTH / baseWidth, SCREEN_HEIGHT / baseHeight);
  
  // For tablets, don't scale as much
  if (isTablet()) {
    return Math.round(size * Math.min(scaleFactor, 1.2));
  }
  
  return Math.round(size * scaleFactor);
};

// Handle dimension changes (e.g., orientation changes)
let dimensions = { window: Dimensions.get('window'), screen: Dimensions.get('screen') };

export const listenOrientationChange = (callback: (newDimensions: { window: ScaledSize; screen: ScaledSize }) => void): void => {
  Dimensions.addEventListener('change', ({ window, screen }) => {
    dimensions = { window, screen };
    callback(dimensions);
  });
};

export default {
  scale,
  verticalScale,
  moderateScale,
  fontScale,
  isTablet,
  dpToPx,
  pxToDp,
  listenOrientationChange,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
}; 