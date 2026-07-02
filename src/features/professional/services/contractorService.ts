// Contractor Service
// Handles contractor profiles, project bids, quotes, milestones, and escrow payments

export interface ContractorProfile {
  id: string;
  userId: string;
  companyName: string;
  ownerName: string;
  licenseNumber: string;
  teamSize: number;
  citiesServed: string[];
  categories: string[];
  portfolioUrls: string[];
  rating: number;
  projectsCompleted: number;
  yearsExperience: number;
  description: string;
  phone: string;
  email: string;
  isVerified: boolean;
}

export interface ProjectRequirement {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  category: string;
  location: string;
  photos: string[];
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  status: 'open' | 'quotes-received' | 'awarded' | 'in-progress' | 'completed' | 'cancelled';
  postedDate: Date;
  quotesReceived: number;
}

export interface ContractorQuote {
  id: string;
  projectId: string;
  contractorId: string;
  contractorName: string;
  contractorRating: number;
  quotedAmount: number;
  timeline: string;
  lineItems: QuoteLineItem[];
  milestones: QuoteMilestone[];
  validUntil: Date;
  terms: string;
  status: 'pending' | 'accepted' | 'rejected';
  submittedDate: Date;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  category: 'material' | 'labor' | 'other';
  quantity: number;
  unit: string;
  ratePerUnit: number;
  total: number;
}

export interface QuoteMilestone {
  id: string;
  title: string;
  description: string;
  paymentPercentage: number;
  paymentAmount: number;
  targetDays: number;
}

export interface Project {
  id: string;
  requirementId: string;
  customerId: string;
  customerName: string;
  contractorId: string;
  contractorName: string;
  title: string;
  description: string;
  quotedAmount: number;
  timeline: string;
  status: 'active' | 'completed' | 'disputed' | 'cancelled';
  startDate: Date;
  expectedEndDate: Date;
  completedDate?: Date;
  milestones: ProjectMilestone[];
  contractUrl: string;
  rating?: number;
  review?: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  paymentAmount: number;
  targetDate: Date;
  status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'rejected' | 'paid';
  photos: string[];
  customerApproved: boolean;
  approvalDate?: Date;
  paymentReleased: boolean;
  releaseDate?: Date;
  submittedDate?: Date;
  notes?: string;
}

export interface EscrowPayment {
  id: string;
  projectId: string;
  milestoneId: string;
  amount: number;
  status: 'held' | 'released' | 'refunded';
  heldDate: Date;
  releaseDate?: Date;
  commission: number;
  netAmount: number;
}

// ── Commission Configuration ─────────────────────────────────────────────────
export const COMMISSION_CONFIG = {
  standardBooking: 0.15,    // 15% platform commission on regular service bookings
  contractorMilestone: 0.06 // 6% platform commission on contractor milestone payments
};

/**
 * Calculate commission for a contractor milestone payment
 */
export const calculateMilestoneCommission = (amount: number): { commission: number; netAmount: number } => {
  const commission = Math.round(amount * COMMISSION_CONFIG.contractorMilestone);
  return { commission, netAmount: amount - commission };
};

/**
 * Calculate commission for a standard service booking payment
 */
export const calculateBookingCommission = (amount: number): { commission: number; netAmount: number } => {
  const commission = Math.round(amount * COMMISSION_CONFIG.standardBooking);
  return { commission, netAmount: amount - commission };
};

/**
 * Create an escrow hold record for a milestone (called when milestone payment is made)
 */
export const createMilestoneEscrow = (
  projectId: string,
  milestoneId: string,
  amount: number
): EscrowPayment => {
  const { commission, netAmount } = calculateMilestoneCommission(amount);
  const escrow: EscrowPayment = {
    id: `ESC${String(mockEscrowPayments.length + 1).padStart(3, '0')}`,
    projectId,
    milestoneId,
    amount,
    status: 'held',
    heldDate: new Date(),
    commission,
    netAmount
  };
  mockEscrowPayments.push(escrow);
  saveEscrowToStorage();
  return escrow;
};

