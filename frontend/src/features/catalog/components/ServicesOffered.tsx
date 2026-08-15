import { useState } from 'react';
import {
  Wrench,
  Sparkles,
  Refrigerator,
  PaintBucket,
  Sofa,
  BrickWall,
  Hammer,
  ShieldCheck,
  Droplet,
  HardHat,
  Droplets,
  Zap,
  Wind,
  Drill,
  Frame,
  Paintbrush2,
  Star,
  Percent,
  TrendingUp,
  LayoutGrid,
  Home,
  Building2,
  Building,
  Hospital,
  GraduationCap,
  Hotel,
  TreePine,
  ArrowRight,
  Scissors,
  Heart,
  Baby,
  PartyPopper,
  Bug,
} from 'lucide-react';

interface ServicesOfferedProps {
  onServiceClick?: (serviceSlug?: string) => void;
}

type PillarTab = 'all' | 'maintenance' | 'construction' | 'design' | 'specialty' | 'amc';

interface ServiceCard {
  name: string;
  icon: any;
  slug: string;
  pillar: 'maintenance' | 'construction' | 'design' | 'specialty' | 'amc';
  badge?: string;
  color: string;
}

export function ServicesOffered({ onServiceClick }: ServicesOfferedProps) {
  const [activeTab, setActiveTab] = useState<PillarTab>('all');

  // ── 1. Home Maintenance & Repair ──
  const maintenanceServices: ServiceCard[] = [
    { name: "General Handyman", icon: Wrench, slug: "general-repair", pillar: "maintenance", color: "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-500 hover:text-white" },
    { name: "Appliances", icon: Refrigerator, slug: "appliance-repair", pillar: "maintenance", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Pest Control", icon: HardHat, slug: "pest-control", pillar: "maintenance", color: "bg-blue-50 text-blue-650 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Home Cleaning", icon: Sparkles, slug: "cleaning-services", pillar: "maintenance", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
  ];

  // ── 2. Construction & Trades ──
  const constructionServices: ServiceCard[] = [
    { name: "Plumbing", icon: Droplets, slug: "plumbing-services", pillar: "construction", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Electrical", icon: Zap, slug: "electrical-services", pillar: "construction", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "AC & HVAC", icon: Wind, slug: "ac-services", pillar: "construction", badge: "Seasonal", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Wall Painting", icon: PaintBucket, slug: "painting-services", pillar: "construction", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Carpentry & Wood", icon: Hammer, slug: "carpentry-services", pillar: "construction", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Masonry & Tiling", icon: BrickWall, slug: "masonry-services", pillar: "construction", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Excavation", icon: Drill, slug: "excavation-services", pillar: "construction", color: "bg-stone-50 text-stone-600 border-stone-100 hover:bg-stone-500 hover:text-white" },
    { name: "Roofing", icon: Home, slug: "roofing-services", pillar: "construction", color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-500 hover:text-white" },
  ];

  // ── 3. Design & Finishing ──
  const designServices: ServiceCard[] = [
    { name: "Interior Design", icon: Sofa, slug: "interior-design", pillar: "design", badge: "Premium", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Landscaping", icon: TreePine, slug: "landscaping-services", pillar: "design", color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Flooring", icon: Frame, slug: "flooring-services", pillar: "design", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
  ];

  // ── 4. Specialty & Personal Care ──
  const specialtyServices: ServiceCard[] = [
    { name: "At-Home Salon", icon: Scissors, slug: "beauty-services", pillar: "specialty", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Wellness & Fitness", icon: Heart, slug: "wellness-services", pillar: "specialty", color: "bg-blue-50 text-blue-500 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Care & Support", icon: Baby, slug: "care-services", pillar: "specialty", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Event Setup", icon: PartyPopper, slug: "event-services", pillar: "specialty", color: "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-500 hover:text-white" },
  ];

  // ── 5. AMC Plans ──
  const amcServices: ServiceCard[] = [
    { name: "Home AMC", icon: Home, slug: "amc-home", pillar: "amc", badge: "Most Popular", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Office AMC", icon: Building2, slug: "amc-office", pillar: "amc", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Commercial AMC", icon: Building, slug: "amc-commercial", pillar: "amc", color: "bg-blue-50 text-blue-650 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Industrial AMC", icon: Drill, slug: "amc-industrial", pillar: "amc", color: "bg-stone-50 text-stone-600 border-stone-100 hover:bg-stone-500 hover:text-white" },
    { name: "Healthcare AMC", icon: Hospital, slug: "amc-healthcare", pillar: "amc", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Educational AMC", icon: GraduationCap, slug: "amc-educational", pillar: "amc", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Hospitality AMC", icon: Hotel, slug: "amc-hospitality", pillar: "amc", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
    { name: "Society AMC", icon: TreePine, slug: "amc-society", pillar: "amc", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-500 hover:text-white" },
  ];

  const allServices = [...maintenanceServices, ...constructionServices, ...designServices, ...specialtyServices, ...amcServices];

  const getFiltered = () => {
    if (activeTab === 'all') return allServices;
    if (activeTab === 'maintenance') return maintenanceServices;
    if (activeTab === 'construction') return constructionServices;
    if (activeTab === 'design') return designServices;
    if (activeTab === 'specialty') return specialtyServices;
    if (activeTab === 'amc') return amcServices;
    return allServices;
  };

  const filteredServices = getFiltered();

  // Trending Deals — enriched with gradient, chips, urgency
  const trendingDeals = [
    {
      id: "deal-1",
      title: "AC Split Servicing",
      subtitle: "Deep clean + gas top-up included",
      price: 349, originalPrice: 599,
      rating: 4.8, reviews: "82k",
      icon: Wind, slug: "ac-services",
      badge: "50% OFF", badgeColor: "bg-blue-500 text-white",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
      chips: ["Split AC", "Window AC", "90-day warranty"],
      urgency: "1,240 booked today",
      pillar: "home",
    },
    {
      id: "deal-2",
      title: "Bathroom Deep Cleaning",
      subtitle: "Eco-friendly agents, scrub & sanitise",
      price: 499, originalPrice: 799,
      rating: 4.9, reviews: "124k",
      icon: Sparkles, slug: "cleaning-services",
      badge: "Best Seller", badgeColor: "bg-blue-500 text-white",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
      chips: ["2 bathrooms", "Scrubbing included", "7-day guarantee"],
      urgency: "2,800 booked today",
      pillar: "home",
    },
    {
      id: "deal-3",
      title: "Drain Unclogging",
      subtitle: "Jet-wash + pipe inspection",
      price: 249, originalPrice: 399,
      rating: 4.7, reviews: "45k",
      icon: Droplets, slug: "plumbing-services",
      badge: "Quick Fix", badgeColor: "bg-blue-500 text-white",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
      chips: ["Same-day", "Kitchen & bathroom", "Warranty"],
      urgency: "680 booked today",
      pillar: "home",
    },
    {
      id: "deal-4",
      title: "Sofa Shampoo Cleaning",
      subtitle: "Steam clean + stain removal",
      price: 699, originalPrice: 1099,
      rating: 4.8, reviews: "38k",
      icon: Sofa, slug: "cleaning-services",
      badge: "36% OFF", badgeColor: "bg-blue-500 text-white",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
      chips: ["3-seater", "Stain removal", "Dries in 2hrs"],
      urgency: "440 booked today",
      pillar: "home",
    },
    {
      id: "deal-5",
      title: "Electrical Socket Fix",
      subtitle: "Switch / socket replacement & safety check",
      price: 129, originalPrice: 199,
      rating: 4.7, reviews: "60k",
      icon: Zap, slug: "electrical-services",
      badge: "Express", badgeColor: "bg-blue-500 text-white",
      gradient: "from-blue-500 to-blue-500",
      iconBg: "bg-white/20",
      chips: ["30-min arrival", "Licensed electrician", "Safe"],
      urgency: "910 booked today",
      pillar: "home",
    },
    {
      id: "deal-6",
      title: "Full Home Pest Control",
      subtitle: "Eco-friendly gel + spray treatment",
      price: 799, originalPrice: 1199,
      rating: 4.8, reviews: "32k",
      icon: Bug, slug: "pest-control",
      badge: "Safe & Eco", badgeColor: "bg-blue-500 text-white",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
      chips: ["2BHK", "Gel + Spray", "90-day warranty"],
      urgency: "320 booked today",
      pillar: "maintenance",
    },
    {
      id: "deal-7",
      title: "Deep Cleaning (2BHK)",
      subtitle: "Full house deep sanitisation & dust removal",
      price: 2499, originalPrice: 3499,
      rating: 4.9, reviews: "15k",
      icon: Sparkles, slug: "cleaning-services",
      badge: "Premium Clean", badgeColor: "bg-blue-500 text-white",
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-white/20",
      chips: ["2BHK", "Deep sanitation", "7-day guarantee"],
      urgency: "150 booked today",
      pillar: "maintenance",
    },
  ];

  const tabConfig = [
    { id: 'all' as PillarTab, label: `All Services (${allServices.length})`, icon: LayoutGrid, color: '' },
    { id: 'maintenance' as PillarTab, label: `🛠️ Home Maintenance`, icon: Wrench, color: '' },
    { id: 'construction' as PillarTab, label: `🏗️ Construction & Trades`, icon: BrickWall, color: '' },
    { id: 'design' as PillarTab, label: `📐 Design & Finishing`, icon: Sofa, color: '' },
    { id: 'specialty' as PillarTab, label: `🌸 Specialty & Salon`, icon: Scissors, color: '' },
  ];

  return (
    <section id="services" className="py-16 bg-white border-b border-gray-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
              Complete Service Catalogue
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Maintenance · Trades · Design & Finishing · Personal Care · AMC Plans
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4 text-xs font-bold text-gray-500">
            <div className="flex items-center gap-1"><Star className="w-4 h-4 text-[#2563EB] fill-[#2563EB]" /> 4.8 ★ Platform Average</div>
            <div className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-blue-500" /> On-Time Guarantee</div>
          </div>
        </div>

        {/* 5-Pillar Tab Selector */}
        <div className="flex overflow-x-auto gap-2 mb-8 bg-gray-50 p-1.5 rounded-2xl w-fit border border-gray-200/60 max-w-full">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/10'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pillar section label */}
        {activeTab !== 'all' && (
          <div className="mb-4 flex items-center gap-2">
            <span className={`text-xs font-black px-3 py-1 rounded-full ${
              activeTab === 'maintenance' ? 'bg-blue-100 text-blue-700' :
              activeTab === 'construction' ? 'bg-blue-100 text-[#2563EB]' :
              activeTab === 'design' ? 'bg-blue-100 text-blue-700' :
              activeTab === 'specialty' ? 'bg-blue-100 text-blue-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {activeTab === 'maintenance' ? '🛠️ Home Maintenance & Repair — On-Demand Work' :
               activeTab === 'construction' ? '🏗️ Construction & Trades — Licensed Contractors' :
               activeTab === 'design' ? '📐 Design & Finishing — Interior, Landscape & Flooring' :
               activeTab === 'specialty' ? '🌸 Specialty & Personal Care — Salon, Wellness, Care & Events' :
               '🛡️ AMC Plans — Annual Maintenance Contracts'}
            </span>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mb-14">
          {filteredServices.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={`${cat.pillar}-${cat.name}`}
                onClick={() => onServiceClick?.(cat.slug)}
                className="group flex flex-col items-center bg-white border border-gray-150 rounded-2xl p-4 shadow-premium shadow-premium-hover hover:border-[#2563EB]/30 active:scale-95 text-left relative overflow-hidden"
              >
                {/* Category Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 border ${cat.color} group-hover:scale-105`}>
                  <Icon className="w-5 h-5 transition-transform group-hover:rotate-6" />
                </div>

                {/* Category Name */}
                <span className="text-xs font-extrabold text-gray-800 text-center leading-tight group-hover:text-[#2563EB] transition-colors">
                  {cat.name}
                </span>

                {/* Pillar badge for 'all' view */}
                {activeTab === 'all' && (
                  <span className={`mt-1.5 text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${
                    cat.pillar === 'maintenance' ? 'bg-blue-50 text-blue-600' :
                    cat.pillar === 'construction' ? 'bg-blue-50 text-blue-600' :
                    cat.pillar === 'design' ? 'bg-blue-50 text-blue-600' :
                    cat.pillar === 'specialty' ? 'bg-blue-50 text-blue-600' :
                    'bg-blue-50 text-blue-500'
                  }`}>
                    {cat.pillar === 'maintenance' ? 'Repair' :
                     cat.pillar === 'construction' ? 'Trade' :
                     cat.pillar === 'design' ? 'Design' :
                     cat.pillar === 'specialty' ? 'Specialty' :
                     'AMC'}
                  </span>
                )}

                {/* Optional Status Badge */}
                {cat.badge && (
                  <span className="absolute top-1 right-1 text-[7px] font-black uppercase bg-blue-100 text-[#2563EB] border border-[#2563EB]/20 px-1.5 py-0.5 rounded-md">
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Trending Deals — Premium Redesign ── */}
        <div className="border-t border-gray-100 pt-12">

          {/* Header row */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-500">
                  <TrendingUp className="w-3.5 h-3.5" /> Live Trending
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              </div>
              <h3 className="text-2xl font-black text-gray-950 leading-tight">
                Best Deals Right Now
              </h3>
              <p className="text-xs text-gray-400 mt-1">Lowest prices · Most booked · Verified professionals</p>
            </div>
            <button
              onClick={() => onServiceClick?.('get-started-customer')}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-blue-600 transition-colors border border-blue-200 hover:border-blue-400 px-3 py-2 rounded-xl"
            >
              View All Offers <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cards scroll row */}
          <div className="flex overflow-x-auto gap-4 pb-5 -mx-4 px-4 scrollbar-hide">
            {trendingDeals.map((service) => {
              const Icon = service.icon;
              const discount = Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100);
              return (
                <div
                  key={service.id}
                  className="flex-shrink-0 w-[240px] rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col bg-white group cursor-pointer"
                  onClick={() => onServiceClick?.(service.slug)}
                >
                  {/* Gradient hero banner */}
                  <div className={`bg-gradient-to-br ${service.gradient} p-4 relative overflow-hidden`}>
                    {/* Decorative ring */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
                    <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />

                    {/* Top row: icon + badge */}
                    <div className="relative flex items-start justify-between">
                      <div className={`w-10 h-10 rounded-xl ${service.iconBg} backdrop-blur-sm flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${service.badgeColor}`}>
                        {service.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="relative mt-3">
                      <p className="text-white font-black text-sm leading-snug">{service.title}</p>
                      <p className="text-white/70 text-[10px] mt-0.5 leading-snug">{service.subtitle}</p>
                    </div>

                    {/* Discount pill */}
                    <div className="relative mt-3 flex items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Percent className="w-2.5 h-2.5" /> {discount}% OFF
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4 flex flex-col gap-3 flex-1">

                    {/* Rating row */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className={`w-3 h-3 ${ i <= Math.floor(service.rating) ? 'text-blue-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-gray-700">{service.rating}</span>
                      <span className="text-[9px] text-gray-400">({service.reviews})</span>
                    </div>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-1">
                      {service.chips.map((chip) => (
                        <span key={chip} className="text-[9px] font-bold bg-gray-50 border border-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* Urgency */}
                    <div className="flex items-center gap-1 text-[9px] text-blue-600 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      {service.urgency}
                    </div>

                    {/* Price + CTA */}
                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wide">Starting at</span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-base font-black text-gray-900">₹{service.price.toLocaleString()}</span>
                          <span className="text-[10px] text-gray-400 line-through">₹{service.originalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onServiceClick?.(service.slug); }}
                        className={`px-4 py-1.5 bg-gradient-to-r ${service.gradient} text-white text-[10px] font-black rounded-xl shadow-sm hover:opacity-90 transition-opacity active:scale-95`}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile view-all */}
          <div className="sm:hidden mt-4">
            <button
              onClick={() => onServiceClick?.('get-started-customer')}
              className="w-full py-3 border border-blue-200 text-[#2563EB] font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              View All Deals <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}