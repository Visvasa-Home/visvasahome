import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, ChevronRight, Phone, Star, RotateCcw, XCircle, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { BookingService, Booking as ServiceBooking } from '@booking/services/bookingService';

interface BookingsPageProps {
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
  onBookService: () => void;
  userPhone?: string;
}

type TabType = 'upcoming' | 'completed' | 'cancelled';

const categoryColors: Record<string, string> = {
  cleaning: 'bg-teal-100 text-teal-700',
  cleaning_services: 'bg-teal-100 text-teal-700',
  appliance: 'bg-blue-100 text-blue-700',
  appliance_repair: 'bg-blue-100 text-blue-700',
  electrical: 'bg-yellow-100 text-yellow-700',
  electrical_services: 'bg-yellow-100 text-yellow-700',
  painting: 'bg-purple-100 text-purple-700',
  painting_services: 'bg-purple-100 text-purple-700',
  plumbing: 'bg-blue-100 text-[#2563EB]',
  plumbing_services: 'bg-blue-100 text-[#2563EB]',
  carpentry: 'bg-amber-100 text-amber-700',
  carpentry_services: 'bg-amber-100 text-amber-700',
  ac: 'bg-cyan-100 text-cyan-700',
  ac_services: 'bg-cyan-100 text-cyan-700',
  pest: 'bg-red-100 text-red-700',
  pest_control: 'bg-red-100 text-red-700',
};

function getUIVisualStatus(status: ServiceBooking['status']): 'upcoming' | 'completed' | 'cancelled' {
  if (status === 'completed') return 'completed';
  if (status === 'cancelled') return 'cancelled';
  return 'upcoming';
}

function getStatusLabel(status: ServiceBooking['status']): string {
  switch (status) {
    case 'pending': return 'Pending Approval';
    case 'confirmed': return 'Confirmed';
    case 'in-progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
}

function StatusBadge({ status, label }: { status: ServiceBooking['status']; label: string }) {
  const uiStatus = getUIVisualStatus(status);
  if (uiStatus === 'upcoming') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-[#2563EB]">
        <AlertCircle className="w-3 h-3" />
        {label}
      </span>
    );
  }
  if (uiStatus === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <CheckCircle className="w-3 h-3" />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      <XCircle className="w-3 h-3" />
      {label}
    </span>
  );
}

