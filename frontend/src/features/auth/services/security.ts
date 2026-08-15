/**
 * Security Utilities for VisvasaHome
 * Implements critical security measures: rate limiting, input validation, CSRF protection
 */

import DOMPurify from 'dompurify';
import { z } from 'zod';

// ============================================================================
// RATE LIMITING
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
  blocked: boolean;
  blockUntil?: number;
}

class RateLimiter {
  private attempts = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetAt && (!entry.blocked || now > (entry.blockUntil || 0))) {
        this.attempts.delete(key);
      }
    }
  }

  check(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    // Check if blocked
    if (entry?.blocked && entry.blockUntil && now < entry.blockUntil) {
      return false;
    }

    // Reset if window expired
    if (!entry || now > entry.resetAt) {
      this.attempts.set(key, {
        count: 1,
        resetAt: now + windowMs,
        blocked: false
      });
      return true;
    }

    // Increment count
    entry.count++;

    // Block if exceeded
    if (entry.count > maxAttempts) {
      entry.blocked = true;
      entry.blockUntil = now + (windowMs * 3); // Block for 3x the window
      return false;
    }

    return true;
  }

  getRemainingAttempts(key: string, maxAttempts: number): number {
    const entry = this.attempts.get(key);
    if (!entry || Date.now() > entry.resetAt) return maxAttempts;
    return Math.max(0, maxAttempts - entry.count);
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  OTP_REQUEST: { max: 3, windowMs: 15 * 60 * 1000 }, // 3 OTP per 15 min
  OTP_VERIFY: { max: 5, windowMs: 30 * 60 * 1000 }, // 5 verifications per 30 min
  LOGIN_ATTEMPT: { max: 5, windowMs: 15 * 60 * 1000 }, // 5 login attempts per 15 min
  API_GENERAL: { max: 100, windowMs: 60 * 1000 }, // 100 requests per minute
  BOOKING_CREATE: { max: 10, windowMs: 60 * 60 * 1000 }, // 10 bookings per hour
};

export function checkRateLimit(
  identifier: string,
  limitType: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining: number; resetIn: number } {
  const config = RATE_LIMITS[limitType];
  const key = `${limitType}:${identifier}`;
  const allowed = rateLimiter.check(key, config.max, config.windowMs);
  const remaining = rateLimiter.getRemainingAttempts(key, config.max);

  return {
    allowed,
    remaining,
    resetIn: config.windowMs,
  };
}

// ============================================================================
// INPUT VALIDATION & SANITIZATION
// ============================================================================

// Zod schemas for validation
export const schemas = {
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number (must be 10 digits starting with 6-9)'),

  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email too long'),

  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),

  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain special character'),

  otp: z.string()
    .regex(/^\d{6}$/, 'OTP must be 6 digits'),

  address: z.string()
    .min(10, 'Address too short')
    .max(200, 'Address too long')
    .trim(),

  pincode: z.string()
    .regex(/^\d{6}$/, 'Pincode must be 6 digits'),

  amount: z.number()
    .positive('Amount must be positive')
    .max(1000000, 'Amount too large'),

  notes: z.string()
    .max(500, 'Notes too long')
    .trim(),

  url: z.string()
    .url('Invalid URL')
    .max(200, 'URL too long'),
};

// Validate input against schema
export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown
): any {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: (err as any).errors[0].message };
    }
    return { success: false, error: 'Validation failed' };
  }
}

// Sanitize HTML to prevent XSS
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
  });
}

