import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Card from './Card';
import { scale, fontScale } from '../utils/responsive';

interface GameCardProps {
  id: number;
  title: string;
  description?: string;
  image: ImageSourcePropType;
  gradient: string[];
  level?: string;
  onPress: () => void;
  width?: number;
  height?: number;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  image,
  gradient,
  level,
  onPress,
  width = scale(160),
  height = scale(220),
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { width, height }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Card 
        gradient={gradient} 
        style={styles.card}
        contentStyle={styles.cardContentStyle}
      >
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.gameImage} />
          </View>
          
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle} numberOfLines={1}>{title || "Game Card"}</Text>
            {description && (
              <Text style={styles.gameDescription} numberOfLines={2}>
                {description}
              </Text>
            )}
            {level && (
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{level}</Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: scale(8),
    borderRadius: scale(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  card: {
    flex: 1,
    borderRadius: scale(16),
    overflow: 'hidden',
    padding: 0,
    margin: 0,
  },
  cardContentStyle: {
    flex: 1,
    padding: scale(16),
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: scale(12),
  },
  gameInfo: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameTitle: {
    fontSize: fontScale(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: scale(6),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameDescription: {
    fontSize: fontScale(14),
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: scale(8),
    lineHeight: scale(18),
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  levelBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: scale(4),
  },
  gameImage: {
    width: scale(90),
    height: scale(90),
    resizeMode: 'contain',
    borderRadius: scale(25),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2, 
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: scale(10),
  },
  levelText: {
    fontSize: fontScale(12),
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
});

export default GameCard; 