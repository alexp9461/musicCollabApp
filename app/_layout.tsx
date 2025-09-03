import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, TouchableOpacity, View } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function AppNavigator() {
  const { user, isLoading } = useAuth();

  // Debug logging
  console.log('AppNavigator - isLoading:', isLoading, 'user:', user ? 'logged in' : 'not logged in');

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
        <Text style={{ fontSize: 18 }}>Loading...</Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 10 }}
          onPress={() => router.push('/debug')}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>🔧 Debug Screen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
      <Stack.Screen name="debug" options={{ headerShown: true, title: 'Debug' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AppNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
