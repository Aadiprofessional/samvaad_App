import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Your Supabase URL and key should match the one that's working
const supabaseUrl = 'https://hnzblhhxtzswlmfynbzs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuemJsaGh4dHpzd2xtZnluYnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNzc1NTIsImV4cCI6MjA2MTg1MzU1Mn0.uIo2h5l-bmObCgOTd7gJjhHgrN2Pq8gkHov9f2zM5Lc';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuemJsaGh4dHpzd2xtZnluYnpzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjI3NzU1MiwiZXhwIjoyMDYxODUzNTUyfQ.h0KY-Ak8MBMgZ4scFWGhX9Or6LD1_WqClMkb12Kow2k';
const jwtSecret = 'y6LbEtKIo/PczxcotJ5B52j/luW4/Uwl236hYdtHGjhgmQItRVjNj6U0Cmyb1oo3OBshbf42s1JweLMMy1/3Ew==';

// Custom fetch implementation for React Native
const customFetch = (input: string | Request | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : input.url);
  console.log(`[DEBUG] Fetching ${url}`);
  
  // Add proper URL validation and handling
  if (!url.startsWith('http')) {
    console.error(`[DEBUG] Invalid URL format: ${url}`);
    return Promise.reject(new Error('Invalid URL format'));
  }
  
  return new Promise((resolve, reject) => {
    // Increase timeout for slow connections
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('[DEBUG] Request timed out after 60 seconds');
      controller.abort();
    }, 60000); // 60 second timeout (increased from 30)
    
    // Fix headers structure - extract from 'map' property if it exists
    let finalHeaders: Record<string, string> = {};
    
    if (init?.headers) {
      // If headers contains a 'map' property (issue with Supabase JS client)
      const headersObj = init.headers as any;
      if (headersObj.map && typeof headersObj.map === 'object') {
        console.log('[DEBUG] Found nested headers in map property, extracting...');
        finalHeaders = { ...headersObj.map };
      } else {
        // Regular headers object
        finalHeaders = { ...headersObj };
      }
    }
    
    // Ensure these headers are always present
    finalHeaders = {
      ...finalHeaders,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    
    const fetchOptions = {
      ...init,
      signal: controller.signal,
      headers: finalHeaders
    };
    
    // Add more debugging info
    console.log(`[DEBUG] Request method: ${init?.method || 'GET'}`);
    console.log(`[DEBUG] Request headers:`, JSON.stringify(fetchOptions.headers));
    
    fetch(input, fetchOptions)
      .then(response => {
        clearTimeout(timeoutId);
        console.log(`[DEBUG] Fetch response status: ${response.status}`);
        
        // Log response headers for debugging
        const headers: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          headers[key] = value;
        });
        console.log(`[DEBUG] Response headers:`, JSON.stringify(headers));
        
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error('[DEBUG] Fetch error:', error);
        console.error('[DEBUG] Error type:', error.name);
        console.error('[DEBUG] Error message:', error.message);
        
        // Check if it's a network connectivity issue
        if (error.message && error.message.includes('Network request failed')) {
          console.error('[DEBUG] Network connectivity issue detected. Please check your internet connection and ensure you can reach the Supabase server.');
        }
        
        reject(error);
      });
  });
};

// Create the basic Supabase client with custom fetch
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: customFetch,
  }
});

// Create admin client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    fetch: customFetch,
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`
    }
  }
});

// Simple function to test Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // First, test if the domain is reachable with a simple fetch
    try {
      console.log(`[DEBUG] Testing direct fetch to ${supabaseUrl}`);
      const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log(`[DEBUG] Direct fetch status: ${response.status}`);
    } catch (fetchError: any) {
      console.error('[DEBUG] Direct fetch test failed:', fetchError.message);
    }
    
    // Then try the actual Supabase auth check
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase connection error (session):', error);
      return { 
        success: false,
        error: 'Could not connect to Supabase: ' + error.message,
        details: error
      };
    }
    
    console.log('Connection test result:', data ? 'Success' : 'Failed');
    return { success: true };
  } catch (error: any) {
    console.error('Supabase connection error (exception):', error);
    return { 
      success: false,
      error: 'Could not connect to Supabase server. Please check your internet connection.',
      details: error.message || 'Unknown error'
    };
  }
};

// Helper function to check auth state
export const checkUser = async () => {
  try {
    console.log('Checking user status...');
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking session:', error);
      throw error;
    }
    
    if (session?.user) {
      console.log('User is logged in:', session.user.id);
      await AsyncStorage.setItem('uid', session.user.id);
      return session.user;
    }
    console.log('No user session found');
    return null;
  } catch (error: any) {
    console.error('Error checking user:', error.message);
    return null;
  }
};

// Export JWT secret for reference (not used directly in client code)
export const SUPABASE_JWT_SECRET = jwtSecret; 