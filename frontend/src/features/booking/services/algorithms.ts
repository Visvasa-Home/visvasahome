/**
 * VisvasaHome Platform Core Algorithms Engine
 * 
 * Mathematical Implementations:
 * 1. Proximity Match (Haversine Distance formula)
 * 2. SP Base Ranking Score: S_base = f(rating, completion, volume, experience, response)
 * 3. Bayesian Smoothed Cancellation Rate: theta_cancel = (alpha_prior + cancellations) / (alpha_prior + beta_prior + total_bookings)
 * 4. Risk-Adjusted Final Match Score: S_final = S_base * (1 - theta_cancel)
 * 5. Dynamic Pricing Log-Ratio Surge: Delta_surge = max(0, gamma * log(Demand / Supply))
 * 6. Daily VRP Route Optimization: 2-Opt local search heuristics for minimizing distance costs
 * 7. Biometric Cosine Similarity: Sim = (e1 . e2) / (||e1|| * ||e2||)
 * 8. Time-Series Metric Anomaly Detection: Z_score = (Observed - Predicted) / sigma
 */

// ============================================================================
// 1. Distance Calculation (Haversine Formula)
// ============================================================================

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Number(distance.toFixed(2));
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ============================================================================
// 2. Base Ranking & Bayesian Risk-Adjusted Scoring
// ============================================================================

export interface SPRankingMetrics {
  rating: number;             // 0.0 - 5.0
  jobsCompleted: number;      // Total jobs completed
  completionRate: number;     // 0.0 - 1.0
  experienceYears: number;    // Industry years
  responseTimeMinutes: number; // Avg response time
}

/**
 * Computes S_base score out of 100
 */
export function calculateSPRankingScore(metrics: SPRankingMetrics): number {
  const normRating = Math.max(0, Math.min(1.0, Math.max(0, Math.min(5.0, metrics.rating)) / 5.0));
  const normCompletion = Math.max(0, Math.min(1.0, metrics.completionRate));
  const normVolume = Math.max(0, Math.min(1.0, Math.log1p(Math.max(0, metrics.jobsCompleted)) / Math.log1p(500)));
  const normExperience = Math.max(0, Math.min(1.0, metrics.experienceYears / 15.0));
  const normResponse = Math.max(0, Math.min(1.0, 1.0 - (Math.max(0, metrics.responseTimeMinutes) / 120.0)));

  const score =
    (normRating * 0.40) +
    (normCompletion * 0.30) +
    (normVolume * 0.15) +
    (normExperience * 0.10) +
    (normResponse * 0.05);

  return Number((score * 100).toFixed(1));
}

/**
 * Computes Bayesian Smoothed Cancellation Rate: theta_cancel
 * alphaPrior = 1.0, betaPrior = 19.0 represents a baseline expected cancellation rate of 5%
 */
export function calculateBayesianCancellationRate(
  cancellations: number,
  totalBookings: number,
  alphaPrior: number = 1.0,
  betaPrior: number = 19.0
): number {
  const theta = (alphaPrior + cancellations) / (alphaPrior + betaPrior + totalBookings);
  return Number(theta.toFixed(4));
}

// ============================================================================
// 3. Dynamic Pricing (Log-Ratio Surge Engine)
// ============================================================================

export interface SurgeParams {
  bookingTime: string;       // "HH:MM" 24h
  activeBookingsInArea: number; // Demand (D)
  availableSpsInArea: number;   // Supply (S)
  categoryBaseMultiplier: number;
}

/**
 * Surge pricing based on Dynamic Log-Ratio:
 * Delta_surge = max(0, gamma * ln(Demand / Supply))
 */
