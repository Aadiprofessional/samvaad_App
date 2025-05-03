import { supabase, supabaseAdmin } from './supabaseClient';
import { generateUniqueId } from '../utils/idGenerator';

// User types
export type UserRole = 'deaf' | 'parent' | 'teacher';

export type DeafUserProficiency = 
  'complete_beginner' | 
  'knows_hand_signs' | 
  'fluent_in_hand_signs' | 
  'practice_only';

export type DeafUserIssue = 
  'congenital' | 
  'acquired' | 
  'partial' | 
  'total';

export interface UserSignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  age?: number;
  rollNumber?: string; // Generated automatically for all users
  
  // For deaf users
  proficiency?: DeafUserProficiency;
  issues?: DeafUserIssue[];
  illnessStage?: string;
  
  // For parent users
  childRollNumber?: string;
  relationship?: string;
  purpose?: string;
  child_name?: string;
  
  // For teacher users
  subjects?: string[];
  teachingPurpose?: string;
  school?: string;
}

// Sign up a new user
export const signUp = async (userData: UserSignupData): Promise<any> => {
  try {
    // Direct simple signup call
    const signupResponse = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: 'samvaad://confirm-email',
        data: {
          name: userData.name,
          role: userData.role
        }
      }
    });
    
    if (signupResponse.error) {
      throw signupResponse.error;
    }
    
    // Store user data in AsyncStorage
    if (signupResponse.data?.user) {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const userDataToStore = JSON.stringify({
          ...userData,
          id: signupResponse.data.user.id,
          created_at: new Date().toISOString()
        });
        await AsyncStorage.setItem(`pending_user_${signupResponse.data.user.id}`, userDataToStore);
        
        // Immediately create the user in the database using admin client
        try {
          console.log('Creating user profile immediately after signup');
          const userId = signupResponse.data.user.id;
          
          // Generate a roll number for the user
          const rollNumber = Math.floor(100000 + Math.random() * 900000).toString();
          
          // Create basic profile data
          const profileData: any = {
            id: userId,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            roll_number: rollNumber,
            email_confirmed: false,
            created_at: new Date().toISOString(),
            confirmation_sent_at: new Date().toISOString()
          };
          
          // Add role-specific data
          if (userData.role === 'deaf') {
            profileData.proficiency = userData.proficiency;
            profileData.issues = userData.issues;
            profileData.illness_stage = userData.illnessStage;
            profileData.age = userData.age;
          } else if (userData.role === 'parent') {
            profileData.relationship = userData.relationship;
            profileData.child_name = userData.child_name;
            profileData.child_roll_number = userData.childRollNumber;
            profileData.purpose = userData.purpose;
          } else if (userData.role === 'teacher') {
            profileData.subjects = userData.subjects;
            profileData.teaching_purpose = userData.teachingPurpose;
            profileData.school = userData.school;
          }
          
          // Create user profile in database using admin client (bypasses RLS)
          const { error: profileError } = await supabaseAdmin
            .from('users')
            .upsert([profileData]);
          
          if (profileError) {
            console.error('Error creating user profile:', profileError);
            // Don't throw, continue with the signup flow
          } else {
            console.log('User profile created successfully in database');
          }
        } catch (profileErr) {
          console.error('Error creating user profile:', profileErr);
          // Continue with signup flow even if there's an error
        }
      } catch (storageError) {
        console.warn('Failed to store user data, but auth succeeded');
      }
    }
    
    return signupResponse.data;
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (email: string, password: string) => {
  try {
    console.log('Attempting to sign in user:', email);
    
    // Direct sign-in attempt without complex retry logic
    const signInResponse = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // Handle auth errors
    if (signInResponse.error) {
      console.error('Error signing in:', signInResponse.error.message);
      
      // Provide specific error messages for common issues
      if (signInResponse.error.message?.includes('Invalid login') || 
          signInResponse.error.message?.includes('Invalid email') ||
          signInResponse.error.message?.includes('Invalid password')) {
        throw new Error('Invalid email or password. Please try again.');
      } else if (signInResponse.error.message?.includes('network') || 
                signInResponse.error.message?.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      
      throw signInResponse.error;
    }
    
    console.log('Sign in successful, getting user profile');
    
    // Get user profile
    const profileResponse = await supabase
      .from('users')
      .select('*')
      .eq('id', signInResponse.data.user.id)
      .single();
      
    if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileResponse.error);
      throw profileResponse.error;
    }
    
    return { 
      user: signInResponse.data.user, 
      profile: profileResponse.data 
    };
  } catch (error: any) {
    console.error('Error signing in:', error);
    
    // Provide helpful error messages
    if (error.message?.includes('network') || error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
    } else if (error.message?.includes('Invalid login credentials')) {
      throw new Error('Invalid email or password. Please try again.');
    } else if (error.status === 429 || error.message?.includes('too many requests')) {
      throw new Error('Too many login attempts. Please try again later.');
    } else if (error.message?.includes('timeout')) {
      throw new Error('The request timed out. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};

// Sign out the current user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'samvaad://reset-password',
    });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error('Error getting user profile:', profileError);
      
      // Check if this is a "not found" error - if so, try to create the profile
      if (profileError.code === 'PGRST116') {
        console.log('User exists in auth but not in database, attempting to create profile');
        
        try {
          // Generate a roll number
          const rollNumber = Math.floor(100000 + Math.random() * 900000).toString();
          
          // Create basic profile from auth data
          const profileData = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || 'User',
            role: user.user_metadata?.role || 'deaf',
            roll_number: rollNumber,
            email_confirmed: user.user_metadata?.email_verified || false,
            created_at: new Date().toISOString()
          };
          
          // Create user profile in database using admin client (bypasses RLS)
          const { error: createError } = await supabaseAdmin
            .from('users')
            .upsert([profileData]);
            
          if (createError) {
            console.error('Error creating missing user profile:', createError);
            // Return just the user without profile
            return { user, profile: null };
          }
          
          // Fetch the newly created profile
          const { data: newProfile, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (fetchError) {
            console.error('Error fetching newly created profile:', fetchError);
            return { user, profile: null };
          }
          
          console.log('Successfully created and retrieved missing user profile');
          return { user, profile: newProfile };
        } catch (createError) {
          console.error('Error recovering user profile:', createError);
          return { user, profile: null };
        }
      }
      
      // For other errors, just return the user without profile
      return { user, profile: null };
    }
    
    return { 
      user, 
      profile 
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Verify email confirmation
export const confirmEmail = async (token: string) => {
  try {
    // Get user from token
    const userResponse = await supabase.auth.getUser(token);
    
    if (userResponse.error || !userResponse.data.user) {
      throw userResponse.error || new Error('Invalid token');
    }
    
    const user = userResponse.data.user;
    
    // Generate a simple roll number
    const rollNumber = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Get stored user data
    let userData = null;
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const storedData = await AsyncStorage.getItem(`pending_user_${user.id}`);
    if (storedData) {
      userData = JSON.parse(storedData);
    }
    
    // Create basic profile data
    const profileData: any = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || (userData?.name || 'User'),
      role: user.user_metadata?.role || (userData?.role || 'deaf'),
      roll_number: rollNumber,
      email_confirmed: true,
      email_confirmed_at: new Date(),
      created_at: new Date()
    };
    
    // Add role-specific data if available
    if (userData?.role === 'deaf' && userData.proficiency) {
      profileData.proficiency = userData.proficiency;
    } else if (userData?.role === 'parent' && userData.relationship) {
      profileData.relationship = userData.relationship;
      profileData.child_name = userData.child_name;
    } else if (userData?.role === 'teacher' && userData.subjects) {
      profileData.subjects = userData.subjects;
      profileData.school = userData.school;
    }
    
    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .upsert([profileData]);
    
    if (profileError) {
      throw profileError;
    }
    
    // Clean up stored data
    await AsyncStorage.removeItem(`pending_user_${user.id}`);
    
    return { success: true, user, profile: profileData };
  } catch (error) {
    console.error('Error confirming email:', error);
    throw error;
  }
};

