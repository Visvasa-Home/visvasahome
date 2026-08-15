// VisvasaHome Analytics — GA4-based event & page tracking
// Configure your GA4 Measurement ID in environment variables or replace below

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-VISVASAHOME1'; // Production: replace with actual GA4 ID

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// ─── Consent ────────────────────────────────────────────────────────────────

export function isAnalyticsEnabled(): boolean {
  try {
    const raw = localStorage.getItem('visvasahome_cookie_consent');
    if (!raw) return false;
    const consent = JSON.parse(raw);
    return consent.analytics === true;
  } catch {
    return false;
  }
}

// ─── Initialization ──────────────────────────────────────────────────────────

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') return; // already initialized

  // Inject gtag script if not already present
  if (!document.getElementById('gtag-script')) {
    const script = document.createElement('script');
    script.id = 'gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: false, // We track manually for SPA accuracy
  });
}

// ─── Core GA4 helper ─────────────────────────────────────────────────────────

function gtag(...args: unknown[]): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  if (!isAnalyticsEnabled()) return;
  window.gtag(...args);
}

// ─── Page Tracking ───────────────────────────────────────────────────────────

export function trackPageView(page: string, title: string): void {
  gtag('event', 'page_view', {
    page_title: title,
    page_location: `${window.location.origin}/${page}`,
    page_path: `/${page}`,
  });
}

// ─── User Event Tracking ─────────────────────────────────────────────────────

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean> = {}
): void {
  gtag('event', eventName, params);
}

// Service interaction
export function trackServiceView(serviceName: string, category?: string): void {
  trackEvent('service_view', {
    service_name: serviceName,
    ...(category && { service_category: category }),
  });
}

export function trackServiceCTAClick(serviceName: string, ctaLabel: string): void {
  trackEvent('service_cta_click', {
    service_name: serviceName,
    cta_label: ctaLabel,
  });
}

// Booking funnel
export type BookingStep =
  | 'service_selected'
  | 'slot_chosen'
  | 'address_entered'
  | 'payment_initiated'
  | 'booking_confirmed';

export function trackBookingFunnel(step: BookingStep, serviceName?: string, value?: number): void {
  trackEvent('booking_funnel', {
    funnel_step: step,
    ...(serviceName && { service_name: serviceName }),
    ...(value !== undefined && { value }),
  });
}

// Auth events
export type AuthAction =
  | 'login_attempt'
  | 'login_success'
  | 'login_failed'
  | 'signup_start'
  | 'signup_success'
  | 'logout'
  | 'password_reset_request'
  | 'oauth_attempt'
  | 'email_verified';

export function trackAuthEvent(action: AuthAction, method?: string): void {
  trackEvent('auth_event', {
    action,
    ...(method && { method }),
  });
}

// Search
export function trackSearch(query: string, resultsCount?: number): void {
  trackEvent('search', {
    search_term: query,
    ...(resultsCount !== undefined && { results_count: resultsCount }),
  });
}

// AMC
export function trackAMCInterest(planType: string, action: 'view' | 'enquire' | 'subscribe'): void {
  trackEvent('amc_interaction', {
    plan_type: planType,
    action,
  });
}

// Payment
export type PaymentAction =
  | 'payment_initiated'
  | 'payment_success'
  | 'payment_failed'
  | 'payment_cancelled'
  | 'subscription_upgraded'
  | 'subscription_downgraded'
  | 'subscription_cancelled';

export function trackPaymentEvent(action: PaymentAction, amount?: number, currency = 'INR'): void {
  trackEvent('payment_event', {
    action,
    ...(amount !== undefined && { value: amount, currency }),
  });
}

// CTA clicks (hero, banners, navigation)
export function trackCTAClick(ctaName: string, location: string): void {
  trackEvent('cta_click', {
    cta_name: ctaName,
    page_location: location,
  });
}

// Professional registration funnel
export function trackProfessionalRegistration(step: 'started' | 'form_submitted' | 'completed'): void {
  trackEvent('professional_registration', { step });
}

// Consent update
export function trackConsentUpdate(analytics: boolean, marketing: boolean): void {
  // Fire consent update to GA4 regardless of current consent state
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
    });
  }
}
