import { useState, useEffect } from 'react';
import {
  Shield, Calendar, CheckCircle2, Clock, ChevronRight, ChevronLeft,
  FileText, Phone, Building2, AlertCircle, Star, Sparkles, Bell, Download,
  Wrench, Zap, AlertTriangle, RefreshCw, XCircle, ArrowRight,
  CheckCircle, Activity, DropletIcon, ThermometerIcon, Plus, ChevronDown,
  MessageSquare, Camera, MapPin, User, Navigation
} from 'lucide-react';



interface AMCManagementDashboardProps {
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface ServiceRequest {
  id: string;
  type: 'scheduled' | 'breakdown';
  description: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  submittedAt: string;
  spName?: string;
}

// ─── Mock subscription data ───────────────────────────────────────────────────
const mockSubscription = {
  id: 'AMC-2026-0421',
  planName: 'Home Shield Gold AMC',
  tier: 'gold',
  status: 'active',
  startDate: '2026-01-15',
  endDate: '2026-12-31',
  visitsTotal: 4,
  visitsUsed: 2,
  nextVisitDate: '2026-07-20',
  monthlyAmount: 1499,
  totalAmount: 17988,
  coverage: ['AC Service', 'Plumbing', 'Electrical', 'Pest Control'],
  spName: 'Ramesh Technician (Verified)',
  spPhone: '+91 98765 12340',
};

const mockVisits = [
  {
    id: 'VIS-001', visitDate: '2026-01-28', visitTime: '10:00 AM', status: 'completed',
    spName: 'Ramesh Technician', serviceType: 'AC Service + Plumbing Check', rating: 5,
    notes: 'AC cleaned and serviced. Replaced worn filter pads. Kitchen tap washer replaced.',
    reportUrl: '/reports/VIS-001.pdf',
  },
  {
    id: 'VIS-002', visitDate: '2026-04-15', visitTime: '11:30 AM', status: 'completed',
    spName: 'Deepak Electrician', serviceType: 'Electrical Safety Audit + Pest Spray', rating: 4,
    notes: 'All wiring checked, MCB tested. One loose switchboard tightened. Pest spray done.',
    reportUrl: '/reports/VIS-002.pdf',
  },
  {
    id: 'VIS-003', visitDate: '2026-07-20', visitTime: '10:00 AM', status: 'upcoming',
    spName: 'Ramesh Technician', serviceType: 'AC Pre-monsoon Service + General Plumbing', rating: null, notes: null, reportUrl: null,
  },
  {
    id: 'VIS-004', visitDate: '2026-10-25', visitTime: '10:00 AM', status: 'scheduled',
    spName: 'TBD', serviceType: 'Pre-winter Electrical Check + Pest Control', rating: null, notes: null, reportUrl: null,
  },
];

// Appliance health mock data (Step 6 — Active Plan Period)
const applianceHealth = [
  { name: 'Split AC (1.5T)', icon: '❄️', health: 78, lastService: '28 Jan 2026', nextAlert: 'Filter due in 23 days', status: 'good' },
  { name: 'Water Purifier (RO)', icon: '💧', health: 45, lastService: '28 Jan 2026', nextAlert: 'Membrane change overdue', status: 'warning' },
  { name: 'Geyser', icon: '🔥', health: 90, lastService: '28 Jan 2026', nextAlert: 'Next check in 3 months', status: 'good' },
  { name: 'Kitchen Chimney', icon: '🌬️', health: 60, lastService: '15 Apr 2026', nextAlert: 'Filter clean due soon', status: 'fair' },
];

const TABS = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'visits', label: 'Visits', icon: Calendar },
  { id: 'request', label: 'Raise Request', icon: Wrench },
  { id: 'renewal', label: 'Renewal', icon: RefreshCw },
] as const;

