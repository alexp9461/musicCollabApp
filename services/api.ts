import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthResponse, User } from '../types/user';

const API_BASE_URL = 'https://musiccollab-api-production.up.railway.app/api'; // Change this to your deployed URL: https://your-app.railway.app/api

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    age: number;
    bio?: string;
    location: {
      city: string;
      state: string;
      country: string;
    };
    skills: any[];
    genres?: string[];
    lookingFor?: string[];
  }): Promise<AuthResponse> => {
    console.log('🌐 API: Making registration request to:', `${API_BASE_URL}/auth/register`);
    console.log('🌐 API: Request data:', JSON.stringify(userData, null, 2));
    
    try {
      const response = await api.post('/auth/register', userData);
      console.log('🌐 API: Registration response received:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('🌐 API: Registration request failed:', error);
      if (error.response) {
        console.error('🌐 API: Error response:', error.response.data);
      }
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

export const userAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<{ user: User }> => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  getDiscoverUsers: async (): Promise<User[]> => {
    const response = await api.get('/users/discover');
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
};

export const swipeAPI = {
  swipeAction: async (targetUserId: string, action: 'like' | 'pass'): Promise<{
    message: string;
    isMatch: boolean;
    isNewNotification: boolean;
    matchedUser?: User;
  }> => {
    const response = await api.post('/swipe/action', { targetUserId, action });
    return response.data;
  },

  getMatches: async (): Promise<User[]> => {
    const response = await api.get('/swipe/matches');
    return response.data;
  },

  getPendingLikes: async (): Promise<{
    pendingLikes: User[];
    count: number;
  }> => {
    const response = await api.get('/swipe/pending-likes');
    return response.data;
  },
};

export default api;
