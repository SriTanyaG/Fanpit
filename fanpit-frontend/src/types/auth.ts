export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'attendee' | 'brand_owner';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  hasRole: (role: string | string[]) => boolean;
  isAdmin: () => boolean;
  isBrandOwner: () => boolean;
  isAttendee: () => boolean;
}
