// AMC (Annual Maintenance Contract) Service
// Handles AMC packages, subscriptions, scheduling, and renewals

export interface AMCPackage {
  id: string;
  name: string;
  description: string;
  category: 'ac' | 'electrical' | 'plumbing' | 'appliance' | 'home' | 'office' | 'commercial' | 'industrial' | 'healthcare' | 'educational' | 'hospitality' | 'society';
  tier: 'basic' | 'premium' | 'silver' | 'gold' | 'platinum';
  coverage: string[];
  visitsPerYear: number;
  price: number;
  features: string[];
  exclusions: string[];
  terms: string;
  isActive: boolean;
}

export interface AMCContract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  packageId: string;
  packageName: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled' | 'pending-renewal';
  pdfUrl: string;
  autoRenew: boolean;
  visitsCompleted: number;
  visitsTotal: number;
  nextVisitDate?: Date;
  amountPaid: number;
}

export interface AMCVisit {
  id: string;
  contractId: string;
  scheduledDate: Date;
  status: 'scheduled' | 'completed' | 'missed' | 'rescheduled';
  spId?: string;
  spName?: string;
  completedDate?: Date;
  serviceReport?: string;
  reportUrl?: string;
  customerSignature?: string;
  spSignature?: string;
  rating?: number;
  feedback?: string;
}