// Sanitize object (recursively clean all string properties)
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      cleaned[key] = sanitizeHTML(value);
    } else if (value && typeof value === 'object') {
      cleaned[key] = sanitizeObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

// ============================================================================
// CSRF PROTECTION
// ============================================================================

const CSRF_TOKEN_KEY = 'visvasahome_csrf_token';

// Generate CSRF token
export function generateCSRFToken(): string {
  const token = crypto.randomUUID();
  sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  return token;
}

// Get current CSRF token
export function getCSRFToken(): string | null {
  return sessionStorage.getItem(CSRF_TOKEN_KEY);
}

// Validate CSRF token
export function validateCSRFToken(token: string): boolean {
  const stored = getCSRFToken();
  return stored !== null && stored === token;
}

// ============================================================================
// SESSION SECURITY
// ============================================================================

interface SessionInfo {
  userId: string;
  createdAt: number;
  lastActivity: number;
  deviceFingerprint: string;
}

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
const ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes inactivity

// Generate device fingerprint (basic)
export function generateDeviceFingerprint(): string {
  const navigator = window.navigator;
  const data = [
    navigator.userAgent,
    navigator.language,
    navigator.hardwareConcurrency,
    new Date().getTimezoneOffset(),
    window.screen.width + 'x' + window.screen.height,
  ].join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(36);
}

// Check if session is valid
export function isSessionValid(session: SessionInfo): boolean {
  const now = Date.now();

  // Check session timeout
  if (now - session.createdAt > SESSION_TIMEOUT) {
    return false;
  }

  // Check activity timeout
  if (now - session.lastActivity > ACTIVITY_TIMEOUT) {
    return false;
  }

  // Check device fingerprint
  const currentFingerprint = generateDeviceFingerprint();
  if (session.deviceFingerprint !== currentFingerprint) {
    console.warn('Device fingerprint mismatch - possible session hijacking');
    return false;
  }

  return true;
}

// Update session activity
export function updateSessionActivity(userId: string) {
  const session = JSON.parse(localStorage.getItem('session_info') || '{}');
  if (session.userId === userId) {
    session.lastActivity = Date.now();
    localStorage.setItem('session_info', JSON.stringify(session));
  }
}

// ============================================================================
// PASSWORD STRENGTH
// ============================================================================

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong';
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  else if (password.length < 8) feedback.push('Use at least 8 characters');

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  else feedback.push('Use both uppercase and lowercase letters');

  if (/\d/.test(password)) score++;
  else feedback.push('Include numbers');

  if (/[^a-zA-Z0-9]/.test(password)) score++;
  else feedback.push('Include special characters (!@#$%^&*)');

  // Common patterns (weak)
  const commonPatterns = [
    /^(password|12345678|qwerty|abc123)/i,
    /(\d)\1{2,}/, // Repeated digits
    /([a-z])\1{2,}/i, // Repeated letters
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid common patterns and repeated characters');
      break;
    }
  }

  // Determine strength
  let strength: PasswordStrength['strength'];
  if (score <= 1) strength = 'very-weak';
  else if (score === 2) strength = 'weak';
  else if (score === 3) strength = 'fair';
  else if (score === 4) strength = 'good';
  else strength = 'strong';

  return { score, feedback, strength };
}

// ============================================================================
// SECURITY HEADERS (for reference - implement in server/hosting config)
// ============================================================================

export const RECOMMENDED_HEADERS = {
  'Content-Security-Policy':
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdn.supabase.com https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.supabase.co https://api.twilio.com https://api.razorpay.com; " +
    "frame-ancestors 'none'; " +
    "base-uri 'self'; " +
    "form-action 'self';",

  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'geolocation=(), microphone=(), camera=(), payment=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// ============================================================================
// AUDIT LOGGING
// ============================================================================

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export async function logSecurityEvent(
  action: string,
  resource: string,
  severity: 'info' | 'warning' | 'critical',
  details?: any
) {
  const log: AuditLog = {
    id: crypto.randomUUID(),
    action,
    resource,
    details,
    timestamp: new Date().toISOString(),
    severity,
  };

  // In production, send to logging service (e.g., Supabase, Sentry)
  console.log('[SECURITY AUDIT]', log);

  // Store critical events
  if (severity === 'critical') {
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(log);
    // Keep only last 100 logs
    if (logs.length > 100) logs.shift();
    localStorage.setItem('security_logs', JSON.stringify(logs));
  }
}

// ============================================================================
// ENCRYPTION HELPERS (client-side)
// ============================================================================

// Generate random string (for tokens, IDs)
export function generateRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Hash string (for device fingerprints, non-sensitive data)
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ============================================================================
// EXPORT SECURITY CONFIG
// ============================================================================

export const SECURITY_CONFIG = {
  SESSION_TIMEOUT_MS: SESSION_TIMEOUT,
  ACTIVITY_TIMEOUT_MS: ACTIVITY_TIMEOUT,
  MIN_PASSWORD_LENGTH: 12,
  MAX_LOGIN_ATTEMPTS: 5,
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  REQUIRE_2FA_FOR_ADMINS: true,
  REQUIRE_2FA_FOR_PROFESSIONALS: false,
  BLOCK_SUSPICIOUS_COUNTRIES: false, // Enable in production
  ENABLE_DEVICE_TRACKING: true,
  ENABLE_AUDIT_LOGGING: true,
};