// Mock contractor profiles
const mockContractors: ContractorProfile[] = [
  {
    id: 'CONT001',
    userId: 'USER001',
    companyName: 'Elite Interiors Pvt Ltd',
    ownerName: 'Vikram Malhotra',
    licenseNumber: 'INT-KA-2020-12345',
    teamSize: 25,
    citiesServed: ['Bangalore', 'Mysore', 'Mangalore'],
    categories: ['Interior Design', 'Home Renovation', 'Modular Kitchen'],
    portfolioUrls: ['/portfolio/elite1.jpg', '/portfolio/elite2.jpg', '/portfolio/elite3.jpg'],
    rating: 4.8,
    projectsCompleted: 142,
    yearsExperience: 8,
    description: 'Award-winning interior design and renovation specialists with 8 years of experience. Specializing in modern and contemporary designs.',
    phone: '+91 98765 43210',
    email: 'vikram@eliteinteriors.com',
    isVerified: true
  },
  {
    id: 'CONT002',
    userId: 'USER002',
    companyName: 'WaterProof Solutions',
    ownerName: 'Rajesh Nair',
    licenseNumber: 'WTP-KA-2019-67890',
    teamSize: 12,
    citiesServed: ['Bangalore', 'Hyderabad'],
    categories: ['Waterproofing', 'Terrace Treatment', 'Bathroom Waterproofing'],
    portfolioUrls: ['/portfolio/water1.jpg', '/portfolio/water2.jpg'],
    rating: 4.9,
    projectsCompleted: 89,
    yearsExperience: 6,
    description: 'Specialized waterproofing contractors with expertise in terrace, bathroom, and basement waterproofing. 10-year warranty on all work.',
    phone: '+91 87654 32109',
    email: 'rajesh@waterproofsolutions.com',
    isVerified: true
  },
  {
    id: 'CONT003',
    userId: 'USER003',
    companyName: 'ModularKitchen Pro',
    ownerName: 'Priya Sharma',
    licenseNumber: 'MOD-KA-2021-11223',
    teamSize: 18,
    citiesServed: ['Bangalore', 'Chennai', 'Coimbatore'],
    categories: ['Modular Kitchen', 'Wardrobe', 'Interior Design'],
    portfolioUrls: ['/portfolio/mod1.jpg', '/portfolio/mod2.jpg', '/portfolio/mod3.jpg', '/portfolio/mod4.jpg'],
    rating: 4.7,
    projectsCompleted: 215,
    yearsExperience: 10,
    description: 'Premium modular kitchen and wardrobe specialists. German hardware, lifetime warranty on fittings.',
    phone: '+91 76543 21098',
    email: 'priya@modularkitchenpro.com',
    isVerified: true
  }
];

// Helper functions to load and save contractor data to/from localStorage

const loadRequirementsFromStorage = (): ProjectRequirement[] => {
  const data = typeof window !== 'undefined' ? localStorage.getItem('visvasahome_contractor_requirements') : null;
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return parsed.map((r: any) => ({
        ...r,
        postedDate: new Date(r.postedDate)
      }));
    } catch (e) {
      console.error('Failed to parse contractor requirements:', e);
    }
  }
  return [
    {
      id: 'REQ001',
      customerId: 'CUST001',
      customerName: 'Anita Desai',
      title: 'Full Home Interior Design - 3BHK',
      description: 'Looking for complete interior design and execution for my 1600 sq ft 3BHK apartment. Modern contemporary style preferred. Includes modular kitchen, wardrobes, false ceiling, and painting.',
      category: 'Interior Design',
      location: 'Whitefield, Bangalore',
      photos: ['/projects/req001-1.jpg', '/projects/req001-2.jpg'],
      budgetMin: 800000,
      budgetMax: 1200000,
      timeline: '3-4 months',
      status: 'quotes-received',
      postedDate: new Date('2026-05-20'),
      quotesReceived: 3
    }
  ];
};

export const saveRequirementsToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('visvasahome_contractor_requirements', JSON.stringify(mockRequirements));
  }
};

