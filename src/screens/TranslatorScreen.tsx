import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import * as translationService from '../services/translationService';
import { Translation } from '../services/translationService';
import { Camera, useCameraDevices, CameraPosition } from 'react-native-vision-camera';

const { width } = Dimensions.get('window');

const TranslatorScreen = () => {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'translate' | 'history' | 'learn'>('translate');
  const [cameraActive, setCameraActive] = useState(false);
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [cameraFacing, setCameraFacing] = useState<CameraPosition>('front');
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;
  
  // Camera reference
  const cameraRef = useRef<Camera>(null);
  
  // Get available camera devices
  const devices = useCameraDevices();
  // Find the correct device for the current facing position
  const device = devices.find(d => d.position === cameraFacing);
  
  const [translationHistory, setTranslationHistory] = useState<Translation[]>([]);

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

  // Check camera permissions when component mounts
  useEffect(() => {
    (async () => {
      const status = await requestCameraPermission();
      setCameraPermission(status);
    })();
  }, []);

  // Load translation history when component mounts or when activeTab changes to history
  useEffect(() => {
    if (activeTab === 'history') {
      loadTranslationHistory();
    }
  }, [activeTab]);

  // Load translation history
  const loadTranslationHistory = async () => {
    try {
      setIsLoading(true);
      const history = await translationService.getTranslationHistory();
      setTranslationHistory(history);
    } catch (error) {
      console.error('Error loading translation history:', error);
      Alert.alert('Error', 'Failed to load translation history');
    } finally {
      setIsLoading(false);
    }
  };

  // Request camera permissions
  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Samvaad needs access to your camera to translate sign language',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        // Also request storage permission for saving images
        await PermissionsAndroid.request(
          Platform.OS === 'android' && Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          return true;
        } else {
          console.log('Camera permission denied');
          Alert.alert(
            'Permission Required', 
            'Camera permission is required to use this feature. Please enable it in your device settings.',
            [{ text: 'OK' }]
          );
          return false;
        }
      } catch (err) {
        console.error('Error requesting camera permission:', err);
        return false;
      }
    } else {
      // For iOS, request camera permission
      const cameraPermissionResult = await Camera.requestCameraPermission();
      await Camera.requestMicrophonePermission();
      
      // Check if permission was granted - 'granted' is the proper type
      const permissionGranted = cameraPermissionResult === 'granted';
      
      if (!permissionGranted) {
        Alert.alert(
          'Permission Required', 
          'Camera permission is required. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
      }
      
      return permissionGranted;
    }
  };

  // Toggle camera facing direction
  const toggleCameraFacing = useCallback(() => {
    console.log(`Switching camera from ${cameraFacing} to ${cameraFacing === 'front' ? 'back' : 'front'}`);
    setCameraFacing(cameraFacing === 'front' ? 'back' : 'front');
  }, [cameraFacing]);

  // Take photo
  const handleTakePhoto = useCallback(async () => {
    if (!cameraPermission) {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Camera Permission Required', 'Please grant camera permission to use this feature.');
        return;
      }
      setCameraPermission(hasPermission);
    }
    
    if (!device) {
      Alert.alert('Camera Error', 'No camera device available');
      return;
    }
    
    if (cameraRef.current) {
      try {
        console.log('Taking photo with camera');
        setIsLoading(true);
        
        // Capture photo with minimal settings to avoid type errors
        const photo = await cameraRef.current.takePhoto();
        
        console.log('Photo captured:', photo.path);
        
        // Create file URI
        const fileUri = Platform.OS === 'ios' 
          ? photo.path 
          : `file://${photo.path}`;
        
        setCapturedPhoto(fileUri);
        
        // Create image object similar to image-picker result
        const capturedImage = {
          uri: fileUri,
          type: 'image/jpeg',
          fileName: `sign_${Date.now()}.jpg`,
        };
        
        setSelectedImage(capturedImage);
        processImage(capturedImage);
      } catch (error) {
        console.error('Error taking photo:', error);
        Alert.alert('Camera Error', 'Failed to take photo. Please try again.');
        setIsLoading(false);
      }
    } else {
      Alert.alert('Camera Error', 'Camera is not ready. Please try again.');
    }
  }, [cameraPermission, cameraRef, device]);

  // Launch image picker
  const handleImageGallery = async () => {
    // For Android, check storage permission
    if (Platform.OS === 'android') {
      const permission = Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        
      const hasPermission = await PermissionsAndroid.request(permission);
      if (hasPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Required', 
          'Storage permission is required to access your photos. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxHeight: 1080,
      maxWidth: 1080,
      selectionLimit: 1,
    };

    console.log('Opening image gallery');
    
    try {
      launchImageLibrary(options, response => {
        console.log('Gallery response received', response);
        
        if (response.didCancel) {
          console.log('User cancelled image picker');
          return;
        }
        
        if (response.errorCode) {
          console.error('Gallery Error:', response.errorCode, response.errorMessage);
          Alert.alert('Gallery Error', response.errorMessage || 'Unknown gallery error');
          return;
        }
        
        if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          console.log('Image selected successfully', {
            uri: selectedImage.uri,
            type: selectedImage.type,
            fileName: selectedImage.fileName,
          });
          
          setCapturedPhoto(selectedImage.uri || null);
          setSelectedImage(selectedImage);
          processImage(selectedImage);
        } else {
          console.error('No image data received from gallery');
          Alert.alert('Error', 'Failed to select image');
        }
      });
    } catch (error) {
      console.error('Error launching image gallery:', error);
      Alert.alert('Gallery Error', 'There was a problem opening the image gallery. Please try again.');
    }
  };

  // Process image for translation
  const processImage = async (imageFile: any) => {
    if (!user || !user.id) {
      Alert.alert('Error', 'You must be logged in to use this feature');
      return;
    }
    
    try {
      setIsLoading(true);
      setErrorMessage(null);
      console.log('Starting image processing...');
      
      // Step 1: Upload the image to Supabase storage
      console.log('Uploading image to storage...');
      setUploadProgress(30);
      
      // Ensure we have a valid image file
      if (!imageFile || !imageFile.uri) {
        throw new Error('Invalid image file');
      }
      
      const publicUrl = await translationService.uploadTranslationImage(
        imageFile.uri,
        user.id
      );
      
      if (!publicUrl) {
        throw new Error('Failed to upload image');
      }
      
      console.log('Image successfully uploaded, URL:', publicUrl);
      setUploadProgress(60);
      
      // Step 2: Use the AI to provide interpretation
      console.log('Getting interpretation from AI...');
      
      try {
        const imageAnalysisResponse = await translationService.analyzeSignLanguageImage(publicUrl);
        console.log('API response received:', imageAnalysisResponse);
        
        // Set the translated text
        setTranslatedText(imageAnalysisResponse);
        
        // Step 3: Save the translation to the database
        const translationId = await translationService.saveTranslation(
          imageAnalysisResponse,
          publicUrl
        );
        
        console.log('Translation saved to database, ID:', translationId);
        
        // Create a new translation object
        const newTranslation: Translation = {
          id: translationId || Date.now(),
          text: imageAnalysisResponse,
          imageUrl: publicUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        
        // Add to history state
        setTranslationHistory(prevHistory => [newTranslation, ...prevHistory]);
        console.log('Translation added to history');
      } catch (apiError) {
        console.error('API error:', apiError);
        setErrorMessage('We could not analyze this image at the moment.');
        setTranslatedText('');
      }
      
      setUploadProgress(100);
    } catch (error) {
      console.error('Error processing image:', error);
      setErrorMessage('There was a problem processing your image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between active/inactive camera states
  const handleCameraToggle = async () => {
    if (!cameraPermission) {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Camera Permission Required', 'Please grant camera permission to use this feature.');
        return;
      }
      setCameraPermission(hasPermission);
    }
    
    setCameraActive(!cameraActive);
    if (cameraActive) {
      // Reset when turning camera off
      setSelectedImage(null);
      setTranslatedText('');
      setCapturedPhoto(null);
    }
  };

  // Delete a translation from history
  const handleDeleteTranslation = async (translationId: number) => {
    try {
      const success = await translationService.deleteTranslation(translationId);
      if (success) {
        setTranslationHistory(prevHistory => 
          prevHistory.filter(item => item.id !== translationId)
        );
        Alert.alert('Success', 'Translation deleted successfully');
      } else {
        throw new Error('Failed to delete translation');
      }
    } catch (error) {
      console.error('Error deleting translation:', error);
      Alert.alert('Error', 'Failed to delete translation');
    }
  };

  const renderTabButtons = () => (
    <View style={styles.tabButtonsContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'translate' && styles.activeTabButton,
          { backgroundColor: activeTab === 'translate' ? theme.colors.primary : isDarkMode ? '#1E1E1E' : '#F5F5F5' }
        ]}
        onPress={() => setActiveTab('translate')}
      >
        <Icon
          name="camera-outline"
          size={24}
          color={activeTab === 'translate' ? '#FFFFFF' : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.tabButtonText,
            { color: activeTab === 'translate' ? '#FFFFFF' : theme.colors.textSecondary }
          ]}
        >
          Translate
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'history' && styles.activeTabButton,
          { backgroundColor: activeTab === 'history' ? theme.colors.primary : isDarkMode ? '#1E1E1E' : '#F5F5F5' }
        ]}
        onPress={() => setActiveTab('history')}
      >
        <Icon
          name="history"
          size={24}
          color={activeTab === 'history' ? '#FFFFFF' : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.tabButtonText,
            { color: activeTab === 'history' ? '#FFFFFF' : theme.colors.textSecondary }
          ]}
        >
          History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'learn' && styles.activeTabButton,
          { backgroundColor: activeTab === 'learn' ? theme.colors.primary : isDarkMode ? '#1E1E1E' : '#F5F5F5' }
        ]}
        onPress={() => setActiveTab('learn')}
      >
        <Icon
          name="book-open-variant"
          size={24}
          color={activeTab === 'learn' ? '#FFFFFF' : theme.colors.textSecondary}
        />
        <Text
          style={[
            styles.tabButtonText,
            { color: activeTab === 'learn' ? '#FFFFFF' : theme.colors.textSecondary }
          ]}
        >
          Learn
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTranslateView = () => (
    <View style={styles.content}>
      {activeTab === 'translate' && (
    <View style={styles.cameraContainer}>
      {cameraActive ? (
        <View style={styles.activeCamera}>
              {device != null && cameraPermission ? (
                <Camera
                  ref={cameraRef}
                  style={styles.cameraView}
                  device={device}
                  isActive={cameraActive}
                  photo={true}
                />
              ) : (
                <View style={styles.cameraPlaceholder}>
                  <Icon name="camera-off" size={40} color={theme.textSecondary} />
                  <Text style={[styles.placeholderText, { color: theme.text }]}>
                    {device == null ? 'No camera detected' : 'Camera permission required'}
                  </Text>
                </View>
              )}
              
              {isLoading && (
                <View 
                  style={[
                    styles.loadingContainer, 
                    { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }
                  ]}
                >
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={[styles.loadingText, { color: theme.text }]}>
                    {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Analyzing sign...'}
                  </Text>
                </View>
              )}
              
              {translatedText !== '' && !isLoading && !errorMessage && (
          <View style={styles.translationOverlay}>
            <Text style={styles.translatedText}>{translatedText}</Text>
          </View>
              )}
              
              {errorMessage && !isLoading && (
                <View style={[styles.translationOverlay, { backgroundColor: 'rgba(200, 0, 0, 0.8)' }]}>
                  <Text style={styles.translatedText}>{errorMessage}</Text>
                </View>
              )}
        </View>
      ) : (
            <TouchableOpacity 
              style={[
                styles.placeholderCamera, 
                { 
                  backgroundColor: isDarkMode ? '#1E1E1E' : '#F6F6F6',
                  borderColor: theme.border 
                }
              ]}
              onPress={handleCameraToggle}
            >
              <Icon name="camera" size={60} color={theme.textSecondary} />
              <Text style={[styles.placeholderText, { color: theme.text }]}>
                Tap to activate camera
              </Text>
            </TouchableOpacity>
          )}
          
          {cameraActive && (
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: theme.cardBackground }]}
                onPress={handleImageGallery}
                disabled={isLoading}
              >
                <Icon name="image" size={24} color={isLoading ? theme.textSecondary : theme.text} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.cameraTriggerButton,
                  { backgroundColor: isLoading ? theme.disabledBackground : theme.primary },
                  capturedPhoto ? styles.cameraTriggerButtonActive : null
                ]}
                onPress={handleTakePhoto}
                disabled={isLoading || !device}
              >
                <Icon name="camera" size={30} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: theme.cardBackground }]}
                onPress={toggleCameraFacing}
                disabled={isLoading}
              >
                <Icon 
                  name="camera-switch" 
                  size={24} 
                  color={isLoading ? theme.textSecondary : theme.text} 
                />
              </TouchableOpacity>
            </View>
          )}
          
          {!cameraActive && selectedImage && (
            <>
              <Image
                source={{ uri: selectedImage.uri }}
                style={[
                  styles.inactiveCamera,
                  { borderWidth: 1, borderColor: theme.border }
                ]}
                resizeMode="cover"
              />
              
              {isLoading && (
                <View 
                  style={[
                    styles.loadingContainer, 
                    { 
                      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                      top: 20,
                      left: 20,
                      right: 20,
                      bottom: 20,
                    }
                  ]}
                >
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={[styles.loadingText, { color: theme.text }]}>
                    {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Analyzing sign...'}
          </Text>
        </View>
      )}
              
              {translatedText !== '' && !isLoading && !errorMessage && (
                <View style={[styles.inactiveTranslationOverlay]}>
                  <Text style={styles.translatedText}>{translatedText}</Text>
                </View>
              )}
              
              {errorMessage && !isLoading && (
                <View style={[styles.inactiveTranslationOverlay, { backgroundColor: 'rgba(200, 0, 0, 0.8)' }]}>
                  <Text style={styles.translatedText}>{errorMessage}</Text>
                </View>
              )}

      <View style={styles.cameraControls}>
        <TouchableOpacity 
                  style={[styles.cameraButton, { backgroundColor: theme.cardBackground }]}
                  onPress={handleImageGallery}
        >
                  <Icon name="image" size={24} color={theme.text} />
        </TouchableOpacity>
                
        <TouchableOpacity
          style={[
            styles.cameraTriggerButton, 
                    { backgroundColor: theme.secondary },
          ]}
          onPress={handleCameraToggle}
        >
                  <Icon name="camera" size={30} color="#FFFFFF" />
        </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.cameraButton, { backgroundColor: theme.cardBackground }]}
                  onPress={() => {
                    setSelectedImage(null);
                    setTranslatedText('');
                    setErrorMessage(null);
                  }}
                >
                  <Icon name="refresh" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
            </>
          )}

          {!cameraActive && !selectedImage && (
            <View 
              style={[
                styles.inactiveCamera, 
                { 
                  backgroundColor: isDarkMode ? '#1E1E1E' : '#F6F6F6',
                  borderWidth: 1, 
                  borderColor: theme.border,
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              ]}
            >
              <Icon name="image-off" size={60} color={theme.textSecondary} />
              <Text style={[styles.inactiveCameraText, { color: theme.text }]}>
                Use the camera or select an image to translate sign language
              </Text>
              
              <View style={[styles.cameraControls, { marginTop: 20 }]}>
                <TouchableOpacity
                  style={[styles.cameraButton, { backgroundColor: theme.cardBackground }]}
                  onPress={handleImageGallery}
                >
                  <Icon name="image" size={24} color={theme.text} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.cameraTriggerButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={handleCameraToggle}
                >
                  <Icon name="camera" size={30} color="#FFFFFF" />
                </TouchableOpacity>
                
                <View style={styles.cameraButton} />
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderHistoryView = () => (
    <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
      <Text style={[styles.historyTitle, { color: theme.colors.text }]}>Translation History</Text>
      
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.historyLoader} />
      ) : translationHistory.length === 0 ? (
        <View style={styles.emptyHistoryContainer}>
          <Icon name="history" size={50} color={isDarkMode ? '#555555' : '#CCCCCC'} />
          <Text style={[styles.emptyHistoryText, { color: theme.colors.textSecondary }]}>
            No translation history yet
          </Text>
        </View>
      ) : (
        translationHistory.map((item) => (
        <View key={item.id} style={[styles.historyItem, { backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF' }]}>
          <View style={styles.historyItemHeader}>
            <Text style={[styles.historyItemTimestamp, { color: theme.colors.textSecondary }]}>{item.timestamp}</Text>
              <View style={styles.historyItemActions}>
                <TouchableOpacity 
                  style={styles.historyItemAction}
                  onPress={() => {
                    Alert.alert('Copy', 'Text copied to clipboard');
                  }}
                >
              <Icon name="content-copy" size={18} color={theme.colors.primary} />
            </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.historyItemAction}
                  onPress={() => {
                    Alert.alert(
                      'Delete Translation',
                      'Are you sure you want to delete this translation?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel'
                        },
                        {
                          text: 'Delete',
                          onPress: () => handleDeleteTranslation(item.id),
                          style: 'destructive'
                        }
                      ]
                    );
                  }}
                >
                  <Icon name="delete" size={18} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
            
            {item.imageUrl && (
              <View style={styles.historyImageContainer}>
                <Image 
                  source={{ uri: item.imageUrl }}
                  style={styles.historyImage}
                  resizeMode="cover"
                />
          </View>
            )}
            
          <Text style={[styles.historyItemText, { color: theme.colors.text }]}>{item.text}</Text>
        </View>
        ))
      )}
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

      {renderTabButtons()}

      <View style={styles.content}>
        {activeTab === 'translate' && renderTranslateView()}
        {activeTab === 'history' && renderHistoryView()}
        {activeTab === 'learn' && renderLearnView()}
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
  tabButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 25,
  },
  activeTabButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  tabButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    padding: 20,
    position: 'relative',
  },
  activeCamera: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  placeholderCamera: {
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
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
    overflow: 'hidden',
    marginBottom: 20,
  },
  inactiveCameraText: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 30,
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
  loadingContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderRadius: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    flex: 1,
    padding: 20,
  },
  historyLoader: {
    marginTop: 40,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyHistoryText: {
    marginTop: 15,
    fontSize: 16,
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
  historyItemActions: {
    flexDirection: 'row',
  },
  historyItemAction: {
    marginLeft: 15,
    padding: 5,
  },
  historyImageContainer: {
    height: 140,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  historyImage: {
    width: '100%',
    height: '100%',
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
  cameraView: {
    flex: 1,
    borderRadius: 20,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
  },
  inactiveTranslationOverlay: {
    position: 'absolute',
    bottom: 90, // Position above the controls
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
});

export default TranslatorScreen; 