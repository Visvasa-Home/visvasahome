// Booking Service - Frontend storage with localStorage
// Ready to migrate to Supabase when connected
import { awardBookingPoints, completeReferral } from '@customer/services/loyaltyService';

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  serviceType: string;
  serviceName: string;
  servicePrice: string;
  scheduledDate: string;
  scheduledTime: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  status: 'pending' | 'confirmed' | 'assigned' | 'enroute' | 'arrived' | 'in-progress' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'online' | 'cash' | 'card';
  paymentId?: string;
  professionalId?: string;
  professionalName?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  startOTP?: string;
  completeOTP?: string;
}

export interface ServiceAddress {
  id: string;
  userId: string;
  label: string; // 'Home', 'Office', 'Other'
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

const initialBookings: Booking[] = [
  {
    id: 'BK10247',
    userId: 'demo-user',
    userName: 'Rajesh Kumar',
    userPhone: '+91-9876543210',
    userEmail: 'rajesh@email.com',
    serviceType: 'plumbing',
    serviceName: 'Plumbing - Tap & Mixer Repair',
    servicePrice: '499',
    scheduledDate: '14 May 2026',
    scheduledTime: '10:30 AM',
    address: {
      line1: '123 MG Road',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001'
    },
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'online',
    paymentId: 'pay_online_123',
    professionalId: 'PRO10234',
    professionalName: 'Amit Sharma',
    createdAt: new Date('2026-05-12T10:00:00Z').toISOString(),
    updatedAt: new Date('2026-05-12T11:00:00Z').toISOString()
  },
  {
    id: 'BK10246',
    userId: 'demo-user',
    userName: 'Priya Singh',
    userPhone: '+91-9876543211',
    userEmail: 'priya@email.com',
    serviceType: 'cleaning',
    serviceName: 'Cleaning - Deep Cleaning',
    servicePrice: '2499',
    scheduledDate: '12 May 2026',
    scheduledTime: '02:00 PM',
    address: {
      line1: '456 Malviya Nagar',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302017'
    },
    status: 'in-progress',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    professionalId: 'PRO10235',
    professionalName: 'Meera Patel',
    createdAt: new Date('2026-05-12T13:30:00Z').toISOString(),
    updatedAt: new Date('2026-05-12T13:30:00Z').toISOString()
  },
  {
    id: 'BK10245',
    userId: 'demo-user',
    userName: 'Arjun Verma',
    userPhone: '+91-9876543212',
    userEmail: 'arjun@email.com',
    serviceType: 'ac',
    serviceName: 'AC Service - Split AC',
    servicePrice: '599',
    scheduledDate: '13 June 2026',
    scheduledTime: '11:00 AM',
    address: {
      line1: '789 Vaishali Nagar',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302021'
    },
    status: 'confirmed',
    paymentStatus: 'pending',
    paymentMethod: 'online',
    professionalId: 'PRO10236',
    professionalName: 'Ravi Kumar',
    createdAt: new Date('2026-05-12T09:00:00Z').toISOString(),
    updatedAt: new Date('2026-05-12T09:00:00Z').toISOString()
  },
  {
    id: 'BK10244',
    userId: 'demo-user',
    userName: 'Sneha Reddy',
    userPhone: '+91-9876543213',
    userEmail: 'sneha@email.com',
    serviceType: 'ac',
    serviceName: 'AC Service - Regular Service',
    servicePrice: '349',
    scheduledDate: '11 May 2026',
    scheduledTime: '03:30 PM',
    address: {
      line1: '321 C-Scheme',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001'
    },
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'card',
    paymentId: 'pay_card_456',
    professionalId: 'PRO10236',
    professionalName: 'Ravi Kumar',
    createdAt: new Date('2026-05-11T14:00:00Z').toISOString(),
    updatedAt: new Date('2026-05-11T16:00:00Z').toISOString()
  },
  {
    id: 'BK10243',
    userId: 'demo-user',
    userName: 'Vikram Joshi',
    userPhone: '+91-9876543214',
    userEmail: 'vikram@email.com',
    serviceType: 'electrical',
    serviceName: 'Electrical - Wiring Work',
    servicePrice: '2999',
    scheduledDate: '11 May 2026',
    scheduledTime: '09:00 AM',
    address: {
      line1: '654 Mansarovar',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302020'
    },
    status: 'cancelled',
    paymentStatus: 'refunded',
    paymentMethod: 'online',
    paymentId: 'pay_refund_789',
    professionalId: 'PRO10238',
    professionalName: 'Suresh Yadav',
    createdAt: new Date('2026-05-11T08:00:00Z').toISOString(),
    updatedAt: new Date('2026-05-11T08:30:00Z').toISOString()
  }
];

class BookingServiceClass {
  private BOOKING_KEY = 'visvasahome_bookings';
  private ADDRESS_KEY = 'visvasahome_addresses';

  // Generate unique ID
  private generateId(): string {
    return `BK${Math.floor(10000 + Math.random() * 90000)}`;
  }

  // Bookings
  createBooking(booking: Partial<Booking> & {
    userId: string;
    userName: string;
    userPhone: string;
    serviceType: string;
    serviceName: string;
    servicePrice: string;
    scheduledDate: string;
    scheduledTime: string;
    address: Booking['address'];
  }): Booking {
    const newBooking: Booking = {
      id: booking.id || this.generateId(),
      status: booking.status || 'pending',
      paymentStatus: booking.paymentStatus || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startOTP: booking.startOTP || Math.floor(1000 + Math.random() * 9000).toString(),
      completeOTP: booking.completeOTP || Math.floor(1000 + Math.random() * 9000).toString(),
      ...booking,
    } as Booking;

    const bookings = this.getAllBookings();
    bookings.unshift(newBooking); // Add new booking to top of list
    localStorage.setItem(this.BOOKING_KEY, JSON.stringify(bookings));

    return newBooking;
  }