export function calculateSurgeMultiplier(params: SurgeParams, gamma: number = 0.5): { multiplier: number; reason: string } {
  let multiplier = 1.0;
  const reasons: string[] = [];

  // 1. Peak hour base boost
  const [hours, minutes] = params.bookingTime.split(':').map(Number);
  const totalMinutes = hours * 60 + (minutes || 0);
  const isMorningPeak = totalMinutes >= 450 && totalMinutes <= 630;
  const isEveningPeak = totalMinutes >= 1050 && totalMinutes <= 1230;

  if (isMorningPeak || isEveningPeak) {
    multiplier += 0.20;
    reasons.push("Peak scheduling hours");
  }

  // 2. Supply-Demand Elasticity Log ratio: Delta_surge = max(0, gamma * ln(D/S))
  const demand = params.activeBookingsInArea;
  const supply = params.availableSpsInArea;

  if (demand > 0) {
    if (supply <= 0) {
      multiplier += 0.60;
      reasons.push("Severe provider deficit");
    } else {
      const ratio = demand / supply;
      if (ratio > 1.0) {
        const deltaSurge = gamma * Math.log(ratio);
        multiplier += deltaSurge;
        reasons.push("High local demand ratio (" + ratio.toFixed(1) + "x)");
      }
    }
  }

  // Apply category multiplier
  multiplier *= params.categoryBaseMultiplier;
  if (params.categoryBaseMultiplier > 1.0) {
    reasons.push("Premium service premium");
  }

  // Cap bounds: [1.0x, 2.5x]
  multiplier = Math.max(1.0, Math.min(2.5, multiplier));

  return {
    multiplier: Number(multiplier.toFixed(2)),
    reason: reasons.join(" & ") || "Normal demand conditions"
  };
}

// ============================================================================
// 4. Geo-Matching & Bayesian Risk Allocation Engine
// ============================================================================

export interface MatchProfessionalParams {
  customerLat: number;
  customerLng: number;
  serviceCategory: string;
  bookingDate: string; // YYYY-MM-DD
  bookingTime: string; // HH:MM
  serviceDuration?: number; // Duration of service in minutes
  professionals: Array<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    categories: string[];
    isVerified: boolean;
    isActive: boolean;
    rating: number;
    jobsCompleted: number;
    completionRate: number;
    experienceYears: number;
    responseTimeMinutes: number;
    maxDistanceKm: number;
    cancellations: number;
    bookingsCount: number;
    availability: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }>;
  }>;
  bookings: Array<{
    id: string;
    professionalId?: string;
    scheduledDate: string;
    scheduledTime: string;
    durationMinutes: number;
    status: string;
  }>;
}

export interface RiskAdjustedMatchResult {
  professionalId: string;
  name: string;
  distanceKm: number;
  baseScore: number;            // S_base
  bayesianCancelRate: number;   // theta_cancel
  riskAdjustedScore: number;    // S_final = S_base * (1 - theta_cancel)
}

/**
 * Matches and ranks professionals applying Bayesian Risk Adjustment filters.
 */
export function matchProfessionalsRiskAdjusted(params: MatchProfessionalParams): RiskAdjustedMatchResult[] {
  const targetDate = new Date(params.bookingDate);
  const targetDayOfWeek = targetDate.getDay();

  const [reqHour, reqMin] = params.bookingTime.split(':').map(Number);
  const reqStartVal = reqHour * 60 + reqMin;
  const jobDuration = params.serviceDuration ?? 90;

  const results: RiskAdjustedMatchResult[] = [];

  for (const pro of params.professionals) {
    if (!pro.isActive || !pro.isVerified || !pro.categories.includes(params.serviceCategory)) {
      continue;
    }

    const distance = getDistance(params.customerLat, params.customerLng, pro.latitude, pro.longitude);
    if (distance > pro.maxDistanceKm) {
      continue;
    }

    const isWorkingTime = pro.availability.some(slot => {
      if (slot.dayOfWeek !== targetDayOfWeek) return false;
      const [sHour, sMin] = slot.startTime.split(':').map(Number);
      const [eHour, eMin] = slot.endTime.split(':').map(Number);
      const startVal = sHour * 60 + sMin;
      const endVal = eHour * 60 + eMin;
      return reqStartVal >= startVal && reqStartVal <= endVal;
    });

    if (!isWorkingTime) {
      continue;
    }

    const hasCollision = params.bookings.some(booking => {
      if (
        booking.professionalId !== pro.id ||
        booking.scheduledDate !== params.bookingDate ||
        booking.status === 'cancelled'
      ) {
        return false;
      }

      const [existingHour, existingMin] = booking.scheduledTime.split(':').map(Number);
      const exStartVal = existingHour * 60 + existingMin;
      const exEndVal = exStartVal + booking.durationMinutes + 30; // 30m travel buffer
      const reqEndVal = reqStartVal + jobDuration + 30; // Dynamic job + 30m buffer

      return reqStartVal < exEndVal && reqEndVal > exStartVal;
    });

    if (hasCollision) {
      continue;
    }

    // 1. Base Score calculation (S_base)
    const baseScore = calculateSPRankingScore({
      rating: pro.rating,
      jobsCompleted: pro.jobsCompleted,
      completionRate: pro.completionRate,
      experienceYears: pro.experienceYears,
      responseTimeMinutes: pro.responseTimeMinutes
    });

    // 2. Bayesian smoothed cancel rate (theta_cancel)
    const bayesianCancelRate = calculateBayesianCancellationRate(pro.cancellations, pro.bookingsCount);

    // 3. Final risk adjusted score (S_final = S_base * (1 - theta_cancel))
    const riskAdjustedScore = Math.round(baseScore * (1 - bayesianCancelRate));

    results.push({
      professionalId: pro.id,
      name: pro.name,
      distanceKm: distance,
      baseScore,
      bayesianCancelRate,
      riskAdjustedScore
    });
  }

  // Sort by S_final descending
  return results.sort((a, b) => b.riskAdjustedScore - a.riskAdjustedScore);
}

