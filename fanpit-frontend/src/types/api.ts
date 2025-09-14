export interface ApiError {
  message: string;
  statusCode: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Space types
export interface Space {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  images: string[];
  location: string;
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface Booking {
  id: string;
  spaceId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  space?: Space;
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  userId: string;
  spaceId: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
  };
}
