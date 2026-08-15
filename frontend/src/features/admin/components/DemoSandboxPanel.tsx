import { useState, useEffect } from 'react';
import {
  Settings, X, MessageSquare, Play, Sparkles, RefreshCw,
  Smartphone, UserCheck, ShieldAlert, CheckCircle2, ChevronRight, Zap, Copy, ExternalLink, Calculator, Map, Fingerprint, Activity
} from 'lucide-react';
import { DemoEventBus } from '@utils/demoEventBus';
import { BookingService } from '@booking/services/bookingService';
import { simulateAMCLifecycle } from '@amc/services/amcService';
import { simulateContractorBiddingLifecycle } from '@professional/services/contractorService';
import {
  calculateSurgeMultiplier,
  calculateSPRankingScore,
  calculateBayesianCancellationRate,
  verifyFaceEmbeddings,
  solveCombinatorialVRP,
  detectMetricAnomaly
} from '@booking/services/algorithms';

interface NotificationState {
  id: string;
  title: string;
  body: string;
  method: string;
  visible: boolean;
}

export function DemoSandboxPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'messages' | 'algorithms' | 'shortcuts'>('guide');
  const [guideFlow, setGuideFlow] = useState<'standard' | 'amc' | 'contractor'>('standard');
  const [logs, setLogs] = useState<any[]>([]);
  const [latestOtp, setLatestOtp] = useState<any>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [activeBooking, setActiveBooking] = useState<any>(null);

  // Core Algorithms States
  const [algoSurgeDemand, setAlgoSurgeDemand] = useState(5);
  const [algoSurgeSupply, setAlgoSurgeSupply] = useState(2);
  const [algoSurgePrice, setAlgoSurgePrice] = useState(499);
  
  const [algoSpRating, setAlgoSpRating] = useState(4.85);
  const [algoSpJobs, setAlgoSpJobs] = useState(120);
  const [algoSpCancellations, setAlgoSpCancellations] = useState(3);
  
  const [algoFacialSim, setAlgoFacialSim] = useState(0.86);
  const [algoFacialThreshold, setAlgoFacialThreshold] = useState(0.80);

  const [algoSelectedSection, setAlgoSelectedSection] = useState<'surge' | 'ranking' | 'biometric' | 'vrp'>('surge');


  // Play audio sound using Web Audio API for push notifications
  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Dual tone notification chime
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };

      playTone(523.25, 0, 0.1); // C5
      playTone(659.25, 0.08, 0.15); // E5
    } catch (e) {
      console.log('Audio chime blocked by browser autoplay policy');
    }
  };

  useEffect(() => {
    setLogs(DemoEventBus.getLogs());

    // Subscribe to new logs
    const unsubscribeLogs = DemoEventBus.subscribeLogs((newLog) => {
      setLogs([...DemoEventBus.getLogs()]);
    });

    // Subscribe to OTPs
    const unsubscribeOtp = DemoEventBus.subscribeOtp((data) => {
      setLatestOtp(data);
      playNotificationSound();

      // Set floating iOS push notification
      const methodLabel = data.method === 'sms' ? ' MESSAGES' : data.method === 'whatsapp' ? '🟢 WHATSAPP' : '📧 EMAIL';
      setNotification({
        id: Math.random().toString(36).substring(2, 9),
        title: methodLabel,
        body: `VisvasaHome: Your verification OTP is ${data.otp}. Valid for 5 minutes.`,
        method: data.method,
        visible: true
      });

      // Auto-hide push notification after 6 seconds
      setTimeout(() => {
        setNotification(prev => {
          if (prev) return { ...prev, visible: false };
          return null;
        });
      }, 6000);
    });

    // Periodically search for the latest customer booking
    const checkActiveBooking = () => {
      const bookings = BookingService.getAllBookings();
      if (bookings.length > 0) {
        // Find most recent booking
        setActiveBooking(bookings[0]);
      } else {
        setActiveBooking(null);
      }
    };
    checkActiveBooking();
    const interval = setInterval(checkActiveBooking, 2000);

    return () => {
      unsubscribeLogs();
      unsubscribeOtp();
      clearInterval(interval);
    };
  }, []);

  const handleCopyOtp = (code: string) => {
    navigator.clipboard.writeText(code);
    DemoEventBus.addLog('system', `Copied OTP: ${code} to clipboard`);
  };

  const autofillOtpOnPage = () => {
    if (!latestOtp) {
      DemoEventBus.addLog('system', 'No active OTP code to fill.');
      return;
    }

    // Find all potential digit input boxes
    for (let i = 0; i < 6; i++) {
      const char = latestOtp.otp[i];
      if (!char) continue;

      const inputEl = document.getElementById(`otp-${i}`) as HTMLInputElement;
      if (inputEl) {
        inputEl.value = char;
        // Trigger React onChange manually
        const event = new Event('input', { bubbles: true });
        inputEl.dispatchEvent(event);
      }
    }

    // Fallback for simple input boxes
    const rawInput = document.querySelector('input[placeholder*="OTP"], input[placeholder*="otp"]') as HTMLInputElement;
    if (rawInput) {
      rawInput.value = latestOtp.otp;
      const event = new Event('input', { bubbles: true });
      rawInput.dispatchEvent(event);
    }

    DemoEventBus.addLog('system', `Autofilled OTP code ${latestOtp.otp}`);
  };

  const handleForceAdvanceStatus = () => {
    if (!activeBooking) return;

    let nextStatus: 'confirmed' | 'in-progress' | 'completed' | 'cancelled' = 'confirmed';
    if (activeBooking.status === 'confirmed') nextStatus = 'in-progress';
    else if (activeBooking.status === 'in-progress') nextStatus = 'completed';
    else return;

    BookingService.updateBookingStatus(activeBooking.id, nextStatus);
    DemoEventBus.addLog('system', `Force advanced booking status to: ${nextStatus}`);

    // Also trigger hash update or force reload to show new live tracking state
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  const handleResetSandbox = () => {
    localStorage.removeItem('visvasahome_bookings');
    localStorage.removeItem('visvasahome_cart');
    localStorage.removeItem('visvasahome_contractor_requirements');
    localStorage.removeItem('visvasahome_contractor_quotes');
    localStorage.removeItem('visvasahome_contractor_projects');
    localStorage.removeItem('visvasahome_contractor_escrow');
    localStorage.removeItem('visvasahome_amc_contracts');
    localStorage.removeItem('visvasahome_amc_visits');
    localStorage.removeItem('visvasahome_user_phone');
    localStorage.removeItem('visvasahome_user_name');
    localStorage.removeItem('visvasahome_user_id');
    localStorage.removeItem('visvasahome_user_role');
    localStorage.removeItem('visvasahome_user_email');
    DemoEventBus.addLog('system', 'Reset all bookings, contractor hub, AMC, and user session storage.');
    window.location.hash = '#/';
    window.location.reload();
  };

  const handleSimulateAMC = async () => {
    // Make sure user is logged in
    localStorage.setItem('visvasahome_user_phone', '+919999999999');
    localStorage.setItem('visvasahome_user_name', 'Anita Desai');
    localStorage.setItem('visvasahome_user_id', 'CUST001');
    localStorage.setItem('visvasahome_user_role', 'customer');
    localStorage.setItem('visvasahome_user_email', 'anita@example.com');

    DemoEventBus.addLog('system', 'Simulated checkout payment: ₹9,999 charged for Platinum AMC Package.');
    const res = await simulateAMCLifecycle('CUST001', 'Anita Desai');
    if (res.success) {
      DemoEventBus.addLog('system', 'Simulated AMC Contract active: Scheduled 4 quarterly maintenance visits.');
      setIsOpen(false);
      window.location.hash = '#/amc-dashboard';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  const handleSimulateContractorBidding = async () => {
    // Make sure user is logged in
    localStorage.setItem('visvasahome_user_phone', '+919999999999');
    localStorage.setItem('visvasahome_user_name', 'Anita Desai');
    localStorage.setItem('visvasahome_user_id', 'CUST001');
    localStorage.setItem('visvasahome_user_role', 'customer');
    localStorage.setItem('visvasahome_user_email', 'anita@example.com');

    DemoEventBus.addLog('system', 'Posted Project requirement: "Modular Kitchen Renovation" for Indiranagar.');
    const res = await simulateContractorBiddingLifecycle('CUST001', 'Anita Desai');
    if (res.success) {
      DemoEventBus.addLog('system', 'Simulated bidding: 2 competitive contractor quotes generated (Elite Interiors & ModularKitchen Pro).');
      setIsOpen(false);
      window.location.hash = `#/contractor-quote-comparison?projectId=${res.projectId}`;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  // Check interactive steps completed
  const hasCartItems = localStorage.getItem('visvasahome_cart') ? JSON.parse(localStorage.getItem('visvasahome_cart') || '{}')?.items?.length > 0 : false;
  const isUserLoggedIn = !!localStorage.getItem('visvasahome_user_phone');
  const hasBookings = activeBooking !== null;

  const getLocalStorageItemCount = (key: string): number => {
    const item = localStorage.getItem(key);
    if (!item) return 0;
    try {
      return JSON.parse(item).length;
    } catch {
      return 0;
    }
  };

  const hasAMCContracts = getLocalStorageItemCount('visvasahome_amc_contracts') > 0;
  const hasAMCVisits = getLocalStorageItemCount('visvasahome_amc_visits') > 0;
  const hasContractorReqs = getLocalStorageItemCount('visvasahome_contractor_requirements') > 0;
  const hasContractorProjects = getLocalStorageItemCount('visvasahome_contractor_projects') > 0;

  return (
    <>
      {/* iOS Push Notification Banner */}
      {notification && notification.visible && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-9999 animate-bounce">
          <div className="bg-slate-900/90 hover:bg-slate-900 text-white rounded-3xl p-4 shadow-2xl border border-slate-700/60 backdrop-blur-md flex items-start gap-3 shadow-indigo-500/10">
            <div className={`p-2 rounded-2xl flex-shrink-0 ${notification.method === 'sms' ? 'bg-blue-600' : 'bg-green-600'}`}>
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">{notification.title}</span>
                <span className="text-[9px] text-gray-500">now</span>
              </div>
              <p className="text-xs font-bold text-gray-100 mt-0.5 leading-relaxed">{notification.body}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    handleCopyOtp(latestOtp?.otp || '');
                    setNotification(prev => prev ? { ...prev, visible: false } : null);
                  }}
                  className="bg-slate-800 text-white hover:bg-slate-700 px-3 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all border border-slate-700 active:scale-95"
                >
                  <Copy className="w-3 h-3" /> Copy OTP
                </button>
                <button
                  onClick={() => {
                    autofillOtpOnPage();
                    setNotification(prev => prev ? { ...prev, visible: false } : null);
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-500 px-3 py-1 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all active:scale-95"
                >
                  <Zap className="w-3 h-3" /> Auto-Fill
                </button>
              </div>
            </div>
            <button
              onClick={() => setNotification(prev => prev ? { ...prev, visible: false } : null)}
              className="text-gray-500 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Demo Sandbox Activation Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-500 flex items-center gap-2 font-black text-xs active:scale-95 border
          ${isOpen
            ? 'bg-slate-900 border-slate-800 text-white rotate-90'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500 text-white hover:shadow-indigo-500/30 shadow-blue-500/20'}`}
      >
        <Settings className={`w-5 h-5 ${!isOpen && 'animate-spin-slow'}`} />
        {!isOpen && (
          <span className="flex items-center gap-1.5 font-extrabold pr-1">
            Sandbox Simulator
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </span>
        )}
      </button>

      {/* Demo Control Center Drawer Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] max-h-[520px] bg-slate-950/95 border border-slate-800 text-white rounded-3xl shadow-2xl z-50 flex flex-col backdrop-blur-xl animate-slide-up overflow-hidden shadow-indigo-500/5">
          {/* Header */}
          <div className="p-4 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <div>
                <h4 className="font-extrabold text-sm tracking-wide">Visvasa Sandbox Simulator</h4>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">High Fidelity Local Testing</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-slate-800 text-gray-400 hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/20 text-xs font-bold text-gray-400">
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${activeTab === 'guide' ? 'text-white border-indigo-500 bg-slate-900/40' : 'border-transparent hover:text-gray-200'}`}
            >
              Interactive Guide
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-3 text-center border-b-2 transition-all relative ${activeTab === 'messages' ? 'text-white border-indigo-500 bg-slate-900/40' : 'border-transparent hover:text-gray-200'}`}
            >
              In-App SMS Logs
              {latestOtp && <span className="absolute top-2.5 right-4 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />}
            </button>
            <button
              onClick={() => setActiveTab('algorithms')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${activeTab === 'algorithms' ? 'text-white border-indigo-500 bg-slate-900/40' : 'border-transparent hover:text-gray-200'}`}
            >
              Algorithms
            </button>
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`flex-1 py-3 text-center border-b-2 transition-all ${activeTab === 'shortcuts' ? 'text-white border-indigo-500 bg-slate-900/40' : 'border-transparent hover:text-gray-200'}`}
            >
              Dev Tools
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 1. Guide Tab */}
            {activeTab === 'guide' && (
              <div className="space-y-3">
                <div className="flex gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
                  <button
                    onClick={() => setGuideFlow('standard')}
                    className={`flex-1 py-1.5 text-center rounded-lg transition-all ${guideFlow === 'standard' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    On-Demand
                  </button>
                  <button
                    onClick={() => setGuideFlow('amc')}
                    className={`flex-1 py-1.5 text-center rounded-lg transition-all ${guideFlow === 'amc' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    AMC Flow
                  </button>
                  <button
                    onClick={() => setGuideFlow('contractor')}
                    className={`flex-1 py-1.5 text-center rounded-lg transition-all ${guideFlow === 'contractor' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                  >
                    Contractor
                  </button>
                </div>

                {guideFlow === 'standard' && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                      Follow this guide to experience the complete Visvasa local-market client-to-professional ecosystem.
                    </p>

                    {/* Step 1 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasCartItems ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">1. Select & Add Service to Cart</p>
                        <p className="text-[10px] text-gray-500">Go to home categories and add any AC/Plumbing service</p>
                        {!hasCartItems && (
                          <a href="#/ac-services" className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:underline mt-1">
                            Browse AC Services <ChevronRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${isUserLoggedIn ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">2. Client Mobile Login Verification</p>
                        <p className="text-[10px] text-gray-500">Authenticate with OTP SMS. Pre-fills automatically.</p>
                        {!isUserLoggedIn && (
                          <a href="#/login" className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:underline mt-1">
                            Go to Auth Portal <ChevronRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasBookings ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">3. Escrow Payment Checkout</p>
                        <p className="text-[10px] text-gray-500">Place slot booking and pay via simulated Razorpay</p>
                        {hasCartItems && !hasBookings && (
                          <a href="#/booking-flow" className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:underline mt-1">
                            Checkout Now <ChevronRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasBookings && (activeBooking?.status === 'in-progress' || activeBooking?.status === 'completed') ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">4. Live GPS Tracking Simulator</p>
                        <p className="text-[10px] text-gray-500">Watch the professional move on SVG map and arrive.</p>
                        {hasBookings && activeBooking?.status === 'confirmed' && (
                          <div className="mt-2 flex gap-1.5">
                            <a href={`#/live-tracking?bookingId=${activeBooking.id}`} className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded-lg text-[9px] font-bold inline-flex items-center gap-1">
                              Track Live
                            </a>
                            <button onClick={handleForceAdvanceStatus} className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-2 py-1 rounded-lg text-[9px] font-bold">
                              Simulate Arrival
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step 5 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasBookings && activeBooking?.status === 'completed' ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">5. Service Start/Completion OTP Verification</p>
                        <p className="text-[10px] text-gray-500">Verify OTP on Professional Portal to complete order</p>
                        {hasBookings && activeBooking?.status === 'in-progress' && (
                          <div className="mt-2 flex gap-1.5">
                            <a href={`#/sp-job-detail?jobId=${activeBooking.id}`} className="bg-green-600 hover:bg-green-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-bold inline-flex items-center gap-1">
                              Partner Portal <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <button onClick={handleForceAdvanceStatus} className="bg-slate-800 hover:bg-slate-700 text-gray-300 px-2 py-1 rounded-lg text-[9px] font-bold">
                              Force Complete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {guideFlow === 'amc' && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                      See how subscriptions ensure regular maintenance. Shortcut simulates ₹9,999 payment + schedules 4 visits.
                    </p>

                    {/* Step 1 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasAMCContracts ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">1. Browse & Select AMC Plan</p>
                        <p className="text-[10px] text-gray-500">Explore AC, Electrical, Plumbing or Platinum annual packages.</p>
                        {!hasAMCContracts && (
                          <a href="#/amc-home" className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:underline mt-1">
                            Browse Home plans <ChevronRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasAMCContracts ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">2. Payment & Contract Setup</p>
                        <p className="text-[10px] text-gray-500">Upon payment, a PDF agreement and visit schedule are automatically generated.</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasAMCContracts ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">3. Inspect AMC Visit Calendar</p>
                        <p className="text-[10px] text-gray-500">View quarterly scheduled dates and assigned professionals.</p>
                        {hasAMCContracts && (
                          <a href="#/amc-dashboard" className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:underline mt-1">
                            Go to AMC Dashboard <ChevronRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasAMCVisits && JSON.parse(localStorage.getItem('visvasahome_amc_visits') || '[]').some((v: any) => v.status === 'completed') ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">4. Complete Visit & View Report</p>
                        <p className="text-[10px] text-gray-500">Partner completes service, uploads safety report and issues digital signature.</p>
                      </div>
                    </div>
                  </div>
                )}

                {guideFlow === 'contractor' && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                      See how our milestone escrow protects large projects. Shortcut creates requirement + 2 bidding quotes.
                    </p>

                    {/* Step 1 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasContractorReqs ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">1. Post Renovation Requirement</p>
                        <p className="text-[10px] text-gray-500">Customer posts project specs, timeline, location and photos.</p>
                        {!hasContractorReqs && (
                          <a href="#/contractor-hub" className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:underline mt-1">
                            Contractor Hub <ChevronRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasContractorReqs ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">2. Compare Side-by-Side Quotes</p>
                        <p className="text-[10px] text-gray-500">Review quotes, line items, warranties, and milestone structures.</p>
                        {hasContractorReqs && (
                          <a href="#/contractor-hub" className="inline-flex items-center gap-1 text-[10px] text-blue-400 font-bold hover:underline mt-1">
                            Go to Bids Dashboard <ChevronRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasContractorProjects ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">3. Accept Bid & Deposit Escrow</p>
                        <p className="text-[10px] text-gray-500">Select quote and fund the first milestone escrow (6% platform fee held).</p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 ${hasContractorProjects && JSON.parse(localStorage.getItem('visvasahome_contractor_projects') || '[]').some((p: any) => p.status === 'completed' || p.milestones.some((m: any) => m.status === 'paid')) ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold">4. Complete Milestones & Release Funds</p>
                        <p className="text-[10px] text-gray-500">Contractor submits photo proof. Customer approves to release escrow funds.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Algorithms Tab */}
            {activeTab === 'algorithms' && (
              <div className="space-y-4">
                <div className="flex gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-[9px] font-bold">
                  <button
                    onClick={() => setAlgoSelectedSection('surge')}
                    className={`flex-1 py-1 text-center rounded-lg transition-all ${algoSelectedSection === 'surge' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                  >
                    1. Surge
                  </button>
                  <button
                    onClick={() => setAlgoSelectedSection('ranking')}
                    className={`flex-1 py-1 text-center rounded-lg transition-all ${algoSelectedSection === 'ranking' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                  >
                    2. Ranker
                  </button>
                  <button
                    onClick={() => setAlgoSelectedSection('biometric')}
                    className={`flex-1 py-1 text-center rounded-lg transition-all ${algoSelectedSection === 'biometric' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                  >
                    3. Biometric
                  </button>
                  <button
                    onClick={() => setAlgoSelectedSection('vrp')}
                    className={`flex-1 py-1 text-center rounded-lg transition-all ${algoSelectedSection === 'vrp' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
                  >
                    4. VRP Route
                  </button>
                </div>

                {/* 1. Dynamic Surge Section */}
                {algoSelectedSection === 'surge' && (() => {
                  const result = calculateSurgeMultiplier({
                    bookingTime: "10:00",
                    activeBookingsInArea: algoSurgeDemand,
                    availableSpsInArea: algoSurgeSupply,
                    categoryBaseMultiplier: 1.0
                  });
                  return (
                    <div className="space-y-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800 text-xs">
                      <h5 className="font-extrabold text-gray-200 flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5 text-indigo-400" /> Log-Ratio Dynamic Surge Engine
                      </h5>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Local Active Demand: {algoSurgeDemand} bookings</label>
                          <input
                            type="range" min="0" max="20"
                            value={algoSurgeDemand}
                            onChange={(e) => setAlgoSurgeDemand(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Local Active Supply: {algoSurgeSupply} professionals</label>
                          <input
                            type="range" min="1" max="10"
                            value={algoSurgeSupply}
                            onChange={(e) => setAlgoSurgeSupply(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950/80 rounded-xl space-y-1.5 border border-slate-800">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-400">Demand/Supply Ratio:</span>
                          <span className="font-mono text-gray-300">{(algoSurgeDemand / algoSurgeSupply).toFixed(2)}x</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-400">Surge Multiplier:</span>
                          <span className="font-black text-indigo-400">{result.multiplier}x</span>
                        </div>
                        <div className="flex justify-between text-[11px] pt-1.5 border-t border-slate-900">
                          <span className="text-gray-400">Surged Price (Base ₹499):</span>
                          <span className="font-bold text-emerald-400">₹{Math.round(499 * result.multiplier)}</span>
                        </div>
                        <p className="text-[9px] text-gray-500 italic mt-1">{result.reason}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* 2. SP Ranking Score Section */}
                {algoSelectedSection === 'ranking' && (() => {
                  const baseScore = calculateSPRankingScore({
                    rating: algoSpRating,
                    jobsCompleted: algoSpJobs,
                    completionRate: 0.98,
                    experienceYears: 6,
                    responseTimeMinutes: 15
                  });
                  const thetaCancel = calculateBayesianCancellationRate(algoSpCancellations, algoSpJobs);
                  const finalScore = Math.round(baseScore * (1 - thetaCancel));
                  return (
                    <div className="space-y-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800 text-xs">
                      <h5 className="font-extrabold text-gray-200 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-indigo-400" /> Bayesian Risk-Adjusted Score
                      </h5>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Average Star Rating: {algoSpRating.toFixed(2)} ⭐</label>
                          <input
                            type="range" min="300" max="500" step="5"
                            value={algoSpRating * 100}
                            onChange={(e) => setAlgoSpRating(Number(e.target.value) / 100)}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Cancellations: {algoSpCancellations} jobs</label>
                          <input
                            type="range" min="0" max="15"
                            value={algoSpCancellations}
                            onChange={(e) => setAlgoSpCancellations(Number(e.target.value))}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>
                      </div>
                      <div className="p-3 bg-slate-950/80 rounded-xl space-y-1 border border-slate-800">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400">Base Rank Score (S_base):</span>
                          <span className="font-mono text-gray-300">{baseScore}/100</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400">Bayesian Cancel (theta):</span>
                          <span className="font-mono text-amber-500">{(thetaCancel * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-xs pt-1.5 border-t border-slate-900 font-bold">
                          <span className="text-gray-400">Final Risk Match Score:</span>
                          <span className="text-indigo-400">{finalScore}/100</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 3. Biometric Verification Section */}
                {algoSelectedSection === 'biometric' && (() => {
                  const sim1 = [algoFacialSim, 0.1, 0.2];
                  const sim2 = [0.85, 0.12, 0.18];
                  const result = verifyFaceEmbeddings(sim1, sim2, algoFacialThreshold);
                  return (
                    <div className="space-y-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800 text-xs">
                      <h5 className="font-extrabold text-gray-200 flex items-center gap-1.5">
                        <Fingerprint className="w-3.5 h-3.5 text-indigo-400" /> Biometric Identity Verification
                      </h5>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Facial Vector Cosine Similarity: {algoFacialSim.toFixed(2)}</label>
                          <input
                            type="range" min="50" max="100"
                            value={algoFacialSim * 100}
                            onChange={(e) => setAlgoFacialSim(Number(e.target.value) / 100)}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Similarity Threshold: {algoFacialThreshold.toFixed(2)}</label>
                          <input
                            type="range" min="70" max="95"
                            value={algoFacialThreshold * 100}
                            onChange={(e) => setAlgoFacialThreshold(Number(e.target.value) / 100)}
                            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          />
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl border text-center font-bold ${
                        result.isMatch 
                          ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400' 
                          : 'bg-red-950/20 border-red-900 text-red-400'
                      }`}>
                        {result.isMatch ? '✓ VERIFIED: PRO IDENTITY CONFIRMED' : '✗ WARNING: PHOTO MISMATCH BLOCKED'}
                        <p className="text-[9px] text-gray-500 font-normal mt-1">Calculated Vector Cosine Sim: {result.similarity}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* 4. VRP Route Section */}
                {algoSelectedSection === 'vrp' && (() => {
                  const depot = { lat: 12.9716, lng: 77.5946 };
                  const jobs = [
                    { id: '1', name: 'AC Repair (Vaishali)', latitude: 12.9352, longitude: 77.6245 },
                    { id: '2', name: 'Plumbing (Malviya)', latitude: 12.9716, longitude: 77.6412 },
                    { id: '3', name: 'Cleaning (Kalyan)', latitude: 12.9698, longitude: 77.7500 }
                  ];
                  const result = solveCombinatorialVRP(depot.lat, depot.lng, jobs);
                  return (
                    <div className="space-y-3 bg-slate-900/40 p-3 rounded-2xl border border-slate-800 text-xs">
                      <h5 className="font-extrabold text-gray-200 flex items-center gap-1.5">
                        <Map className="w-3.5 h-3.5 text-indigo-400" /> 2-Opt Vehicle Routing Optimizer
                      </h5>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        Computes optimized schedule sequence for SP to minimize travel distance overheads.
                      </p>
                      <div className="p-3 bg-slate-950/80 rounded-xl space-y-2 border border-slate-800">
                        <div className="text-[10px] space-y-1">
                          <span className="text-gray-400 block font-bold">Optimized Sequence:</span>
                          <p className="font-semibold text-gray-300 text-[11px] leading-tight">
                            {result.routeSequence.join(" ➔ ")}
                          </p>
                        </div>
                        <div className="flex justify-between text-xs pt-1.5 border-t border-slate-900 font-bold">
                          <span className="text-gray-400">Total Route Travel:</span>
                          <span className="text-indigo-400">{result.totalDistanceKm} km</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 2. Messages / Logs Tab */}
            {activeTab === 'messages' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold">Received Messages Inbox</span>
                  <button
                    onClick={() => { DemoEventBus.clearLogs(); setLogs([]); }}
                    className="text-[9px] text-red-400 hover:underline font-bold"
                  >
                    Clear All
                  </button>
                </div>

                {logs.length === 0 ? (
                  <div className="text-center py-10 bg-slate-900/20 border border-slate-800/50 rounded-2xl">
                    <MessageSquare className="w-8 h-8 text-slate-800 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Your simulated device inbox is empty.</p>
                    <p className="text-[10px] text-gray-600 mt-1">Triggers automatically during OTP events.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {logs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1 hover:border-slate-700 transition-all">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase
                            ${log.type === 'sms' ? 'bg-blue-900/40 text-blue-400 border border-blue-800/35' :
                              log.type === 'whatsapp' ? 'bg-green-900/40 text-green-400 border border-green-800/35' :
                                'bg-slate-800 text-slate-400'}`}>
                            {log.type} message
                          </span>
                          <span className="text-[8px] text-gray-600 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-semibold">{log.text}</p>

                        {/* If text contains OTP code extract it */}
                        {/OTP:?\s*(\d{4,6})/i.test(log.text) && (
                          <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-800/50 mt-1">
                            <button
                              onClick={() => {
                                const code = log.text.match(/OTP:?\s*(\d{4,6})/i)?.[1];
                                if (code) handleCopyOtp(code);
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold px-2 py-1 rounded-lg text-[9px] inline-flex items-center gap-1 active:scale-95"
                            >
                              <Copy className="w-2.5 h-2.5" /> Copy Code
                            </button>
                            <button
                              onClick={() => {
                                const code = log.text.match(/OTP:?\s*(\d{4,6})/i)?.[1];
                                if (code) {
                                  setLatestOtp({ otp: code, method: log.type, phoneNumber: '' });
                                  autofillOtpOnPage();
                                }
                              }}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-lg text-[9px] inline-flex items-center gap-1 active:scale-95"
                            >
                              <Zap className="w-2.5 h-2.5" /> Auto-Fill
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. Shortcuts Tab */}
            {activeTab === 'shortcuts' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold block">Quick Role Swapping</span>

                  {/* Admin Shortcut */}
                  <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-indigo-500/30 transition-colors">
                    <div>
                      <p className="text-xs font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                        Admin Dashboard
                      </p>
                      <p className="text-[9px] text-gray-500">View bookings backlog & financials</p>
                    </div>
                    <a
                      href="#/admin-login"
                      onClick={() => {
                        // Pre-populate admin local storage token for instant access
                        localStorage.setItem('visvasahome_admin_token', 'demo_admin_jwt_token');
                        DemoEventBus.addLog('system', 'Injected Admin Authentication JWT token. Navigating...');
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] inline-flex items-center gap-1 transition-all"
                    >
                      Login <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>

                  {/* SP Shortcut */}
                  <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-indigo-500/30 transition-colors">
                    <div>
                      <p className="text-xs font-bold flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-green-400" />
                        Partner Portal
                      </p>
                      <p className="text-[9px] text-gray-500">Complete customer jobs & see commission</p>
                    </div>
                    <a
                      href="#/sp-jobs"
                      onClick={() => {
                        // If not logged in, log in as demo phone
                        if (!isUserLoggedIn) {
                          localStorage.setItem('visvasahome_user_phone', '+919999999999');
                        }
                        DemoEventBus.addLog('system', 'Pre-filled Professional Auth session details. Navigating...');
                      }}
                      className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.5 rounded-xl text-[10px] inline-flex items-center gap-1 transition-all"
                    >
                      Open Portal <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/50">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold block">Advanced Workflows</span>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={handleSimulateAMC}
                      className="w-full py-2.5 px-3 bg-slate-900 border border-indigo-500/40 hover:border-indigo-500 hover:bg-indigo-950/20 text-indigo-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Simulate AMC Contract & Visits
                    </button>
                    
                    <button
                      onClick={handleSimulateContractorBidding}
                      className="w-full py-2.5 px-3 bg-slate-900 border border-blue-500/40 hover:border-blue-500 hover:bg-blue-950/20 text-blue-300 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 text-blue-400" /> Simulate Contractor Bidding Flow
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/50">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold block">Sandbox Operations</span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={autofillOtpOnPage}
                      disabled={!latestOtp}
                      className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5" /> Auto-Fill active OTP
                    </button>

                    <button
                      onClick={handleResetSandbox}
                      className="py-2.5 px-3 bg-red-950/40 hover:bg-red-900/30 text-red-400 border border-red-900/30 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Reset Database
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer status bar */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[9px] font-bold text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Local Database Simulator Active
            </span>
            <span>Vite Dev v2.0</span>
          </div>
        </div>
      )}
    </>
  );
}
