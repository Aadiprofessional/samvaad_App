import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import UnityView from 'react-native-unity-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type UnityTestProps = {
  navigation: any;
  route: any;
};

const UnityTest = ({ navigation }: UnityTestProps) => {
  const [isUnityReady, setIsUnityReady] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const unityRef = useRef<UnityView>(null);

  // Set up a listener for when Unity is ready
  useEffect(() => {
    addLog('Waiting for Unity to initialize...');
    
    // Simulating Unity load completion after a delay (for testing without actual Unity)
    const timer = setTimeout(() => {
      addLog('Unity loaded successfully (simulated)');
      setIsUnityReady(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleUnityMessage = (message: any) => {
    try {
      const { name, data } = message;
      addLog(`Unity Message - ${name}: ${data}`);
      
      // You can add specific message handling here
    } catch (error) {
      addLog(`Error handling Unity message: ${error}`);
    }
  };

  const addLog = (message: string) => {
    setLogs((prevLogs) => [...prevLogs.slice(-9), message]);
  };

  const testUnityConnection = () => {
    if (!unityRef.current) {
      Alert.alert('Unity not ready', 'Unity view is not initialized');
      return;
    }

    try {
      // Send a test message to Unity
      unityRef.current.postMessage('GameController', 'TestConnection', 'Hello from React Native');
      addLog('Test message sent to Unity');
    } catch (error) {
      addLog(`Error sending message to Unity: ${error}`);
    }
  };

  const testGameInitialization = () => {
    if (!unityRef.current) {
      Alert.alert('Unity not ready', 'Unity view is not initialized');
      return;
    }

    try {
      // Create sample level data
      const levelData = {
        level: 1,
        pairs: [
          { id: 1, symbol: 'A', meaning: 'Apple' },
          { id: 2, symbol: 'B', meaning: 'Ball' },
          { id: 3, symbol: 'C', meaning: 'Cat' },
        ]
      };
      
      unityRef.current.postMessage('GameController', 'InitializeGame', JSON.stringify(levelData));
      addLog('Game initialization data sent to Unity');
    } catch (error) {
      addLog(`Error sending game init data to Unity: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#6200EE" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Unity Integration Test</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.unityContainer}>
          <UnityView
            ref={unityRef}
            style={styles.unityView}
            onMessage={handleUnityMessage}
            onUnityMessage={handleUnityMessage}
          />
        </View>

        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.button, !isUnityReady && styles.buttonDisabled]} 
            onPress={testUnityConnection}
            disabled={!isUnityReady}
          >
            <LinearGradient
              colors={['#6a11cb', '#2575fc']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Test Connection</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, !isUnityReady && styles.buttonDisabled]} 
            onPress={testGameInitialization}
            disabled={!isUnityReady}
          >
            <LinearGradient
              colors={['#FF9A8B', '#FF6A88']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Test Game Initialization</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.logs}>
          <Text style={styles.logsTitle}>Unity Communication Logs:</Text>
          {logs.length === 0 ? (
            <Text style={styles.emptyLogs}>No logs yet. Test the Unity connection first.</Text>
          ) : (
            logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {index + 1}. {log}
              </Text>
            ))
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  backButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  unityContainer: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  unityView: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    width: '48%',
    height: 45,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logs: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
  },
  logsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  emptyLogs: {
    color: '#999999',
    fontStyle: 'italic',
  },
  logText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});

export default UnityTest; 