import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, Download, CheckCircle, XCircle, Clock, Phone, MapPin, Calendar, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { BookingService, Booking } from '@booking/services/bookingService';

interface AdminBookingsPageProps {
  onBack: () => void;
}

export function AdminBookingsPage({ onBack }: AdminBookingsPageProps) {
  const [bookings, setBookings] = useState<Booking[]>(() => BookingService.getAllBookings()); // ADMIN VIEW: Shows ALL customer bookings
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'bookings' | 'disputes' | 'slots'>('bookings');

  // Reschedule modal states
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // Slots Configuration State
  const [slotDuration, setSlotDuration] = useState(60);
  const [slotInterval, setSlotInterval] = useState(30);
  const [startWorkingTime, setStartWorkingTime] = useState('09:00 AM');
  const [endWorkingTime, setEndWorkingTime] = useState('07:00 PM');

  // Blocked Holidays database
  const [holidays, setHolidays] = useState<string[]>([
    '15 Aug 2026',
    '26 Jan 2026',
    '02 Oct 2026',
    '25 Dec 2026'
  ]);
  const [newHoliday, setNewHoliday] = useState('');

  // Mock Disputes database
  const [disputes, setDisputes] = useState<Array<{ id: string; bookingId: string; customerName: string; reason: string; status: 'open' | 'resolved'; date: string }>>([
    { id: 'DSP001', bookingId: 'BK10243', customerName: 'Vikram Joshi', reason: 'Booking cancelled by provider but amount still deducted from card payment.', status: 'open', date: '2026-06-11' },
    { id: 'DSP002', bookingId: 'BK10247', customerName: 'Rajesh Kumar', reason: 'Service partner Amit Sharma was late by 40 minutes, need partial compensation.', status: 'resolved', date: '2026-06-12' },
  ]);

  const adminRole = localStorage.getItem('visvasahome_admin_role') || 'super_admin';

  const checkWritePermission = () => {
    if (adminRole === 'support_agent') {
      alert("Permission Denied: Support Agent roles are read-only. Only Super Admins or Operations Managers can modify database records.");
      return false;
    }
    return true;
  };

  const refreshBookings = () => setBookings(BookingService.getAllBookings());

  const handleComplete = (id: string) => {
    if (!checkWritePermission()) return;
    BookingService.updateBookingStatus(id, 'completed');
    BookingService.updatePaymentStatus(id, 'paid');
    refreshBookings();
  };

  const handleCancel = (id: string) => {
    if (!checkWritePermission()) return;
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      BookingService.cancelBooking(id);
      refreshBookings();
    }
  };

  const openReschedule = (booking: Booking) => {
    if (!checkWritePermission()) return;
    setReschedulingId(booking.id);
    setNewDate(booking.scheduledDate);
    setNewTime(booking.scheduledTime);
  };

  const handleSaveReschedule = () => {
    if (!checkWritePermission()) return;
    if (!reschedulingId) return;
    BookingService.rescheduleBooking(reschedulingId, newDate, newTime);
    setReschedulingId(null);
    refreshBookings();
  };

  const handleResolveDispute = (id: string, bookingId: string, action: 'refund' | 'close') => {
    if (!checkWritePermission()) return;
    setDisputes(prev =>
      prev.map(d => (d.id === id ? { ...d, status: 'resolved' } : d))
    );
    if (action === 'refund') {
      BookingService.updatePaymentStatus(bookingId, 'refunded');
      BookingService.updateBookingStatus(bookingId, 'cancelled');
      refreshBookings();
      alert(`Dispute ${id} resolved with a full refund processed for Booking ${bookingId}.`);
    } else {
      alert(`Dispute ${id} closed and marked as resolved.`);
    }
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkWritePermission()) return;
    if (!newHoliday.trim()) return;
    setHolidays(prev => [...prev, newHoliday]);
    setNewHoliday('');
    alert(`Holiday date ${newHoliday} successfully blocked from slot booking.`);
  };

  const handleDeleteHoliday = (date: string) => {
    if (!checkWritePermission()) return;
    setHolidays(prev => prev.filter(d => d !== date));
  };

  const handleExport = () => {
    const csv = [
      'ID,Customer,Phone,Service,Professional,Date,Time,Status,Payment,Amount',
      ...bookings.map(b =>
        `${b.id},${b.userName},${b.userPhone},${b.serviceName},${b.professionalName || 'TBD'},${b.scheduledDate},${b.scheduledTime},${b.status},${b.paymentStatus},₹${b.servicePrice}`
      )
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPaymentStatusColor = (status: Booking['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'refunded': return 'text-red-650';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-650';
    }
  };

  const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' ');

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.professionalName || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesTab = true;
      if (statusFilter !== 'all') {
        matchesTab = b.status === statusFilter;
      }
      return matchesSearch && matchesTab;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
      inProgress: bookings.filter(b => b.status === 'in-progress').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      revenue: bookings
        .filter(b => b.paymentStatus === 'paid')
        .reduce((s, b) => s + (parseInt(b.servicePrice.replace(/[^\d]/g, '')) || 0), 0)
    };
  }, [bookings]);

  const getNext7Days = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    });
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-0.5">
              <h1 className="text-2xl font-bold text-gray-900">Manage Bookings</h1>
              <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200">
                🔒 Admin View — All Customers
              </span>
            </div>
            <p className="text-sm text-gray-500">Track incoming jobs, reschedule time slots, resolve customer disputes, and set holiday blocks</p>
          </div>
          <button
            onClick={refreshBookings}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-750 mr-2"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Tab List switcher */}
        <div className="flex gap-4 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-2.5 font-semibold text-sm transition-all ${
              activeTab === 'bookings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Service Bookings
          </button>
          <button
            onClick={() => setActiveTab('disputes')}
            className={`pb-2.5 font-semibold text-sm transition-all flex items-center gap-1.5 ${
              activeTab === 'disputes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dispute Resolution
            {disputes.filter(d => d.status === 'open').length > 0 && (
              <Badge className="bg-red-500 text-white hover:bg-red-650 px-1.5 py-0.5 text-[10px] rounded-full">
                {disputes.filter(d => d.status === 'open').length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('slots')}
            className={`pb-2.5 font-semibold text-sm transition-all ${
              activeTab === 'slots' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Slots & Holidays Configuration
          </button>
        </div>

        {activeTab === 'bookings' && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
              {[
                { label: 'Total', value: stats.total, color: 'text-gray-850' },
                { label: 'Upcoming', value: stats.pending, color: 'text-indigo-600' },
                { label: 'In Progress', value: stats.inProgress, color: 'text-blue-600' },
                { label: 'Completed', value: stats.completed, color: 'text-green-600' },
                { label: 'Cancelled', value: stats.cancelled, color: 'text-red-500' },
                { label: 'Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, color: 'text-emerald-600' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-semibold mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Status Segmentation Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search booking ID, customer, service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(status => (
                  <Button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    className="capitalize text-xs h-9 px-3 rounded-xl"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-6">
        {activeTab === 'bookings' && (
          <div className="grid grid-cols-1 gap-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow border border-gray-200 bg-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-bold text-lg text-[#2563EB]">{booking.id}</span>
                          <Badge className={`${getStatusColor(booking.status)} border text-xs`}>
                            {capitalise(booking.status)}
                          </Badge>
                          <Badge className={`border text-xs ${booking.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                            {capitalise(booking.paymentStatus)} · {booking.paymentMethod || 'N/A'}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1 text-base">{booking.serviceName}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold">
                          <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{booking.scheduledDate}</div>
                          <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{booking.scheduledTime}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Customer</p>
                        <p className="font-semibold text-gray-900">{booking.userName}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-650 mt-1">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{booking.userPhone}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Professional</p>
                        <p className="font-semibold text-gray-900">{booking.professionalName || 'Assigning...'}</p>
                        {booking.professionalId && (
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <span className="text-xs bg-gray-150 rounded px-1.5 py-0.5">{booking.professionalId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-gray-650 border-t border-gray-100 pt-3 mt-3">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                      <span>{booking.address.line1}, {booking.address.city}, {booking.address.state} - {booking.address.pincode}</span>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-end gap-3 min-w-[200px] border-t lg:border-t-0 border-gray-100 pt-3 lg:pt-0">
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-gray-900">₹{parseInt(booking.servicePrice.replace(/[^\d]/g, '') || '0').toLocaleString('en-IN')}</p>
                      <p className={`text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        Payment: {capitalise(booking.paymentStatus)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                      {/* Reschedule — show for pending/confirmed/in-progress */}
                      {(booking.status === 'pending' || booking.status === 'confirmed' || booking.status === 'in-progress') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openReschedule(booking)}
                          className="text-[#2563EB] border-blue-200 hover:bg-blue-50 text-xs rounded-xl h-8"
                        >
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          Reschedule
                        </Button>
                      )}

                      {/* Complete — show for in-progress */}
                      {booking.status === 'in-progress' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs rounded-xl h-8"
                          onClick={() => handleComplete(booking.id)}
                        >
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          Complete
                        </Button>
                      )}

                      {/* Cancel — show for pending/confirmed */}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-750 text-xs rounded-xl h-8"
                          onClick={() => handleCancel(booking.id)}
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Disputes tab list */}
        {activeTab === 'disputes' && (
          <div className="grid grid-cols-1 gap-4">
            {disputes.map(d => (
              <Card key={d.id} className="p-5 border border-gray-200 bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-red-650 text-sm flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-amber-500" /> {d.id}
                      </span>
                      <Badge className="bg-gray-100 text-gray-700">Booking: {d.bookingId}</Badge>
                      <span className="text-xs text-gray-400 font-semibold">{d.date}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Customer: {d.customerName}</p>
                    <p className="text-xs text-gray-650 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                      "{d.reason}"
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                    <span className="text-xs">
                      Status: <Badge className={`ml-1 ${d.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{d.status}</Badge>
                    </span>
                    {d.status === 'open' && (
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleResolveDispute(d.id, d.bookingId, 'refund')}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 px-3 rounded-lg"
                        >
                          Approve Refund
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolveDispute(d.id, d.bookingId, 'close')}
                          className="text-gray-600 border-gray-200 text-xs h-8 px-3 rounded-lg"
                        >
                          Dismiss Case
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Slots & Holidays configuration panel */}
        {activeTab === 'slots' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Slot Configuration */}
            <Card className="p-6 border border-gray-200 bg-white">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Time Slot Intervals</h2>
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Slot Duration (Mins)</label>
                    <Input type="number" value={slotDuration} onChange={e => setSlotDuration(Number(e.target.value))} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Slot Interval (Mins)</label>
                    <Input type="number" value={slotInterval} onChange={e => setSlotInterval(Number(e.target.value))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Daily Work Starts</label>
                    <Input type="text" value={startWorkingTime} onChange={e => setStartWorkingTime(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Daily Work Ends</label>
                    <Input type="text" value={endWorkingTime} onChange={e => setEndWorkingTime(e.target.value)} />
                  </div>
                </div>
                <Button onClick={() => alert('Booking time slot configurations updated successfully.')} className="w-full bg-[#2563EB] text-white mt-4 font-semibold text-xs h-10">
                  Save Slot Settings
                </Button>
              </div>
            </Card>

            {/* Blocked Holiday Dates Manager */}
            <Card className="p-6 border border-gray-200 bg-white flex flex-col">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Blocked Holiday Dates</h2>
              <p className="text-xs text-gray-500 mb-4">Dates added here will be greyed out during checkout scheduling booking checkout slots.</p>
              
              <form onSubmit={handleAddHoliday} className="flex gap-2 mb-4">
                <Input
                  placeholder="e.g. 15 Aug 2026"
                  value={newHoliday}
                  onChange={e => setNewHoliday(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" className="bg-[#2563EB] text-white text-xs h-10 font-bold px-4">
                  Block Date
                </Button>
              </form>

              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 flex-1">
                {holidays.map(date => (
                  <div key={date} className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-750 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-600" /> {date}</span>
                    <button
                      onClick={() => handleDeleteHoliday(date)}
                      className="text-red-600 hover:text-red-750 font-semibold px-2 py-1 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 text-lg">Reschedule Booking</h3>
            <p className="text-xs text-gray-500">
              Booking <strong>{reschedulingId}</strong> — select a new date and time.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-650 uppercase tracking-wide">New Date</label>
              <select
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {getNext7Days().map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-650 uppercase tracking-wide">New Time Slot</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <Button
                variant="outline"
                onClick={() => setReschedulingId(null)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveReschedule}
                className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl text-white font-semibold"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
