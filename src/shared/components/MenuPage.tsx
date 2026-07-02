import { ArrowLeft, Home, Wrench, Zap, Droplets, Wind, Bug, Shield, ChevronRight, FileText, Users, HelpCircle, Phone, Star, Briefcase, Info, BookOpen, Lock, BrickWall, PaintBucket, Hammer, Droplet, ShieldCheck, Refrigerator, Sparkles, Scissors, Heart, Baby, PartyPopper, Trees, Drill, Sofa, Frame } from 'lucide-react';

interface MenuPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  isAuthenticated: boolean;
  onLogin: () => void;
}

// ── 1. Home Maintenance & Repair ──
const homeServices = [
  { icon: Wrench, label: 'Handyman', color: 'bg-slate-105 text-slate-600', page: 'general-repair' },
  { icon: Refrigerator, label: 'Appliances', color: 'bg-rose-100 text-rose-600', page: 'appliance-repair' },
  { icon: Bug, label: 'Pest Control', color: 'bg-red-100 text-red-650', page: 'pest-control' },
  { icon: Sparkles, label: 'Cleaning', color: 'bg-emerald-100 text-emerald-600', page: 'cleaning-services' },
];

// ── 2. Construction & Trades ──
const constructionServices = [
  { icon: Droplets, label: 'Plumbing', color: 'bg-blue-100 text-blue-600', page: 'plumbing-services' },
  { icon: Zap, label: 'Electrical', color: 'bg-yellow-100 text-yellow-600', page: 'electrical-services' },
  { icon: Wind, label: 'AC & HVAC', color: 'bg-sky-100 text-sky-600', page: 'ac-services' },
  { icon: PaintBucket, label: 'Painting', color: 'bg-purple-100 text-purple-600', page: 'painting-services' },
  { icon: Hammer, label: 'Carpentry', color: 'bg-teal-100 text-teal-650', page: 'carpentry-services' },
  { icon: BrickWall, label: 'Masonry', color: 'bg-blue-100 text-blue-600', page: 'masonry-services' },
  { icon: Drill, label: 'Excavation', color: 'bg-stone-100 text-stone-605', page: 'excavation-services' },
  { icon: Home, label: 'Roofing', color: 'bg-amber-100 text-amber-700', page: 'roofing-services' },
];

// ── 3. Design & Finishing ──
const designServices = [
  { icon: Sofa, label: 'Interior Design', color: 'bg-indigo-100 text-indigo-600', page: 'interior-design' },
  { icon: Trees, label: 'Landscaping', color: 'bg-emerald-100 text-emerald-700', page: 'landscaping-services' },
  { icon: Frame, label: 'Flooring', color: 'bg-cyan-100 text-cyan-600', page: 'flooring-services' },
];

// ── 4. Specialty & Personal Care ──
const specialtyServices = [
  { icon: Scissors, label: 'At-Home Salon', color: 'bg-pink-100 text-pink-650', page: 'beauty-services' },
  { icon: Heart, label: 'Wellness', color: 'bg-rose-100 text-rose-500', page: 'wellness-services' },
  { icon: Baby, label: 'Care & Support', color: 'bg-violet-100 text-violet-600', page: 'care-services' },
  { icon: PartyPopper, label: 'Event Setup', color: 'bg-amber-100 text-amber-700', page: 'event-services' },
];

// ── 5. AMC Plans ──
const amcPlans = [
  { label: 'Home AMC', page: 'amc-home', desc: 'Complete home care plan' },
  { label: 'Office AMC', page: 'amc-office', desc: 'Office maintenance' },
  { label: 'Commercial AMC', page: 'amc-commercial', desc: 'Retail & commercial spaces' },
  { label: 'Industrial AMC', page: 'amc-industrial', desc: 'Factory & warehouse' },
  { label: 'Healthcare AMC', page: 'amc-healthcare', desc: 'Hospital & clinic' },
  { label: 'Educational AMC', page: 'amc-educational', desc: 'Schools & colleges' },
  { label: 'Hospitality AMC', page: 'amc-hospitality', desc: 'Hotels & resorts' },
  { label: 'Society AMC', page: 'amc-society', desc: 'Residential society' },
];


// ── Quick Links ─────────────────────────────────────────────────────
const quickLinks = [
  { icon: Info, label: 'About Us', page: 'about-us' },
  { icon: BookOpen, label: 'Blog & Tips', page: 'blog' },
  { icon: Star, label: 'Testimonials', page: 'testimonials' },
  { icon: HelpCircle, label: 'How It Works', page: 'how-it-works' },
  { icon: FileText, label: 'FAQ', page: 'faq' },
  { icon: Phone, label: 'Contact Us', page: 'contact' },
  { icon: Briefcase, label: 'Careers', page: 'careers' },
  { icon: Users, label: 'Join as Professional', page: 'join-professional' },
  { icon: Lock, label: 'Privacy Policy', page: 'privacy-policy' },
  { icon: FileText, label: 'Terms of Service', page: 'terms' },
];

