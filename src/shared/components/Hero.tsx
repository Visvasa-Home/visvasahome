import { ArrowRight, Shield, Star, Clock, CheckCircle, Search, MapPin, ChevronLeft, ChevronRight, Award, Wind, Refrigerator, Sparkles, Zap, PaintBucket, Hammer, ShieldCheck, BrickWall, Droplets, HardHat, Wrench, Droplet, Home, Bug, Drill, Sofa, Trees, Frame, Heart, Baby, PartyPopper } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroProps {
  onGetStarted: () => void;
  onRegisterContractor: () => void;
  onContractorHub?: () => void;
  onCategoryClick?: (slug: string, data?: any) => void;
  selectedLocation?: string;
}

const promoBanners = [
  {
    id: 1,
    title: "AC Servicing Fest",
    desc: "Beat the heat! Professional Split AC service starts at just ₹349. 100% cooling guarantee.",
    bgColor: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
    badge: "Seasonal Deal",
    badgeColor: "bg-blue-500 text-white font-bold",
    emoji: "❄️",
    slug: "ac-services"
  },
  {
    id: 2,
    title: "Home Deep Cleaning Fest",
    desc: "Professional full house deep cleaning starting at just ₹1,199. Eco-friendly agents used.",
    bgColor: "linear-gradient(135deg, #111827 0%, #064e3b 100%)",
    badge: "Special Offer",
    badgeColor: "bg-emerald-500 text-white font-bold",
    emoji: "✨",
    slug: "cleaning-services"
  },
  {
    id: 3,
    title: "Renovation & Painting Fest",
    desc: "Interior wall painting, waterproofing & renovation services starting at just ₹1,499. Free site inspection.",
    bgColor: "linear-gradient(135deg, #1a0a00 0%, #7c2d12 100%)",
    badge: "Hot Deal",
    badgeColor: "bg-orange-500 text-white font-bold",
    emoji: "🏗️",
    slug: "painting-services"
  }
];

const trustBadges = [
  { icon: Shield, text: "Background-Verified Pros" },
  { icon: Star, text: "4.8/5 Rated Experts" },
  { icon: Clock, text: "On-time Arrival Guarantee" },
  { icon: CheckCircle, text: "Up to 90-Day Warranty" },
];

const popularSearches = [
  { term: "AC Repair", slug: "ac-services" },
  { term: "Deep Cleaning", slug: "cleaning-services" },
  { term: "Plumber", slug: "plumbing-services" },
  { term: "Electrician", slug: "electrical-services" },
  { term: "Pest Control", slug: "pest-control" },
  { term: "Home AMC", slug: "amc-packages" },
  { term: "Home Renovation", slug: "construction-services" },
  { term: "Wall Painting", slug: "painting-services" },
];

