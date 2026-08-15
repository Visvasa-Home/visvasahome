import {
  Wind, Refrigerator, WashingMachine, Tv, ChevronRight,
  Sparkles, Bug, Droplets, Zap, Hammer, Scissors,
  PaintBucket, Waves, Layers, TrendingUp, Search,
  Star, Clock, Wrench, Home, Dumbbell, Baby,
  Flame, ShowerHead, Coffee, Sofa, LayoutGrid,
  Laptop, Airplay, Stethoscope, Store, ShieldCheck,
  TreePine, HardHat, Package, CalendarDays, RotateCcw,
  UserCheck, ArrowRight, Leaf, BrickWall
} from 'lucide-react';

interface HomeCategoriesProps {
  onCategoryClick?: (slug: string) => void;
}

// ── Section 1: AC, Appliance & Repair ──
const acApplianceServices = [
  { name: 'AC Service\n& Repair', icon: Wind, slug: 'ac-services', color: 'bg-blue-100 text-blue-700', desc: '₹349 onwards' },
  { name: 'Water Purifier\nServices & Repair', icon: Droplets, slug: 'plumbing-services', color: 'bg-blue-100 text-blue-700', desc: '₹499 onwards' },
  { name: 'Air Cooler\nServices & Repair', icon: Airplay, slug: 'appliance-repair', color: 'bg-blue-100 text-blue-700', desc: '₹299 onwards' },
  { name: 'Refrigerator\nRepair & Consult', icon: Refrigerator, slug: 'appliance-repair', color: 'bg-blue-100 text-blue-700', desc: '₹399 onwards' },
  { name: 'Washing Machine\nRepair', icon: WashingMachine, slug: 'appliance-repair', color: 'bg-blue-100 text-blue-700', desc: '₹299 onwards' },
  { name: 'TV & Display\nRepair', icon: Tv, slug: 'appliance-repair', color: 'bg-blue-100 text-blue-700', desc: '₹499 onwards' },
  { name: 'Geyser / Water\nHeater Repair', icon: Flame, slug: 'appliance-repair', color: 'bg-blue-100 text-blue-700', desc: '₹249 onwards' },
  { name: 'Microwave\nRepair', icon: Coffee, slug: 'appliance-repair', color: 'bg-blue-100 text-blue-700', desc: '₹299 onwards' },
];

// ── Section 2: Cleaning & Pest Control ──
const cleaningServices = [
  { name: 'Full Home\nDeep Cleaning', icon: Sparkles, slug: 'cleaning-services', color: 'bg-blue-100 text-blue-700', desc: '₹1,899 onwards' },
  { name: 'Carpet & Sofa\nCleaning', icon: Sofa, slug: 'cleaning-services', color: 'bg-blue-100 text-blue-700', desc: '₹199 / seat' },
  { name: 'Ants & Bed Bugs\nControl', icon: Bug, slug: 'pest-control', color: 'bg-blue-100 text-blue-700', desc: '₹699 onwards' },
  { name: 'Bathroom &\nKitchen Cleaning', icon: ShowerHead, slug: 'cleaning-services', color: 'bg-blue-100 text-blue-700', desc: '₹599 onwards' },
  { name: 'Bathroom\nCleaning', icon: ShowerHead, slug: 'cleaning-services', color: 'bg-blue-100 text-blue-700', desc: '₹349 onwards' },
  { name: 'By Room\nCleaning', icon: Home, slug: 'cleaning-services', color: 'bg-blue-100 text-blue-700', desc: '₹499 onwards' },
  { name: 'Cockroach\nControl', icon: Bug, slug: 'pest-control', color: 'bg-blue-100 text-blue-700', desc: '₹699 onwards' },
  { name: 'Termite\nControl', icon: Bug, slug: 'pest-control', color: 'bg-blue-100 text-blue-700', desc: '₹1,499 onwards' },
];

// ── Section 3: Men's Salon & Massage ──
const salonMassageServices = [
  { name: "Men's\nHaircut", icon: Scissors, slug: 'beauty-services', color: 'bg-slate-100 text-slate-700', desc: '₹199 onwards' },
  { name: 'Beard Trim\n& Shaping', icon: Scissors, slug: 'beauty-services', color: 'bg-gray-100 text-gray-700', desc: '₹149 onwards' },
  { name: 'Full Body\nMassage', icon: Dumbbell, slug: 'wellness-services', color: 'bg-blue-100 text-blue-700', desc: '₹699 onwards' },
  { name: "Women's\nSalon at Home", icon: Scissors, slug: 'beauty-services', color: 'bg-blue-100 text-blue-700', desc: '₹249 onwards' },
  { name: 'Facial\n& Cleanup', icon: Baby, slug: 'beauty-services', color: 'bg-blue-100 text-blue-700', desc: '₹399 onwards' },
  { name: 'Yoga &\nFitness', icon: Dumbbell, slug: 'wellness-services', color: 'bg-blue-100 text-blue-700', desc: '₹499 / session' },
];