// AMC Packages — VisvasaHome Master Service Catalog (Group 5)
// 8 segments — Home, Office, Commercial, Industrial, Healthcare, Educational, Hospitality, Society
export const mockAMCPackages: AMCPackage[] = [
  // ─── AC / Appliance ───────────────────────────────────────────────────────────
  {
    id: 'AMC001',
    name: 'AC Comprehensive AMC',
    description: 'AC Comprehensive AMC — ₹2,499/yr',
    category: 'ac',
    tier: 'premium',
    coverage: ['Split AC', 'Window AC', 'Cassette AC', 'Gas Charging', 'Deep Cleaning'],
    visitsPerYear: 2,
    price: 2499,
    features: [
      'Visit 1 (March/April): Foam-jet service + gas check + filter wash (Pre-summer)',
      'Visit 2 (Oct/Nov): Full service + coil clean + drain flush (Post-summer)',
      'Breakdown calls: Labour free (parts at cost) on demand',
      'Gas top-up discount: 20% off on demand',
      'Priority response: Within 4 hours on demand'
    ],
    exclusions: ['Compressor replacement', 'PCB board replacement', 'Physical damage'],
    terms: 'Valid 12 months from purchase. Covers 1 AC unit. Add Rs.999/unit for additional ACs.',
    isActive: true
  },
  {
    id: 'AMC002',
    name: 'All-Appliance AMC',
    description: 'All-Appliance AMC — ₹5,999/yr',
    category: 'appliance',
    tier: 'gold',
    coverage: ['AC', 'WM', 'refrigerator', 'geyser', 'RO'],
    visitsPerYear: 7,
    price: 5999,
    features: [
      'AC (all units): 2 visits/year (Full service)',
      'Washing machine: 1 visit/year (Full service)',
      'Refrigerator: 1 visit/year (Coil clean + check)',
      'Geyser: 1 visit/year (Descale + element check)',
      'RO/water purifier: 2 visits/year (Filter + service)',
      'Breakdown support: Unlimited (Labour free)',
      'Priority response: 4 hours for all appliances'
    ],
    exclusions: ['Compressor replacement', 'Screen/display panel', 'PCB board replacement', 'Physical damage'],
    terms: 'Valid 12 months. Covers listed appliances in one home unit. Not transferable.',
    isActive: true
  },
  {
    id: 'AMC003',
    name: 'Electrical & Plumbing AMC',
    description: 'Electrical & Plumbing AMC — ₹3,499/yr',
    category: 'electrical',
    tier: 'silver',
    coverage: ['Wiring & MCBs', 'Switchboards', 'Fans & Lights', 'Taps & Pipes', 'Geysers', 'Flush Systems'],
    visitsPerYear: 4,
    price: 3499,
    features: [
      'Electrical safety audit: 2/year (All circuits + earthing)',
      'Plumbing inspection: 2/year (All taps + pipes + drains)',
      'Minor repairs: Each visit (Up to 2 repairs free)',
      'Emergency call-out: Unlimited (Priority response)',
      'Safety certificate: Annual (Issued after audit)'
    ],
    exclusions: ['Complete rewiring', 'New installations', 'Major pipeline replacement', 'Bathroom renovation'],
    terms: 'Minor repairs included at no extra charge. Major work quoted separately.',
    isActive: true
  },
  {
    id: 'AMC004',
    name: 'Pest Control AMC',
    description: 'Pest Control AMC — ₹1,999/yr',
    category: 'home',
    tier: 'basic',
    coverage: ['Cockroaches', 'Ants & Silverfish', 'Mosquitoes', 'Rodents', 'General insects'],
    visitsPerYear: 4,
    price: 1999,
    features: [
      'Q1 (Jan–Mar): Cockroach + ant gel (Full home)',
      'Q2 (Apr–Jun): Mosquito + fly treatment (Full home + garden)',
      'Q3 (Jul–Sep): General disinfection (Full home)',
      'Q4 (Oct–Dec): Cockroach + rodent prevention (Full home)',
      'Termite inspection: Annual (Included free)',
      'Emergency treatment: 1 free call/year (Any pest)'
    ],
    exclusions: ['Termite treatment (separate plan)', 'Bedbug removal (separate charge)', 'Commercial properties'],
    terms: '4 visits spread quarterly over 12 months. Re-visit warranty on each treatment.',
    isActive: true
  },
  {
    id: 'AMC005',
    name: 'Complete Home AMC',
    description: 'Complete Home AMC — ₹9,999/yr',
    category: 'home',
    tier: 'platinum',
    coverage: ['AC', 'All Appliances', 'Electrical', 'Plumbing', 'Pest Control', 'Deep Cleaning'],
    visitsPerYear: 10,
    price: 9999,
    features: [
      'All appliances covered: AC + WM + fridge + geyser + RO',
      'Electrical safety checks: 2/year',
      'Plumbing inspections: 2/year',
      'Pest control: Quarterly (4 visits)',
      'Deep cleaning: 1 free annual visit (2BHK)',
      'Total scheduled visits: 10+ visits/year',
      'Emergency response: 2-hour priority',
      'Relationship manager: Dedicated POC',
      'Repair discount: 25% off all repairs',
      'Annual home health report: Included'
    ],
    exclusions: ['Structural repairs', 'Painting', 'Major construction', 'Appliance part replacement above Rs.1,500'],
    terms: 'VisvasaHome Exclusive — not available on any other platform. Covers 1 home unit up to 3BHK.',
    isActive: true
  },
  // ─── Home Plans ───────────────────────────────────────────────────────────────
  {
    id: 'AMC-HOME-BASIC',
    name: 'Home Basic AMC',
    description: 'Essential protection for compact homes — ₹6,999/yr',
    category: 'home',
    tier: 'basic',
    coverage: ['Electrical', 'AC (1 unit)', 'Plumbing', 'Minor Repairs'],
    visitsPerYear: 4,
    price: 6999,
    features: [
      'Electrical inspection: Quarterly',
      'AC servicing: 1 unit, twice a year',
      'Plumbing checkup: Quarterly',
      'Minor repairs included',
      'Standard response time (48 hrs)',
      '4 scheduled service visits/year',
      'Digital service log'
    ],
    exclusions: ['Painting touch-ups', 'Pest control', 'Deep cleaning'],
    terms: 'Valid 12 months. For 1–2 BHK apartments.',
    isActive: true
  },
  {
    id: 'AMC-HOME-PREMIUM',
    name: 'Home Premium AMC',
    description: 'Comprehensive cover for family homes — ₹14,999/yr',
    category: 'home',
    tier: 'premium',
    coverage: ['Electrical', 'AC (3 units)', 'Plumbing', 'Carpentry', 'Painting touch-up'],
    visitsPerYear: 12,
    price: 14999,
    features: [
      'Monthly electrical inspection',
      'AC servicing: Up to 3 units, quarterly',
      'Plumbing & carpentry repairs',
      'Painting touch-ups: Once a year',
      'Appliance maintenance checkup',
      'Priority response: Within 24 hrs',
      '12 scheduled service visits/year',
      'Dedicated service coordinator',
      'Digital service log & reports'
    ],
    exclusions: ['Full painting', 'Major renovations'],
    terms: 'Valid 12 months. For 3 BHK homes & above.',
    isActive: true
  },
  {
    id: 'AMC-HOME-ELITE',
    name: 'Home Elite AMC',
    description: 'Total home management solution — ₹24,999/yr',
    category: 'home',
    tier: 'platinum',
    coverage: ['All AC units', 'Electrical', 'Plumbing', 'Pest Control', 'Painting', 'Deep Cleaning'],
    visitsPerYear: 20,
    price: 24999,
    features: [
      'Unlimited service visits',
      'All AC units: Quarterly servicing',
      '24/7 emergency support',
      'All electrical & plumbing work',
      'Annual deep cleaning',
      'Pest control: Quarterly',
      'Painting & waterproofing',
      'Home safety inspection',
      'Personal service manager',
      'Priority on-call response'
    ],
    exclusions: ['Major structural repairs'],
    terms: 'Valid 12 months. For villas & large homes.',
    isActive: true
  },
  // ─── Office Plans ─────────────────────────────────────────────────────────────
  {
    id: 'AMC-OFFICE-ESSENTIAL',
    name: 'Office Essential AMC',
    description: 'Core maintenance for small offices — ₹12,999/yr',
    category: 'office',
    tier: 'basic',
    coverage: ['Electrical', 'AC (2 units)', 'Plumbing', 'Minor Repairs'],
    visitsPerYear: 6,
    price: 12999,
    features: [
      'Quarterly electrical inspection',
      'AC servicing: 2 units, twice a year',
      'Plumbing checkup: Quarterly',
      'Minor repairs included',
      '8 AM – 6 PM support',
      '48-hour response time',
      'Digital maintenance log'
    ],
    exclusions: ['Deep cleaning', 'Painting', '24/7 emergency support'],
    terms: 'Valid 12 months. For up to 20-seat offices.',
    isActive: true
  },
  {
    id: 'AMC-OFFICE-PROFESSIONAL',
    name: 'Office Professional AMC',
    description: 'Complete coverage for growing businesses — ₹24,999/yr',
    category: 'office',
    tier: 'premium',
    coverage: ['Electrical', 'AC (5 units)', 'Plumbing', 'Carpentry', 'Painting'],
    visitsPerYear: 12,
    price: 24999,
    features: [
      'Monthly electrical inspection',
      'AC servicing: Up to 5 units, quarterly',
      'Plumbing & sanitary maintenance',
      'Carpentry & furniture repairs',
      'Painting touch-ups: Once a year',
      'Priority response: Within 24 hrs',
      'Dedicated service manager',
      'Quarterly service reports',
      'Digital maintenance dashboard'
    ],
    exclusions: ['Major civil works', 'New equipment installation'],
    terms: 'Valid 12 months. For 20–100 seat offices.',
    isActive: true
  },
  {
    id: 'AMC-OFFICE-ENTERPRISE',
    name: 'Office Enterprise AMC',
    description: 'Comprehensive facility management — Custom pricing',
    category: 'office',
    tier: 'platinum',
    coverage: ['Full Electrical', 'All AC/HVAC', 'Plumbing', 'Deep Cleaning', 'Compliance'],
    visitsPerYear: 24,
    price: 0,
    features: [
      'Full facility assessment',
      'Unlimited AC servicing',
      '24/7 emergency support',
      'Preventive maintenance schedule',
      'All electrical & plumbing work',
      'Annual deep cleaning included',
      'Quarterly compliance reporting',
      'Dedicated on-site technician option',
      'SLA-backed service guarantees'
    ],
    exclusions: ['Major structural repairs', 'Capital expenditure items'],
    terms: 'Custom pricing based on size and services. Get a free site assessment.',
    isActive: true
  },
  // ─── Commercial Plans ─────────────────────────────────────────────────────────
  {
    id: 'AMC-COMMERCIAL-STARTER',
    name: 'Commercial Starter AMC',
    description: 'Essential coverage for retail spaces — ₹9,999/yr',
    category: 'commercial',
    tier: 'basic',
    coverage: ['Electrical', 'AC', 'Plumbing', 'Pest Control'],
    visitsPerYear: 6,
    price: 9999,
    features: [
      'Bi-monthly electrical safety audit',
      'AC servicing: Up to 3 units',
      'Plumbing inspection: Quarterly',
      'Pest control: Bi-annually',
      'Emergency response: 12 hours',
      'Digital maintenance log'
    ],
    exclusions: ['Deep cleaning', 'Painting', 'Structural work'],
    terms: 'Valid 12 months. For retail shops up to 2,000 sq ft.',
    isActive: true
  },
  {
    id: 'AMC-COMMERCIAL-BUSINESS',
    name: 'Commercial Business AMC',
    description: 'Professional coverage for commercial properties — ₹29,999/yr',
    category: 'commercial',
    tier: 'gold',
    coverage: ['Full Electrical', 'All AC', 'Plumbing', 'Deep Cleaning', 'Pest Control'],
    visitsPerYear: 18,
    price: 29999,
    features: [
      'Monthly electrical audit',
      'AC servicing: Unlimited units',
      'Plumbing & drainage: Monthly',
      'Deep cleaning: Bi-annually',
      'Pest control: Quarterly',
      'Emergency response: 4 hours',
      'Dedicated property manager',
      'Monthly maintenance reports'
    ],
    exclusions: ['Civil construction', 'New installations'],
    terms: 'Valid 12 months. For commercial properties up to 10,000 sq ft.',
    isActive: true
  },
  {
    id: 'AMC-COMMERCIAL-ENTERPRISE',
    name: 'Commercial Enterprise AMC',
    description: 'End-to-end commercial property management — Custom',
    category: 'commercial',
    tier: 'platinum',
    coverage: ['HVAC', 'Full Electrical', 'Plumbing', 'Cleaning', 'Pest Control', 'Custom SLA'],
    visitsPerYear: 36,
    price: 0,
    features: [
      'HVAC systems: Central AC + split units',
      'Electrical systems: Panel + wiring + backup',
      'Plumbing: All fixtures + drainage',
      'Pest control: Monthly commercial treatment',
      'Cleaning: Weekly options',
      'SLA response time: 1–4 hours',
      'Compliance documents: Provided quarterly',
      'Dedicated supervisor: On-site or remote'
    ],
    exclusions: ['Major structural repairs', 'Capital expenditure items'],
    terms: 'Custom pricing. Includes free site assessment and dedicated account manager.',
    isActive: true
  },
  // ─── Industrial Plans ─────────────────────────────────────────────────────────
  {
    id: 'AMC-INDUSTRIAL-STANDARD',
    name: 'Industrial Standard AMC',
    description: 'Essential industrial maintenance — ₹49,999/yr',
    category: 'industrial',
    tier: 'silver',
    coverage: ['Electrical Systems', 'HVAC', 'Plumbing', 'Safety Compliance'],
    visitsPerYear: 12,
    price: 49999,
    features: [
      'Monthly electrical safety audit',
      'HVAC systems: Quarterly service',
      'Plumbing & drainage: Bi-monthly',
      'Safety compliance check: Quarterly',
      'Emergency response: 6 hours',
      'Certified technicians only',
      'Digital maintenance records'
    ],
    exclusions: ['Heavy machinery servicing', 'Structural work', 'Specialized equipment'],
    terms: 'Valid 12 months. For factories up to 20,000 sq ft.',
    isActive: true
  },
  {
    id: 'AMC-INDUSTRIAL-PROFESSIONAL',
    name: 'Industrial Professional AMC',
    description: 'Comprehensive industrial facility management — ₹1,49,999/yr',
    category: 'industrial',
    tier: 'gold',
    coverage: ['High-Voltage Electrical', 'HVAC', 'Plumbing', 'Fire Safety', 'Pest Control'],
    visitsPerYear: 24,
    price: 149999,
    features: [
      'Bi-weekly electrical inspections',
      'HVAC & cooling systems: Monthly',
      'Plumbing & process piping: Monthly',
      'Fire safety systems: Quarterly',
      'Pest control: Monthly',
      'Emergency response: 2 hours',
      'Dedicated facility manager',
      'ISO-compliant documentation'
    ],
    exclusions: ['Heavy machinery repair', 'Capital investment items'],
    terms: 'Valid 12 months. For medium to large manufacturing plants.',
    isActive: true
  },
  // ─── Healthcare Plans ─────────────────────────────────────────────────────────
  {
    id: 'AMC-HEALTHCARE-CLINIC',
    name: 'Healthcare Clinic AMC',
    description: 'Essential maintenance for clinics & diagnostic centres — ₹19,999/yr',
    category: 'healthcare',
    tier: 'silver',
    coverage: ['Electrical', 'HVAC', 'Plumbing', 'Pest Control', 'Water Quality'],
    visitsPerYear: 12,
    price: 19999,
    features: [
      'Monthly electrical safety audit',
      'HVAC servicing: Quarterly',
      'Plumbing & water quality: Bi-monthly',
      'Pest control: Monthly (healthcare-grade)',
      'Sterilization equipment checkup: Quarterly',
      'Emergency response: 4 hours',
      'Compliance-ready documentation'
    ],
    exclusions: ['Medical equipment calibration', 'X-ray machine maintenance'],
    terms: 'Valid 12 months. For clinics and diagnostic centres up to 5,000 sq ft.',
    isActive: true
  },
  {
    id: 'AMC-HEALTHCARE-HOSPITAL',
    name: 'Healthcare Hospital AMC',
    description: 'Comprehensive hospital facility management — ₹79,999/yr',
    category: 'healthcare',
    tier: 'platinum',
    coverage: ['Critical Electrical', 'HVAC', 'Plumbing', 'Medical Gas', 'Fire Safety', 'Pest Control'],
    visitsPerYear: 36,
    price: 79999,
    features: [
      'Weekly electrical & backup power audit',
      'HVAC & clean room systems: Monthly',
      'Medical gas piping: Bi-monthly',
      'Plumbing & drainage: Monthly',
      'Fire safety & suppression: Quarterly',
      'Pest control: Bi-weekly (hospital grade)',
      'Emergency response: 1 hour',
      'Dedicated biomedical engineer support',
      'NABH compliance documentation'
    ],
    exclusions: ['Medical equipment repair', 'Civil construction'],
    terms: 'Valid 12 months. For hospitals and nursing homes.',
    isActive: true
  },
  // ─── Educational Plans ────────────────────────────────────────────────────────
  {
    id: 'AMC-EDU-SCHOOL',
    name: 'School & College AMC',
    description: 'Essential campus maintenance — ₹24,999/yr',
    category: 'educational',
    tier: 'silver',
    coverage: ['Electrical', 'AC', 'Plumbing', 'Pest Control', 'Sanitation'],
    visitsPerYear: 12,
    price: 24999,
    features: [
      'Monthly electrical safety audit',
      'AC servicing: All classroom units, quarterly',
      'Plumbing & sanitation: Monthly',
      'Pest control: Bi-monthly',
      'Water purifier maintenance: Quarterly',
      'Emergency response: 6 hours',
      'Holiday scheduling preferred',
      'Digital maintenance log'
    ],
    exclusions: ['Lab equipment maintenance', 'IT infrastructure', 'Structural work'],
    terms: 'Valid 12 months. For schools and colleges up to 50,000 sq ft.',
    isActive: true
  },
  {
    id: 'AMC-EDU-UNIVERSITY',
    name: 'University Campus AMC',
    description: 'Complete university campus management — ₹89,999/yr',
    category: 'educational',
    tier: 'platinum',
    coverage: ['Electrical', 'HVAC', 'Plumbing', 'Pest Control', 'Cleaning', 'Fire Safety'],
    visitsPerYear: 36,
    price: 89999,
    features: [
      'Bi-weekly campus electrical inspections',
      'HVAC systems: Monthly (all buildings)',
      'Plumbing & water treatment: Monthly',
      'Pest control: Monthly',
      'Fire safety systems: Quarterly',
      'Emergency response: 2 hours',
      'Dedicated campus facilities manager',
      'Compliance & safety documentation'
    ],
    exclusions: ['Research lab equipment', 'IT & AV systems', 'Capital projects'],
    terms: 'Valid 12 months. For university campuses.',
    isActive: true
  },
  // ─── Hospitality Plans ────────────────────────────────────────────────────────
  {
    id: 'AMC-HOSPITALITY-BOUTIQUE',
    name: 'Boutique Hotel AMC',
    description: 'Curated maintenance for boutique hotels — ₹19,999/yr',
    category: 'hospitality',
    tier: 'silver',
    coverage: ['Electrical', 'HVAC', 'Plumbing', 'Pest Control', 'Pool/Water'],
    visitsPerYear: 12,
    price: 19999,
    features: [
      'Monthly electrical safety audit',
      'AC & HVAC: Monthly servicing',
      'Plumbing & water systems: Monthly',
      'Pool maintenance: Fortnightly',
      'Pest control: Monthly (5-star standards)',
      'Emergency response: 2 hours',
      'Seasonal preventive maintenance',
      'Guest satisfaction focus'
    ],
    exclusions: ['Kitchen equipment', 'Laundry machines', 'Structural renovation'],
    terms: 'Valid 12 months. For boutique hotels up to 50 rooms.',
    isActive: true
  },
  {
    id: 'AMC-HOSPITALITY-LUXURY',
    name: 'Luxury Hotel AMC',
    description: 'Premium facility management for luxury properties — ₹1,29,999/yr',
    category: 'hospitality',
    tier: 'platinum',
    coverage: ['Full Electrical', 'Central HVAC', 'Plumbing', 'Pool', 'Spa', 'Fire Safety', 'Pest Control'],
    visitsPerYear: 48,
    price: 129999,
    features: [
      'Weekly electrical & backup power audit',
      'Central HVAC: Weekly servicing',
      'Plumbing, pools & spa: Weekly checks',
      'Fire safety & suppression: Monthly',
      'Pest control: Bi-weekly (5-star grade)',
      'Emergency response: 30 minutes',
      'Dedicated hotel facilities manager',
      'Brand standards compliance support',
      'Preventive maintenance calendar'
    ],
    exclusions: ['F&B kitchen equipment', 'IT & AV infrastructure'],
    terms: 'Valid 12 months. For luxury hotels & resorts.',
    isActive: true
  },
  // ─── Society Plans ────────────────────────────────────────────────────────────
  {
    id: 'AMC-SOCIETY-STANDARD',
    name: 'Society Standard AMC',
    description: 'Essential common area maintenance for residential societies — ₹39,999/yr',
    category: 'society',
    tier: 'silver',
    coverage: ['Common Electrical', 'Lifts', 'Pumps', 'Garden', 'Pest Control'],
    visitsPerYear: 24,
    price: 39999,
    features: [
      'Monthly electrical & common area audit',
      'Lift maintenance coordination: Monthly',
      'Water pump & motor: Monthly service',
      'Garden & landscape: Monthly',
      'Pest control: Quarterly (common areas)',
      'Emergency response: 4 hours',
      'Society maintenance reports: Monthly',
      'Vendor coordination support'
    ],
    exclusions: ['Individual flat maintenance', 'Major civil works', 'Swimming pool'],
    terms: 'Valid 12 months. For societies up to 200 flats.',
    isActive: true
  },
  {
    id: 'AMC-SOCIETY-PREMIUM',
    name: 'Society Premium AMC',
    description: 'Comprehensive gated community management — ₹1,49,999/yr',
    category: 'society',
    tier: 'platinum',
    coverage: ['Full Electrical', 'Lifts', 'DG Sets', 'Swimming Pool', 'STP/WTP', 'Pest Control', 'Security Systems'],
    visitsPerYear: 52,
    price: 149999,
    features: [
      'Weekly electrical & DG set inspection',
      'Lift maintenance: Weekly',
      'Swimming pool: Bi-weekly service',
      'STP/WTP plant: Weekly maintenance',
      'Pest control: Monthly (all common areas)',
      'CCTV & security systems: Monthly audit',
      'Emergency response: 1 hour',
      'Dedicated society facility manager',
      'RWA-ready monthly reports',
      'Annual safety compliance documentation'
    ],
    exclusions: ['Individual flat services', 'Major civil construction'],
    terms: 'Valid 12 months. For large gated communities (200+ flats). RWA contract required.',
    isActive: true
  },
  // ─── Legacy Commercial (keep for backward compat) ─────────────────────────────
  {
    id: 'AMC006',
    name: 'Commercial Property AMC',
    description: 'Commercial Property AMC — Custom Quote',
    category: 'society',
    tier: 'platinum',
    coverage: ['AC & HVAC', 'Electrical Systems', 'Plumbing', 'Pest Control', 'Deep Cleaning', 'Custom SLA'],
    visitsPerYear: 12,
    price: 0,
    features: [
      'HVAC systems: Central AC + split units',
      'Electrical systems: Panel + wiring + backup',
      'Plumbing: All fixtures + drainage',
      'Pest control: Monthly commercial treatment',
      'Cleaning: Weekly/daily options',
      'SLA response time: 1–4 hours',
      'Compliance documents: Provided quarterly',
      'Dedicated supervisor: On-site or remote'
    ],
    exclusions: ['Major structural repairs', 'Capital expenditure items'],
    terms: 'Custom pricing based on property size, location, and services required. Get a free site assessment.',
    isActive: true
  }
];

