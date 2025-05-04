import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import Button from './Button';
import { scale, fontScale } from '../utils/responsive';

const { width } = Dimensions.get('window');

export interface SliderItem {
  id: number;
  title: string;
  description?: string;
  tag?: string;
  buttonText?: string;
  icon?: string;
  gradient: string[];
  progress?: number;
  lessons?: number;
  type?: 'learn' | 'play' | 'translate';
}

interface SliderComponentProps {
  data: SliderItem[];
  onItemPress: (item: SliderItem) => void;
  cardWidth?: number;
  cardHeight?: number;
  sliderType: 'feature' | 'learning';
  title?: string;
}

const SliderComponent: React.FC<SliderComponentProps> = ({
  data,
  onItemPress,
  cardWidth = width - scale(32),
  cardHeight = scale(180),
  sliderType = 'feature',
  title,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatlistRef = useRef<FlatList>(null);

  useEffect(() => {
    // Auto scroll effect for feature slider only
    if (sliderType === 'feature') {
      const autoScrollInterval = setInterval(() => {
        if (flatlistRef.current && data.length > 1) {
          const nextIndex = (activeIndex + 1) % data.length;
          flatlistRef.current.scrollToIndex({
            index: nextIndex,
            animated: true
          });
          setActiveIndex(nextIndex);
        }
      }, 5000);
      
      return () => clearInterval(autoScrollInterval);
    }
  }, [activeIndex, data.length, sliderType]);
  
  const renderFeatureItem = (item: SliderItem) => (
    <Card
      gradient={item.gradient}
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={() => onItemPress(item)}
      contentStyle={styles.cardContentContainer}
    >
      {item.icon && (
        <View style={styles.iconCircle}>
          <Icon name={item.icon} size={28} color="#FFFFFF" />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={3}>{item.title || "Learn Sign Language"}</Text>
        {item.description && (
          <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
        )}
      </View>
      {item.buttonText && (
        <View style={styles.buttonContainer}>
          <Button
            title={item.buttonText}
            size="small"
            rightIcon="arrow-right"
            onPress={() => onItemPress(item)}
            style={styles.button}
            textStyle={{ color: '#FFFFFF', fontWeight: 'bold' }}
          />
        </View>
      )}
    </Card>
  );

  const renderLearningItem = (item: SliderItem) => (
    <Card 
      gradient={item.gradient}
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={() => onItemPress(item)}
      contentStyle={styles.cardContentContainer}
    >
      <View style={styles.learningCardContent}>
        <View style={styles.learningTextContainer}>
          <Text style={styles.title} numberOfLines={2}>{item.title || "Continue Learning"}</Text>
          {item.description && (
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          )}
        </View>
        
        <View style={styles.learningFooter}>
          {item.lessons !== undefined && (
            <Text style={styles.lessonCount}>{item.lessons} Lessons</Text>
          )}
          {item.progress !== undefined && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{item.progress}% Complete</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
              </View>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
  
  const renderItem = ({ item }: { item: SliderItem }) => {
    return sliderType === 'feature' 
      ? renderFeatureItem(item) 
      : renderLearningItem(item);
  };
  
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );
  
  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(
      event.nativeEvent.contentOffset.x / (cardWidth + scale(16))
    );
    setActiveIndex(newIndex);
  };
  
  return (
    <View style={styles.sliderContainer}>
      {title && <Text style={styles.sliderTitle}>{title}</Text>}
      <FlatList
        ref={flatlistRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={cardWidth + scale(16)}
        decelerationRate="fast"
        contentContainerStyle={styles.sliderList}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      />
      
      {sliderType === 'feature' && data.length > 1 && (
        <View style={styles.paginationContainer}>
          {data.map((_, index) => {
            // Interpolate to animate dot width
            const dotWidth = scrollX.interpolate({
              inputRange: [
                (index - 1) * (cardWidth + scale(16)),
                index * (cardWidth + scale(16)),
                (index + 1) * (cardWidth + scale(16))
              ],
              outputRange: [scale(8), scale(16), scale(8)],
              extrapolate: 'clamp',
            });
            
            const dotOpacity = scrollX.interpolate({
              inputRange: [
                (index - 1) * (cardWidth + scale(16)),
                index * (cardWidth + scale(16)),
                (index + 1) * (cardWidth + scale(16))
              ],
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.paginationDot,
                  { 
                    width: dotWidth,
                    opacity: dotOpacity,
                    backgroundColor: index === activeIndex 
                      ? '#6200EE' 
                      : 'rgba(98, 0, 238, 0.5)'
                  }
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    marginBottom: scale(16),
  },
  sliderTitle: {
    fontSize: fontScale(20),
    fontWeight: 'bold',
    marginBottom: scale(10),
    marginHorizontal: scale(16),
    color: '#FFFFFF',
  },
  sliderList: {
    paddingHorizontal: scale(16),
  },
  card: {
    marginHorizontal: scale(8),
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  cardContentContainer: {
    padding: scale(16),
    flex: 1,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontScale(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: scale(4),
  },
  description: {
    fontSize: fontScale(16),
    color: '#FFFFFF',
    marginBottom: scale(8),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    marginVertical: scale(6),
  },
  tag: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(3),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scale(12),
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: fontScale(12),
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    alignItems: 'flex-start',
    marginTop: scale(8),
  },
  button: {
    borderRadius: scale(16),
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
    backgroundColor: '#F16E0A',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(8),
  },
  paginationDot: {
    height: scale(8),
    borderRadius: scale(4),
    marginHorizontal: scale(4),
  },
  // Learning styles
  learningCardContent: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  learningTextContainer: {
    flex: 1,
    marginBottom: scale(16),
  },
  learningFooter: {
    marginTop: 'auto',
    width: '100%',
  },
  lessonInfo: {
    marginVertical: scale(8),
  },
  lessonCount: {
    fontSize: fontScale(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: scale(8),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  progressContainer: {
    marginBottom: scale(4),
  },
  progressText: {
    fontSize: fontScale(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: scale(6),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  progressBar: {
    height: scale(8),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scale(4),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(4),
  },
  continueButton: {
    alignSelf: 'flex-start',
    marginTop: scale(8),
    paddingHorizontal: scale(12),
    paddingVertical: scale(4),
  },
});

export default SliderComponent; 