const loadQuotesFromStorage = (): ContractorQuote[] => {
  const data = typeof window !== 'undefined' ? localStorage.getItem('visvasahome_contractor_quotes') : null;
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return parsed.map((q: any) => ({
        ...q,
        validUntil: new Date(q.validUntil),
        submittedDate: new Date(q.submittedDate)
      }));
    } catch (e) {
      console.error('Failed to parse contractor quotes:', e);
    }
  }
  return [
    {
      id: 'QUOTE001',
      projectId: 'REQ001',
      contractorId: 'CONT001',
      contractorName: 'Elite Interiors Pvt Ltd',
      contractorRating: 4.8,
      quotedAmount: 1050000,
      timeline: '90 days',
      lineItems: [
        {
          id: 'LI001',
          description: 'Modular Kitchen with German fittings',
          category: 'material',
          quantity: 1,
          unit: 'set',
          ratePerUnit: 350000,
          total: 350000
        },
        {
          id: 'LI002',
          description: 'Master Bedroom Wardrobe',
          category: 'material',
          quantity: 1,
          unit: 'set',
          ratePerUnit: 150000,
          total: 150000
        },
        {
          id: 'LI003',
          description: 'False Ceiling - Living & Dining',
          category: 'material',
          quantity: 400,
          unit: 'sqft',
          ratePerUnit: 180,
          total: 72000
        },
        {
          id: 'LI004',
          description: 'Complete Interior Painting',
          category: 'labor',
          quantity: 1600,
          unit: 'sqft',
          ratePerUnit: 28,
          total: 44800
        },
        {
          id: 'LI005',
          description: 'Electrical & Lighting Setup',
          category: 'material',
          quantity: 1,
          unit: 'package',
          ratePerUnit: 120000,
          total: 120000
        },
        {
          id: 'LI006',
          description: 'Project Management & Supervision',
          category: 'other',
          quantity: 90,
          unit: 'days',
          ratePerUnit: 1500,
          total: 135000
        }
      ],
      milestones: [
        {
          id: 'MS001',
          title: 'Design & Material Procurement',
          description: 'Complete 3D design, approval, and material ordering',
          paymentPercentage: 30,
          paymentAmount: 315000,
          targetDays: 15
        },
        {
          id: 'MS002',
          title: 'Kitchen & Wardrobe Installation',
          description: 'Complete modular kitchen and wardrobe installation',
          paymentPercentage: 40,
          paymentAmount: 420000,
          targetDays: 50
        },
        {
          id: 'MS003',
          title: 'Ceiling, Electrical & Painting',
          description: 'False ceiling, electrical work, and complete painting',
          paymentPercentage: 25,
          paymentAmount: 262500,
          targetDays: 80
        },
        {
          id: 'MS004',
          title: 'Final Finishing & Handover',
          description: 'Touch-ups, cleaning, and final inspection',
          paymentPercentage: 5,
          paymentAmount: 52500,
          targetDays: 90
        }
      ],
      validUntil: new Date('2026-06-20'),
      terms: 'Payment as per milestone completion. 1-year warranty on all work. Material brand changes subject to customer approval.',
      status: 'pending',
      submittedDate: new Date('2026-05-22')
    },
    {
      id: 'QUOTE002',
      projectId: 'REQ001',
      contractorId: 'CONT003',
      contractorName: 'ModularKitchen Pro',
      contractorRating: 4.7,
      quotedAmount: 980000,
      timeline: '100 days',
      lineItems: [
        {
          id: 'LI007',
          description: 'Premium Modular Kitchen',
          category: 'material',
          quantity: 1,
          unit: 'set',
          ratePerUnit: 320000,
          total: 320000
        },
        {
          id: 'LI008',
          description: 'Bedroom Wardrobes (3 nos)',
          category: 'material',
          quantity: 3,
          unit: 'set',
          ratePerUnit: 90000,
          total: 270000
        },
        {
          id: 'LI009',
          description: 'Interior Work & Painting',
          category: 'labor',
          quantity: 1,
          unit: 'package',
          ratePerUnit: 250000,
          total: 250000
        },
        {
          id: 'LI010',
          description: 'Electrical & Accessories',
          category: 'material',
          quantity: 1,
          unit: 'package',
          ratePerUnit: 140000,
          total: 140000
        }
      ],
      milestones: [
        {
          id: 'MS005',
          title: 'Design Approval & Material Order',
          description: '3D design finalization and material procurement',
          paymentPercentage: 35,
          paymentAmount: 343000,
          targetDays: 20
        },
        {
          id: 'MS006',
          title: 'Kitchen & Wardrobe Execution',
          description: 'Complete installation of modular units',
          paymentPercentage: 45,
          paymentAmount: 441000,
          targetDays: 70
        },
        {
          id: 'MS007',
          title: 'Finishing & Final Inspection',
          description: 'Painting, electrical, and handover',
          paymentPercentage: 20,
          paymentAmount: 196000,
          targetDays: 100
        }
      ],
      validUntil: new Date('2026-06-22'),
      terms: 'Lifetime warranty on hardware. Material grade may vary based on budget.',
      status: 'pending',
      submittedDate: new Date('2026-05-23')
    }
  ];
};

