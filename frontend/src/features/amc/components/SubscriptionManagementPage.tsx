import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, CreditCard, AlertTriangle, TrendingUp, TrendingDown, Shield, Clock, Calendar } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import {
  SUBSCRIPTION_PLANS,
  Subscription,
  SubscriptionPlan,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
  getUserSubscription,
  calculateUpgradeAmount,
  calculateDowngradeRefund,
  calculateCancellationRefund
} from '@amc/services/subscriptionService';
import { processPayment, PaymentDetails } from '@payment/services/payment';

interface SubscriptionManagementPageProps {
  userId: string;
  onBack: () => void;
}

export function SubscriptionManagementPage({ userId, onBack }: SubscriptionManagementPageProps) {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<'view' | 'upgrade' | 'downgrade' | 'cancel'>('view');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSubscription();
  }, [userId]);

  const loadSubscription = async () => {
    setLoading(true);
    const result = await getUserSubscription(userId);
    if (result.success && result.subscription) {
      setCurrentSubscription(result.subscription);
    }
    setLoading(false);
  };

  const handleUpgrade = async (newTier: string) => {
    if (!currentSubscription) return;

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const upgradeCalc = calculateUpgradeAmount(currentSubscription, newTier as any);

      // Process payment for prorated amount
      const paymentDetails: PaymentDetails = {
        bookingId: `upgrade_${currentSubscription.id}`,
        amount: upgradeCalc.proratedAmount,
        customerName: 'Customer',
        customerPhone: '+919876543210',
        serviceName: `Upgrade to ${newTier.toUpperCase()} Plan`
      };

      const paymentResult = await processPayment(paymentDetails);

      if (!paymentResult.success) {
        setError(paymentResult.error || 'Payment failed');
        setProcessing(false);
        return;
      }

      // Upgrade subscription
      const result = await upgradeSubscription(
        currentSubscription.id,
        newTier as any,
        paymentResult.paymentId!
      );

      if (result.success) {
        setSuccess(`Successfully upgraded to ${newTier.toUpperCase()} plan!`);
        setCurrentSubscription(result.subscription!);
        setTimeout(() => {
          setAction('view');
          setSuccess('');
        }, 2000);
      } else {
        setError(result.error || 'Failed to upgrade subscription');
      }
    } catch (err) {
      setError('An error occurred during upgrade');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleDowngrade = async (newTier: string) => {
    if (!currentSubscription) return;

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const downgradeCalc = calculateDowngradeRefund(currentSubscription, newTier as any);

      const result = await downgradeSubscription(currentSubscription.id, newTier as any);

      if (result.success) {
        setSuccess(
          `Downgrade scheduled for ${new Date(downgradeCalc.effectiveDate).toLocaleDateString()}. ` +
          `${downgradeCalc.refundAmount > 0 ? `You'll receive a credit of ₹${downgradeCalc.refundAmount}.` : ''}`
        );
        setTimeout(() => {
          setAction('view');
          setSuccess('');
        }, 3000);
      } else {
        setError(result.error || 'Failed to schedule downgrade');
      }
    } catch (err) {
      setError('An error occurred during downgrade');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async (immediate: boolean) => {
    if (!currentSubscription) return;

    const confirmed = confirm(
      immediate
        ? `Cancel subscription immediately? You'll receive a refund of ₹${calculateCancellationRefund(currentSubscription).refundAmount}.`
        : 'Cancel subscription at the end of billing period? You can continue using the service until then.'
    );

    if (!confirmed) return;

    setProcessing(true);
    setError('');
    setSuccess('');

    try {
      const result = await cancelSubscription(currentSubscription.id, 'User requested', immediate);

      if (result.success) {
        setSuccess(
          immediate
            ? `Subscription cancelled. Refund of ₹${result.refundAmount} will be processed in 5-7 business days.`
            : `Subscription will be cancelled on ${new Date(result.effectiveDate!).toLocaleDateString()}.`
        );
        setTimeout(() => {
          onBack();
        }, 3000);
      } else {
        setError(result.error || 'Failed to cancel subscription');
      }
    } catch (err) {
      setError('An error occurred during cancellation');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const getTierOrder = () => ['basic', 'standard', 'premium', 'enterprise'];
  const canUpgradeTo = (tier: string) => {
    if (!currentSubscription) return false;
    const currentIndex = getTierOrder().indexOf(currentSubscription.tier);
    const targetIndex = getTierOrder().indexOf(tier);
    return targetIndex > currentIndex;
  };
  const canDowngradeTo = (tier: string) => {
    if (!currentSubscription) return false;
    const currentIndex = getTierOrder().indexOf(currentSubscription.tier);
    const targetIndex = getTierOrder().indexOf(tier);
    return targetIndex < currentIndex;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription...</p>
        </div>
      </div>
    );
  }

  if (!currentSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Subscription</h2>
          <p className="text-gray-600 mb-6">You don't have an active AMC plan. Subscribe now to enjoy benefits!</p>
          <Button onClick={onBack} className="w-full bg-[#2563EB] hover:bg-[#2563EB]">
            Browse AMC Plans
          </Button>
        </Card>
      </div>
    );
  }

  const currentPlan = SUBSCRIPTION_PLANS[currentSubscription.tier];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Subscription</h1>
          <p className="text-gray-600">View and manage your AMC subscription</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">{error}</p>
            </div>
          </div>
        )}

        {/* Current Subscription Card */}
        {action === 'view' && (
          <div className="space-y-6">
            <Card className="p-6 border-2 border-[#2563EB]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h2>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-sm">Active</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Plan Amount</p>
                  <p className="text-2xl font-bold text-gray-900">₹{currentSubscription.amount}</p>
                  <p className="text-xs text-gray-500">per year</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Visits Used</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentSubscription.visitsUsed} / {currentSubscription.visitsTotal}
                  </p>
                  <p className="text-xs text-gray-500">service visits</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Next Billing</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(currentSubscription.nextBillingDate!).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">auto-renew enabled</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <p className="font-semibold text-gray-900 mb-3">Plan Features:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => setAction('upgrade')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={currentSubscription.tier === 'enterprise'}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
                <Button
                  onClick={() => setAction('downgrade')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={currentSubscription.tier === 'basic'}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Downgrade Plan
                </Button>
                <Button
                  onClick={() => setAction('cancel')}
                  variant="outline"
                  className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Upgrade/Downgrade View */}
        {(action === 'upgrade' || action === 'downgrade') && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {action === 'upgrade' ? 'Upgrade Your Plan' : 'Downgrade Your Plan'}
              </h2>
              <p className="text-gray-600 mb-6">
                {action === 'upgrade'
                  ? 'Choose a higher tier to unlock more features and visits.'
                  : 'Downgrade will take effect at the end of your current billing period.'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
                  const isCurrent = plan.tier === currentSubscription.tier;
                  const isAvailable =
                    action === 'upgrade' ? canUpgradeTo(plan.tier) : canDowngradeTo(plan.tier);

                  if (!isAvailable && !isCurrent) return null;

                  return (
                    <div
                      key={plan.tier}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        isCurrent
                          ? 'border-[#2563EB] bg-blue-50'
                          : isAvailable
                          ? 'border-gray-200 hover:border-[#2563EB] cursor-pointer'
                          : 'border-gray-100 bg-gray-50 opacity-50'
                      } ${selectedTier === plan.tier ? 'ring-2 ring-[#2563EB]' : ''}`}
                      onClick={() => isAvailable && setSelectedTier(plan.tier)}
                    >
                      {isCurrent && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-2 text-xs">
                          Current Plan
                        </Badge>
                      )}
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-2xl font-bold text-gray-900 mb-1">₹{plan.price}</p>
                      <p className="text-xs text-gray-500 mb-3">per year</p>
                      <ul className="space-y-1 text-xs text-gray-700">
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-blue-600" />
                          {plan.visitCount} visits/year
                        </li>
                        <li className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-blue-600" />
                          {plan.discountPercentage}% discount
                        </li>
                        {plan.emergencySupport && (
                          <li className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-blue-600" />
                            24/7 Emergency
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {selectedTier && (
                <Card className="p-4 bg-blue-50 border-blue-200 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {action === 'upgrade' ? 'Upgrade Summary' : 'Downgrade Summary'}
                  </h3>
                  {action === 'upgrade' ? (
                    <div className="space-y-2 text-sm text-gray-700">
                      {(() => {
                        const calc = calculateUpgradeAmount(currentSubscription, selectedTier as any);
                        return (
                          <>
                            <div className="flex justify-between">
                              <span>Current Plan:</span>
                              <span className="font-semibold">{currentSubscription.tier.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>New Plan:</span>
                              <span className="font-semibold">{calc.newTier.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Remaining Days:</span>
                              <span className="font-semibold">{calc.remainingDays} days</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                              <span className="font-bold">Amount to Pay Now:</span>
                              <span className="font-bold text-blue-600">₹{calc.proratedAmount}</span>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                              * Pro-rated charge for the remaining period. Your next billing will be on{' '}
                              {new Date(currentSubscription.nextBillingDate!).toLocaleDateString()}.
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm text-gray-700">
                      {(() => {
                        const calc = calculateDowngradeRefund(currentSubscription, selectedTier as any);
                        return (
                          <>
                            <div className="flex justify-between">
                              <span>Current Plan:</span>
                              <span className="font-semibold">{currentSubscription.tier.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>New Plan:</span>
                              <span className="font-semibold">{calc.newTier.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Effective Date:</span>
                              <span className="font-semibold">
                                {new Date(calc.effectiveDate).toLocaleDateString()}
                              </span>
                            </div>
                            {calc.refundAmount > 0 && (
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-bold">Credit Amount:</span>
                                <span className="font-bold text-[#2563EB]">₹{calc.refundAmount}</span>
                              </div>
                            )}
                            <p className="text-xs text-gray-600 mt-2">
                              * Downgrade will take effect on your next billing date. You can continue using your
                              current plan until then.
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </Card>
              )}

              <div className="flex gap-3">
                <Button onClick={() => setAction('view')} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() =>
                    action === 'upgrade' ? handleUpgrade(selectedTier!) : handleDowngrade(selectedTier!)
                  }
                  disabled={!selectedTier || processing}
                  className="flex-1 bg-[#2563EB] hover:bg-[#2563EB]"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Confirm {action === 'upgrade' ? 'Upgrade' : 'Downgrade'}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Cancel View */}
        {action === 'cancel' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancel Subscription</h2>
              <p className="text-gray-600 mb-6">
                We're sorry to see you go. You can choose to cancel immediately or at the end of your billing
                period.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="p-4 border-2 border-gray-200">
                  <div className="flex items-start gap-3 mb-4">
                    <Calendar className="w-6 h-6 text-[#2563EB]" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Cancel at End of Period</h3>
                      <p className="text-sm text-gray-600">Continue using until next billing date</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Use service until {new Date(currentSubscription.nextBillingDate!).toLocaleDateString()}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>No refund, but full access maintained</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => handleCancel(false)}
                    disabled={processing}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel at End of Period
                  </Button>
                </Card>

                <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">Cancel Immediately</h3>
                      <p className="text-sm text-gray-600">Stop service now with pro-rated refund</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>
                        Receive refund of ₹{calculateCancellationRefund(currentSubscription).refundAmount}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Immediate loss of access to benefits</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => handleCancel(true)}
                    disabled={processing}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Cancel Immediately
                  </Button>
                </Card>
              </div>

              <Button onClick={() => setAction('view')} variant="outline" className="w-full">
                Keep My Subscription
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
