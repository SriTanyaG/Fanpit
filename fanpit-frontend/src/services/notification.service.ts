import { apiService } from './api.service';
import { API_CONFIG } from '@/config/api.config';
import type { Notification, PaginatedResponse } from '@/types/api.types';

class NotificationService {
  async getNotifications(filters: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
  } = {}): Promise<PaginatedResponse<Notification>> {
    const {
      page = 1,
      limit = 10,
      type,
      isRead
    } = filters;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (type) queryParams.append('type', type);
    if (isRead !== undefined) queryParams.append('isRead', isRead.toString());

    const response = await apiService.get<PaginatedResponse<Notification>>(
      `${API_CONFIG.endpoints.notifications.list}?${queryParams.toString()}`
    );
    return response.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiService.get<{ count: number }>(
      API_CONFIG.endpoints.notifications.unreadCount
    );
    return response.data.count;
  }

  async markAsRead(id: string): Promise<Notification> {
    const response = await apiService.post<Notification>(
      API_CONFIG.endpoints.notifications.markAsRead(id)
    );
    return response.data;
  }

  async markAllAsRead(): Promise<void> {
    await apiService.post(API_CONFIG.endpoints.notifications.markAllAsRead);
  }
}

export const notificationService = new NotificationService();
