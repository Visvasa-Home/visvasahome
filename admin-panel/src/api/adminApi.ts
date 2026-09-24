// ─── Admin API Client ─────────────────────────────────────────────────────────
// Typed fetch client for the VisvasaHome Admin Panel.
// Calls the API Gateway (port 3000) with admin JWT.

const API_GATEWAY = import.meta.env.VITE_API_URL || 'https://visvasahomebackend.onrender.com';

// Admin JWT is stored in localStorage after login
function getToken(): string {
  return localStorage.getItem('adminToken') || '';
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_GATEWAY}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Service {
  id: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  durationMinutes: number;
  description: string;
  imageUrl?: string;
  groupName?: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  categoryId?: string;
  categoryName?: string;
  userId: string;
  scheduledAt: string;
  address: string;
  price: number;
  status: string;
  createdAt: string;
  refund?: {
    status: string;
    amount: number;
    method: string;
    requestedAt: string;
    processedAt?: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  bookingId?: string;
  createdAt: string;
}

export interface DashboardStats {
  bookings: {
    total: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    revenue: number;
  };
}

// ─── API Methods ──────────────────────────────────────────────────────────────

// Categories
export const adminApi = {
  // ── Catalog ──────────────────────────────────────────────────────────────────

  getCategories(): Promise<{ categories: Category[] }> {
    return apiFetch('/api/homeservices/categories');
  },

  getServices(categoryId?: string): Promise<{ services: Service[] }> {
    const qs = categoryId ? `?categoryId=${categoryId}` : '';
    return apiFetch(`/api/homeservices/services${qs}`);
  },

  getService(id: string): Promise<{ service: Service }> {
    return apiFetch(`/api/homeservices/services/${id}`);
  },

  searchServices(q: string): Promise<{ results: Service[] }> {
    return apiFetch(`/api/homeservices/search?q=${encodeURIComponent(q)}`);
  },

  // ── Bookings ─────────────────────────────────────────────────────────────────

  getBookings(userId?: string): Promise<{ bookings: Booking[] }> {
    const qs = userId ? `?userId=${userId}` : '';
    return apiFetch(`/api/homeservices/bookings${qs}`);
  },

  getBookingStatus(id: string) {
    return apiFetch(`/api/homeservices/bookings/${id}/status`);
  },

  cancelBooking(id: string): Promise<{ booking: Booking }> {
    return apiFetch(`/api/homeservices/bookings/${id}/cancel`, { method: 'PATCH' });
  },

  getBookingStats(): Promise<{ total: number; confirmed: number; cancelled: number; completed: number; revenue: number }> {
    return apiFetch('/api/homeservices/stats');
  },

  // ── Wallet ───────────────────────────────────────────────────────────────────

  getWalletBalance(userId: string): Promise<{ balance: number; currency: string }> {
    return apiFetch(`/api/wallet/balance?userId=${userId}`);
  },

  getWalletTransactions(userId: string): Promise<{ transactions: WalletTransaction[]; total: number }> {
    return apiFetch(`/api/wallet/transactions?userId=${userId}`);
  },

  // ── Notifications ─────────────────────────────────────────────────────────────

  getNotifications(userId?: string): Promise<{ notifications: Notification[]; unreadCount: number }> {
    const qs = userId ? `?userId=${userId}` : '';
    return apiFetch(`/api/notifications${qs}`);
  },

  markNotificationRead(id: string) {
    return apiFetch(`/api/notifications/mark-read/${id}`, { method: 'POST' });
  },

  // ── Reviews ───────────────────────────────────────────────────────────────────

  getReviews(serviceId: string) {
    return apiFetch(`/api/reviews/${serviceId}`);
  },

  // ── Identity ──────────────────────────────────────────────────────────────────

  login(phone: string, otp: string): Promise<{ token: string; user: any }> {
    return apiFetch('/api/identity/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });
  },

  loginEmail(email: string): Promise<{ token: string; user: any }> {
    return apiFetch('/api/identity/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────────

  async getDashboardStats(): Promise<DashboardStats> {
    const bookings = await this.getBookingStats().catch(() => ({
      total: 0, confirmed: 0, cancelled: 0, completed: 0, revenue: 0
    }));
    return { bookings };
  },
};

export default adminApi;
