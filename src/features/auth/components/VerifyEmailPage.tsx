import { useEffect, useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '@core/db/supabaseClient';
import { resendVerificationEmail } from '@auth/services/auth';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';

interface VerifyEmailPageProps {
  onSuccess: () => void;
}

export function VerifyEmailPage({ onSuccess }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the current session to check if email is verified
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('error');
          setError('Failed to verify email. Please try again.');
          return;
        }

        if (session?.user) {
          // Check if email is confirmed
          if (session.user.email_confirmed_at) {
            setStatus('success');
            setEmail(session.user.email || '');
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
              onSuccess();
            }, 2000);
          } else {
            setStatus('error');
            setEmail(session.user.email || '');
            setError('Email not yet verified. Please check your inbox and click the verification link.');
          }
        } else {
          setStatus('error');
          setError('No active session. Please sign up again.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setStatus('error');
        setError('An unexpected error occurred.');
      }
    };

    verifyEmail();
  }, [onSuccess]);

  const handleResendEmail = async () => {
    if (!email) {
      setError('No email address found. Please sign up again.');
      return;
    }

    setResending(true);
    setError('');

    try {
      const result = await resendVerificationEmail(email);

      if (result.success) {
        setError('');
        alert('Verification email sent! Please check your inbox.');
      } else {
        setError(result.error || 'Failed to resend verification email');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1D4ED8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 lg:p-8">
        {/* Verifying State */}
        {status === 'verifying' && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-blue-100 rounded-2xl mb-4">
                <Loader className="w-7 h-7 lg:w-8 lg:h-8 text-[#2563EB] animate-spin" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Verifying Email
              </h1>
              <p className="text-sm text-gray-600">Please wait while we verify your email address...</p>
            </div>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-green-100 rounded-2xl mb-4">
                <CheckCircle className="w-7 h-7 lg:w-8 lg:h-8 text-green-600" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-sm text-gray-600">
                Your email has been successfully verified. Redirecting you to the dashboard...
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900 mb-1">Verification Complete</p>
                  <p className="text-sm text-green-800">
                    You can now access all features of VisvasaHome. Welcome aboard!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-red-100 rounded-2xl mb-4">
                <Mail className="w-7 h-7 lg:w-8 lg:h-8 text-red-600" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Email Verification
              </h1>
              <p className="text-sm text-gray-600">
                Please verify your email address to continue
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Verification Pending</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                We sent a verification link to{' '}
                <span className="font-medium text-gray-900">{email}</span>. Please check your inbox
                and click the link to verify your email address.
              </p>

              <Button
                onClick={handleResendEmail}
                disabled={resending || !email}
                className="w-full bg-[#2563EB] hover:bg-[#2563EB] h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {resending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending...
                  </span>
                ) : (
                  'Resend Verification Email'
                )}
              </Button>

              <Button
                onClick={onSuccess}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 h-12 text-base font-semibold rounded-xl transition-all"
              >
                Back to Login
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs text-gray-900 leading-relaxed">
                <strong>Didn't receive the email?</strong> Check your spam folder or contact support
                if you continue to have issues.
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
