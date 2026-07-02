// Service Professional Job Management Service
// Handles job assignments, acceptance, completion, and earnings
import { BookingService, Booking } from '@booking/services/bookingService';


export interface SPJob {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLocation: { lat: number; lng: number };
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  scheduledTime: Date;
  status: 'pending' | 'accepted' | 'declined' | 'enroute' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';
  startOTP: string;
  completeOTP: string;
  startTime?: Date;
  completeTime?: Date;
  beforePhotos?: string[];
  afterPhotos?: string[];
  invoiceUrl?: string;
  earnings: number;
  commission: number;
  rating?: number;
  review?: string;
  createdAt: Date;
  expiresAt: Date; // 30 seconds from creation for accept/decline
}

export interface SPEarnings {
  today: number;
  week: number;
  month: number;
  total: number;
  pendingPayout: number;
  completedJobs: number;
  averageRating: number;
}

export interface SPAvailability {
  id: string;
  spId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isBlocked: boolean;
  blockedDates?: string[]; // ISO date strings
}

// Mock data for demonstration
const mockJobs: SPJob[] = [
  {
    id: 'JOB001',
    customerId: 'CUST001',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 98765 43210',
    customerAddress: '123, MG Road, Koramangala, Bangalore - 560034',
    customerLocation: { lat: 12.9352, lng: 77.6245 },
    serviceId: 'SRV001',
    serviceName: 'AC Service & Repair',
    serviceCategory: 'AC & Appliance Repair',
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    status: 'pending',
    startOTP: '1234',
    completeOTP: '5678',
    earnings: 450,
    commission: 90,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 1000) // 30 seconds from now
  },
  {
    id: 'JOB002',
    customerId: 'CUST002',
    customerName: 'Priya Sharma',
    customerPhone: '+91 87654 32109',
    customerAddress: '45, Indiranagar, Bangalore - 560038',
    customerLocation: { lat: 12.9716, lng: 77.6412 },
    serviceId: 'SRV002',
    serviceName: 'Plumbing - Tap Repair',
    serviceCategory: 'Plumbing',
    scheduledTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    status: 'pending',
    startOTP: '2345',
    completeOTP: '6789',
    earnings: 300,
    commission: 60,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 1000)
  }
];

const mockCompletedJobs: SPJob[] = [
  {
    id: 'JOB003',
    customerId: 'CUST003',
    customerName: 'Amit Patel',
    customerPhone: '+91 76543 21098',
    customerAddress: '78, Whitefield, Bangalore - 560066',
    customerLocation: { lat: 12.9698, lng: 77.7500 },
    serviceId: 'SRV003',
    serviceName: 'Electrical Wiring',
    serviceCategory: 'Electrical',
    scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    status: 'completed',
    startOTP: '3456',
    completeOTP: '7890',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    completeTime: new Date(Date.now() - 22 * 60 * 60 * 1000),
    earnings: 800,
    commission: 160,
    rating: 5,
    review: 'Excellent work! Very professional.',
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() - 25 * 60 * 60 * 1000 + 30 * 1000)
  }
];

// Simulate database storage
// Helper to dynamically convert customer bookings to SPJobs
const getCombinedJobs = (): SPJob[] => {
  const bookings = BookingService.getAllBookings();
  const dynamicJobs = bookings
    .filter(b => b.status !== 'cancelled')
    .map(b => {
      const isCompleted = b.status === 'completed';
      
      const spJob: SPJob = {
        id: b.id,
        customerId: b.userId,
        customerName: b.userName,
        customerPhone: b.userPhone,
        customerAddress: b.address.line1 + ', ' + b.address.city,
        customerLocation: { lat: 26.8439, lng: 75.8242 },
        serviceId: 'SRV_DYNAMIC',
        serviceName: b.serviceName,
        serviceCategory: b.serviceType,
        scheduledTime: new Date(b.scheduledDate + ' ' + b.scheduledTime),
        status: b.status === 'confirmed' ? 'pending' : 
                (b.status === 'assigned' ? 'accepted' : 
                (b.status === 'enroute' ? 'enroute' : 
                (b.status === 'arrived' ? 'arrived' : 
                (b.status === 'in-progress' ? 'in-progress' : 
                (isCompleted ? 'completed' : 'pending'))))),
        startOTP: b.startOTP || '1234',
        completeOTP: b.completeOTP || '5678',
        earnings: parseFloat(b.servicePrice) || 500,
        commission: (parseFloat(b.servicePrice) || 500) * 0.20,
        createdAt: new Date(b.createdAt),
        expiresAt: new Date(new Date(b.createdAt).getTime() + 24 * 60 * 60 * 1000)
      };
      
      if (b.status === 'in-progress') {
        spJob.startTime = new Date(b.updatedAt);
      } else if (isCompleted) {
        spJob.startTime = new Date(b.createdAt);
        spJob.completeTime = new Date(b.updatedAt);
      }
      
      return spJob;
    });

  const dynamicIds = new Set(dynamicJobs.map(j => j.id));
  const uniqueMockJobs = mockJobs.filter(mj => !dynamicIds.has(mj.id));
  
  return [...dynamicJobs, ...uniqueMockJobs];
};

/**
 * Get all pending jobs for a service professional
 */
export const getPendingJobs = async (spId: string): Promise<SPJob[]> => {
  return getCombinedJobs().filter(job => job.status === 'pending');
};

/**
 * Get active jobs (accepted or in-progress)
 */
export const getActiveJobs = async (spId: string): Promise<SPJob[]> => {
  return getCombinedJobs().filter(job =>
    job.status === 'accepted' || job.status === 'in-progress'
  );
};

