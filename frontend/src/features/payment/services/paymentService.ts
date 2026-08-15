// Razorpay Payment Integration for India
// This is a frontend integration - backend verification needed in production

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number; // in rupees
  currency: string;
  orderId: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email?: string;
    contact: string;
  };
  notes?: {
    bookingId: string;
    serviceType: string;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

class PaymentServiceClass {
  private RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SAMPLE_KEY';
  private isScriptLoaded = false;

  // Load Razorpay script
  async loadRazorpayScript(): Promise<boolean> {
    if (this.isScriptLoaded) return true;

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.isScriptLoaded = true;
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  // Create order (in production, this should call backend API)
  async createOrder(amount: number, bookingId: string): Promise<{ orderId: string; amount: number }> {
    // In development mode, generate mock order ID
    if (import.meta.env.DEV || !import.meta.env.VITE_RAZORPAY_KEY_ID) {
      return {
        orderId: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount * 100, // Convert to paise
      };
    }

    // In production, call your backend API to create Razorpay order
    try {
      const response = await fetch('/api/create-payment-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, bookingId }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const data = await response.json();
      return {
        orderId: data.orderId,
        amount: data.amount,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Initialize payment
  async initiatePayment(options: PaymentOptions): Promise<PaymentResult> {
    // Load Razorpay script
    const loaded = await this.loadRazorpayScript();
    if (!loaded) {
      return {
        success: false,
        error: 'Failed to load payment gateway. Please try again.',
      };
    }

    // Development mode - simulate payment
    if (import.meta.env.DEV || !import.meta.env.VITE_RAZORPAY_KEY_ID) {
      return new Promise((resolve) => {
        const mockPayment = confirm(
          `[DEV MODE] Simulate Payment\n\nAmount: ₹${options.amount}\nService: ${options.description}\n\nClick OK to simulate successful payment, Cancel to simulate failure.`
        );

        if (mockPayment) {
          resolve({
            success: true,
            paymentId: `pay_mock_${Date.now()}`,
            orderId: options.orderId,
            signature: 'mock_signature',
          });
        } else {
          resolve({
            success: false,
            error: 'Payment cancelled by user',
          });
        }
      });
    }

    // Production mode - actual Razorpay integration
    return new Promise((resolve) => {
      const razorpayOptions = {
        key: this.RAZORPAY_KEY_ID,
        amount: options.amount * 100, // Convert to paise
        currency: options.currency,
        name: 'VisvasaHome',
        description: options.description,
        order_id: options.orderId,
        prefill: options.prefill,
        notes: options.notes,
        theme: {
          color: '#2563eb', // Blue-600
        },
        handler: (response: any) => {
          // Payment successful
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            // Payment cancelled
            resolve({
              success: false,
              error: 'Payment cancelled by user',
            });
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    });
  }

  // Verify payment (should be done on backend in production)
  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    // In development, return true
    if (import.meta.env.DEV || !import.meta.env.VITE_RAZORPAY_KEY_ID) {
      console.log('[DEV MODE] Payment verification simulated as successful');
      return true;
    }

    // In production, verify on backend
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, orderId, signature }),
      });

      const data = await response.json();
      return data.verified === true;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }

  // Format amount for display
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export const PaymentService = new PaymentServiceClass();
