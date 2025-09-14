import { api } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const userService = {
  async getCurrentUser() {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>) {
    const response = await api.patch('/api/users/me', data);
    return response.data;
  },

  async getBookings() {
    const response = await api.get('/api/users/me/bookings');
    return response.data;
  },
};