export const saveQuotesToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('visvasahome_contractor_quotes', JSON.stringify(mockQuotes));
  }
};

const loadProjectsFromStorage = (): Project[] => {
  const data = typeof window !== 'undefined' ? localStorage.getItem('visvasahome_contractor_projects') : null;
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return parsed.map((p: any) => ({
        ...p,
        startDate: new Date(p.startDate),
        expectedEndDate: new Date(p.expectedEndDate),
        completedDate: p.completedDate ? new Date(p.completedDate) : undefined,
        milestones: p.milestones.map((m: any) => ({
          ...m,
          targetDate: new Date(m.targetDate),
          approvalDate: m.approvalDate ? new Date(m.approvalDate) : undefined,
          submittedDate: m.submittedDate ? new Date(m.submittedDate) : undefined,
          releaseDate: m.releaseDate ? new Date(m.releaseDate) : undefined
        }))
      }));
    } catch (e) {
      console.error('Failed to parse contractor projects:', e);
    }
  }
  return [];
};

export const saveProjectsToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('visvasahome_contractor_projects', JSON.stringify(mockProjects));
  }
};

const loadEscrowFromStorage = (): EscrowPayment[] => {
  const data = typeof window !== 'undefined' ? localStorage.getItem('visvasahome_contractor_escrow') : null;
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return parsed.map((e: any) => ({
        ...e,
        heldDate: new Date(e.heldDate),
        releaseDate: e.releaseDate ? new Date(e.releaseDate) : undefined
      }));
    } catch (e) {
      console.error('Failed to parse contractor escrow:', e);
    }
  }
  return [];
};

export const saveEscrowToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('visvasahome_contractor_escrow', JSON.stringify(mockEscrowPayments));
  }
};

// Mock project requirements
let mockRequirements: ProjectRequirement[] = loadRequirementsFromStorage();

// Mock quotes
let mockQuotes: ContractorQuote[] = loadQuotesFromStorage();

// Mock projects
let mockProjects: Project[] = loadProjectsFromStorage();

// Mock escrow payments
let mockEscrowPayments: EscrowPayment[] = loadEscrowFromStorage();

/**
 * Get all contractor profiles
 */
export const getContractors = async (category?: string): Promise<ContractorProfile[]> => {
  if (category) {
    return mockContractors.filter(c => c.categories.includes(category) && c.isVerified);
  }
  return mockContractors.filter(c => c.isVerified);
};

/**
 * Get contractor profile
 */
export const getContractor = async (contractorId: string): Promise<ContractorProfile | null> => {
  return mockContractors.find(c => c.id === contractorId) || null;
};

/**
 * Post project requirement
 */
export const postProjectRequirement = async (
  customerId: string,
  customerName: string,
  requirement: Omit<ProjectRequirement, 'id' | 'customerId' | 'customerName' | 'status' | 'postedDate' | 'quotesReceived'>
): Promise<{ success: boolean; requirement?: ProjectRequirement }> => {
  const newRequirement: ProjectRequirement = {
    id: `REQ${String(mockRequirements.length + 1).padStart(3, '0')}`,
    customerId,
    customerName,
    ...requirement,
    status: 'open',
    postedDate: new Date(),
    quotesReceived: 0
  };

  mockRequirements.push(newRequirement);
  saveRequirementsToStorage();
  return { success: true, requirement: newRequirement };
};

/**
 * Get project requirements (for contractors to view)
 */
export const getProjectRequirements = async (category?: string): Promise<ProjectRequirement[]> => {
  if (category) {
    return mockRequirements.filter(r => r.category === category && r.status === 'open');
  }
  return mockRequirements.filter(r => r.status === 'open');
};

/**
 * Get quotes for a project
 */
export const getProjectQuotes = async (projectId: string): Promise<ContractorQuote[]> => {
  return mockQuotes.filter(q => q.projectId === projectId);
};

/**
 * Submit quote (contractor action)
 */
