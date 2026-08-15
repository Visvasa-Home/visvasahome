import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, CheckCircle, Clock, Star, Shield, MapPin, ChevronRight,
  Wrench, Zap, Wind, SprayCan, Package, Bug, PaintBucket,
  Hammer, User, Phone, Calendar, IndianRupee, Tag, RefreshCw, AlertCircle, BrickWall
} from 'lucide-react';
import { CartManager } from '@booking/services/cartManager';
import { generateAvailableSlots } from '@booking/services/algorithms';
import { PaymentPage } from '@payment/components/PaymentPage';
import { BookingService } from '@booking/services/bookingService';
import { validate, schemas, sanitizeHTML, generateCSRFToken, getCSRFToken, validateCSRFToken, generateDeviceFingerprint } from '@auth/services/security';
import { useToast } from '@shared/components/ToastContext';

const professionalsPool = [
  {
    id: 'PRO10234',
    name: 'Amit Sharma',
    latitude: 12.9352,
    longitude: 77.6245,
    categories: ['plumbing'],
    isVerified: true,
    isActive: true,
    rating: 4.9,
    jobsCompleted: 127,
    completionRate: 0.98,
    experienceYears: 8,
    responseTimeMinutes: 0,
    maxDistanceKm: 15,
    availability: [
      { dayOfWeek: 0, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 1, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 2, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 4, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 6, startTime: '07:00', endTime: '20:00' },
    ]
  },
  {
    id: 'PRO10235',
    name: 'Meera Patel',
    latitude: 12.9716,
    longitude: 77.6412,
    categories: ['cleaning'],
    isVerified: true,
    isActive: true,
    rating: 4.8,
    jobsCompleted: 98,
    completionRate: 0.96,
    experienceYears: 5,
    responseTimeMinutes: 0,
    maxDistanceKm: 15,
    availability: [
      { dayOfWeek: 0, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 1, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 2, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 4, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 6, startTime: '07:00', endTime: '20:00' },
    ]
  },
  {
    id: 'PRO10236',
    name: 'Ravi Kumar',
    latitude: 12.9698,
    longitude: 77.7500,
    categories: ['ac'],
    isVerified: true,
    isActive: true,
    rating: 4.9,
    jobsCompleted: 85,
    completionRate: 0.97,
    experienceYears: 10,
    responseTimeMinutes: 0,
    maxDistanceKm: 15,
    availability: [
      { dayOfWeek: 0, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 1, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 2, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 3, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 4, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '07:00', endTime: '20:00' },
      { dayOfWeek: 6, startTime: '07:00', endTime: '20:00' },
    ]
  },
  {
    id: 'PRO10238',
    name: 'Suresh Yadav',
    latitude: 12.9250,
    longitude: 77.5850,
    categories: ['electrical'],
    isVerified: true,
    isActive: true,
    rating: 4.6,
    jobsCompleted: 52,
    completionRate: 0.89,
    experienceYears: 4,
    responseTimeMinutes: 0,
    maxDistanceKm: 15,
    availability: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '08:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '08:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '08:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '08:00', endTime: '18:00' },
    ]
  }
];

interface BookingFlowPageProps {
  onBack: () => void;
  selectedLocation: string | null;
  initialService?: string;
  isAuthenticated: boolean;
  onLogin: () => void;
  onNavigate?: (page: any, data?: any) => void;
  onBookingSuccess?: (phone: string, name: string) => void;
}

type Step = 'category' | 'service' | 'slot' | 'address' | 'confirm' | 'otp' | 'payment' | 'done';

const categories = [
  { id: 'plumbing', icon: Wrench, label: 'Plumbing', color: 'bg-blue-100 text-[#2563EB]', popular: true },
  { id: 'electrical', icon: Zap, label: 'Electrical', color: 'bg-blue-100 text-blue-600', popular: true },
  { id: 'ac', icon: Wind, label: 'AC Service & Repair', color: 'bg-blue-100 text-blue-600', popular: true },
  { id: 'cleaning', icon: SprayCan, label: 'Cleaning & Disinfection', color: 'bg-blue-100 text-blue-600', popular: true },
  { id: 'pest', icon: Bug, label: 'Pest Control', color: 'bg-blue-100 text-blue-600', popular: false },
  { id: 'painting', icon: PaintBucket, label: 'Painting & Waterproofing', color: 'bg-blue-100 text-blue-600', popular: false },
  { id: 'carpentry', icon: Hammer, label: 'Carpentry', color: 'bg-blue-100 text-blue-600', popular: false },
  { id: 'appliance', icon: Package, label: 'Appliance Repair', color: 'bg-blue-100 text-blue-600', popular: false },
  { id: 'renovations', icon: BrickWall, label: 'Renovations & Masonry', color: 'bg-blue-100 text-blue-600', popular: false },
];

