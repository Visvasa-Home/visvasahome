import { supabase, User, isSupabaseConfigured } from '@core/db/supabaseClient';
import { getUserByPhone, createUser } from '@core/db/database';
import { checkRateLimit, logSecurityEvent, validate, schemas } from './security';

// ============================================================================
// AUTHENTICATION
// ============================================================================

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
  message?: string;
}

// ============================================================================
// PHONE OTP AUTHENTICATION
// ============================================================================

// Send OTP via SMS (with rate limiting)
export const sendOTP = async (phone: string): Promise<{ success: boolean; error?: string; message?: string }> => {
  try {
    // Validate phone number
    const validation = validate(schemas.phone, phone);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    // Rate limit check (3 OTP per 15 minutes)
    const rateLimit = checkRateLimit(phone, 'OTP_REQUEST');
    if (!rateLimit.allowed) {
      logSecurityEvent('OTP_RATE_LIMIT_EXCEEDED', `phone:${phone}`, 'warning');
      return {
        success: false,
        error: `Too many OTP requests. Please try again in ${Math.ceil(rateLimit.resetIn / 60000)} minutes.`,
      };
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: 'sms',
      },
    });

    if (error) {
      console.error('Error sending OTP:', error);
      logSecurityEvent('OTP_SEND_FAILED', `phone:${phone}`, 'warning');
      return { success: false, error: error.message };
    }

    logSecurityEvent('OTP_SENT', `phone:${phone}`, 'info');
    return { success: true, message: 'OTP sent successfully' };
  } catch (err) {
    console.error('Error sending OTP:', err);
    return { success: false, error: 'Failed to send OTP' };
  }
};

// Verify OTP (with rate limiting)
export const verifyOTP = async (phone: string, token: string): Promise<AuthResponse> => {
  try {
    // Validate inputs
    const phoneValidation = validate(schemas.phone, phone);
    if (!phoneValidation.success) {
      return { success: false, error: phoneValidation.error };
    }

    const otpValidation = validate(schemas.otp, token);
    if (!otpValidation.success) {
      return { success: false, error: otpValidation.error };
    }

    // Rate limit check (5 verifications per 30 minutes)
    const rateLimit = checkRateLimit(phone, 'OTP_VERIFY');
    if (!rateLimit.allowed) {
      logSecurityEvent('OTP_VERIFY_RATE_LIMIT', `phone:${phone}`, 'warning');
      return {
        success: false,
        error: 'Too many verification attempts. Please wait before trying again.',
      };
    }

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });

    if (error) {
      console.error('Error verifying OTP:', error);
      logSecurityEvent('OTP_VERIFY_FAILED', `phone:${phone}`, 'warning');
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'No user returned' };
    }

    // Check if user exists in users table
    let user = await getUserByPhone(phone);

    // If user doesn't exist, create them
    if (!user) {
      user = await createUser({
        phone,
        role: 'customer',
      });
    }

    if (!user) {
      return { success: false, error: 'Failed to create user' };
    }

    logSecurityEvent('OTP_LOGIN_SUCCESS', `userId:${user.id}`, 'info');
    return { success: true, user };
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return { success: false, error: 'Failed to verify OTP' };
  }
};

// ============================================================================
// EMAIL/PASSWORD AUTHENTICATION
// ============================================================================

// Sign up with email and password (with email verification)
export const signUpWithEmail = async (
  email: string,
  password: string,
  phone: string,
  name: string
): Promise<AuthResponse> => {
  try {
    // Validate inputs
    const emailValidation = validate(schemas.email, email);
    if (!emailValidation.success) {
      return { success: false, error: emailValidation.error };
    }

    const passwordValidation = validate(schemas.password, password);
    if (!passwordValidation.success) {
      return { success: false, error: passwordValidation.error };
    }

    const phoneValidation = validate(schemas.phone, phone);
    if (!phoneValidation.success) {
      return { success: false, error: phoneValidation.error };
    }

    const nameValidation = validate(schemas.name, name);
    if (!nameValidation.success) {
      return { success: false, error: nameValidation.error };
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
        data: {
          phone,
          name,
          role: 'customer',
        },
      },
    });

    if (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    }

    logSecurityEvent('EMAIL_SIGNUP', `email:${email}`, 'info');
    return {
      success: true,
      user: data.user as any,
      message: 'Verification email sent! Please check your inbox.',
    };
  } catch (err) {
    console.error('Error signing up:', err);
    return { success: false, error: 'Signup failed' };
  }
};

