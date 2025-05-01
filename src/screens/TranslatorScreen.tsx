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

const { width } = Dimensions.get('window');

const TranslatorScreen = () => {
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
        <View style={styles.inactiveCamera}>
          <Icon name="camera" size={50} color="#CCCCCC" />
          <Text style={styles.inactiveCameraText}>Tap the camera button to start translating</Text>
        </View>
      )}

      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.cameraButton} onPress={handleImageUpload}>
          <Icon name="image" size={24} color="#6200EE" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.cameraTriggerButton, cameraActive && styles.cameraTriggerButtonActive]}
          onPress={handleCameraToggle}
        >
          <Icon name="camera" size={30} color={cameraActive ? '#FF5252' : '#FFFFFF'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton}>
          <Icon name="cog" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHistoryView = () => (
    <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.historyTitle}>Translation History</Text>
      {translationHistory.map((item) => (
        <View key={item.id} style={styles.historyItem}>
          <View style={styles.historyItemHeader}>
            <Text style={styles.historyItemTimestamp}>{item.timestamp}</Text>
            <TouchableOpacity>
              <Icon name="content-copy" size={18} color="#6200EE" />
            </TouchableOpacity>
          </View>
          <Text style={styles.historyItemText}>{item.text}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderLearnView = () => (
    <ScrollView style={styles.learnContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.learnTitle}>Learn Sign Language</Text>
      <Text style={styles.learnSubtitle}>
        Practice these common signs to improve your sign language skills
      </Text>

      <View style={styles.signGrid}>
        {learnSigns.map((sign) => (
          <TouchableOpacity key={sign.id} style={styles.signItem}>
            <View style={styles.signImageContainer}>
              <Image source={sign.image} style={styles.signImage} resizeMode="contain" />
            </View>
            <Text style={styles.signText}>{sign.sign}</Text>
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
          <Text style={styles.allSignsText}>View All Signs</Text>
          <Icon name="chevron-right" size={20} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Sign Translator</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Icon name="help-circle-outline" size={24} color="#6200EE" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {mode === 'camera' && renderCameraView()}
        {mode === 'history' && renderHistoryView()}
        {mode === 'learn' && renderLearnView()}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, mode === 'camera' && styles.activeTabItem]}
          onPress={() => setMode('camera')}
        >
          <Icon
            name="camera"
            size={24}
            color={mode === 'camera' ? '#6200EE' : '#9E9E9E'}
          />
          <Text
            style={[
              styles.tabText,
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
            color={mode === 'history' ? '#6200EE' : '#9E9E9E'}
          />
          <Text
            style={[
              styles.tabText,
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
            color={mode === 'learn' ? '#6200EE' : '#9E9E9E'}
          />
          <Text
            style={[
              styles.tabText,
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
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
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
    justifyContent: 'space-between',
  },
  inactiveCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    margin: 20,
    borderRadius: 20,
  },
  inactiveCameraText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  activeCamera: {
    flex: 1,
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  cameraPreview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  translationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 15,
  },
  translatedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraTriggerButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6200EE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  cameraTriggerButtonActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FF5252',
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
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
    color: '#9E9E9E',
  },
  historyItemText: {
    fontSize: 16,
    color: '#333333',
  },
  learnContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  learnTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  learnSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 25,
    lineHeight: 20,
  },
  signGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  signItem: {
    width: (width - 60) / 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  signImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F0E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  signImage: {
    width: '70%',
    height: '70%',
  },
  signText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  allSignsButton: {
    marginVertical: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  allSignsGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  allSignsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingVertical: 10,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTabItem: {
    borderBottomWidth: 3,
    borderBottomColor: '#6200EE',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9E9E9E',
    marginTop: 5,
  },
  activeTabText: {
    color: '#6200EE',
  },
});

export default TranslatorScreen; 