// Helper to safely load contracts from localStorage (survives page reloads in simulator)
const loadContractsFromStorage = (): AMCContract[] => {
  const data = typeof window !== 'undefined' ? localStorage.getItem('visvasahome_amc_contracts') : null;
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return parsed.map((c: any) => ({
        ...c,
        startDate: new Date(c.startDate),
        endDate: new Date(c.endDate),
        nextVisitDate: c.nextVisitDate ? new Date(c.nextVisitDate) : undefined
      }));
    } catch (e) {
      console.error('Failed to parse AMC contracts:', e);
    }
  }
  return [
    {
      id: 'CONTRACT001',
      contractNumber: 'AMC/2026/001',
      customerId: 'CUST001',
      customerName: 'Rajesh Kumar',
      packageId: 'AMC005',
      packageName: 'Complete Home AMC',
      startDate: new Date('2026-01-15'),
      endDate: new Date('2027-01-14'),
      status: 'active',
      pdfUrl: '/contracts/AMC-2026-001.pdf',
      autoRenew: true,
      visitsCompleted: 2,
      visitsTotal: 8,
      nextVisitDate: new Date('2026-09-15'),
      amountPaid: 9999
    }
  ];
};

const loadVisitsFromStorage = (): AMCVisit[] => {
  const data = typeof window !== 'undefined' ? localStorage.getItem('visvasahome_amc_visits') : null;
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return parsed.map((v: any) => ({
        ...v,
        scheduledDate: new Date(v.scheduledDate),
        completedDate: v.completedDate ? new Date(v.completedDate) : undefined
      }));
    } catch (e) {
      console.error('Failed to parse AMC visits:', e);
    }
  }
  return [
    {
      id: 'VISIT001',
      contractId: 'CONTRACT001',
      scheduledDate: new Date('2026-03-15'),
      status: 'completed',
      spId: 'SP001',
      spName: 'Suresh Reddy',
      completedDate: new Date('2026-03-15'),
      serviceReport: 'AC deep clean completed. Gas levels normal. Plumbing check done — no leaks found.',
      reportUrl: '/reports/VISIT001.pdf',
      rating: 5,
      feedback: 'Excellent service. Very thorough.'
    },
    {
      id: 'VISIT002',
      contractId: 'CONTRACT001',
      scheduledDate: new Date('2026-06-15'),
      status: 'completed',
      spId: 'SP001',
      spName: 'Suresh Reddy',
      completedDate: new Date('2026-06-15'),
      serviceReport: 'Pest control treatment done. Electrical safety audit completed. All MCBs tested.',
      reportUrl: '/reports/VISIT002.pdf',
      rating: 5,
      feedback: 'Great work as always!'
    },
    {
      id: 'VISIT003',
      contractId: 'CONTRACT001',
      scheduledDate: new Date('2026-09-15'),
      status: 'scheduled',
      spId: 'SP001',
      spName: 'Suresh Reddy'
    }
  ];
};