// Sign in with email and password (with rate limiting)
export const signInWithEmail = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Validate inputs
    const emailValidation = validate(schemas.email, email);
    if (!emailValidation.success) {
      return { success: false, error: emailValidation.error };
    }

    // Rate limit check (5 login attempts per 15 minutes)
    const rateLimit = checkRateLimit(email, 'LOGIN_ATTEMPT');
    if (!rateLimit.allowed) {
      logSecurityEvent('LOGIN_RATE_LIMIT', `email:${email}`, 'critical');
      return {
        success: false,
        error: `Too many login attempts. Please try again in ${Math.ceil(rateLimit.resetIn / 60000)} minutes.`,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in:', error);
      logSecurityEvent('LOGIN_FAILED', `email:${email}`, 'warning');
      return { success: false, error: 'Invalid email or password' };
    }

    if (!data.user) {
      return { success: false, error: 'No user returned' };
    }

    // Get user from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return { success: false, error: 'User not found' };
    }

    logSecurityEvent('LOGIN_SUCCESS', `userId:${userData.id}`, 'info');
    return { success: true, user: userData };
  } catch (err) {
    console.error('Error signing in:', err);
    return { success: false, error: 'Failed to sign in' };
  }
};

// ============================================================================
// PASSWORD RESET
// ============================================================================

// Request password reset email
export const requestPasswordReset = async (
  email: string
): Promise<{ success: boolean; error?: string; message?: string }> => {
  try {
    // Validate email
    const validation = validate(schemas.email, email);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    // Rate limit check
    const rateLimit = checkRateLimit(email, 'LOGIN_ATTEMPT');
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: 'Too many requests. Please try again later.',
      };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('Error requesting password reset:', error);
      // Don't reveal if email exists or not (security)
      return {
        success: true,
        message: 'If that email exists, a password reset link has been sent.',
      };
    }

    logSecurityEvent('PASSWORD_RESET_REQUESTED', `email:${email}`, 'info');
    return {
      success: true,
      message: 'Password reset email sent! Check your inbox.',
    };
  } catch (err) {
    console.error('Error requesting password reset:', err);
    return { success: false, error: 'Failed to send reset email' };
  }
};

// Reset password with new password
export const resetPassword = async (
  newPassword: string
): Promise<{ success: boolean; error?: string; message?: string }> => {
  try {
    // Validate password
    const validation = validate(schemas.password, newPassword);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('Error resetting password:', error);
      return { success: false, error: error.message };
    }

    // Log out from all other sessions
    await supabase.auth.signOut({ scope: 'others' });

    logSecurityEvent('PASSWORD_RESET_SUCCESS', 'user', 'info');
    return {
      success: true,
      message: 'Password reset successfully! Please login with your new password.',
    };
  } catch (err) {
    console.error('Error resetting password:', err);
    return { success: false, error: 'Failed to reset password' };
  }
};

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

// Resend verification email
export const resendVerificationEmail = async (
  email: string
): Promise<{ success: boolean; error?: string; message?: string }> => {
  try {
    const validation = validate(schemas.email, email);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    });

    if (error) {
      console.error('Error resending verification:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.',
    };
  } catch (err) {
    console.error('Error resending verification:', err);
    return { success: false, error: 'Failed to resend verification email' };
  }
};

// ============================================================================
// OAUTH AUTHENTICATION
// ============================================================================

// Sign in with Google
export const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      return { success: false, error: error.message };
    }

    logSecurityEvent('GOOGLE_LOGIN_INITIATED', 'oauth', 'info');
    return { success: true };
  } catch (err) {
    console.error('Error signing in with Google:', err);
    return { success: false, error: 'Google login failed' };
  }
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }

    // Clear any local security data
    sessionStorage.clear();
    logSecurityEvent('USER_LOGOUT', 'user', 'info');
    return { success: true };
  } catch (err) {
    console.error('Error signing out:', err);
    return { success: false, error: 'Failed to sign out' };
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    // Get user from users table
    const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single();

    return userData;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};