export const submitQuote = async (
  contractorId: string,
  quote: Omit<ContractorQuote, 'id' | 'contractorId' | 'status' | 'submittedDate'>
): Promise<{ success: boolean; quote?: ContractorQuote }> => {
  const contractor = await getContractor(contractorId);
  if (!contractor) {
    return { success: false };
  }

  const newQuote: ContractorQuote = {
    id: `QUOTE${String(mockQuotes.length + 1).padStart(3, '0')}`,
    contractorId,
    ...quote,
    status: 'pending',
    submittedDate: new Date()
  };

  mockQuotes.push(newQuote);

  // Update requirement quotes count
  const requirement = mockRequirements.find(r => r.id === quote.projectId);
  if (requirement) {
    requirement.quotesReceived += 1;
    requirement.status = 'quotes-received';
  }

  saveQuotesToStorage();
  saveRequirementsToStorage();

  return { success: true, quote: newQuote };
};

/**
 * Accept quote and create project
 */
export const acceptQuote = async (
  quoteId: string,
  paymentId: string
): Promise<{ success: boolean; project?: Project }> => {
  const quote = mockQuotes.find(q => q.id === quoteId);
  if (!quote) {
    return { success: false };
  }

  const requirement = mockRequirements.find(r => r.id === quote.projectId);
  if (!requirement) {
    return { success: false };
  }

  // Create project
  const projectId = `PROJ${String(mockProjects.length + 1).padStart(3, '0')}`;
  const startDate = new Date();
  const expectedEndDate = new Date();
  const timelineDays = parseInt(quote.timeline);
  expectedEndDate.setDate(startDate.getDate() + timelineDays);

  const project: Project = {
    id: projectId,
    requirementId: quote.projectId,
    customerId: requirement.customerId,
    customerName: requirement.customerName,
    contractorId: quote.contractorId,
    contractorName: quote.contractorName,
    title: requirement.title,
    description: requirement.description,
    quotedAmount: quote.quotedAmount,
    timeline: quote.timeline,
    status: 'active',
    startDate,
    expectedEndDate,
    milestones: quote.milestones.map((ms, idx) => {
      const targetDate = new Date(startDate);
      targetDate.setDate(targetDate.getDate() + ms.targetDays);

      return {
        id: `MS-${projectId}-${idx + 1}`,
        projectId,
        title: ms.title,
        description: ms.description,
        paymentAmount: ms.paymentAmount,
        targetDate,
        status: idx === 0 ? 'in-progress' : 'pending',
        photos: [],
        customerApproved: false,
        paymentReleased: false
      };
    }),
    contractUrl: `/contracts/project-${projectId}.pdf`
  };

  mockProjects.push(project);

  // Create escrow for first milestone using dynamic commission (6% for contractor milestones)
  const firstMilestone = project.milestones[0];
  const { commission, netAmount } = calculateMilestoneCommission(firstMilestone.paymentAmount);
  const escrow: EscrowPayment = {
    id: `ESC${String(mockEscrowPayments.length + 1).padStart(3, '0')}`,
    projectId: project.id,
    milestoneId: firstMilestone.id,
    amount: firstMilestone.paymentAmount,
    status: 'held',
    heldDate: new Date(),
    commission,
    netAmount
  };

  mockEscrowPayments.push(escrow);

  // Update quote and requirement status
  quote.status = 'accepted';
  requirement.status = 'awarded';

  saveProjectsToStorage();
  saveEscrowToStorage();
  saveQuotesToStorage();
  saveRequirementsToStorage();

  return { success: true, project };
};

/**
 * Get contractor projects
 */
export const getContractorProjects = async (contractorId: string): Promise<Project[]> => {
  return mockProjects.filter(p => p.contractorId === contractorId);
};

/**
 * Get customer projects
 */
export const getCustomerProjects = async (customerId: string): Promise<Project[]> => {
  return mockProjects.filter(p => p.customerId === customerId);
};

/**
 * Update milestone status (contractor submits completion)
 */
export const submitMilestone = async (
  milestoneId: string,
  photos: string[],
  notes?: string
): Promise<{ success: boolean }> => {
  const project = mockProjects.find(p => p.milestones.some(m => m.id === milestoneId));
  if (!project) {
    return { success: false };
  }

  const milestone = project.milestones.find(m => m.id === milestoneId);
  if (!milestone) {
    return { success: false };
  }

  milestone.status = 'submitted';
  milestone.photos = photos;
  milestone.notes = notes;
  milestone.submittedDate = new Date();

  saveProjectsToStorage();

  return { success: true };
};

