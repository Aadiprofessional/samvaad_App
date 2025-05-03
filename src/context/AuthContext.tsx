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
  confirmEmail: (token: string) => Promise<any>;
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
          // Get the user profile
          console.log('Getting user profile for session user:', session.user.id);
          const userInfo = await authService.getCurrentUser();
          
          if (userInfo) {
            console.log('User profile loaded successfully');
            setState({
              user: userInfo.user,
              profile: userInfo.profile,
              session,
              isLoading: false,
            });
          } else {
            // User exists but profile not loaded
            console.log('Session exists but no profile found');
            setState({
              user: session.user,
              profile: null,
              session,
              isLoading: false,
            });
          }
        } else {
          // No session found
          console.log('No active session, user is not logged in');
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
    console.log('Setting up auth state change listener...');
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'Session present' : 'No session');
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, getting profile...');
          // Get user profile
          const userInfo = await authService.getCurrentUser();
          
          setState({
            user: userInfo?.user || session.user,
            profile: userInfo?.profile || null,
            session,
            isLoading: false,
          });
          console.log('Auth state updated after sign-in');
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing state');
          // Clear state on sign out
          setState({
            user: null,
            profile: null,
            session: null,
            isLoading: false,
          });
        } else if (event === 'USER_UPDATED' && session) {
          console.log('User updated, refreshing data');
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
      if (!userId) {
        console.error("Cannot check confirmation status: userId is empty");
        throw new Error("Invalid user ID");
      }
      
      console.log("Checking email confirmation for user:", userId);
      const status = await authService.checkEmailConfirmationStatus(userId);
      
      // If user is confirmed, we should refresh their data
      if (status.confirmed) {
        console.log("User confirmed, refreshing user data");
        
        // Try to get the current user data
        try {
          const userInfo = await authService.getCurrentUser();
          if (userInfo) {
            console.log("User data refreshed successfully");
            // Update auth state with confirmed user
            setState({
              user: userInfo.user,
              profile: userInfo.profile,
              session: null, // This will be set on next login
              isLoading: false,
            });
          }
        } catch (err) {
          console.error('Error fetching confirmed user data:', err);
        }
      } else {
        console.log("User not yet confirmed, status:", status);
      }
      
      return status;
    } catch (error) {
      console.error('Error checking email confirmation status:', error);
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
        
        setState({
          user: result.user,
          profile: result.profile,
          session: null, // This will be set on next login
          isLoading: false,
        });
      }
      
      return result;
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