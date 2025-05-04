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
      <Card gradient={gradient} style={styles.card}>
        <Image source={image} style={styles.gameImage} />
        <View style={styles.cardContent}>
         
          
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle} numberOfLines={2}>{title || "Game Card"}</Text>
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
  cardContent: {
    flex: 1,
    padding: 0,
    justifyContent: 'space-between',
    position: 'relative',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
 
  gameInfo: {
    paddingHorizontal: scale(6),
    paddingTop: scale(4),
    paddingBottom: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  
    width: '100%',
  },
  gameTitle: {
    fontSize: fontScale(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: scale(4),
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameDescription: {
    fontSize: fontScale(12),
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: scale(6),
    lineHeight: scale(16),
    opacity: 0.9,
  },
  levelBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(3),
    borderRadius: scale(12),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: scale(4),
  },
  gameImage: {
    width: 83,
    height: 83,
    padding: scale(10),
    resizeMode: 'contain',
    borderRadius: scale(25),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2, 
    marginBottom: scale(10),
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  levelText: {
    fontSize: fontScale(11),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  playButton: {
    position: 'absolute',
    top: scale(10),
    right: scale(10),
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});

export default GameCard; 