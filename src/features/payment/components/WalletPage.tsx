import { useState, useEffect } from 'react';
import {
  ArrowLeft, Plus, ArrowUpRight, ArrowDownLeft, Gift, Tag, Share2,
  CreditCard, Smartphone, Building, ChevronRight, CheckCircle, Copy,
  IndianRupee, TrendingUp, Shield, Clock, Loader2, X, Star,
} from 'lucide-react';
import {
  getLoyaltyBalance,
  getLoyaltyTransactions,
  getUserReferralCode,
  getReferralHistory,
  getReferralStats,
  type LoyaltyBalance,
  type LoyaltyTransaction,
  type Referral,
  type ReferralStats,
} from '@customer/services/loyaltyService';

interface WalletPageProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const topupAmounts = [200, 500, 1000, 2000, 5000];

// Wallet balance is stored in localStorage so it persists across sessions
const WALLET_KEY = 'visvasahome_wallet_balance';
const WALLET_TXN_KEY = 'visvasahome_wallet_transactions';

interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit';
  label: string;
  amount: number;
  date: string;
  note: string;
}

function getWalletBalance(): number {
  const raw = localStorage.getItem(WALLET_KEY);
  return raw ? parseFloat(raw) : 752; // Default seeded balance
}

function setWalletBalance(amount: number) {
  localStorage.setItem(WALLET_KEY, String(amount));
}

