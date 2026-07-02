import { useEffect, useState } from 'react';
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@core/db/supabaseClient';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';

interface OAuthCallbackPageProps {
  onSuccess: () => void;
}

export function OAuthCallbackPage({ onSuccess }: OAuthCallbackPageProps) {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('OAuth session error:', sessionError);
          setStatus('error');
          setError(sessionError.message || 'Authentication failed. Please try again.');
          return;
        }

        if (session?.user) {
          // Check if user exists in users table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          // If user doesn't exist, create them
          if (userError || !userData) {
            const { error: createError } = await supabase.from('users').insert([
              {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                phone: session.user.user_metadata?.phone || null,
                role: 'customer',
                created_at: new Date().toISOString(),
              },
            ]);

            if (createError) {
              console.error('Error creating user:', createError);
              // Continue anyway - user is authenticated
            }
          }

          setStatus('success');
          // Redirect to dashboard after 1.5 seconds
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setStatus('error');
          setError('No user session found. Please try signing in again.');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setError('An unexpected error occurred during authentication.');
      }
    };

    handleOAuthCallback();
  }, [onSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1D4ED8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 lg:p-8">
        {/* Processing State */}
        {status === 'processing' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-blue-100 rounded-2xl mb-4">
              <Loader className="w-7 h-7 lg:w-8 lg:h-8 text-[#2563EB] animate-spin" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Completing Sign In
            </h1>
            <p className="text-sm text-gray-600">Please wait while we set up your account...</p>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-green-100 rounded-2xl mb-4 animate-bounce-once">
              <CheckCircle className="w-7 h-7 lg:w-8 lg:h-8 text-green-600" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              Authentication Successful!
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              You have been successfully signed in. Redirecting you now...
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-green-900 mb-1">Welcome to VisvasaHome!</p>
                  <p className="text-sm text-green-800">
                    Your account is ready. You'll be redirected to the dashboard shortly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-red-100 rounded-2xl mb-4">
                <AlertCircle className="w-7 h-7 lg:w-8 lg:h-8 text-red-600" />
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                Authentication Failed
              </h1>
              <p className="text-sm text-gray-600">Something went wrong during sign in</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>

            <Button
              onClick={onSuccess}
              className="w-full bg-[#2563EB] hover:bg-[#2563EB] h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              Back to Login
            </Button>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Need help?</strong> If this issue persists, please contact support or try
                signing in with a different method.
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