// Helper wrapper to keep compatibility with slots generator
export function matchProfessionalsForBooking(params: any): any[] {
  const riskMatches = matchProfessionalsRiskAdjusted({
    ...params,
    professionals: params.professionals.map((p: any) => ({
      cancellations: p.cancellations || 0,
      bookingsCount: p.bookingsCount || p.jobsCompleted || 0,
      ...p
    }))
  });
  return riskMatches.map(m => ({
    professionalId: m.professionalId,
    name: m.name,
    distanceKm: m.distanceKm,
    rankScore: m.baseScore,
    overallMatchScore: m.riskAdjustedScore
  }));
}

// ============================================================================
// 5. Dynamic Time Slot Availability Generator
// ============================================================================

export interface GeneratedTimeSlot {
  time24: string;
  time12: string;
  status: 'available' | 'unavailable';
  availableProsCount: number;
  surgeMultiplier: number;
  surgePrice: number;
}

export interface SlotGeneratorParams {
  dateStr: string;
  serviceCategory: string;
  basePrice: number;
  serviceDuration: number;
  customerLat: number;
  customerLng: number;
  professionals: any[];
  bookings: any[];
  activeBookingsInArea: number;
}

export function generateAvailableSlots(params: SlotGeneratorParams): GeneratedTimeSlot[] {
  const baseSlots = [
    "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00", "19:00", "20:00"
  ];

  return baseSlots.map(time24 => {
    const matchedPros = matchProfessionalsForBooking({
      customerLat: params.customerLat,
      customerLng: params.customerLng,
      serviceCategory: params.serviceCategory,
      bookingDate: params.dateStr,
      bookingTime: time24,
      professionals: params.professionals,
      bookings: params.bookings,
      serviceDuration: params.serviceDuration
    });

    const isAvailable = matchedPros.length > 0;

    const surge = calculateSurgeMultiplier({
      bookingTime: time24,
      activeBookingsInArea: params.activeBookingsInArea,
      availableSpsInArea: matchedPros.length,
      categoryBaseMultiplier: 1.0
    });

    const [hStr, mStr] = time24.split(':');
    const hours24 = parseInt(hStr);
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    const time12 = `${hours12}:${mStr} ${ampm}`;

    return {
      time24,
      time12,
      status: isAvailable ? 'available' : 'unavailable',
      availableProsCount: matchedPros.length,
      surgeMultiplier: isAvailable ? surge.multiplier : 1.0,
      surgePrice: isAvailable ? Math.round(params.basePrice * surge.multiplier) : params.basePrice
    };
  });
}

// ============================================================================
// 6. Routing & Scheduling (Combinatorial VRP Solver)
// ============================================================================

