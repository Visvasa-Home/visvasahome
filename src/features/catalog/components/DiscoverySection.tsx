import { useState, useEffect, useRef } from "react";
import {
  Smartphone,
  Users,
  Megaphone,
  Star,
  ArrowRight,
  Download,
  Share2,
  BadgeCheck,
  Gift,
  TrendingUp,
  Play,
  ChevronRight,
  QrCode,
  Bell,
  Zap,
  Heart,
} from "lucide-react";

interface DiscoverySectionProps {
  onGetStarted?: () => void;
  onNavigate?: (page: string) => void;
}

// ── Animated number counter hook ──
function useCountUp(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(timer);
      } else {
        setVal(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return val;
}

// ── Phone mockup for app channel ──
function AppPhoneMockup() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Browse Services", icon: "🔍", color: "from-blue-500 to-blue-600" },
    { label: "Book in 60s", icon: "📅", color: "from-indigo-500 to-indigo-600" },
    { label: "Track Live", icon: "📍", color: "from-violet-500 to-violet-600" },
    { label: "Rate & Review", icon: "⭐", color: "from-amber-500 to-orange-500" },
  ];

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % steps.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative mx-auto w-[160px] select-none">
      {/* Phone shell */}
      <div className="relative rounded-[2rem] bg-gray-900 shadow-2xl border-4 border-gray-800 overflow-hidden">
        {/* Status bar */}
        <div className="bg-gray-900 px-4 pt-3 pb-1 flex items-center justify-between">
          <span className="text-[8px] text-gray-400 font-bold">9:41</span>
          <div className="w-12 h-2.5 bg-gray-800 rounded-full" />
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-600" />
            <div className="w-2 h-2 rounded-full bg-gray-600" />
          </div>
        </div>
        {/* Screen */}
        <div className="bg-white px-2 py-2 min-h-[200px]">
          {/* App header */}
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-[7px] font-black">V</span>
            </div>
            <span className="text-[8px] font-black text-gray-800">VisvasaHome</span>
          </div>
          {/* Step cards */}
          {steps.map((s, i) => (
            <div
              key={i}
              className={`mb-1.5 rounded-xl p-2 flex items-center gap-2 transition-all duration-500 ${
                i === step
                  ? `bg-gradient-to-r ${s.color} text-white shadow-md scale-[1.02]`
                  : "bg-gray-50 text-gray-500 opacity-50"
              }`}
            >
              <span className="text-sm">{s.icon}</span>
              <span className="text-[8px] font-bold leading-tight">{s.label}</span>
              {i === step && <ChevronRight className="w-3 h-3 ml-auto" />}
            </div>
          ))}
          {/* Book now button */}
          <div className="mt-2 bg-blue-600 rounded-xl py-2 text-center">
            <span className="text-[8px] font-black text-white">Book Now →</span>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="bg-gray-900 h-4 flex items-center justify-center">
          <div className="w-10 h-0.5 bg-gray-700 rounded-full" />
        </div>
      </div>
      {/* Floating notification */}
      <div className="absolute -right-8 top-12 bg-white rounded-xl shadow-xl border border-gray-100 px-2 py-1.5 flex items-center gap-1.5 w-[90px] animate-bounce">
        <Bell className="w-3 h-3 text-blue-500 shrink-0" />
        <span className="text-[7px] font-bold text-gray-700 leading-tight">Pro is on the way!</span>
      </div>
      {/* Rating badge */}
      <div className="absolute -left-8 bottom-16 bg-white rounded-xl shadow-xl border border-gray-100 px-2 py-1.5 flex items-center gap-1 w-[72px]">
        <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
        <span className="text-[8px] font-black text-gray-800">4.8 / 5</span>
      </div>
    </div>
  );
}

