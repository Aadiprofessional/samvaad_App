import { supabase } from '../services/supabaseClient';

/**
 * Generates a unique 6-digit roll number for users
 * Ensures the generated ID is not already in use
 */
export const generateUniqueId = async (): Promise<string> => {
  let isUnique = false;
  let rollNumber = '';
  
  while (!isUnique) {
    // Generate a random 6-digit number
    rollNumber = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Check if this roll number already exists in the database
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('roll_number', rollNumber)
      .single();
    
    // If no data found, the roll number is unique
    isUnique = !data && !error;
  }
  
  return rollNumber;
}; 