export const getCurrentSession = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (err) {
    console.error('Error getting session:', err);
    return null;
  }
};

// ============================================================================
// ADMIN AUTHENTICATION (Secure Implementation)
// ============================================================================

export const adminLogin = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Validate inputs
    const emailValidation = validate(schemas.email, email);
    if (!emailValidation.success) {
      return { success: false, error: emailValidation.error };
    }

    // ✅ SECURITY: Only allow official @visvasahome.com email addresses
    const OFFICIAL_DOMAIN = '@visvasahome.com';
    if (!email.toLowerCase().endsWith(OFFICIAL_DOMAIN)) {
      logSecurityEvent('ADMIN_LOGIN_UNAUTHORIZED_DOMAIN', `email:${email}`, 'critical');
      return {
        success: false,
        error: 'Access denied. Admin panel is restricted to official @visvasahome.com email addresses only.',
      };
    }

    // Rate limit check (5 login attempts per 15 minutes)
    const rateLimit = checkRateLimit(email, 'LOGIN_ATTEMPT');
    if (!rateLimit.allowed) {
      logSecurityEvent('ADMIN_LOGIN_RATE_LIMIT', `email:${email}`, 'critical');
      return {
        success: false,
        error: `Account temporarily locked. Try again in ${Math.ceil(rateLimit.resetIn / 60000)} minutes.`,
      };
    }

    // Mock login bypass for local development/demo ONLY when Supabase is not configured
    if (!isSupabaseConfigured) {
      let role = 'super_admin';
      let name = 'System Admin';
      let id = 'mock-super-admin';
      
      if (email === 'admin@visvasahome.com' && password === 'admin123') {
        role = 'super_admin'; name = 'System Admin'; id = 'mock-super-admin';
      } else if (email === 'ops@visvasahome.com' && password === 'ops123') {
        role = 'operations_manager'; name = 'Operations Manager'; id = 'mock-ops-manager';
      } else if (email === 'support@visvasahome.com' && password === 'support123') {
        role = 'support_agent'; name = 'Support Agent'; id = 'mock-support-agent';
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
      
      localStorage.setItem('visvasahome_admin_token', `mock-token-${role}`);
      localStorage.setItem('visvasahome_admin_email', email);
      localStorage.setItem('visvasahome_admin_role', role);
      localStorage.setItem('visvasahome_admin_name', name);
      localStorage.setItem('visvasahome_admin_id', id);

      logSecurityEvent('ADMIN_LOGIN_SUCCESS', `userId:${id}`, 'info');
      return {
        success: true,
        user: {
          id,
          phone: '+919999999999',
          email,
          name,
          role: role as any,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    }

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error signing in admin:', error);
      logSecurityEvent('ADMIN_LOGIN_FAILED', `email:${email}`, 'critical');
      return { success: false, error: 'Invalid credentials' };
    }

    if (!data.user) {
      return { success: false, error: 'No user returned' };
    }

    // Verify admin role in admins table
    const { data: userData, error: userError } = await supabase
      .from('admins')
      .select('*')
      .eq('auth_user_id', data.user.id)
      .single();

    if (userError || !userData || !userData.is_active) {
      // Not a valid active admin - log out immediately
      await supabase.auth.signOut();
      logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS', `email:${email}`, 'critical');
      return { success: false, error: 'Unauthorized: Active administrator access required' };
    }

    localStorage.setItem('visvasahome_admin_token', data.session?.access_token || 'admin_authenticated');
    localStorage.setItem('visvasahome_admin_email', userData.email);
    localStorage.setItem('visvasahome_admin_role', userData.role);
    localStorage.setItem('visvasahome_admin_name', userData.full_name);
    localStorage.setItem('visvasahome_admin_id', userData.id);

    logSecurityEvent('ADMIN_LOGIN_SUCCESS', `userId:${userData.id}`, 'info');
    return { success: true, user: userData as any };
  } catch (err) {
    console.error('Admin login error:', err);
    return { success: false, error: 'Login failed' };
  }
};

// ============================================================================
// ROLE CHECKS
// ============================================================================

export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const isProfessional = (user: User | null): boolean => {
  return user?.role === 'professional';
};

export const isCustomer = (user: User | null): boolean => {
  return user?.role === 'customer';
};
