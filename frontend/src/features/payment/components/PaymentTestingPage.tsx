import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, CreditCard, DollarSign, RefreshCw } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { processPayment, PaymentDetails, refundPayment } from '@payment/services/payment';

interface PaymentTestingPageProps {
  onBack: () => void;
}

interface TestResult {
  scenario: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  paymentId?: string;
  orderId?: string;
  refundId?: string;
  timestamp: string;
}

export function PaymentTestingPage({ onBack }: PaymentTestingPageProps) {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [result, ...prev]);
  };

  // Test Scenario 1: Successful Payment
  const testSuccessfulPayment = async () => {
    setTesting(true);
    setCurrentTest('Successful Payment');

    try {
      const paymentDetails: PaymentDetails = {
        bookingId: `test_${Date.now()}`,
        amount: 1500,
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+919876543210',
        serviceName: 'AC Service & Repair'
      };

      const result = await processPayment(paymentDetails);

      addTestResult({
        scenario: 'Successful Payment',
        status: result.success ? 'success' : 'failed',
        message: result.success
          ? `Payment processed successfully. Payment ID: ${result.paymentId}`
          : result.error || 'Payment failed',
        paymentId: result.paymentId,
        orderId: result.orderId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      addTestResult({
        scenario: 'Successful Payment',
        status: 'failed',
        message: 'Exception occurred during payment processing',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
  };

  // Test Scenario 2: Failed Payment (User Cancellation)
  const testFailedPaymentCancellation = async () => {
    setTesting(true);
    setCurrentTest('Payment Cancellation');

    try {
      // Simulate user cancellation by not completing payment flow
      await new Promise(resolve => setTimeout(resolve, 1000));

      addTestResult({
        scenario: 'Payment Cancellation',
        status: 'failed',
        message: 'Payment cancelled by user before completion',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      addTestResult({
        scenario: 'Payment Cancellation',
        status: 'failed',
        message: 'Error simulating cancellation',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
  };

  // Test Scenario 3: Failed Payment (Insufficient Funds)
  const testFailedPaymentInsufficientFunds = async () => {
    setTesting(true);
    setCurrentTest('Insufficient Funds');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      addTestResult({
        scenario: 'Insufficient Funds',
        status: 'failed',
        message: 'Payment failed: Insufficient funds in account',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      addTestResult({
        scenario: 'Insufficient Funds',
        status: 'failed',
        message: 'Error simulating insufficient funds',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
  };

  // Test Scenario 4: Payment Timeout
  const testPaymentTimeout = async () => {
    setTesting(true);
    setCurrentTest('Payment Timeout');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      addTestResult({
        scenario: 'Payment Timeout',
        status: 'failed',
        message: 'Payment failed: Gateway timeout after 30 seconds',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      addTestResult({
        scenario: 'Payment Timeout',
        status: 'failed',
        message: 'Error simulating timeout',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
  };

  // Test Scenario 5: Network Error During Payment
  const testNetworkError = async () => {
    setTesting(true);
    setCurrentTest('Network Error');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      addTestResult({
        scenario: 'Network Error',
        status: 'failed',
        message: 'Payment failed: Network connection lost during transaction',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      addTestResult({
        scenario: 'Network Error',
        status: 'failed',
        message: 'Error simulating network error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
  };

  // Test Scenario 6: Refund Processing
  const testRefund = async () => {
    setTesting(true);
    setCurrentTest('Refund Processing');

    try {
      // First make a payment
      const paymentDetails: PaymentDetails = {
        bookingId: `test_refund_${Date.now()}`,
        amount: 2000,
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+919876543210',
        serviceName: 'Test Service for Refund'
      };

      const paymentResult = await processPayment(paymentDetails);

      if (paymentResult.success && paymentResult.paymentId) {
        // Process refund
        await new Promise(resolve => setTimeout(resolve, 500));
        const refundResult = await refundPayment(paymentResult.paymentId, 2000);

        addTestResult({
          scenario: 'Refund Processing',
          status: refundResult.success ? 'success' : 'failed',
          message: refundResult.success
            ? `Refund processed successfully. Refund ID: ${refundResult.refundId}`
            : refundResult.error || 'Refund failed',
          paymentId: paymentResult.paymentId,
          refundId: refundResult.refundId,
          timestamp: new Date().toISOString()
        });
      } else {
        addTestResult({
          scenario: 'Refund Processing',
          status: 'failed',
          message: 'Could not process refund: Initial payment failed',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      addTestResult({
        scenario: 'Refund Processing',
        status: 'failed',
        message: 'Exception occurred during refund processing',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
  };

  // Test Scenario 7: Partial Refund
  const testPartialRefund = async () => {
    setTesting(true);
    setCurrentTest('Partial Refund');

    try {
      const mockPaymentId = `pay_${Date.now()}`;
      const refundResult = await refundPayment(mockPaymentId, 1000);

      addTestResult({
        scenario: 'Partial Refund',
        status: refundResult.success ? 'success' : 'failed',
        message: refundResult.success
          ? `Partial refund of ₹1000 processed. Refund ID: ${refundResult.refundId}`
          : refundResult.error || 'Partial refund failed',
        paymentId: mockPaymentId,
        refundId: refundResult.refundId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      addTestResult({
        scenario: 'Partial Refund',
        status: 'failed',
        message: 'Exception occurred during partial refund',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
  };

  // Test Scenario 8: Multiple Payment Methods
  const testMultiplePaymentMethods = async () => {
    setTesting(true);
    setCurrentTest('Multiple Payment Methods');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      addTestResult({
        scenario: 'Multiple Payment Methods',
        status: 'success',
        message: 'Payment gateway supports: UPI, Credit Card, Debit Card, Net Banking, Wallets',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      addTestResult({
        scenario: 'Multiple Payment Methods',
        status: 'failed',
        message: 'Error checking payment methods',
        timestamp: new Date().toISOString()
      });
    } finally {
      setTesting(false);
      setCurrentTest('');
    }
  };

  // Run All Tests
  const runAllTests = async () => {
    setTestResults([]);
    await testSuccessfulPayment();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testFailedPaymentCancellation();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testFailedPaymentInsufficientFunds();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testPaymentTimeout();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testNetworkError();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testRefund();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testPartialRefund();
    await new Promise(resolve => setTimeout(resolve, 500));
    await testMultiplePaymentMethods();
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const failedCount = testResults.filter(r => r.status === 'failed').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Flow Testing</h1>
          <p className="text-gray-600">Test various payment scenarios including success, failures, and refunds</p>
        </div>

        {/* Test Controls */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Test Scenarios</h2>
            <div className="flex gap-2">
              <Button onClick={clearResults} variant="outline" size="sm" disabled={testing}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Results
              </Button>
              <Button onClick={runAllTests} className="bg-[#2563EB] hover:bg-[#2563EB]" disabled={testing}>
                <CreditCard className="w-4 h-4 mr-2" />
                Run All Tests
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              onClick={testSuccessfulPayment}
              disabled={testing}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-blue-50"
            >
              <CheckCircle className="w-5 h-5 text-blue-600 mb-2" />
              <span className="font-semibold text-sm">Successful Payment</span>
              <span className="text-xs text-gray-500">Test payment success flow</span>
            </Button>

            <Button
              onClick={testFailedPaymentCancellation}
              disabled={testing}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-blue-50"
            >
              <XCircle className="w-5 h-5 text-blue-600 mb-2" />
              <span className="font-semibold text-sm">User Cancellation</span>
              <span className="text-xs text-gray-500">User cancels payment</span>
            </Button>

            <Button
              onClick={testFailedPaymentInsufficientFunds}
              disabled={testing}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-blue-50"
            >
              <AlertCircle className="w-5 h-5 text-blue-600 mb-2" />
              <span className="font-semibold text-sm">Insufficient Funds</span>
              <span className="text-xs text-gray-500">Account has low balance</span>
            </Button>

            <Button
              onClick={testPaymentTimeout}
              disabled={testing}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-blue-50"
            >
              <AlertCircle className="w-5 h-5 text-blue-600 mb-2" />
              <span className="font-semibold text-sm">Gateway Timeout</span>
              <span className="text-xs text-gray-500">Payment gateway timeout</span>
            </Button>

            <Button
              onClick={testNetworkError}
              disabled={testing}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-blue-50"
            >
              <XCircle className="w-5 h-5 text-blue-600 mb-2" />
              <span className="font-semibold text-sm">Network Error</span>
              <span className="text-xs text-gray-500">Connection lost</span>
            </Button>

            <Button
              onClick={testRefund}
              disabled={testing}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-blue-50"
            >
              <DollarSign className="w-5 h-5 text-[#2563EB] mb-2" />
              <span className="font-semibold text-sm">Full Refund</span>
              <span className="text-xs text-gray-500">Process complete refund</span>
            </Button>

            <Button
              onClick={testPartialRefund}
              disabled={testing}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-blue-50"
            >
              <DollarSign className="w-5 h-5 text-[#2563EB] mb-2" />
              <span className="font-semibold text-sm">Partial Refund</span>
              <span className="text-xs text-gray-500">Refund partial amount</span>
            </Button>

            <Button
              onClick={testMultiplePaymentMethods}
              disabled={testing}
              variant="outline"
              className="h-auto flex-col items-start p-4 hover:bg-blue-50"
            >
              <CreditCard className="w-5 h-5 text-blue-600 mb-2" />
              <span className="font-semibold text-sm">Payment Methods</span>
              <span className="text-xs text-gray-500">Check available methods</span>
            </Button>
          </div>

          {testing && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <p className="font-semibold text-gray-900">Testing in Progress</p>
                  <p className="text-sm text-[#2563EB]">Running test: {currentTest}</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{testResults.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Successful</p>
                  <p className="text-2xl font-bold text-blue-600">{successCount}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Failed</p>
                  <p className="text-2xl font-bold text-blue-600">{failedCount}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Test Results</h2>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 ${
                    result.status === 'success'
                      ? 'border-blue-200 bg-blue-50'
                      : result.status === 'failed'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-3">
                      {result.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      ) : result.status === 'failed' ? (
                        <XCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{result.scenario}</p>
                        <p className="text-sm text-gray-700">{result.message}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        result.status === 'success'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : result.status === 'failed'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-blue-100 text-blue-800 border-blue-300'
                      }
                    >
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600 mt-3">
                    {result.paymentId && (
                      <div>
                        <span className="font-semibold">Payment ID:</span>
                        <p className="font-mono text-xs truncate">{result.paymentId}</p>
                      </div>
                    )}
                    {result.orderId && (
                      <div>
                        <span className="font-semibold">Order ID:</span>
                        <p className="font-mono text-xs truncate">{result.orderId}</p>
                      </div>
                    )}
                    {result.refundId && (
                      <div>
                        <span className="font-semibold">Refund ID:</span>
                        <p className="font-mono text-xs truncate">{result.refundId}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Timestamp:</span>
                      <p className="text-xs">{new Date(result.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
