import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function DebugScreen() {
  const { user, forceLogout } = useAuth();

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      await forceLogout();
      Alert.alert('Success', 'All data cleared! App will restart.');
      // Force app to reload
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear data');
    }
  };

  const showStoredData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const user = await AsyncStorage.getItem('user');
      
      Alert.alert('Stored Data', `Token: ${token ? 'EXISTS' : 'NONE'}\nUser: ${user ? 'EXISTS' : 'NONE'}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to read stored data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Debug Screen</Text>
      
      <Text style={styles.info}>
        Current User: {user ? user.name : 'Not logged in'}
      </Text>

      <TouchableOpacity style={styles.button} onPress={showStoredData}>
        <Text style={styles.buttonText}>Show Stored Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={clearAllData}>
        <Text style={styles.buttonText}>Clear All Data</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
