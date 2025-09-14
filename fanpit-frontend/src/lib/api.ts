import axios from 'axios';
import { API_CONFIG } from '@/config/api.config';

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling cookies
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post(API_CONFIG.endpoints.auth.login, {
      email,
      password,
    });
    return response.data;
  },

  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post(API_CONFIG.endpoints.auth.register, data);
    return response.data;
  },
};

// User API
export const userApi = {
  getCurrentUser: async () => {
    const response = await api.get(API_CONFIG.endpoints.users.me);
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.patch(API_CONFIG.endpoints.users.profile, data);
    return response.data;
  },
};

// Spaces API
export const spacesApi = {
  getSpaces: async () => {
    const response = await api.get(API_CONFIG.endpoints.spaces.list);
    return response.data;
  },

  getSpaceById: async (id: string) => {
    const response = await api.get(API_CONFIG.endpoints.spaces.details(id));
    return response.data;
  },
};

// Bookings API
export const bookingsApi = {
  createBooking: async (data: any) => {
    const response = await api.post(API_CONFIG.endpoints.bookings.create, data);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get(API_CONFIG.endpoints.bookings.myBookings);
    return response.data;
  },
};