/**
 * Get completed jobs
 */
export const getCompletedJobs = async (spId: string): Promise<SPJob[]> => {
  return getCombinedJobs().filter(job => job.status === 'completed');
};

/**
 * Accept a job
 */
export const acceptJob = async (jobId: string, spId: string): Promise<{ success: boolean; job?: SPJob }> => {
  const partnerName = localStorage.getItem('visvasahome_partner_name') || 'Suresh Reddy (Verified)';
  
  const bookings = BookingService.getAllBookings();
  const idx = bookings.findIndex(b => b.id === jobId);
  if (idx !== -1) {
    bookings[idx].status = 'assigned';
    bookings[idx].professionalId = spId;
    bookings[idx].professionalName = partnerName;
    localStorage.setItem('visvasahome_bookings', JSON.stringify(bookings));
  }

  const job = getCombinedJobs().find(j => j.id === jobId);
  if (job) {
    job.status = 'accepted';
    return { success: true, job };
  }
  return { success: false };
};

/**
 * Decline a job
 */
export const declineJob = async (jobId: string, spId: string): Promise<{ success: boolean }> => {
  BookingService.updateBookingStatus(jobId, 'cancelled');
  return { success: true };
};

/**
 * Set job en-route
 */
export const setJobEnroute = async (jobId: string): Promise<{ success: boolean }> => {
  BookingService.updateBookingStatus(jobId, 'enroute');
  return { success: true };
};

/**
 * Set job arrived
 */
export const setJobArrived = async (jobId: string): Promise<{ success: boolean }> => {
  BookingService.updateBookingStatus(jobId, 'arrived');
  return { success: true };
};

/**
 * Start a job with OTP verification
 */
export const startJob = async (jobId: string, otp: string): Promise<{ success: boolean; message?: string }> => {
  const job = getCombinedJobs().find(j => j.id === jobId);

  if (!job) {
    return { success: false, message: 'Job not found' };
  }

  if (job.startOTP !== otp) {
    return { success: false, message: 'Invalid OTP' };
  }

  BookingService.updateBookingStatus(jobId, 'in-progress');
  return { success: true, message: 'Job started successfully' };
};

/**
 * Complete a job with OTP verification
 */
export const completeJob = async (
  jobId: string,
  otp: string,
  beforePhotos?: string[],
  afterPhotos?: string[]
): Promise<{ success: boolean; message?: string; invoiceUrl?: string }> => {
  const job = getCombinedJobs().find(j => j.id === jobId);

  if (!job) {
    return { success: false, message: 'Job not found' };
  }

  if (job.completeOTP !== otp) {
    return { success: false, message: 'Invalid OTP' };
  }

  BookingService.updateBookingStatus(jobId, 'completed');

  return {
    success: true,
    message: 'Job completed successfully',
    invoiceUrl: `/invoices/${jobId}.pdf`
  };
};

/**
 * Get earnings summary for SP
 */
export const getEarnings = async (spId: string): Promise<SPEarnings> => {
  const completed = getCombinedJobs().filter(j => j.status === 'completed');

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const todayJobs = completed.filter(j => j.completeTime && j.completeTime >= startOfToday);
  const weekJobs = completed.filter(j => j.completeTime && j.completeTime >= startOfWeek);
  const monthJobs = completed.filter(j => j.completeTime && j.completeTime >= startOfMonth);

  const todayEarnings = todayJobs.reduce((sum, j) => sum + (j.earnings - j.commission), 0);
  const weekEarnings = weekJobs.reduce((sum, j) => sum + (j.earnings - j.commission), 0);
  const monthEarnings = monthJobs.reduce((sum, j) => sum + (j.earnings - j.commission), 0);
  const totalEarnings = completed.reduce((sum, j) => sum + (j.earnings - j.commission), 0);

  const ratings = completed.filter(j => j.rating).map(j => j.rating!);
  const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  return {
    today: todayEarnings,
    week: weekEarnings,
    month: monthEarnings,
    total: totalEarnings,
    pendingPayout: monthEarnings,
    completedJobs: completed.length,
    averageRating: avgRating
  };
};

/**
 * Get SP availability schedule
 */
export const getAvailability = async (spId: string): Promise<SPAvailability[]> => {
  // Mock availability - SP available Mon-Fri 9AM-6PM
  return [
    { id: '1', spId, dayOfWeek: 1, startTime: '09:00', endTime: '18:00', isBlocked: false },
    { id: '2', spId, dayOfWeek: 2, startTime: '09:00', endTime: '18:00', isBlocked: false },
    { id: '3', spId, dayOfWeek: 3, startTime: '09:00', endTime: '18:00', isBlocked: false },
    { id: '4', spId, dayOfWeek: 4, startTime: '09:00', endTime: '18:00', isBlocked: false },
    { id: '5', spId, dayOfWeek: 5, startTime: '09:00', endTime: '18:00', isBlocked: false }
  ];
};

/**
 * Update SP availability
 */
export const updateAvailability = async (
  spId: string,
  availability: SPAvailability[]
): Promise<{ success: boolean }> => {
  // In production: update database
  return { success: true };
};

/**
 * Block specific dates
 */
export const blockDates = async (
  spId: string,
  dates: string[]
): Promise<{ success: boolean }> => {
  // In production: update blocked_dates in database
  return { success: true };
};

/**
 * Generate navigation URL for Google Maps
 */
export const getNavigationUrl = (location: { lat: number; lng: number }): string => {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
};

/**
 * Get a job by ID from either active or completed database
 */
export const getJobById = async (jobId: string): Promise<SPJob | null> => {
  const job = getCombinedJobs().find(j => j.id === jobId);
  return job || null;
};
