import { useState } from 'react';
import { Phone, ArrowRight, Shield, CheckCircle, AlertCircle, MessageCircle, ChevronLeft } from 'lucide-react';
import { AuthApi } from '@api/endpoints/auth.api';
import { applyReferralCode, awardSignupBonus } from '@customer/services/loyaltyService';

interface AuthPageProps {
  onLoginSuccess: (phoneNumber: string) => void;
  onBack: () => void;
}

export function AuthPage({ onLoginSuccess, onBack }: AuthPageProps) {
  const [step, setStep] = useState<'phone' | 'method' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'whatsapp' | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showReferralInput, setShowReferralInput] = useState(false);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setStep('method');
  };

  const handleMethodSelect = async (method: 'sms' | 'whatsapp') => {
    setSelectedMethod(method);
    setError('');
    setSuccess('');

    setLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      const response = await AuthApi.sendOtp(formattedPhone);

      if (response && response.success) {
        setSuccess('OTP sent successfully!');
        setStep('otp');
      } else {
        setError(response.error?.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
      console.error('OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      
      const response = await AuthApi.verifyOtp({
        phone: formattedPhone,
        otp: otpValue
      });

      if (!response.success || !response.data) {
        setError(response.error?.message || 'Invalid or expired OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
        setLoading(false);
        return;
      }

      const { user, token, refresh_token } = response.data as any;

      // Store tokens and user info
      localStorage.setItem('visvasahome_access_token', token);
      if (refresh_token) {
        localStorage.setItem('visvasahome_refresh_token', refresh_token);
      }
      localStorage.setItem('visvasahome_user_id', user.id);
      localStorage.setItem('visvasahome_user_role', user.role || 'customer');
      localStorage.setItem('visvasahome_vh_id', user.id);
      localStorage.setItem('visvasahome_user_phone', formattedPhone);
      
      // Apply referral code if provided
      if (referralCode.trim()) {
        const refResult = await applyReferralCode(referralCode.trim(), user.id, user.name || 'Valued Customer');
        if (refResult.success) {
          console.log(`[REFERRAL] Successfully applied referral code: ${referralCode}`);
        } else {
          console.warn(`[REFERRAL] Failed to apply referral code: ${refResult.message}`);
        }
      }

      setSuccess('Verification successful! Logging you in...');
      setTimeout(() => {
        onLoginSuccess(formattedPhone);
      }, 500);
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!selectedMethod) return;

    setOtp(['', '', '', '', '', '']);
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
      const response = await AuthApi.sendOtp(formattedPhone);

      if (response && response.success) {
        setSuccess('OTP resent successfully!');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.error?.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMethodLabel = () => {
    if (selectedMethod === 'sms') return 'SMS';
    if (selectedMethod === 'whatsapp') return 'WhatsApp';
    return '';
  };

  const getMethodIcon = () => {
    if (selectedMethod === 'sms') return Phone;
    if (selectedMethod === 'whatsapp') return MessageCircle;
    return Phone;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#2563EB]" />
              <span className="font-semibold text-gray-900">Secure Login</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                step === 'phone' ? 'bg-[#2563EB] text-white' : 'bg-blue-500 text-white'
              }`}>
                {step === 'phone' ? '1' : <CheckCircle className="w-5 h-5" />}
              </div>
              <span className="text-sm font-medium text-gray-700">Phone Number</span>
            </div>
            <div className="flex-1 h-0.5 mx-3 bg-gray-200">
              <div className={`h-full transition-all duration-300 ${
                step !== 'phone' ? 'bg-[#2563EB] w-full' : 'bg-gray-200 w-0'
              }`} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                step === 'method' ? 'bg-[#2563EB] text-white' :
                step === 'otp' ? 'bg-blue-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {step === 'otp' ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className={`text-sm font-medium ${step !== 'phone' ? 'text-gray-700' : 'text-gray-400'}`}>
                Select Method
              </span>
            </div>
            <div className="flex-1 h-0.5 mx-3 bg-gray-200">
              <div className={`h-full transition-all duration-300 ${
                step === 'otp' ? 'bg-[#2563EB] w-full' : 'bg-gray-200 w-0'
              }`} />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                step === 'otp' ? 'bg-[#2563EB] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className={`text-sm font-medium ${step === 'otp' ? 'text-gray-700' : 'text-gray-400'}`}>
                Verify OTP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10">
            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-blue-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-blue-800 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Step 1: Phone Number */}
            {step === 'phone' && (
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                  <p className="text-gray-600">Enter your mobile number to continue</p>
                </div>

                <form onSubmit={handlePhoneSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500 border-r border-gray-300 pr-3">
                        <Phone className="w-5 h-5" />
                        <span className="font-semibold">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Enter 10-digit number"
                        className="w-full pl-28 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#2563EB] focus:outline-none text-lg font-medium transition-colors"
                        maxLength={10}
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => setShowReferralInput(!showReferralInput)}
                      className="text-sm font-semibold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showReferralInput ? 'Hide referral code' : 'Have a referral code?'}
                    </button>
                    {showReferralInput && (
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        placeholder="Enter referral code"
                        className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:border-[#2563EB] focus:outline-none text-sm transition-colors uppercase"
                      />
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phoneNumber.length !== 10}
                    className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-bold hover:bg-[#1D4ED8] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-98"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Trust Indicators */}
                  <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span>100% Secure & Encrypted</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span>No spam, we respect your privacy</span>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: Choose OTP Method */}
            {step === 'method' && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose OTP Method</h2>
                  <p className="text-gray-600">
                    Mobile: <span className="font-semibold text-gray-900">+91 {phoneNumber}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Phone SMS */}
                  <button
                    onClick={() => handleMethodSelect('sms')}
                    disabled={loading}
                    className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-[#2563EB] hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 group"
                  >
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                      <Phone className="w-7 h-7 text-[#2563EB] group-hover:text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-900 mb-1">Phone SMS</p>
                      <p className="text-sm text-gray-600">Receive OTP via text message</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#2563EB]" />
                  </button>

                  {/* WhatsApp */}
                  <button
                    onClick={() => handleMethodSelect('whatsapp')}
                    disabled={loading}
                    className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 group"
                  >
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                      <MessageCircle className="w-7 h-7 text-blue-600 group-hover:text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-900 mb-1">WhatsApp</p>
                      <p className="text-sm text-gray-600">Receive OTP on WhatsApp</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="w-full mt-4 text-gray-600 hover:text-gray-900 py-3 text-sm font-medium"
                  >
                    ← Change mobile number
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: OTP Verification */}
            {step === 'otp' && (
              <div>
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    selectedMethod === 'sms' ? 'bg-blue-100' :
                    selectedMethod === 'whatsapp' ? 'bg-blue-100' :
                    'bg-blue-100'
                  }`}>
                    {(() => {
                      const Icon = getMethodIcon();
                      return <Icon className={`w-8 h-8 ${
                        selectedMethod === 'sms' ? 'text-[#2563EB]' :
                        selectedMethod === 'whatsapp' ? 'text-blue-600' :
                        'text-blue-600'
                      }`} />;
                    })()}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                  <p className="text-gray-600">
                    OTP sent via {getMethodLabel()} to<br />
                    <span className="font-semibold text-gray-900">+91 {phoneNumber}</span>
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                      Enter 6-Digit OTP
                    </label>
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:border-[#2563EB] focus:outline-none transition-colors"
                          maxLength={1}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full bg-[#2563EB] text-white py-4 rounded-xl font-bold hover:bg-[#1D4ED8] transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-98"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify & Login
                        <CheckCircle className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-sm font-semibold text-[#2563EB] hover:text-[#2563EB] disabled:text-gray-400"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('method');
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                    }}
                    className="w-full mt-4 text-gray-600 hover:text-gray-900 py-3 text-sm font-medium"
                  >
                    ← Change OTP method
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-xs mt-6">
            By continuing, you agree to VisvasaHome's{' '}
            <button className="text-[#2563EB] hover:underline">Terms of Service</button>
            {' '}and{' '}
            <button className="text-[#2563EB] hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}
