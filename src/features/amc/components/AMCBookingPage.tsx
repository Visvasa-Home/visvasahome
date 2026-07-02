import { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, CheckCircle2, Shield, Calendar,
  MapPin, Phone, User, CreditCard, Sparkles, Home, Building2,
  Clock, BadgeCheck, AlertCircle
} from 'lucide-react';
import { getAMCPackages, purchaseAMC, type AMCPackage } from '@amc/services/amcService';

interface AMCBookingPageProps {
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
  preSelectedPackageId?: string;
  selectedCategory?: string;
  onPaymentSuccess?: (phone: string, name: string) => void;
}

// ─── Step types ───────────────────────────────────────────────────────────────
type Step = 'select-plan' | 'details' | 'schedule' | 'payment' | 'confirmation';

const STEPS: { id: Step; label: string }[] = [
  { id: 'select-plan', label: 'Choose Plan' },
  { id: 'details', label: 'Your Details' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'payment', label: 'Payment' },
  { id: 'confirmation', label: 'Confirmed' },
];

const TIER_COLORS: Record<string, string> = {
  platinum: 'from-purple-600 to-purple-800',
  gold: 'from-amber-500 to-yellow-600',
  silver: 'from-slate-400 to-slate-600',
  premium: 'from-blue-600 to-blue-800',
  basic: 'from-emerald-500 to-teal-600',
};

const TIER_BG: Record<string, string> = {
  platinum: 'bg-purple-50 border-purple-200',
  gold: 'bg-amber-50 border-amber-200',
  silver: 'bg-slate-50 border-slate-200',
  premium: 'bg-blue-50 border-blue-200',
  basic: 'bg-emerald-50 border-emerald-200',
};

const TIME_SLOTS = [
  '08:00 AM – 10:00 AM',
  '10:00 AM – 12:00 PM',
  '12:00 PM – 02:00 PM',
  '02:00 PM – 04:00 PM',
  '04:00 PM – 06:00 PM',
];

const INDIAN_STATES = [
  'Rajasthan', 'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu',
  'Gujarat', 'Uttar Pradesh', 'Madhya Pradesh', 'Haryana', 'Punjab',
  'West Bengal', 'Telangana', 'Andhra Pradesh', 'Kerala', 'Bihar',
];

