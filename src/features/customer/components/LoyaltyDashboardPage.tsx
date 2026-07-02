import { useState, useEffect, useRef } from 'react';
import {
  Gift, TrendingUp, Users, Award, Copy, Check, ArrowLeft,
  Star, Zap, Crown, Shield, Share2, ChevronRight, Sparkles,
  RotateCcw, Clock, CheckCircle2, Circle, Trophy
} from 'lucide-react';
import {
  getLoyaltyBalance,
  getLoyaltyTransactions,
  getUserReferralCode,
  getReferralStats,
  getReferralHistory,
  redeemPoints,
  pointsToAmount,
  type LoyaltyBalance,
  type LoyaltyTransaction,
  type Referral
} from '@customer/services/loyaltyService';

interface LoyaltyDashboardPageProps {
  onBack: () => void;
}

// Tiers config
const TIERS = [
  { name: 'Silver', min: 0, max: 999, icon: Shield, color: '#64748b', bg: 'from-slate-400 to-slate-600', light: '#f1f5f9' },
  { name: 'Gold', min: 1000, max: 4999, icon: Star, color: '#d97706', bg: 'from-amber-400 to-yellow-600', light: '#fffbeb' },
  { name: 'Platinum', min: 5000, max: 9999, icon: Crown, color: '#7c3aed', bg: 'from-violet-500 to-purple-700', light: '#f5f3ff' },
  { name: 'Diamond', min: 10000, max: Infinity, icon: Trophy, color: '#0ea5e9', bg: 'from-sky-400 to-blue-600', light: '#f0f9ff' },
];

const REWARDS = [
  { id: 1, name: '₹50 Off Next Booking', points: 500, category: 'Discount', icon: '🏷️', popular: false },
  { id: 2, name: '₹100 Wallet Credit', points: 1000, category: 'Wallet', icon: '💰', popular: true },
  { id: 3, name: 'Free AC Filter Cleaning', points: 1500, category: 'Service', icon: '❄️', popular: false },
  { id: 4, name: '₹200 Off on AMC Plan', points: 2000, category: 'AMC', icon: '📋', popular: false },
  { id: 5, name: 'Priority Support (1 yr)', points: 3000, category: 'Perks', icon: '⚡', popular: false },
  { id: 6, name: '₹500 Wallet Credit', points: 5000, category: 'Wallet', icon: '💎', popular: false },
];

function AnimatedCounter({ target, duration = 1200 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = duration / steps;

    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString('en-IN')}</span>;
}

