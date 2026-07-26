export type Role = 'customer' | 'professional' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string; // e.g., 'Home', 'Office'
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl?: string;
  parentCategoryId?: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  priceUnit: 'hourly' | 'fixed' | 'sqft';
  estimatedDurationMinutes: number;
  imageUrl?: string;
  tags: string[];
  features: string[];
}

export interface AMCPackage {
  id: string;
  name: string; // e.g., 'Essential', 'Premium'
  type: 'home' | 'office' | 'commercial';
  priceMonthly: number;
  priceYearly: number;
  servicesIncluded: string[]; // List of service IDs or descriptions
  visitsPerYear: number;
  features: string[];
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;
  customerId: string;
  professionalId?: string;
  serviceId: string;
  addressId: string;
  scheduledAt: string; // ISO DateTime
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractorProfile {
  id: string;
  userId: string;
  companyName?: string;
  bio?: string;
  verified: boolean;
  rating: number;
  completedJobs: number;
  skills: string[]; // List of category IDs
  serviceAreaRadiusKm: number;
  baseLocation: { lat: number; lng: number };
}
