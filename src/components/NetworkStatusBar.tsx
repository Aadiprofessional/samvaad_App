import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { testSupabaseConnection } from '../services/supabaseClient';

interface NetworkStatusBarProps {
  onRetry?: () => void;
}

const NetworkStatusBar: React.FC<NetworkStatusBarProps> = ({ onRetry }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);
  const [showRetryButton, setShowRetryButton] = useState(false);

  useEffect(() => {
    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log('Network state changed:', state);
      
      // We'll set state based on the NetInfo initially
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      
      // If disconnected or unreachable, show the retry button after a short delay
      if (!state.isConnected || state.isInternetReachable === false) {
        setTimeout(() => setShowRetryButton(true), 3000);
      } else {
        setShowRetryButton(false);
      }
      
      // But if we're connected but don't know if internet is reachable,
      // or if isInternetReachable is false, perform our enhanced check
      if (state.isConnected && 
          (state.isInternetReachable === null || state.isInternetReachable === false)) {
        performConnectivityCheck();
      }
    });

    // Initial connectivity check
    performConnectivityCheck();

    return () => {
      unsubscribe();
    };
  }, []);
  
  // Perform a direct Supabase connectivity check
  const performConnectivityCheck = async () => {
    try {
      const result = await testSupabaseConnection();
      setIsInternetReachable(!result.error);
      if (result.error) {
        setTimeout(() => setShowRetryButton(true), 3000);
      }
    } catch (error) {
      console.error('Error checking connectivity:', error);
      setIsInternetReachable(false);
      setTimeout(() => setShowRetryButton(true), 3000);
    }
  };

  const handleRetry = () => {
    setShowRetryButton(false);
    performConnectivityCheck();
    if (onRetry) onRetry();
  };

  // Don't show anything if we think we're connected and have internet
  if ((isConnected === true && isInternetReachable === true) || 
      (isConnected === null && isInternetReachable === null)) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Icon 
        name={isConnected ? 'wifi-off' : 'wifi-strength-off-outline'} 
        size={24} 
        color="#FFF" 
      />
      <Text style={styles.text}>
        {!isConnected 
          ? 'No network connection' 
          : isInternetReachable === false 
            ? 'Unable to connect to server'
            : 'Checking connection...'}
      </Text>
      {showRetryButton && (
        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: 'center'
  },
  text: {
    color: 'white',
    marginLeft: 8,
    fontWeight: '500'
  },
  retryButton: {
    marginLeft: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12
  }
});

export default NetworkStatusBar; 