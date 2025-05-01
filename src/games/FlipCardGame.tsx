import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import UnityView from 'react-native-unity-view';

const { width, height } = Dimensions.get('window');

// Sample data for the flip card game
// In a real app, these would be loaded from a database or API
const levels = [
  {
    level: 1,
    pairs: [
      { id: 1, symbol: 'A', meaning: 'Apple', image: require('../assets/images/placeholder-avatar.png') },
      { id: 2, symbol: 'B', meaning: 'Ball', image: require('../assets/images/placeholder-avatar.png') },
      { id: 3, symbol: 'C', meaning: 'Cat', image: require('../assets/images/placeholder-avatar.png') },
      { id: 4, symbol: 'D', meaning: 'Dog', image: require('../assets/images/placeholder-avatar.png') },
      { id: 5, symbol: 'E', meaning: 'Egg', image: require('../assets/images/placeholder-avatar.png') },
      { id: 6, symbol: 'F', meaning: 'Fish', image: require('../assets/images/placeholder-avatar.png') },
    ],
  },
  {
    level: 2,
    pairs: [
      { id: 7, symbol: 'G', meaning: 'Goat', image: require('../assets/images/placeholder-avatar.png') },
      { id: 8, symbol: 'H', meaning: 'House', image: require('../assets/images/placeholder-avatar.png') },
      { id: 9, symbol: 'I', meaning: 'Ice', image: require('../assets/images/placeholder-avatar.png') },
      { id: 10, symbol: 'J', meaning: 'Jar', image: require('../assets/images/placeholder-avatar.png') },
      { id: 11, symbol: 'K', meaning: 'Kite', image: require('../assets/images/placeholder-avatar.png') },
      { id: 12, symbol: 'L', meaning: 'Lion', image: require('../assets/images/placeholder-avatar.png') },
    ],
  },
  {
    level: 3,
    pairs: [
      { id: 13, symbol: 'M', meaning: 'Mouse', image: require('../assets/images/placeholder-avatar.png') },
      { id: 14, symbol: 'N', meaning: 'Nest', image: require('../assets/images/placeholder-avatar.png') },
      { id: 15, symbol: 'O', meaning: 'Orange', image: require('../assets/images/placeholder-avatar.png') },
      { id: 16, symbol: 'P', meaning: 'Pen', image: require('../assets/images/placeholder-avatar.png') },
      { id: 17, symbol: 'Q', meaning: 'Queen', image: require('../assets/images/placeholder-avatar.png') },
      { id: 18, symbol: 'R', meaning: 'Rabbit', image: require('../assets/images/placeholder-avatar.png') },
    ],
  },
];

type NavigationProps = {
  navigation: any;
  route: any;
};

const FlipCardGame = ({ navigation, route }: NavigationProps) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const unityRef = useRef<UnityView>(null);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (gameStarted) {
        pauseGame();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [gameStarted]);

  // Initialize Unity game when component mounts
  useEffect(() => {
    if (gameStarted && unityRef.current) {
      // Send the level data to Unity
      const levelData = JSON.stringify({
        level: currentLevel,
        pairs: levels[currentLevel - 1].pairs,
      });
      
      unityRef.current.postMessage('GameController', 'InitializeGame', levelData);
    }
  }, [gameStarted, currentLevel]);

  // Handle Unity message events
  const onUnityMessage = (handler: any) => {
    const { name, data } = handler;
    
    switch (name) {
      case 'OnLevelComplete':
        const levelCompleteData = JSON.parse(data);
        handleLevelComplete(levelCompleteData);
        break;
      case 'OnScoreUpdate':
        setScore(parseInt(data, 10));
        break;
      case 'OnMovesUpdate':
        setMoves(parseInt(data, 10));
        break;
      case 'OnTimerUpdate':
        setTimer(parseInt(data, 10));
        break;
      default:
        console.log('Unhandled Unity message:', name, data);
    }
  };

  const handleLevelComplete = (data: any) => {
    setGameCompleted(true);
    
    setTimeout(() => {
      Alert.alert(
        'Level Completed!',
        `You've completed level ${currentLevel} in ${data.time} seconds with ${data.moves} moves.\nBonus points: ${data.bonus}`,
        [
          {
            text: 'Next Level',
            onPress: () => {
              if (currentLevel < levels.length) {
                setCurrentLevel(currentLevel + 1);
                resetGame();
              } else {
                // Game completed
                Alert.alert('Congratulations!', 'You have completed all levels!');
                navigation.goBack();
              }
            },
          },
        ]
      );
    }, 500);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const resetGame = () => {
    if (unityRef.current) {
      unityRef.current.postMessage('GameController', 'ResetGame', '');
    }
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
    setGameCompleted(false);
  };

  const pauseGame = () => {
    if (unityRef.current) {
      unityRef.current.postMessage('GameController', 'PauseGame', '');
    }
    
    Alert.alert(
      'Game Paused',
      'Do you want to continue or exit?',
      [
        {
          text: 'Continue',
          onPress: () => {
            if (unityRef.current) {
              unityRef.current.postMessage('GameController', 'ResumeGame', '');
            }
          },
        },
        {
          text: 'Exit',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => gameStarted ? pauseGame() : navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#6200EE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>3D Flip Card Game</Text>
        <TouchableOpacity style={styles.infoButton} onPress={() => gameStarted && pauseGame()}>
          <Icon name="pause" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>

      {gameStarted && (
        <View style={styles.gameInfo}>
          <View style={styles.infoItem}>
            <Icon name="trophy" size={20} color="#6200EE" />
            <Text style={styles.infoText}>{score}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="counter" size={20} color="#6200EE" />
            <Text style={styles.infoText}>{moves}</Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="clock-outline" size={20} color="#6200EE" />
            <Text style={styles.infoText}>{formatTime(timer)}</Text>
          </View>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {currentLevel}</Text>
          </View>
        </View>
      )}

      {!gameStarted ? (
        <View style={styles.startContainer}>
          <Text style={styles.startTitle}>3D Flip Card Game</Text>
          <Text style={styles.startSubtitle}>Level {currentLevel}</Text>
          <Text style={styles.startDescription}>
            Experience our amazing 3D card matching game. Match sign language symbols with their meanings in an immersive 3D environment.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>Start Game</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.unityContainer}>
          <UnityView
            ref={unityRef}
            style={styles.unityView}
            onMessage={onUnityMessage}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    zIndex: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  infoButton: {
    padding: 5,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  levelBadge: {
    backgroundColor: '#F0E6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    color: '#6200EE',
    fontWeight: 'bold',
    fontSize: 12,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  startTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  startSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#6200EE',
    marginBottom: 20,
  },
  startDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  startButton: {
    width: '60%',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  unityContainer: {
    flex: 1,
    width,
    height: height - 100,
  },
  unityView: {
    flex: 1,
  },
});

export default FlipCardGame; 