  getAllBookings(): Booking[] {
    const data = localStorage.getItem(this.BOOKING_KEY);
    if (!data) {
      localStorage.setItem(this.BOOKING_KEY, JSON.stringify(initialBookings));
      return initialBookings;
    }
    return JSON.parse(data);
  }

  getUserBookings(userId: string): Booking[] {
    return this.getAllBookings().filter(b => b.userId === userId);
  }

  getBookingById(id: string): Booking | null {
    const bookings = this.getAllBookings();
    return bookings.find(b => b.id === id) || null;
  }

  updateBookingStatus(id: string, status: Booking['status']): boolean {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(b => b.id === id);

    if (index === -1) return false;

    const oldStatus = bookings[index].status;
    bookings[index].status = status;
    bookings[index].updatedAt = new Date().toISOString();
    localStorage.setItem(this.BOOKING_KEY, JSON.stringify(bookings));

    // If status transitions to 'completed', award loyalty points and complete referrals
    if (status === 'completed' && oldStatus !== 'completed') {
      const booking = bookings[index];
      const amount = parseFloat(booking.servicePrice) || 0;
      awardBookingPoints(booking.userId, booking.id, amount)
        .then(() => completeReferral(booking.userId))
        .then((res) => {
          if (res.success) {
            console.log(`[LOYALTY] Referral successfully completed and rewarded for user: ${booking.userId}`);
          }
        })
        .catch(err => {
          console.error('[LOYALTY] Error awarding points / completing referral:', err);
        });
    }

    return true;
  }

  updatePaymentStatus(id: string, paymentStatus: Booking['paymentStatus'], paymentId?: string): boolean {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(b => b.id === id);

    if (index === -1) return false;

    bookings[index].paymentStatus = paymentStatus;
    if (paymentId) bookings[index].paymentId = paymentId;
    bookings[index].updatedAt = new Date().toISOString();
    localStorage.setItem(this.BOOKING_KEY, JSON.stringify(bookings));

    return true;
  }

  rescheduleBooking(id: string, date: string, time: string): boolean {
    const bookings = this.getAllBookings();
    const index = bookings.findIndex(b => b.id === id);

    if (index === -1) return false;

    bookings[index].scheduledDate = date;
    bookings[index].scheduledTime = time;
    bookings[index].updatedAt = new Date().toISOString();
    localStorage.setItem(this.BOOKING_KEY, JSON.stringify(bookings));

    return true;
  }

  cancelBooking(id: string): boolean {
    return this.updateBookingStatus(id, 'cancelled');
  }

  // Addresses
  saveAddress(address: Omit<ServiceAddress, 'id'>): ServiceAddress {
    const newAddress: ServiceAddress = {
      ...address,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const addresses = this.getAllAddresses();

    // If this is the first address or marked as default, make it default
    if (addresses.length === 0 || newAddress.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }

    addresses.push(newAddress);
    localStorage.setItem(this.ADDRESS_KEY, JSON.stringify(addresses));

    return newAddress;
  }

  getAllAddresses(): ServiceAddress[] {
    const data = localStorage.getItem(this.ADDRESS_KEY);
    if (!data) {
      const defaultAddresses: ServiceAddress[] = [
        {
          id: 'addr-1',
          userId: 'demo-user',
          label: 'Home',
          line1: '123 MG Road, Vaishali Nagar, Jaipur',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302001',
          isDefault: true
        },
        {
          id: 'addr-2',
          userId: 'demo-user',
          label: 'Office',
          line1: '456 IT Park, Malviya Nagar, Jaipur',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302017',
          isDefault: false
        }
      ];
      localStorage.setItem(this.ADDRESS_KEY, JSON.stringify(defaultAddresses));
      return defaultAddresses;
    }
    return JSON.parse(data);
  }

  getUserAddresses(userId: string): ServiceAddress[] {
    return this.getAllAddresses().filter(a => a.userId === userId);
  }

  getDefaultAddress(userId: string): ServiceAddress | null {
    const addresses = this.getUserAddresses(userId);
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  }

  setDefaultAddress(id: string, userId: string): boolean {
    const addresses = this.getAllAddresses();

    // Remove default from all user addresses
    addresses.forEach(addr => {
      if (addr.userId === userId) {
        addr.isDefault = false;
      }
    });

    // Set new default
    const index = addresses.findIndex(a => a.id === id);
    if (index === -1) return false;

    addresses[index].isDefault = true;
    localStorage.setItem(this.ADDRESS_KEY, JSON.stringify(addresses));

    return true;
  }

  deleteAddress(id: string): boolean {
    const addresses = this.getAllAddresses();
    const filtered = addresses.filter(a => a.id !== id);

    if (filtered.length === addresses.length) return false;

    localStorage.setItem(this.ADDRESS_KEY, JSON.stringify(filtered));
    return true;
  }

  // Statistics
  getBookingStats(userId: string) {
    const bookings = this.getUserBookings(userId);

    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      inProgress: bookings.filter(b => b.status === 'in-progress').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
  }
}

export const BookingService = new BookingServiceClass();