export const LoyaltyDashboardPage = ({ onBack }: LoyaltyDashboardPageProps) => {
  const [balance, setBalance] = useState<LoyaltyBalance | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState<any>(null);
  const [referralHistory, setReferralHistory] = useState<Referral[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'earn' | 'rewards' | 'referrals' | 'history'>('earn');
  const [redeeming, setRedeeming] = useState(false);

  const userId = 'CUST001';
  const userName = 'Rajesh Kumar';

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    setLoading(true);
    try {
      const [balanceData, txns, code, stats, history] = await Promise.all([
        getLoyaltyBalance(userId),
        getLoyaltyTransactions(userId, 20),
        getUserReferralCode(userId, userName),
        getReferralStats(userId),
        getReferralHistory(userId),
      ]);
      setBalance(balanceData);
      setTransactions(txns);
      setReferralCode(code);
      setReferralStats(stats);
      setReferralHistory(history);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `Use my VisvasaHome referral code *${referralCode}* and get ₹100 off your first booking! 🏠✨\nhttps://visvasahome.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleRedeemPoints = async () => {
    if (!balance || balance.availablePoints < 100) return;
    setRedeeming(true);
    const points = Math.floor(balance.availablePoints / 100) * 100;
    const result = await redeemPoints(userId, points);
    if (result.success) loadLoyaltyData();
    setRedeeming(false);
  };

  const getCurrentTier = (pts: number) => TIERS.find(t => pts >= t.min && pts <= t.max) || TIERS[0];
  const getNextTier = (pts: number) => {
    const idx = TIERS.findIndex(t => pts >= t.min && pts <= t.max);
    return idx < TIERS.length - 1 ? TIERS[idx + 1] : null;
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date);

  if (loading || !balance) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  const tier = getCurrentTier(balance.lifetimeEarned || balance.availablePoints);
  const nextTier = getNextTier(balance.lifetimeEarned || balance.availablePoints);
  const TierIcon = tier.icon;
  const tierProgress = nextTier
    ? ((balance.availablePoints - tier.min) / (nextTier.min - tier.min)) * 100
    : 100;
  const pointsToNextTier = nextTier ? nextTier.min - balance.availablePoints : 0;

  const tabs = [
    { id: 'earn', label: 'How to Earn', icon: Sparkles },
    { id: 'rewards', label: 'Rewards', icon: Gift },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'history', label: 'History', icon: Clock },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'inherit' }}>

      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="font-black text-gray-900 text-base">Rewards & Referrals</span>
          <button onClick={loadLoyaltyData} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <RotateCcw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pb-16">

        {/* ── Hero Points Card ── */}
        <div
          className="relative rounded-3xl overflow-hidden mt-4 mb-4 shadow-xl"
          style={{ background: `linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)` }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-white/8" />

          <div className="relative p-6">
            {/* Tier Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <TierIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider">Your Tier</p>
                  <p className="text-white font-black text-sm">{tier.name} Member</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-[10px] font-semibold">Wallet Value</p>
                <p className="text-white font-black text-lg">₹{pointsToAmount(balance.availablePoints).toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Points display */}
            <div className="mb-5">
              <p className="text-white/70 text-xs font-semibold mb-1">Available Points</p>
              <p className="text-white font-black" style={{ fontSize: '3rem', lineHeight: 1 }}>
                <AnimatedCounter target={balance.availablePoints} />
              </p>
              <p className="text-white/60 text-xs mt-1">pts</p>
            </div>

            {/* Tier Progress */}
            {nextTier && (
              <div className="mb-5">
                <div className="flex justify-between text-[10px] text-white/70 mb-1.5 font-medium">
                  <span>{tier.name}</span>
                  <span>{pointsToNextTier.toLocaleString('en-IN')} pts to {nextTier.name}</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(tierProgress, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Expiry warning */}
            {balance.expiringPoints > 0 && (
              <div className="bg-yellow-400/20 border border-yellow-300/30 rounded-xl p-3 mb-4">
                <p className="text-yellow-100 text-xs font-semibold">
                  ⚠️ {balance.expiringPoints} points expiring on{' '}
                  {balance.expiryDate && new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(balance.expiryDate)}
                </p>
              </div>
            )}

            {/* Redeem CTA */}
            <button
              onClick={handleRedeemPoints}
              disabled={balance.availablePoints < 100 || redeeming}
              className="w-full py-3 bg-white rounded-2xl text-sm font-black text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Gift className="w-4 h-4" />
              {redeeming ? 'Redeeming...' : balance.availablePoints < 100 ? 'Min. 100 pts to redeem' : `Redeem ${Math.floor(balance.availablePoints / 100) * 100} pts → Wallet`}
            </button>
          </div>
        </div>

        {/* ── Referral Code Card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-black text-gray-900 text-sm">Refer & Earn ₹200</span>
            <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
            Share your code — you get <strong className="text-gray-800">₹200</strong> and your friend gets <strong className="text-gray-800">₹100</strong> off their first booking!
          </p>

          {/* Code box */}
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-blue-200 p-4 mb-3">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Your Referral Code</p>
            <div className="flex items-center justify-between">
              <code className="text-2xl font-black text-gray-900 tracking-[0.2em]">{referralCode}</code>
              <button
                onClick={handleCopyCode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-2xl text-sm font-bold transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share via WhatsApp
          </button>

          {/* Referral stats */}
          {referralStats && (
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
              {[
                { label: 'Shared', value: referralStats.totalReferrals, color: 'text-gray-900' },
                { label: 'Converted', value: referralStats.completedReferrals, color: 'text-green-600' },
                { label: 'Earned', value: `₹${referralStats.totalEarned}`, color: 'text-blue-600' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-2xl mb-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Panels ── */}

        {/* How to Earn */}
        {activeTab === 'earn' && (
          <div className="space-y-3">
            {[
              { icon: '📦', action: 'Complete a booking', points: '+1% of value', desc: 'Points added after job completion' },
              { icon: '👥', action: 'Refer a friend', points: '+200 pts', desc: 'When their first booking is completed' },
              { icon: '⭐', action: 'Leave a review', points: '+20 pts', desc: 'After every completed service' },
              { icon: '🎉', action: 'First booking bonus', points: '+50 pts', desc: 'One-time welcome reward' },
              { icon: '📋', action: 'Subscribe to AMC', points: '+500 pts', desc: 'On activation of any AMC plan' },
              { icon: '🗓️', action: 'Book 5+ times / month', points: '+100 pts', desc: 'Loyalty streak bonus' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-2xl w-10 text-center flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{item.action}</p>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
                <span className="text-green-600 font-black text-sm flex-shrink-0">{item.points}</span>
              </div>
            ))}
          </div>
        )}

        {/* Rewards Catalog */}
        {activeTab === 'rewards' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 font-medium px-1">You have <strong className="text-blue-600">{balance.availablePoints}</strong> points available</p>
            <div className="grid grid-cols-1 gap-3">
              {REWARDS.map((reward) => {
                const canRedeem = balance.availablePoints >= reward.points;
                return (
                  <div
                    key={reward.id}
                    className={`bg-white rounded-2xl border p-4 flex items-center gap-4 shadow-sm transition-all ${
                      canRedeem ? 'border-blue-100 hover:border-blue-300 hover:shadow-md' : 'border-gray-100 opacity-60'
                    }`}
                  >
                    <span className="text-3xl w-12 text-center flex-shrink-0">{reward.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-gray-900 text-sm truncate">{reward.name}</p>
                        {reward.popular && (
                          <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full flex-shrink-0">HOT</span>
                        )}
                      </div>
                      <p className="text-blue-600 text-xs font-bold">{reward.points.toLocaleString('en-IN')} pts</p>
                    </div>
                    <button
                      disabled={!canRedeem}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0 transition-all ${
                        canRedeem
                          ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canRedeem ? 'Redeem' : `Need ${reward.points - balance.availablePoints} more`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Referral History */}
        {activeTab === 'referrals' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {referralHistory.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {referralHistory.map((ref) => (
                  <div key={ref.id} className="flex items-center gap-3 p-4">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm">{ref.refereeName || 'Pending signup'}</p>
                      <p className="text-gray-400 text-xs">{formatDate(ref.createdAt)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded-full ${
                        ref.status === 'rewarded' ? 'bg-green-50 text-green-700' :
                        ref.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {ref.status}
                      </span>
                      {ref.status === 'rewarded' && (
                        <p className="text-green-600 text-xs font-bold mt-1">+₹{ref.creditAmount}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-semibold">No referrals yet</p>
                <p className="text-gray-400 text-xs mt-1">Share your code to start earning!</p>
                <button
                  onClick={handleShare}
                  className="mt-4 px-5 py-2 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-colors"
                >
                  Share on WhatsApp
                </button>
              </div>
            )}
          </div>
        )}

        {/* Transaction History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {transactions.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {transactions.map((txn) => (
                  <div key={txn.id} className="flex items-start gap-3 p-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      txn.points > 0 ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      {txn.points > 0
                        ? <TrendingUp className="w-4 h-4 text-green-600" />
                        : <Gift className="w-4 h-4 text-red-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-snug">{txn.description}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{formatDate(txn.createdAt)}</p>
                      <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full mt-1 inline-block font-medium">
                        {txn.source}
                      </span>
                    </div>
                    <p className={`font-black text-sm flex-shrink-0 ${txn.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {txn.points > 0 ? '+' : ''}{txn.points}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-semibold">No transactions yet</p>
                <p className="text-gray-400 text-xs mt-1">Complete a booking to earn your first points!</p>
              </div>
            )}
          </div>
        )}

        {/* ── Tier Roadmap ── */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-blue-600" />
            <h3 className="font-black text-gray-900 text-sm">Membership Tiers</h3>
          </div>
          <div className="space-y-3">
            {TIERS.map((t, i) => {
              const TIcon = t.icon;
              const isCurrentTier = tier.name === t.name;
              const isUnlocked = (balance.availablePoints) >= t.min;
              return (
                <div
                  key={t.name}
                  className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                    isCurrentTier ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: isUnlocked ? `linear-gradient(135deg, ${t.color}40, ${t.color}80)` : '#f3f4f6' }}
                  >
                    <TIcon className="w-4 h-4" style={{ color: isUnlocked ? t.color : '#9ca3af' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                      {isCurrentTier && <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">YOU</span>}
                    </div>
                    <p className="text-gray-400 text-xs">
                      {t.max === Infinity ? `${t.min.toLocaleString('en-IN')}+ pts` : `${t.min.toLocaleString('en-IN')} – ${t.max.toLocaleString('en-IN')} pts`}
                    </p>
                  </div>
                  {isUnlocked
                    ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  }
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
