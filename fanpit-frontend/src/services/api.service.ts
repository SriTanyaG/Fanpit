import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiError, ApiResponse } from '@/types/api.types';

class ApiService {
  public api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.baseURL,
      headers: API_CONFIG.headers,
      withCredentials: true,
    });

    this.setupInterceptors();
  }
  
  // Method to set auth token directly (useful after login/register)
  public setAuthToken(token: string): void {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Try to get token from localStorage first
        let token = localStorage.getItem('token');
        
        // If no token in localStorage, try to get from cookie
        if (!token && typeof document !== 'undefined') {
          const tokenCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='));
          
          if (tokenCookie) {
            token = tokenCookie.split('=')[1];
            // Store in localStorage for future requests
            localStorage.setItem('token', token);
          }
        }
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): Error {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.data) {
      const apiError = error.response.data;
      if (apiError.errors) {
        // Handle Zod validation errors
        const errors = Object.values(apiError.errors).flat();
        return new Error(errors.join(', '));
      }
      return new Error(apiError.message || 'An error occurred');
    }
    return error;
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    console.log('API POST request to:', url);
    console.log('API POST data:', data);
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data);
    console.log('API POST response:', response.data);
    return response.data;
  }

  async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data);
    return response.data;
  }

  async patch<T>(url: string, data: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService();