// ── Word-of-mouth referral visual ──
function ReferralNetwork() {
  const [active, setActive] = useState(0);
  const nodes = [
    { name: "Priya", color: "bg-pink-500", top: "10%", left: "50%", bonus: "₹200 earned" },
    { name: "Rahul", color: "bg-blue-500", top: "45%", left: "15%", bonus: "₹150 earned" },
    { name: "Sunita", color: "bg-emerald-500", top: "45%", left: "85%", bonus: "₹200 earned" },
    { name: "Amit", color: "bg-violet-500", top: "80%", left: "30%", bonus: "₹150 earned" },
    { name: "Meera", color: "bg-orange-500", top: "80%", left: "70%", bonus: "₹200 earned" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % nodes.length), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-[200px] w-full max-w-[260px] mx-auto">
      {/* SVG lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 200" fill="none">
        {/* Center to each node */}
        {[[130, 100, 130, 22], [130, 100, 39, 90], [130, 100, 221, 90], [130, 100, 78, 160], [130, 100, 182, 160]].map(
          ([x1, y1, x2, y2], i) => (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i === active ? "#3b82f6" : "#e2e8f0"}
              strokeWidth={i === active ? "2" : "1"}
              strokeDasharray={i === active ? "4 2" : "none"}
              className="transition-all duration-500"
            />
          )
        )}
      </svg>
      {/* Center node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-12 h-12 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center">
          <span className="text-white text-[10px] font-black text-center leading-tight">You</span>
        </div>
      </div>
      {/* Outer nodes */}
      {nodes.map((node, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1"
          style={{ top: node.top, left: node.left }}
        >
          <div
            className={`w-9 h-9 rounded-full ${node.color} border-2 border-white shadow-md flex items-center justify-center transition-all duration-300 ${
              i === active ? "scale-110 ring-2 ring-blue-400 ring-offset-1" : "opacity-70"
            }`}
          >
            <span className="text-white text-[9px] font-bold">{node.name[0]}</span>
          </div>
          {i === active && (
            <div className="bg-white border border-gray-100 rounded-lg px-1.5 py-0.5 shadow-md">
              <span className="text-[7px] font-black text-emerald-600">{node.bonus}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Ads reach visual ──
function AdsReachVisual() {
  const platforms = [
    { name: "Google", icon: "🔍", reach: "2.4M", color: "from-red-500 to-orange-500", pct: 85 },
    { name: "Instagram", icon: "📸", reach: "1.8M", color: "from-pink-500 to-purple-500", pct: 72 },
    { name: "YouTube", icon: "▶️", reach: "1.2M", color: "from-red-600 to-red-500", pct: 60 },
    { name: "Facebook", icon: "👥", reach: "980K", color: "from-blue-600 to-blue-500", pct: 50 },
  ];

  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-3 w-full max-w-[260px] mx-auto">
      {platforms.map((p, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-sm w-4 text-center">{p.icon}</span>
          <div className="flex-1">
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] font-bold text-gray-600">{p.name}</span>
              <span className="text-[10px] font-black text-gray-800">{p.reach}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${p.color} rounded-full transition-all duration-1000`}
                style={{
                  width: animated ? `${p.pct}%` : "0%",
                  transitionDelay: `${i * 150}ms`,
                }}
              />
            </div>
          </div>
        </div>
      ))}
      <div className="pt-1 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-2">
        <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="text-[9px] font-bold text-blue-700">6.4M+ monthly reach across platforms</span>
      </div>
    </div>
  );
}

// ── Main component ──
export function DiscoverySection({ onGetStarted, onNavigate }: DiscoverySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const bookingsCount = useCountUp(10000, 1800, inView);
  const citiesCount = useCountUp(20, 1600, inView);
  const prosCount = useCountUp(5000, 2000, inView);

  const channels = [
    {
      id: "app",
      icon: Smartphone,
      label: "App",
      headline: "Book in under 60 seconds",
      sub: "Our mobile-first platform makes it effortless to browse, compare, and book verified professionals — anytime, anywhere.",
      color: "blue",
      gradientFrom: "from-blue-600",
      gradientTo: "to-indigo-600",
      bgLight: "bg-blue-50",
      textAccent: "text-blue-600",
      borderAccent: "border-blue-200",
      visual: <AppPhoneMockup />,
      features: [
        { icon: Download, text: "One-tap booking with saved addresses" },
        { icon: Bell, text: "Real-time push notifications & ETA" },
        { icon: Zap, text: "Instant price quotes — no hidden fees" },
      ],
      cta: "Download App",
      ctaAction: () => onGetStarted?.(),
    },
    {
      id: "wom",
      label: "Word of Mouth",
      icon: Users,
      headline: "Earn ₹200 per referral",
      sub: "Our happiest customers are our best marketers. Share your referral code with friends and family — both of you get rewarded.",
      color: "emerald",
      gradientFrom: "from-emerald-500",
      gradientTo: "to-teal-600",
      bgLight: "bg-emerald-50",
      textAccent: "text-emerald-600",
      borderAccent: "border-emerald-200",
      visual: <ReferralNetwork />,
      features: [
        { icon: Gift, text: "₹200 wallet credit for every referral" },
        { icon: Share2, text: "Your friend gets ₹150 off first booking" },
        { icon: BadgeCheck, text: "No cap — unlimited referrals welcome" },
      ],
      cta: "Start Referring",
      ctaAction: () => onNavigate?.("loyalty-dashboard"),
    },
    {
      id: "ads",
      label: "Ads",
      icon: Megaphone,
      headline: "Reach us wherever you scroll",
      sub: "From Google search to Instagram reels — we meet customers exactly where they are with verified reviews and transparent pricing.",
      color: "violet",
      gradientFrom: "from-violet-600",
      gradientTo: "to-purple-600",
      bgLight: "bg-violet-50",
      textAccent: "text-violet-600",
      borderAccent: "border-violet-200",
      visual: <AdsReachVisual />,
      features: [
        { icon: Star, text: "4.8★ rating shown on all ads — always honest" },
        { icon: TrendingUp, text: "6.4M+ monthly impressions across platforms" },
        { icon: Heart, text: "Hyperlocal targeting — your city, your services" },
      ],
      cta: "Book a Service",
      ctaAction: () => onGetStarted?.(),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f8faff 0%, #eef2ff 60%, #f0fdf4 100%)",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
        />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e40af" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section header ── */}
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold rounded-full mb-4">
            <Play className="w-3 h-3 fill-blue-600" />
            How Customers Discover VisvasaHome
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
            Three ways to{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
            >
              find us
            </span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you search, scroll, or hear from a neighbour — VisvasaHome is always one tap away from expert help at home.
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className={`grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-14 transition-all duration-700 delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          {[
            { value: `${bookingsCount.toLocaleString()}+`, label: "Bookings Completed", color: "text-blue-600" },
            { value: `${citiesCount}+`, label: "Cities Covered", color: "text-emerald-600" },
            { value: `${prosCount.toLocaleString()}+`, label: "Verified Pros", color: "text-violet-600" },
          ].map((stat, i) => (
            <div key={i} className="text-center bg-white/80 backdrop-blur-sm rounded-2xl py-4 px-2 border border-white shadow-sm">
              <div className={`text-2xl font-black ${stat.color} mb-0.5`}>{stat.value}</div>
              <div className="text-[11px] text-gray-500 font-semibold leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Channel cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {channels.map((ch, i) => {
            const Icon = ch.icon;
            return (
              <div
                key={ch.id}
                className={`group relative bg-white rounded-3xl border ${ch.borderAccent} shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${200 + i * 120}ms` }}
              >
                {/* Gradient top accent */}
                <div className={`h-1 w-full bg-gradient-to-r ${ch.gradientFrom} ${ch.gradientTo}`} />

                {/* Card header */}
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${ch.bgLight} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${ch.textAccent}`} />
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${ch.textAccent} block`}>
                        Discovery Channel
                      </span>
                      <span className="text-sm font-black text-gray-900">{ch.label}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
                    {ch.headline}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{ch.sub}</p>
                </div>

                {/* Visual */}
                <div className={`mx-4 mb-4 rounded-2xl ${ch.bgLight} py-5 px-3 flex items-center justify-center min-h-[220px]`}>
                  {ch.visual}
                </div>

                {/* Features */}
                <div className="px-6 pb-4 space-y-2 flex-1">
                  {ch.features.map((feat, j) => {
                    const FIcon = feat.icon;
                    return (
                      <div key={j} className="flex items-start gap-2.5">
                        <div className={`mt-0.5 w-5 h-5 rounded-lg ${ch.bgLight} flex items-center justify-center shrink-0`}>
                          <FIcon className={`w-3 h-3 ${ch.textAccent}`} />
                        </div>
                        <span className="text-[12px] text-gray-600 font-medium leading-relaxed">{feat.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <button
                    onClick={ch.ctaAction}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${ch.gradientFrom} ${ch.gradientTo} hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200`}
                  >
                    {ch.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  style={{ background: `radial-gradient(ellipse at top, ${ch.color === 'blue' ? 'rgba(59,130,246,0.04)' : ch.color === 'emerald' ? 'rgba(16,185,129,0.04)' : 'rgba(139,92,246,0.04)'} 0%, transparent 70%)` }}
                />
              </div>
            );
          })}
        </div>

        {/* ── App download banner ── */}
        <div
          className={`mt-12 rounded-3xl overflow-hidden relative transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e1b4b 100%)" }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 px-8 py-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-3">
                <Smartphone className="w-3.5 h-3.5 text-blue-300" />
                <span className="text-xs font-bold text-blue-200">Mobile App — Coming Soon</span>
              </div>
              <h3 className="text-2xl font-black text-white mb-1">
                VisvasaHome on your phone
              </h3>
              <p className="text-blue-200/80 text-sm max-w-md">
                Book, track, and manage all your home services in one place. Be the first to know when we launch on Android & iOS.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* QR placeholder */}
              <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <QrCode className="w-12 h-12 text-gray-900" />
              </div>
              {/* Store buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onGetStarted?.()}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg"
                >
                  <span className="text-lg">🍎</span>
                  <div className="text-left">
                    <div className="text-[9px] text-gray-500 font-medium">Download on the</div>
                    <div className="text-sm font-black leading-tight">App Store</div>
                  </div>
                </button>
                <button
                  onClick={() => onGetStarted?.()}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-colors"
                >
                  <span className="text-lg">▶️</span>
                  <div className="text-left">
                    <div className="text-[9px] text-blue-300 font-medium">Get it on</div>
                    <div className="text-sm font-black leading-tight">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-blue-700/20 pointer-events-none" />
          <div className="absolute -right-8 -bottom-12 w-32 h-32 rounded-full bg-indigo-700/20 pointer-events-none" />
          <div className="absolute left-1/3 top-0 w-px h-full bg-white/5 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