let mockContracts: AMCContract[] = loadContractsFromStorage();
let mockVisits: AMCVisit[] = loadVisitsFromStorage();

/**
 * Get all available AMC packages
 */
export const getAMCPackages = async (category?: string): Promise<AMCPackage[]> => {
  if (category) {
    return mockAMCPackages.filter(pkg => pkg.category === category && pkg.isActive);
  }
  return mockAMCPackages.filter(pkg => pkg.isActive);
};

/**
 * Get specific AMC package details
 */
export const getAMCPackage = async (packageId: string): Promise<AMCPackage | null> => {
  return mockAMCPackages.find(pkg => pkg.id === packageId) || null;
};

/**
 * Get customer's active AMC contracts
 */
export const getCustomerContracts = async (customerId: string): Promise<AMCContract[]> => {
  return mockContracts.filter(contract => contract.customerId === customerId);
};

/**
 * Get specific contract details
 */
export const getContract = async (contractId: string): Promise<AMCContract | null> => {
  return mockContracts.find(contract => contract.id === contractId) || null;
};

/**
 * Purchase new AMC package
 */
export const purchaseAMC = async (
  customerId: string,
  customerName: string,
  packageId: string,
  paymentId: string
): Promise<{ success: boolean; contract?: AMCContract; message?: string }> => {
  const packageData = await getAMCPackage(packageId);

  if (!packageData) {
    return { success: false, message: 'Package not found' };
  }

  const contractNumber = `AMC/2026/${String(mockContracts.length + 1).padStart(3, '0')}`;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(startDate.getFullYear() + 1);

  const newContract: AMCContract = {
    id: `CONTRACT${mockContracts.length + 1}`,
    contractNumber,
    customerId,
    customerName,
    packageId,
    packageName: packageData.name,
    startDate,
    endDate,
    status: 'active',
    pdfUrl: `/contracts/${contractNumber.replace(/\//g, '-')}.pdf`,
    autoRenew: true,
    visitsCompleted: 0,
    visitsTotal: packageData.visitsPerYear,
    amountPaid: packageData.price
  };

  mockContracts.push(newContract);

  // Schedule first visit (30 days from now)
  const firstVisitDate = new Date();
  firstVisitDate.setDate(firstVisitDate.getDate() + 30);
  newContract.nextVisitDate = firstVisitDate;

  // Insert a mock scheduled visit record so it displays in the user's dashboard
  const newVisit: AMCVisit = {
    id: `VISIT_${Date.now()}`,
    contractId: newContract.contractNumber,
    scheduledDate: firstVisitDate,
    status: 'scheduled',
    spId: 'SP001',
    spName: 'Suresh Reddy (Verified)'
  };
  mockVisits.push(newVisit);

  // Persist to storage
  if (typeof window !== 'undefined') {
    localStorage.setItem('visvasahome_amc_contracts', JSON.stringify(mockContracts));
    localStorage.setItem('visvasahome_amc_visits', JSON.stringify(mockVisits));
  }

  return { success: true, contract: newContract };
};

