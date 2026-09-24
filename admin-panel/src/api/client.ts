import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PRO_API_URL || 'https://visvasahomebackend.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach admin token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('visvasa_admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('visvasa_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AdminApi = {
  // ── Auth ──────────────────────────────────────────────────────────
  login: async (email: string, password: string) =>
    api.post('/api/v1/admin/auth/login', { email, password }),

  // ── Dashboard ─────────────────────────────────────────────────────
  getAnalytics: async () => api.get('/api/v1/admin/analytics'),
  getLiveDashboard: async () => api.get('/api/v1/admin/dashboard/live'),
  getPendingKyc: async () => api.get('/api/v1/admin/kyc-pending'),
  generateTestLead: async (data: any = {}) => api.post('/api/v1/admin/generate-lead', data),

  // ── Partners / Professionals ──────────────────────────────────────
  getPartners: async () => api.get('/api/v1/admin/partners'),
  updatePartnerStatus: async (id: string, status?: string, kyc_status?: string) =>
    api.patch(`/api/v1/admin/partners/${id}/status`, { status, kyc_status }),
  approveKyc: async (id: string, action: 'approve' | 'reject') =>
    api.patch(`/api/v1/admin/kyc-approve/${id}`, { action }),

  // ── Customers ─────────────────────────────────────────────────────
  getCustomers: async () => api.get('/api/v1/admin/customers'),

  // ── Bookings / Jobs ───────────────────────────────────────────────
  getJobs: async () => api.get('/api/v1/admin/jobs'),
  updateJobStatus: async (id: string, status: string) =>
    api.patch(`/api/v1/admin/jobs/${id}/status`, { status }),
  getAvailablePartners: async () => api.get('/api/v1/admin/partners/available'),
  assignPartner: async (bookingId: string, partnerId: string) =>
    api.post(`/api/v1/admin/bookings/${bookingId}/assign`, { partnerId }),
  createBooking: async (data: any) =>
    api.post('/api/v1/admin/bookings', data),

  // ── Payments ──────────────────────────────────────────────────────
  getPayments: async () => api.get('/api/v1/admin/payments'),

  // ── Reviews ───────────────────────────────────────────────────────
  getReviews: async () => api.get('/api/v1/admin/reviews'),

  // ── Notifications / Broadcast ─────────────────────────────────────
  sendNotification: async (title: string, body: string, target: string = 'all') =>
    api.post('/api/v1/admin/notifications/send', { title, body, target }),

  // ── Support Tickets ───────────────────────────────────────────────
  getSupportTickets: async () => api.get('/api/v1/admin/support-tickets'),
  updateTicket: async (id: string, status: string) =>
    api.patch(`/api/v1/admin/support-tickets/${id}`, { status }),
};

export default api;
