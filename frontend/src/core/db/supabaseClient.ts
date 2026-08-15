import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Check if Supabase is properly configured
const isConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

// Only create client if properly configured, otherwise use a mock
let supabaseInstance: SupabaseClient;

if (isConfigured) {
  supabaseInstance = createClient(
    import.meta.env.VITE_SUPABASE_URL!, 
    import.meta.env.VITE_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  );
} else {
  // Create a minimal mock client that won't trigger GoTrueClient warnings
  supabaseInstance = {
    auth: {
      getSession: async () => {
        const token = localStorage.getItem('visvasahome_admin_token');
        const email = localStorage.getItem('visvasahome_admin_email') || 'admin@visvasahome.com';
        const role = localStorage.getItem('visvasahome_admin_role') || 'super_admin';
        const name = localStorage.getItem('visvasahome_admin_name') || 'System Admin';
        const id = localStorage.getItem('visvasahome_admin_id') || `mock-${role}`;
        if (token) {
          return {
            data: {
              session: {
                access_token: token,
                user: { id, email, user_metadata: { role, full_name: name } }
              }
            },
            error: null
          };
        }
        return { data: { session: null }, error: null };
      },
      getUser: async () => {
        const token = localStorage.getItem('visvasahome_admin_token');
        const email = localStorage.getItem('visvasahome_admin_email') || 'admin@visvasahome.com';
        const role = localStorage.getItem('visvasahome_admin_role') || 'super_admin';
        const name = localStorage.getItem('visvasahome_admin_name') || 'System Admin';
        const id = localStorage.getItem('visvasahome_admin_id') || `mock-${role}`;
        if (token) {
          return {
            data: {
              user: { id, email, user_metadata: { role, full_name: name } }
            },
            error: null
          };
        }
        return { data: { user: null }, error: null };
      },
      signInWithPassword: async ({ email, password }: any) => {
        // mock auth matching the roles
        if (email === 'admin@visvasahome.com' && password === 'admin123') {
          return {
            data: {
              session: { access_token: 'mock-token-super_admin' },
              user: { id: 'mock-super-admin', email, user_metadata: { role: 'super_admin', full_name: 'System Admin' } }
            },
            error: null
          };
        }
        if (email === 'ops@visvasahome.com' && password === 'ops123') {
          return {
            data: {
              session: { access_token: 'mock-token-operations_manager' },
              user: { id: 'mock-ops-manager', email, user_metadata: { role: 'operations_manager', full_name: 'Operations Manager' } }
            },
            error: null
          };
        }
        if (email === 'support@visvasahome.com' && password === 'support123') {
          return {
            data: {
              session: { access_token: 'mock-token-support_agent' },
              user: { id: 'mock-support-agent', email, user_metadata: { role: 'support_agent', full_name: 'Support Agent' } }
            },
            error: null
          };
        }
        return { data: { session: null, user: null }, error: { message: 'Invalid credentials' } };
      },
      signInWithOtp: async () => ({ data: {}, error: null }),
      verifyOtp: async () => ({ data: { session: null, user: null }, error: null }),
      signOut: async () => {
        localStorage.removeItem('visvasahome_admin_token');
        localStorage.removeItem('visvasahome_admin_email');
        localStorage.removeItem('visvasahome_admin_role');
        localStorage.removeItem('visvasahome_admin_name');
        localStorage.removeItem('visvasahome_admin_id');
        return { error: null };
      },
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: (table: string) => ({
      select: (fields?: string) => {
        const mockRolePermissions = [
          {
            role: 'super_admin',
            allowed_sections: ['dashboard', 'bookings', 'professionals', 'customers', 'services', 'payments', 'reviews', 'notifications', 'reports', 'settings', 'messages'],
            can_write: true
          },
          {
            role: 'operations_manager',
            allowed_sections: ['dashboard', 'bookings', 'professionals', 'customers', 'services', 'reviews', 'messages'],
            can_write: true
          },
          {
            role: 'support_agent',
            allowed_sections: ['dashboard', 'bookings', 'customers', 'reviews', 'messages'],
            can_write: false
          }
        ];

        const queryChain = {
          eq: (field: string, val: any) => {
            const singleChain = {
              single: async () => {
                if (table === 'admins') {
                  const email = localStorage.getItem('visvasahome_admin_email') || 'admin@visvasahome.com';
                  const role = localStorage.getItem('visvasahome_admin_role') || 'super_admin';
                  const name = localStorage.getItem('visvasahome_admin_name') || 'System Admin';
                  const id = localStorage.getItem('visvasahome_admin_id') || `mock-${role}`;
                  return {
                    data: {
                      id,
                      auth_user_id: id,
                      email,
                      full_name: name,
                      role,
                      is_active: true
                    },
                    error: null
                  };
                }
                if (table === 'role_permissions') {
                  const item = mockRolePermissions.find(p => p.role === val);
                  return { data: item || null, error: item ? null : { message: 'Not found' } };
                }
                return { data: null, error: { message: 'Not found' } };
              },
              then: (resolve: any) => {
                if (table === 'role_permissions') {
                  const items = mockRolePermissions.filter(p => p[field as keyof typeof p] === val);
                  resolve({ data: items, error: null });
                } else {
                  resolve({ data: [], error: null });
                }
              }
            };
            return singleChain;
          },
          single: async () => {
            if (table === 'admins') {
              const email = localStorage.getItem('visvasahome_admin_email') || 'admin@visvasahome.com';
              const role = localStorage.getItem('visvasahome_admin_role') || 'super_admin';
              const name = localStorage.getItem('visvasahome_admin_name') || 'System Admin';
              const id = localStorage.getItem('visvasahome_admin_id') || `mock-${role}`;
              return {
                data: {
                  id,
                  auth_user_id: id,
                  email,
                  full_name: name,
                  role,
                  is_active: true
                },
                error: null
              };
            }
            if (table === 'role_permissions') {
              const role = localStorage.getItem('visvasahome_admin_role') || 'super_admin';
              const item = mockRolePermissions.find(p => p.role === role);
              return { data: item || null, error: null };
            }
            return { data: null, error: { message: 'Not found' } };
          },
          then: (resolve: any) => {
            if (table === 'role_permissions') {
              resolve({ data: mockRolePermissions, error: null });
            } else {
              resolve({ data: [], error: null });
            }
          }
        };
        return queryChain;
      },
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null })
    })
  } as any;
}

export const supabase: SupabaseClient = supabaseInstance;

export const isSupabaseConfigured = isConfigured;

// Type definitions for database tables
export interface User {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  role: 'customer' | 'professional' | 'admin';
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: string;
  user_id: string;
  category: string;
  skills: string[];
  experience_years?: number;
  location?: string;
  rating: number;
  total_jobs: number;
  completion_rate: number;
  total_revenue: number;
  status: 'pending' | 'active' | 'suspended';
  verified: boolean;
  verification_documents?: any;
  joined_date: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  description?: string;
  price_starting: number;
  duration_min?: number;
  warranty_days?: number;
  status: string;
  popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label?: string;
  full_address: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  is_default: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  customer_id: string;
  professional_id?: string;
  service_id?: string;
  service_name: string;
  address_id?: string;
  full_address: string;
  scheduled_date: string;
  scheduled_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  payment_method?: string;
  payment_id?: string;
  notes?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  booking_id: string;
  customer_id: string;
  professional_id: string;
  rating: number;
  review_text?: string;
  images?: string[];
  reply_text?: string;
  reply_date?: string;
  created_at: string;
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  is_read: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface SavedService {
  id: string;
  user_id: string;
  service_id: string;
  created_at: string;
}