export function AMCBookingPage({ onBack, onNavigate, preSelectedPackageId, selectedCategory, onPaymentSuccess }: AMCBookingPageProps) {
  const [step, setStep] = useState<Step>(preSelectedPackageId ? 'details' : 'select-plan');
  const [packages, setPackages] = useState<AMCPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<AMCPackage | null>(null);
  const [contractNumber, setContractNumber] = useState('');

  // Form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Rajasthan',
    pincode: '',
    propertyType: 'apartment' as 'apartment' | 'villa' | 'office' | 'society',
    bhk: '2BHK',
    preferredDate: '',
    preferredTime: TIME_SLOTS[1],
    paymentMethod: 'upi' as 'upi' | 'card' | 'netbanking',
    upiId: '',
    autoRenew: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    // Filter packages by category if provided, otherwise show all
    getAMCPackages(selectedCategory || undefined).then(pkgs => {
      setPackages(pkgs);
      if (preSelectedPackageId) {
        const pkg = pkgs.find(p => p.id === preSelectedPackageId);
        if (pkg) setSelectedPkg(pkg);
      }
      setLoading(false);
    });
  }, [preSelectedPackageId, selectedCategory]);

  // Minimum date = today
  const today = new Date().toISOString().split('T')[0];
  // Max date = 30 days from now
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const currentStepIndex = STEPS.findIndex(s => s.id === step);

  const update = (field: keyof typeof form, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 'details') {
      if (!form.name.trim()) errs.name = 'Full name is required';
      if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number';
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
      if (!form.address.trim()) errs.address = 'Address is required';
      if (!form.city.trim()) errs.city = 'City is required';
      if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit PIN code';
    }
    if (step === 'schedule') {
      if (!form.preferredDate) errs.preferredDate = 'Please select a preferred visit date';
    }
    if (step === 'payment') {
      if (form.paymentMethod === 'upi' && !form.upiId.trim()) errs.upiId = 'Enter your UPI ID';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (!validate()) return;
    const idx = STEPS.findIndex(s => s.id === step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1].id);
  };

  const prevStep = () => {
    const idx = STEPS.findIndex(s => s.id === step);
    if (idx > 0) setStep(STEPS[idx - 1].id);
    else onBack();
  };

  const handlePayment = async () => {
    if (!validate() || !selectedPkg) return;
    setPaymentLoading(true);
    // Simulate payment gateway delay
    await new Promise(res => setTimeout(res, 2000));
    const result = await purchaseAMC(
      form.phone, // Use customer phone as customerId to load contracts correctly
      form.name,
      selectedPkg.id,
      `PAY_${Date.now()}`
    );
    setPaymentLoading(false);
    if (result.success && result.contract) {
      setContractNumber(result.contract.contractNumber);
      
      // Auto-authenticate customer in simulator
      localStorage.setItem('visvasahome_user_phone', form.phone);
      localStorage.setItem('visvasahome_user_name', form.name);
      localStorage.setItem('visvasahome_user_email', form.email || '');
      localStorage.setItem('session_info', JSON.stringify({
        userId: form.phone,
        createdAt: Date.now(),
        lastActivity: Date.now(),
        deviceFingerprint: 'simulated_device'
      }));

      // Sync React auth state so amc-dashboard is accessible immediately
      if (onPaymentSuccess) {
        onPaymentSuccess(form.phone, form.name);
      }

      setStep('confirmation');
    }
  };

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-semibold text-sm">Loading AMC Plans…</p>
        </div>
      </div>
    );
  }

  // ─── Progress Bar ────────────────────────────────────────────────────────────
  const ProgressBar = () => (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 min-w-0">
              <div className={`flex items-center gap-1.5 flex-shrink-0 ${i <= currentStepIndex ? 'text-blue-600' : 'text-slate-300'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                  i < currentStepIndex ? 'bg-blue-600 text-white' :
                  i === currentStepIndex ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                  'bg-slate-200 text-slate-400'
                }`}>
                  {i < currentStepIndex ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[10px] font-extrabold hidden sm:block whitespace-nowrap ${i <= currentStepIndex ? 'text-blue-700' : 'text-slate-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${i < currentStepIndex ? 'bg-blue-600' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── STEP 1: Plan Selection ──────────────────────────────────────────────────
  if (step === 'select-plan') {
    return (
      <div className="min-h-screen bg-slate-50 pb-32">
        <ProgressBar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-bold mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <h1 className="text-2xl font-black text-slate-900 mb-1">Choose Your AMC Plan</h1>
          <p className="text-sm text-slate-500 font-semibold mb-7">
            Annual maintenance contracts starting at ₹1,999/yr — transparent pricing, no hidden charges.
          </p>

          <div className="space-y-3">
            {packages.map(pkg => {
              const isSelected = selectedPkg?.id === pkg.id;
              return (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPkg(pkg)}
                  className={`w-full text-left rounded-3xl border-2 p-5 transition-all duration-200 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 shadow-md shadow-blue-600/10'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${TIER_COLORS[pkg.tier] || TIER_COLORS.basic} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm leading-tight">{pkg.name}</p>
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5 capitalize">{pkg.tier} · {pkg.visitsPerYear} visits/year</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {pkg.price > 0 ? (
                            <>
                              <p className="text-lg font-black text-slate-900">₹{pkg.price.toLocaleString('en-IN')}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">per year</p>
                            </>
                          ) : (
                            <p className="text-sm font-black text-blue-600">Custom Quote</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {pkg.coverage.slice(0, 4).map(c => (
                          <span key={c} className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">{c}</span>
                        ))}
                        {pkg.coverage.length > 4 && (
                          <span className="text-[10px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded-full">+{pkg.coverage.length - 4} more</span>
                        )}
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 transition-all ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                      {isSelected && <CheckCircle2 className="w-full h-full text-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-xl px-4 py-4 z-40">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <div className="flex-1 min-w-0">
              {selectedPkg ? (
                <>
                  <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Selected Plan</p>
                  <p className="font-extrabold text-slate-900 text-sm truncate">{selectedPkg.name}</p>
                </>
              ) : (
                <p className="text-sm text-slate-400 font-semibold">Select a plan to continue</p>
              )}
            </div>
            <button
              disabled={!selectedPkg}
              onClick={() => setStep('details')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-sm px-6 py-3 rounded-2xl transition-all"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2: Your Details ────────────────────────────────────────────────────
  if (step === 'details') {
    return (
      <div className="min-h-screen bg-slate-50 pb-32">
        <ProgressBar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button onClick={prevStep} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-bold mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <h2 className="text-xl font-black text-slate-900 mb-1">Your Details</h2>
          <p className="text-sm text-slate-500 font-semibold mb-7">We'll use these to create your AMC contract and assign a service partner.</p>

          <div className="space-y-5">
            {/* Personal Info */}
            <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Personal Info
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Rajesh Kumar"
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {errors.name && <p className="text-red-500 text-xs font-bold mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">Mobile Number *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">Email (Optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="rajesh@email.com"
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                />
                {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Service Address
              </p>
              <div>
                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">Full Address *</label>
                <textarea
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  placeholder="Flat 4B, Sunshine Apartments, MG Road"
                  rows={2}
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${errors.address ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                />
                {errors.address && <p className="text-red-500 text-xs font-bold mt-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => update('city', e.target.value)}
                    placeholder="Jaipur"
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.city ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {errors.city && <p className="text-red-500 text-xs font-bold mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">State</label>
                  <select
                    value={form.state}
                    onChange={e => update('state', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">PIN Code *</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={e => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="302001"
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.pincode ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {errors.pincode && <p className="text-red-500 text-xs font-bold mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Home className="w-3.5 h-3.5" /> Property Details
              </p>
              <div>
                <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-2">Property Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['apartment', 'villa', 'office', 'society'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => update('propertyType', type)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold capitalize transition-all ${
                        form.propertyType === type
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-500 hover:border-blue-300'
                      }`}
                    >
                      {type === 'apartment' ? '🏢 Apartment' :
                       type === 'villa' ? '🏡 Villa' :
                       type === 'office' ? '🏢 Office' : '🏘️ Society'}
                    </button>
                  ))}
                </div>
              </div>
              {(form.propertyType === 'apartment' || form.propertyType === 'villa') && (
                <div>
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-2">Property Size</label>
                  <div className="flex flex-wrap gap-2">
                    {['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+'].map(bhk => (
                      <button
                        key={bhk}
                        onClick={() => update('bhk', bhk)}
                        className={`py-2 px-4 rounded-xl border text-xs font-extrabold transition-all ${
                          form.bhk === bhk
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-500 hover:border-blue-300'
                        }`}
                      >
                        {bhk}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-xl px-4 py-4 z-40">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={nextStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              Continue to Schedule <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 3: Schedule ────────────────────────────────────────────────────────
  if (step === 'schedule') {
    return (
      <div className="min-h-screen bg-slate-50 pb-32">
        <ProgressBar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button onClick={prevStep} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-bold mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <h2 className="text-xl font-black text-slate-900 mb-1">Schedule First Visit</h2>
          <p className="text-sm text-slate-500 font-semibold mb-7">Pick a convenient date and time for your first AMC inspection visit.</p>

          <div className="space-y-5">
            <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Preferred Date
              </p>
              <input
                type="date"
                value={form.preferredDate}
                min={today}
                max={maxDate}
                onChange={e => update('preferredDate', e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.preferredDate ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
              />
              {errors.preferredDate && <p className="text-red-500 text-xs font-bold mt-1">{errors.preferredDate}</p>}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Preferred Time Slot
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    onClick={() => update('preferredTime', slot)}
                    className={`py-3 px-4 rounded-xl border text-sm font-extrabold transition-all text-left ${
                      form.preferredTime === slot
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected plan summary */}
            {selectedPkg && (
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5">
                <p className="text-xs font-extrabold text-blue-500 uppercase tracking-widest mb-2">Selected Plan</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-slate-900">{selectedPkg.name}</p>
                    <p className="text-xs text-slate-500 font-semibold">{selectedPkg.visitsPerYear} visits · 12 months coverage</p>
                  </div>
                  {selectedPkg.price > 0 && (
                    <p className="text-lg font-black text-blue-700">₹{selectedPkg.price.toLocaleString('en-IN')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-xl px-4 py-4 z-40">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={nextStep}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              Continue to Payment <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 4: Payment ─────────────────────────────────────────────────────────
  if (step === 'payment') {
    return (
      <div className="min-h-screen bg-slate-50 pb-32">
        <ProgressBar />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button onClick={prevStep} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-bold mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <h2 className="text-xl font-black text-slate-900 mb-1">Secure Payment</h2>
          <p className="text-sm text-slate-500 font-semibold mb-7">Complete payment to activate your AMC contract immediately.</p>

          <div className="space-y-5">
            {/* Order Summary */}
            {selectedPkg && (
              <div className="bg-slate-900 text-white rounded-3xl p-5">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Order Summary</p>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-extrabold">{selectedPkg.name}</p>
                    <p className="text-xs text-slate-400 font-semibold">{selectedPkg.visitsPerYear} visits · {form.bhk} {form.propertyType}</p>
                    <p className="text-xs text-slate-400 font-semibold">{form.city}, {form.state}</p>
                  </div>
                  <p className="text-2xl font-black text-white">₹{selectedPkg.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="border-t border-slate-800 mt-3 pt-3 flex justify-between text-xs font-bold text-slate-400">
                  <span>GST (18% on service charges)</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-white mt-1">
                  <span>Total Payable</span>
                  <span>₹{selectedPkg.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5" /> Payment Method
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(['upi', 'card', 'netbanking'] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => update('paymentMethod', method)}
                    className={`py-3 rounded-xl border text-xs font-extrabold transition-all ${
                      form.paymentMethod === method
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-500 hover:border-blue-300'
                    }`}
                  >
                    {method === 'upi' ? '📱 UPI' : method === 'card' ? '💳 Card' : '🏦 Net Banking'}
                  </button>
                ))}
              </div>

              {form.paymentMethod === 'upi' && (
                <div>
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider block mb-1.5">UPI ID *</label>
                  <input
                    type="text"
                    value={form.upiId}
                    onChange={e => update('upiId', e.target.value)}
                    placeholder="yourname@upi"
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.upiId ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {errors.upiId && <p className="text-red-500 text-xs font-bold mt-1">{errors.upiId}</p>}
                </div>
              )}

              {form.paymentMethod === 'card' && (
                <div className="space-y-3">
                  <input type="text" placeholder="Card Number" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM / YY" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="CVV" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <input type="text" placeholder="Name on Card" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              )}

              {form.paymentMethod === 'netbanking' && (
                <select className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select Your Bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                  <option>Punjab National Bank</option>
                </select>
              )}
            </div>

            {/* Auto Renew */}
            <div className="bg-white rounded-3xl border border-slate-100 p-5 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm font-extrabold text-slate-900">Auto-Renew Contract</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Automatically renew 30 days before expiry</p>
              </div>
              <button
                onClick={() => update('autoRenew', !form.autoRenew)}
                className={`w-12 h-6 rounded-full transition-all duration-200 relative flex-shrink-0 ${form.autoRenew ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${form.autoRenew ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Security notice */}
            <div className="flex items-start gap-2.5 text-xs text-slate-500 font-semibold">
              <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              Payments are secured with 256-bit SSL encryption. Your card details are never stored on our servers.
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-xl px-4 py-4 z-40">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
            >
              {paymentLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Payment…
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay ₹{selectedPkg?.price.toLocaleString('en-IN')} & Activate AMC
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 5: Confirmation ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Success icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] font-extrabold text-amber-600 uppercase tracking-widest">AMC Activated Successfully</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">You're Protected!</h2>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            Your Annual Maintenance Contract is now active. A service partner will contact you within 24 hours to confirm your first visit.
          </p>
        </div>

        {/* Contract Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 text-left space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Contract ID</p>
            <p className="font-mono font-black text-slate-900 text-sm bg-slate-100 px-3 py-1 rounded-xl">{contractNumber}</p>
          </div>
          <div className="flex justify-between items-center border-t border-slate-50 pt-3">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Plan</p>
            <p className="text-sm font-extrabold text-slate-900">{selectedPkg?.name}</p>
          </div>
          <div className="flex justify-between items-center border-t border-slate-50 pt-3">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">First Visit</p>
            <p className="text-sm font-extrabold text-slate-900">
              {form.preferredDate
                ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(form.preferredDate))
                : 'To be confirmed'}
            </p>
          </div>
          <div className="flex justify-between items-center border-t border-slate-50 pt-3">
            <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Contact</p>
            <p className="text-sm font-extrabold text-slate-900">{form.phone}</p>
          </div>
        </div>

        {/* What's next */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 text-left space-y-2.5">
          <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-3">What Happens Next</p>
          {[
            'Contract PDF will be emailed to you within 1 hour',
            'Service partner assigned within 24 hours',
            'First visit confirmed via SMS/call',
            'Track all visits in your AMC Dashboard',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 font-semibold">{item}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('amc-dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-2xl text-sm transition-all flex items-center justify-center gap-1.5"
          >
            <Shield className="w-4 h-4" /> My AMC
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="bg-white border border-slate-200 hover:border-blue-300 text-slate-700 font-extrabold py-3.5 rounded-2xl text-sm transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
