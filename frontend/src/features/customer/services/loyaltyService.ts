// Loyalty & Referral Service
// Handles loyalty points, rewards, and referral program

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  source: 'booking' | 'referral' | 'review' | 'signup' | 'redemption' | 'bonus-campaign';
  bookingId?: string;
  referralId?: string;
  description: string;
  createdAt: Date;
  expiryDate?: Date;
}

export interface LoyaltyBalance {
  userId: string;
  totalPoints: number;
  availablePoints: number;
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  expiringPoints: number;
  expiryDate?: Date;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  tierBenefits: string[];
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerName: string;
  refereeId?: string;
  refereeName?: string;
  referralCode: string;
  status: 'pending' | 'completed' | 'rewarded';
  creditAmount: number;
  signupDate?: Date;
  firstBookingDate?: Date;
  rewardedDate?: Date;
  createdAt: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalEarned: number;
}

// Mock transactions
let mockTransactions: LoyaltyTransaction[] = [
  {
    id: 'TXN001',
    userId: 'CUST001',
    points: 45,
    type: 'earned',
    source: 'booking',
    bookingId: 'BOOK001',
    description: 'Points earned from AC Service booking',
    createdAt: new Date('2026-05-15'),
    expiryDate: new Date('2027-05-15')
  },
  {
    id: 'TXN002',
    userId: 'CUST001',
    points: 100,
    type: 'earned',
    source: 'referral',
    referralId: 'REF001',
    description: 'Referral reward - Friend completed first booking',
    createdAt: new Date('2026-05-20'),
    expiryDate: new Date('2027-05-20')
  },
  {
    id: 'TXN003',
    userId: 'CUST001',
    points: 20,
    type: 'earned',
    source: 'review',
    bookingId: 'BOOK001',
    description: 'Bonus points for writing review',
    createdAt: new Date('2026-05-16'),
    expiryDate: new Date('2027-05-16')
  },
  {
    id: 'TXN004',
    userId: 'CUST001',
    points: 50,
    type: 'earned',
    source: 'signup',
    description: 'Welcome bonus - First signup',
    createdAt: new Date('2026-01-10'),
    expiryDate: new Date('2027-01-10')
  },
  {
    id: 'TXN005',
    userId: 'CUST001',
    points: 30,
    type: 'earned',
    source: 'booking',
    bookingId: 'BOOK002',
    description: 'Points earned from Plumbing Service',
    createdAt: new Date('2026-06-01'),
    expiryDate: new Date('2027-06-01')
  }
];

// Mock referrals
let mockReferrals: Referral[] = [
  {
    id: 'REF001',
    referrerId: 'CUST001',
    referrerName: 'Rajesh Kumar',
    refereeId: 'CUST002',
    refereeName: 'Priya Sharma',
    referralCode: 'RAJESH2026',
    status: 'rewarded',
    creditAmount: 100,
    signupDate: new Date('2026-05-18'),
    firstBookingDate: new Date('2026-05-20'),
    rewardedDate: new Date('2026-05-20'),
    createdAt: new Date('2026-05-18')
  },
  {
    id: 'REF002',
    referrerId: 'CUST001',
    referrerName: 'Rajesh Kumar',
    refereeId: 'CUST003',
    refereeName: 'Amit Patel',
    referralCode: 'RAJESH2026',
    status: 'completed',
    creditAmount: 100,
    signupDate: new Date('2026-06-02'),
    firstBookingDate: new Date('2026-06-04'),
    createdAt: new Date('2026-06-02')
  },
  {
    id: 'REF003',
    referrerId: 'CUST001',
    referrerName: 'Rajesh Kumar',
    referralCode: 'RAJESH2026',
    status: 'pending',
    creditAmount: 100,
    createdAt: new Date('2026-06-05')
  }
];

// Points configuration
const POINTS_CONFIG = {
  signupBonus: 50,
  bookingRate: 0.01, // 1% of booking value
  referralReward: 100,
  reviewBonus: 20,
  minRedemption: 100,
  redemptionValue: 1, // 1 point = ₹1
  expiryDays: 365
};

// Tier configuration
const TIER_CONFIG = {
  bronze: { min: 0, max: 999, benefits: ['Basic support', '1% cashback on bookings'] },
  silver: { min: 1000, max: 2999, benefits: ['Priority support', '1.5% cashback', 'Exclusive offers'] },
  gold: { min: 3000, max: 9999, benefits: ['24/7 priority support', '2% cashback', 'Early access to new services', 'Free service upgrades'] },
  platinum: { min: 10000, max: Infinity, benefits: ['Dedicated relationship manager', '3% cashback', 'All Gold benefits', 'Annual free service voucher'] }
};