/**
 * Approve milestone (customer action)
 */
export const approveMilestone = async (
  milestoneId: string
): Promise<{ success: boolean; paymentReleased?: boolean }> => {
  const project = mockProjects.find(p => p.milestones.some(m => m.id === milestoneId));
  if (!project) {
    return { success: false };
  }

  const milestone = project.milestones.find(m => m.id === milestoneId);
  if (!milestone) {
    return { success: false };
  }

  milestone.status = 'approved';
  milestone.customerApproved = true;
  milestone.approvalDate = new Date();

  // Release escrow payment
  const escrow = mockEscrowPayments.find(e => e.milestoneId === milestoneId);
  if (escrow) {
    escrow.status = 'released';
    escrow.releaseDate = new Date();
    milestone.paymentReleased = true;
    milestone.status = 'paid';
  }

  // Activate next milestone and create escrow hold for it
  const currentIndex = project.milestones.findIndex(m => m.id === milestoneId);
  if (currentIndex < project.milestones.length - 1) {
    const nextMilestone = project.milestones[currentIndex + 1];
    nextMilestone.status = 'in-progress';

    // Create escrow for next milestone (6% commission held by platform)
    const existingEscrow = mockEscrowPayments.find(e => e.milestoneId === nextMilestone.id);
    if (!existingEscrow) {
      const { commission: nextCommission, netAmount: nextNetAmount } = calculateMilestoneCommission(nextMilestone.paymentAmount);
      const nextEscrow: EscrowPayment = {
        id: `ESC${String(mockEscrowPayments.length + 1).padStart(3, '0')}`,
        projectId: project.id,
        milestoneId: nextMilestone.id,
        amount: nextMilestone.paymentAmount,
        status: 'held',
        heldDate: new Date(),
        commission: nextCommission,
        netAmount: nextNetAmount
      };
      mockEscrowPayments.push(nextEscrow);
    }
  } else {
    // Last milestone completed
    project.status = 'completed';
    project.completedDate = new Date();
  }

  saveProjectsToStorage();
  saveEscrowToStorage();

  return { success: true, paymentReleased: milestone.paymentReleased };
};

/**
 * Get escrow payments for a project
 */
export const getProjectEscrow = async (projectId: string): Promise<EscrowPayment[]> => {
  return mockEscrowPayments.filter(e => e.projectId === projectId);
};

/**
 * Simulates a high-fidelity contractor requirement and two competitive quotes
 */
