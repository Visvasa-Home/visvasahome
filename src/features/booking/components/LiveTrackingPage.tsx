import { useState, useEffect, useRef } from 'react';
import { BookingService, Booking } from '@booking/services/bookingService';
import {
  ArrowLeft, Phone, MessageSquare, Star, Shield, MapPin, Clock,
  CheckCircle, Navigation, Zap, AlertTriangle, X, Send,
  Play, Volume2, ShieldCheck, Heart, User, Check, RefreshCw, Copy
} from 'lucide-react';

interface LiveTrackingPageProps {
  onBack: () => void;
  bookingId?: string;
  onNavigate?: (page: string, data?: any) => void;
}

type TrackingStatus = 'confirmed' | 'assigned' | 'enroute' | 'arrived' | 'inprogress' | 'completed';

const statusSteps: { key: TrackingStatus; label: string; subLabel: string }[] = [
  { key: 'confirmed', label: 'Booking Confirmed', subLabel: 'Your booking has been received' },
  { key: 'assigned', label: 'Professional Assigned', subLabel: 'Ramesh Verma is assigned to your job' },
  { key: 'enroute', label: 'Professional En Route', subLabel: 'Heading towards your location' },
  { key: 'arrived', label: 'Arrived at Doorstep', subLabel: 'Professional is at your doorstep' },
  { key: 'inprogress', label: 'Service In Progress', subLabel: 'Work has started' },
  { key: 'completed', label: 'Service Completed', subLabel: 'Job finished successfully' },
];

const statusOrder: TrackingStatus[] = ['confirmed', 'assigned', 'enroute', 'arrived', 'inprogress', 'completed'];

const radarStyle = `
  @keyframes radar-pulse {
    0% { transform: scale(0.6); opacity: 0.8; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes radar-scan {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes avatar-fade {
    0%, 100% { opacity: 0.2; transform: scale(0.85); }
    50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 8px rgba(37,99,235,0.4)); }
  }
`;

const mockProfessional = {
  name: 'Ramesh Verma',
  rating: 4.9,
  reviews: 234,
  experience: '7 years',
  speciality: 'AC & Appliance Expert',
  phone: '+91 98765 43210',
  badge: 'Top Rated',
  bookingId: 'VH-38291',
  service: 'AC Service (Split)',
  eta: '8 minutes',
};

// Richer map path — follows road segments of the new city grid (400×260 viewBox)
// Start: bottom-left on the x=62 vertical road  →  Ring Road (y=132)  →  Nehru Road (x=149)  →  Home
const mapPath = [
  { x: 62,  y: 240 }, // Start: south end of vertical road
  { x: 62,  y: 218 },
  { x: 62,  y: 200 }, // Cross Ring Road South
  { x: 62,  y: 180 },
  { x: 62,  y: 160 },
  { x: 62,  y: 143 }, // Turn east at Ring Road
  { x: 80,  y: 132 }, // Along Ring Road
  { x: 100, y: 132 },
  { x: 120, y: 132 },
  { x: 140, y: 132 },
  { x: 149, y: 132 }, // Reach Nehru Road, turn north
  { x: 149, y: 118 },
  { x: 149, y: 105 },
  { x: 149, y: 90  }, // Pass Main Artery Road
  { x: 149, y: 80  },
  { x: 165, y: 68  }, // Turn east on Main Artery Road (diagonal)
  { x: 180, y: 68  },
  { x: 200, y: 68  },
  { x: 216, y: 68  }, // Reach home vertical road
  { x: 216, y: 80  }, // Turn south to home
  { x: 216, y: 95  }, // 🏠 Home destination
];

function getInterpolatedPosition(progress: number) {
  if (progress <= 0) return { pos: mapPath[0], angle: -90 };
  if (progress >= 1) return { pos: mapPath[mapPath.length - 1], angle: -90 };

  const totalSegments = mapPath.length - 1;
  const rawIndex = progress * totalSegments;
  const index = Math.floor(rawIndex);
  const segmentProgress = rawIndex - index;

  const start = mapPath[index];
  const end = mapPath[index + 1];

  const pos = {
    x: start.x + (end.x - start.x) * segmentProgress,
    y: start.y + (end.y - start.y) * segmentProgress
  };

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return { pos, angle };
}

// Build SVG polyline points string for the full route
const routePolyline = mapPath.map(p => `${p.x},${p.y}`).join(' ');

// Build partial polyline up to current position
function buildTravelledPolyline(progress: number): string {
  if (progress <= 0) return `${mapPath[0].x},${mapPath[0].y}`;
  const totalSegments = mapPath.length - 1;
  const rawIndex = progress * totalSegments;
  const index = Math.floor(rawIndex);
  const segProgress = rawIndex - index;

  const travelled = mapPath.slice(0, index + 1);
  const currentX = mapPath[index].x + (mapPath[index + 1]?.x - mapPath[index].x) * segProgress;
  const currentY = mapPath[index].y + (mapPath[index + 1]?.y - mapPath[index].y) * segProgress;
  return [...travelled.map(p => `${p.x},${p.y}`), `${currentX},${currentY}`].join(' ');
}

