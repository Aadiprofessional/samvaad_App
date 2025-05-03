import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://hnzblhhxtzswlmfynbzs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuemJsaGh4dHpzd2xtZnluYnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzc1NTIsImV4cCI6MjA2MTg1MzU1Mn0.uIo2h5l-bmObCgOTd7gJjhHgrN2Pq8gkHov9f2zM5Lc';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuemJsaGh4dHpzd2xtZnluYnpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjI3NzU1MiwiZXhwIjoyMDYxODUzNTUyfQ.h0KY-Ak8MBMgZ4scFWGhX9Or6LD1_WqClMkb12Kow2k';
const jwtSecret = 'y6LbEtKIo/PczxcotJ5B52j/luW4/Uwl236hYdtHGjhgmQItRVjNj6U0Cmyb1oo3OBshbf42s1JweLMMy1/3Ew==';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// For admin operations requiring service role (use sparingly and securely)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Export JWT secret for reference (not used directly in client code)
export const SUPABASE_JWT_SECRET = jwtSecret; 