export const simulateContractorBiddingLifecycle = async (
  customerId: string,
  customerName: string
): Promise<{ success: boolean; projectId: string }> => {
  const projectId = 'REQ_DEMO_001';

  // 1. Clear any existing demo requirements, quotes, projects, and escrow records
  mockRequirements = mockRequirements.filter(r => r.id !== projectId);
  mockQuotes = mockQuotes.filter(q => q.projectId !== projectId);
  
  // Also clear any projects and escrow linked to this demo requirement ID
  const linkedProjects = mockProjects.filter(p => p.requirementId === projectId);
  const linkedProjectIds = linkedProjects.map(p => p.id);
  mockProjects = mockProjects.filter(p => p.requirementId !== projectId);
  mockEscrowPayments = mockEscrowPayments.filter(e => !linkedProjectIds.includes(e.projectId));

  // 2. Add the mock requirement
  const newRequirement: ProjectRequirement = {
    id: projectId,
    customerId,
    customerName,
    title: 'Modular Kitchen Renovation (Simulated)',
    description: 'Looking to renovate my kitchen. Need a U-shaped layout with high-gloss acrylic finish cabinet shutters, premium quartz countertop, built-in chimney, hob, and soft-close drawers.',
    category: 'Modular Kitchen',
    location: 'Indiranagar, Bangalore',
    photos: [],
    budgetMin: 300000,
    budgetMax: 500000,
    timeline: '30-45 days',
    status: 'quotes-received',
    postedDate: new Date(),
    quotesReceived: 2
  };

  // 3. Add the two competitive quotes
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  const quote1: ContractorQuote = {
    id: 'QUOTE_DEMO_001',
    projectId: projectId,
    contractorId: 'CONT001',
    contractorName: 'Elite Interiors Pvt Ltd',
    contractorRating: 4.8,
    quotedAmount: 410000,
    timeline: '40 days',
    lineItems: [
      { id: 'LI_D1_1', description: 'Acrylic high-gloss U-shaped cabinetry', category: 'material', quantity: 1, unit: 'set', ratePerUnit: 160000, total: 160000 },
      { id: 'LI_D1_2', description: 'Premium white Quartz Countertop', category: 'material', quantity: 1, unit: 'set', ratePerUnit: 80000, total: 80000 },
      { id: 'LI_D1_3', description: 'Soft-close drawers and Hettich hardware fittings', category: 'material', quantity: 1, unit: 'package', ratePerUnit: 110000, total: 110000 },
      { id: 'LI_D1_4', description: 'Labor charges, installation, and chimney cutout setup', category: 'labor', quantity: 1, unit: 'package', ratePerUnit: 60000, total: 60000 }
    ],
    milestones: [
      { id: 'MS_D1_1', title: 'Design Approval & Base Carcass Delivery', description: 'Finalize 3D layout, procure and deliver marine plywood carcass boxes.', paymentPercentage: 30, paymentAmount: 123000, targetDays: 10 },
      { id: 'MS_D1_2', title: 'Carcass Assembly & Quartz Countertop Fitting', description: 'Assemble carcass modules and install quartz countertop template.', paymentPercentage: 40, paymentAmount: 164000, targetDays: 25 },
      { id: 'MS_D1_3', title: 'Shutters, Hinges & Hardware Setup', description: 'Mount acrylic shutters, fit drawer channels, and configure accessories.', paymentPercentage: 25, paymentAmount: 102500, targetDays: 35 },
      { id: 'MS_D1_4', title: 'Appliance Fitting, Cleaning & Handover', description: 'Install chimney and hob, do final adjustments, and clean site.', paymentPercentage: 5, paymentAmount: 20500, targetDays: 40 }
    ],
    validUntil,
    terms: 'Acrylic shutters, quartz countertop, Hettich soft-close hinges, 5-year cabinet warranty. Electrical/plumbing changes are charged at cost if outside original blueprints.',
    status: 'pending',
    submittedDate: new Date()
  };

  const quote2: ContractorQuote = {
    id: 'QUOTE_DEMO_002',
    projectId: projectId,
    contractorId: 'CONT003',
    contractorName: 'ModularKitchen Pro',
    contractorRating: 4.7,
    quotedAmount: 380000,
    timeline: '35 days',
    lineItems: [
      { id: 'LI_D2_1', description: 'German laminate cabinet shutters & carcasses', category: 'material', quantity: 1, unit: 'set', ratePerUnit: 220000, total: 220000 },
      { id: 'LI_D2_2', description: 'Polished Black Granite Countertop', category: 'material', quantity: 1, unit: 'set', ratePerUnit: 60000, total: 60000 },
      { id: 'LI_D2_3', description: 'Ebco soft-close hinges, accessories and labor installation', category: 'labor', quantity: 1, unit: 'package', ratePerUnit: 100000, total: 100000 }
    ],
    milestones: [
      { id: 'MS_D2_1', title: 'Design Approval & Procurement', description: 'Complete 3D blueprint approval and place order for factory-made units.', paymentPercentage: 40, paymentAmount: 152000, targetDays: 8 },
      { id: 'MS_D2_2', title: 'On-site Cabinets Assembly & Granite Fitting', description: 'Assemble factory boxes, fit drawers, and mount granite top.', paymentPercentage: 45, paymentAmount: 171000, targetDays: 25 },
      { id: 'MS_D2_3', title: 'Shutters Alignment, Polish & Handover', description: 'Align laminate shutters, clean countertop, and finalize modular setup.', paymentPercentage: 15, paymentAmount: 57000, targetDays: 35 }
    ],
    validUntil,
    terms: 'German laminate shutters, granite countertop, Ebco fittings, lifetime warranty on hinges. Basic plumbing connection included free.',
    status: 'pending',
    submittedDate: new Date()
  };

  mockRequirements.push(newRequirement);
  mockQuotes.push(quote1, quote2);

  // Save changes to localStorage
  saveRequirementsToStorage();
  saveQuotesToStorage();
  saveProjectsToStorage();
  saveEscrowToStorage();

  return { success: true, projectId };
};
