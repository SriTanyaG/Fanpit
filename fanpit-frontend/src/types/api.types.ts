// Base API types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Location types
export interface Location {
  coordinates: [number, number]; // [longitude, latitude]
}

// Pricing types
export interface PeakHour {
  dayOfWeek: number;
  startHour: number;
  endHour: number;
  multiplier: number;
}

export interface TimeBlock {
  hours: number;
  price: number;
  description: string;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  validFrom: string;
  validUntil: string;
  maxUses: number;
  currentUses: number;
}

export interface SpecialEvent {
  name: string;
  date: string;
  price: number;
  description: string;
}

// Space types
export interface Space {
  id: string;
  name: string;
  description: string;
  address: string;
  location: Location;
  capacity: number;
  amenities: string[];
  images: string[];
  type: 'event' | 'experience';
  owner: User;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  
  // Pricing fields
  isFree: boolean;
  basePrice: number;
  dayRate: number;
  peakHours: PeakHour[];
  timeBlocks: TimeBlock[];
  monthlyPassPrice?: number;
  promoCodes: PromoCode[];
  specialEvents: SpecialEvent[];
  
  // Reservation Workflow fields
  dynamicPricing: boolean;
  minBookingDuration: number;
  maxBookingDuration: number;
  advanceBookingDays: number;
  cancellationPolicy: '24h' | '48h' | '7d' | 'no';
  availabilityCalendar: Record<string, any>;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpaceRequest {
  name: string;
  description: string;
  address: string;
  location: Location;
  capacity: number;
  amenities: string[];
  images: string[];
  type: 'event' | 'experience';
  
  // Pricing fields
  isFree: boolean;
  basePrice: number;
  dayRate: number;
  peakHours: PeakHour[];
  timeBlocks: TimeBlock[];
  monthlyPassPrice?: number;
  promoCodes: PromoCode[];
  specialEvents: SpecialEvent[];
  
  // Reservation Workflow fields
  dynamicPricing: boolean;
  minBookingDuration: number;
  maxBookingDuration: number;
  advanceBookingDays: number;
  cancellationPolicy: '24h' | '48h' | '7d' | 'no';
  availabilityCalendar: Record<string, any>;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'attendee' | 'brand_owner';
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Booking types
export interface Booking {
  id: string;
  user: User;
  space: Space;
  date: string;
  seats: number;
  status: 'confirmed' | 'cancelled';
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  spaceId: string;
  date: string;
  seats: number;
  amount: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

// Payment types
export interface PaymentOrderResponse {
  order: {
    id: string;
    amount: number;
    currency: string;
  };
}

export interface PaymentVerificationRequest {
  paymentId: string;
  signature: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
}

// Comment types
export interface Comment {
  id: string;
  user: User;
  space: Space;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  user: User;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'cancellation' | 'reminder' | 'general';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// Review types
export interface Review {
  id: string;
  user: User;
  space: Space;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  spaceId: string;
  rating: number;
  comment: string;
  images?: string[];
}