export function MenuPage({ onBack, onNavigate, isAuthenticated, onLogin }: MenuPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-12 pb-6 lg:pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-bold">Explore VisvasaHome</h1>
          </div>

          {!isAuthenticated && (
            <div className="bg-white/15 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Login for full access</p>
                <p className="text-blue-100 text-xs">Track bookings, save services & more</p>
              </div>
              <button
                onClick={onLogin}
                className="bg-white text-[#2563EB] text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Login
              </button>
            </div>
          )}

          {/* 3-Pillar quick access cards */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={() => onNavigate('get-started-customer')}
              className="bg-white/15 hover:bg-white/25 rounded-xl p-3 text-center transition-colors"
            >
              <span className="text-2xl block mb-1">🏠</span>
              <span className="text-white text-[10px] font-bold block">Home Services</span>
            </button>
            <button
              onClick={() => onNavigate('amc-home')}
              className="bg-white/15 hover:bg-white/25 rounded-xl p-3 text-center transition-colors"
            >
              <span className="text-2xl block mb-1">🛡️</span>
              <span className="text-white text-[10px] font-bold block">AMC Plans</span>
            </button>
            <button
              onClick={() => onNavigate('construction-services')}
              className="bg-white/15 hover:bg-white/25 rounded-xl p-3 text-center transition-colors"
            >
              <span className="text-2xl block mb-1">🏗️</span>
              <span className="text-white text-[10px] font-bold block">Construction</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-6">

        {/* ── 1. Home Maintenance & Repair ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center text-xs">🛠️</span>
              Home Maintenance & Repair
            </h2>
            <button
              onClick={() => onNavigate('get-started-customer')}
              className="text-xs text-[#2563EB] font-semibold hover:underline"
            >
              Browse All
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {homeServices.map((svc) => (
              <button
                key={svc.label}
                onClick={() => onNavigate(svc.page)}
                className="flex flex-col items-center gap-1.5 p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${svc.color}`}>
                  <svc.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] text-gray-700 font-medium text-center leading-tight">{svc.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate('get-started-customer')}
            className="w-full mt-3 py-3 bg-[#2563EB] text-white rounded-xl font-semibold text-sm hover:bg-[#1D4ED8] transition-colors"
          >
            Book a Home Service Now
          </button>
        </section>

        {/* ── 2. Construction & Trades ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center text-xs">🏗️</span>
              Construction & Trades
            </h2>
            <button
              onClick={() => onNavigate('construction-services')}
              className="text-xs text-blue-700 font-semibold hover:underline"
            >
              Post a Project
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {constructionServices.map((svc, idx) => (
              <button
                key={svc.page}
                onClick={() => onNavigate(svc.page)}
                className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-blue-50 transition-colors ${idx < constructionServices.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center ${svc.color}`}>
                    <svc.icon className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{svc.label}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
          <button
            onClick={() => onNavigate('contractor-hub')}
            className="w-full mt-3 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            🏗️ Post a Construction Project
          </button>
        </section>

        {/* ── 3. Design & Finishing ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 bg-emerald-100 rounded-md flex items-center justify-center text-xs">📐</span>
              Design & Finishing
            </h2>
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full font-bold">Aesthetics & Finish</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {designServices.map((svc, idx) => (
              <button
                key={svc.page}
                onClick={() => onNavigate(svc.page)}
                className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-emerald-50 transition-colors ${idx < designServices.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${svc.color}`}>
                    <svc.icon className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{svc.label}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* ── 4. Specialty & Personal Care ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center text-xs">🌸</span>
              Specialty & Personal Care
            </h2>
            <span className="text-xs text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full font-bold">At-Home Services</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {specialtyServices.map((svc, idx) => (
              <button
                key={svc.page}
                onClick={() => onNavigate(svc.page)}
                className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-purple-50 transition-colors ${idx < specialtyServices.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${svc.color}`}>
                    <svc.icon className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{svc.label}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* ── 5. AMC Plans ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-900 flex items-center gap-1.5">
              <span className="w-5 h-5 bg-indigo-100 rounded-md flex items-center justify-center text-xs">🛡️</span>
              AMC Plans
            </h2>
            <span className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">Annual Contracts</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {amcPlans.map((plan, idx) => (
              <button
                key={plan.page}
                onClick={() => onNavigate(plan.page)}
                className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-indigo-50 transition-colors ${idx < amcPlans.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 text-left">{plan.label}</p>
                  <p className="text-xs text-gray-500 text-left">{plan.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </section>


        {/* Quick Links */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Quick Links</h2>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {quickLinks.map((link, idx) => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors ${idx < quickLinks.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
              >
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <link.icon className="w-4 h-4 text-[#2563EB]" />
                </div>
                <span className="flex-1 text-left text-sm font-medium text-gray-800">{link.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
              </button>
            ))}
          </div>
        </section>

        {/* Brand Footer */}
        <div className="text-center py-4">
          <p className="text-[#2563EB] font-bold text-base">VisvasaHome</p>
          <p className="text-gray-500 text-xs mt-0.5">Reliable • Transparent • Local-First</p>
          <p className="text-gray-400 text-xs mt-1">www.visvasahome.com</p>
        </div>
      </div>
    </div>
  );
}
