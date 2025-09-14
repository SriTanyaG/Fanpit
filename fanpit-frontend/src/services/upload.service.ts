import { apiService } from './api.service';
import { API_CONFIG } from '@/config/api.config';

class UploadService {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiService.api.post<{ url: string }>(
      API_CONFIG.endpoints.upload.image,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.url;
  }

  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await apiService.api.post<{ urls: string[] }>(
      API_CONFIG.endpoints.upload.images,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data.urls;
  }
}

export const uploadService = new UploadService();
