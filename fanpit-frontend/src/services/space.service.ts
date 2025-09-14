import { apiService } from './api.service';
import { API_CONFIG } from '@/config/api.config';
import type { Space, CreateSpaceRequest, PaginatedResponse, ApiResponse } from '@/types/api.types';

class SpaceService {
  async getSpaces(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Space>> {
    try {
      const response = await apiService.get<PaginatedResponse<Space>>(`${API_CONFIG.endpoints.spaces.list}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching spaces:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch spaces');
    }
  }

  async getMySpaces(filters: {
    page?: number;
    limit?: number;
    search?: string;
    type?: 'event' | 'experience';
    capacity?: number;
  } = {}): Promise<PaginatedResponse<Space>> {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        type,
        capacity
      } = filters;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) queryParams.append('search', search);
      if (type) queryParams.append('type', type);
      if (capacity) queryParams.append('capacity', capacity.toString());

      const response = await apiService.get<PaginatedResponse<Space>>(
        `${API_CONFIG.endpoints.spaces.my}?${queryParams.toString()}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching my spaces:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch your spaces');
    }
  }

  async getSpaceById(id: string): Promise<Space> {
    try {
      const response = await apiService.get<Space>(API_CONFIG.endpoints.spaces.details(id));
      return response.data;
    } catch (error: any) {
      console.error('Error fetching space:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch space');
    }
  }

  async createSpace(data: CreateSpaceRequest): Promise<Space> {
    try {
      console.log('Creating space with data:', data);
      const response = await apiService.post<Space>(API_CONFIG.endpoints.spaces.create, data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating space:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create space');
    }
  }

  async updateSpace(id: string, data: Partial<CreateSpaceRequest>): Promise<Space> {
    try {
      const response = await apiService.patch<Space>(API_CONFIG.endpoints.spaces.update(id), data);
      return response.data;
    } catch (error: any) {
      console.error('Error updating space:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update space');
    }
  }

  async deleteSpace(id: string): Promise<void> {
    try {
      await apiService.delete(API_CONFIG.endpoints.spaces.delete(id));
    } catch (error: any) {
      console.error('Error deleting space:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete space');
    }
  }

  async uploadImage(file: FormData): Promise<string> {
    try {
      const response = await apiService.post<{ url: string }>('/api/upload/image', file);
      return response.data.url;
    } catch (error: any) {
      console.error('Error uploading image:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message || 'Failed to upload image');
    }
  }
}

export const spaceService = new SpaceService();
