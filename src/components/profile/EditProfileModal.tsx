import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { Buffer } from 'buffer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';
import * as authService from '../../services/authService';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme, isDarkMode } = useTheme();
  const { user, profile, updateProfile, refreshProfile } = useAuth();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Initialize form with current user data
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAge(profile.age ? String(profile.age) : '');
      setImageUri(profile.profile_image_url || null);
    }
  }, [profile, visible]);

  const selectImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
      selectionLimit: 1,
      includeBase64: true,
    };

    try {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
          return;
        }
        
        if (response.errorCode) {
          console.error('ImagePicker Error:', response.errorCode, response.errorMessage);
          Alert.alert('Error', response.errorMessage || 'Unknown error occurred');
          return;
        }
        
        if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
          console.log('Image selected successfully', {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            fileName: response.assets[0].fileName,
            fileSize: response.assets[0].fileSize,
          });
          
          setImageUri(response.assets[0].uri);
          setImageFile(response.assets[0]);
        } else {
          console.error('No image data received from picker');
          Alert.alert('Error', 'Failed to get image data');
        }
      });
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const uploadProfileImage = async (): Promise<string | null> => {
    if (!imageFile || !imageUri || !user) return null;
    
    try {
      setUploadProgress(0);
      const fileExt = imageUri.split('.').pop() || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      console.log('Starting image upload: URI exists:', !!imageUri, 'File type:', imageFile.type);
      setUploadProgress(20);
      
      // Try with fetch and blob first
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        if (blob && blob.size > 0) {
          console.log('Successfully created blob, size:', blob.size, 'type:', blob.type);
          
          const { data, error } = await supabase.storage
            .from('profileimages')
            .upload(fileName, blob, {
              upsert: true,
              contentType: imageFile.type || 'image/jpeg',
            });
          
          if (!error) {
            setUploadProgress(100);
            console.log('Upload successful with blob');
            const { data: { publicUrl } } = supabase.storage
              .from('profileimages')
              .getPublicUrl(fileName);
            return publicUrl;
          }
          
          console.error('Error uploading with blob, trying alternative method:', error);
        } else {
          console.error('Blob is empty or invalid, trying alternative method');
        }
      } catch (blobError) {
        console.error('Error with blob upload, trying alternative method:', blobError);
      }
      
      // If base64 data is available from image picker, use it as fallback
      if (imageFile.base64) {
        console.log('Trying upload with base64 data');
        setUploadProgress(30);
        
        const base64Data = imageFile.base64;
        const base64File = Buffer.from(base64Data, 'base64');
        
        const { data, error } = await supabase.storage
          .from('profileimages')
          .upload(fileName, base64File, {
            upsert: true,
            contentType: imageFile.type || 'image/jpeg',
          });
        
        if (error) {
          console.error('Failed to upload with base64:', error);
          throw error;
        }
        
        setUploadProgress(100);
        console.log('Upload successful with base64');
        
        const { data: { publicUrl } } = supabase.storage
          .from('profileimages')
          .getPublicUrl(fileName);
        
        return publicUrl;
      }
      
      console.error('All upload methods failed');
      throw new Error('Failed to upload image: No valid image data available');
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      if (!name.trim()) {
        Alert.alert('Error', 'Name is required');
        return;
      }
      
      setIsSubmitting(true);
      console.log('Starting profile update process...');
      
      let profileImageUrl = null;
      
      // First upload the image if one was selected
      if (imageFile && imageUri !== profile?.profile_image_url) {
        setUploadProgress(10); // Show initial progress
        profileImageUrl = await uploadProfileImage();
        
        if (!profileImageUrl) {
          setError('Failed to upload profile image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
      
      setUploadProgress(70); // Update progress after image upload
      
      // Prepare profile update data
      const profileData: any = {
        name: name.trim()
      };
      
      if (profileImageUrl) {
        profileData.profile_image_url = profileImageUrl;
      }
      
      if (age !== '') {
        const ageNumber = parseInt(age);
        if (!isNaN(ageNumber) && ageNumber > 0) {
          profileData.age = ageNumber;
        }
      }
      
      console.log('Profile data for update:', profileData);
      
      // Update profile
      const success = await updateProfile(profileData);
      
      if (success) {
        console.log('Profile updated successfully, preparing to close modal');
        // Force a second refresh with delay to ensure UI updates
        console.log('Refreshing profile after update');
        
        try {
          await refreshProfile();
        } catch (refreshError) {
          console.error('Error refreshing profile:', refreshError);
        }
        
        // Use a timeout to close the modal after profile refresh completes
        setTimeout(() => {
          setIsSubmitting(false);
          onClose();
          
          // Force one more refresh after a delay to ensure updated data shows in UI
          setTimeout(() => {
            refreshProfile().catch(e => console.error('Error in final refresh:', e));
          }, 1000);
        }, 1000);
      } else {
        console.error('Failed to update profile');
        Alert.alert('Update Failed', 'Failed to update profile. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred while updating your profile');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setError(null);
    setSuccess(false);
    setUploadProgress(0);
    
    // If we didn't upload the new image, reset to the original
    if (imageUri !== profile?.profile_image_url && !success) {
      setImageUri(profile?.profile_image_url || null);
      setImageFile(null);
    }
    
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Icon name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Edit Profile
          </Text>
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {!success ? (
              <>
                <View style={styles.imageContainer}>
                  <TouchableOpacity onPress={selectImage} style={styles.profileImageContainer}>
                    {imageUri ? (
                      <Image 
                        source={{ uri: imageUri }} 
                        style={styles.profileImage} 
                      />
                    ) : (
                      <View style={[styles.placeholderImage, { backgroundColor: isDarkMode ? '#333' : '#e1e1e1' }]}>
                        <Icon name="account" size={50} color={isDarkMode ? '#666' : '#999'} />
                      </View>
                    )}
                    <View style={styles.editImageButton}>
                      <Icon name="camera" size={16} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                </View>
                
                <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#333' : '#F5F5F5' }]}>
                  <Icon name="account-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Full Name"
                    placeholderTextColor={isDarkMode ? '#999' : '#999'}
                    value={name}
                    onChangeText={setName}
                    editable={!isSubmitting}
                  />
                </View>
                
                <View style={[styles.inputContainer, { backgroundColor: isDarkMode ? '#333' : '#F5F5F5' }]}>
                  <Icon name="calendar" size={20} color={theme.colors.primary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Age (optional)"
                    placeholderTextColor={isDarkMode ? '#999' : '#999'}
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                    editable={!isSubmitting}
                  />
                </View>
                
                {error && (
                  <Text style={[styles.errorText, { color: isDarkMode ? '#FF3B30' : '#FF3B30' }]}>{error}</Text>
                )}
                
                <TouchableOpacity 
                  style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#FFFFFF" size="small" />
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <Text style={styles.uploadText}>Uploading image ({uploadProgress}%)</Text>
                      )}
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.successContainer}>
                <Icon 
                  name="check-circle-outline" 
                  size={60} 
                  color={isDarkMode ? '#4CAF50' : '#4CAF50'} 
                  style={styles.successIcon} 
                />
                
                <Text style={[styles.successTitle, { color: isDarkMode ? '#4CAF50' : '#4CAF50' }]}>
                  Profile Updated!
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    maxHeight: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profileImageContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'visible',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200EE',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 3,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  submitButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 14,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  successIcon: {
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default EditProfileModal; 