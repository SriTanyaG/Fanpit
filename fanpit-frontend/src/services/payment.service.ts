import { apiService } from './api.service';
import { API_CONFIG } from '@/config/api.config';

export interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

export interface PaymentVerificationData {
  paymentId: string;
  orderId: string;
  signature: string;
}

class PaymentService {
  async createOrder(amount: number, currency: string = 'INR') {
    try {
      const response = await apiService.post<{ data: { orderId: string; amount: number } }>(
        API_CONFIG.endpoints.payments.createOrder,
        { amount, currency }
      );
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating payment order:', error);
      throw new Error(error.message || 'Failed to create payment order');
    }
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string) {
    try {
      const response = await apiService.post<{ success: boolean; data: any }>(
        API_CONFIG.endpoints.payments.verify,
        { paymentId, orderId, signature }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      throw new Error(error.message || 'Failed to verify payment');
    }
  }

  async initializePayment(options: PaymentOptions) {
    try {
      // Check if Razorpay is available
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        throw new Error('Razorpay is not loaded');
      }
    } catch (error: any) {
      console.error('Error initializing payment:', error);
      throw new Error(error.message || 'Failed to initialize payment');
    }
  }
}

export const paymentService = new PaymentService();
