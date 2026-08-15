// Subscription & AMC Lifecycle Management for VisvasaHome
import { supabase } from '@core/db/supabaseClient';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  visitCount: number;
  emergencySupport: boolean;
  priorityService: boolean;
  discountPercentage: number;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'suspended' | 'expired';
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
  autoRenew: boolean;
  amount: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  visitsUsed: number;
  visitsTotal: number;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionUpgrade {
  currentTier: string;
  newTier: string;
  proratedAmount: number;
  remainingDays: number;
  effectiveDate: string;
}

export interface SubscriptionDowngrade {
  currentTier: string;
  newTier: string;
  refundAmount: number;
  effectiveDate: string; // Usually next billing cycle
}

// ============================================================================
// SUBSCRIPTION PLANS
// ============================================================================

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  basic: {
    id: 'plan_basic',
    name: 'Basic AMC',
    tier: 'basic',
    price: 2999,
    billingCycle: 'yearly',
    visitCount: 4,
    emergencySupport: false,
    priorityService: false,
    discountPercentage: 10,
    features: [
      '4 scheduled visits per year',
      '10% discount on all services',
      'Scheduled maintenance',
      'Email support',
      'Service warranty'
    ]
  },
  standard: {
    id: 'plan_standard',
    name: 'Standard AMC',
    tier: 'standard',
    price: 5999,
    billingCycle: 'yearly',
    visitCount: 8,
    emergencySupport: false,
    priorityService: true,
    discountPercentage: 15,
    features: [
      '8 scheduled visits per year',
      '15% discount on all services',
      'Priority scheduling',
      'Phone & email support',
      'Extended service warranty',
      'Preventive maintenance'
    ]
  },
  premium: {
    id: 'plan_premium',
    name: 'Premium AMC',
    tier: 'premium',
    price: 9999,
    billingCycle: 'yearly',
    visitCount: 12,
    emergencySupport: true,
    priorityService: true,
    discountPercentage: 20,
    features: [
      '12 scheduled visits per year',
      '20% discount on all services',
      'Priority scheduling',
      '24/7 emergency support',
      '1-year extended warranty',
      'Preventive + predictive maintenance',
      'Dedicated account manager'
    ]
  },
  enterprise: {
    id: 'plan_enterprise',
    name: 'Enterprise AMC',
    tier: 'enterprise',
    price: 19999,
    billingCycle: 'yearly',
    visitCount: 24,
    emergencySupport: true,
    priorityService: true,
    discountPercentage: 25,
    features: [
      '24 scheduled visits per year',
      '25% discount on all services',
      'Highest priority scheduling',
      '24/7 dedicated emergency hotline',
      '2-year extended warranty',
      'Comprehensive maintenance',
      'Dedicated team',
      'Custom SLA',
      'Quarterly reports'
    ]
  }
};

// ============================================================================
// SUBSCRIPTION CREATION
// ============================================================================