export function Hero({ onGetStarted, onRegisterContractor, onContractorHub, onCategoryClick, selectedLocation }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const location = selectedLocation || "Jaipur";
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slider every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoBanners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoBanners.length) % promoBanners.length);
  };

  // ── 1. Home Maintenance & Repair (4 icons) ──
  const maintenanceCategories = [
    { name: "General Repair", icon: Wrench, slug: "general-repair", color: "bg-slate-50 text-slate-600 hover:bg-slate-500 hover:text-white", time: "60 min" },
    { name: "Appliances", icon: Refrigerator, slug: "appliance-repair", color: "bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white", time: "45 min" },
    { name: "Pest Control", icon: Bug, slug: "pest-control", color: "bg-red-50 text-red-600 hover:bg-red-500 hover:text-white", time: "90 min" },
    { name: "Home Cleaning", icon: Sparkles, slug: "cleaning-services", color: "bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white", time: "2–3 hrs" },
  ];

  // ── 2. Construction & Trades (8 icons) ──
  const constructionCategories = [
    { name: "Plumbing", icon: Droplets, slug: "plumbing-services", color: "bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white", time: "30 min" },
    { name: "Electrical", icon: Zap, slug: "electrical-services", color: "bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white", time: "44 min" },
    { name: "AC/HVAC Service", icon: Wind, slug: "ac-services", color: "bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white", time: "44 min" },
    { name: "Wall Painting", icon: PaintBucket, slug: "painting-services", color: "bg-purple-50 text-purple-600 hover:bg-purple-500 hover:text-white" },
    { name: "Carpentry", icon: Hammer, slug: "carpentry-services", color: "bg-teal-50 text-teal-600 hover:bg-teal-500 hover:text-white" },
    { name: "Masonry", icon: BrickWall, slug: "masonry-services", color: "bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white" },
    { name: "Excavation", icon: Drill, slug: "excavation-services", color: "bg-stone-50 text-stone-600 hover:bg-stone-500 hover:text-white" },
    { name: "Roofing", icon: Home, slug: "roofing-services", color: "bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white" },
  ];

  // ── 3. Design & Finishing (3 icons) ──
  const designCategories = [
    { name: "Interior Design", icon: Sofa, slug: "interior-design", color: "bg-indigo-50 text-indigo-600 hover:bg-indigo-500 hover:text-white" },
    { name: "Landscaping", icon: Trees, slug: "landscaping-services", color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white" },
    { name: "Flooring", icon: Frame, slug: "flooring-services", color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-500 hover:text-white" },
  ];

  // ── 4. Specialty & Personal Care (4 icons) ──
  const specialtyCategories = [
    { name: "Water Purifier/Chimney", icon: Droplet, slug: "water-purifier-chimney", color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-500 hover:text-white" },
    { name: "Wellness/Fitness", icon: Heart, slug: "wellness-services", color: "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white" },
    { name: "Care & Support", icon: Baby, slug: "care-services", color: "bg-violet-50 text-violet-600 hover:bg-violet-500 hover:text-white" },
    { name: "Event Setup", icon: PartyPopper, slug: "event-services", color: "bg-amber-50 text-amber-700 hover:bg-amber-500 hover:text-white" },
  ];

  const amcShortcut = {
    name: "AMC Plans",
    icon: ShieldCheck,
    slug: "amc-packages",
    color: "bg-gradient-to-br from-indigo-600 to-indigo-800 text-white hover:from-indigo-500 hover:to-indigo-700",
    badge: "Annual Maintenance Contracts"
  };

  return (
    <section className="bg-white pt-8 pb-12 border-b border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title and Search Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
          <div className="hidden sm:block">
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              Home services, <span className="text-[#2563EB]">on demand.</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Find and book background-verified local service professionals in {location}
            </p>
          </div>

          {/* Urban Company Style Unified Search Bar Capsule */}
          <div className="mt-8 relative max-w-2xl mx-auto">
            <div className="flex items-center w-full bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 h-16 p-2">
              
              {/* Location Selector (Left) */}
              <button
                onClick={() => onCategoryClick?.('location')}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-full transition-colors flex-shrink-0 group cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-gray-800 truncate max-w-[100px] sm:max-w-[140px]">{location}</span>
                <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Vertical Divider */}
              <div className="h-7 w-[1.5px] bg-gray-200 flex-shrink-0" />

              {/* Search input field (Middle) */}
              <div className="flex-1 flex items-center min-w-0 pl-3">
                <Search className="w-4.5 h-4.5 text-gray-400 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for 'AC repair', 'Home cleaning', 'Plumber'..."
                  value={searchQuery}
                  onFocus={() => onCategoryClick?.('search')}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onCategoryClick?.('search', { query: e.target.value });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (searchQuery.trim()) onCategoryClick?.('search', { query: searchQuery });
                      else onGetStarted();
                    }
                  }}
                  className="w-full bg-transparent border-none outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
                />
              </div>

              {/* Action Button (Right) */}
              <button
                onClick={() => {
                  if (searchQuery.trim()) onCategoryClick?.('search', { query: searchQuery });
                  else onGetStarted();
                }}
                className="h-full px-7 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-full flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Popular searches */}
          <div className="mt-3.5 flex flex-wrap gap-1.5 justify-center items-center px-1">
            <span className="text-gray-400 text-[10px] font-semibold mr-0.5">Trending:</span>
            {popularSearches.map((item) => (
              <button
                key={item.term}
                onClick={() => onCategoryClick?.(item.slug)}
                className="px-2.5 py-1 text-[11px] text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 rounded-lg transition-colors font-medium border border-gray-200 hover:border-gray-300"
              >
                {item.term}
              </button>
            ))}
          </div>
        </div>

        {/* ── Categories Grid ── */}
        <div className="glass-panel shadow-premium rounded-3xl p-6 mb-10 max-w-5xl mx-auto space-y-6">

          {/* Group 1: Home Maintenance & Repair */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-white bg-blue-600 px-2.5 py-1 rounded-lg uppercase tracking-widest">🛠️ Home Maintenance & Repair</span>
              <span className="text-[10px] text-gray-400 font-semibold">Everyday home services & deep cleaning</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 max-w-4xl mx-auto">
              {maintenanceCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => onCategoryClick?.(cat.slug)}
                    className="group flex flex-col items-center focus:outline-none relative"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 shadow-premium-hover border ${cat.color} group-hover:scale-105`}>
                      <Icon className="w-6 h-6 transition-transform group-hover:rotate-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-gray-800 text-center group-hover:text-[#2563EB] transition-colors leading-tight px-0.5">
                      {cat.name}
                    </span>
                    {(cat as any).time && (
                      <span className="mt-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-full leading-none">
                        {(cat as any).time}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Group 2: Construction & Trades */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black text-white bg-[#2563EB] px-2.5 py-1 rounded-lg uppercase tracking-widest">🏗️ Construction & Trades</span>
              <span className="text-[10px] text-gray-400 font-semibold">Licensed professionals for installations and building work</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 max-w-4xl mx-auto">
              {constructionCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => onCategoryClick?.(cat.slug)}
                    className="group flex flex-col items-center focus:outline-none"
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 shadow-premium-hover border ${cat.color} group-hover:scale-105`}>
                      <Icon className="w-6 h-6 transition-transform group-hover:rotate-6" />
                    </div>
                    <span className="text-[10px] font-extrabold text-gray-800 text-center group-hover:text-[#2563EB] transition-colors leading-tight px-0.5">
                      {cat.name}
                    </span>
                    {(cat as any).time && (
                      <span className="mt-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded-full leading-none">
                        {(cat as any).time}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Row for Design & Finishing AND Specialty Care */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Group 3: Design & Finishing */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black text-white bg-emerald-600 px-2.5 py-1 rounded-lg uppercase tracking-widest">📐 Design & Finishing</span>
                <span className="text-[10px] text-gray-450 font-semibold">Interior design, landscaping & floors</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {designCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => onCategoryClick?.(cat.slug)}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 shadow-premium-hover border ${cat.color} group-hover:scale-105`}>
                        <Icon className="w-6 h-6 transition-transform group-hover:rotate-6" />
                      </div>
                      <span className="text-[10px] font-extrabold text-gray-800 text-center group-hover:text-[#2563EB] transition-colors leading-tight px-0.5">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group 4: Specialty & Personal Care */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black text-white bg-purple-600 px-2.5 py-1 rounded-lg uppercase tracking-widest">🌸 Specialty & Wellness</span>
                <span className="text-[10px] text-gray-450 font-semibold">At-home salon, wellness, care & events</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {specialtyCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => onCategoryClick?.(cat.slug)}
                      className="group flex flex-col items-center focus:outline-none"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 transition-all duration-300 shadow-premium-hover border ${cat.color} group-hover:scale-105`}>
                        <Icon className="w-6 h-6 transition-transform group-hover:rotate-6" />
                      </div>
                      <span className="text-[10px] font-extrabold text-gray-800 text-center group-hover:text-[#2563EB] transition-colors leading-tight px-0.5">
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* AMC Plans Shortcut — Full Width CTA */}
          <div>
            <button
              onClick={() => onCategoryClick?.(amcShortcut.slug)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-black text-sm text-white">Annual Maintenance Contracts (AMC)</p>
                  <p className="text-indigo-200 text-xs font-medium mt-0.5">Year-round worry-free home care — plans for 1BHK to villas</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:block text-[10px] font-bold bg-white/20 px-2.5 py-1 rounded-lg">Explore Plans</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

        </div>

        {/* Dynamic Promotional Sliders (App-like Horizontal Scroll) */}
        <div className="mb-10 w-full overflow-hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 px-2 -mx-2 max-w-5xl mx-auto">
            {promoBanners.map((banner) => {
              return (
                <div
                  key={banner.id}
                  className="flex-shrink-0 w-[85vw] sm:w-[400px] snap-center rounded-3xl overflow-hidden shadow-md flex flex-col justify-center px-6 sm:px-8 py-6 transition-transform active:scale-[0.98]"
                  style={{ background: banner.bgColor }}
                >
                  <div className="max-w-xl text-white">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded mb-2 ${banner.badgeColor}`}>
                      {banner.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
                      <span>{banner.title}</span>
                      <span>{banner.emoji}</span>
                    </h2>
                    <p className="text-xs text-white/80 leading-relaxed mb-3.5 line-clamp-2">
                      {banner.desc}
                    </p>
                    <button
                      onClick={() => onCategoryClick?.(banner.slug)}
                      className="px-4 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-black hover:bg-gray-100 transition-colors shadow"
                    >
                      Claim Offer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>



        {/* Trust Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
          {trustBadges.map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2.5 bg-white border border-gray-150 rounded-xl p-3 shadow-xs hover:shadow-sm transition-shadow">
              <div className="p-2 rounded-lg bg-blue-50/80 text-[#2563EB]">
                <badge.icon className="w-4.5 h-4.5 flex-shrink-0" />
              </div>
              <span className="text-xs text-gray-700 font-bold leading-tight">{badge.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