// ── Section 4: Electricians, Plumbers, Carpenters, Builders, Gardner, Painter ──
const tradesServices = [
  { name: 'Electrician\n& Wiring', icon: Zap, slug: 'electrical-services', color: 'bg-blue-100 text-blue-700', desc: '₹99 onwards' },
  { name: 'Plumbing\nRepairs', icon: Droplets, slug: 'plumbing-services', color: 'bg-blue-100 text-blue-700', desc: '₹149 onwards' },
  { name: 'Carpenter /\nFurniture Repair', icon: Hammer, slug: 'carpentry-services', color: 'bg-blue-100 text-blue-700', desc: '₹149 onwards' },
  { name: 'Furniture\nAssembly', icon: Package, slug: 'carpentry-services', color: 'bg-blue-100 text-blue-700', desc: '₹249 onwards' },
  { name: 'General\nRepair', icon: Wrench, slug: 'general-repair', color: 'bg-slate-100 text-slate-700', desc: '₹199 onwards' },
  { name: 'CCTV &\nSecurity', icon: ShieldCheck, slug: 'electrical-services', color: 'bg-blue-100 text-blue-700', desc: '₹599 onwards' },
  { name: 'Gardening &\nLandscaping', icon: Leaf, slug: 'landscaping-services', color: 'bg-blue-100 text-blue-700', desc: '₹499 onwards' },
  { name: 'Painter\n(Professional)', icon: PaintBucket, slug: 'painting-services', color: 'bg-blue-100 text-blue-700', desc: '₹8,000 onwards' },
  { name: 'Builder /\nContractor', icon: HardHat, slug: 'construction-services', color: 'bg-stone-100 text-stone-700', desc: 'Get Quote' },
  { name: 'Water Purifier\nRO Service', icon: Droplets, slug: 'plumbing-services', color: 'bg-blue-100 text-blue-700', desc: '₹499 onwards' },
];

// ── Section 5: Painting, Waterproofing & Wallpanels ──
const paintingServices = [
  { name: 'Rooms / Walls\nPainting', icon: PaintBucket, slug: 'painting-services', color: 'bg-blue-100 text-blue-700', desc: '₹2,499 onwards' },
  { name: 'Wall Panels\nInstallation', icon: Layers, slug: 'general-repair', color: 'bg-blue-100 text-blue-700', desc: '₹1,999 onwards' },
  { name: 'Wall Makeover\nby Revamp', icon: Layers, slug: 'painting-services', color: 'bg-blue-100 text-blue-700', desc: '₹3,499 onwards' },
  { name: 'Full Home\nPainting', icon: PaintBucket, slug: 'painting-services', color: 'bg-blue-100 text-blue-700', desc: '₹8,000 onwards' },
  { name: 'Waterproofing\n& Seepage Fix', icon: Waves, slug: 'painting-services', color: 'bg-blue-100 text-blue-700', desc: '₹3,499 onwards' },
  { name: 'Texture &\nWall Design', icon: Layers, slug: 'painting-services', color: 'bg-blue-100 text-blue-700', desc: '₹2,499 onwards' },
  { name: 'Exterior\nPainting', icon: PaintBucket, slug: 'painting-services', color: 'bg-blue-100 text-blue-700', desc: '₹12,000 onwards' },
  { name: 'Wood Polish\n& Varnish', icon: Hammer, slug: 'carpentry-services', color: 'bg-blue-100 text-blue-700', desc: '₹799 onwards' },
];

