import { useState, useEffect } from 'react';
import {
  Award, Calendar, CheckCircle, Building2, AlertTriangle,
  Shield, Loader2, X, CreditCard, Smartphone, Building, IndianRupee,
} from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import {
  getProjectQuotes,
  acceptQuote,
  calculateMilestoneCommission,
  COMMISSION_CONFIG,
  type ContractorQuote,
} from '@professional/services/contractorService';

interface ContractorQuoteComparisonPageProps {
  projectId: string;
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

// ── Payment Modal for first-milestone escrow ─────────────────────────────────
interface QuotePaymentModalProps {
  quote: ContractorQuote;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

function QuotePaymentModal({ quote, onSuccess, onCancel }: QuotePaymentModalProps) {
  const [step, setStep] = useState<'review' | 'method' | 'processing' | 'success' | 'failure'>('review');
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const firstMilestone = quote.milestones[0];
  const { commission, netAmount } = calculateMilestoneCommission(firstMilestone.paymentAmount);

  const handlePay = async () => {
    setStep('processing');
    await new Promise(r => setTimeout(r, 2000));
    if (Math.random() < 0.95) {
      const mockId = `pay_escrow_${Date.now()}`;
      setStep('success');
      setTimeout(() => onSuccess(mockId), 1200);
    } else {
      setStep('failure');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-blue-700 p-5 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium opacity-80">Secure Escrow Payment</span>
            <button onClick={onCancel} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-2xl font-bold">₹{firstMilestone.paymentAmount.toLocaleString('en-IN')}</div>
          <div className="text-blue-200 text-xs mt-0.5">First Milestone · Held in Escrow</div>
        </div>

        <div className="p-5">
          {step === 'review' && (
            <>
              {/* Escrow explanation */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Escrow Protection</p>
                    <p className="text-xs text-amber-700 mt-1">
                      Your payment is held securely by VisvasaHome. It is released to the contractor only after you approve each milestone.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment breakdown */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contractor: {quote.contractorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Milestone</span>
                  <span className="font-medium">{firstMilestone.title}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Milestone Amount</span>
                  <span className="font-medium">₹{firstMilestone.paymentAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Commission ({(COMMISSION_CONFIG.contractorMilestone * 100).toFixed(0)}%)</span>
                  <span className="text-orange-600">₹{commission.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold">
                  <span className="text-green-700">Contractor Receives</span>
                  <span className="text-green-700">₹{netAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2563EB]">
                  <span>You Pay Now</span>
                  <span>₹{firstMilestone.paymentAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onCancel}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('method')}
                  className="flex-1 py-2.5 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Proceed to Pay
                </button>
              </div>
            </>
          )}

          {step === 'method' && (
            <>
              <p className="text-sm font-semibold text-gray-800 mb-3">Select Payment Method</p>
              <div className="space-y-2 mb-4">
                {[
                  { icon: Smartphone, label: 'UPI', sub: 'Google Pay, PhonePe, Paytm, BHIM', recommended: true },
                  { icon: CreditCard, label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                  { icon: Building, label: 'Net Banking', sub: 'All major banks supported' },
                ].map(m => (
                  <button
                    key={m.label}
                    onClick={() => setSelectedMethod(m.label)}
                    className={`w-full flex items-center gap-3 p-3 border rounded-xl transition-all text-left
                      ${selectedMethod === m.label ? 'border-[#2563EB] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <m.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                        {m.label}
                        {m.recommended && (
                          <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full">Recommended</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">{m.sub}</div>
                    </div>
                    {selectedMethod === m.label && <CheckCircle className="w-4 h-4 text-[#2563EB]" />}
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
                <Shield className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <span>256-bit SSL secured · Payment held in escrow until milestone is approved</span>
              </div>
              <button
                onClick={handlePay}
                className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Pay & Hold ₹{firstMilestone.paymentAmount.toLocaleString('en-IN')} in Escrow
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="py-10 text-center">
              <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
              <p className="font-semibold text-gray-800">Securing Payment in Escrow…</p>
              <p className="text-xs text-gray-500 mt-1">Please do not close this window</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-10 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
              <p className="font-bold text-gray-800">Payment Held in Escrow!</p>
              <p className="text-sm text-gray-500 mt-1">
                ₹{firstMilestone.paymentAmount.toLocaleString('en-IN')} secured · Project starting now
              </p>
            </div>
          )}

          {step === 'failure' && (
            <div className="py-10 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-9 h-9 text-red-500" />
              </div>
              <p className="font-bold text-gray-800">Payment Failed</p>
              <p className="text-sm text-gray-500 mt-1 mb-4">Something went wrong. Please try again.</p>
              <button
                onClick={() => setStep('method')}
                className="w-full py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export const ContractorQuoteComparisonPage = ({
  projectId,
  onBack,
  onNavigate,
}: ContractorQuoteComparisonPageProps) => {
  const [quotes, setQuotes] = useState<ContractorQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [payingQuoteId, setPayingQuoteId] = useState<string | null>(null);

  useEffect(() => {
    // Ownership check (IDOR Protection)
    const loggedInUserId = localStorage.getItem('visvasahome_user_id') || localStorage.getItem('visvasahome_vh_id');
    const savedReqs = localStorage.getItem('visvasahome_contractor_requirements');
    if (savedReqs && loggedInUserId) {
      try {
        const parsedReqs = JSON.parse(savedReqs);
        const req = parsedReqs.find((r: any) => r.id === projectId);
        if (req && req.customerId !== loggedInUserId) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }
    setIsAuthorized(true);
    loadQuotes();
  }, [projectId]);

  const loadQuotes = async () => {
    setLoading(true);
    try {
      const quotesData = await getProjectQuotes(projectId);
      setQuotes(quotesData);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Called after escrow payment succeeds
  const handlePaymentSuccess = async (quoteId: string, paymentId: string) => {
    const result = await acceptQuote(quoteId, paymentId);
    setPayingQuoteId(null);
    if (result.success && result.project) {
      onNavigate('contractor-project-detail', { projectId: result.project.id });
    }
  };

  const formatCurrency = (amount: number): string => `₹${amount.toLocaleString('en-IN')}`;

  const QuoteCard = ({ quote }: { quote: ContractorQuote }) => {
    const isSelected = selectedQuote === quote.id;
    const isLowestPrice = quotes.every(q => quote.quotedAmount <= q.quotedAmount);
    const firstMilestone = quote.milestones[0];
    const { commission } = calculateMilestoneCommission(firstMilestone?.paymentAmount ?? 0);

    return (
      <Card className={`relative ${isSelected ? 'ring-2 ring-[#2563EB]' : ''}`}>
        {isLowestPrice && (
          <div className="absolute top-0 right-0 bg-gradient-to-l from-green-600 to-green-400 text-white text-xs px-3 py-1 rounded-bl-lg">
            BEST PRICE
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl">{quote.contractorName}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="font-semibold">{quote.contractorRating}</span>
                  <span className="text-sm text-[color:var(--color-text-secondary)]">/ 5.0</span>
                </div>
                <Badge variant="secondary">Verified</Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Price */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-900">Total Quote</span>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(quote.quotedAmount)}</p>
                {quote.milestones.length > 0 && (
                  <p className="text-xs text-[#2563EB] mt-1">In {quote.milestones.length} milestones</p>
                )}
              </div>
            </div>
            {/* First milestone escrow info */}
            {firstMilestone && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <p className="text-xs text-gray-600">
                  Pay now (1st milestone escrow): <span className="font-semibold text-[#2563EB]">{formatCurrency(firstMilestone.paymentAmount)}</span>
                  <span className="text-gray-500"> · Platform fee: {formatCurrency(commission)} ({(COMMISSION_CONFIG.contractorMilestone * 100).toFixed(0)}%)</span>
                </p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[color:var(--color-text-secondary)]" />
            <div>
              <p className="text-sm text-[color:var(--color-text-secondary)]">Project Duration</p>
              <p className="font-semibold">{quote.timeline}</p>
            </div>
          </div>

          {/* Line Items Summary */}
          <div>
            <p className="text-sm font-semibold mb-2">Cost Breakdown</p>
            <div className="space-y-2">
              {quote.lineItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[color:var(--color-text-secondary)]">{item.description}</span>
                  <span className="font-medium">{formatCurrency(item.total)}</span>
                </div>
              ))}
              {quote.lineItems.length > 3 && (
                <p className="text-xs text-[color:var(--color-text-secondary)]">
                  + {quote.lineItems.length - 3} more items
                </p>
              )}
            </div>
          </div>

          {/* Milestones */}
          <div>
            <p className="text-sm font-semibold mb-2">Payment Milestones</p>
            <div className="space-y-2">
              {quote.milestones.map((milestone, idx) => (
                <div key={milestone.id} className="flex items-start gap-2 text-sm">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-gray-900 flex items-center justify-center text-xs font-semibold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-xs text-[color:var(--color-text-secondary)]">
                      {formatCurrency(milestone.paymentAmount)} · Day {milestone.targetDays}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms */}
          <div className="bg-[color:var(--color-background)] rounded-lg p-3">
            <p className="text-xs text-[color:var(--color-text-secondary)]">{quote.terms}</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[color:var(--color-border)]">
            <Button
              onClick={() => setSelectedQuote(isSelected ? null : quote.id)}
              variant="outline"
            >
              {isSelected ? 'Collapse' : 'View Full Quote'}
            </Button>
            <Button
              onClick={() => setPayingQuoteId(quote.id)}
              disabled={quote.status !== 'pending'}
              className="bg-[#2563EB] hover:bg-blue-700 text-white"
            >
              {quote.status === 'accepted' ? 'Accepted ✓' : 'Accept & Pay'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] p-4">
        <div className="max-w-6xl mx-auto">
          <Button onClick={onBack} variant="ghost">← Back</Button>
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mx-auto mb-3" />
            <p className="text-[color:var(--color-text-secondary)]">Loading quotes…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <Card className="p-8 max-w-sm w-full shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            You do not have permission to view quotes for this project requirement.
          </p>
          <Button
            onClick={onBack}
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // Get quote being paid for the modal
  const payingQuote = quotes.find(q => q.id === payingQuoteId);

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] pb-20">
      {/* Payment Modal */}
      {payingQuote && (
        <QuotePaymentModal
          quote={payingQuote}
          onSuccess={(paymentId) => handlePaymentSuccess(payingQuote.id, paymentId)}
          onCancel={() => setPayingQuoteId(null)}
        />
      )}

      {/* Header */}
      <div className="bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button onClick={onBack} variant="ghost" className="mb-2">← Back</Button>
          <h1 className="text-2xl font-bold">Compare Contractor Quotes</h1>
          <p className="text-sm text-[color:var(--color-text-secondary)] mt-1">
            You received {quotes.length} quote{quotes.length !== 1 && 's'} for your project
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Comparison */}
        {quotes.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Quick Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-[color:var(--color-text-secondary)] mb-2">Price Range</p>
                  <p className="font-semibold">
                    {formatCurrency(Math.min(...quotes.map(q => q.quotedAmount)))} –{' '}
                    {formatCurrency(Math.max(...quotes.map(q => q.quotedAmount)))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-text-secondary)] mb-2">Timeline Range</p>
                  <p className="font-semibold">
                    {Math.min(...quotes.map(q => parseInt(q.timeline)))} –{' '}
                    {Math.max(...quotes.map(q => parseInt(q.timeline)))} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-text-secondary)] mb-2">Avg Rating</p>
                  <p className="font-semibold">
                    {(quotes.reduce((sum, q) => sum + q.contractorRating, 0) / quotes.length).toFixed(1)} / 5.0
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[color:var(--color-text-secondary)] mb-2">Platform Commission</p>
                  <p className="font-semibold text-orange-600">
                    {(COMMISSION_CONFIG.contractorMilestone * 100).toFixed(0)}% per milestone
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quotes Grid */}
        {quotes.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {quotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 mx-auto text-[color:var(--color-text-tertiary)] mb-4" />
            <p className="text-[color:var(--color-text-secondary)]">No quotes received yet</p>
            <p className="text-sm text-[color:var(--color-text-tertiary)] mt-2">
              Contractors typically respond within 48 hours
            </p>
          </div>
        )}

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Tips for Choosing a Contractor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-900">
            <p>• Don't just go for the lowest price - consider experience and ratings</p>
            <p>• Check the milestone breakdown to understand payment structure</p>
            <p>• Review the timeline carefully and ensure it matches your needs</p>
            <p>• Read the terms and conditions before accepting</p>
            <p>• Your payment is held in escrow for safety - released per milestone approval</p>
            <p>• Platform commission: <span className="font-semibold text-orange-600">{(COMMISSION_CONFIG.contractorMilestone * 100).toFixed(0)}%</span> per milestone · Standard bookings: <span className="font-semibold text-orange-600">{(COMMISSION_CONFIG.standardBooking * 100).toFixed(0)}%</span></p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
