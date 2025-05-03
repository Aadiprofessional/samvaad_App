import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Onboarding slides data
const slides = [
  {
    id: '1',
    title: 'Welcome to Samvaad',
    description: 'Your journey to mastering sign language begins here',
    image: require('../assets/images/placeholder-avatar.png'),
    backgroundColor: ['#7F7FD5', '#91EAE4'],
  },
  {
    id: '2',
    title: 'Learn Through Games',
    description: 'Fun interactive games make learning sign language enjoyable',
    image: require('../assets/images/placeholder-avatar.png'),
    backgroundColor: ['#FF9A8B', '#FF6A88'],
  },
  {
    id: '3',
    title: 'Real-time Translation',
    description: 'Translate sign language in real-time with your camera',
    image: require('../assets/images/placeholder-avatar.png'),
    backgroundColor: ['#6a11cb', '#2575fc'],
  },
  {
    id: '4',
    title: 'Track Your Progress',
    description: 'Monitor your learning journey and earn achievements',
    image: require('../assets/images/placeholder-avatar.png'),
    backgroundColor: ['#11998e', '#38ef7d'],
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const { theme, isDarkMode } = useTheme();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Auth');
    }
  };

  const skip = () => {
    navigation.replace('Auth');
  };

  const renderSlide = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={styles.slide}>
        <LinearGradient
          colors={item.backgroundColor}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image source={item.image} style={styles.image} />
        </LinearGradient>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={skip} style={styles.skipButton}>
          <Text style={[styles.skipText, { color: theme.primary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={slides}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 30, 10],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index.toString()}
                style={[
                  styles.indicator,
                  { width: dotWidth, opacity },
                  {
                    backgroundColor:
                      index === currentIndex ? theme.primary : (isDarkMode ? '#555555' : '#C4C4C4'),
                  },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={scrollTo}>
          <LinearGradient
            colors={theme.gradientPrimary}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    zIndex: 10,
  },
  skipButton: {
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: '#6200EE',
    fontWeight: '500',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingBottom: 30,
  },
  gradientBackground: {
    width: width,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: 'contain',
  },
  textContainer: {
    paddingHorizontal: 40,
    marginTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  button: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});

export default OnboardingScreen; 