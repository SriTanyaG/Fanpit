'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import type { User, AuthContextType, LoginCredentials, RegisterData } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);
  
  // Re-check auth when window is focused (helps with persistence)
  useEffect(() => {
    const handleFocus = () => {
      checkAuth();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const checkAuth = async () => {
    try {
      // Check if we're on the client side
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
          
          // Ensure cookies are set (in case they expired)
          document.cookie = `token=${token}; path=/; max-age=86400`; // 24 hours
          document.cookie = `user_role=${userData?.role || 'attendee'}; path=/; max-age=86400`;
        } catch (profileError) {
          console.error('Profile fetch failed:', profileError);
          // Token might be invalid, clear everything
          localStorage.removeItem('token');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      
      // Ensure user object has all required properties
      if (response.user && response.access_token) {
        // Store token in localStorage for API calls
        localStorage.setItem('token', response.access_token);
        
        // Set user state
        setUser(response.user);
        
        // Set cookies for middleware with secure flags
        const cookieOptions = 'path=/; max-age=86400; SameSite=Strict';
        document.cookie = `token=${response.access_token}; ${cookieOptions}`;
        document.cookie = `user_role=${response.user?.role || 'attendee'}; ${cookieOptions}`;
        
        // Redirect based on role
        if (response.user?.role === 'brand_owner') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login');
      throw error;
    }
  };

  const register = async (data: { email: string; password: string; name: string; role?: string }) => {
    try {
      setError(null);
      const response = await authService.register(data);
      
      // Ensure user object has all required properties
      if (response.user && response.access_token) {
        // Store token in localStorage for API calls
        localStorage.setItem('token', response.access_token);
        
        // Set user state
        setUser(response.user);
        
        // Set cookies for middleware with secure flags
        const cookieOptions = 'path=/; max-age=86400; SameSite=Strict';
        document.cookie = `token=${response.access_token}; ${cookieOptions}`;
        document.cookie = `user_role=${response.user?.role || 'attendee'}; ${cookieOptions}`;
        
        // Redirect based on role
        if (response.user?.role === 'brand_owner') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register');
      throw error;
    }
  };

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        // Clear localStorage
        localStorage.removeItem('token');
        
        // Clear cookies with proper attributes
        const expiry = 'path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
        document.cookie = `token=; ${expiry}`;
        document.cookie = `user_role=; ${expiry}`;
        
        // Also try clearing without SameSite for older browsers
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      // Clear user state
      setUser(null);
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect to login even if there was an error
      router.push('/login');
    }
  };

  const hasRole = (role: string | string[]) => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole('admin');
  const isBrandOwner = () => hasRole('brand_owner');
  const isAttendee = () => hasRole('attendee');

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        register, 
        logout, 
        setUser,
        hasRole,
        isAdmin,
        isBrandOwner,
        isAttendee
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}