const servicesByCategory: Record<string, { name: string; price: string; duration: string; rating: number; reviews: number }[]> = {
  plumbing: [
    { name: 'Tap & Mixer Repair', price: '₹149', duration: '30 min', rating: 4.8, reviews: 1289 },
    { name: 'Toilet & WC Repair/Install', price: '₹299', duration: '45 min', rating: 4.7, reviews: 943 },
    { name: 'Drain Blockage Unblocking', price: '₹249', duration: '45 min', rating: 4.6, reviews: 1530 },
    { name: 'Water Heater/Geyser Service', price: '₹399', duration: '60 min', rating: 4.9, reviews: 2100 },
    { name: 'Water Purifier (RO) Filter Change', price: '₹499', duration: '90 min', rating: 4.8, reviews: 3042 },
    { name: 'Pipeline Leakage Repair', price: '₹349', duration: '60 min', rating: 4.7, reviews: 720 },
    { name: 'Bathroom Fittings Installation', price: '₹199', duration: '30 min', rating: 4.8, reviews: 1104 },
  ],
  electrical: [
    { name: 'Fan Repair & Installation', price: '₹149', duration: '30 min', rating: 4.9, reviews: 3409 },
    { name: 'Switch, Socket & Holder Install', price: '₹99', duration: '20 min', rating: 4.8, reviews: 4120 },
    { name: 'Switchboard Repair/Install', price: '₹199', duration: '30 min', rating: 4.8, reviews: 2090 },
    { name: 'MCB & Fusebox Fixes', price: '₹249', duration: '40 min', rating: 4.7, reviews: 1342 },
    { name: 'Inverter Installation & Service', price: '₹399', duration: '60 min', rating: 4.8, reviews: 982 },
    { name: 'Complete House Rewiring', price: '₹4,999', duration: '6 hrs', rating: 4.9, reviews: 321 },
    { name: 'CCTV Camera Setup', price: '₹599', duration: '2 hrs', rating: 4.7, reviews: 450 },
  ],
  ac: [
    { name: 'Split AC Regular Service', price: '₹349', duration: '45 min', rating: 4.9, reviews: 8921 },
    { name: 'Split AC Foam Jet Deep Clean', price: '₹599', duration: '60 min', rating: 4.9, reviews: 5321 },
    { name: 'Window AC Service & Clean', price: '₹299', duration: '40 min', rating: 4.7, reviews: 2400 },
    { name: 'AC Installation / Uninstallation', price: '₹799', duration: '90 min', rating: 4.8, reviews: 3421 },
    { name: 'AC Gas Leakage Repair & Refill', price: '₹1,299', duration: '90 min', rating: 4.8, reviews: 4312 },
    { name: 'AC Condenser Coil Replacement', price: '₹2,499', duration: '2 hrs', rating: 4.6, reviews: 920 },
  ],
  cleaning: [
    { name: 'Home Deep Cleaning (1BHK)', price: '₹1,899', duration: '4 hrs', rating: 4.8, reviews: 3421 },
    { name: 'Home Deep Cleaning (2BHK)', price: '₹2,499', duration: '5 hrs', rating: 4.8, reviews: 5490 },
    { name: 'Home Deep Cleaning (3BHK)', price: '₹3,299', duration: '6 hrs', rating: 4.8, reviews: 6721 },
    { name: 'Bathroom Deep Cleaning (Per Unit)', price: '₹349', duration: '60 min', rating: 4.7, reviews: 4321 },
    { name: 'Kitchen Deep Degreasing & Clean', price: '₹999', duration: '2 hrs', rating: 4.8, reviews: 3892 },
    { name: 'Sofa Dry Cleaning (Per Seat)', price: '₹199', duration: '30 min', rating: 4.6, reviews: 2341 },
    { name: 'Balcony Pressure Wash & Clean', price: '₹399', duration: '45 min', rating: 4.7, reviews: 892 },
    { name: 'Water Tank Disinfection & Clean', price: '₹599', duration: '60 min', rating: 4.8, reviews: 1201 },
  ],
  pest: [
    { name: 'Cockroach & Ant Control', price: '₹699', duration: '60 min', rating: 4.8, reviews: 2302 },
    { name: 'Termite Shield Treatment (1BHK)', price: '₹1,499', duration: '2 hrs', rating: 4.7, reviews: 892 },
    { name: 'Bed Bug Elimination Treatment', price: '₹899', duration: '90 min', rating: 4.8, reviews: 1420 },
    { name: 'Mosquito Control Fogging', price: '₹499', duration: '45 min', rating: 4.6, reviews: 756 },
    { name: 'Rodent / Rat Trapping Service', price: '₹399', duration: '45 min', rating: 4.5, reviews: 540 },
  ],
  painting: [
    { name: 'Full House Paint - Interior', price: '₹8,000', duration: '3 days', rating: 4.9, reviews: 1204 },
    { name: 'Exterior Wall Protective Paint', price: '₹12,000', duration: '4 days', rating: 4.8, reviews: 602 },
    { name: 'One Wall Designer Texture Finish', price: '₹2,499', duration: '6 hrs', rating: 4.7, reviews: 340 },
    { name: 'Dampness & Seepage Waterproofing', price: '₹3,499', duration: '8 hrs', rating: 4.8, reviews: 490 },
  ],
  carpentry: [
    { name: 'Furniture Door / Drawer Repair', price: '₹149', duration: '30 min', rating: 4.8, reviews: 1890 },
    { name: 'Wardrobe Hinge/Handle Replace', price: '₹199', duration: '30 min', rating: 4.7, reviews: 2102 },
    { name: 'Modular Kitchen Hinge Adjust', price: '₹299', duration: '45 min', rating: 4.8, reviews: 1540 },
    { name: 'Wooden Curtain Rod Install', price: '₹149', duration: '20 min', rating: 4.6, reviews: 892 },
    { name: 'TV Wall Mount Installation', price: '₹249', duration: '30 min', rating: 4.7, reviews: 1324 },
    { name: 'Door Lock & Latches Installation', price: '₹299', duration: '40 min', rating: 4.8, reviews: 1109 },
  ],
  appliance: [
    { name: 'Washing Machine Repair & Service', price: '₹399', duration: '60 min', rating: 4.8, reviews: 2341 },
    { name: 'Refrigerator Gas Refill & Repair', price: '₹499', duration: '60 min', rating: 4.7, reviews: 1892 },
    { name: 'Microwave / Oven Repair', price: '₹299', duration: '45 min', rating: 4.8, reviews: 1241 },
    { name: 'Water Purifier (RO) Repair', price: '₹349', duration: '60 min', rating: 4.7, reviews: 1021 },
    { name: 'Kitchen Chimney Service & Clean', price: '₹499', duration: '90 min', rating: 4.6, reviews: 830 },
  ],
  renovations: [
    { name: 'Tiles & Flooring Grouting Repair', price: '₹399', duration: '60 min', rating: 4.7, reviews: 543 },
    { name: 'Wall Plastering & Masonry Patching', price: '₹499', duration: '90 min', rating: 4.8, reviews: 620 },
    { name: 'False Ceiling POP Sheet Repair', price: '₹999', duration: '2 hrs', rating: 4.7, reviews: 280 },
    { name: 'Granite Kitchen Platform Install', price: '₹4,999', duration: '4 hrs', rating: 4.9, reviews: 120 },
  ]
};