/**
 * Get visit history for a contract
 */
export const getVisitHistory = async (contractId: string): Promise<AMCVisit[]> => {
  return mockVisits.filter(visit => visit.contractId === contractId);
};

/**
 * Schedule a new visit
 */
export const scheduleVisit = async (
  contractId: string,
  scheduledDate: Date
): Promise<{ success: boolean; visit?: AMCVisit }> => {
  const newVisit: AMCVisit = {
    id: `VISIT${mockVisits.length + 1}`,
    contractId,
    scheduledDate,
    status: 'scheduled'
  };

  mockVisits.push(newVisit);
  return { success: true, visit: newVisit };
};

/**
 * Complete a visit with service report
 */
export const completeVisit = async (
  visitId: string,
  spId: string,
  spName: string,
  serviceReport: string,
  rating?: number,
  feedback?: string
): Promise<{ success: boolean }> => {
  const visit = mockVisits.find(v => v.id === visitId);

  if (!visit) {
    return { success: false };
  }

  visit.status = 'completed';
  visit.spId = spId;
  visit.spName = spName;
  visit.completedDate = new Date();
  visit.serviceReport = serviceReport;
  visit.reportUrl = `/reports/${visitId}.pdf`;
  visit.rating = rating;
  visit.feedback = feedback;

  // Update contract visits completed
  const contract = mockContracts.find(c => c.id === visit.contractId);
  if (contract) {
    contract.visitsCompleted += 1;
  }

  return { success: true };
};