// Connect parent with child by roll number
export const connectParentChild = async (parentId: string, childRollNumber: string) => {
  try {
    // Get parent roll number
    const { data: parentData, error: parentError } = await supabase
      .from('users')
      .select('roll_number')
      .eq('id', parentId)
      .single();
      
    if (parentError || !parentData) throw parentError || new Error('Parent not found');
    
    // Get child user id
    const { data: childData, error: childError } = await supabase
      .from('users')
      .select('id')
      .eq('roll_number', childRollNumber)
      .eq('role', 'deaf')
      .single();
      
    if (childError || !childData) throw childError || new Error('Child not found with this roll number');
    
    // Insert relationship
    const { error: relationError } = await supabase
      .from('parent_child_relationships')
      .insert({
        parent_id: parentId,
        child_id: childData.id
      });
      
    if (relationError) throw relationError;
    
    // Update parent profile
    const { error: updateError } = await supabase
      .from('users')
      .update({ child_roll_number: childRollNumber })
      .eq('id', parentId);
      
    if (updateError) throw updateError;
    
    return true;
  } catch (error) {
    console.error('Error connecting parent and child:', error);
    throw error;
  }
};

// Check email confirmation status
export const checkEmailConfirmationStatus = async (userId: string) => {
  try {
    if (!userId) {
      console.error("checkEmailConfirmationStatus called with invalid userId");
      return { confirmed: false, expired: true };
    }
    
    console.log(`Checking confirmation status for user ${userId}`);
    
    // Get user profile - use admin client for proper permissions
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('email_confirmed, confirmation_sent_at')
      .eq('id', userId)
      .single();
      
    if (error) {
      // If user not found in database (PGRST116), it might be that the profile
      // wasn't created yet, but the auth user might exist
      if (error.code === 'PGRST116') {
        console.log("User profile not found in database, checking if auth user exists");
        
        // Check if the user exists in auth
        const userResponse = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (userResponse.error || !userResponse.data.user) {
          console.log("User not found in auth system either, marking as expired");
          return { confirmed: false, expired: true };
        }
        
        console.log("Auth user exists but profile not created, allowing confirmation");
        return { 
          confirmed: false, 
          expired: false,
          minutesLeft: 10, // Give full time window in this case
          needsProfileCreation: true
        };
      }
      
      console.error("Database error checking confirmation status:", error);
      throw error;
    }
    
    if (!data) {
      console.log("User not found in database, marking as expired");
      return { confirmed: false, expired: true };
    }
    
    // If already confirmed
    if (data.email_confirmed) {
      console.log("User email already confirmed");
      return { confirmed: true };
    }
    
    // Check if confirmation_sent_at exists and is valid
    if (!data.confirmation_sent_at) {
      console.log("No confirmation_sent_at timestamp found, using current time minus 5 minutes");
      // If missing, assume it was sent 5 minutes ago to allow some time for confirmation
      data.confirmation_sent_at = new Date(new Date().getTime() - 5 * 60 * 1000).toISOString();
    }
    
    // Check if confirmation period has expired (10 minutes)
    let confirmationSentAt;
    try {
      confirmationSentAt = new Date(data.confirmation_sent_at);
      if (isNaN(confirmationSentAt.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (err) {
      console.log("Invalid confirmation_sent_at date, using current time minus 5 minutes");
      confirmationSentAt = new Date(new Date().getTime() - 5 * 60 * 1000);
    }
    
    const now = new Date();
    const diffMinutes = (now.getTime() - confirmationSentAt.getTime()) / (1000 * 60);
    
    console.log(`Time elapsed since confirmation sent: ${diffMinutes.toFixed(2)} minutes`);
    
    if (diffMinutes > 10) {
      console.log("Confirmation period expired, deleting unconfirmed user");
      // Expired - delete the unconfirmed user
      try {
        await deleteUnconfirmedUser(userId);
      } catch (err) {
        console.error("Failed to delete unconfirmed user:", err);
        // Continue even if deletion fails
      }
      return { confirmed: false, expired: true };
    }
    
    // Still within confirmation period
    const minutesLeft = Math.max(0, 10 - diffMinutes);
    console.log(`Minutes remaining for confirmation: ${minutesLeft.toFixed(2)}`);
    
    return { 
      confirmed: false, 
      expired: false,
      minutesLeft: Math.floor(minutesLeft)
    };
  } catch (error) {
    console.error('Error checking email confirmation status:', error);
    throw error;
  }
};

// Delete unconfirmed user
export const deleteUnconfirmedUser = async (userId: string) => {
  try {
    // First delete from users table
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
      
    if (dbError) throw dbError;
    
    // Then delete from auth
    // Note: This requires admin privileges, might need to be handled by a server function
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    
    if (authError) throw authError;
    
    return true;
  } catch (error) {
    console.error('Error deleting unconfirmed user:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, profileData: Partial<UserSignupData>) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        name: profileData.name,
        age: profileData.age,
        proficiency: profileData.proficiency,
        issues: profileData.issues,
        illness_stage: profileData.illnessStage,
        child_roll_number: profileData.childRollNumber,
        relationship: profileData.relationship,
        purpose: profileData.purpose,
        subjects: profileData.subjects,
        teaching_purpose: profileData.teachingPurpose,
        updated_at: new Date(),
      })
      .eq('id', userId);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get user by roll number
export const getUserByRollNumber = async (rollNumber: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('roll_number', rollNumber)
      .single();
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error getting user by roll number:', error);
    throw error;
  }
};

// Manually mark a user's email as confirmed
export const manuallyConfirmUserEmail = async (userId: string) => {
  try {
    console.log(`Manually confirming email for user ${userId}`);
    
    // Get user info first
    const userResponse = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userResponse.error || !userResponse.data.user) {
      console.error("Error getting user data:", userResponse.error);
      throw userResponse.error || new Error('User not found');
    }
    
    const user = userResponse.data.user;
    
    // Check if user already exists in the users table
    const { data: existingUser, error: queryError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("Error checking for existing user:", queryError);
      throw queryError;
    }
    
    let profileData: any;
    
    if (existingUser) {
      console.log("User already exists in database, updating confirmation status");
      
      // Just update the confirmation status
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          email_confirmed: true,
          email_confirmed_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) {
        console.error("Error updating user confirmation status:", error);
        throw error;
      }
      
      // Get the updated user profile data
      const { data: updatedProfile, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching updated profile:", fetchError);
        throw fetchError;
      }
      
      profileData = updatedProfile;
    } else {
      console.log("User not found in database, creating profile");
      
      // Get stored user data from AsyncStorage
      let userData = null;
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        const storedData = await AsyncStorage.getItem(`pending_user_${userId}`);
        if (storedData) {
          userData = JSON.parse(storedData);
          console.log("Found stored user data:", userData);
        }
      } catch (storageErr) {
        console.warn("Error retrieving stored user data:", storageErr);
      }
      
      // Generate a roll number (if not already present)
      const rollNumber = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Create basic profile data
      profileData = {
        id: userId,
        email: user.email,
        name: user.user_metadata?.name || (userData?.name || 'User'),
        role: user.user_metadata?.role || (userData?.role || 'deaf'),
        roll_number: rollNumber,
        email_confirmed: true,
        email_confirmed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        confirmation_sent_at: new Date().toISOString()
      };
      
      // Add role-specific data if available from the stored data
      if (userData) {
        if (userData.role === 'deaf') {
          profileData.proficiency = userData.proficiency;
          profileData.issues = userData.issues;
          profileData.illness_stage = userData.illnessStage;
          profileData.age = userData.age;
        } else if (userData.role === 'parent') {
          profileData.relationship = userData.relationship;
          profileData.child_name = userData.child_name;
          profileData.child_roll_number = userData.childRollNumber;
          profileData.purpose = userData.purpose;
        } else if (userData.role === 'teacher') {
          profileData.subjects = userData.subjects;
          profileData.teaching_purpose = userData.teachingPurpose;
          profileData.school = userData.school;
        }
      }
      
      // Create user profile
      const { error } = await supabaseAdmin
        .from('users')
        .upsert([profileData]);
      
      if (error) {
        console.error("Error creating user profile:", error);
        throw error;
      }
      
      // Clean up stored data
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
        await AsyncStorage.removeItem(`pending_user_${userId}`);
      } catch (storageErr) {
        console.warn("Error cleaning up stored user data:", storageErr);
      }
    }
    
    console.log(`User ${userId} email manually confirmed`);
    return { success: true, user, profile: profileData };
  } catch (error) {
    console.error('Error in manual confirmation:', error);
    throw error;
  }
}; 