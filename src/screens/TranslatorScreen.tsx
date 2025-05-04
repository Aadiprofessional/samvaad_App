import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const TranslatorScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const [mode, setMode] = useState<'camera' | 'history' | 'learn'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [translationHistory, setTranslationHistory] = useState<
    Array<{ id: number; text: string; timestamp: string }>
  >([
    { id: 1, text: 'Hello, how are you?', timestamp: '10:23 AM' },
    { id: 2, text: 'I am learning sign language', timestamp: '11:45 AM' },
    { id: 3, text: 'Nice to meet you', timestamp: '2:15 PM' },
  ]);

  const [learnSigns, setLearnSigns] = useState([
    { id: 1, sign: 'A', image: require('../assets/images/placeholder-avatar.png') },
    { id: 2, sign: 'B', image: require('../assets/images/placeholder-avatar.png') },
    { id: 3, sign: 'C', image: require('../assets/images/placeholder-avatar.png') },
    { id: 4, sign: 'D', image: require('../assets/images/placeholder-avatar.png') },
    { id: 5, sign: 'E', image: require('../assets/images/placeholder-avatar.png') },
    { id: 6, sign: 'F', image: require('../assets/images/placeholder-avatar.png') },
    { id: 7, sign: 'G', image: require('../assets/images/placeholder-avatar.png') },
    { id: 8, sign: 'H', image: require('../assets/images/placeholder-avatar.png') },
  ]);

  // Simulating camera activation
  const handleCameraToggle = () => {
    setCameraActive(!cameraActive);
    if (!cameraActive) {
      // In a real app, this would initialize the camera
      setTimeout(() => {
        setTranslatedText('Hello, how are you?');
        // Add to history
        const newTranslation = {
          id: translationHistory.length + 1,
          text: 'Hello, how are you?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setTranslationHistory([newTranslation, ...translationHistory]);
      }, 3000);
    } else {
      setTranslatedText('');
    }
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Upload Image',
      'Choose an image with sign language to translate',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Choose from Gallery',
          onPress: () => {
            // Simulate image upload and translation
            setTimeout(() => {
              setTranslatedText('Nice to meet you');
              // Add to history
              const newTranslation = {
                id: translationHistory.length + 1,
                text: 'Nice to meet you',
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
              };
              setTranslationHistory([newTranslation, ...translationHistory]);
            }, 2000);
          },
        },
      ]
    );
  };

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      {cameraActive ? (
        <View style={styles.activeCamera}>
          <Image
            source={require('../assets/images/placeholder-avatar.png')}
            style={styles.cameraPreview}
            resizeMode="cover"
          />
          <View style={styles.translationOverlay}>
            <Text style={styles.translatedText}>{translatedText}</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.inactiveCamera, { backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5' }]}>
          <Icon name="camera" size={50} color={isDarkMode ? '#555555' : '#CCCCCC'} />
          <Text style={[styles.inactiveCameraText, { color: theme.colors.textSecondary }]}>
            Tap the camera button to start translating
          </Text>
        </View>
      )}

      <View style={styles.cameraControls}>
        <TouchableOpacity 
          style={[styles.cameraButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]} 
          onPress={handleImageUpload}
        >
          <Icon name="image" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.cameraTriggerButton, 
            { backgroundColor: isDarkMode ? theme.colors.primary : '#6200EE' },
            cameraActive && [styles.cameraTriggerButtonActive, { borderColor: isDarkMode ? '#FF5252' : '#FF5252' }]
          ]}
          onPress={handleCameraToggle}
        >
          <Icon name="camera" size={30} color={cameraActive ? '#FF5252' : '#FFFFFF'} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cameraButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
          <Icon name="cog" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistoryView = () => (
    <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
      <Text style={[styles.historyTitle, { color: theme.colors.text }]}>Translation History</Text>
      {translationHistory.map((item) => (
        <View key={item.id} style={[styles.historyItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.historyItemHeader}>
            <Text style={[styles.historyItemTimestamp, { color: theme.colors.textSecondary }]}>{item.timestamp}</Text>
            <TouchableOpacity>
              <Icon name="content-copy" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.historyItemText, { color: theme.colors.text }]}>{item.text}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderLearnView = () => (
    <ScrollView style={styles.learnContainer} showsVerticalScrollIndicator={false}>
      <Text style={[styles.learnTitle, { color: theme.colors.text }]}>Learn Sign Language</Text>
      <Text style={[styles.learnSubtitle, { color: theme.colors.textSecondary }]}>
        Practice these common signs to improve your sign language skills
      </Text>

      <View style={styles.signGrid}>
        {learnSigns.map((sign) => (
          <TouchableOpacity key={sign.id} style={[styles.signItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
            <View style={[styles.signImageContainer, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
              <Image source={sign.image} style={styles.signImage} resizeMode="contain" />
            </View>
            <Text style={[styles.signText, { color: theme.colors.text }]}>{sign.sign}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.allSignsButton}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={styles.allSignsGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.allSignsText} numberOfLines={1} ellipsizeMode="tail">View All Signs</Text>
          <Icon name="chevron-right" size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
        <Text style={[styles.screenTitle, { color: theme.colors.text }]}>Sign Translator</Text>
        <TouchableOpacity style={[styles.helpButton, { backgroundColor: isDarkMode ? '#333333' : '#F0E6FF' }]}>
          <Icon name="help-circle-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {mode === 'camera' && renderCameraView()}
        {mode === 'history' && renderHistoryView()}
        {mode === 'learn' && renderLearnView()}
      </View>

      <View style={[styles.tabBar, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF', borderTopColor: isDarkMode ? '#333333' : '#EEEEEE' }]}>
        <TouchableOpacity
          style={[styles.tabItem, mode === 'camera' && styles.activeTabItem]}
          onPress={() => setMode('camera')}
        >
          <Icon
            name="camera"
            size={24}
            color={mode === 'camera' ? theme.colors.primary : '#9E9E9E'}
          />
          <Text
            style={[
              styles.tabText,
              { color: mode === 'camera' ? theme.colors.primary : '#9E9E9E' },
              mode === 'camera' && styles.activeTabText,
            ]}
          >
            Translate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, mode === 'history' && styles.activeTabItem]}
          onPress={() => setMode('history')}
        >
          <Icon
            name="history"
            size={24}
            color={mode === 'history' ? theme.colors.primary : '#9E9E9E'}
          />
          <Text
            style={[
              styles.tabText,
              { color: mode === 'history' ? theme.colors.primary : '#9E9E9E' },
              mode === 'history' && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, mode === 'learn' && styles.activeTabItem]}
          onPress={() => setMode('learn')}
        >
          <Icon
            name="book-open-variant"
            size={24}
            color={mode === 'learn' ? theme.colors.primary : '#9E9E9E'}
          />
          <Text
            style={[
              styles.tabText,
              { color: mode === 'learn' ? theme.colors.primary : '#9E9E9E' },
              mode === 'learn' && styles.activeTabText,
            ]}
          >
            Learn
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    padding: 20,
  },
  activeCamera: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  translationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
  },
  translatedText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inactiveCamera: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  inactiveCameraText: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTriggerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  cameraTriggerButtonActive: {
    borderWidth: 3,
  },
  historyContainer: {
    flex: 1,
    padding: 20,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  historyItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  historyItemTimestamp: {
    fontSize: 12,
  },
  historyItemText: {
    fontSize: 16,
  },
  learnContainer: {
    flex: 1,
    padding: 20,
  },
  learnTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  learnSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  signGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signItem: {
    width: '23%',
    aspectRatio: 0.8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 5,
  },
  signImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  signImage: {
    width: 30,
    height: 30,
  },
  signText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  allSignsButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  allSignsGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  allSignsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  activeTabItem: {
    // Visual indicator for active tab
  },
  tabText: {
    marginTop: 5,
    fontSize: 12,
  },
  activeTabText: {
    fontWeight: 'bold',
  },
});

export default TranslatorScreen; 