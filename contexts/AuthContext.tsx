import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  forceLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    console.log('🔍 Checking auth state...');
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');
      
      console.log('📱 Stored token exists:', !!storedToken);
      console.log('👤 Stored user exists:', !!storedUser);
      
      if (storedToken && storedUser) {
        console.log('🔄 Validating stored token with backend...');
        try {
          // Validate token with backend
          const response = await authAPI.validateToken();
          console.log('✅ Token validated with backend');
          
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.log('❌ Token validation failed, clearing auth data');
          // Token is invalid or expired, clear it
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      } else {
        console.log('❌ No stored auth data found');
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error checking auth state:', error);
      // Clear invalid auth data on error
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      console.log('🏁 Auth check complete, setting loading to false');
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setIsLoading(true);
      console.log('🔐 AuthContext: Starting registration...');
      
      const response = await authAPI.register(userData);
      console.log('🔐 AuthContext: Registration API response received');
      
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      
      setToken(response.token);
      setUser(response.user);
      
      console.log('🔐 AuthContext: User logged in successfully');
    } catch (error) {
      console.error('🔐 AuthContext: Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🔐 Logging out user...');
      setIsLoading(true);
      
      // Clear local storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      
      // Clear state
      setToken(null);
      setUser(null);
      
      console.log('✅ Logout complete');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const forceLogout = async () => {
    try {
      console.log('Force logout - clearing all auth data');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error during force logout:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    forceLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