// ── Trending Categories ──
const trendingCategories = [
  { name: 'Laptop Repair', icon: Laptop, slug: 'appliance-repair', bookings: '680 booked today', tag: '💻 Tech', color: 'from-slate-600 to-slate-800' },
  { name: 'Refrigerator Repair', icon: Refrigerator, slug: 'appliance-repair', bookings: '520 booked today', tag: '❄️ Cool', color: 'from-blue-500 to-blue-600' },
  { name: 'Air Purifier Service', icon: Wind, slug: 'appliance-repair', bookings: '310 booked today', tag: '🌿 Air', color: 'from-blue-500 to-blue-600' },
  { name: 'Store Service & Repair', icon: Store, slug: 'appliance-repair', bookings: '210 booked today', tag: '🏪 Store', color: 'from-blue-500 to-blue-600' },
  { name: 'Television Repair', icon: Tv, slug: 'appliance-repair', bookings: '740 booked today', tag: '📺 TV', color: 'from-blue-500 to-blue-600' },
  { name: 'Doctor Consultation', icon: Stethoscope, slug: 'wellness-services', bookings: '1,200 booked today', tag: '🩺 Health', color: 'from-blue-500 to-blue-600' },
  { name: 'AC Service', icon: Wind, slug: 'ac-services', bookings: '1,240 booked today', tag: '🔥 Hot', color: 'from-blue-500 to-blue-600' },
  { name: 'Deep Cleaning', icon: Sparkles, slug: 'cleaning-services', bookings: '2,800 booked today', tag: '⭐ Best Seller', color: 'from-blue-500 to-blue-600' },
  { name: 'Salon at Home', icon: Scissors, slug: 'beauty-services', bookings: '1,890 booked today', tag: '💅 Trending', color: 'from-blue-500 to-blue-600' },
  { name: 'Electrician', icon: Zap, slug: 'electrical-services', bookings: '910 booked today', tag: '⚡ Express', color: 'from-blue-500 to-blue-600' },
  { name: 'Painting', icon: PaintBucket, slug: 'painting-services', bookings: '480 booked today', tag: '🎨 Popular', color: 'from-blue-500 to-blue-600' },
  { name: 'Pest Control', icon: Bug, slug: 'pest-control', bookings: '320 booked today', tag: '✅ Safe', color: 'from-blue-500 to-blue-600' },
];

// ── Most Frequently Searched ──
const frequentSearches = [
  { term: 'Washing Machine Repair', slug: 'appliance-repair', icon: WashingMachine, searches: '62k+ searches' },
  { term: 'Kitchen Cleaning', slug: 'cleaning-services', icon: Flame, searches: '55k+ searches' },
  { term: 'Renovation', slug: 'construction-services', icon: BrickWall, searches: '48k+ searches' },
  { term: 'Cleaning Services', slug: 'cleaning-services', icon: Sparkles, searches: '78k+ searches' },
  { term: 'Electrical Work', slug: 'electrical-services', icon: Zap, searches: '55k+ searches' },
  { term: 'Plumbing', slug: 'plumbing-services', icon: Droplets, searches: '43k+ searches' },
  { term: 'Painting', slug: 'painting-services', icon: PaintBucket, searches: '41k+ searches' },
  { term: 'Gardening', slug: 'landscaping-services', icon: Leaf, searches: '28k+ searches' },
  { term: 'AMC Plans', slug: 'amc-packages', icon: ShieldCheck, searches: '35k+ searches' },
  { term: 'Security Solutions', slug: 'electrical-services', icon: ShieldCheck, searches: '24k+ searches' },
  { term: 'Carpenter Services', slug: 'carpentry-services', icon: Hammer, searches: '38k+ searches' },
  { term: 'Pest Control', slug: 'pest-control', icon: Bug, searches: '33k+ searches' },
  { term: 'Weekly Bathroom Cleaning', slug: 'cleaning-services', icon: ShowerHead, searches: '27k+ searches' },
  { term: 'Termite Control', slug: 'pest-control', icon: Bug, searches: '22k+ searches' },
  { term: 'Microwave Repair', slug: 'appliance-repair', icon: Coffee, searches: '19k+ searches' },
  { term: 'Chimney Repair', slug: 'appliance-repair', icon: Flame, searches: '17k+ searches' },
  { term: 'Geyser Services & Repair', slug: 'appliance-repair', icon: Flame, searches: '25k+ searches' },
  { term: 'Cockroach Control', slug: 'pest-control', icon: Bug, searches: '30k+ searches' },
];

// ── Recently Booked ──
const recentlyBooked = [
  { name: 'Electricians', icon: Zap, slug: 'electrical-services', sub: 'Switch, fan & wiring repairs', color: 'bg-blue-100 text-blue-700' },
  { name: 'Talk to Expert', icon: Stethoscope, slug: 'wellness-services', sub: 'Get advice before booking', color: 'bg-blue-100 text-blue-700' },
];

