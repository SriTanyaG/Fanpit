import { apiService } from './api.service';
import { API_CONFIG } from '@/config/api.config';
import type { Booking, CreateBookingRequest, PaginatedResponse } from '@/types/api.types';

class BookingService {
  async getBookings(filters: {
    page?: number;
    limit?: number;
    status?: 'confirmed' | 'cancelled';
  } = {}): Promise<PaginatedResponse<Booking>> {
    try {
      const {
        page = 1,
        limit = 10,
        status
      } = filters;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (status) queryParams.append('status', status);

      const response = await apiService.get<{ success: boolean; data: PaginatedResponse<Booking> }>(
        `${API_CONFIG.endpoints.bookings.list}?${queryParams.toString()}`
      );
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching bookings:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch bookings');
    }
  }

  async getMyBookings(filters: {
    page?: number;
    limit?: number;
    status?: 'confirmed' | 'cancelled';
  } = {}): Promise<PaginatedResponse<Booking>> {
    try {
      const {
        page = 1,
        limit = 10,
        status
      } = filters;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (status) queryParams.append('status', status);

      const response = await apiService.get<{ success: boolean; data: PaginatedResponse<Booking> }>(
        `${API_CONFIG.endpoints.bookings.myBookings}?${queryParams.toString()}`
      );
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching my bookings:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch your bookings');
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await apiService.get<{ success: boolean; data: Booking }>(API_CONFIG.endpoints.bookings.details(id));
      return response.data.data;
    } catch (error: any) {
      console.error('Error fetching booking details:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch booking details');
    }
  }

  async createBooking(data: CreateBookingRequest): Promise<Booking> {
    try {
      console.log('Creating booking with data:', data);
      const response = await apiService.post<{ success: boolean; data: Booking }>(API_CONFIG.endpoints.bookings.create, data);
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating booking:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create booking');
    }
  }

  async cancelBooking(id: string): Promise<Booking> {
    try {
      const response = await apiService.post<{ success: boolean; data: Booking }>(API_CONFIG.endpoints.bookings.cancel(id), {});
      return response.data.data;
    } catch (error: any) {
      console.error('Error cancelling booking:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to cancel booking');
    }
  }
}

export const bookingService = new BookingService();