export function LiveTrackingPage({ onBack, bookingId, onNavigate }: LiveTrackingPageProps) {
  const [status, setStatus] = useState<TrackingStatus>('confirmed');
  const [matchingStep, setMatchingStep] = useState(0);
  const [mapProgress, setMapProgress] = useState(0);
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 minutes
  const [distanceMeters, setDistanceMeters] = useState(1200); // 1.2 km

  // Booking loaded dynamically
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(true);

  // UI state
  const [showOtp, setShowOtp] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [otpEntered, setOtpEntered] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [pointsEarned] = useState(() => Math.floor(Math.random() * 50) + 50); // 50-100 points

  // Call & Chat overlays
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'sp', text: 'Namaste! I am Ramesh Verma, your assigned technician. I am gathering my tools and starting my bike.', time: 'Just now' }
  ]);
  const [isSpTyping, setIsSpTyping] = useState(false);

  const [showCallModal, setShowCallModal] = useState(false);
  const [callState, setCallState] = useState<'idle' | 'calling' | 'ringing' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [callSubtitles, setCallSubtitles] = useState('');

  const [showSos, setShowSos] = useState(false);

  const handleBack = () => {
    if (bookingId && (bookingId.startsWith('VIS-') || bookingId.startsWith('VISIT'))) {
      if (onNavigate) onNavigate('amc-dashboard');
      else onBack();
    } else {
      onBack();
    }
  };

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isSpTyping]);

  // Load and poll booking details from local database
  useEffect(() => {
    if (!bookingId) return;

    const checkBooking = () => {
      const loggedInPhone = localStorage.getItem('visvasahome_user_phone');
      
      if (bookingId.startsWith('VIS-') || bookingId.startsWith('VISIT')) {
        // Load AMC visit details
        const savedVisits = localStorage.getItem('visvasahome_amc_visits');
        let matchedVisit = null;
        if (savedVisits) {
          try {
            const parsed = JSON.parse(savedVisits);
            matchedVisit = parsed.find((v: any) => v.id === bookingId);
          } catch (e) {
            console.error(e);
          }
        }

        if (matchedVisit) {
          const savedContracts = localStorage.getItem('visvasahome_amc_contracts');
          if (savedContracts && loggedInPhone) {
            try {
              const parsedContracts = JSON.parse(savedContracts);
              const matchedContract = parsedContracts.find((c: any) => c.contractNumber === matchedVisit.contractId);
              if (matchedContract && matchedContract.customerId !== loggedInPhone) {
                setIsAuthorized(false);
                return;
              }
            } catch (e) {
              console.error(e);
            }
          }
        }

        if (!matchedVisit) {
          matchedVisit = {
            id: bookingId,
            contractId: 'AMC-2026-0421',
            scheduledDate: new Date().toISOString(),
            status: 'scheduled',
            spId: 'SP001',
            spName: 'Suresh Reddy (Verified)',
            serviceType: 'Routine AMC Inspection & Service'
          };
        }

        const scheduledStr = typeof matchedVisit.scheduledDate === 'string'
          ? matchedVisit.scheduledDate
          : new Date(matchedVisit.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        const mockB: Booking = {
          id: matchedVisit.id,
          userId: 'demo-user',
          userName: localStorage.getItem('visvasahome_user_name') || 'Valued Customer',
          userPhone: loggedInPhone || '+91 98765 43210',
          serviceType: 'amc',
          serviceName: matchedVisit.serviceType || 'Routine AMC Inspection & Service',
          servicePrice: '0',
          scheduledDate: scheduledStr,
          scheduledTime: matchedVisit.visitTime || '10:00 AM',
          address: {
            line1: localStorage.getItem('visvasahome_user_address') || 'My Registered Address',
            city: 'Jaipur',
            state: 'Rajasthan',
            pincode: '302001'
          },
          status: matchedVisit.status === 'completed' ? 'completed' :
            matchedVisit.status === 'inprogress' ? 'in-progress' : 'confirmed',
          paymentStatus: 'paid',
          paymentMethod: 'online',
          professionalId: matchedVisit.spId || 'SP001',
          professionalName: matchedVisit.spName || 'Suresh Reddy (Verified)',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setBooking(mockB);
        setIsAuthorized(true);

        // Sync states if updated
        if (matchedVisit.status === 'inprogress' && status !== 'inprogress' && status !== 'completed') {
          setStatus('inprogress');
          setOtpEntered(true);
        } else if (matchedVisit.status === 'completed' && status !== 'completed') {
          setStatus('completed');
          setOtpEntered(true);
          setShowRating(true);
        }
        return;
      }

      const b = BookingService.getBookingById(bookingId);
      if (b) {
        if (loggedInPhone) {
          const cleanBookingPhone = b.userPhone.replace(/[^\d+]/g, '');
          const cleanUserPhone = loggedInPhone.replace(/[^\d+]/g, '');
          if (cleanBookingPhone !== cleanUserPhone) {
            setIsAuthorized(false);
            return;
          }
        }
        setBooking(b);
        setIsAuthorized(true);
        // Sync states if updated externally (e.g. from partner portal)
        if (b.status === 'assigned' && status === 'confirmed') {
          setStatus('assigned');
        } else if (b.status === 'enroute' && (status === 'confirmed' || status === 'assigned')) {
          setStatus('enroute');
          setMapProgress(0.01);
        } else if (b.status === 'arrived' && status !== 'arrived' && status !== 'inprogress' && status !== 'completed') {
          setStatus('arrived');
          setMapProgress(1.0);
          setShowOtp(true);
        } else if (b.status === 'in-progress' && status !== 'inprogress' && status !== 'completed') {
          setStatus('inprogress');
          setOtpEntered(true);
        } else if (b.status === 'completed' && status !== 'completed') {
          setStatus('completed');
          setOtpEntered(true);
          setShowRating(true);
        }
      }
    };

    checkBooking();
    const interval = setInterval(checkBooking, 2000);
    return () => clearInterval(interval);
  }, [bookingId, status]);

  // Demo flow simulations
  useEffect(() => {
    // 1. Confirmed -> Assigned (after 8s matching simulation)
    if (status === 'confirmed') {
      setMatchingStep(0);
      const t1 = setTimeout(() => setMatchingStep(1), 2000);
      const t2 = setTimeout(() => setMatchingStep(2), 4000);
      const t3 = setTimeout(() => setMatchingStep(3), 6000);
      const t4 = setTimeout(() => {
        setStatus('assigned');
        if (bookingId) {
          BookingService.updateBookingStatus(bookingId, 'assigned');
          // Also set professional name in database if not set
          const bookings = BookingService.getAllBookings();
          const idx = bookings.findIndex(b => b.id === bookingId);
          if (idx !== -1 && !bookings[idx].professionalName) {
            bookings[idx].professionalName = 'Ramesh Verma';
            bookings[idx].professionalId = 'PRO10234';
            localStorage.setItem('visvasahome_bookings', JSON.stringify(bookings));
          }
        }
      }, 8000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }

    // 2. Assigned -> Enroute (after 3s)
    if (status === 'assigned') {
      const timer = setTimeout(() => {
        setStatus('enroute');
        if (bookingId) {
          BookingService.updateBookingStatus(bookingId, 'enroute');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    // 3. Enroute path animation (takes ~20s)
    if (status === 'enroute') {
      const interval = setInterval(() => {
        setMapProgress(prev => {
          const next = prev + 0.005;
          if (next >= 1) {
            clearInterval(interval);
            setStatus('arrived');
            setShowOtp(true); // Automatically trigger OTP modal upon arrival
            if (bookingId) {
              BookingService.updateBookingStatus(bookingId, 'arrived');
            }
            return 1;
          }
          return next;
        });

        setEtaSeconds(prev => (prev > 10 ? prev - 3 : 10));
        setDistanceMeters(prev => (prev > 15 ? prev - 7 : 5));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [status]);

  // Call simulation updates
  useEffect(() => {
    let timer: any;
    let subtitleTimer: any;
    let durationTimer: any;

    if (showCallModal) {
      setCallState('calling');
      setCallSubtitles('Calling Ramesh Verma...');

      // Transition to Ringing
      timer = setTimeout(() => {
        setCallState('ringing');
        setCallSubtitles('Ringing...');

        // Transition to Connected
        timer = setTimeout(() => {
          setCallState('connected');
          setCallSubtitles('Ramesh: "Hello, Ramesh here. Namaste! I am heading towards your location."');

          // Duration tracker
          durationTimer = setInterval(() => {
            setCallDuration(d => d + 1);
          }, 1000);

          // Change dialogue after 4s
          subtitleTimer = setTimeout(() => {
            setCallSubtitles('Ramesh: "I see your location near the park. I will reach in about 2-3 minutes. Please keep the OTP ready."');

            // Auto-hangup after 8s of conversation
            subtitleTimer = setTimeout(() => {
              setCallSubtitles('Ramesh: "Alright, see you soon!"');
              setTimeout(() => {
                setCallState('ended');
                setCallSubtitles('Call ended');
                setTimeout(() => setShowCallModal(false), 1000);
              }, 2000);
            }, 6000);
          }, 4500);

        }, 2000);
      }, 1500);
    } else {
      setCallState('idle');
      setCallDuration(0);
      setCallSubtitles('');
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(subtitleTimer);
      clearInterval(durationTimer);
    };
  }, [showCallModal]);

  const currentIndex = statusOrder.indexOf(status);

  const handleStartJob = () => {
    setShowOtp(false);
    setOtpEntered(true);
    setStatus('inprogress');
    if (bookingId) {
      if (bookingId.startsWith('VIS-') || bookingId.startsWith('VISIT')) {
        // Update AMC visit status to inprogress
        const savedVisits = localStorage.getItem('visvasahome_amc_visits');
        if (savedVisits) {
          try {
            const parsedVisits = JSON.parse(savedVisits);
            const updatedVisits = parsedVisits.map((v: any) => {
              if (v.id === bookingId) {
                return { ...v, status: 'inprogress' };
              }
              return v;
            });
            localStorage.setItem('visvasahome_amc_visits', JSON.stringify(updatedVisits));
          } catch (e) {
            console.error(e);
          }
        }
      } else {
        BookingService.updateBookingStatus(bookingId, 'in-progress');
      }
    }

    // Simulate work finishing in 7 seconds
    setTimeout(() => {
      setStatus('completed');
      if (bookingId) {
        if (bookingId.startsWith('VIS-') || bookingId.startsWith('VISIT')) {
          // Update AMC visit status to completed
          const savedVisits = localStorage.getItem('visvasahome_amc_visits');
          if (savedVisits) {
            try {
              const parsedVisits = JSON.parse(savedVisits);
              const updatedVisits = parsedVisits.map((v: any) => {
                if (v.id === bookingId) {
                  return { ...v, status: 'completed' };
                }
                return v;
              });
              localStorage.setItem('visvasahome_amc_visits', JSON.stringify(updatedVisits));

              // Increment completed visits on contract
              const targetVisit = parsedVisits.find((v: any) => v.id === bookingId);
              if (targetVisit) {
                const savedContracts = localStorage.getItem('visvasahome_amc_contracts');
                if (savedContracts) {
                  const parsedContracts = JSON.parse(savedContracts);
                  const updatedContracts = parsedContracts.map((c: any) => {
                    if (c.contractNumber === targetVisit.contractId) {
                      return { ...c, visitsCompleted: (c.visitsCompleted || 0) + 1 };
                    }
                    return c;
                  });
                  localStorage.setItem('visvasahome_amc_contracts', JSON.stringify(updatedContracts));
                }
              }
            } catch (e) {
              console.error(e);
            }
          }
        } else {
          BookingService.updateBookingStatus(bookingId, 'completed');
        }
      }
      setTimeout(() => {
        setShowRating(true);
      }, 1500);
    }, 7000);
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setChatInput('');

    // Trigger typing simulation
    setIsSpTyping(true);
    setTimeout(() => {
      setIsSpTyping(false);
      let reply = "Got it, I am focused on getting to your location quickly. See you shortly!";
      if (userText.toLowerCase().includes('gate') || userText.toLowerCase().includes('call')) {
        reply = "Sure, I'll call you once I'm right outside the main gate.";
      } else if (userText.toLowerCase().includes('parking')) {
        reply = "Yes, parking inside would be great, thank you!";
      } else if (userText.toLowerCase().includes('cord') || userText.toLowerCase().includes('extension') || userText.toLowerCase().includes('tool')) {
        reply = "Yes, I carry all standard tools, drills, and an extension wire in my kit.";
      } else if (userText.toLowerCase().includes('mask') || userText.toLowerCase().includes('covid') || userText.toLowerCase().includes('safety')) {
        reply = "Yes, I follow all safety protocols, wear a mask, and carry shoe covers.";
      }
      setMessages(prev => [...prev, { sender: 'sp', text: reply, time: 'Just now' }]);
    }, 1500);
  };

  const handleQuickChat = (text: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: text, time: 'Just now' }]);
    setIsSpTyping(true);
    setTimeout(() => {
      setIsSpTyping(false);
      let reply = "Sure, I will make sure to do that. Thank you!";
      if (text.includes('gate')) {
        reply = "Understood. I will ring your phone when I reach the building gate.";
      } else if (text.includes('parking')) {
        reply = "Thank you so much! I'll park in the designated space.";
      } else if (text.includes('shoe')) {
        reply = "Yes, absolute safety compliance is our priority. I will put on clean shoe covers before entering.";
      } else if (text.includes('extension')) {
        reply = "Yes, I have a 10-meter extension board. No worries!";
      }
      setMessages(prev => [...prev, { sender: 'sp', text: reply, time: 'Just now' }]);
    }, 1500);
  };

  const formatEta = (seconds: number) => {
    if (status === 'arrived') return 'Arrived';
    if (status === 'inprogress') return 'Work started';
    if (status === 'completed') return 'Completed';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 100) return `${meters}m away`;
    return `${(meters / 1000).toFixed(2)} km away`;
  };

  const formatCallDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMatchingRadar = () => {
    const radarPros = [
      { id: 1, name: 'Suresh R.', rating: '4.8', x: '25%', y: '25%', delay: '0s' },
      { id: 2, name: 'Ramesh V.', rating: '4.9', x: '75%', y: '30%', delay: '1s' },
      { id: 3, name: 'Amit K.', rating: '4.7', x: '30%', y: '70%', delay: '2s' },
      { id: 4, name: 'Vikram S.', rating: '4.9', x: '70%', y: '75%', delay: '1.5s' },
    ];

    return (
      <div className="w-full h-full bg-slate-950 relative overflow-hidden rounded-3xl flex flex-col items-center justify-center p-6 border border-slate-800">
        <style dangerouslySetInnerHTML={{ __html: radarStyle }} />
        
        {/* Radar scan circular background */}
        <div className="relative w-44 h-44 md:w-64 md:h-64 flex items-center justify-center mt-12 md:mt-0">
          {/* Pulsing beacon waves */}
          <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping opacity-70" style={{ animationDuration: '3s' }} />
          <div className="absolute w-5/6 h-5/6 rounded-full border border-blue-500/30 animate-pulse" />
          <div className="absolute w-2/3 h-2/3 rounded-full border border-blue-500/40" />
          <div className="absolute w-1/3 h-1/3 rounded-full border border-blue-500/50" />
          
          {/* Radar Sweep Line */}
          <div 
            className="absolute inset-0 rounded-full border border-blue-500/20"
            style={{
              background: 'conic-gradient(from 0deg, rgba(37,99,235,0.15) 0deg, rgba(37,99,235,0) 120deg)',
              animation: 'radar-scan 4s linear infinite',
            }}
          />

          {/* Customer / Center Icon */}
          <div className="absolute w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-xl shadow-blue-500/30 z-10">
            <User className="w-5 h-5 text-white" />
          </div>

          {/* Pro Avatars scanning in background */}
          {radarPros.map((pro) => (
            <div
              key={pro.id}
              className="absolute flex flex-col items-center"
              style={{
                left: pro.x,
                top: pro.y,
                transform: 'translate(-50%, -50%)',
                animation: `avatar-fade 3s ease-in-out infinite`,
                animationDelay: pro.delay,
              }}
            >
              <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border-2 border-blue-500/40 text-[10px] font-black text-blue-400">
                {pro.name[0]}
              </div>
              <div className="bg-slate-900/90 border border-slate-800 text-[7px] font-bold text-gray-300 px-1 py-0.5 rounded mt-1 whitespace-nowrap shadow-md">
                {pro.name} · {pro.rating}★
              </div>
            </div>
          ))}
        </div>

        {/* Real-time search log updates */}
        <div className="w-full mt-4 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 text-left font-mono space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              Urban Search Engine v3.8
            </span>
            <span className="text-[9px] text-gray-500">
              Step {matchingStep + 1} of 4
            </span>
          </div>

          {/* Step log list */}
          <div className="text-[10px] space-y-1">
            <p className={matchingStep >= 0 ? "text-green-400" : "text-gray-600"}>
              {matchingStep >= 0 ? "✔ " : "○ "} Initializing search grid: Jaipur Hub...
            </p>
            <p className={matchingStep >= 1 ? "text-green-400" : matchingStep === 0 ? "text-blue-400 animate-pulse" : "text-gray-600"}>
              {matchingStep >= 1 ? "✔ " : matchingStep === 0 ? "⚡ " : "○ "} Safety checks & toolbox validation: CLEAR
            </p>
            <p className={matchingStep >= 2 ? "text-green-400" : matchingStep === 1 ? "text-blue-400 animate-pulse" : "text-gray-600"}>
              {matchingStep >= 2 ? "✔ " : matchingStep === 1 ? "⚡ " : "○ "} Pinging matching experts in 2.5km radius...
            </p>
            <p className={matchingStep >= 3 ? "text-green-400" : matchingStep === 2 ? "text-blue-400 animate-pulse" : "text-gray-600"}>
              {matchingStep >= 3 ? "✔ Waiting for partner Ramesh Verma to accept..." : "○ Waiting for response..."}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Get animated vehicle position
  const { pos: currentPos, angle: vehicleAngle } = getInterpolatedPosition(mapProgress);

  if (showRating) {
    if (reviewSubmitted) {
      // ── Post-review loyalty & repeat booking screen ──────────────────────────
      return (
        <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100">
            {/* Loyalty Points Earned */}
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <span className="text-3xl font-black text-white">+{pointsEarned}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold px-3 py-1 rounded-full mb-3">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Loyalty Points Earned!
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-1">Thank You! 🎉</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Your review helps others choose better. You've earned <strong className="text-amber-600">{pointsEarned} loyalty points</strong> for this booking.
            </p>

            {/* Personalised Offer Nudge */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white text-left mb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-x-6 -translate-y-6" />
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-blue-200 mb-1">Personalised Offer</p>
              <p className="text-sm font-extrabold">20% off your next booking!</p>
              <p className="text-xs text-blue-200 mt-0.5">Use code <span className="font-mono font-black bg-white/20 px-1.5 py-0.5 rounded">REPEAT20</span> · Valid 7 days</p>
            </div>

            <div className="space-y-2.5">
              {bookingId && (bookingId.startsWith('VIS-') || bookingId.startsWith('VISIT')) ? (
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('amc-dashboard');
                    else onBack();
                  }}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  Back to AMC Dashboard
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (onNavigate) onNavigate('booking-flow');
                    else onBack();
                  }}
                  className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  Book Another Service
                </button>
              )}
              <button
                onClick={() => {
                  if (onNavigate) onNavigate('loyalty-dashboard');
                  else onBack();
                }}
                className="w-full py-2.5 text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 rounded-xl border border-amber-200 transition-colors"
              >
                View My Rewards & Points
              </button>
              <button onClick={handleBack} className="w-full py-2 text-xs text-gray-400 hover:text-gray-600">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-tr from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100 transform scale-100 transition-all">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-800 mb-1">Service Completed!</h3>
          <p className="text-gray-500 text-sm mb-6">How was your experience with <strong>{mockProfessional.name}</strong>?</p>

          <div className="flex justify-center gap-3 mb-5">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className="transform hover:scale-125 transition-transform duration-150 active:scale-95"
              >
                <Star className={`w-10 h-10 transition-colors ${n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="text-sm font-bold text-[#2563EB] bg-blue-50 py-1.5 px-3 rounded-full inline-block mb-5 animate-pulse">
              {['', 'Poor ', 'Fair ', 'Good ', 'Very Good ', 'Excellent! '][rating]}
            </div>
          )}

          <textarea
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none mb-5 transition-all text-gray-700 bg-gray-50"
            placeholder="Add a review or comment (optional)..."
          />

          <div className="space-y-2">
            <button
              onClick={() => {
                setReviewSubmitted(true);
                // Also update the review and rating in the database if applicable!
                if (bookingId && (bookingId.startsWith('VIS-') || bookingId.startsWith('VISIT'))) {
                  // Update AMC visit rating and notes
                  const savedVisits = localStorage.getItem('visvasahome_amc_visits');
                  if (savedVisits) {
                    try {
                      const parsedVisits = JSON.parse(savedVisits);
                      const updatedVisits = parsedVisits.map((v: any) => {
                        if (v.id === bookingId) {
                          return {
                            ...v,
                            status: 'completed',
                            rating: rating,
                            notes: reviewText || 'Service completed successfully.'
                          };
                        }
                        return v;
                      });
                      localStorage.setItem('visvasahome_amc_visits', JSON.stringify(updatedVisits));
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }
              }}
              disabled={rating === 0}
              className="w-full py-3.5 bg-[#2563EB] text-white rounded-xl font-bold hover:bg-[#1D4ED8] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
            >
              Submit Review
            </button>
            <button onClick={handleBack} className="w-full py-2.5 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
              Skip Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No early return for confirmed/assigned states, we show the map immediately (Swiggy-style)

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            You do not have permission to view or track this service booking.
          </p>
          <button
            onClick={handleBack}
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Swiggy-Style Live Tracking Interface ──
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Sticky tracking header */}
      <div className="bg-white border-b border-gray-150 sticky top-0 z-20 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-gray-900 font-extrabold text-sm">Live Service Tracking</h2>
              <p className="text-[10px] text-gray-400">Order #{bookingId || mockProfessional.bookingId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#FC8019]/10 border border-[#FC8019]/20 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-[#FC8019] rounded-full animate-ping" />
              <span className="text-[9px] font-black text-[#FC8019] uppercase tracking-wider">Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-0 md:gap-5 p-0 md:p-4">
        {/* Map Column (Spans full height/weight on mobile, left block on desktop) */}
        <div className="md:col-span-7 flex flex-col h-[340px] md:h-[550px] relative">
          {/* SVG Map Container */}
          <div className="absolute inset-0 w-full h-full">
            {status === 'confirmed' ? (
              renderMatchingRadar()
            ) : (
              /* SVG Live Map — Swiggy-grade */
              <svg className="w-full h-full" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
              <defs>
                <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
                </filter>
                <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#f0f0f0" />
                </linearGradient>
                <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#B3D9F7" />
                  <stop offset="50%" stopColor="#90CAF9" />
                  <stop offset="100%" stopColor="#B3D9F7" />
                </linearGradient>
                <linearGradient id="parkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8E6C9" />
                  <stop offset="100%" stopColor="#A5D6A7" />
                </linearGradient>
              </defs>

              {/* Map base */}
              <rect width="400" height="260" fill="#F2F3F5" />

              {/* ── Water body / river ── */}
              <path d="M0 62 Q80 52 160 60 Q240 68 320 58 T400 55" stroke="url(#riverGrad)" strokeWidth="12" fill="none" opacity="0.75" />
              <path d="M0 62 Q80 52 160 60 Q240 68 320 58 T400 55" stroke="#E3F2FD" strokeWidth="4" fill="none" opacity="0.4" strokeDasharray="8,12" />
              <text x="290" y="60" fontSize="5" fill="#64B5F6" fontWeight="700" letterSpacing="1">Yamuna River</text>

              {/* ── Parks ── */}
              <rect x="8" y="8" width="52" height="44" rx="6" fill="url(#parkGrad)" stroke="#81C784" strokeWidth="0.8" opacity="0.95" />
              <text x="34" y="25" fontSize="5.5" fontWeight="800" fill="#388E3C" textAnchor="middle">Central</text>
              <text x="34" y="34" fontSize="5.5" fontWeight="800" fill="#388E3C" textAnchor="middle">Park</text>
              <circle cx="20" cy="40" r="4" fill="#66BB6A" opacity="0.7" />
              <circle cx="34" cy="44" r="3.5" fill="#43A047" opacity="0.6" />
              <circle cx="50" cy="40" r="4" fill="#66BB6A" opacity="0.7" />

              <rect x="320" y="175" width="40" height="35" rx="5" fill="url(#parkGrad)" stroke="#81C784" strokeWidth="0.8" opacity="0.85" />
              <text x="340" y="196" fontSize="5" fontWeight="700" fill="#388E3C" textAnchor="middle">Garden</text>

              {/* ── Building blocks — commercial ── */}
              {[
                { x:75,  y:8,  w:58, h:40, c:'#DCE0E9' },
                { x:148, y:8,  w:50, h:32, c:'#E0E4EE' },
                { x:215, y:8,  w:62, h:42, c:'#D8DCE8' },
                { x:292, y:8,  w:52, h:38, c:'#DDE1EB' },
                { x:358, y:8,  w:40, h:44, c:'#D5D9E4' },
              ].map((b, i) => (
                <rect key={`top-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={b.c} stroke="#C5CAD6" strokeWidth="0.5" />
              ))}

              {/* ── Building blocks — left column ── */}
              {[
                { x:8,   y:78,  w:44, h:52, c:'#DCE0E9' },
                { x:8,   y:145, w:44, h:48, c:'#E0E4EE' },
                { x:8,   y:205, w:44, h:50, c:'#D8DCE8' },
              ].map((b, i) => (
                <rect key={`left-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={b.c} stroke="#C5CAD6" strokeWidth="0.5" />
              ))}

              {/* ── Building blocks — main grid ── */}
              {[
                { x:75,  y:80,  w:56, h:48, c:'#D8DCE9' },
                { x:75,  y:145, w:56, h:48, c:'#DCE0EE' },
                { x:75,  y:205, w:56, h:52, c:'#D8DCE9' },
                { x:148, y:58,  w:50, h:52, c:'#DDE1EB' },
                { x:148, y:128, w:50, h:50, c:'#D8DCE8' },
                { x:148, y:195, w:50, h:62, c:'#E0E4EE' },
                { x:215, y:68,  w:62, h:50, c:'#D5D9E4' },
                { x:215, y:135, w:62, h:50, c:'#D8DCE9' },
                { x:215, y:200, w:62, h:58, c:'#DCE0EE' },
                { x:292, y:62,  w:52, h:55, c:'#DDE1EB' },
                { x:292, y:135, w:52, h:52, c:'#D8DCE8' },
                { x:292, y:205, w:52, h:52, c:'#D5D9E4' },
                { x:358, y:68,  w:40, h:55, c:'#DCE0E9' },
                { x:358, y:140, w:40, h:52, c:'#D8DCE9' },
                { x:358, y:208, w:40, h:50, c:'#E0E4EE' },
              ].map((b, i) => (
                <rect key={`grid-${i}`} x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={b.c} stroke="#C8CDD8" strokeWidth="0.4" />
              ))}

              {/* ── Major horizontal roads (arteries) ── */}
              {/* Road shadow */}
              <line x1="0" y1="69" x2="400" y2="69" stroke="#B8BBC5" strokeWidth="9" />
              <line x1="0" y1="68" x2="400" y2="68" stroke="#F5F5F5" strokeWidth="7.5" />
              <line x1="0" y1="68" x2="400" y2="68" stroke="#FFFFFF" strokeWidth="6" />
              {/* Centre dashes */}
              <line x1="0" y1="68" x2="400" y2="68" stroke="#FFC107" strokeWidth="0.8" strokeDasharray="12,10" opacity="0.5" />
              <text x="200" y="64" fontSize="4.5" fill="#9E9E9E" fontWeight="700" textAnchor="middle" letterSpacing="1">MAIN ARTERY ROAD</text>

              <line x1="0" y1="133" x2="400" y2="133" stroke="#B8BBC5" strokeWidth="8" />
              <line x1="0" y1="132" x2="400" y2="132" stroke="#F5F5F5" strokeWidth="6.5" />
              <line x1="0" y1="132" x2="400" y2="132" stroke="#FFFFFF" strokeWidth="5.5" />
              <line x1="0" y1="132" x2="400" y2="132" stroke="#FFC107" strokeWidth="0.7" strokeDasharray="12,10" opacity="0.5" />
              <text x="100" y="128" fontSize="4.5" fill="#9E9E9E" fontWeight="700" textAnchor="middle" letterSpacing="1">RING ROAD</text>

              <line x1="0" y1="200" x2="400" y2="200" stroke="#C8CBD5" strokeWidth="6" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#EFEFEF" strokeWidth="5" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#FAFAFA" strokeWidth="4" />

              {/* ── Major vertical roads ── */}
              <line x1="62" y1="0" x2="62" y2="260" stroke="#B8BBC5" strokeWidth="9" />
              <line x1="61" y1="0" x2="61" y2="260" stroke="#F5F5F5" strokeWidth="7.5" />
              <line x1="61" y1="0" x2="61" y2="260" stroke="#FFFFFF" strokeWidth="6" />
              <line x1="61" y1="0" x2="61" y2="260" stroke="#FFC107" strokeWidth="0.8" strokeDasharray="12,10" opacity="0.5" />

              <line x1="150" y1="0" x2="150" y2="260" stroke="#B8BBC5" strokeWidth="8" />
              <line x1="149" y1="0" x2="149" y2="260" stroke="#F5F5F5" strokeWidth="6.5" />
              <line x1="149" y1="0" x2="149" y2="260" stroke="#FFFFFF" strokeWidth="5.5" />
              <line x1="149" y1="0" x2="149" y2="260" stroke="#FFC107" strokeWidth="0.7" strokeDasharray="12,10" opacity="0.5" />
              <text x="149" y="112" fontSize="4.5" fill="#9E9E9E" fontWeight="700" transform="rotate(-90, 149, 112)" textAnchor="middle" letterSpacing="1">NEHRU ROAD</text>

              <line x1="217" y1="0" x2="217" y2="260" stroke="#C0C3CC" strokeWidth="7" />
              <line x1="216" y1="0" x2="216" y2="260" stroke="#F5F5F5" strokeWidth="5.5" />
              <line x1="216" y1="0" x2="216" y2="260" stroke="#FFFFFF" strokeWidth="5" />

              <line x1="294" y1="0" x2="294" y2="260" stroke="#C8CBD5" strokeWidth="6" />
              <line x1="294" y1="0" x2="294" y2="260" stroke="#EFEFEF" strokeWidth="5" />
              <line x1="294" y1="0" x2="294" y2="260" stroke="#FAFAFA" strokeWidth="4" />

              <line x1="360" y1="0" x2="360" y2="260" stroke="#C8CBD5" strokeWidth="6" />
              <line x1="360" y1="0" x2="360" y2="260" stroke="#EFEFEF" strokeWidth="5" />
              <line x1="360" y1="0" x2="360" y2="260" stroke="#FAFAFA" strokeWidth="4" />

              {/* ── Diagonal lane (adds realism) ── */}
              <line x1="62" y1="68" x2="150" y2="132" stroke="#DADDE6" strokeWidth="5" />
              <line x1="62" y1="68" x2="150" y2="132" stroke="#FAFAFA" strokeWidth="4" />

              {/* ── Route: dashed background (full route) ── */}
              <polyline
                points={routePolyline}
                stroke="#B0BEC5"
                strokeWidth="4"
                strokeDasharray="7,6"
                fill="none"
                opacity="0.65"
                strokeLinecap="round"
              />
              {/* Route: travelled portion glow */}
              <polyline
                points={buildTravelledPolyline(mapProgress)}
                stroke="#10B981"
                strokeWidth="5.5"
                fill="none"
                opacity="0.15"
                strokeLinecap="round"
              />
              <polyline
                points={buildTravelledPolyline(mapProgress)}
                stroke="#10B981"
                strokeWidth="3.5"
                fill="none"
                opacity="0.95"
                strokeLinecap="round"
              />

              {/* ── Origin pin (start location) ── */}
              <g transform={`translate(${mapPath[0].x}, ${mapPath[0].y})`}>
                <circle cx="0" cy="0" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
              </g>

              {/* ── Home destination pin with 3-ring beacon ── */}
              <g transform={`translate(${mapPath[mapPath.length-1].x}, ${mapPath[mapPath.length-1].y})`}>
                {/* Pulse rings */}
                <circle cx="0" cy="0" r="22" fill="#2563EB" opacity="0.08">
                  <animate attributeName="r" values="14;22;14" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.12;0.04;0.12" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle cx="0" cy="0" r="15" fill="#2563EB" opacity="0.14">
                  <animate attributeName="r" values="9;15;9" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.18;0.06;0.18" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Pin body */}
                <path
                  d="M0 -16 C-6 -16 -10 -11 -10 -6 C-10 -1 0 9 0 9 C0 9 10 -1 10 -6 C10 -11 6 -16 0 -16 Z"
                  fill="#2563EB"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  filter="url(#mapShadow)"
                />
                <circle cx="0" cy="-6" r="3.5" fill="#FFFFFF" />
                {/* Home icon mini */}
                <text x="0" y="-4" fontSize="3" fill="white" textAnchor="middle">🏠</text>
                {/* Label */}
                <rect x="-18" y="11" width="36" height="10" rx="3" fill="white" opacity="0.92" />
                <text x="0" y="19" fontSize="5.5" fontWeight="800" fill="#1D4ED8" textAnchor="middle">Your Home</text>
              </g>

              {/* ── Moving / Parked Vehicle (Motorcycle) ── */}
              {(status === 'enroute' || status === 'assigned') && (
                <g
                  transform={`translate(${currentPos.x}, ${currentPos.y})`}
                  style={{ transition: 'transform 0.18s linear' }}
                >
                  {/* Outer glow */}
                  <circle cx="0" cy="0" r="14" fill="#FC8019" opacity="0.15">
                    <animate attributeName="r" values="10;16;10" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Bike marker disc */}
                  <circle cx="0" cy="0" r="9" fill="#FC8019" stroke="#FFFFFF" strokeWidth="2" filter="url(#mapShadow)" />
                  {/* Motorcycle SVG icon centered, rotated with movement */}
                  <g transform={`rotate(${vehicleAngle}) scale(0.38)`}>
                    {/* Rider + bike silhouette */}
                    <ellipse cx="0" cy="0" rx="12" ry="5" fill="#FFFFFF" opacity="0.95" />
                    <circle cx="-8" cy="3" r="4" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                    <circle cx="8" cy="3" r="4" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                    <rect x="-3" y="-9" width="6" height="5" rx="1.5" fill="#FFFFFF" />
                  </g>
                </g>
              )}

              {/* ── Arrived checkmark marker ── */}
              {(status === 'arrived' || status === 'inprogress') && (
                <g transform={`translate(${mapPath[mapPath.length-1].x - 7}, ${mapPath[mapPath.length-1].y})`}>
                  <circle cx="0" cy="0" r="12" fill="#10B981" opacity="0.2">
                    <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.25;0.08;0.25" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="9" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
                  <polyline points="-4,0 -1,4 6,-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
              )}

              {/* ── Landmark labels ── */}
              <text x="105" y="48" fontSize="5" fill="#757575" fontWeight="700">City Mall</text>
              <text x="230" y="30" fontSize="5" fill="#757575" fontWeight="700">Sector-7</text>
              <text x="310" y="90" fontSize="5" fill="#757575" fontWeight="700">Block-B</text>
              <text x="88" y="110" fontSize="5" fill="#757575" fontWeight="700">Civil Lines</text>
              <text x="230" y="110" fontSize="5" fill="#757575" fontWeight="700">Vaishali Nagar</text>
            </svg>
            )}
          </div>

          {/* Floating ETA / Info card (Swiggy UI style) */}
          {status === 'confirmed' && (
            <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-4 flex items-center justify-between border border-gray-100 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-sm text-gray-800">
                    {matchingStep === 0 && "Checking Safety Clearance..."}
                    {matchingStep === 1 && "Filtering Top-Rated Pros..."}
                    {matchingStep === 2 && "Pinging Nearest Expert..."}
                    {matchingStep === 3 && "Confirming Assignment..."}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5 animate-pulse">
                    {matchingStep === 0 && "Verifying backgrounds & tools..."}
                    {matchingStep === 1 && "Matching specialists with ratings >4.8★"}
                    {matchingStep === 2 && "Sending request to Ramesh Verma (4.9★)"}
                    {matchingStep === 3 && "Ramesh is accepting the booking..."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[9px] font-black text-blue-600 uppercase">
                  {matchingStep === 3 ? "CONFIRMING" : "MATCHING"}
                </span>
              </div>
            </div>
          )}

          {status === 'assigned' && (
            <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-4 flex items-center justify-between border border-gray-100 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FC8019]/10 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-[#FC8019]" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-sm text-gray-800">Partner Assigned</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">{booking?.professionalName || mockProfessional.name} is gathering tools</p>
                </div>
              </div>
              <div className="bg-[#FC8019] text-white text-[9px] font-black px-2.5 py-1 rounded-full animate-bounce">
                ASSIGNED
              </div>
            </div>
          )}

          {status === 'enroute' && (
            <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl p-4 flex items-center justify-between border border-gray-100 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FC8019]/10 rounded-xl flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-[#FC8019]" />
                </div>
                <div className="text-left">
                  <h4 className="font-extrabold text-sm text-gray-800">Arriving in {formatEta(etaSeconds)}</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">{formatDistance(distanceMeters)} · Ramesh is riding bike</p>
                </div>
              </div>
            </div>
          )}

          {status === 'arrived' && (
            <div className="absolute top-4 left-4 right-4 bg-green-500 text-white shadow-lg rounded-2xl p-4 text-center z-10 animate-bounce">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-100">Arrived</p>
              <h4 className="font-black text-sm mt-0.5">{booking?.professionalName || mockProfessional.name} is outside your doorstep!</h4>
            </div>
          )}

          {status === 'inprogress' && (
            <div className="absolute top-4 left-4 right-4 bg-blue-600 text-white shadow-lg rounded-2xl p-4 flex items-center justify-center gap-2 z-10">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold">Service execution in progress...</span>
            </div>
          )}
        </div>

        {/* Swiggy Detail Drawer (Spans right block on desktop) */}
        <div className="md:col-span-5 bg-white rounded-t-3xl md:rounded-3xl p-5 border-t md:border border-gray-200 shadow-xl space-y-5 -mt-6 md:mt-0 z-10">
          
          {/* Swipe indicator for mobile */}
          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto md:hidden -mt-2 mb-3" />

          {/* Partner block */}
          {status === 'confirmed' ? (
            <div className="space-y-4 pb-4 border-b border-gray-100 text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center relative">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  <span className="absolute inset-0 border border-blue-500 rounded-full animate-ping opacity-30" />
                </div>
                <div className="flex-1">
                  <h4 className="font-extrabold text-gray-800 text-sm">Assigning Professional</h4>
                  <p className="text-[10px] text-gray-400 font-bold mt-0.5">Searching within 2.5 km of your address</p>
                </div>
              </div>
              
              {/* Detailed Real-time Matching Checklists */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 mb-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Assignment Progress</span>
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full animate-pulse">
                    Step {matchingStep + 1} of 4
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Step 1: Safety validation */}
                  <div className="flex items-start gap-3">
                    {matchingStep >= 1 ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : matchingStep === 0 ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-5 h-5 bg-gray-100 border border-gray-200 rounded-full shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs font-extrabold ${matchingStep >= 1 ? 'text-gray-800' : 'text-gray-500'}`}>
                        Safety & Health Verification
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">Clear background check & safety tool audit</p>
                    </div>
                  </div>

                  {/* Step 2: Filtering ratings */}
                  <div className="flex items-start gap-3">
                    {matchingStep >= 2 ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : matchingStep === 1 ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-5 h-5 bg-gray-100 border border-gray-200 rounded-full shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs font-extrabold ${matchingStep >= 2 ? 'text-gray-800' : 'text-gray-500'}`}>
                        Top-Rated Partner Filter
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">Scanning for specialists with ratings &gt; 4.8★</p>
                    </div>
                  </div>

                  {/* Step 3: Acceptance request */}
                  <div className="flex items-start gap-3">
                    {matchingStep >= 3 ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : matchingStep === 2 ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0 mt-0.5" />
                    ) : (
                      <div className="w-5 h-5 bg-gray-100 border border-gray-200 rounded-full shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className={`text-xs font-extrabold ${matchingStep >= 3 ? 'text-gray-800' : 'text-gray-500'}`}>
                        Booking Acceptance Request
                      </p>
                      <p className="text-[10px] text-gray-400 font-medium">Sending request to Ramesh Verma (4.9★)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Partner block (Ramesh Verma / Suresh Reddy) */
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-gradient-to-tr from-[#FC8019] to-orange-500 text-white rounded-full flex items-center justify-center font-black text-lg relative shadow-md">
                {(booking?.professionalName || mockProfessional.name)[0]}
                <span className="absolute bottom-0 right-0 bg-green-500 border border-white w-3 h-3 rounded-full" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-gray-800 text-sm">{booking?.professionalName || mockProfessional.name}</h4>
                  <span className="text-[9px] bg-green-50 text-green-700 border border-green-200 font-extrabold px-1.5 py-0.5 rounded-md uppercase">Service Pro</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500 font-bold">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span>{mockProfessional.rating}</span>
                  <span>·</span>
                  <span>{mockProfessional.experience} exp</span>
                </div>
              </div>

              {/* Quick action buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCallModal(true)} 
                  className="w-10 h-10 bg-[#FC8019]/10 text-[#FC8019] hover:bg-[#FC8019]/20 rounded-full flex items-center justify-center transition-colors"
                  title="Call partner"
                >
                  <Phone className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={() => setShowChat(true)} 
                  className="w-10 h-10 bg-[#FC8019]/10 text-[#FC8019] hover:bg-[#FC8019]/20 rounded-full flex items-center justify-center transition-colors relative"
                  title="Chat with partner"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
              </div>
            </div>
          )}

          {/* Swiggy horizontal timeline */}
          <div className="py-2.5">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3.5">Service Progress</h5>
            <div className="flex items-center justify-between relative px-2">
              {/* Progress Line */}
              <div className="absolute left-6 right-6 top-3 h-0.5 bg-gray-200 z-0">
                <div 
                  className="h-full bg-[#FC8019] transition-all duration-300"
                  style={{ width: `${(currentIndex / 5) * 100}%` }}
                />
              </div>

              {/* Progress Nodes */}
              {statusOrder.map((stepKey, index) => {
                const isCompleted = index < currentIndex;
                const isActive = index === currentIndex;
                
                return (
                  <div key={stepKey} className="flex flex-col items-center z-10 relative">
                    <div 
                      className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border-2 transition-all duration-300
                        ${isCompleted ? 'bg-[#FC8019] border-[#FC8019] text-white' : 
                          isActive ? 'bg-white border-[#FC8019] text-[#FC8019] scale-110 shadow-sm' : 
                          'bg-white border-gray-200 text-gray-300'}`}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : isActive ? (
                        <div className="w-2 h-2 bg-[#FC8019] rounded-full animate-pulse" />
                      ) : (
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                      )}
                    </div>
                    {/* Compact Label */}
                    <span 
                      className={`text-[8px] font-bold mt-1.5 tracking-tighter whitespace-nowrap
                        ${isActive ? 'text-[#FC8019] font-black' : isCompleted ? 'text-gray-700' : 'text-gray-300'}`}
                    >
                      {stepKey === 'enroute' ? 'Enroute' : 
                       stepKey === 'inprogress' ? 'Active' : 
                       stepKey.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pin/Secure checks */}
          <div className="space-y-2">
            {status === 'arrived' && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 space-y-3">
                <p className="text-[10px] font-bold text-[#FC8019] uppercase tracking-wide flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Start Verification Code
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Provide this check-in OTP to Ramesh Verma when they arrive at your location:
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-mono font-black tracking-widest text-[#FC8019] bg-white border border-orange-200 px-4 py-1.5 rounded-xl w-max">
                    {booking?.startOTP || '7429'}
                  </p>
                  <button 
                    onClick={handleStartJob}
                    className="flex-grow py-2 px-3 bg-[#FC8019] text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-[#e16f11]"
                  >
                    Confirm Arrived & Start
                  </button>
                </div>
              </div>
            )}

            {status === 'inprogress' && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-2.5">
                <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Secure Completion Code
                </p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Give this code to the professional only after the work is finished to your satisfaction:
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-mono font-black tracking-widest text-blue-600 bg-white border border-blue-200 px-4 py-1.5 rounded-xl">
                    {booking?.completeOTP || '5678'}
                  </p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(booking?.completeOTP || '5678')}
                    className="p-3 bg-white border border-gray-200 text-gray-400 hover:text-gray-600 rounded-xl"
                    title="Copy Code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Service items detail box (Swiggy food order style) */}
          <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 space-y-3">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bill Details & Items</h5>
            <div className="flex items-start justify-between text-xs pb-2 border-b border-gray-200/60">
              <div>
                <h4 className="font-extrabold text-gray-800">{booking?.serviceName || mockProfessional.service}</h4>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Visvasa Home Care Plan</p>
              </div>
              <span className="font-extrabold text-gray-800">₹{booking?.servicePrice || '399'}</span>
            </div>

            <div className="flex justify-between text-xs pt-1">
              <span className="font-bold text-gray-500">Taxes & Fees</span>
              <span className="font-bold text-gray-500">₹0.00</span>
            </div>

            <div className="flex justify-between text-xs font-black text-gray-800 pt-1.5">
              <span>Paid Amount</span>
              <span className="text-[#FC8019]">₹{booking?.servicePrice || '399'}</span>
            </div>
          </div>

          {/* Secure Escrow protection footer notice */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-3.5 flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600 animate-pulse flex-shrink-0" />
            <p className="text-[10px] text-blue-800/80 leading-normal">
              Escrow Protection is Active. We release payments only after your confirmation code is entered.
            </p>
          </div>

          {/* Simulation panel for manual controls */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Control Room Simulation</p>
            <div className="flex flex-wrap gap-1">
              {statusOrder.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatus(s);
                    if (s === 'enroute') {
                      setMapProgress(0.01);
                      setEtaSeconds(480);
                      setDistanceMeters(1200);
                    } else if (s === 'arrived') {
                      setMapProgress(1.0);
                      setEtaSeconds(0);
                      setDistanceMeters(0);
                    }
                  }}
                  className={`px-2 py-1 text-[9px] font-black rounded-lg transition-colors border
                    ${status === s 
                      ? 'bg-slate-800 text-white border-slate-800' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtp && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-gray-100 shadow-2xl animate-slide-up transform transition-all">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-extrabold text-gray-800 text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Job Start Verification
              </h4>
              <button onClick={() => setShowOtp(false)} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-5">
              Please share this OTP with the professional <strong>only after</strong> they have arrived at your home with their equipment.
            </p>

            <div className="bg-blue-50/50 border border-blue-100/50 rounded-2xl py-5 text-center mb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full translate-x-8 -translate-y-8" />
              <p className="text-4xl font-black tracking-[0.25em] text-[#2563EB] pl-4">
                {booking?.startOTP || '7429'}
              </p>
              <p className="text-[10px] text-blue-600 font-bold mt-2.5 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5 animate-spin" /> Valid code for secure check-in
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleStartJob}
                className="w-full py-3.5 bg-[#2563EB] text-white rounded-2xl font-bold hover:bg-[#1D4ED8] transition-all shadow-md shadow-blue-500/10 active:scale-98"
              >
                Confirm OTP Shared — Start Job
              </button>
              <button
                onClick={() => setShowOtp(false)}
                className="w-full py-2.5 text-xs font-semibold text-gray-400 hover:text-gray-600"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS Modal */}
      {showSos && (
        <div className="fixed inset-0 bg-red-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border-2 border-red-200 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-3.5 text-red-600 mb-4 border-b border-red-50 pb-3">
              <div className="p-2.5 bg-red-50 rounded-2xl">
                <AlertTriangle className="w-6 h-6 animate-ping" />
              </div>
              <div>
                <h4 className="font-extrabold text-base">Safety Assistance Active</h4>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Secure Escort & Help</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-5">
              Need help? Your safety is our absolute priority. Select one of the emergency helpline services below:
            </p>

            <div className="space-y-2.5 mb-5">
              <a
                href="tel:112"
                className="w-full flex items-center justify-between p-3.5 bg-red-50 border border-red-100 hover:bg-red-100 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-red-600" />
                  <span className="text-xs font-bold text-red-700">Police Assistance</span>
                </div>
                <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full">Call 112</span>
              </a>

              <a
                href="tel:18005559999"
                className="w-full flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-700">Visvasa Emergency Desk</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400">24/7 Helpline</span>
              </a>

              <div className="p-3 bg-gray-50 rounded-2xl text-[11px] text-gray-500 border border-gray-150">
                <span className="font-bold text-gray-700">Current GPS coordinates:</span><br />
                26.8439° N, 75.8242° E (Jaipur)
              </div>
            </div>

            <button
              onClick={() => setShowSos(false)}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all text-xs"
            >
              Cancel SOS Alert
            </button>
          </div>
        </div>
      )}

      {/* Calling Simulation Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex flex-col items-center justify-between py-16 px-6 text-white backdrop-blur-md animate-fade-in">
          <div className="text-center mt-12 space-y-3">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-black shadow-2xl border-4 border-slate-800 mx-auto relative">
              {mockProfessional.name[0]}
              {callState === 'connected' && (
                <span className="absolute bottom-0 right-0 bg-green-500 border-2 border-slate-950 p-1.5 rounded-full w-4 h-4 animate-ping" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-extrabold">{mockProfessional.name}</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Visvasa Partner</p>
            </div>

            {callState === 'connected' && (
              <span className="inline-block bg-green-600/25 text-green-400 border border-green-500/20 px-3 py-0.5 rounded-full text-xs font-mono">
                {formatCallDuration(callDuration)}
              </span>
            )}
          </div>

          {/* Subtitles Overlay */}
          <div className="max-w-md w-full px-6 py-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-sm text-gray-300 leading-relaxed shadow-lg">
            <Volume2 className="w-4 h-4 mx-auto mb-2 text-blue-400" />
            <p className="italic font-medium">{callSubtitles}</p>
          </div>

          {/* Hang Up Action Button */}
          <button
            onClick={() => setShowCallModal(false)}
            className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-700 active:scale-90 transition-all"
          >
            <X className="w-8 h-8 text-white" />
          </button>
        </div>
      )}

      {/* Chat Drawer Overlay (Sliding Bottom Panel) */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-end backdrop-blur-xs animate-fade-in">
          {/* Overlay dismissal */}
          <div className="absolute inset-0" onClick={() => setShowChat(false)} />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-slide-left">

            {/* Chat Header */}
            <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {mockProfessional.name[0]}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-800">{mockProfessional.name}</h4>
                  <p className="text-[10px] text-green-500 font-bold uppercase">Online · Service Partner</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Bubbles scroll space */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50">
              {messages.map((m, idx) => {
                const isSp = m.sender === 'sp';
                return (
                  <div key={idx} className={`flex ${isSp ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm
                      ${isSp
                        ? 'bg-white text-gray-800 rounded-tl-xs border border-gray-150'
                        : 'bg-[#2563EB] text-white rounded-tr-xs'}`}>
                      <p>{m.text}</p>
                      <span className={`block text-[9px] text-right mt-1 ${isSp ? 'text-gray-400' : 'text-blue-200'}`}>
                        {m.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isSpTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-150 rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions and Input */}
            <div className="bg-white border-t border-gray-100 p-4 space-y-3">
              {/* Quick Reply Badges */}
              <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickChat(reply)}
                    className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors active:scale-95"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Chat Input Field */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-grow border border-gray-200 rounded-2xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent text-gray-700"
                  placeholder="Type a message for Ramesh..."
                />
                <button
                  type="submit"
                  className="p-2.5 bg-[#2563EB] text-white rounded-2xl hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-500/10 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

const quickReplies = [
  "Please call when you are near the gate.",
  "Do you need parking space?",
  "Please wear a shoe cover/mask.",
  "Bring an extension cord if possible."
];