export interface VRPJob {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface VRPRouteResult {
  orderedJobs: VRPJob[];
  totalDistanceKm: number;
  routeSequence: string[];
}

/**
 * Solves VRP (Vehicle Routing Problem) combinatorial optimization for a pro's daily jobs.
 * Employs a Greedy Nearest Neighbor construction algorithm followed by 2-Opt local search iteration
 * to minimize total travel distance.
 */
export function solveCombinatorialVRP(
  startLat: number,
  startLng: number,
  jobs: VRPJob[]
): VRPRouteResult {
  if (jobs.length === 0) {
    return { orderedJobs: [], totalDistanceKm: 0, routeSequence: [] };
  }

  // Step 1: Construct initial tour using Nearest Neighbor greedy solver
  let unvisited = [...jobs];
  let currentLat = startLat;
  let currentLng = startLng;
  const tour: VRPJob[] = [];

  while (unvisited.length > 0) {
    let bestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const dist = getDistance(currentLat, currentLng, unvisited[i].latitude, unvisited[i].longitude);
      if (dist < minDist) {
        minDist = dist;
        bestIdx = i;
      }
    }
    const nextJob = unvisited[bestIdx];
    tour.push(nextJob);
    currentLat = nextJob.latitude;
    currentLng = nextJob.longitude;
    unvisited.splice(bestIdx, 1);
  }

  // Step 2: Refine tour with 2-Opt local search neighborhood optimization
  let improved = true;
  let iterations = 0;

  while (improved && iterations < 50) {
    improved = false;
    iterations++;
    for (let i = 0; i < tour.length - 1; i++) {
      for (let j = i + 1; j < tour.length; j++) {
        const currentDist = calculateTourDistance(startLat, startLng, tour);
        
        // Reverse sub-route tour segment [i..j]
        reverseSegment(tour, i, j);
        const newDist = calculateTourDistance(startLat, startLng, tour);

        if (newDist < currentDist) {
          improved = true;
          break;
        } else {
          // Revert back
          reverseSegment(tour, i, j);
        }
      }
      if (improved) break;
    }
  }

  const finalDistance = calculateTourDistance(startLat, startLng, tour);

  return {
    orderedJobs: tour,
    totalDistanceKm: Number(finalDistance.toFixed(2)),
    routeSequence: ["Base Station", ...tour.map(j => j.name), "Base Station"]
  };
}

function reverseSegment(arr: any[], i: number, j: number) {
  let l = i;
  let r = j;
  while (l < r) {
    const temp = arr[l];
    arr[l] = arr[r];
    arr[r] = temp;
    l++;
    r--;
  }
}

function calculateTourDistance(startLat: number, startLng: number, jobs: VRPJob[]): number {
  let dist = 0;
  let currLat = startLat;
  let currLng = startLng;
  for (const job of jobs) {
    dist += getDistance(currLat, currLng, job.latitude, job.longitude);
    currLat = job.latitude;
    currLng = job.longitude;
  }
  // Add return path back to starting base depot
  dist += getDistance(currLat, currLng, startLat, startLng);
  return dist;
}

// ============================================================================
// 7. Safety (Biometric Cosine Similarity)
// ============================================================================

/**
 * Computes Cosine Similarity between two multi-dimensional facial embeddings
 * Sim = (e1 . e2) / (||e1|| * ||e2||)
 */
export function verifyFaceEmbeddings(
  e1: number[],
  e2: number[],
  threshold: number = 0.8
): { similarity: number; isMatch: boolean } {
  if (e1.length !== e2.length || e1.length === 0) {
    return { similarity: 0, isMatch: false };
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < e1.length; i++) {
    dotProduct += e1[i] * e2[i];
    normA += e1[i] * e1[i];
    normB += e2[i] * e2[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator < 1e-9 || isNaN(denominator)) return { similarity: 0, isMatch: false };

  const similarity = dotProduct / denominator;
  return {
    similarity: Number(similarity.toFixed(4)),
    isMatch: similarity >= threshold
  };
}

// ============================================================================
// 8. Time-Series Metric Anomaly Detection
// ============================================================================

/**
 * Identifies standard deviation threshold breaches in time-series residuals.
 * Z = (Observed - Predicted) / Sigma
 * Anomaly if |Z| >= kappa
 */
export function detectMetricAnomaly(
  observed: number,
  predicted: number,
  sigma: number,
  kappa: number = 2.0
): { zScore: number; isAnomaly: boolean } {
  if (sigma <= 0) return { zScore: 0, isAnomaly: false };
  const zScore = (observed - predicted) / sigma;
  return {
    zScore: Number(zScore.toFixed(2)),
    isAnomaly: Math.abs(zScore) >= kappa
  };
}
