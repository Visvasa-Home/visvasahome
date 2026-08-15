import { useState } from 'react';
import { ArrowLeft, Search, Users, Phone, Mail, MapPin, Calendar, DollarSign, Clock, ShieldAlert } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';
import { BookingService } from '@booking/services/bookingService';

interface AdminCustomersPageProps {
  onBack: () => void;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  joinedDate: string;
  deviceInfo: string;
  ipAddress: string;
  latLng: string;
}

export function AdminCustomersPage({ onBack }: AdminCustomersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Mock Customers Database
  const customers: Customer[] = [
    { id: 'CUS10001', name: 'Rajesh Kumar', phone: '+91-9876543210', email: 'rajesh@email.com', location: 'Jaipur', joinedDate: '2024-06-15', deviceInfo: 'Samsung Galaxy S24 (Android 14)', ipAddress: '192.168.1.104', latLng: '26.9124° N, 75.7873° E' },
    { id: 'CUS10002', name: 'Priya Singh', phone: '+91-9876543211', email: 'priya@email.com', location: 'Mumbai', joinedDate: '2024-08-22', deviceInfo: 'Apple iPhone 15 Pro (iOS 17)', ipAddress: '192.168.1.15', latLng: '19.0760° N, 72.8777° E' },
    { id: 'CUS10003', name: 'Arjun Verma', phone: '+91-9876543212', email: 'arjun@email.com', location: 'Delhi', joinedDate: '2024-05-10', deviceInfo: 'OnePlus 12 (Android 14)', ipAddress: '192.168.1.20', latLng: '28.7041° N, 77.1025° E' },
    { id: 'CUS10004', name: 'Sneha Reddy', phone: '+91-9876543213', email: 'sneha@email.com', location: 'Bengaluru', joinedDate: '2024-09-18', deviceInfo: 'Apple iPhone 14 (iOS 16)', ipAddress: '192.168.1.8', latLng: '12.9716° N, 77.5946° E' },
    { id: 'CUS10005', name: 'Vikram Joshi', phone: '+91-9876543214', email: 'vikram@email.com', location: 'Pune', joinedDate: '2024-11-05', deviceInfo: 'Google Pixel 8 (Android 14)', ipAddress: '192.168.1.12', latLng: '18.5204° N, 73.8567° E' },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Load actual customer bookings from booking database
  const getCustomerBookings = (phone: string) => {
    return BookingService.getAllBookings().filter(b => b.userPhone === phone);
  };

  const calculateTotalSpent = (phone: string) => {
    const list = getCustomerBookings(phone);
    const total = list
      .filter(b => b.paymentStatus === 'paid')
      .reduce((acc, curr) => acc + (parseInt(curr.servicePrice.replace(/[^\d]/g, '')) || 0), 0);
    return `₹${total.toLocaleString('en-IN')}`;
  };

  // Mock complaints count
  const getCustomerComplaints = (name: string) => {
    if (name === 'Rajesh Kumar') {
      return [
        { id: 'TCK-901', subject: 'Refund not received for cancelled plumbing job', status: 'open', date: '2026-06-12' }
      ];
    }
    if (name === 'Priya Singh') {
      return [
        { id: 'TCK-903', subject: 'Cleaning lady arrived late', status: 'resolved', date: '2026-06-11' }
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Customers</h1>
            <p className="text-sm text-gray-500">View customer profiles, dynamically loaded booking histories, and associated complaints log</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-4">
          {filteredCustomers.map((customer) => {
            const bookingsList = getCustomerBookings(customer.phone);
            return (
              <Card key={customer.id} className="p-6 hover:shadow-lg transition-shadow border border-gray-200 bg-white">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left Column: Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-xs">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{customer.name}</h3>
                      <p className="text-xs text-gray-400 mb-2">ID: {customer.id}</p>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span>{customer.phone}</span></div>
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span>{customer.email}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /><span>{customer.location}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: Stats */}
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
                      <p className="font-bold text-gray-900">{bookingsList.length} Bookings</p>
                      <p className="text-[10px] text-gray-400">All-time count</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                      <p className="font-bold text-green-600">{calculateTotalSpent(customer.phone)}</p>
                      <p className="text-[10px] text-gray-400">Paid transactions</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Member Since</p>
                      <p className="text-sm text-gray-700 font-semibold">{customer.joinedDate}</p>
                      <p className="text-[10px] text-gray-400">Registration date</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Active Complaints</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        {getCustomerComplaints(customer.name).length > 0 ? (
                          <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
                            {getCustomerComplaints(customer.name).length} Active
                          </Badge>
                        ) : (
                          <span className="text-gray-500">None</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCustomerId(customer.id)}
                      className="w-full text-xs font-semibold"
                    >
                      View Detail Profile
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedCustomerId(customer.id)}
                      className="w-full text-xs"
                    >
                      Booking History ({bookingsList.length})
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detail Drawer Modal */}
      {selectedCustomerId && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-end z-50">
          <Card className="w-full max-w-md h-full rounded-r-none rounded-l-2xl p-6 bg-white shadow-2xl overflow-y-auto flex flex-col relative border-l border-gray-200">
            <button
              onClick={() => setSelectedCustomerId(null)}
              className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700"
            >
              &times; Close
            </button>

            <div className="border-b border-gray-150 pb-4 mb-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h3>
                  <p className="text-xs text-gray-400">{selectedCustomer.id}</p>
                </div>
              </div>
            </div>

            {/* Signup details/Metadata */}
            <div className="space-y-4 mb-6">
              <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Signup Metadata</h4>
              <div className="space-y-2 text-xs bg-gray-50 p-4 rounded-xl border border-gray-150">
                <div className="flex justify-between">
                  <span className="text-gray-500">Device Model:</span>
                  <span className="font-semibold text-gray-800 text-right">{selectedCustomer.deviceInfo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">IP Address:</span>
                  <span className="font-mono font-semibold text-gray-850">{selectedCustomer.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Geo Coordinates:</span>
                  <span className="font-semibold text-gray-800">{selectedCustomer.latLng}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Registered On:</span>
                  <span className="font-semibold text-gray-800">{selectedCustomer.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Booking History */}
            <div className="space-y-3 mb-6">
              <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Booking Logs</h4>
              <div className="space-y-2">
                {getCustomerBookings(selectedCustomer.phone).length === 0 ? (
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg text-center">No bookings placed by this user yet.</p>
                ) : (
                  getCustomerBookings(selectedCustomer.phone).map(b => (
                    <div key={b.id} className="p-3 border border-gray-100 bg-gray-50/50 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900">{b.serviceName}</p>
                        <p className="text-[10px] text-gray-400">{b.id} &bull; {b.scheduledDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{b.servicePrice}</p>
                        <Badge className="text-[9px] py-0 px-1 bg-blue-50 text-blue-700 border-blue-200">
                          {b.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Complaints list */}
            <div className="space-y-3 mt-auto">
              <h4 className="font-bold text-sm text-gray-800 uppercase tracking-wide">Customer Support Tickets</h4>
              <div className="space-y-2">
                {getCustomerComplaints(selectedCustomer.name).length === 0 ? (
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg text-center">No active complaint tickets.</p>
                ) : (
                  getCustomerComplaints(selectedCustomer.name).map(t => (
                    <div key={t.id} className="p-3 bg-red-50/30 border border-red-100 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-red-800">
                        <span>{t.id}: {t.subject}</span>
                        <Badge className={`${t.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'} text-[9px] py-0`}>
                          {t.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-gray-400">Dated: {t.date}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
