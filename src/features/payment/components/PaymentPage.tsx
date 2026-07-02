import { useState } from 'react';
import { CreditCard, Shield, Lock, CheckCircle, XCircle, Clock, ArrowLeft, Wallet, Smartphone, Building } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { processPayment, PaymentDetails, PaymentResult } from '@payment/services/payment';
import { calculateBookingCommission, COMMISSION_CONFIG } from '@professional/services/contractorService';

interface PaymentPageProps {
  bookingId: string;
  serviceName: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  onBack: () => void;
  onSuccess?: (paymentId: string) => void;
}

export function PaymentPage({
  bookingId,
  serviceName,
  amount,
  customerName,
  customerEmail,
  customerPhone,
  scheduledDate,
  scheduledTime,
  address,
  onBack,
  onSuccess
}: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [paymentError, setPaymentError] = useState('');

  const handleOnlinePayment = async () => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      const paymentDetails: PaymentDetails = {
        bookingId,
        amount,
        customerName,
        customerEmail,
        customerPhone,
        serviceName
      };

      const result: PaymentResult = await processPayment(paymentDetails);

      if (result.success) {
        setPaymentStatus('success');
        onSuccess?.(result.paymentId!);
      } else {
        setPaymentStatus('failed');
        setPaymentError(result.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('failed');
      setPaymentError('An unexpected error occurred. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashPayment = () => {
    setPaymentStatus('success');
    onSuccess?.('cash');
    // In production, this would update the booking to mark payment_method as 'cash'
    console.log('Booking confirmed with cash payment method');
  };

  const handleProceedToPayment = () => {
    if (paymentMethod === 'online') {
      handleOnlinePayment();
    } else {
      handleCashPayment();
    }
  };

  // Success Screen
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {paymentMethod === 'online' ? 'Payment Successful!' : 'Booking Confirmed!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {paymentMethod === 'online'
                ? 'Your payment has been processed successfully.'
                : 'Your booking has been confirmed. Please pay the professional at the time of service.'}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm font-semibold text-gray-900 mb-3">Booking Details</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-semibold text-gray-900">{bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold text-gray-900">{serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-semibold text-gray-900">{scheduledDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-semibold text-gray-900">{scheduledTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-green-600">₹{amount}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={onBack} className="w-full bg-[#2563EB] hover:bg-[#2563EB]">
                View Booking Details
              </Button>
              <Button onClick={onBack} variant="outline" className="w-full">
                Back to Home
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Failed Screen
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">{paymentError}</p>

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setPaymentStatus('pending');
                  setPaymentError('');
                }}
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]"
              >
                Try Again
              </Button>
              <Button onClick={onBack} variant="outline" className="w-full">
                Cancel & Go Back
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Payment Screen
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h1>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Method */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selection */}
            <Card className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>

              <div className="space-y-3">
                {/* Online Payment */}
                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === 'online'
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'online' ? 'border-[#2563EB]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'online' && (
                        <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                      )}
                    </div>
                    <CreditCard className="w-6 h-6 text-[#2563EB]" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Pay Online</p>
                      <p className="text-sm text-gray-600">UPI, Cards, Wallets & More</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-300 border text-xs">
                      Recommended
                    </Badge>
                  </div>
                </button>

                {/* Cash Payment */}
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cash' ? 'border-[#2563EB]' : 'border-gray-300'
                    }`}>
                      {paymentMethod === 'cash' && (
                        <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                      )}
                    </div>
                    <Wallet className="w-6 h-6 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Cash After Service</p>
                      <p className="text-sm text-gray-600">Pay the professional directly</p>
                    </div>
                  </div>
                </button>
              </div>
            </Card>

            {/* Online Payment Options Preview */}
            {paymentMethod === 'online' && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Available Payment Options</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Smartphone className="w-8 h-8 mx-auto mb-2 text-[#2563EB]" />
                    <p className="text-sm font-medium text-gray-900">UPI</p>
                    <p className="text-xs text-gray-500">GPay, PhonePe, etc.</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-[#2563EB]" />
                    <p className="text-sm font-medium text-gray-900">Cards</p>
                    <p className="text-xs text-gray-500">Debit & Credit</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Building className="w-8 h-8 mx-auto mb-2 text-[#2563EB]" />
                    <p className="text-sm font-medium text-gray-900">Net Banking</p>
                    <p className="text-xs text-gray-500">All major banks</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Security Info */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-[#2563EB] flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Secure Payment</h3>
                  <p className="text-sm text-gray-700">
                    Your payment information is encrypted and secure. We use Razorpay,
                    India's most trusted payment gateway.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                  <p className="font-semibold text-gray-900">{bookingId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Service</p>
                  <p className="font-semibold text-gray-900">{serviceName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-900">{scheduledDate}</p>
                    <p className="text-sm text-gray-600">{scheduledTime}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Address</p>
                  <p className="text-sm text-gray-900">{address}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Service Amount</span>
                  <span className="font-semibold text-gray-900">₹{amount}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Platform Commission ({(COMMISSION_CONFIG.standardBooking * 100).toFixed(0)}%)</span>
                  <span className="font-semibold text-orange-600">₹{calculateBookingCommission(amount).commission}</span>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  Platform fee is deducted from professional's payout, not charged extra to you.
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">You Pay</span>
                  <span className="font-bold text-2xl text-green-600">₹{amount}</span>
                </div>
              </div>

              <Button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="w-full bg-[#2563EB] hover:bg-[#2563EB]"
              >
                <Lock className="w-4 h-4 mr-2" />
                {isProcessing
                  ? 'Processing...'
                  : paymentMethod === 'online'
                  ? `Pay ₹${amount}`
                  : 'Confirm Booking'}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-3">
                By proceeding, you agree to our Terms & Conditions
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
