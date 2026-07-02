import { supabase, User, Professional, Service, Address, Booking, Review, Message, Notification, SavedService, isSupabaseConfigured } from './supabaseClient';

// ============================================================================
// USERS
// ============================================================================

const USERS_DB_KEY = 'visvasahome_db_users';

const getLocalUsers = (): User[] => {
  const data = localStorage.getItem(USERS_DB_KEY);
  if (!data) {
    const defaultUsers: User[] = [
      {
        id: 'CUST-DEMO-001',
        phone: '+919876543210',
        name: 'Rajesh Kumar',
        email: 'rajesh@email.com',
        role: 'customer',
        created_at: new Date('2026-05-12T10:00:00Z').toISOString(),
        updated_at: new Date('2026-05-12T10:00:00Z').toISOString()
      },
      {
        id: 'CUST-DEMO-002',
        phone: '+919876543211',
        name: 'Priya Singh',
        email: 'priya@email.com',
        role: 'customer',
        created_at: new Date('2026-05-12T10:00:00Z').toISOString(),
        updated_at: new Date('2026-05-12T10:00:00Z').toISOString()
      },
      {
        id: 'CUST-DEMO-003',
        phone: '+919876543212',
        name: 'Arjun Verma',
        email: 'arjun@email.com',
        role: 'customer',
        created_at: new Date('2026-05-12T10:00:00Z').toISOString(),
        updated_at: new Date('2026-05-12T10:00:00Z').toISOString()
      },
      {
        id: 'CUST-DEMO-004',
        phone: '+919876543213',
        name: 'Sneha Reddy',
        email: 'sneha@email.com',
        role: 'customer',
        created_at: new Date('2026-05-11T10:00:00Z').toISOString(),
        updated_at: new Date('2026-05-11T10:00:00Z').toISOString()
      },
      {
        id: 'CUST-DEMO-005',
        phone: '+919876543214',
        name: 'Vikram Joshi',
        email: 'vikram@email.com',
        role: 'customer',
        created_at: new Date('2026-05-11T10:00:00Z').toISOString(),
        updated_at: new Date('2026-05-11T10:00:00Z').toISOString()
      }
    ];
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

const saveLocalUsers = (users: User[]) => {
  localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

export const getUser = async (userId: string): Promise<User | null> => {
  if (!isSupabaseConfigured) {
    const users = getLocalUsers();
    return users.find(u => u.id === userId) || null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }
  return data;
};

export const getUserByPhone = async (phone: string): Promise<User | null> => {
  if (!isSupabaseConfigured) {
    const users = getLocalUsers();
    // Normalize phone numbers for matching
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    return users.find(u => u.phone.replace(/[^\d+]/g, '') === cleanPhone) || null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error) {
    console.error('Error fetching user by phone:', error);
    return null;
  }
  return data;
};

export const createUser = async (userData: Partial<User>): Promise<User | null> => {
  if (!isSupabaseConfigured) {
    const users = getLocalUsers();
    const newId = userData.id || `CUST-${Math.floor(100000 + Math.random() * 900000)}`;
    const newUser: User = {
      id: newId,
      phone: userData.phone || '',
      email: userData.email || '',
      name: userData.name || 'Valued Customer',
      role: userData.role || 'customer',
      profile_image: userData.profile_image || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    users.push(newUser);
    saveLocalUsers(users);
    return newUser;
  }

  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }
  return data;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  if (!isSupabaseConfigured) {
    const users = getLocalUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) return null;
    const updatedUser = {
      ...users[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    users[index] = updatedUser;
    saveLocalUsers(users);
    return updatedUser;
  }

  const { data, error } = await supabase
    .from('users')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }
  return data;
};

// ============================================================================
// PROFESSIONALS
// ============================================================================

export const getProfessional = async (professionalId: string): Promise<Professional | null> => {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('id', professionalId)
    .single();

  if (error) {
    console.error('Error fetching professional:', error);
    return null;
  }
  return data;
};

export const getProfessionalByUserId = async (userId: string): Promise<Professional | null> => {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching professional by user ID:', error);
    return null;
  }
  return data;
};

export const getAllProfessionals = async (filters?: {
  category?: string;
  status?: string;
}): Promise<Professional[]> => {
  let query = supabase.from('professionals').select('*');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching professionals:', error);
    return [];
  }
  return data || [];
};

export const createProfessional = async (professionalData: Partial<Professional>): Promise<Professional | null> => {
  const { data, error } = await supabase
    .from('professionals')
    .insert([professionalData])
    .select()
    .single();

  if (error) {
    console.error('Error creating professional:', error);
    return null;
  }
  return data;
};

export const updateProfessional = async (professionalId: string, updates: Partial<Professional>): Promise<Professional | null> => {
  const { data, error } = await supabase
    .from('professionals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', professionalId)
    .select()
    .single();

  if (error) {
    console.error('Error updating professional:', error);
    return null;
  }
  return data;
};

// ============================================================================
// SERVICES
// ============================================================================

export const getService = async (serviceId: string): Promise<Service | null> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    return null;
  }
  return data;
};

export const getAllServices = async (filters?: {
  category?: string;
  popular?: boolean;
}): Promise<Service[]> => {
  let query = supabase.from('services').select('*');

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.popular !== undefined) {
    query = query.eq('popular', filters.popular);
  }

  const { data, error } = await query.eq('status', 'active').order('name');

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }
  return data || [];
};

export const createService = async (serviceData: Partial<Service>): Promise<Service | null> => {
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    return null;
  }
  return data;
};

export const updateService = async (serviceId: string, updates: Partial<Service>): Promise<Service | null> => {
  const { data, error } = await supabase
    .from('services')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', serviceId)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    return null;
  }
  return data;
};