/**
 * Request add-on service for AMC customer
 */
export const requestAddOnService = async (
  contractId: string,
  serviceType: string,
  description: string
): Promise<{ success: boolean; discount: number }> => {
  // AMC customers get 15% discount on add-on services
  return { success: true, discount: 15 };
};

/**
 * Cancel AMC contract
 */
export const cancelContract = async (
  contractId: string,
  reason: string
): Promise<{ success: boolean; refundAmount?: number }> => {
  const contract = mockContracts.find(c => c.id === contractId);

  if (!contract) {
    return { success: false };
  }

  contract.status = 'cancelled';

  // Calculate pro-rata refund
  const totalDays = 365;
  const daysUsed = Math.floor((new Date().getTime() - contract.startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysRemaining = totalDays - daysUsed;
  const refundAmount = Math.floor((contract.amountPaid * daysRemaining) / totalDays);

  return { success: true, refundAmount };
};

/**
 * Renew AMC contract
 */
export const renewContract = async (
  contractId: string,
  paymentId: string
): Promise<{ success: boolean; contract?: AMCContract }> => {
  const oldContract = mockContracts.find(c => c.id === contractId);

  if (!oldContract) {
    return { success: false };
  }

  const packageData = await getAMCPackage(oldContract.packageId);
  if (!packageData) {
    return { success: false };
  }

  // Create renewed contract
  const newStartDate = oldContract.endDate;
  const newEndDate = new Date(newStartDate);
  newEndDate.setFullYear(newStartDate.getFullYear() + 1);

  const contractNumber = `AMC/2026/${String(mockContracts.length + 1).padStart(3, '0')}`;

  const renewedContract: AMCContract = {
    id: `CONTRACT${mockContracts.length + 1}`,
    contractNumber,
    customerId: oldContract.customerId,
    customerName: oldContract.customerName,
    packageId: oldContract.packageId,
    packageName: oldContract.packageName,
    startDate: newStartDate,
    endDate: newEndDate,
    status: 'active',
    pdfUrl: `/contracts/${contractNumber.replace(/\//g, '-')}.pdf`,
    autoRenew: oldContract.autoRenew,
    visitsCompleted: 0,
    visitsTotal: packageData.visitsPerYear,
    amountPaid: packageData.price
  };

  mockContracts.push(renewedContract);
  oldContract.status = 'expired';

  return { success: true, contract: renewedContract };
};

/**
 * Check for contracts due for renewal (30 days before expiry)
 */
export const getContractsDueForRenewal = async (): Promise<AMCContract[]> => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  return mockContracts.filter(
    contract =>
      contract.status === 'active' &&
      contract.endDate <= thirtyDaysFromNow &&
      contract.endDate >= new Date()
  );
};

/**
 * Simulates a high-fidelity AMC contract and its visit history
 */
export const simulateAMCLifecycle = async (
  customerId: string,
  customerName: string
): Promise<{ success: boolean; contractId: string }> => {
  // Clear any existing demo contract and visits to avoid duplicates
  mockContracts = mockContracts.filter(c => c.id !== 'CONTRACT_DEMO_AMC');
  mockVisits = mockVisits.filter(v => v.contractId !== 'CONTRACT_DEMO_AMC' && v.contractId !== 'AMC/2026/DEMO');

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3); // Started 3 months ago

  const endDate = new Date(startDate);
  endDate.setFullYear(startDate.getFullYear() + 1); // 1 year duration

  const nextVisitDate = new Date();
  nextVisitDate.setDate(nextVisitDate.getDate() + 15); // Next scheduled visit in 15 days

  const newContract: AMCContract = {
    id: 'CONTRACT_DEMO_AMC',
    contractNumber: 'AMC/2026/DEMO',
    customerId,
    customerName,
    packageId: 'AMC005',
    packageName: 'Complete Home AMC (Simulated)',
    startDate,
    endDate,
    status: 'active',
    pdfUrl: '/contracts/AMC-2026-DEMO.pdf',
    autoRenew: true,
    visitsCompleted: 2,
    visitsTotal: 4,
    nextVisitDate,
    amountPaid: 9999
  };

  const visit1Date = new Date(startDate);
  visit1Date.setDate(visit1Date.getDate() + 15); // First visit, 15 days after start

  const visit2Date = new Date(startDate);
  visit2Date.setDate(visit2Date.getDate() + 45); // Second visit, 45 days after start

  const visit3Date = nextVisitDate; // Third visit scheduled in 15 days

  const visit4Date = new Date(startDate);
  visit4Date.setDate(visit4Date.getDate() + 135); // Fourth visit scheduled further out

  const demoVisits: AMCVisit[] = [
    {
      id: 'VISIT_DEMO_1',
      contractId: 'CONTRACT_DEMO_AMC',
      scheduledDate: visit1Date,
      status: 'completed',
      spId: 'SP001',
      spName: 'Suresh Reddy (Verified)',
      completedDate: visit1Date,
      serviceReport: 'AC deep clean, filter wash, and pressure checks completed. Replaced faulty capacitor (charged ₹0 under AMC parts limit).',
      reportUrl: '/reports/VISIT_DEMO_1.pdf',
      rating: 5,
      feedback: 'Excellent service. Suresh knew exactly what he was doing and fixed my AC fast.'
    },
    {
      id: 'VISIT_DEMO_2',
      contractId: 'CONTRACT_DEMO_AMC',
      scheduledDate: visit2Date,
      status: 'completed',
      spId: 'SP001',
      spName: 'Suresh Reddy (Verified)',
      completedDate: visit2Date,
      serviceReport: 'Plumbing health check: Serviced master bathroom geyser, cleaned aerators of all taps, and fixed toilet flush tank float valve leakage.',
      reportUrl: '/reports/VISIT_DEMO_2.pdf',
      rating: 5,
      feedback: 'Very thorough checkup. Resolved the leak in the bathroom.'
    },
    {
      id: 'VISIT_DEMO_3',
      contractId: 'CONTRACT_DEMO_AMC',
      scheduledDate: visit3Date,
      status: 'scheduled',
      spId: 'SP001',
      spName: 'Suresh Reddy (Verified)'
    },
    {
      id: 'VISIT_DEMO_4',
      contractId: 'CONTRACT_DEMO_AMC',
      scheduledDate: visit4Date,
      status: 'scheduled'
    }
  ];

  mockContracts.push(newContract);
  mockVisits.push(...demoVisits);

  // Persist to storage
  if (typeof window !== 'undefined') {
    localStorage.setItem('visvasahome_amc_contracts', JSON.stringify(mockContracts));
    localStorage.setItem('visvasahome_amc_visits', JSON.stringify(mockVisits));
  }

  return { success: true, contractId: 'CONTRACT_DEMO_AMC' };
};
