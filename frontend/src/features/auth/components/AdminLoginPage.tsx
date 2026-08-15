import { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Chrome, Loader2 } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Card } from '@shared/ui/card';
import { adminLogin, signInWithGoogle } from '@auth/services/auth';
import { isSupabaseConfigured } from '@core/db/supabaseClient';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

export function AdminLoginPage({ onLoginSuccess, onBack }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailDomainError, setEmailDomainError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const OFFICIAL_DOMAIN = '@visvasahome.com';

  const validateEmailDomain = (val: string) => {
    if (val && !val.toLowerCase().endsWith(OFFICIAL_DOMAIN)) {
      setEmailDomainError(`Only @visvasahome.com addresses are permitted.`);
    } else {
      setEmailDomainError('');
    }
  };

  // SSO Modal State for Local Sandbox
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [ssoLoadingStep, setSsoLoadingStep] = useState<string | null>(null);

  const mockSSOAccounts = [
    { name: 'Kunal Sharma', email: 'kunal@visvasahome.com', role: 'super_admin', avatar: 'KS', desc: 'Full Access (Super Admin)' },
    { name: 'Neha Gupta', email: 'neha@visvasahome.com', role: 'operations_manager', avatar: 'NG', desc: 'Operations & Booking Manager' },
    { name: 'Rahul Verma', email: 'rahul@visvasahome.com', role: 'support_agent', avatar: 'RV', desc: 'Support Agent (Read-Only)' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side domain check before even hitting the server
    if (!email.toLowerCase().endsWith(OFFICIAL_DOMAIN)) {
      setEmailDomainError(`Only @visvasahome.com addresses are permitted.`);
      return;
    }

    setIsLoading(true);
    try {
      const result = await adminLogin(email, password);
      if (result.success && result.user) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSSO = async () => {
    setError('');
    if (isSupabaseConfigured) {
      setIsLoading(true);
      try {
        const result = await signInWithGoogle();
        if (!result.success) {
          setError(result.error || 'Google SSO failed');
        }
      } catch (err) {
        console.error('Google SSO Error:', err);
        setError('Google SSO authentication error');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local development mock SSO overlay
      setShowSSOModal(true);
    }
  };

  const selectMockSSOAccount = async (account: typeof mockSSOAccounts[0]) => {
    setSsoLoadingStep('Contacting Google identity server...');
    await new Promise(r => setTimeout(r, 700));
    setSsoLoadingStep('Authenticating admin session token...');
    await new Promise(r => setTimeout(r, 800));
    setSsoLoadingStep(`Verifying permissions for role: ${account.role.replace('_', ' ')}...`);
    await new Promise(r => setTimeout(r, 600));

    // Save mock credentials into localStorage
    localStorage.setItem('visvasahome_admin_token', `mock-token-${account.role}`);
    localStorage.setItem('visvasahome_admin_email', account.email);
    localStorage.setItem('visvasahome_admin_role', account.role);
    localStorage.setItem('visvasahome_admin_name', account.name);
    localStorage.setItem('visvasahome_admin_id', `mock-${account.role}`);

    setSsoLoadingStep(null);
    setShowSSOModal(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1D4ED8] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 lg:p-8 shadow-2xl relative overflow-hidden bg-white">
        {/* Decorative corner background lights */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full translate-x-8 -translate-y-8 blur-2xl opacity-50" />
        
        {/* Logo */}
        <div className="text-center mb-6 lg:mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-2xl mb-3 lg:mb-4 shadow-xl">
            <Shield className="w-7 h-7 lg:w-8 lg:h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">Admin Panel Login</h1>
          <p className="text-sm lg:text-base text-gray-600">VisvasaHome Administrative Portal</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          {error && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 lg:p-4 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Login Failed</p>
                <p className="text-xs lg:text-sm text-blue-700">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="yourname@visvasahome.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailDomainError) validateEmailDomain(e.target.value);
                }}
                onBlur={(e) => validateEmailDomain(e.target.value)}
                className={`pl-10 h-12 text-base rounded-xl ${emailDomainError ? 'border-blue-400 focus:border-blue-500 focus:ring-blue-200' : ''}`}
                required
              />
            </div>
            {emailDomainError ? (
              <p className="text-xs text-blue-600 font-semibold mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 inline" /> {emailDomainError}
              </p>
            ) : (
              <p className="text-[10px] text-gray-400 mt-1">Must be an official @visvasahome.com address</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-12 h-12 text-base rounded-xl"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 active:scale-95 transition-all p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="text-right">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Local dev mock password recovery. Use seeded credentials."); }}
              className="text-xs text-[#2563EB] hover:underline font-medium transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-blue-700 active:scale-98 h-12 text-base font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </span>
            ) : (
              'Login to Admin Panel'
            )}
          </Button>
        </form>

        {/* SSO Separator */}
        <div className="my-5 flex items-center justify-center gap-3 relative z-10">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">or sign in with</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Google SSO Button */}
        <button
          onClick={handleGoogleSSO}
          type="button"
          className="w-full flex items-center justify-center h-12 border border-gray-300 hover:bg-gray-50 active:scale-98 bg-white text-gray-700 font-semibold rounded-xl transition-all shadow-xs relative z-10"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 4 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Google SSO
        </button>

        {/* Back Button */}
        <div className="mt-6 text-center relative z-10">
          <button
            onClick={onBack}
            className="text-xs text-gray-500 hover:text-gray-800 transition-colors font-medium active:scale-95 py-2 px-4 rounded-lg hover:bg-gray-100"
          >
            ← Back to Home
          </button>
        </div>
      </Card>

      {/* MOCK SSO Account Selection Modal (Development Mode Only) */}
      {showSSOModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <Card className="w-full max-w-sm p-6 bg-white rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {ssoLoadingStep ? (
              <div className="py-8 text-center flex flex-col items-center justify-center min-h-[220px]">
                <Loader2 className="w-10 h-10 text-[#2563EB] animate-spin mb-4" />
                <p className="text-sm font-semibold text-gray-700 animate-pulse">{ssoLoadingStep}</p>
                <p className="text-xs text-gray-400 mt-2">VisvasaHome Identity SSO</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex p-2 bg-blue-50 rounded-xl mb-3">
                    <Chrome className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Google SSO — Official Accounts</h3>
                  <p className="text-xs text-gray-500 mt-1">Only <span className="font-bold text-blue-600">@visvasahome.com</span> accounts can access the admin panel</p>
                </div>

                <div className="space-y-2.5">
                  {mockSSOAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => selectMockSSOAccount(acc)}
                      className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-blue-50/50 hover:border-blue-200 border border-gray-100 rounded-2xl transition-all active:scale-98 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
                        {acc.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{acc.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{acc.email}</p>
                        <span className="inline-block text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 mt-1">
                          {acc.role.replace('_', ' ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowSSOModal(false)}
                  className="w-full mt-5 py-2.5 bg-gray-100 hover:bg-gray-200 font-semibold text-xs text-gray-600 rounded-xl transition-all active:scale-95 uppercase tracking-wider"
                >
                  Cancel SSO
                </button>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
