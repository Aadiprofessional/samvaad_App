import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';
import * as authService from '../services/authService';
import { UserRole } from '../services/authService';

// Define the auth state
interface AuthState {
  user: any | null;
  profile: any | null;
  session: any | null;
  isLoading: boolean;
}

// Define the auth context
interface AuthContextType extends AuthState {
  signUp: (userData: authService.UserSignupData) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (password: string) => Promise<boolean>;
  connectParentChild: (parentId: string, childRollNumber: string) => Promise<boolean>;
  checkEmailConfirmationStatus: (userId: string) => Promise<any>;
  confirmEmail: (token: string) => Promise<boolean>;
  updateProfile: (profileData: Partial<authService.UserSignupData>) => Promise<boolean>;
  resendConfirmationEmail: (email: string) => Promise<boolean>;
  getUserByRollNumber: (rollNumber: string) => Promise<any>;
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
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      // Set loading state
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get the user profile
          const userInfo = await authService.getCurrentUser();
          
          if (userInfo) {
            setState({
              user: userInfo.user,
              profile: userInfo.profile,
              session,
              isLoading: false,
            });
          } else {
            // User exists but profile not loaded
            setState({
              user: session.user,
              profile: null,
              session,
              isLoading: false,
            });
          }
        } else {
          // No session found
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          user: null,
          profile: null,
          session: null,
          isLoading: false,
        });
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          // Get user profile
          const userInfo = await authService.getCurrentUser();
          
          setState({
            user: userInfo?.user || session.user,
            profile: userInfo?.profile || null,
            session,
            isLoading: false,
          });
        } else if (event === 'SIGNED_OUT') {
          // Clear state on sign out
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
          });
        } else if (event === 'USER_UPDATED' && session) {
          // Refresh user data
          const userInfo = await authService.getCurrentUser();
          
          setState(prev => ({
            ...prev,
            user: userInfo?.user || session.user,
            profile: userInfo?.profile || null,
            session,
          }));
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign up handler
  const handleSignUp = async (userData: authService.UserSignupData) => {
    try {
      const result = await authService.signUp(userData);
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
    try {
      await authService.signOut();
      // State will be updated by the auth listener
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
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
          setState(prev => ({
            ...prev,
            profile: userInfo.profile,
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
      return await authService.checkEmailConfirmationStatus(userId);
    } catch (error) {
      console.error('Error checking email confirmation status:', error);
      throw error;
    }
  };

  // Confirm email
  const handleConfirmEmail = async (token: string) => {
    try {
      return await authService.confirmEmail(token);
    } catch (error) {
      console.error('Error confirming email:', error);
      throw error;
    }
  };

  // Update user profile
  const handleUpdateProfile = async (profileData: Partial<authService.UserSignupData>) => {
    try {
      if (!state.user?.id) throw new Error('User not authenticated');
      
      const result = await authService.updateUserProfile(state.user.id, profileData);
      
      if (result) {
        // Refresh profile data
        const userInfo = await authService.getCurrentUser();
        if (userInfo) {
          setState(prev => ({
            ...prev,
            profile: userInfo.profile,
          }));
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Resend confirmation email
  const handleResendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
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
        resendConfirmationEmail: handleResendConfirmationEmail,
        getUserByRollNumber: handleGetUserByRollNumber,
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