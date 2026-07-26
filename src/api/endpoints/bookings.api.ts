import { apiClient } from '../index';
import { Booking } from '../../domain/models';

export const BookingsApi = {
  createBooking: (bookingData: Partial<Booking>) => 
    apiClient.post<Booking>('/bookings', bookingData),
    
  getUserBookings: (userId: string) => 
    apiClient.get<Booking[]>(`/bookings`, { params: { customerId: userId } }),
    
  getBookingDetails: (bookingId: string) => 
    apiClient.get<Booking>(`/bookings/${bookingId}`),
    
  cancelBooking: (bookingId: string) => 
    apiClient.patch<Booking>(`/bookings/${bookingId}`, { status: 'cancelled' })
};
