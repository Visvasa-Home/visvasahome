import { useCallback } from 'react';
import {
  trackEvent,
  trackServiceView,
  trackServiceCTAClick,
  trackBookingFunnel,
  trackAuthEvent,
  trackSearch,
  trackAMCInterest,
  trackPaymentEvent,
  trackCTAClick,
  trackProfessionalRegistration,
  isAnalyticsEnabled,
  type BookingStep,
  type AuthAction,
  type PaymentAction,
} from '@core/analytics/analytics';

export function useAnalytics() {
  const enabled = isAnalyticsEnabled();

  return {
    enabled,
    trackEvent: useCallback(
      (name: string, params?: Record<string, string | number | boolean>) =>
        trackEvent(name, params),
      []
    ),
    trackServiceView: useCallback(
      (serviceName: string, category?: string) =>
        trackServiceView(serviceName, category),
      []
    ),
    trackServiceCTAClick: useCallback(
      (serviceName: string, ctaLabel: string) =>
        trackServiceCTAClick(serviceName, ctaLabel),
      []
    ),
    trackBookingFunnel: useCallback(
      (step: BookingStep, serviceName?: string, value?: number) =>
        trackBookingFunnel(step, serviceName, value),
      []
    ),
    trackAuthEvent: useCallback(
      (action: AuthAction, method?: string) => trackAuthEvent(action, method),
      []
    ),
    trackSearch: useCallback(
      (query: string, resultsCount?: number) => trackSearch(query, resultsCount),
      []
    ),
    trackAMCInterest: useCallback(
      (planType: string, action: 'view' | 'enquire' | 'subscribe') =>
        trackAMCInterest(planType, action),
      []
    ),
    trackPaymentEvent: useCallback(
      (action: PaymentAction, amount?: number) => trackPaymentEvent(action, amount),
      []
    ),
    trackCTAClick: useCallback(
      (ctaName: string, location: string) => trackCTAClick(ctaName, location),
      []
    ),
    trackProfessionalRegistration: useCallback(
      (step: 'started' | 'form_submitted' | 'completed') =>
        trackProfessionalRegistration(step),
      []
    ),
  };
}
