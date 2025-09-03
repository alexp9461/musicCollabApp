import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

const testUsers = [
  { email: 'alex.guitar@test.com', password: 'test123', name: 'Alex - Lead Guitarist' },
  { email: 'sarah.vocals@test.com', password: 'test123', name: 'Sarah - Pop Singer' },
  { email: 'mike.drums@test.com', password: 'test123', name: 'Mike - Jazz Drummer' },
  { email: 'emma.producer@test.com', password: 'test123', name: 'Emma - Hip Hop Producer' },
  { email: 'james.bass@test.com', password: 'test123', name: 'James - Rock Bassist' },
  { email: 'lily.piano@test.com', password: 'test123', name: 'Lily - Classical Pianist' },
  { email: 'carlos.rapper@test.com', password: 'test123', name: 'Carlos - Rapper' },
  { email: 'sophie.violin@test.com', password: 'test123', name: 'Sophie - Violinist' },
  { email: 'ryan.dj@test.com', password: 'test123', name: 'Ryan - Electronic DJ' },
  { email: 'zoe.songwriter@test.com', password: 'test123', name: 'Zoe - Indie Songwriter' },
];

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTestUsers, setShowTestUsers] = useState(false);
  const { login, forceLogout } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔐 Attempting login with:', email);
      await login(email, password);
      console.log('✅ Login successful');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Something went wrong';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid request';
        } else {
          errorMessage = error.response.data?.message || 'Server error';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestUserSelect = (testUser: any) => {
    setEmail(testUser.email);
    setPassword(testUser.password);
    setShowTestUsers(false);
  };

  const clearStoredAuth = async () => {
    try {
      await forceLogout();
      Alert.alert('Success', 'Stored authentication cleared! You should now see the login screen.');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear stored auth');
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Music Collab</Text>
            <Text style={styles.subtitle}>Find your next musical partner</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#rgba(255,255,255,0.7)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#rgba(255,255,255,0.7)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.testButton}
                onPress={() => setShowTestUsers(true)}
              >
                <Text style={styles.testButtonText}>
                  🎵 Use Test User
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.debugButton}
                onPress={clearStoredAuth}
              >
                <Text style={styles.debugButtonText}>
                  🔧 Clear Stored Auth (Debug)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push('/(auth)/register')}
              >
                <Text style={styles.linkText}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showTestUsers}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowTestUsers(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Test User</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowTestUsers(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={testUsers}
            keyExtractor={(item) => item.email}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.testUserItem}
                onPress={() => handleTestUserSelect(item)}
              >
                <Text style={styles.testUserName}>{item.name}</Text>
                <Text style={styles.testUserEmail}>{item.email}</Text>
              </TouchableOpacity>
            )}
            style={styles.testUsersList}
          />
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 50,
  },
  form: {
    gap: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: 'white',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  button: {
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    paddingVertical: 15,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  testButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  testUsersList: {
    flex: 1,
  },
  testUserItem: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  testUserEmail: {
    fontSize: 14,
    color: '#666',
  },
  debugButton: {
    backgroundColor: 'rgba(255,140,0,0.2)',
    borderRadius: 25,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,140,0,0.4)',
  },
  debugButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
