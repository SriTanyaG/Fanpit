import { apiService } from './api.service';
import { API_CONFIG } from '@/config/api.config';
import type { Review, CreateReviewRequest, PaginatedResponse } from '@/types/api.types';

class ReviewService {
  async getReviews(filters: {
    page?: number;
    limit?: number;
    spaceId?: string;
    userId?: string;
  } = {}): Promise<PaginatedResponse<Review>> {
    const {
      page = 1,
      limit = 10,
      spaceId,
      userId
    } = filters;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (spaceId) queryParams.append('spaceId', spaceId);
    if (userId) queryParams.append('userId', userId);

    const response = await apiService.get<PaginatedResponse<Review>>(
      `${API_CONFIG.endpoints.reviews.list}?${queryParams.toString()}`
    );
    return response.data;
  }

  async getReviewById(id: string): Promise<Review> {
    const response = await apiService.get<Review>(API_CONFIG.endpoints.reviews.details(id));
    return response.data;
  }

  async createReview(data: CreateReviewRequest): Promise<Review> {
    const response = await apiService.post<Review>(API_CONFIG.endpoints.reviews.create, data);
    return response.data;
  }

  async updateReview(id: string, data: Partial<CreateReviewRequest>): Promise<Review> {
    const response = await apiService.put<Review>(API_CONFIG.endpoints.reviews.update(id), data);
    return response.data;
  }

  async deleteReview(id: string): Promise<void> {
    await apiService.delete(API_CONFIG.endpoints.reviews.delete(id));
  }

  async getSpaceRating(spaceId: string): Promise<{ rating: number; count: number }> {
    const response = await apiService.get<{ rating: number; count: number }>(
      API_CONFIG.endpoints.reviews.spaceRating(spaceId)
    );
    return response.data;
  }
}

export const reviewService = new ReviewService();
