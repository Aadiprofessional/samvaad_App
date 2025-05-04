import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { supabase, supabaseAdmin } from '../services/supabaseClient';
import * as authService from '../services/authService';
import { UserRole } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification type definition
interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
  autoClose?: boolean;
}

// Define the auth state
interface AuthState {
  user: any | null;
  profile: any | null;
  session: any | null;
  isLoading: boolean;
  notifications: Notification[];
}

// Define the auth context
interface AuthContextType extends AuthState {
  signUp: (userData: authService.UserSignupData) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  connectParentChild: (parentId: string, childRollNumber: string) => Promise<boolean>;
  checkEmailConfirmationStatus: (userId: string) => Promise<any>;
  confirmEmail: (token: string) => Promise<any>;
  updateProfile: (profileData: Partial<authService.UserSignupData>) => Promise<boolean>;
  refreshProfile: () => Promise<boolean>;
  resendConfirmationEmail: (email: string) => Promise<boolean>;
  getUserByRollNumber: (rollNumber: string) => Promise<any>;
  manuallyConfirmUserEmail: (userId: string) => Promise<any>;
  addNotification: (notification: Notification) => void;
  removeNotification: (index: number) => void;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    isLoading: true,
    notifications: [],
  });
  
  // Add a ref to track last refresh time
  const lastRefreshTime = useRef<number>(0);
  const MIN_REFRESH_INTERVAL = 3000; // 3 seconds minimum between refreshes

  // Notification handlers
  const addNotification = (notification: Notification) => {
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, notification]
    }));
    
    // Auto-close notification if specified
    if (notification.autoClose) {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          notifications: prev.notifications.filter(n => n !== notification)
        }));
      }, 3000);
    }
  };
  
  const removeNotification = (index: number) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter((_, i) => i !== index)
    }));
  };
  
  // Helper to set loading state
  const setLoading = (loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading
    }));
  };

  // Initialize auth state
  useEffect(() => {
    console.log('Initializing AuthProvider...');
    
    const initializeAuth = async () => {
      // Set loading state
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        console.log('Getting current Supabase session...');
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        console.log('Session retrieved:', session ? 'Session exists' : 'No session');
        
        if (session) {
          // Store session in AsyncStorage for persistence
          await AsyncStorage.setItem('userSession', JSON.stringify(session));
          
          // Get the user profile
          console.log('Getting user profile for session user:', session.user.id);
          const userInfo = await authService.getCurrentUser();
          
          if (userInfo && userInfo.profile) {
            console.log('User profile loaded successfully');
            
            // Normalize profile if it's an array
            const normalizedProfile = normalizeProfile(userInfo.profile);
            
            setState(prev => ({
              ...prev,
              user: userInfo.user,
              profile: normalizedProfile,
              session,
              isLoading: false,
            }));
          } else {
            // User exists but profile not loaded - try to recreate it
            console.log('Session exists but no profile found in the database. Attempting to create it now...');
            
            try {
              // Get user details from the auth API
              const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(session.user.id);
              
              if (userError || !userData.user) {
                throw userError || new Error('Failed to retrieve user data');
              }
              
              const user = userData.user;
              console.log('Retrieved user data from auth:', user.email);
              
              // Generate a roll number
              const rollNumber = Math.floor(100000 + Math.random() * 900000).toString();
              
              // Create a basic profile for the user
              const profileData = {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.name || 'User',
                role: user.user_metadata?.role || 'deaf',
                roll_number: rollNumber,
                email_confirmed: user.user_metadata?.email_verified || true, // Check email_verified in metadata
                email_confirmed_at: new Date().toISOString(),
                created_at: new Date().toISOString()
              };
              
              console.log('Creating missing user profile:', profileData);
              
              // Insert the profile using the admin client to bypass RLS
              const { error: insertError } = await supabaseAdmin
                .from('users')
                .upsert([profileData]);
                
              if (insertError) {
                console.error('Error creating missing profile:', insertError);
                // Continue and set user state without profile
              } else {
                console.log('Successfully created missing user profile');
                
                // Fetch the newly created profile
                const { data: newProfile, error: fetchError } = await supabaseAdmin
                  .from('users')
                  .select('*')
                  .eq('id', user.id)
                  .single();
                  
                if (!fetchError && newProfile) {
                  console.log('Retrieved newly created profile');
                  setState(prev => ({
                    ...prev,
                    user: user,
                    profile: newProfile,
                    session,
                    isLoading: false
                  }));
                  return; // Exit early since we've set the state
                }
              }
            } catch (recoveryError) {
              console.error('Error recovering missing profile:', recoveryError);
              // Continue with setting user without profile
            }
            
            // If recovery failed, set state with just the user
            setState(prev => ({
              ...prev,
              user: session.user,
              profile: null,
              session,
              isLoading: false,
            }));
          }
        } else {
          // No session found
          console.log('No active session, user is not logged in');
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            session: null,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState(prev => ({
          ...prev,
          user: null,
          profile: null,
          session: null,
          isLoading: false,
        }));
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    console.log('Setting up auth state change listener...');
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session present' : 'No session');
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, getting profile...');
          // Store session in AsyncStorage for persistence
          await AsyncStorage.setItem('userSession', JSON.stringify(session));
          
          // Get user profile
          const userInfo = await authService.getCurrentUser();
          
          // Normalize profile if it's an array
          const normalizedProfile = userInfo?.profile ? normalizeProfile(userInfo.profile) : null;
          
          setState(prev => ({
            ...prev,
            user: userInfo?.user || session.user,
            profile: normalizedProfile,
            session,
            isLoading: false,
          }));
          console.log('Auth state updated after sign-in');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          // Clear session from AsyncStorage
          await AsyncStorage.removeItem('userSession');
          
          // Clear state on sign out
          setState(prev => ({
            ...prev,
            user: null,
            profile: null,
            session: null,
            isLoading: false,
          }));
        } else if (event === 'USER_UPDATED' && session) {
          console.log('User updated, refreshing data');
          // Refresh user data
          const userInfo = await authService.getCurrentUser();
          
          // Normalize profile if it's an array
          const normalizedProfile = userInfo?.profile ? normalizeProfile(userInfo.profile) : null;
          
          setState(prev => ({
            ...prev,
            user: userInfo?.user || session.user,
            profile: normalizedProfile,
            session,
          }));
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up auth listener...');
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign up handler
  const handleSignUp = async (userData: authService.UserSignupData) => {
    try {
      const result = await authService.signUp(userData);
      
      // We don't set the user as logged in yet, as they need to confirm email first
      
      return result;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  // Sign in handler
  const handleSignIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn(email, password);
      return result;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    console.log('Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('userSession');
      
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      
      console.log('Sign out successful');
      setState(prev => ({
        ...prev,
        user: null,
        profile: null,
        session: null,
        isLoading: false,
      }));
      
      return true;
    } catch (error) {
      console.error('Sign out failed:', error);
      return false;
    }
  };

  // Reset password handler
  const handleResetPassword = async (email: string) => {
    try {
      return await authService.resetPassword(email);
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    }
  };

  // Update password handler
  const handleUpdatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  // Connect parent and child
  const handleConnectParentChild = async (parentId: string, childRollNumber: string) => {
    try {
      const result = await authService.connectParentChild(parentId, childRollNumber);
      
      // If successful and this user is the parent, update local state
      if (result && state.user?.id === parentId) {
        const userInfo = await authService.getCurrentUser();
        if (userInfo) {
          // Normalize profile if it's an array
          const normalizedProfile = normalizeProfile(userInfo.profile);
          
          setState(prev => ({
            ...prev,
            profile: normalizedProfile,
          }));
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error connecting parent and child:', error);
      throw error;
    }
  };

  // Check email confirmation status
  const handleCheckEmailConfirmationStatus = async (userId: string) => {
    try {
      console.log("Checking email confirmation for user:", userId);
      
      if (!userId) {
        throw new Error("Invalid user ID");
      }
      
      const status = await authService.checkEmailConfirmationStatus(userId);
      
      // If user is confirmed, we should refresh their data and update the database
      if (status.confirmed) {
        console.log("User confirmed, refreshing user data");
        
        // Try to get the current user data
        try {
          const userInfo = await authService.getCurrentUser();
          if (userInfo) {
            console.log("User data refreshed successfully");
            
            // Normalize profile if it's an array
            const normalizedProfile = normalizeProfile(userInfo.profile);
            
            // Update auth state with confirmed user
            setState(prev => ({
              ...prev,
              user: userInfo.user,
              profile: normalizedProfile,
              session: null, // This will be set on next login
              isLoading: false,
            }));
            
            // Update the confirmation status in the database
            try {
              const { error } = await supabase
                .from('users')
                .update({
                  email_confirmed: true,
                  email_confirmed_at: new Date().toISOString()
                })
                .eq('id', userId);
                
              if (error) {
                console.error("Error updating confirmation status in database:", error);
              } else {
                console.log("Confirmation status updated in database");
              }
            } catch (dbError) {
              console.error("Error updating database:", dbError);
            }
          }
        } catch (err) {
          console.error('Error fetching confirmed user data:', err);
        }
      }
      
      console.log("User confirmation status:", status);
      return status;
    } catch (error) {
      console.error('Error checking email confirmation status:', error);
      throw error;
    }
  };
  
  // Manually confirm user email
  const handleManuallyConfirmUserEmail = async (userId: string) => {
    try {
      console.log("Manually confirming user email for user:", userId);
      
      if (!userId) {
        throw new Error("Invalid user ID");
      }
      
      const result = await authService.manuallyConfirmUserEmail(userId);
      
      // If successful, update the local state if this is the current user
      if (result && result.success && state.user?.id === userId) {
        console.log("User confirmed, updating local state");
        
        // Try auto login if we have credentials
        const storedData = await AsyncStorage.getItem('pendingConfirmation');
        if (storedData) {
          const userData = JSON.parse(storedData);
          
          if (userData.email && userData.password) {
            console.log("Found stored credentials, automatically signing in user");
            try {
              // Use our handleSignIn method to ensure proper state updates
              await handleSignIn(userData.email, userData.password);
              console.log("Auto sign-in successful after confirmation");
              
              // Make an extra check to ensure the profile is properly marked as confirmed
              try {
                const { error } = await supabase
                  .from('users')
                  .update({
                    email_confirmed: true,
                    email_confirmed_at: new Date().toISOString()
                  })
                  .eq('id', userId);
                  
                if (error) {
                  console.error("Error during final confirmation status update:", error);
                } else {
                  console.log("Final confirmation status update successful");
                }
              } catch (updateErr) {
                console.error("Error during final profile update:", updateErr);
              }
              
              return result;
            } catch (signInError) {
              console.error("Auto sign-in failed:", signInError);
              // Continue with just updating the state even if auto-login fails
            }
          }
        }
        
        // If auto-login didn't happen, just update the state
        // Normalize profile if it's an array
        const normalizedProfile = normalizeProfile(result.profile);
        
        setState(prev => ({
          ...prev,
          user: result.user,
          profile: normalizedProfile,
          session: null, // Will be set on next manual login
          isLoading: false,
        }));
      }
      
      return result;
    } catch (error) {
      console.error('Error in manual email confirmation:', error);
      throw error;
    }
  };

  // Confirm email
  const handleConfirmEmail = async (token: string) => {
    try {
      const result = await authService.confirmEmail(token);
      
      // Update the auth state with the confirmed user data if available
      if (result && result.user && result.profile) {
        console.log("Email confirmed, updating auth state with user data");
        
        // Normalize profile if it's an array
        const normalizedProfile = normalizeProfile(result.profile);
        
        setState(prev => ({
          ...prev,
          user: result.user,
          profile: normalizedProfile,
          session: null, // This will be set on next login
          isLoading: false,
        }));
      }
      
      return result;
    } catch (error) {
      console.error('Error confirming email:', error);
      throw error;
    }
  };

  // Helper function to normalize profile data
  const normalizeProfile = (profile: any) => {
    // Convert array to single profile object if needed
    if (Array.isArray(profile)) {
      return profile[0];
    }
    return profile;
  };

  // Update user profile
  const handleUpdateProfile = async (profileData: Partial<authService.UserSignupData>) => {
    try {
      setLoading(true);
      console.log('handleUpdateProfile called with:', profileData);
      
      if (!state.user || !state.profile) {
        console.error('Cannot update profile: User or profile is undefined');
        throw new Error('User or profile not found');
      }
      
      // Call to authService update function
      const updatedProfile = await authService.updateUserProfile(state.user.id, profileData);
      console.log('Profile updated in database, returned data:', updatedProfile);
      
      // Now set the updated user profile in state
      if (updatedProfile) {
        // Normalize profile data if it's an array
        const normalizedProfile = normalizeProfile(updatedProfile);
        
        setState(prev => ({
          ...prev,
          profile: normalizedProfile
        }));
        console.log('Profile state updated with new data:', normalizedProfile);
        
        // Force a refresh of the profile
        await handleRefreshProfile();
        
        // Set success notification
        addNotification({
          type: 'success',
          message: 'Profile updated successfully',
          autoClose: true,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification({
        type: 'error',
        message: (error as Error).message || 'Failed to update profile',
        autoClose: true,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Resend confirmation email
  const handleResendConfirmationEmail = async (email: string) => {
    try {
      if (!email) {
        throw new Error("Email address is required");
      }
      
      console.log("Resending confirmation email to:", email);
      
      // For Supabase, we can use the password reset flow to send a new confirmation email
      // This is a workaround since Supabase doesn't have a direct resend confirmation API
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'samvaad://confirm-email',
      });
      
      if (error) throw error;
      
      console.log("Confirmation email resent successfully");
      
      // Update the confirmation sent timestamp
      // We'd need the user ID for this, which we may not have here
      // In a real app, we'd handle this on the server side
      
      return true;
    } catch (error) {
      console.error('Error resending confirmation email:', error);
      throw error;
    }
  };

  // Get user by roll number
  const handleGetUserByRollNumber = async (rollNumber: string) => {
    try {
      return await authService.getUserByRollNumber(rollNumber);
    } catch (error) {
      console.error('Error getting user by roll number:', error);
      throw error;
    }
  };

  // Refresh profile
  const handleRefreshProfile = async () => {
    try {
      // Force refresh from database by calling getCurrentUser
      console.log('Forcing profile refresh from database');
      const userInfo = await authService.getCurrentUser();
      
      if (userInfo) {
        // Normalize profile data if it's an array
        const normalizedProfile = normalizeProfile(userInfo.profile);
        
        // Always update the state since we're explicitly requesting a refresh
        console.log('Setting fresh profile data from database');
        setState(prev => ({
          ...prev,
          user: userInfo.user,
          profile: normalizedProfile,
          session: prev.session,
          isLoading: false,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing profile:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp: handleSignUp,
        signIn: handleSignIn,
        signOut: handleSignOut,
        resetPassword: handleResetPassword,
        updatePassword: handleUpdatePassword,
        connectParentChild: handleConnectParentChild,
        checkEmailConfirmationStatus: handleCheckEmailConfirmationStatus,
        confirmEmail: handleConfirmEmail,
        updateProfile: handleUpdateProfile,
        refreshProfile: handleRefreshProfile,
        resendConfirmationEmail: handleResendConfirmationEmail,
        getUserByRollNumber: handleGetUserByRollNumber,
        manuallyConfirmUserEmail: handleManuallyConfirmUserEmail,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 