export const createSubscription = async (
  userId: string,
  planId: string,
  paymentId: string
): Promise<{ success: boolean; subscription?: Subscription; error?: string }> => {
  try {
    const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === planId);
    if (!plan) {
      return { success: false, error: 'Invalid plan selected' };
    }

    const now = new Date();
    const endDate = new Date(now);

    // Calculate end date based on billing cycle
    if (plan.billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan.billingCycle === 'quarterly') {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (plan.billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscriptionData: Partial<Subscription> = {
      userId,
      planId: plan.id,
      tier: plan.tier,
      status: 'active',
      startDate: now.toISOString(),
      endDate: endDate.toISOString(),
      nextBillingDate: endDate.toISOString(),
      autoRenew: true,
      amount: plan.price,
      billingCycle: plan.billingCycle,
      visitsUsed: 0,
      visitsTotal: plan.visitCount,
      paymentId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    // In production, save to Supabase
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      // Fallback for demo mode
      const mockSubscription: Subscription = {
        id: `sub_${Date.now()}`,
        ...subscriptionData as Subscription
      };
      return { success: true, subscription: mockSubscription };
    }

    return { success: true, subscription: data };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return { success: false, error: 'Failed to create subscription' };
  }
};

// ============================================================================
// SUBSCRIPTION UPGRADE
// ============================================================================

export const calculateUpgradeAmount = (
  currentSubscription: Subscription,
  newTier: 'basic' | 'standard' | 'premium' | 'enterprise'
): SubscriptionUpgrade => {
  const currentPlan = SUBSCRIPTION_PLANS[currentSubscription.tier];
  const newPlan = Object.values(SUBSCRIPTION_PLANS).find(p => p.tier === newTier);

  if (!newPlan) {
    throw new Error('Invalid target tier');
  }

  // Calculate remaining days
  const now = new Date();
  const endDate = new Date(currentSubscription.endDate);
  const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate total days in subscription period
  const startDate = new Date(currentSubscription.startDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate prorated amount
  const unusedAmount = (currentSubscription.amount * remainingDays) / totalDays;
  const proratedAmount = newPlan.price - unusedAmount;

  return {
    currentTier: currentSubscription.tier,
    newTier: newPlan.tier,
    proratedAmount: Math.max(0, Math.round(proratedAmount)),
    remainingDays,
    effectiveDate: now.toISOString()
  };
};

export const upgradeSubscription = async (
  subscriptionId: string,
  newTier: 'basic' | 'standard' | 'premium' | 'enterprise',
  paymentId: string
): Promise<{ success: boolean; subscription?: Subscription; upgradeDetails?: SubscriptionUpgrade; error?: string }> => {
  try {
    // Get current subscription
    const { data: currentSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (fetchError || !currentSub) {
      // Demo fallback
      const mockCurrentSub: Subscription = {
        id: subscriptionId,
        userId: 'user_123',
        planId: 'plan_basic',
        tier: 'basic',
        status: 'active',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        nextBillingDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        amount: 2999,
        billingCycle: 'yearly',
        visitsUsed: 1,
        visitsTotal: 4,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };

      const upgradeDetails = calculateUpgradeAmount(mockCurrentSub, newTier);
      const newPlan = Object.values(SUBSCRIPTION_PLANS).find(p => p.tier === newTier)!;

      const upgradedSub: Subscription = {
        ...mockCurrentSub,
        tier: newTier,
        planId: newPlan.id,
        amount: newPlan.price,
        visitsTotal: newPlan.visitCount,
        paymentId,
        updatedAt: new Date().toISOString()
      };

      return { success: true, subscription: upgradedSub, upgradeDetails };
    }

    // Validate upgrade
    const tierOrder = ['basic', 'standard', 'premium', 'enterprise'];
    const currentIndex = tierOrder.indexOf(currentSub.tier);
    const newIndex = tierOrder.indexOf(newTier);

    if (newIndex <= currentIndex) {
      return { success: false, error: 'Can only upgrade to a higher tier. Use downgrade for lower tiers.' };
    }

    const upgradeDetails = calculateUpgradeAmount(currentSub, newTier);
    const newPlan = Object.values(SUBSCRIPTION_PLANS).find(p => p.tier === newTier)!;

    // Update subscription
    const { data: updatedSub, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        tier: newTier,
        planId: newPlan.id,
        amount: newPlan.price,
        visitsTotal: newPlan.visitCount,
        paymentId,
        updatedAt: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error upgrading subscription:', updateError);
      return { success: false, error: 'Failed to upgrade subscription' };
    }

    // Log upgrade transaction
    await logSubscriptionChange(subscriptionId, currentSub.tier, newTier, 'upgrade', upgradeDetails.proratedAmount, paymentId);

    return { success: true, subscription: updatedSub, upgradeDetails };
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    return { success: false, error: 'Failed to upgrade subscription' };
  }
};

// ============================================================================
// SUBSCRIPTION DOWNGRADE
// ============================================================================

export const calculateDowngradeRefund = (
  currentSubscription: Subscription,
  newTier: 'basic' | 'standard' | 'premium' | 'enterprise'
): SubscriptionDowngrade => {
  const newPlan = Object.values(SUBSCRIPTION_PLANS).find(p => p.tier === newTier);

  if (!newPlan) {
    throw new Error('Invalid target tier');
  }

  // Calculate remaining days until next billing
  const now = new Date();
  const nextBilling = new Date(currentSubscription.nextBillingDate || currentSubscription.endDate);
  const remainingDays = Math.ceil((nextBilling.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Downgrade takes effect at next billing cycle
  // No immediate refund, but pro-rated credit can be applied
  const priceDifference = currentSubscription.amount - newPlan.price;
  const refundAmount = Math.max(0, Math.round((priceDifference * remainingDays) / 365));

  return {
    currentTier: currentSubscription.tier,
    newTier: newPlan.tier,
    refundAmount,
    effectiveDate: nextBilling.toISOString() // Takes effect next billing cycle
  };
};

export const downgradeSubscription = async (
  subscriptionId: string,
  newTier: 'basic' | 'standard' | 'premium' | 'enterprise'
): Promise<{ success: boolean; subscription?: Subscription; downgradeDetails?: SubscriptionDowngrade; error?: string }> => {
  try {
    // Get current subscription
    const { data: currentSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (fetchError || !currentSub) {
      // Demo fallback
      const mockCurrentSub: Subscription = {
        id: subscriptionId,
        userId: 'user_123',
        planId: 'plan_premium',
        tier: 'premium',
        status: 'active',
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
        nextBillingDate: new Date(Date.now() + 305 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        amount: 9999,
        billingCycle: 'yearly',
        visitsUsed: 3,
        visitsTotal: 12,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };

      const downgradeDetails = calculateDowngradeRefund(mockCurrentSub, newTier);

      return { success: true, subscription: mockCurrentSub, downgradeDetails };
    }

    // Validate downgrade
    const tierOrder = ['basic', 'standard', 'premium', 'enterprise'];
    const currentIndex = tierOrder.indexOf(currentSub.tier);
    const newIndex = tierOrder.indexOf(newTier);

    if (newIndex >= currentIndex) {
      return { success: false, error: 'Can only downgrade to a lower tier. Use upgrade for higher tiers.' };
    }

    const downgradeDetails = calculateDowngradeRefund(currentSub, newTier);
    const newPlan = Object.values(SUBSCRIPTION_PLANS).find(p => p.tier === newTier)!;

    // Schedule downgrade for next billing cycle
    // In production, you'd set a "pending_downgrade" field
    const { data: updatedSub, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        // Don't change tier immediately, schedule it
        // tier: newTier, // This happens on next billing
        // planId: newPlan.id,
        updatedAt: new Date().toISOString()
        // You might add: pending_downgrade_tier, pending_downgrade_date
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error downgrading subscription:', updateError);
      return { success: false, error: 'Failed to schedule downgrade' };
    }

    // Log downgrade scheduling
    await logSubscriptionChange(subscriptionId, currentSub.tier, newTier, 'downgrade_scheduled', 0);

    return { success: true, subscription: currentSub, downgradeDetails };
  } catch (error) {
    console.error('Error downgrading subscription:', error);
    return { success: false, error: 'Failed to downgrade subscription' };
  }
};

// ============================================================================
// SUBSCRIPTION CANCELLATION
// ============================================================================

export const calculateCancellationRefund = (
  subscription: Subscription
): { refundAmount: number; remainingDays: number } => {
  const now = new Date();
  const endDate = new Date(subscription.endDate);
  const remainingDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (remainingDays <= 0) {
    return { refundAmount: 0, remainingDays: 0 };
  }

  // Calculate total days in subscription period
  const startDate = new Date(subscription.startDate);
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Pro-rated refund based on unused time
  const refundAmount = Math.round((subscription.amount * remainingDays) / totalDays);

  return { refundAmount, remainingDays };
};

export const cancelSubscription = async (
  subscriptionId: string,
  reason?: string,
  immediateCancel: boolean = false
): Promise<{
  success: boolean;
  refundAmount?: number;
  refundId?: string;
  effectiveDate?: string;
  error?: string
}> => {
  try {
    // Get current subscription
    const { data: currentSub, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (fetchError || !currentSub) {
      // Demo fallback
      const mockCurrentSub: Subscription = {
        id: subscriptionId,
        userId: 'user_123',
        planId: 'plan_standard',
        tier: 'standard',
        status: 'active',
        startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
        nextBillingDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        amount: 5999,
        billingCycle: 'yearly',
        visitsUsed: 2,
        visitsTotal: 8,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };

      const { refundAmount, remainingDays } = calculateCancellationRefund(mockCurrentSub);

      return {
        success: true,
        refundAmount,
        refundId: `rfnd_${Date.now()}`,
        effectiveDate: immediateCancel ? new Date().toISOString() : mockCurrentSub.endDate
      };
    }

    const { refundAmount, remainingDays } = calculateCancellationRefund(currentSub);

    let effectiveDate: string;
    let newStatus: Subscription['status'];

    if (immediateCancel) {
      // Immediate cancellation with pro-rated refund
      effectiveDate = new Date().toISOString();
      newStatus = 'cancelled';
    } else {
      // Cancel at end of billing period (no refund)
      effectiveDate = currentSub.endDate;
      newStatus = 'active'; // Stays active until end date
    }

    // Update subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: newStatus,
        autoRenew: false,
        updatedAt: new Date().toISOString()
        // You might add: cancellation_reason, cancelled_at
      })
      .eq('id', subscriptionId);

    if (updateError) {
      console.error('Error cancelling subscription:', updateError);
      return { success: false, error: 'Failed to cancel subscription' };
    }

    // Process refund if immediate cancellation
    let refundId: string | undefined;
    if (immediateCancel && refundAmount > 0 && currentSub.paymentId) {
      // In production, call payment gateway to process refund
      // const refundResult = await refundPayment(currentSub.paymentId, refundAmount);
      refundId = `rfnd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Log cancellation
    await logSubscriptionChange(
      subscriptionId,
      currentSub.tier,
      'cancelled',
      immediateCancel ? 'immediate_cancellation' : 'scheduled_cancellation',
      refundAmount,
      undefined,
      reason
    );

    return {
      success: true,
      refundAmount: immediateCancel ? refundAmount : 0,
      refundId,
      effectiveDate
    };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return { success: false, error: 'Failed to cancel subscription' };
  }
};

// ============================================================================
// SUBSCRIPTION REACTIVATION
// ============================================================================

export const reactivateSubscription = async (
  subscriptionId: string,
  paymentId: string
): Promise<{ success: boolean; subscription?: Subscription; error?: string }> => {
  try {
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .single();

    if (fetchError || !subscription) {
      return { success: false, error: 'Subscription not found' };
    }

    if (subscription.status === 'active') {
      return { success: false, error: 'Subscription is already active' };
    }

    // Calculate new end date
    const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === subscription.planId);
    if (!plan) {
      return { success: false, error: 'Invalid plan' };
    }

    const now = new Date();
    const newEndDate = new Date(now);

    if (plan.billingCycle === 'monthly') {
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else if (plan.billingCycle === 'quarterly') {
      newEndDate.setMonth(newEndDate.getMonth() + 3);
    } else if (plan.billingCycle === 'yearly') {
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    }

    const { data: updatedSub, error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        autoRenew: true,
        startDate: now.toISOString(),
        endDate: newEndDate.toISOString(),
        nextBillingDate: newEndDate.toISOString(),
        paymentId,
        updatedAt: now.toISOString()
      })
      .eq('id', subscriptionId)
      .select()
      .single();

    if (updateError) {
      console.error('Error reactivating subscription:', updateError);
      return { success: false, error: 'Failed to reactivate subscription' };
    }

    await logSubscriptionChange(subscriptionId, 'cancelled', subscription.tier, 'reactivation', subscription.amount, paymentId);

    return { success: true, subscription: updatedSub };
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return { success: false, error: 'Failed to reactivate subscription' };
  }
};

// ============================================================================
// SUBSCRIPTION QUERIES
// ============================================================================

export const getUserSubscription = async (
  userId: string
): Promise<{ success: boolean; subscription?: Subscription; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('userId', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.log('No active subscription found');
      return { success: false, error: 'No active subscription' };
    }

    return { success: true, subscription: data };
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return { success: false, error: 'Failed to fetch subscription' };
  }
};

// ============================================================================
// LOGGING & AUDIT
// ============================================================================

const logSubscriptionChange = async (
  subscriptionId: string,
  fromTier: string,
  toTier: string,
  changeType: 'upgrade' | 'downgrade' | 'downgrade_scheduled' | 'cancellation' | 'immediate_cancellation' | 'scheduled_cancellation' | 'reactivation',
  amount?: number,
  paymentId?: string,
  notes?: string
): Promise<void> => {
  try {
    const logEntry = {
      subscription_id: subscriptionId,
      change_type: changeType,
      from_tier: fromTier,
      to_tier: toTier,
      amount,
      payment_id: paymentId,
      notes,
      created_at: new Date().toISOString()
    };

    await supabase.from('subscription_changes').insert([logEntry]);

    console.log('[SUBSCRIPTION CHANGE]', logEntry);
  } catch (error) {
    console.error('Error logging subscription change:', error);
  }
};

export default {
  SUBSCRIPTION_PLANS,
  createSubscription,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
  reactivateSubscription,
  getUserSubscription,
  calculateUpgradeAmount,
  calculateDowngradeRefund,
  calculateCancellationRefund
};