export const deleteService = async (serviceId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', serviceId);

  if (error) {
    console.error('Error deleting service:', error);
    return false;
  }
  return true;
};

// ============================================================================
// ADDRESSES
// ============================================================================

export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
  return data || [];
};

export const createAddress = async (addressData: Partial<Address>): Promise<Address | null> => {
  const { data, error } = await supabase
    .from('addresses')
    .insert([addressData])
    .select()
    .single();

  if (error) {
    console.error('Error creating address:', error);
    return null;
  }
  return data;
};

export const updateAddress = async (addressId: string, updates: Partial<Address>): Promise<Address | null> => {
  const { data, error } = await supabase
    .from('addresses')
    .update(updates)
    .eq('id', addressId)
    .select()
    .single();

  if (error) {
    console.error('Error updating address:', error);
    return null;
  }
  return data;
};

export const deleteAddress = async (addressId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('addresses')
    .delete()
    .eq('id', addressId);

  if (error) {
    console.error('Error deleting address:', error);
    return false;
  }
  return true;
};

// ============================================================================
// BOOKINGS
// ============================================================================

export const getBooking = async (bookingId: string): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
  return data;
};

export const getUserBookings = async (userId: string, role: 'customer' | 'professional'): Promise<Booking[]> => {
  const column = role === 'customer' ? 'customer_id' : 'professional_id';

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq(column, userId)
    .order('scheduled_date', { ascending: false });

  if (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
  return data || [];
};

export const getAllBookings = async (filters?: {
  status?: string;
  date?: string;
}): Promise<Booking[]> => {
  let query = supabase.from('bookings').select('*');

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.date) {
    query = query.eq('scheduled_date', filters.date);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  return data || [];
};

export const createBooking = async (bookingData: Partial<Booking>): Promise<Booking | null> => {
  // Generate booking number
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });

  const bookingNumber = `BK${String((count || 0) + 10001).padStart(5, '0')}`;

  const { data, error } = await supabase
    .from('bookings')
    .insert([{ ...bookingData, booking_number: bookingNumber }])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }
  return data;
};

export const updateBooking = async (bookingId: string, updates: Partial<Booking>): Promise<Booking | null> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    return null;
  }
  return data;
};

// ============================================================================
// REVIEWS
// ============================================================================

export const getReviewsByProfessional = async (professionalId: string): Promise<Review[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('professional_id', professionalId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
  return data || [];
};

export const getReviewByBooking = async (bookingId: string): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error) {
    console.error('Error fetching review:', error);
    return null;
  }
  return data;
};

export const createReview = async (reviewData: Partial<Review>): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([reviewData])
    .select()
    .single();

  if (error) {
    console.error('Error creating review:', error);
    return null;
  }
  return data;
};

export const updateReview = async (reviewId: string, updates: Partial<Review>): Promise<Review | null> => {
  const { data, error } = await supabase
    .from('reviews')
    .update(updates)
    .eq('id', reviewId)
    .select()
    .single();

  if (error) {
    console.error('Error updating review:', error);
    return null;
  }
  return data;
};

// ============================================================================
// MESSAGES
// ============================================================================

export const getBookingMessages = async (bookingId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data || [];
};

export const createMessage = async (messageData: Partial<Message>): Promise<Message | null> => {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single();

  if (error) {
    console.error('Error creating message:', error);
    return null;
  }
  return data;
};

export const markMessageAsRead = async (messageId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', messageId);

  if (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
  return true;
};

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  return data || [];
};

export const createNotification = async (notificationData: Partial<Notification>): Promise<Notification | null> => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notificationData])
    .select()
    .single();

  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }
  return data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return false;
  }
  return true;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);

  if (error) {
    console.error('Error marking all notifications as read:', error);
    return false;
  }
  return true;
};

// ============================================================================
// SAVED SERVICES
// ============================================================================

export const getSavedServices = async (userId: string): Promise<SavedService[]> => {
  const { data, error } = await supabase
    .from('saved_services')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved services:', error);
    return [];
  }
  return data || [];
};

export const saveService = async (userId: string, serviceId: string): Promise<SavedService | null> => {
  const { data, error } = await supabase
    .from('saved_services')
    .insert([{ user_id: userId, service_id: serviceId }])
    .select()
    .single();

  if (error) {
    console.error('Error saving service:', error);
    return null;
  }
  return data;
};

export const unsaveService = async (userId: string, serviceId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('saved_services')
    .delete()
    .eq('user_id', userId)
    .eq('service_id', serviceId);

  if (error) {
    console.error('Error unsaving service:', error);
    return false;
  }
  return true;
};

// ============================================================================
// ANALYTICS & STATS
// ============================================================================

export const getAdminStats = async () => {
  const [bookingsCount, professionalsCount, customersCount] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('professionals').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
  ]);

  const { data: revenueData } = await supabase
    .from('bookings')
    .select('amount')
    .eq('payment_status', 'paid');

  const totalRevenue = revenueData?.reduce((sum, booking) => sum + booking.amount, 0) || 0;

  return {
    totalBookings: bookingsCount.count || 0,
    activeProfessionals: professionalsCount.count || 0,
    totalCustomers: customersCount.count || 0,
    totalRevenue,
  };
};

export const getTopProfessionals = async (limit: number = 10): Promise<Professional[]> => {
  const { data, error } = await supabase
    .from('professionals')
    .select('*')
    .eq('status', 'active')
    .order('rating', { ascending: false })
    .order('total_jobs', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching top professionals:', error);
    return [];
  }
  return data || [];
};