type TabId = typeof TABS[number]['id'];

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  completed: { label: 'Completed', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' },
  upcoming: { label: 'Upcoming', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100', dot: 'bg-blue-500 animate-pulse' },
  scheduled: { label: 'Scheduled', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100', dot: 'bg-amber-500' },
  inprogress: { label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500 animate-ping' },
};

export const AMCManagementDashboard = ({ onBack, onNavigate }: AMCManagementDashboardProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [requestType, setRequestType] = useState<'scheduled' | 'breakdown'>('scheduled');
  const [requestDesc, setRequestDesc] = useState('');
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [renewalChoice, setRenewalChoice] = useState<'renew' | 'lapse' | null>(null);
  const [renewalConfirmed, setRenewalConfirmed] = useState(false);
  const [b2bFormData, setB2bFormData] = useState({ orgName: '', contactName: '', phone: '', units: '', city: '', message: '' });
  const [b2bSubmitted, setB2bSubmitted] = useState(false);
  const [b2bError, setB2bError] = useState('');

  // Load real contract from localStorage if available
  const savedPhone = typeof window !== 'undefined' ? localStorage.getItem('visvasahome_user_phone') : null;
  let subscription = mockSubscription;
  let visits = mockVisits;

  // Initialize visvasahome_amc_visits if not exists to enable mock tracking
  if (typeof window !== 'undefined') {
    const visitsData = localStorage.getItem('visvasahome_amc_visits');
    if (!visitsData) {
      const initialVisits = mockVisits.map(v => ({
        id: v.id,
        contractId: 'AMC-2026-0421',
        scheduledDate: v.visitDate,
        scheduledTime: v.visitTime,
        status: v.status,
        spName: v.spName,
        serviceType: v.serviceType,
        rating: v.rating,
        notes: v.notes,
        reportUrl: v.reportUrl
      }));
      localStorage.setItem('visvasahome_amc_visits', JSON.stringify(initialVisits));
    }
  }

  const contractsData = typeof window !== 'undefined' ? localStorage.getItem('visvasahome_amc_contracts') : null;
  const visitsData = typeof window !== 'undefined' ? localStorage.getItem('visvasahome_amc_visits') : null;

  if (contractsData && savedPhone) {
    try {
      const parsedContracts = JSON.parse(contractsData);
      const userContract = parsedContracts.find((c: any) => c.customerId === savedPhone || c.contractNumber === savedPhone);
      if (userContract) {
        subscription = {
          id: userContract.contractNumber,
          planName: userContract.packageName,
          tier: userContract.tier || 'gold',
          status: userContract.status,
          startDate: userContract.startDate,
          endDate: userContract.endDate,
          visitsTotal: userContract.visitsTotal,
          visitsUsed: userContract.visitsCompleted || 0,
          nextVisitDate: userContract.nextVisitDate || '',
          monthlyAmount: Math.floor(userContract.amountPaid / 12),
          totalAmount: userContract.amountPaid,
          coverage: ['AC Service', 'Plumbing', 'Electrical', 'Pest Control'],
          spName: 'Suresh Reddy (Verified)',
          spPhone: '+91 98765 12340',
        };
      }
    } catch (e) { console.error(e); }
  }

  // Load visits matching current subscription
  if (visitsData) {
    try {
      const parsedVisits = JSON.parse(visitsData);
      const userVisits = parsedVisits.filter((v: any) => v.contractId === subscription.id);
      if (userVisits.length > 0) {
        visits = userVisits.map((v: any) => ({
          id: v.id,
          visitDate: new Date(v.scheduledDate).toISOString().split('T')[0],
          visitTime: v.scheduledTime || '10:00 AM',
          status: v.status,
          spName: v.spName || 'Suresh Reddy (Verified)',
          serviceType: v.serviceType || 'Routine AMC Inspection & Service',
          rating: v.rating || null,
          notes: v.notes || null,
          reportUrl: v.reportUrl || null,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Compute days remaining and expiry proximity
  const daysLeft = Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const visitsRemaining = subscription.visitsTotal - subscription.visitsUsed;
  const nextVisit = visits.find(v => v.status === 'upcoming' || v.status === 'scheduled' || v.status === 'inprogress');
  const isNearExpiry = daysLeft <= 60;
  const isExpired = daysLeft <= 0;


  const formatDate = (d: string) =>
    new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d));

  // ── Step 7: Raise Service Request ────────────────────────────────────────────
  const handleSubmitRequest = async () => {
    if (!requestDesc.trim()) return;
    setRequestSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    const newRequest: ServiceRequest = {
      id: `REQ-${Date.now().toString(36).toUpperCase()}`,
      type: requestType,
      description: requestDesc,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setServiceRequests(prev => [newRequest, ...prev]);

    // Add to visvasahome_amc_visits as a scheduled visit
    if (typeof window !== 'undefined') {
      const visitsData = localStorage.getItem('visvasahome_amc_visits');
      if (visitsData) {
        try {
          const parsedVisits = JSON.parse(visitsData);
          // scheduledDate: 3 days from now
          const schedDate = new Date();
          schedDate.setDate(schedDate.getDate() + 3);
          const newVisit = {
            id: `VISIT_${Date.now()}`,
            contractId: subscription.id,
            scheduledDate: schedDate.toISOString(),
            scheduledTime: '11:00 AM',
            status: 'scheduled',
            spName: 'Suresh Reddy (Verified)',
            serviceType: requestType === 'breakdown' ? `Breakdown: ${requestDesc}` : `Scheduled Check: ${requestDesc}`,
            rating: null,
            notes: null,
            reportUrl: null
          };
          parsedVisits.push(newVisit);
          localStorage.setItem('visvasahome_amc_visits', JSON.stringify(parsedVisits));
        } catch (e) {
          console.error(e);
        }
      }
    }

    setRequestSubmitted(true);
    setRequestDesc('');
    setRequestSubmitting(false);
  };

  // ── Step 10: Renewal handler ──────────────────────────────────────────────────
  const handleRenewal = async (choice: 'renew' | 'lapse') => {
    setRenewalChoice(choice);
    await new Promise(r => setTimeout(r, 1000));
    setRenewalConfirmed(true);
    if (choice === 'renew') {
      // In production: trigger payment flow
    }
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 pb-24" style={{ fontFamily: 'inherit' }}>

      {/* ── Header (dark gradient) ── */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white">
        <div className="max-w-3xl mx-auto px-4 pt-4 pb-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm font-bold mb-5 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {/* ── Step 9: Expiry Warning Banner ── */}
          {isNearExpiry && !isExpired && (
            <div className="bg-amber-500/20 border border-amber-400/40 rounded-2xl p-3 mb-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-amber-100 font-black text-sm">Plan Nearing Expiry!</p>
                <p className="text-amber-200 text-xs font-semibold mt-0.5">
                  Your AMC expires in <strong>{daysLeft} days</strong> on {formatDate(subscription.endDate)}. Renew now to keep coverage active.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('renewal')}
                className="bg-amber-400 hover:bg-amber-300 text-amber-900 font-black text-xs px-3 py-1.5 rounded-xl flex-shrink-0 transition-all"
              >
                Renew →
              </button>
            </div>
          )}

          {isExpired && (
            <div className="bg-red-500/20 border border-red-400/40 rounded-2xl p-3 mb-4 flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-100 font-black text-sm">Plan Lapsed</p>
                <p className="text-red-200 text-xs font-semibold mt-0.5">
                  Your AMC has expired. Future visits are charged at pay-per-visit rates.
                </p>
              </div>
              <button onClick={() => setActiveTab('renewal')} className="bg-red-400 text-white font-black text-xs px-3 py-1.5 rounded-xl flex-shrink-0">
                Renew
              </button>
            </div>
          )}

          {/* Contract info */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest">
                  {isExpired ? 'Lapsed AMC' : 'Active AMC Subscription'}
                </span>
              </div>
              <h1 className="text-xl font-black tracking-tight">{subscription.planName}</h1>
              <p className="text-blue-200 text-xs font-semibold mt-1">
                {formatDate(subscription.startDate)} → {formatDate(subscription.endDate)}
              </p>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-xl flex items-center gap-1 flex-shrink-0 ${
              isExpired ? 'bg-red-500/30 text-red-200' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}>
              <CheckCircle2 className="w-3 h-3" />
              {isExpired ? 'Lapsed' : 'Active'}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[
              { label: 'Total Visits', value: subscription.visitsTotal, color: 'text-white' },
              { label: 'Used', value: subscription.visitsUsed, color: 'text-blue-200' },
              { label: 'Remaining', value: visitsRemaining, color: 'text-emerald-300' },
              { label: 'Days Left', value: isExpired ? '0' : daysLeft, color: isNearExpiry ? 'text-amber-300' : 'text-white' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center">
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[9px] text-blue-200 font-extrabold uppercase tracking-wider mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5">

        {/* ── Next Visit Banner (Step 7 entry) ── */}
        {nextVisit && !isExpired && (
          <div className="bg-blue-600 text-white rounded-3xl p-4 flex items-start gap-4 mb-5 shadow-lg shadow-blue-600/20">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-100 mb-0.5">
                {nextVisit.status === 'inprogress' ? 'Ongoing Visit' : 'Next Visit'}
              </p>
              <p className="font-black text-base">{formatDate(nextVisit.visitDate)} · {nextVisit.visitTime}</p>
              <p className="text-xs text-blue-100 font-semibold mt-0.5">{nextVisit.serviceType}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={() => onNavigate('live-tracking', { bookingId: nextVisit.id })}
                className="bg-white text-blue-600 hover:bg-blue-50 font-black text-xs rounded-xl py-2.5 px-4 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Navigation className="w-3.5 h-3.5" /> {nextVisit.status === 'inprogress' ? 'Resume Tracking' : 'Track Live'}
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white font-black text-xs rounded-xl py-2 px-3 flex-shrink-0 transition-all">
                Reschedule
              </button>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 bg-white border border-gray-100 shadow-sm p-1 rounded-2xl mb-5">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW  (Steps 5 & 6 — Activated + Active Plan Period)
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <div className="space-y-4">

            {/* Plan activated card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Step 5 — Plan Activated</p>
                  <p className="font-black text-gray-900 text-sm">Contract Details</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Contract ID', value: subscription.id, mono: true },
                  { label: 'Plan Tier', value: subscription.tier.toUpperCase(), mono: false },
                  { label: 'Coverage Period', value: `${formatDate(subscription.startDate)} – ${formatDate(subscription.endDate)}`, mono: false },
                  { label: 'Annual Amount', value: `₹${subscription.totalAmount.toLocaleString('en-IN')}`, mono: false },
                ].map(r => (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs font-bold text-gray-500">{r.label}</span>
                    <span className={`text-sm font-black text-gray-900 ${r.mono ? 'font-mono bg-gray-100 px-2 py-0.5 rounded-lg text-xs' : ''}`}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned SP */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Assigned Partner</p>
                <p className="font-black text-gray-900">{subscription.spName}</p>
                <p className="text-xs text-gray-500 font-semibold">{subscription.spPhone}</p>
              </div>
              <a
                href={`tel:${subscription.spPhone.replace(/\s/g, '')}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            </div>

            {/* Step 6: Active Plan Period — Appliance Health Tracker */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Step 6 — Active Plan Period</p>
                  <p className="font-black text-gray-900 text-sm">Appliance Health Tracker</p>
                </div>
              </div>
              <div className="space-y-3">
                {applianceHealth.map((appliance) => (
                  <div key={appliance.name} className="flex items-center gap-3">
                    <span className="text-xl w-8 text-center flex-shrink-0">{appliance.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs font-bold text-gray-800 truncate">{appliance.name}</p>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                          appliance.status === 'good' ? 'text-emerald-700 bg-emerald-50' :
                          appliance.status === 'warning' ? 'text-red-700 bg-red-50' :
                          'text-amber-700 bg-amber-50'
                        }`}>
                          {appliance.health}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            appliance.health >= 70 ? 'bg-emerald-500' :
                            appliance.health >= 40 ? 'bg-amber-400' : 'bg-red-500'
                          }`}
                          style={{ width: `${appliance.health}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{appliance.nextAlert}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage chips */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Plan Coverage</p>
              <div className="flex flex-wrap gap-2">
                {subscription.coverage.map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('request')}
                className="bg-white border border-gray-200 hover:border-red-300 hover:bg-red-50 rounded-2xl p-4 text-left flex flex-col gap-2 transition-all group"
              >
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <p className="font-black text-sm text-gray-900">Breakdown Visit</p>
                <p className="text-[10px] text-gray-400 font-semibold">Emergency service request</p>
              </button>
              <button
                onClick={() => setActiveTab('request')}
                className="bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-2xl p-4 text-left flex flex-col gap-2 transition-all group"
              >
                <Calendar className="w-5 h-5 text-blue-500" />
                <p className="font-black text-sm text-gray-900">Schedule Visit</p>
                <p className="text-[10px] text-gray-400 font-semibold">Book your next check-up</p>
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: VISITS  (Steps 7 & 8 — Pro visits, fixes covered)
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'visits' && (
          <div className="space-y-4">
            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
              Step 8 — Pro Visits & Fixes Covered · {subscription.visitsTotal} Total Visits
            </p>

            {/* Visit progress bar */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4">
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                <span>{subscription.visitsUsed} visits used</span>
                <span>{visitsRemaining} remaining</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
                  style={{ width: `${(subscription.visitsUsed / subscription.visitsTotal) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400 font-semibold mt-2">No extra charge for covered services within your plan scope</p>
            </div>

            {visits.map((visit, idx) => {
              const cfg = statusConfig[visit.status];
              return (
                <div key={visit.id} className={`bg-white rounded-3xl border shadow-sm overflow-hidden`}>
                  {/* Status header */}
                  <div className={`px-5 py-3 flex items-center gap-2 border-b ${cfg.bg}`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-[10px] text-gray-400 font-bold ml-auto">Visit {idx + 1} of {subscription.visitsTotal}</span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <p className="font-extrabold text-gray-900">{formatDate(visit.visitDate)} · {visit.visitTime}</p>
                      <p className="text-xs text-gray-600 font-semibold mt-0.5">{visit.serviceType}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                      <Shield className="w-3 h-3 text-gray-400" />
                      Technician: <span className="font-bold text-gray-700">{visit.spName}</span>
                    </div>

                    {/* Step 8: No charge badge */}
                    {(visit.status === 'upcoming' || visit.status === 'scheduled' || visit.status === 'inprogress') && (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <p className="text-xs font-bold text-emerald-700">
                            {visit.status === 'inprogress' ? 'Service is in progress' : 'Fully covered — No extra charge within plan scope'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onNavigate('live-tracking', { bookingId: visit.id })}
                            className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-blue-500/10"
                          >
                            <Navigation className="w-3.5 h-3.5" /> {visit.status === 'inprogress' ? 'Resume Live Tracking' : 'Track Visit Live (Service Day)'}
                          </button>
                          {visit.status !== 'inprogress' && (
                            <button className="py-2.5 px-4 border border-slate-200 hover:border-slate-300 text-slate-600 font-extrabold text-xs rounded-xl transition-all">
                              Reschedule
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {visit.notes && (
                      <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                        <p className="text-[11px] text-gray-600 font-semibold leading-relaxed">{visit.notes}</p>
                      </div>
                    )}

                    {visit.rating !== null && (
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3.5 h-3.5 ${i < (visit.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                        <span className="text-[10px] text-gray-400 font-bold ml-1">Your Rating</span>
                      </div>
                    )}

                    {visit.reportUrl && (
                      <button className="flex items-center gap-1.5 text-blue-600 text-xs font-bold border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl px-3 py-2 transition-colors">
                        <Download className="w-3.5 h-3.5" /> Download Service Report
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3: RAISE REQUEST  (Steps 7 — Raise Service Request)
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'request' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Step 7 — Raise Service Request</p>
                  <p className="font-black text-gray-900 text-sm">Schedule or Breakdown Visit</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 font-semibold mb-5 mt-2">
                Submit a service request anytime. Covered visits are at no extra charge within your plan scope.
              </p>

              {requestSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="font-black text-gray-900 text-lg mb-1">Request Submitted!</h3>
                  <p className="text-sm text-gray-500 font-semibold">
                    Your service partner will confirm the visit within 4 hours via call/SMS.
                  </p>
                  {serviceRequests[0] && (
                    <p className="text-xs text-gray-400 mt-3 font-mono">Ref: {serviceRequests[0].id}</p>
                  )}
                  <button
                    onClick={() => { setRequestSubmitted(false); setRequestDesc(''); }}
                    className="mt-5 px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Raise Another
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Request type */}
                  <div>
                    <p className="text-xs font-extrabold text-gray-600 uppercase tracking-wider mb-2">Request Type</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setRequestType('scheduled')}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          requestType === 'scheduled'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Calendar className={`w-5 h-5 mb-2 ${requestType === 'scheduled' ? 'text-blue-600' : 'text-gray-400'}`} />
                        <p className={`text-sm font-extrabold ${requestType === 'scheduled' ? 'text-blue-700' : 'text-gray-700'}`}>
                          Scheduled Visit
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Regular maintenance check</p>
                      </button>
                      <button
                        onClick={() => setRequestType('breakdown')}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          requestType === 'breakdown'
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <AlertTriangle className={`w-5 h-5 mb-2 ${requestType === 'breakdown' ? 'text-red-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-extrabold ${requestType === 'breakdown' ? 'text-red-600' : 'text-gray-700'}`}>
                          Breakdown Visit
                        </p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Emergency — priority dispatch</p>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-xs font-extrabold text-gray-600 uppercase tracking-wider mb-2">Describe the Issue</p>
                    <textarea
                      value={requestDesc}
                      onChange={e => setRequestDesc(e.target.value)}
                      placeholder={requestType === 'breakdown'
                        ? 'e.g. AC stopped working completely, making loud noise...'
                        : 'e.g. AC not cooling well, need general check before summer...'}
                      rows={3}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                    />
                  </div>

                  {/* Covered note */}
                  <div className="flex items-start gap-2.5 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-emerald-700 font-semibold">
                      This service is <strong>covered under your {subscription.planName}</strong>. No extra charges for covered services.
                    </p>
                  </div>

                  <button
                    onClick={handleSubmitRequest}
                    disabled={!requestDesc.trim() || requestSubmitting}
                    className={`w-full py-4 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all ${
                      requestType === 'breakdown'
                        ? 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300'
                    } disabled:cursor-not-allowed`}
                  >
                    {requestSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                    ) : (
                      <>{requestType === 'breakdown' ? <Zap className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                        {requestType === 'breakdown' ? 'Request Emergency Visit' : 'Schedule Maintenance Visit'}</>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Past requests */}
            {serviceRequests.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Recent Requests</p>
                <div className="space-y-3">
                  {serviceRequests.map(req => (
                    <div key={req.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-2xl">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        req.type === 'breakdown' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {req.type === 'breakdown' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Calendar className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-700 truncate">{req.description}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Ref: {req.id}</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* ══════════════════════════════════════════════════════════════════════
            TAB 4: RENEWAL  (Steps 9 & 10 — Expiry + Renew or Lapse)
        ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'renewal' && (
          <div className="space-y-4">

            {/* Expiry Status Card — Step 9 */}
            <div className={`rounded-3xl p-5 border ${
              isExpired ? 'bg-red-900 border-red-800 text-white' :
              isNearExpiry ? 'bg-amber-50 border-amber-200' :
              'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                  isExpired ? 'bg-red-700' : isNearExpiry ? 'bg-amber-100' : 'bg-emerald-100'
                }`}>
                  {isExpired ? <XCircle className="w-5 h-5 text-red-200" /> :
                   isNearExpiry ? <AlertTriangle className="w-5 h-5 text-amber-600" /> :
                   <Shield className="w-5 h-5 text-emerald-600" />}
                </div>
                <div>
                  <p className={`text-[10px] font-extrabold uppercase tracking-widest ${
                    isExpired ? 'text-red-300' : isNearExpiry ? 'text-amber-500' : 'text-emerald-600'
                  }`}>
                    {isExpired ? 'Step 10 — Plan Lapsed' : isNearExpiry ? 'Step 9 — Plan Nearing Expiry' : 'Plan Active'}
                  </p>
                  <p className={`font-black text-lg ${isExpired ? 'text-white' : 'text-gray-900'}`}>
                    {isExpired ? 'Plan has expired' : isNearExpiry ? `${daysLeft} days remaining` : `${daysLeft} days active`}
                  </p>
                </div>
              </div>
              <p className={`text-xs font-semibold ${isExpired ? 'text-red-200' : isNearExpiry ? 'text-amber-700' : 'text-emerald-700'}`}>
                {isExpired
                  ? 'Your plan has lapsed. Future visits will be charged at standard pay-per-visit rates. You can renew anytime to restore coverage.'
                  : isNearExpiry
                  ? `Your plan expires on ${formatDate(subscription.endDate)}. Renew early to avoid a coverage gap.`
                  : `Your plan is valid until ${formatDate(subscription.endDate)}.`}
              </p>
            </div>

            {/* Step 10: Renew or Let Lapse */}
            {!renewalConfirmed ? (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1">Step 10 — Renew or Let Lapse</p>
                <p className="font-black text-gray-900 text-base mb-5">What would you like to do?</p>

                <div className="grid grid-cols-1 gap-3">
                  {/* Renew option */}
                  <button
                    onClick={() => handleRenewal('renew')}
                    className={`w-full p-5 rounded-2xl border-2 text-left flex items-start gap-4 transition-all hover:shadow-md ${
                      renewalChoice === 'renew'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="w-11 h-11 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <RefreshCw className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">Renew My AMC Plan</p>
                      <p className="text-xs text-gray-500 font-semibold mt-1">
                        Continue with <strong>{subscription.planName}</strong> for another year at ₹{subscription.totalAmount.toLocaleString('en-IN')}.
                        Coverage starts immediately on payment.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">One-tap renewal</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">No gap in coverage</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  </button>

                  {/* Upgrade option */}
                  <button
                    onClick={() => onNavigate('amc-packages')}
                    className="w-full p-5 rounded-2xl border-2 border-gray-200 hover:border-purple-300 text-left flex items-start gap-4 transition-all hover:shadow-md"
                  >
                    <div className="w-11 h-11 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900">Upgrade to a Higher Plan</p>
                      <p className="text-xs text-gray-500 font-semibold mt-1">
                        Get more visits, broader coverage, and priority support with Platinum or Diamond tiers.
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  </button>

                  {/* Let lapse option */}
                  <button
                    onClick={() => handleRenewal('lapse')}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-4 transition-all ${
                      renewalChoice === 'lapse'
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 hover:border-red-200'
                    }`}
                  >
                    <div className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-gray-700">Let Plan Lapse</p>
                      <p className="text-xs text-gray-500 font-semibold mt-1">
                        Switch to pay-per-visit. You can still book services but at standard rates without coverage benefits.
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              /* Renewal Confirmation */
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${
                  renewalChoice === 'renew' ? 'bg-emerald-50' : 'bg-gray-100'
                }`}>
                  {renewalChoice === 'renew'
                    ? <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    : <XCircle className="w-10 h-10 text-gray-400" />}
                </div>
                <h3 className="font-black text-gray-900 text-xl mb-2">
                  {renewalChoice === 'renew' ? 'Renewal Initiated! 🎉' : 'Plan Will Lapse'}
                </h3>
                <p className="text-sm text-gray-500 font-semibold leading-relaxed max-w-xs mx-auto">
                  {renewalChoice === 'renew'
                    ? 'Your payment is being processed. Your AMC will be renewed and coverage will continue without interruption.'
                    : 'Your plan will expire on the end date. You can renew anytime to restore full coverage and benefits.'}
                </p>
                {renewalChoice === 'renew' && (
                  <button
                    onClick={onBack}
                    className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                )}
                {renewalChoice === 'lapse' && (
                  <button
                    onClick={() => { setRenewalConfirmed(false); setRenewalChoice(null); }}
                    className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-colors"
                  >
                    Changed my mind — Renew
                  </button>
                )}
              </div>
            )}

            {/* Comparison: Renew vs Lapse */}
            {!renewalConfirmed && (
              <div className="bg-slate-900 rounded-3xl p-5 text-white">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Renew vs Lapse — Comparison</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm font-black text-emerald-400 mb-2">✅ With Renewal</p>
                    {[
                      `${subscription.visitsTotal} covered visits`,
                      'No per-visit charges',
                      'Priority SP dispatch',
                      'Filter life alerts',
                      'Emergency support',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2 mb-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <p className="text-xs text-slate-300 font-semibold">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-black text-red-400 mb-2">❌ If Lapsed</p>
                    {[
                      'Pay-per-visit rates',
                      'No priority dispatch',
                      'No appliance tracking',
                      'No emergency cover',
                      'Standard SLA only',
                    ].map(item => (
                      <div key={item} className="flex items-center gap-2 mb-1.5">
                        <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                        <p className="text-xs text-slate-400 font-semibold">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
