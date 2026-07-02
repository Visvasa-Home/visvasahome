import { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { resetPassword } from '@auth/services/auth';
import { checkPasswordStrength } from '@auth/services/security';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Card } from '@shared/ui/card';

interface ResetPasswordPageProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function ResetPasswordPage({ onSuccess, onBack }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const result = await resetPassword(password);

      if (result.success) {
        // Show success and redirect to login
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(result.error || 'Failed to reset password');
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
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-blue-100 rounded-2xl mb-4">
            <Shield className="w-7 h-7 lg:w-8 lg:h-8 text-[#2563EB]" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
          <p className="text-sm text-gray-600">Create a strong new password for your account</p>
        </div>

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
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-12 h-12 text-base rounded-xl"
                required
                disabled={loading}
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
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-12 h-12 text-base rounded-xl"
                required
                disabled={loading}
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
            disabled={loading || !password || !confirmPassword || password !== confirmPassword}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>

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
      </Card>
    </div>
  );
}
