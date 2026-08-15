import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { requestPasswordReset } from '@auth/services/auth';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Card } from '@shared/ui/card';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await requestPasswordReset(email);

      if (result.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1D4ED8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-blue-100 rounded-2xl mb-4">
            <Mail className="w-7 h-7 lg:w-8 lg:h-8 text-[#2563EB]" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-sm text-gray-600">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 animate-slide-up">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 mb-1">Email Sent!</p>
                <p className="text-sm text-blue-800">
                  Check your inbox for password reset instructions. The link expires in 1 hour.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Error</p>
                <p className="text-sm text-blue-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 text-base rounded-xl"
                required
                disabled={loading || success}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-[#2563EB] h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            disabled={loading || success}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : success ? (
              'Email Sent'
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the email?{' '}
            <button
              onClick={handleSubmit}
              disabled={loading || !email}
              className="text-[#2563EB] hover:text-[#2563EB] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend
            </button>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Security Note:</strong> For your protection, we don't reveal whether an email is
            registered. If you don't receive an email, please check your spam folder or contact support.
          </p>
        </div>
      </Card>
    </div>
  );
}
