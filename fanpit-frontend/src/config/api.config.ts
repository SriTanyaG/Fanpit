export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      me: '/api/auth/me',
      profile: '/api/auth/profile',
    },
    users: {
      me: '/api/users/me',
      profile: '/api/users/profile',
    },
    spaces: {
      list: '/api/spaces',
      details: (id: string) => `/api/spaces/${id}`,
      create: '/api/spaces',
      update: (id: string) => `/api/spaces/${id}`,
      delete: (id: string) => `/api/spaces/${id}`,
      my: '/api/spaces/my',
    },
    bookings: {
      create: '/api/bookings',
      list: '/api/bookings',
      myBookings: '/api/bookings/my',
      details: (id: string) => `/api/bookings/${id}`,
      cancel: (id: string) => `/api/bookings/${id}/cancel`,
    },
    comments: {
      create: '/api/comments',
      list: (spaceId: string) => `/api/comments/${spaceId}`,
      update: (id: string) => `/api/comments/${id}`,
      delete: (id: string) => `/api/comments/${id}`,
    },
    notifications: {
      list: '/api/notifications',
      unreadCount: '/api/notifications/unread-count',
      markAsRead: (id: string) => `/api/notifications/${id}/read`,
      markAllAsRead: '/api/notifications/read-all',
    },
    payments: {
      createOrder: '/api/payments/create-order',
      verify: '/api/payments/verify',
    },
    reviews: {
      list: '/api/reviews',
      create: '/api/reviews',
      details: (id: string) => `/api/reviews/${id}`,
      update: (id: string) => `/api/reviews/${id}`,
      delete: (id: string) => `/api/reviews/${id}`,
      spaceRating: (spaceId: string) => `/api/reviews/space/${spaceId}/rating`,
    },
    upload: {
      image: '/api/upload/image',
      images: '/api/upload/images',
    },
  },
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};