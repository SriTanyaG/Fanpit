import { apiService } from './api.service';
import { API_CONFIG } from '@/config/api.config';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types/api.types';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(API_CONFIG.endpoints.auth.login, credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      // Set token in API service for immediate use
      apiService.setAuthToken(response.data.access_token);
    }
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Ensure role is explicitly set if provided
    const requestData = {
      ...data,
      role: data.role || 'attendee' // Make sure role is explicitly included
    };
    
    const response = await apiService.post<AuthResponse>(API_CONFIG.endpoints.auth.register, requestData);
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      // Set token in API service for immediate use
      apiService.setAuthToken(response.data.access_token);
    }
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await apiService.get<User>(API_CONFIG.endpoints.auth.me);
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiService.patch<User>(API_CONFIG.endpoints.users.profile, data);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    // Clear token in API service
    apiService.setAuthToken('');
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/login';
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export const authService = new AuthService();