import { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { signUpWithEmail, signInWithGoogle } from '@auth/services/auth';
import { checkPasswordStrength } from '@auth/services/security';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Card } from '@shared/ui/card';

interface EmailSignupPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function EmailSignupPage({ onSuccess, onBack }: EmailSignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = checkPasswordStrength(password);

  const getStrengthColor = () => {
    switch (passwordStrength.strength) {
      case 'very-weak':
        return 'bg-red-500';
      case 'weak':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'good':
        return 'bg-[#2563EB]';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthWidth = () => {
    return `${(passwordStrength.score / 5) * 100}%`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check password strength
    if (passwordStrength.score < 3) {
      setError('Password is too weak. Please follow the requirements below.');
      return;
    }

    setLoading(true);

    try {
      const result = await signUpWithEmail(email, password, phone, name);

      if (result.success) {
        setSuccess(true);
        // Clear form
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(result.error || 'Failed to sign up');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result.success) {
        setError(result.error || 'Google signup failed');
      }
    } catch (err) {
      setError('Failed to sign up with Google');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1D4ED8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-sm text-gray-600">Sign up to get started with VisvasaHome</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 animate-slide-up">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900 mb-1">Verification Email Sent!</p>
                <p className="text-sm text-green-800">
                  Please check your inbox and click the verification link to activate your account.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10 h-12 text-base rounded-xl"
                required
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 h-12 text-base rounded-xl"
                required
                disabled={loading || success}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-12 h-12 text-base rounded-xl"
                required
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Password Strength:</span>
                  <span
                    className={`text-xs font-semibold ${
                      passwordStrength.score >= 3 ? 'text-green-600' : 'text-blue-600'
                    }`}
                  >
                    {passwordStrength.strength.toUpperCase().replace('-', ' ')}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: getStrengthWidth() }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-12 h-12 text-base rounded-xl"
                required
                disabled={loading || success}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Match Indicator */}
            {confirmPassword && (
              <div className="mt-2 flex items-center gap-2">
                {password === confirmPassword ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Passwords match</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-red-600 font-medium">Passwords do not match</span>
                  </>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-[#2563EB] h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            disabled={loading || success || !name || !email || !phone || !password || !confirmPassword || password !== confirmPassword}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating Account...
              </span>
            ) : success ? (
              'Check Your Email'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth */}
        <Button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 h-12 text-base font-semibold rounded-xl shadow-sm hover:shadow transition-all"
          disabled={loading || success}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </Button>

        {/* Password Requirements */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm font-semibold text-gray-900 mb-2">Password Requirements:</p>
          <ul className="space-y-1 text-xs text-blue-800">
            <li className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${password.length >= 12 ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              At least 12 characters long
            </li>
            <li className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              Both uppercase and lowercase letters
            </li>
            <li className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${/\d/.test(password) ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              At least one number
            </li>
            <li className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${/[^a-zA-Z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              At least one special character (!@#$%^&*)
            </li>
          </ul>
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onBack}
              className="text-[#2563EB] hover:text-[#2563EB] font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