/**
 * Get user loyalty balance
 */
export const getLoyaltyBalance = async (userId: string): Promise<LoyaltyBalance> => {
  const transactions = mockTransactions.filter(t => t.userId === userId);

  const earned = transactions.filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.points, 0);

  const redeemed = transactions.filter(t => t.type === 'redeemed')
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  const expired = transactions.filter(t => t.type === 'expired')
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  const availablePoints = earned - redeemed - expired;

  // Calculate expiring points (next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringTransactions = transactions.filter(
    t => t.type === 'earned' && t.expiryDate && t.expiryDate <= thirtyDaysFromNow && t.expiryDate > new Date()
  );

  const expiringPoints = expiringTransactions.reduce((sum, t) => sum + t.points, 0);
  const nextExpiry = expiringTransactions.length > 0
    ? expiringTransactions.sort((a, b) => a.expiryDate!.getTime() - b.expiryDate!.getTime())[0].expiryDate
    : undefined;

  // Determine tier
  let tier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
  let tierBenefits: string[] = [];

  if (earned >= TIER_CONFIG.platinum.min) {
    tier = 'platinum';
    tierBenefits = TIER_CONFIG.platinum.benefits;
  } else if (earned >= TIER_CONFIG.gold.min) {
    tier = 'gold';
    tierBenefits = TIER_CONFIG.gold.benefits;
  } else if (earned >= TIER_CONFIG.silver.min) {
    tier = 'silver';
    tierBenefits = TIER_CONFIG.silver.benefits;
  } else {
    tier = 'bronze';
    tierBenefits = TIER_CONFIG.bronze.benefits;
  }

  return {
    userId,
    totalPoints: availablePoints,
    availablePoints,
    lifetimeEarned: earned,
    lifetimeRedeemed: redeemed,
    expiringPoints,
    expiryDate: nextExpiry,
    tier,
    tierBenefits
  };
};

/**
 * Get loyalty transaction history
 */
export const getLoyaltyTransactions = async (
  userId: string,
  limit: number = 50
): Promise<LoyaltyTransaction[]> => {
  return mockTransactions
    .filter(t => t.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit);
};

/**
 * Award points for booking completion
 */
export const awardBookingPoints = async (
  userId: string,
  bookingId: string,
  bookingAmount: number
): Promise<{ success: boolean; points: number }> => {
  const points = Math.floor(bookingAmount * POINTS_CONFIG.bookingRate);

  const transaction: LoyaltyTransaction = {
    id: `TXN${String(mockTransactions.length + 1).padStart(3, '0')}`,
    userId,
    points,
    type: 'earned',
    source: 'booking',
    bookingId,
    description: `Points earned from booking #${bookingId}`,
    createdAt: new Date(),
    expiryDate: new Date(Date.now() + POINTS_CONFIG.expiryDays * 24 * 60 * 60 * 1000)
  };

  mockTransactions.push(transaction);

  return { success: true, points };
};

/**
 * Award points for review submission
 */
export const awardReviewPoints = async (
  userId: string,
  bookingId: string
): Promise<{ success: boolean; points: number }> => {
  const transaction: LoyaltyTransaction = {
    id: `TXN${String(mockTransactions.length + 1).padStart(3, '0')}`,
    userId,
    points: POINTS_CONFIG.reviewBonus,
    type: 'earned',
    source: 'review',
    bookingId,
    description: 'Bonus points for writing review',
    createdAt: new Date(),
    expiryDate: new Date(Date.now() + POINTS_CONFIG.expiryDays * 24 * 60 * 60 * 1000)
  };

  mockTransactions.push(transaction);

  return { success: true, points: POINTS_CONFIG.reviewBonus };
};

/**
 * Award signup bonus
 */
export const awardSignupBonus = async (userId: string): Promise<{ success: boolean; points: number }> => {
  const transaction: LoyaltyTransaction = {
    id: `TXN${String(mockTransactions.length + 1).padStart(3, '0')}`,
    userId,
    points: POINTS_CONFIG.signupBonus,
    type: 'earned',
    source: 'signup',
    description: 'Welcome bonus - First signup',
    createdAt: new Date(),
    expiryDate: new Date(Date.now() + POINTS_CONFIG.expiryDays * 24 * 60 * 60 * 1000)
  };

  mockTransactions.push(transaction);

  return { success: true, points: POINTS_CONFIG.signupBonus };
};

/**
 * Redeem loyalty points
 */