function BookingCard({
  booking,
  onRebook,
  rebookingId,
  onCancel,
  onReschedule,
  onTrackLive,
  onRate,
}: {
  booking: ServiceBooking;
  onRebook: () => void;
  rebookingId: string | null;
  onCancel: () => void;
  onReschedule: () => void;
  onTrackLive?: () => void;
  onRate?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const amount = parseInt(booking.servicePrice.replace(/[^\d]/g, '')) || 0;
  const displayCategory = booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${categoryColors[booking.serviceType.toLowerCase()] || 'bg-gray-100 text-gray-700'}`}>
                {displayCategory}
              </span>
              <StatusBadge status={booking.status} label={getStatusLabel(booking.status)} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-snug">{booking.serviceName}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-gray-900">₹{amount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{booking.id}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{booking.scheduledDate}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{booking.scheduledTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600 max-w-full">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span className="truncate">{booking.address.line1}, {booking.address.city}</span>
          </div>
        </div>

        {/* Rating */}
        {booking.status === 'completed' && (
          <div className="flex items-center gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">You rated this</span>
          </div>
        )}
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <span>View Details</span>
        <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 py-4 border-t border-gray-100 space-y-3 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-[#2563EB] font-bold text-sm">
                {booking.professionalName ? booking.professionalName[0] : '?'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{booking.professionalName || 'Finding Professional...'}</p>
              <p className="text-xs text-gray-500">Assigned Professional</p>
            </div>
            {booking.professionalName && booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <a
                href={`tel:+919876543210`}
                className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-green-700" />
              </a>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button
                onClick={onCancel}
                className="flex-1 py-2 border border-red-200 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                Cancel Booking
              </button>
            )}
            {booking.status === 'in-progress' && onTrackLive && (
              <button
                onClick={onTrackLive}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-[#2563EB] to-blue-500 text-white text-xs font-semibold rounded-lg hover:shadow-md transition-all"
              >
                <MapPin className="w-3.5 h-3.5" />
                Track Live
              </button>
            )}
            {booking.status === 'completed' && onRate && (
              <button
                onClick={onRate}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-yellow-400 text-yellow-700 bg-yellow-50 text-xs font-semibold rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                Rate Professional
              </button>
            )}
            {(booking.status === 'completed' || booking.status === 'cancelled') && (
              <button
                onClick={onRebook}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
                disabled={rebookingId === booking.id}
              >
                {rebookingId === booking.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Rebooking...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    1-Click Rebook
                  </>
                )}
              </button>
            )}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button
                onClick={onReschedule}
                className="flex-1 py-2 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#1D4ED8] transition-colors"
              >
                Reschedule
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function BookingsPage({ onBack, onNavigate, onBookService, userPhone }: BookingsPageProps) {
  // CUSTOMER BOOKING: Strictly filtered — only shows bookings belonging to this user
  const getFilteredBookings = () => {
    const all = BookingService.getAllBookings();
    const currentPhone = userPhone || localStorage.getItem('visvasahome_user_phone');
    // Security: if no phone is found, return empty — NEVER show all bookings to a customer
    if (!currentPhone) return [];
    const cleanPhone = currentPhone.replace(/[^\d+]/g, '');
    return all.filter(b => b.userPhone.replace(/[^\d+]/g, '') === cleanPhone);
  };

  const [bookingsList, setBookingsList] = useState<ServiceBooking[]>(() => getFilteredBookings());
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [rebookingId, setRebookingId] = useState<string | null>(null);
  const [showRebookSuccess, setShowRebookSuccess] = useState(false);

  // Rescheduling modal states
  const [reschedulingBooking, setReschedulingBooking] = useState<ServiceBooking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const filtered = bookingsList.filter((b) => getUIVisualStatus(b.status) === activeTab);

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'upcoming', label: 'Upcoming', count: bookingsList.filter((b) => getUIVisualStatus(b.status) === 'upcoming').length },
    { key: 'completed', label: 'Completed', count: bookingsList.filter((b) => getUIVisualStatus(b.status) === 'completed').length },
    { key: 'cancelled', label: 'Cancelled', count: bookingsList.filter((b) => getUIVisualStatus(b.status) === 'cancelled').length },
  ];

  const handleCancel = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      BookingService.cancelBooking(id);
      setBookingsList(getFilteredBookings());
    }
  };

  const handle1ClickRebook = (booking: ServiceBooking) => {
    setRebookingId(booking.id);
    setTimeout(() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = tomorrow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

      BookingService.createBooking({
        userId: booking.userId,
        userName: booking.userName,
        userPhone: booking.userPhone,
        userEmail: booking.userEmail,
        serviceType: booking.serviceType,
        serviceName: booking.serviceName,
        servicePrice: booking.servicePrice,
        scheduledDate: formattedDate,
        scheduledTime: booking.scheduledTime,
        address: booking.address,
        paymentMethod: booking.paymentMethod || 'online',
        paymentStatus: 'paid',
        status: 'confirmed',
        professionalId: booking.professionalId,
        professionalName: booking.professionalName
      });

      setRebookingId(null);
      setBookingsList(getFilteredBookings());
      setShowRebookSuccess(true);
      setTimeout(() => setShowRebookSuccess(false), 3000);
    }, 1500);
  };

  const openRescheduleModal = (booking: ServiceBooking) => {
    setReschedulingBooking(booking);
    setNewDate(booking.scheduledDate);
    setNewTime(booking.scheduledTime);
  };

  const handleSaveReschedule = () => {
    if (!reschedulingBooking) return;
    BookingService.rescheduleBooking(reschedulingBooking.id, newDate, newTime);
    setReschedulingBooking(null);
    setBookingsList(getFilteredBookings());
  };

  const getNext7Days = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
    });
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  const totalSpent = bookingsList
    .filter((b) => getUIVisualStatus(b.status) === 'completed')
    .reduce((sum, b) => sum + (parseInt(b.servicePrice.replace(/[^\d]/g, '')) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-12 pb-0 lg:pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-white text-xl font-bold">My Bookings</h1>
              {/* Customer view label — shows only THIS user's bookings */}
              <p className="text-blue-200 text-xs font-medium mt-0.5">
                {userPhone || localStorage.getItem('visvasahome_user_phone') || 'Your personal history'}
              </p>
            </div>
            <span className="px-2 py-1 bg-white/20 rounded-full text-white/80 text-[10px] font-bold uppercase tracking-wider">
              Customer
            </span>
          </div>

          {/* Stats Row */}
          <div className="flex gap-3 mb-5">
            <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
              <p className="text-white text-xl font-bold">{bookingsList.filter((b) => getUIVisualStatus(b.status) === 'upcoming').length}</p>
              <p className="text-blue-100 text-xs">Upcoming</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
              <p className="text-white text-xl font-bold">{bookingsList.filter((b) => getUIVisualStatus(b.status) === 'completed').length}</p>
              <p className="text-blue-100 text-xs">Completed</p>
            </div>
            <div className="flex-1 bg-white/15 rounded-xl p-3 text-center">
              <p className="text-white text-xl font-bold">₹{totalSpent.toLocaleString()}</p>
              <p className="text-blue-100 text-xs">Total Spent</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/10 rounded-xl p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-[#2563EB] shadow-sm'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-blue-100 text-[#2563EB]' : 'bg-white/20 text-white'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center mt-4">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">No {activeTab} bookings</h2>
            <p className="text-gray-500 text-sm mb-6">
              {activeTab === 'upcoming'
                ? 'Book a service to get started'
                : `You have no ${activeTab} bookings yet`}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={onBookService}
                className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold text-sm hover:bg-[#2563EB] transition-colors"
              >
                Browse Services
              </button>
            )}
          </div>
        ) : (
          <>
            {showRebookSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mb-3 animate-fadeIn">
                <CheckCircle className="w-4 h-4" />
                Service rebooked successfully! Check Upcoming tab.
              </div>
            )}
            {filtered.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onRebook={() => handle1ClickRebook(booking)}
                rebookingId={rebookingId}
                onCancel={() => handleCancel(booking.id)}
                onReschedule={() => openRescheduleModal(booking)}
                onTrackLive={() => onNavigate('live-tracking')}
                onRate={() => onNavigate?.('submit-review', { bookingId: booking.id })}
              />
            ))}
          </>
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-gray-150 animate-fadeIn">
            <h3 className="font-bold text-gray-900 text-lg">Reschedule Service</h3>
            <p className="text-xs text-gray-500">Select a new date and time for <strong>{reschedulingBooking.serviceName}</strong>.</p>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Select Date</label>
              <select 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-3 text-sm bg-white"
              >
                {getNext7Days().map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase">Select Time Slot</label>
              <select 
                value={newTime} 
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full h-11 border border-gray-200 rounded-xl px-3 text-sm bg-white"
              >
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-3">
              <button 
                onClick={() => setReschedulingBooking(null)}
                className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveReschedule}
                className="flex-1 py-2.5 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:bg-[#1D4ED8] transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