function getWalletTransactions(): WalletTransaction[] {
  const raw = localStorage.getItem(WALLET_TXN_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  // Seed default wallet transactions
  return [
    { id: 'wt1', type: 'credit', label: 'Booking Refund', amount: 299, date: 'Today, 2:30 PM', note: 'AC Service cancellation' },
    { id: 'wt2', type: 'debit', label: 'Plumbing Service', amount: 399, date: 'Yesterday, 11:00 AM', note: 'Booking #VH-38291' },
    { id: 'wt3', type: 'credit', label: 'Referral Reward', amount: 100, date: 'Jun 4, 2026', note: 'Friend Arjun joined' },
    { id: 'wt4', type: 'credit', label: 'Cashback Reward', amount: 50, date: 'Jun 3, 2026', note: 'FIRST50 promo' },
    { id: 'wt5', type: 'debit', label: 'Home Cleaning', amount: 1299, date: 'Jun 1, 2026', note: 'Booking #VH-37101' },
    { id: 'wt6', type: 'credit', label: 'Wallet Top-up', amount: 2000, date: 'May 29, 2026', note: 'UPI payment' },
    { id: 'wt7', type: 'debit', label: 'Electrical Service', amount: 199, date: 'May 28, 2026', note: 'Booking #VH-36541' },
  ];
}

function saveWalletTransactions(txns: WalletTransaction[]) {
  localStorage.setItem(WALLET_TXN_KEY, JSON.stringify(txns));
}

// ── Payment Modal ─────────────────────────────────────────────────────────────
interface PaymentModalProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

function PaymentModal({ amount, onSuccess, onCancel }: PaymentModalProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'success' | 'failure'>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('UPI');
  const [upiId, setUpiId] = useState('');

  const handlePay = async () => {
    setStep('processing');
    // Simulate a 1.5 second processing delay
    await new Promise(r => setTimeout(r, 1500));
    // Simulated 95% success rate
    if (Math.random() < 0.95) {
      const mockPaymentId = `pay_mock_${Date.now()}`;
      setStep('success');
      setTimeout(() => onSuccess(mockPaymentId), 1000);
    } else {
      setStep('failure');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2563EB] to-blue-700 p-5 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium opacity-80">VisvasaHome Wallet</span>
            <button onClick={onCancel} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-3xl font-bold">₹{amount.toLocaleString('en-IN')}</div>
          <div className="text-blue-200 text-xs mt-0.5">Wallet Top-up</div>
        </div>

        <div className="p-5">
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
                    <div className="flex-1 min-w-0">
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

              {selectedMethod === 'UPI' && (
                <div className="mb-4">
                  <input
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                    placeholder="Enter UPI ID (e.g., user@paytm)"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
                <Shield className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <span>256-bit SSL secured · VisvasaHome never stores card details</span>
              </div>

              <button
                onClick={handlePay}
                className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Pay ₹{amount.toLocaleString('en-IN')}
              </button>
            </>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center">
              <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
              <p className="font-semibold text-gray-800">Processing Payment…</p>
              <p className="text-xs text-gray-500 mt-1">Please do not close this window</p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>
              <p className="font-bold text-gray-800">Payment Successful!</p>
              <p className="text-sm text-gray-500 mt-1">₹{amount.toLocaleString('en-IN')} added to your wallet</p>
            </div>
          )}

          {step === 'failure' && (
            <div className="py-8 text-center">
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

// ── Tier badge helper ─────────────────────────────────────────────────────────
function TierBadge({ tier }: { tier: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    bronze:   { label: '🥉 Bronze',   cls: 'bg-amber-100 text-amber-800' },
    silver:   { label: '🥈 Silver',   cls: 'bg-gray-100 text-gray-700' },
    gold:     { label: '🥇 Gold',     cls: 'bg-yellow-100 text-yellow-800' },
    platinum: { label: '💎 Platinum', cls: 'bg-purple-100 text-purple-800' },
  };
  const c = config[tier] || config.bronze;
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.cls}`}>{c.label}</span>;
}

// ── Main Component ────────────────────────────────────────────────────────────
export function WalletPage({ onBack, onNavigate }: WalletPageProps) {
  const [tab, setTab] = useState<'wallet' | 'topup' | 'referral'>('wallet');
  const [topupAmount, setTopupAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Dynamic loyalty data
  const [loyaltyBalance, setLoyaltyBalance] = useState<LoyaltyBalance | null>(null);
  const [loyaltyTxns, setLoyaltyTxns] = useState<LoyaltyTransaction[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [referralHistory, setReferralHistory] = useState<Referral[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [loadingLoyalty, setLoadingLoyalty] = useState(true);

  // Wallet balance (localStorage persisted)
  const [walletBalance, setWalletBalanceState] = useState<number>(getWalletBalance());
  const [walletTxns, setWalletTxns] = useState<WalletTransaction[]>(getWalletTransactions());

  const userId = localStorage.getItem('visvasahome_user_id') ||
                 localStorage.getItem('visvasahome_vh_id') ||
                 'CUST001';
  const userName = localStorage.getItem('visvasahome_user_name') || 'User';

  // Load loyalty data on mount
  useEffect(() => {
    async function loadData() {
      setLoadingLoyalty(true);
      try {
        const [bal, txns, code, history, stats] = await Promise.all([
          getLoyaltyBalance(userId),
          getLoyaltyTransactions(userId, 10),
          getUserReferralCode(userId, userName),
          getReferralHistory(userId),
          getReferralStats(userId),
        ]);
        setLoyaltyBalance(bal);
        setLoyaltyTxns(txns);
        setReferralCode(code);
        setReferralHistory(history);
        setReferralStats(stats);
      } catch (err) {
        console.error('[WALLET] Failed to load loyalty data:', err);
      } finally {
        setLoadingLoyalty(false);
      }
    }
    loadData();
  }, [userId]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! Use my referral code *${referralCode}* on VisvasaHome and get ₹100 wallet credit on your first booking! 🏠✨\nDownload: https://visvasahome.com`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const effectiveTopupAmount = customAmount ? parseInt(customAmount, 10) : topupAmount;

  const handleTopupClick = () => {
    if (!effectiveTopupAmount || effectiveTopupAmount < 1) return;
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    // Update wallet balance
    const newBalance = walletBalance + effectiveTopupAmount;
    setWalletBalanceState(newBalance);
    setWalletBalance(newBalance);

    // Add wallet transaction
    const newTxn: WalletTransaction = {
      id: `wt_${Date.now()}`,
      type: 'credit',
      label: 'Wallet Top-up',
      amount: effectiveTopupAmount,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      note: `Payment ID: ${paymentId.slice(0, 18)}…`,
    };
    const updated = [newTxn, ...walletTxns];
    setWalletTxns(updated);
    saveWalletTransactions(updated);

    setShowPaymentModal(false);
    // Reset topup form
    setCustomAmount('');
    setTopupAmount(500);
    setTab('wallet');
  };

  const pendingRewards = loyaltyBalance?.expiringPoints ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          amount={effectiveTopupAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setShowPaymentModal(false)}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-gray-900">Wallet & Rewards</h2>
        </div>
        <div className="max-w-2xl mx-auto px-4 flex border-t border-gray-100">
          {(['wallet', 'topup', 'referral'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium capitalize border-b-2 transition-colors
                ${tab === t ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {t === 'topup' ? 'Add Money' : t === 'referral' ? 'Refer & Earn' : 'My Wallet'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* ── Wallet Tab ── */}
        {tab === 'wallet' && (
          <div>
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#2563EB] to-blue-800 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="w-48 h-48 bg-white rounded-full absolute -top-12 -right-12" />
                <div className="w-32 h-32 bg-white rounded-full absolute -bottom-8 -left-8" />
              </div>
              <div className="relative z-10">
                <p className="text-blue-200 text-sm mb-1">Available Balance</p>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-4xl font-bold">₹{walletBalance.toLocaleString('en-IN')}</span>
                </div>
                {loyaltyBalance && (
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-3.5 h-3.5 text-yellow-300" />
                    <span className="text-blue-200 text-sm">{loyaltyBalance.availablePoints} loyalty pts</span>
                    <TierBadge tier={loyaltyBalance.tier} />
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setTab('topup')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/20 border border-white/30 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Money
                  </button>
                  <button
                    onClick={() => setTab('referral')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/20 border border-white/30 rounded-xl text-sm font-medium hover:bg-white/30 transition-colors"
                  >
                    <TrendingUp className="w-4 h-4" /> Earn More
                  </button>
                </div>
              </div>
            </div>

            {/* Loyalty Rewards Card */}
            {onNavigate && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-900 mb-1">Loyalty Rewards</p>
                    {loadingLoyalty ? (
                      <p className="text-xs text-purple-600">Loading points…</p>
                    ) : (
                      <p className="text-xs text-purple-700">
                        {loyaltyBalance?.availablePoints ?? 0} pts available ·{' '}
                        {loyaltyBalance?.lifetimeEarned ?? 0} pts earned lifetime
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => onNavigate('loyalty-dashboard')}
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    View Rewards
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            {!loadingLoyalty && loyaltyBalance && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  {
                    label: 'Lifetime Earned',
                    value: `${loyaltyBalance.lifetimeEarned} pts`,
                    icon: Tag,
                    color: 'text-green-600 bg-green-100',
                  },
                  {
                    label: 'Redeemed',
                    value: `${loyaltyBalance.lifetimeRedeemed} pts`,
                    icon: Gift,
                    color: 'text-blue-600 bg-blue-100',
                  },
                  {
                    label: 'Referrals',
                    value: String(referralStats?.totalReferrals ?? 0),
                    icon: Share2,
                    color: 'text-purple-600 bg-purple-100',
                  },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                    <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-1.5`}>
                      <s.icon className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-gray-800 text-sm">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Transactions */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">Recent Transactions</h4>
              </div>
              {walletTxns.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">No transactions yet.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {walletTxns.slice(0, 8).map(t => (
                    <div key={t.id} className="flex items-center gap-3 px-4 py-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        ${t.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                        {t.type === 'credit'
                          ? <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          : <ArrowUpRight className="w-5 h-5 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{t.label}</div>
                        <div className="text-xs text-gray-500 truncate">{t.note} · {t.date}</div>
                      </div>
                      <div className={`font-semibold text-sm ${t.type === 'credit' ? 'text-green-600' : 'text-gray-700'}`}>
                        {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Top-up Tab ── */}
        {tab === 'topup' && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-800 mb-4">Select Amount</h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {topupAmounts.map(a => (
                  <button
                    key={a}
                    onClick={() => { setTopupAmount(a); setCustomAmount(''); }}
                    className={`py-2.5 rounded-xl border text-sm font-medium transition-all
                      ${topupAmount === a && !customAmount
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                  >
                    ₹{a.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full border border-gray-300 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  type="number"
                  min="1"
                  onChange={e => { setCustomAmount(e.target.value); setTopupAmount(0); }}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Top-up amount</span>
                <span className="font-semibold">₹{effectiveTopupAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Current balance</span>
                <span>₹{walletBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t border-blue-200 mt-2 pt-2 flex justify-between text-sm font-bold">
                <span className="text-[#2563EB]">New balance</span>
                <span className="text-[#2563EB]">₹{(walletBalance + (effectiveTopupAmount || 0)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500 px-1">
              <Shield className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <span>Your payment is secured with 256-bit SSL encryption. VisvasaHome never stores your card details.</span>
            </div>

            <button
              onClick={handleTopupClick}
              disabled={!effectiveTopupAmount || effectiveTopupAmount < 1}
              className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add ₹{(effectiveTopupAmount || 0).toLocaleString('en-IN')} to Wallet
            </button>
          </div>
        )}

        {/* ── Referral Tab ── */}
        {tab === 'referral' && (
          <div className="space-y-5">
            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-500 to-pink-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="w-32 h-32 bg-white rounded-full absolute -top-8 -right-8" />
              </div>
              <div className="relative z-10">
                <Gift className="w-10 h-10 mx-auto mb-3 text-white" />
                <h3 className="text-white mb-1">Refer & Earn ₹100</h3>
                <p className="text-blue-100 text-sm">Share your code. When a friend books their first service, you both get ₹100 wallet credit!</p>
              </div>
            </div>

            {/* Stats strip */}
            {referralStats && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Referrals', value: referralStats.totalReferrals },
                  { label: 'Rewarded', value: referralStats.completedReferrals },
                  { label: 'Total Earned', value: `₹${referralStats.totalEarned}` },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                    <div className="font-bold text-gray-800">{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Referral Code */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-600 mb-3">Your Referral Code</p>
              {loadingLoyalty ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl px-4 py-3 text-[#2563EB] font-bold tracking-widest text-center">
                      {referralCode}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="px-4 py-2 bg-[#2563EB] text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-sm font-medium"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleWhatsAppShare}
                      className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Smartphone className="w-4 h-4" /> Share via WhatsApp
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: 'Join VisvasaHome!', text: `Use my referral code: ${referralCode}` });
                        }
                      }}
                      className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4" /> More Options
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* How it works */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="font-semibold text-gray-800 mb-4">How It Works</h4>
              <div className="space-y-4">
                {[
                  { icon: Share2, label: 'Share your code', desc: 'Send code to friends via WhatsApp, SMS or any app', color: 'bg-blue-100 text-[#2563EB]' },
                  { icon: CheckCircle, label: 'Friend signs up', desc: 'Your friend creates an account using your code', color: 'bg-green-100 text-green-600' },
                  { icon: IndianRupee, label: 'Both get ₹100', desc: 'After their first booking, you each receive ₹100', color: 'bg-blue-100 text-blue-600' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{s.label}</div>
                      <div className="text-xs text-gray-500">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Referral History */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h4 className="font-semibold text-gray-800">Your Referrals</h4>
              </div>
              {loadingLoyalty ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
                </div>
              ) : referralHistory.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-500">
                  No referrals yet. Share your code to start earning!
                </div>
              ) : (
                referralHistory.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 last:border-0">
                    <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">
                      {(r.refereeName || '?')[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{r.refereeName || 'Pending signup'}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                        ${r.status === 'rewarded' ? 'bg-green-100 text-green-700'
                        : r.status === 'completed' ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                        {r.status === 'rewarded' ? 'Rewarded' : r.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                      {r.status === 'rewarded' && (
                        <div className="text-xs text-green-600 font-bold mt-0.5">+₹{r.creditAmount}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
