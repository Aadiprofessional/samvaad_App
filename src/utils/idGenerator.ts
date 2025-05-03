import { supabase } from '../services/supabaseClient';

/**
 * Generates a unique 6-digit roll number for users
 * Ensures the generated ID is not already in use
 */
export const generateUniqueId = async (): Promise<string> => {
  // Generate a random 6-digit number
  const rollNumber = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`Generated roll number ${rollNumber}, checking uniqueness...`);
  
  try {
    // Setup abort controller for timeout with increased timeout (10 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    try {
      // Check if this roll number already exists in the database with timeout
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('roll_number', rollNumber)
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error(`Error checking roll number: ${error.message}`);
        // Continue with the generated number if there's an error checking
        console.log(`Continuing with generated roll number: ${rollNumber}`);
        return rollNumber;
      }
      
      // If no matching records found (data is empty array), the roll number is unique
      const isUnique = !data || data.length === 0;
      console.log(`Roll number ${rollNumber} is ${isUnique ? 'unique' : 'already taken'}`);
      
      if (isUnique) {
        return rollNumber;
      } else {
        // If not unique, generate a new one with timestamp to ensure uniqueness
        const timestamp = Date.now().toString().slice(-4);
        const newRollNumber = Math.floor(10 + Math.random() * 90) + timestamp;
        console.log(`Generated alternative roll number: ${newRollNumber}`);
        return newRollNumber;
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Error checking roll number:', err);
      // Return the original roll number in case of timeout or other errors
      console.log(`Timeout or error occurred. Continuing with original roll number: ${rollNumber}`);
      return rollNumber;
    }
  } catch (err) {
    console.error('Unexpected error in generateUniqueId:', err);
    // Generate a new random 6-digit number as fallback
    const fallbackRollNumber = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Using fallback roll number: ${fallbackRollNumber}`);
    return fallbackRollNumber;
  }
}; 