// ── AMC Plans ──
const amcPlans = [
  { label: 'One Time', icon: CalendarDays, slug: 'amc-packages', desc: 'Book once, pay once', color: 'from-blue-500 to-blue-600', badge: null },
  { label: 'Weekly', icon: RotateCcw, slug: 'amc-packages', desc: 'Every week at your home', color: 'from-blue-500 to-blue-600', badge: 'Save 15%' },
  { label: 'Monthly', icon: CalendarDays, slug: 'amc-packages', desc: 'Best for regular upkeep', color: 'from-blue-500 to-blue-600', badge: 'Save 25%' },
  { label: 'Yearly', icon: ShieldCheck, slug: 'amc-packages', desc: 'Full year peace of mind', color: 'from-blue-500 to-blue-600', badge: 'Best Value' },
];

// ── Reusable Section Component ──
function ExploreSection({
  title, emoji, accentColor, services, onCategoryClick, slug,
}: {
  title: string; emoji: string; accentColor: string;
  services: { name: string; icon: any; slug: string; color: string; desc: string }[];
  onCategoryClick?: (slug: string) => void; slug: string;
}) {
  const cols = services.length <= 6 ? 'grid-cols-3 sm:grid-cols-6' : 'grid-cols-3 sm:grid-cols-5 lg:grid-cols-8';
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl flex-shrink-0">{emoji}</span>
          <h2 className="text-sm sm:text-base font-black text-gray-900 leading-tight truncate">{title}</h2>
        </div>
        <button
          onClick={() => onCategoryClick?.(slug)}
          className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all flex-shrink-0 ${accentColor} hover:opacity-90 whitespace-nowrap`}
        >
          All <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <div className={`grid ${cols} gap-2`}>
        {services.map((svc, i) => {
          const Icon = svc.icon;
          return (
            <button
              key={`${svc.slug}-${i}`}
              onClick={() => onCategoryClick?.(svc.slug)}
              className="group flex flex-col items-center text-center p-2 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 active:scale-95"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-1.5 transition-all duration-300 ${svc.color} group-hover:scale-105 group-hover:shadow-md`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-gray-800 leading-tight group-hover:text-[#2563EB] transition-colors whitespace-pre-line">
                {svc.name}
              </span>
              <span className="text-[8px] text-gray-400 mt-0.5 font-semibold">{svc.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function HomeCategories({ onCategoryClick }: HomeCategoriesProps) {
  return (
    <section id="tour-services-grid" className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── 5 Explore Sections ── */}
        <ExploreSection
          title="AC, Appliance & Repair"
          emoji="❄️"
          accentColor="border-blue-200 text-blue-700 bg-blue-50"
          services={acApplianceServices}
          onCategoryClick={onCategoryClick}
          slug="ac-services"
        />
        <ExploreSection
          title="Cleaning, Pest Control"
          emoji="✨"
          accentColor="border-blue-200 text-blue-700 bg-blue-50"
          services={cleaningServices}
          onCategoryClick={onCategoryClick}
          slug="cleaning-services"
        />
        <ExploreSection
          title="Men's Salon & Massage"
          emoji="💈"
          accentColor="border-blue-200 text-blue-700 bg-blue-50"
          services={salonMassageServices}
          onCategoryClick={onCategoryClick}
          slug="beauty-services"
        />
        <ExploreSection
          title="Electricians, Plumbers, Carpenters, Builders, Gardener & Painter"
          emoji="🔧"
          accentColor="border-blue-200 text-blue-700 bg-blue-50"
          services={tradesServices}
          onCategoryClick={onCategoryClick}
          slug="electrical-services"
        />
        <ExploreSection
          title="Painting, Waterproofing & Wallpanels"
          emoji="🎨"
          accentColor="border-blue-200 text-blue-700 bg-blue-50"
          services={paintingServices}
          onCategoryClick={onCategoryClick}
          slug="painting-services"
        />

        {/* ── Recently Booked ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
            <h2 className="text-base font-black text-gray-900">Recently Booked</h2>
            <span className="hidden sm:inline text-[9px] font-bold text-gray-400 ml-1">Quick re-book in 1 tap</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentlyBooked.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => onCategoryClick?.(item.slug)}
                  className="group flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2563EB]/30 transition-all text-left active:scale-[0.99]"
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color} group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold text-gray-900 group-hover:text-[#2563EB] transition-colors">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-snug">{item.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#2563EB] ml-auto flex-shrink-0 transition-colors" />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── AMC Plans ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
              <div className="min-w-0">
                <h2 className="text-sm sm:text-base font-black text-gray-900">AMC Book</h2>
                <p className="hidden sm:block text-[10px] text-gray-400 font-semibold">Annual Maintenance Contracts — choose your plan</p>
              </div>
            </div>
            <button
              onClick={() => onCategoryClick?.('amc-packages')}
              className="flex items-center gap-1 text-xs font-bold text-[#2563EB] border border-blue-200 bg-blue-50 px-2.5 py-1.5 rounded-xl hover:bg-blue-100 transition-colors flex-shrink-0 whitespace-nowrap"
            >
              Plans <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {amcPlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <button
                  key={plan.label}
                  onClick={() => onCategoryClick?.(plan.slug)}
                  className="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  <div className={`bg-gradient-to-br ${plan.color} p-4 text-white text-left`}>
                    {plan.badge && (
                      <span className="absolute top-2 right-2 text-[8px] font-black bg-white/25 text-white px-1.5 py-0.5 rounded-md">
                        {plan.badge}
                      </span>
                    )}
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-2.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-black text-sm">{plan.label}</p>
                    <p className="text-[10px] text-white/75 mt-0.5 leading-tight">{plan.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Construction Contractor CTA ── */}
        <div className="mb-10">
          <button
            onClick={() => onCategoryClick?.('construction-services')}
            className="group w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 text-left"
          >
            <div className="bg-gradient-to-r from-stone-700 to-stone-900 p-4 sm:p-5 text-white flex items-center gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <HardHat className="w-5.5 h-5.5 sm:w-7 sm:h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                  <span className="text-[8px] sm:text-[9px] font-black bg-blue-500 text-white px-1.5 sm:px-2 py-0.5 rounded-md uppercase tracking-wide">New</span>
                  <span className="text-[8px] sm:text-[9px] font-bold text-white/60 uppercase tracking-wider">Construction</span>
                </div>
                <h3 className="font-black text-sm sm:text-base leading-tight">Construction Contractor</h3>
                <p className="text-[10px] sm:text-[11px] text-white/70 mt-0.5 leading-snug">Full home renovation · Masonry · Tiling · Building work. Get free quotes from verified contractors.</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/15 rounded-xl flex items-center justify-center group-hover:bg-white/25 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* ── Trending Categories ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-base font-black text-gray-900">Trending Categories</h2>
              <p className="hidden sm:block text-[10px] text-gray-400 font-semibold mt-0.5">Most booked right now across your city</p>
            </div>
            <span className="flex-shrink-0 flex items-center gap-1 text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping inline-block" />
              Live
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {trendingCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => onCategoryClick?.(cat.slug)}
                  className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 text-left"
                >
                  <div className={`bg-gradient-to-br ${cat.color} p-3.5 text-white`}>
                    <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-2.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-black text-xs leading-tight">{cat.name}</p>
                    <p className="text-[8px] text-white/65 mt-0.5">{cat.bookings}</p>
                  </div>
                  <div className="absolute top-1.5 right-1.5 text-[8px] font-black bg-black/20 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md">
                    {cat.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Most Frequently Searched ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900">Most Frequently Searched</h2>
              <p className="hidden sm:block text-[10px] text-gray-400 font-semibold mt-0.5">What customers search most in your city</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {frequentSearches.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.term}
                  onClick={() => onCategoryClick?.(item.slug)}
                  className="group flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2563EB]/30 transition-all duration-200 text-left active:scale-[0.99]"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-gray-800 group-hover:text-[#2563EB] transition-colors truncate">{item.term}</p>
                    <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{item.searches}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-1">
                    <span className="text-[9px] text-gray-300 font-bold">#{i + 1}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#2563EB] transition-colors" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Trust footer row */}
          <div className="mt-6 flex flex-wrap justify-center gap-5 pt-4 border-t border-gray-100">
            {[
              { icon: Star, label: '4.8★ Platform Rating', sub: 'Avg across 2L+ reviews' },
              { icon: Clock, label: 'On-Time Guarantee', sub: 'Or we reschedule free' },
              { icon: LayoutGrid, label: '250+ Services', sub: 'In 8+ categories' },
              { icon: UserCheck, label: '2,000+ Verified Pros', sub: 'Background-checked' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs text-gray-600">
                <s.icon className="w-4 h-4 text-[#2563EB]" />
                <div>
                  <span className="font-extrabold text-gray-800">{s.label}</span>
                  <span className="block text-[9px] text-gray-400 font-semibold">{s.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
