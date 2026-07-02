// Razorpay Payment Integration for VisvasaHome

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentDetails {
  bookingId: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  serviceName: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

// Load Razorpay script dynamically
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if script is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order on backend
export const createRazorpayOrder = async (
  amount: number,
  bookingId: string
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    // In production, this would be an API call to your backend
    // Backend would create order using Razorpay API and return order_id

    // For demo purposes, we'll simulate the response
    // In real implementation: POST /api/payment/create-order
    await new Promise(resolve => setTimeout(resolve, 500));

    const demoOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      orderId: demoOrderId
    };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return {
      success: false,
      error: 'Failed to create payment order'
    };
  }
};

// Verify payment signature on backend
export const verifyPaymentSignature = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // In production, this would be an API call to your backend
    // Backend would verify signature using Razorpay secret key

    // For demo purposes, we'll simulate successful verification
    // In real implementation: POST /api/payment/verify
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      success: true
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error: 'Failed to verify payment'
    };
  }
};

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (
  paymentDetails: PaymentDetails
): Promise<PaymentResult> => {
  // Load Razorpay script
  const scriptLoaded = await loadRazorpayScript();

  if (!scriptLoaded) {
    return {
      success: false,
      error: 'Failed to load Razorpay. Please check your internet connection.'
    };
  }

  // Create order on backend
  const orderResult = await createRazorpayOrder(
    paymentDetails.amount,
    paymentDetails.bookingId
  );

  if (!orderResult.success || !orderResult.orderId) {
    return {
      success: false,
      error: orderResult.error || 'Failed to create payment order'
    };
  }

  // Return promise that resolves when payment is complete
  return new Promise((resolve) => {
    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo_key', // Demo key for testing
      amount: paymentDetails.amount * 100, // Amount in paise
      currency: 'INR',
      name: 'VisvasaHome',
      description: paymentDetails.serviceName,
      order_id: orderResult.orderId,
      handler: async (response: RazorpayResponse) => {
        // Verify payment signature on backend
        const verificationResult = await verifyPaymentSignature(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        );

        if (verificationResult.success) {
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        } else {
          resolve({
            success: false,
            error: 'Payment verification failed'
          });
        }
      },
      prefill: {
        name: paymentDetails.customerName,
        email: paymentDetails.customerEmail,
        contact: paymentDetails.customerPhone
      },
      theme: {
        color: '#2563EB' // Blue color matching VisvasaHome theme
      },
      modal: {
        ondismiss: () => {
          resolve({
            success: false,
            error: 'Payment cancelled by user'
          });
        }
      }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  });
};

// Update booking payment status
export const updateBookingPaymentStatus = async (
  bookingId: string,
  paymentId: string,
  orderId: string,
  status: 'paid' | 'failed'
): Promise<boolean> => {
  try {
    // In production, this would update the booking in Supabase
    // await supabase.from('bookings').update({
    //   payment_status: status,
    //   payment_id: paymentId,
    //   payment_method: 'online',
    //   updated_at: new Date().toISOString()
    // }).eq('id', bookingId);

    // For demo purposes
    console.log('Updating booking payment status:', {
      bookingId,
      paymentId,
      orderId,
      status
    });

    return true;
  } catch (error) {
    console.error('Error updating booking payment status:', error);
    return false;
  }
};

// Process complete payment flow
export const processPayment = async (
  paymentDetails: PaymentDetails
): Promise<PaymentResult> => {
  try {
    // Initiate Razorpay payment
    const paymentResult = await initiateRazorpayPayment(paymentDetails);

    if (!paymentResult.success) {
      return paymentResult;
    }

    // Update booking with payment details
    const updateSuccess = await updateBookingPaymentStatus(
      paymentDetails.bookingId,
      paymentResult.paymentId!,
      paymentResult.orderId!,
      'paid'
    );

    if (!updateSuccess) {
      console.error('Failed to update booking, but payment was successful');
    }

    return paymentResult;
  } catch (error) {
    console.error('Error processing payment:', error);
    return {
      success: false,
      error: 'An unexpected error occurred during payment'
    };
  }
};

// Refund payment (admin function)
export const refundPayment = async (
  paymentId: string,
  amount?: number
): Promise<{ success: boolean; refundId?: string; error?: string }> => {
  try {
    // In production, this would call backend API to process refund via Razorpay
    // Backend would use Razorpay API: razorpay.payments.refund(paymentId, { amount })

    // For demo purposes
    await new Promise(resolve => setTimeout(resolve, 1000));

    const demoRefundId = `rfnd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      refundId: demoRefundId
    };
  } catch (error) {
    console.error('Error processing refund:', error);
    return {
      success: false,
      error: 'Failed to process refund'
    };
  }
};