export const redeemPoints = async (
  userId: string,
  points: number
): Promise<{ success: boolean; amount?: number; message?: string }> => {
  const balance = await getLoyaltyBalance(userId);

  if (points < POINTS_CONFIG.minRedemption) {
    return {
      success: false,
      message: `Minimum redemption is ${POINTS_CONFIG.minRedemption} points`
    };
  }

  if (points > balance.availablePoints) {
    return {
      success: false,
      message: 'Insufficient points balance'
    };
  }

  const amount = points * POINTS_CONFIG.redemptionValue;

  const transaction: LoyaltyTransaction = {
    id: `TXN${String(mockTransactions.length + 1).padStart(3, '0')}`,
    userId,
    points: -points,
    type: 'redeemed',
    source: 'redemption',
    description: `Redeemed ${points} points for ₹${amount} wallet credit`,
    createdAt: new Date()
  };

  mockTransactions.push(transaction);

  return { success: true, amount };
};

/**
 * Generate referral code for user
 */
export const generateReferralCode = (userName: string): string => {
  const cleanName = userName.replace(/\s+/g, '').toUpperCase();
  const year = new Date().getFullYear();
  return `${cleanName}${year}`;
};

/**
 * Get user's referral code
 */
export const getUserReferralCode = async (userId: string, userName: string): Promise<string> => {
  // Check if user already has referrals (to get existing code)
  const existingReferral = mockReferrals.find(r => r.referrerId === userId);

  if (existingReferral) {
    return existingReferral.referralCode;
  }

  return generateReferralCode(userName);
};

/**
 * Apply referral code during signup
 */
export const applyReferralCode = async (
  referralCode: string,
  refereeId: string,
  refereeName: string
): Promise<{ success: boolean; referrerId?: string; message?: string }> => {
  // Find referral by code
  const existingReferral = mockReferrals.find(r => r.referralCode === referralCode);

  if (!existingReferral) {
    return { success: false, message: 'Invalid referral code' };
  }

  const referral: Referral = {
    id: `REF${String(mockReferrals.length + 1).padStart(3, '0')}`,
    referrerId: existingReferral.referrerId,
    referrerName: existingReferral.referrerName,
    refereeId,
    refereeName,
    referralCode,
    status: 'pending',
    creditAmount: POINTS_CONFIG.referralReward,
    signupDate: new Date(),
    createdAt: new Date()
  };

  mockReferrals.push(referral);

  return { success: true, referrerId: existingReferral.referrerId };
};

/**
 * Complete referral (when referee makes first booking)
 */
export const completeReferral = async (
  refereeId: string
): Promise<{ success: boolean; referrerId?: string; points?: number }> => {
  const referral = mockReferrals.find(
    r => r.refereeId === refereeId && r.status === 'pending'
  );

  if (!referral) {
    return { success: false };
  }

  referral.status = 'completed';
  referral.firstBookingDate = new Date();

  // Award points to referrer
  const transaction: LoyaltyTransaction = {
    id: `TXN${String(mockTransactions.length + 1).padStart(3, '0')}`,
    userId: referral.referrerId,
    points: referral.creditAmount,
    type: 'earned',
    source: 'referral',
    referralId: referral.id,
    description: `Referral reward - ${referral.refereeName} completed first booking`,
    createdAt: new Date(),
    expiryDate: new Date(Date.now() + POINTS_CONFIG.expiryDays * 24 * 60 * 60 * 1000)
  };

  mockTransactions.push(transaction);
  referral.status = 'rewarded';
  referral.rewardedDate = new Date();

  return {
    success: true,
    referrerId: referral.referrerId,
    points: referral.creditAmount
  };
};

/**
 * Get referral stats for user
 */
export const getReferralStats = async (userId: string): Promise<ReferralStats> => {
  const userReferrals = mockReferrals.filter(r => r.referrerId === userId);

  const completed = userReferrals.filter(r => r.status === 'rewarded' || r.status === 'completed');
  const pending = userReferrals.filter(r => r.status === 'pending');
  const totalEarned = userReferrals
    .filter(r => r.status === 'rewarded')
    .reduce((sum, r) => sum + r.creditAmount, 0);

  return {
    totalReferrals: userReferrals.length,
    completedReferrals: completed.length,
    pendingReferrals: pending.length,
    totalEarned
  };
};

/**
 * Get user's referral history
 */
export const getReferralHistory = async (userId: string): Promise<Referral[]> => {
  return mockReferrals
    .filter(r => r.referrerId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

/**
 * Calculate points value in currency
 */
export const pointsToAmount = (points: number): number => {
  return points * POINTS_CONFIG.redemptionValue;
};

/**
 * Calculate amount value in points
 */
export const amountToPoints = (amount: number): number => {
  return Math.floor(amount * POINTS_CONFIG.bookingRate);
};
