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
  
  // For teacher users
  subjects?: string[];
  teachingPurpose?: string;
}

// Sign up a new user
export const signUp = async (userData: UserSignupData) => {
  try {
    // Generate unique 6-digit roll number
    const rollNumber = await generateUniqueId();
    
    // First, create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          rollNumber,
        },
      }
    });

    if (authError) throw authError;
    
    // Then, insert user profile data into the database
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        roll_number: rollNumber,
        age: userData.age,
        created_at: new Date(),
        
        // Role-specific data
        proficiency: userData.proficiency,
        issues: userData.issues,
        illness_stage: userData.illnessStage,
        child_roll_number: userData.childRollNumber,
        relationship: userData.relationship,
        purpose: userData.purpose,
        subjects: userData.subjects,
        teaching_purpose: userData.teachingPurpose,
        
        // Start with email unconfirmed
        email_confirmed: false,
        confirmation_sent_at: new Date(),
      })
      .select();
      
    if (error) throw error;
    
    return { 
      user: authData.user, 
      profile: data?.[0], 
      rollNumber 
    };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (profileError) throw profileError;
    
    return { 
      user: data.user, 
      profile 
    };
  } catch (error) {
    console.error('Error signing in:', error);
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
      
    if (profileError) throw profileError;
    
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
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) throw error || new Error('Invalid token');
    
    // Update user profile to mark email as confirmed
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        email_confirmed: true,
        email_confirmed_at: new Date()
      })
      .eq('id', user.id);
      
    if (updateError) throw updateError;
    
    return true;
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

// Check if email confirmation has expired or been completed
export const checkEmailConfirmationStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email_confirmed, confirmation_sent_at')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    // Check if already confirmed
    if (data.email_confirmed) {
      return { confirmed: true, expired: false };
    }
    
    // Check if expired (10 minute window)
    const sentTime = new Date(data.confirmation_sent_at).getTime();
    const currentTime = new Date().getTime();
    const timeDiffMinutes = (currentTime - sentTime) / (1000 * 60);
    
    if (timeDiffMinutes > 10) {
      return { confirmed: false, expired: true };
    }
    
    // Still valid
    const minutesLeft = Math.max(0, 10 - Math.floor(timeDiffMinutes));
    return { confirmed: false, expired: false, minutesLeft };
  } catch (error) {
    console.error('Error checking email confirmation status:', error);
    throw error;
  }
};

// Delete unconfirmed user after timeout
export const deleteUnconfirmedUser = async (userId: string) => {
  try {
    // Check if email is still unconfirmed
    const { data, error } = await supabase
      .from('users')
      .select('email_confirmed')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    
    // If already confirmed, don't delete
    if (data.email_confirmed) {
      return false;
    }
    
    // Delete the user from auth and cascades to profile due to FK constraints
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;
    
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