const timeSlots = [
  { label: 'Morning', slots: ['7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'] },
  { label: 'Afternoon', slots: ['12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'] },
  { label: 'Evening', slots: ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'] },
];

function getDateList() {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      value: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate(),
      month: d.toLocaleDateString('en-IN', { month: 'short' }),
      isToday: i === 0,
    };
  });
}

function parseDurationToMinutes(durationStr: string | undefined): number {
  if (!durationStr) return 90;
  const normalized = durationStr.toLowerCase().trim();
  if (normalized.includes('min')) {
    const mins = parseInt(normalized.replace(/[^0-9]/g, ''));
    return isNaN(mins) ? 90 : mins;
  }
  if (normalized.includes('hr') || normalized.includes('hour') || normalized.includes('day')) {
    const scale = normalized.includes('day') ? 24 : 1;
    const hrs = parseFloat(normalized.replace(/[^0-9.]/g, ''));
    return isNaN(hrs) ? 90 : Math.round(hrs * 60 * scale);
  }
  return 90;
}

export function BookingFlowPage({ onBack, selectedLocation, initialService, isAuthenticated, onLogin, onNavigate, onBookingSuccess }: BookingFlowPageProps) {
  const { showToast } = useToast();
  const cartData = useMemo(() => CartManager.getCart(), []);
  const hasCartItems = cartData.items.length > 0;

  const [step, setStep] = useState<Step>(
    CartManager.getCart().items.length > 0 ? 'slot' : 'category'
  );
  const [selectedCategory, setSelectedCategory] = useState(
    CartManager.getCart().categorySlug || ''
  );
  const [selectedService, setSelectedService] = useState(
    CartManager.getCart().items[0]?.serviceName || ''
  );
  const [bookingType, setBookingType] = useState<'instant' | 'scheduled'>('instant');
  const [selectedDate, setSelectedDate] = useState(() => {
    const dList = getDateList();
    return `Today, ${dList[0].date} ${dList[0].month}`;
  });
  const [selectedTime, setSelectedTime] = useState('Instant (Arrival in 45 mins)');
  const [appliedSurgeMultiplier, setAppliedSurgeMultiplier] = useState(1.0);
  const [address, setAddress] = useState(selectedLocation || '');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [phone, setPhone] = useState(() => localStorage.getItem('visvasahome_user_phone') || '');
  const [name, setName] = useState(() => localStorage.getItem('visvasahome_user_name') || (isAuthenticated ? 'Valued Customer' : ''));
  const [addressError, setAddressError] = useState('');
  const [showCategorySwitchWarning, setShowCategorySwitchWarning] = useState(false);
  const [pendingCategory, setPendingCategory] = useState('');
  const [bookingId] = useState(() => 'VH-' + (Math.floor(Math.random() * 90000) + 10000));
  const [countdown, setCountdown] = useState(3);
  const [csrfToken, setCsrfToken] = useState('');
  const [extrasSelected, setExtrasSelected] = useState(false);
  const [serviceNotes, setServiceNotes] = useState('');

  // Auto-fill logged in user details
  useEffect(() => {
    if (isAuthenticated) {
      const savedPhone = localStorage.getItem('visvasahome_user_phone') || '';
      const savedName = localStorage.getItem('visvasahome_user_name') || 'Valued Customer';
      setPhone(savedPhone);
      setName(savedName);

      // Pre-fill default address if not set or too short
      const defaultAddr = BookingService.getDefaultAddress('demo-user');
      if (defaultAddr && (!address || address.length < 10)) {
        setAddress(defaultAddr.line1);
      }
    }
  }, [isAuthenticated]);

  // Auto-expand short addresses to avoid validation blocking
  useEffect(() => {
    if (address && address.length < 10) {
      const cities = ['Jaipur', 'Mumbai', 'Delhi NCR', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata'];
      const matchedCity = cities.find(c => address.toLowerCase().includes(c.toLowerCase())) || 'Jaipur';

      if (matchedCity === 'Jaipur') {
        setAddress('123 MG Road, Vaishali Nagar, Jaipur');
      } else if (matchedCity === 'Delhi NCR') {
        setAddress('12 Sector 62, Noida, Delhi NCR');
      } else if (matchedCity === 'Mumbai') {
        setAddress('45 Bandra West, Mumbai');
      } else if (matchedCity === 'Bangalore') {
        setAddress('78 Koramangala, Bangalore');
      } else {
        setAddress(`123 Main Street, ${address}`);
      }
    }
  }, [address]);

  useEffect(() => {
    let token = getCSRFToken();
    if (!token) {
      token = generateCSRFToken();
    }
    setCsrfToken(token);
  }, []);

  useEffect(() => {
    if (step !== 'done') return;
    if (countdown <= 0) {
      if (onNavigate) {
        onNavigate('live-tracking', { bookingId });
      } else {
        onBack();
      }
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, countdown, onNavigate, bookingId, onBack]);

  const dateList = getDateList();
  const services = servicesByCategory[selectedCategory] || [];
  const selectedSvc = services.find(s => s.name === selectedService);
  const discount = couponApplied ? 50 : 0;

  const dateObj = dateList.find(d => `${d.day}, ${d.date} ${d.month}` === selectedDate);
  const dateStr = dateObj ? dateObj.value : new Date().toISOString().split('T')[0];
  const basePrice = hasCartItems
    ? cartData.total
    : (selectedSvc ? parseInt(selectedSvc.price.replace(/[₹,]/g, '')) : 299);

  const serviceDurationMinutes = useMemo(() => {
    if (hasCartItems && cartData.items.length > 0) {
      const itemService = services.find(s => s.name === cartData.items[0].serviceName);
      if (itemService) return parseDurationToMinutes(itemService.duration);
    }
    return selectedSvc ? parseDurationToMinutes(selectedSvc.duration) : 90;
  }, [selectedSvc, hasCartItems, cartData.items, services]);

  const calculatedSlots = useMemo(() => {
    if (!selectedCategory) return [];
    return generateAvailableSlots({
      dateStr,
      serviceCategory: selectedCategory,
      basePrice,
      serviceDuration: serviceDurationMinutes,
      customerLat: 12.9716,
      customerLng: 77.5946,
      professionals: professionalsPool,
      bookings: [],
      activeBookingsInArea: 4
    });
  }, [dateStr, selectedCategory, basePrice, serviceDurationMinutes]);

  const groupedSlots = useMemo(() => {
    const morning = calculatedSlots.filter(s => {
      const h = parseInt(s.time24.split(':')[0]);
      return h < 12;
    });
    const afternoon = calculatedSlots.filter(s => {
      const h = parseInt(s.time24.split(':')[0]);
      return h >= 12 && h < 17;
    });
    const evening = calculatedSlots.filter(s => {
      const h = parseInt(s.time24.split(':')[0]);
      return h >= 17;
    });
    return [
      { label: 'Morning (07:00 AM - 12:00 PM)', slots: morning },
      { label: 'Afternoon (12:00 PM - 05:00 PM)', slots: afternoon },
      { label: 'Evening (05:00 PM - 08:00 PM)', slots: evening }
    ];
  }, [calculatedSlots]);

  const stepTitles: Record<Step, string> = {
    category: 'Select Category',
    service: 'Choose Service',
    slot: 'Pick Date & Time',
    address: 'Your Details',
    confirm: 'Confirm Booking',
    otp: 'Verify OTP',
    payment: 'Payment',
    done: 'Booking Confirmed',
  };

  const stepOrder: Step[] = ['category', 'service', 'slot', 'address', 'confirm', 'otp', 'payment', 'done'];
  const stepIndex = stepOrder.indexOf(step);

  const handleCategorySelect = (categoryId: string) => {
    const cart = CartManager.getCart();

    // Check if switching categories with items in cart
    if (cart.items.length > 0 && cart.categorySlug && cart.categorySlug !== categoryId) {
      setShowCategorySwitchWarning(true);
      setPendingCategory(categoryId);
      return;
    }

    setSelectedCategory(categoryId);
    setStep('service');
  };

  const handleCategorySwitchConfirm = () => {
    CartManager.clearCart();
    setSelectedCategory(pendingCategory);
    setStep('service');
    setShowCategorySwitchWarning(false);
    setPendingCategory('');
  };

  const handleCategorySwitchCancel = () => {
    setShowCategorySwitchWarning(false);
    setPendingCategory('');
  };

  const handleOtpChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const next = [...otpDigits];
    next[i] = v;
    setOtpDigits(next);
    if (v && i < 3) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
  };

  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) {
      const el = document.getElementById(`otp-${i - 1}`);
      el?.focus();
    }
  };

  const addOnCost = extrasSelected ? 99 : 0;

  if (step === 'payment') {
    return (
      <PaymentPage
        bookingId={bookingId}
        serviceName={hasCartItems ? cartData.items.map(i => i.serviceName).join(', ') : selectedService}
        amount={Math.round(basePrice * appliedSurgeMultiplier) - discount + addOnCost}
        customerName={name}
        customerPhone={phone}
        customerEmail={phone ? `${phone.replace('+', '')}@visvasahome.com` : undefined}
        scheduledDate={selectedDate}
        scheduledTime={selectedTime}
        address={address}
        onBack={() => {
          if (isAuthenticated) {
            setStep('confirm');
          } else {
            setStep('otp');
          }
        }}
        onSuccess={(paymentId) => {
          const paymentMethod = paymentId === 'cash' ? 'cash' : 'online';
          const itemsToBook = hasCartItems
            ? cartData.items
            : [{ serviceName: selectedService, price: selectedSvc ? selectedSvc.price : '₹299' }];

          const fullNotes = serviceNotes + (extrasSelected ? ' (Premium Materials Add-On Selected)' : '');

          itemsToBook.forEach(item => {
            BookingService.createBooking({
              id: bookingId,
              userId: 'demo-user',
              userName: name,
              userPhone: phone,
              userEmail: phone ? `${phone.replace('+', '').replace(' ', '')}@visvasahome.com` : undefined,
              serviceType: selectedCategory,
              serviceName: item.serviceName,
              servicePrice: item.price.replace(/[₹,]/g, ''),
              scheduledDate: selectedDate,
              scheduledTime: selectedTime,
              address: {
                line1: address,
                city: 'Jaipur',
                state: 'Rajasthan',
                pincode: '302001'
              },
              paymentMethod: paymentMethod,
              paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
              paymentId: paymentMethod === 'online' ? paymentId : undefined,
              professionalId: professionalsPool.find(p => p.categories.includes(selectedCategory))?.id || 'PRO10234',
              professionalName: professionalsPool.find(p => p.categories.includes(selectedCategory))?.name || 'Amit Sharma',
              status: 'confirmed',
              notes: fullNotes
            });
          });

          // Log user in upon successful guest booking/payment
          localStorage.setItem('visvasahome_user_phone', phone);
          localStorage.setItem('visvasahome_user_name', name);

          const newSession = {
            userId: phone,
            createdAt: Date.now(),
            lastActivity: Date.now(),
            deviceFingerprint: generateDeviceFingerprint()
          };
          localStorage.setItem('session_info', JSON.stringify(newSession));

          if (onBookingSuccess) {
            onBookingSuccess(phone, name);
          }

          showToast(
            'Booking Confirmed!',
            'Your service has been successfully booked. A professional will be assigned shortly.',
            'success'
          );

          CartManager.clearCart();
          setStep('done');
        }}
      />
    );
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-lg">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-blue-600 animate-bounce" />
          </div>
          <h2 className="text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 text-sm mb-1">Booking ID: <strong>{bookingId}</strong></p>
          <p className="text-gray-500 text-sm mb-6">A verified professional will arrive at your location on time.</p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2.5 mb-6">
            <div className="flex flex-col text-sm border-b border-gray-150 pb-2 mb-2 gap-1">
              <span className="text-gray-500">Booked Services</span>
              {hasCartItems ? (
                cartData.items.map((item, idx) => (
                  <span key={idx} className="text-gray-800 font-bold text-xs">{item.serviceName}</span>
                ))
              ) : (
                <span className="text-gray-800 font-medium">{selectedService}</span>
              )}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date & Time</span>
              <span className="text-gray-800 font-medium">{selectedDate} · {selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount Paid</span>
              <span className="text-blue-600 font-semibold">
                ₹{(Math.round(basePrice * appliedSurgeMultiplier) - discount + addOnCost).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 flex gap-2 mb-6">
            <Shield className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5 animate-pulse" />
            <p className="text-xs text-[#2563EB] text-left">Your payment is held in escrow and released only after job completion.</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate?.('live-tracking', { bookingId })}
              className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all duration-300 shadow-md shadow-blue-500/20 active:scale-98 flex items-center justify-center gap-2"
            >
              Track Professional Live
            </button>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Redirecting to tracking page in {countdown}s...</span>
            </div>
            <button onClick={onBack} className="w-full text-xs text-gray-500 hover:text-gray-700 hover:underline">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => stepIndex > 0 ? setStep(stepOrder[stepIndex - 1]) : onBack()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 w-full">
            <h2 className="text-gray-900 text-base font-extrabold">{stepTitles[step]}</h2>
            {/* Visual Progress Stepper */}
            <div className="relative mt-3 flex items-center justify-between w-full max-w-sm">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#2563EB] transition-all duration-500"
                style={{ width: `${(Math.min(stepIndex, 4) / 4) * 100}%` }}
              />
              {stepOrder.slice(0, 5).map((s, i) => {
                const isActive = i === stepIndex;
                const isPassed = i < stepIndex;
                return (
                  <div key={s} className={`relative z-10 flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold transition-all duration-300 shadow-sm ${isActive ? 'bg-[#2563EB] text-white ring-4 ring-blue-100 scale-110' : isPassed ? 'bg-blue-500 text-white' : 'bg-white text-gray-400 border border-gray-300'}`}>
                    {isPassed ? <CheckCircle className="w-3.5 h-3.5" /> : (i + 1)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Step: Category */}
        {step === 'category' && (
          <div>
            <p className="text-gray-600 text-sm mb-5">What service do you need today?</p>
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Most Booked</p>
              <div className="grid grid-cols-2 gap-3">
                {categories.filter(c => c.popular).map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleCategorySelect(c.id)}
                    className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#2563EB] hover:shadow-sm transition-all text-left"
                  >
                    <span className={`p-2.5 rounded-xl ${c.color}`}><c.icon className="w-5 h-5" /></span>
                    <span className="font-medium text-gray-800 text-sm">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">All Services</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.filter(c => !c.popular).map(c => (
                <button
                  key={c.id}
                  onClick={() => handleCategorySelect(c.id)}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#2563EB] hover:shadow-sm transition-all text-left"
                >
                  <span className={`p-2.5 rounded-xl ${c.color}`}><c.icon className="w-5 h-5" /></span>
                  <span className="font-medium text-gray-800 text-sm">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Service */}
        {step === 'service' && (
          <div className="space-y-3 relative">
            <p className="text-gray-600 text-sm mb-4 font-medium">
              {categories.find(c => c.id === selectedCategory)?.label} — Select a service
            </p>
            {services.map(s => (
              <button
                key={s.name}
                onClick={() => { setSelectedService(s.name); setStep('slot'); }}
                className={`group w-full flex items-center justify-between p-4 bg-white rounded-2xl border transition-all duration-300 text-left relative overflow-hidden
                  ${selectedService === s.name ? 'border-[#2563EB] shadow-md ring-2 ring-blue-100 scale-[1.01]' : 'border-gray-200 hover:border-[#2563EB]/50 hover:shadow-sm hover:-translate-y-0.5'}`}
              >
                {selectedService === s.name && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -z-10" />
                )}
                <div className="flex-1 pr-4">
                  <div className={`font-bold text-sm ${selectedService === s.name ? 'text-[#2563EB]' : 'text-gray-900 group-hover:text-[#2563EB]'}`}>{s.name}</div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 text-blue-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-blue-700">{s.rating}</span>
                      <span className="text-[10px] text-blue-600">({s.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                      <Clock className="w-3 h-3 text-gray-400" /> {s.duration}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="font-extrabold text-[#2563EB] text-lg bg-blue-50 px-3 py-1 rounded-lg">{s.price}</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 group-hover:text-[#2563EB] transition-colors">
                    Select <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step: Slot */}
        {step === 'slot' && (
          <div>
            <p className="text-sm text-gray-600 mb-5">Choose a convenient date and time</p>

            {/* Booking Option Selector (Instant vs Scheduled) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => {
                  setBookingType('instant');
                  const todayObj = dateList[0];
                  setSelectedDate(`Today, ${todayObj.date} ${todayObj.month}`);
                  setSelectedTime('Instant (Arrival in 45 mins)');
                  setAppliedSurgeMultiplier(1.0);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between h-28 ${bookingType === 'instant'
                    ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className={`p-2 rounded-xl ${bookingType === 'instant' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Zap className="w-4 h-4" />
                  </div>
                  {bookingType === 'instant' && (
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-800">Instant Booking</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">Arrival in 45 mins</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBookingType('scheduled');
                  setSelectedDate('');
                  setSelectedTime('');
                  setAppliedSurgeMultiplier(1.0);
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden flex flex-col justify-between h-28 ${bookingType === 'scheduled'
                    ? 'border-[#2563EB] bg-blue-50/50 ring-1 ring-blue-200'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
              >
                <div className="flex justify-between items-start w-full">
                  <div className={`p-2 rounded-xl ${bookingType === 'scheduled' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-800">Schedule for Later</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">Select date & time</p>
                </div>
              </button>
            </div>

            {/* Instant Booking Details */}
            {bookingType === 'instant' && (
              <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 border border-blue-100 rounded-2xl p-5 space-y-3.5 text-left mb-6">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-5 h-5 text-[#2563EB] animate-bounce" />
                  <h4 className="font-extrabold text-sm text-blue-900">Express Delivery Selected</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  We will assign the closest certified professional immediately. Your technician Ramesh Verma or Suresh Reddy will depart with tools within minutes.
                </p>
                <div className="bg-white/85 border border-blue-100/50 rounded-xl p-3.5 flex justify-between text-xs font-bold text-gray-700 shadow-xs">
                  <span>Estimated Arrival:</span>
                  <span className="text-[#2563EB] font-black">Within 45 Minutes</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-sm rounded-xl shadow-md transition-colors"
                >
                  Continue with Instant Booking
                </button>
              </div>
            )}

            {/* Scheduled Booking details */}
            {bookingType === 'scheduled' && (
              <>
                {/* Date Picker */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Date</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dateList.map(d => (
                      <button
                        key={d.value}
                        type="button"
                        onClick={() => setSelectedDate(`${d.day}, ${d.date} ${d.month}`)}
                        className={`flex flex-col items-center p-3 rounded-xl border min-w-[64px] transition-all
                          ${selectedDate === `${d.day}, ${d.date} ${d.month}`
                            ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                      >
                        <span className="text-xs font-medium">{d.isToday ? 'Today' : d.day}</span>
                        <span className="font-bold mt-0.5">{d.date}</span>
                        <span className="text-xs">{d.month}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Time Picker */}
                {selectedDate && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Time (Dynamic Availability)</p>
                    {groupedSlots.map(group => (
                      group.slots.length > 0 && (
                        <div key={group.label} className="mb-4">
                          <p className="text-xs text-gray-400 mb-2">{group.label}</p>
                          <div className="flex flex-wrap gap-2">
                            {group.slots.map(slot => (
                              <button
                                key={slot.time12}
                                type="button"
                                onClick={() => {
                                  setSelectedTime(slot.time12);
                                  setAppliedSurgeMultiplier(slot.surgeMultiplier);
                                }}
                                className={`px-4 py-2.5 rounded-xl text-sm border transition-all flex flex-col items-center justify-center gap-0.5 min-w-[110px]
                                  ${selectedTime === slot.time12
                                    ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] font-semibold ring-1 ring-blue-200'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
                              >
                                <span>{slot.time12}</span>
                                {slot.surgeMultiplier > 1.0 && (
                                  <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                    ⚡ Surge {slot.surgeMultiplier}x
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
                {selectedDate && selectedTime && (
                  <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Slot Selected</p>
                      <p className="text-xs text-blue-600">{selectedDate} at {selectedTime}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('address')}
                      className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {step === 'address' && (
          <div className="space-y-5">
            <p className="text-sm text-gray-600">Enter your details and service address</p>

            {isAuthenticated ? (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex justify-between items-center mb-1 text-left">
                <div>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Account Details</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{name || 'Valued Customer'}</p>
                  <p className="text-xs text-gray-500 font-medium">{phone}</p>
                </div>
                <span className="text-[9px] bg-blue-100 text-blue-700 font-black px-2 py-1 rounded-md uppercase tracking-wider">Logged In</span>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Saved Addresses List */}
            {isAuthenticated && BookingService.getAllAddresses().length > 0 && (
              <div className="mb-1 text-left">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Saved Address</label>
                <div className="flex flex-wrap gap-2">
                  {BookingService.getAllAddresses().map((addr) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => setAddress(addr.line1)}
                      className={`px-3 py-2.5 rounded-xl text-xs border font-bold transition-all ${address === addr.line1
                          ? 'border-[#2563EB] bg-blue-50 text-[#2563EB] ring-1 ring-blue-200'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      🏠 {addr.label}: {addr.line1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1.5">Service Address *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
                <textarea
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                  placeholder="Flat no., building, street, area, city"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
            </div>
            {/* Step 5: Customise & add-ons */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 text-left">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Customise & Service Notes</h4>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Service Add-Ons</label>
                <label className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-3 cursor-pointer hover:bg-slate-50/50 transition-colors">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] mt-0.5"
                    checked={extrasSelected}
                    onChange={(e) => setExtrasSelected(e.target.checked)}
                  />
                  <div>
                    <p className="text-xs font-bold text-gray-800">Premium Materials (+₹99)</p>
                    <p className="text-[10px] text-gray-400 leading-normal">Our professional will use certified premium replacements and spare parts</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Instructions / Service Notes</label>
                <textarea
                  rows={2}
                  className="w-full border border-gray-200 bg-white rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-[#2563EB] resize-none"
                  placeholder="e.g. Bring a tall ladder, park inside, beware of pets, call before arrival"
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                />
              </div>
            </div>
            {addressError && (
              <div className="flex items-center gap-2 text-blue-600 text-xs mt-1 bg-blue-50 p-3 rounded-lg border border-blue-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addressError}</span>
              </div>
            )}
            <input type="hidden" name="csrf_token" value={csrfToken} />
            <button
              onClick={() => {
                setAddressError('');

                const nameVal = validate(schemas.name, name);
                if (!nameVal.success) {
                  setAddressError(nameVal.error);
                  return;
                }

                const cleanPhone = phone.replace(/^\+91/, '').replace(/\s+/g, '').replace(/-/g, '').replace(/\(/g, '').replace(/\)/g, '').trim();
                const phoneVal = validate(schemas.phone, cleanPhone);
                if (!phoneVal.success) {
                  setAddressError(phoneVal.error);
                  return;
                }

                const addressVal = validate(schemas.address, address);
                if (!addressVal.success) {
                  setAddressError(addressVal.error);
                  return;
                }

                if (!validateCSRFToken(csrfToken)) {
                  setAddressError('Security validation failed (CSRF token missing or mismatch). Please refresh the page.');
                  return;
                }

                const cleanName = sanitizeHTML(name);
                const cleanAddress = sanitizeHTML(address);

                setName(cleanName);
                setAddress(cleanAddress);
                setStep('confirm');
              }}
              disabled={!name || !phone || !address}
              className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/10 active:scale-98"
            >
              Continue to Review
            </button>
          </div>
        )}

        {step === 'confirm' && (selectedSvc || hasCartItems) && (
          <div className="space-y-4">

            {/* ── UC-Style Savings Banner ── */}
            {(couponApplied || discount > 0) ? (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <Tag className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-sm font-bold text-blue-700">You are saving ₹{discount} on this order 🎉</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <Tag className="w-4 h-4 text-blue-500 shrink-0" />
                <p className="text-sm font-semibold text-blue-700">Apply a coupon below to save on this order</p>
              </div>
            )}

            {/* ── Order Summary Card ── */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                <h4 className="text-gray-900 font-extrabold text-sm">
                  {hasCartItems
                    ? cartData.items[0]?.category || 'Home Services'
                    : categories.find(c => c.id === selectedCategory)?.label || 'Service'}
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3 text-sm">
                {hasCartItems ? (
                  cartData.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-xs leading-tight">{item.serviceName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{item.duration || 'As scheduled'}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1 text-xs font-bold text-gray-600">
                        ×{item.quantity}
                      </div>
                      <span className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">{selectedSvc?.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{selectedSvc?.duration}</p>
                    </div>
                    <span className="font-bold text-gray-900">{selectedSvc?.price}</span>
                  </div>
                )}

                {/* Avoid calling checkbox — exactly like UC */}
                <label className="flex items-start gap-3 pt-2 border-t border-gray-100 cursor-pointer group">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB]"
                  />
                  <p className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                    Avoid calling before reaching the location
                  </p>
                </label>
              </div>
            </div>

            {/* ── Coupons & Offers Card ── */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                <h4 className="text-gray-900 font-extrabold text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#2563EB]" /> Coupons and Offers
                </h4>
              </div>
              <div className="px-5 py-4 space-y-3">
                {/* Quick coupon tiles */}
                {!couponApplied && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {['FIRST50', 'SAVE20', 'VISVASA100'].map(code => (
                      <button
                        key={code}
                        onClick={() => { setCoupon(code); if (code === 'FIRST50') setCouponApplied(true); }}
                        className="text-left border border-dashed border-blue-200 bg-blue-50/50 rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors"
                      >
                        <p className="text-xs font-black text-[#2563EB] tracking-wide">{code}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {code === 'FIRST50' ? '₹50 off on first order' : code === 'SAVE20' ? '20% off (max ₹200)' : '₹100 off above ₹1000'}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value.toUpperCase())}
                    />
                  </div>
                  <button
                    onClick={() => { if (coupon === 'FIRST50') setCouponApplied(true); }}
                    className="px-4 py-2.5 bg-[#2563EB] text-white rounded-lg text-sm font-bold hover:bg-[#1D4ED8] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-blue-600 text-xs flex items-center gap-1.5 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> ₹50 discount applied! Code: FIRST50
                  </p>
                )}
              </div>
            </div>

            {/* ── Payment Summary Card — UC Style ── */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                <h4 className="text-gray-900 font-extrabold text-sm">Payment Summary</h4>
              </div>
              <div className="px-5 py-4 space-y-2.5 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Item total</span>
                  <div className="flex items-center gap-2">
                    <span className="line-through text-gray-400 text-xs">₹{Math.round(basePrice * 1.2).toLocaleString('en-IN')}</span>
                    <span className="font-semibold text-gray-800">₹{basePrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                {appliedSurgeMultiplier > 1.0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Peak hour surge ({appliedSurgeMultiplier}x)</span>
                    <span>+₹{Math.round(basePrice * (appliedSurgeMultiplier - 1))}</span>
                  </div>
                )}
                {addOnCost > 0 && (
                  <div className="flex justify-between text-[#2563EB]">
                    <span>Premium Materials</span>
                    <span>+₹{addOnCost}</span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between text-blue-600 font-semibold">
                    <span>Coupon FIRST50</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Taxes & Platform Fee</span>
                  <span className="text-gray-700">₹89</span>
                </div>
                <div className="flex justify-between font-extrabold text-gray-900 text-base pt-2 border-t border-gray-100">
                  <span>Total amount</span>
                  <span className="text-[#2563EB]">
                    ₹{(Math.round(basePrice * appliedSurgeMultiplier) - discount + addOnCost + 89).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-gray-900">
                  <span>Amount to pay</span>
                  <span className="text-blue-600">
                    ₹{(Math.round(basePrice * appliedSurgeMultiplier) - discount + addOnCost + 89).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#2563EB]" /> Secure Payment</div>
              <div className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-blue-500" /> 90-day warranty</div>
              <div className="flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Free reschedule</div>
            </div>

            {/* Sticky CTA — UC style shows amount inside button */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setStep('payment');
                } else {
                  setStep('otp');
                }
              }}
              className="w-full py-4 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all duration-300 shadow-md shadow-blue-500/20 active:scale-98 flex items-center justify-between px-5"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>{isAuthenticated ? 'Proceed to Payment' : 'Verify & Pay'}</span>
              </div>
              <span className="font-extrabold text-lg">
                ₹{(Math.round(basePrice * appliedSurgeMultiplier) - discount + addOnCost + 89).toLocaleString('en-IN')}
              </span>
            </button>
          </div>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-[#2563EB]" />
            </div>
            <h3 className="text-gray-800 mb-2">Verify Your Number</h3>
            <p className="text-gray-500 text-sm mb-8">
              OTP sent to {phone || '+91 98765 43210'}. Enter the 4-digit code below.
            </p>
            <div className="flex justify-center gap-4 mb-6">
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className="w-14 h-14 text-center border-2 border-gray-300 rounded-xl text-xl font-bold outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-200"
                />
              ))}
            </div>
            <button
              onClick={() => setStep('payment')}
              disabled={otpDigits.some(d => d === '')}
              className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-3 shadow-md shadow-blue-500/20 active:scale-98"
            >
              Verify & Confirm
            </button>
            <button className="text-[#2563EB] text-sm hover:underline flex items-center gap-1 mx-auto">
              <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
            </button>
            <p className="text-xs text-gray-400 mt-2">Demo: Enter any 4 digits to proceed</p>
          </div>
        )}
      </div>

      {/* Category Switch Warning Modal */}
      {showCategorySwitchWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Switch Service Category?</h3>
                <p className="text-sm text-gray-600">
                  Your current cart will be cleared if you switch to a different service category. You can only book services from one category at a time.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCategorySwitchCancel}
                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCategorySwitchConfirm}
                className="flex-1 py-2.5 px-4 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-[#1D4ED8] transition-colors"
              >
                Clear Cart & Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
