import { Menu, X, Phone, Mail, ChevronDown, Home, Building2, Store, Factory, Activity, GraduationCap, UtensilsCrossed, Building, Sparkles, Scissors, Droplets, Zap, Refrigerator, PaintBucket, Heart, Baby, Sofa, PartyPopper, HardHat, Wrench, Hammer, Wind, Drill, Trees, Frame, BrickWall, Info, BookOpen, MessageSquare, User, Users, LogIn, TrendingUp, ShoppingBag, Shield, Car, Stethoscope, Truck, Tv, Key, Bath, Brush, Camera, Droplet, Search, Bug } from "lucide-react";
import { useState, useEffect } from "react";
import { LocationSelector } from "@shared/components/LocationSelector";
import logoImg from "../../imports/logo.png";
import { CartManager } from "@booking/services/cartManager";
import { CartDrawer } from "@booking/components/CartDrawer";
import { StickyCartBar } from "@booking/components/StickyCartBar";

interface HeaderProps {
  onRegisterContractor: () => void;
  onBookService: () => void;
  selectedLocation: string | null;
  onLocationSelect: (location: string) => void;
  onAMCOffice?: () => void;
  onAMCHome?: () => void;
  onAMCCommercial?: () => void;
  onAMCIndustrial?: () => void;
  onAMCHealthcare?: () => void;
  onAMCEducational?: () => void;
  onAMCHospitality?: () => void;
  onAMCSociety?: () => void;
  onHome?: () => void;
  onNavigate?: (page: string, data?: any) => void;
  isAuthenticated?: boolean;
  onLogin?: () => void;
  onProfile?: () => void;
  onAdminLogin?: () => void;
  onCartOpen?: () => void;
  hideBarOnMobile?: boolean;
}

export function Header({
  onRegisterContractor,
  onBookService,
  selectedLocation,
  onLocationSelect,
  onAMCOffice,
  onAMCHome,
  onAMCCommercial,
  onAMCIndustrial,
  onAMCHealthcare,
  onAMCEducational,
  onAMCHospitality,
  onAMCSociety,
  onHome,
  onNavigate,
  isAuthenticated = false,
  onLogin,
  onProfile,
  onAdminLogin,
  onCartOpen,
  hideBarOnMobile = false,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Live cart count — updates whenever any page adds/removes from cart
  useEffect(() => {
    const refresh = () => {
      try {
        const stored = localStorage.getItem('visvasahome_cart');
        if (!stored) { setCartCount(0); return; }
        const parsed = JSON.parse(stored);
        const count = (parsed.items || []).reduce((s: number, i: any) => s + (i.quantity ?? 1), 0);
        setCartCount(count);
      } catch { setCartCount(0); }
    };
    refresh();
    window.addEventListener('visvasahome_cart_updated', refresh as any);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('visvasahome_cart_updated', refresh as any);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // ── 1. Home Repair & Maintenance ──
  const repairServices = [
    { name: "Electrician", icon: Zap, onClick: () => onNavigate?.("electrical-services") },
    { name: "Plumber", icon: Droplets, onClick: () => onNavigate?.("plumbing-services") },
    { name: "Carpenter", icon: Hammer, onClick: () => onNavigate?.("carpentry-services") },
    { name: "AC Repair & Service", icon: Wind, onClick: () => onNavigate?.("ac-services") },
    { name: "RO / Water Purifier", icon: Droplet, onClick: () => onNavigate?.("plumbing-services") },
    { name: "Washing Machine Repair", icon: Refrigerator, onClick: () => onNavigate?.("appliance-repair") },
    { name: "Refrigerator Repair", icon: Refrigerator, onClick: () => onNavigate?.("appliance-repair") },
    { name: "TV & Appliance Repair", icon: Tv, onClick: () => onNavigate?.("appliance-repair") },
    { name: "Geyser Repair", icon: Zap, onClick: () => onNavigate?.("appliance-repair") },
    { name: "CCTV Installation", icon: Camera, onClick: () => onNavigate?.("home-security") },
    { name: "Inverter & Battery", icon: Zap, onClick: () => onNavigate?.("electrical-services") },
    { name: "Door Lock / Locksmith", icon: Key, onClick: () => onNavigate?.("general-repair") },
  ];

  // ── 2. Painting & Waterproofing ──
  const paintingServices = [
    { name: "Full Home Painting", icon: PaintBucket, onClick: () => onNavigate?.("painting-services") },
    { name: "Interior Painting", icon: Brush, onClick: () => onNavigate?.("painting-services") },
    { name: "Exterior Painting", icon: PaintBucket, onClick: () => onNavigate?.("painting-services") },
    { name: "Waterproofing", icon: Shield, onClick: () => onNavigate?.("painting-services") },
    { name: "POP / False Ceiling", icon: HardHat, onClick: () => onNavigate?.("general-repair") },
    { name: "Tile & Marble Repair", icon: BrickWall, onClick: () => onNavigate?.("masonry-services") },
  ];

  // ── 3. Cleaning & Home Care ──
  const cleaningAndCareServices = [
    { name: "Full Home Cleaning", icon: Sparkles, onClick: () => onNavigate?.("cleaning-services") },
    { name: "Bathroom Cleaning", icon: Bath, onClick: () => onNavigate?.("cleaning-services") },
    { name: "Kitchen Cleaning", icon: Sparkles, onClick: () => onNavigate?.("cleaning-services") },
    { name: "Sofa & Carpet Cleaning", icon: Sofa, onClick: () => onNavigate?.("cleaning-services") },
    { name: "Mattress Cleaning", icon: Sparkles, onClick: () => onNavigate?.("cleaning-services") },
    { name: "Water Tank Cleaning", icon: Droplet, onClick: () => onNavigate?.("cleaning-services") },
    { name: "Chimney Cleaning", icon: Brush, onClick: () => onNavigate?.("cleaning-services") },
    { name: "Pest Control", icon: Bug, onClick: () => onNavigate?.("pest-control") },
    { name: "AC Deep Cleaning", icon: Wind, onClick: () => onNavigate?.("ac-services") },
    { name: "Move-In / Move-Out Cleaning", icon: Sparkles, onClick: () => onNavigate?.("cleaning-services") },
  ];

  // ── 4. Salon, Beauty & Wellness ──
  const beautyAndWellnessServices = [
    { name: "Women's Salon at Home", icon: Scissors, onClick: () => onNavigate?.("beauty-services") },
    { name: "Men's Grooming at Home", icon: Scissors, onClick: () => onNavigate?.("wellness-services") },
    { name: "Haircut & Hair Styling", icon: Scissors, onClick: () => onNavigate?.("beauty-services") },
    { name: "Makeup Artist", icon: Sparkles, onClick: () => onNavigate?.("beauty-services") },
    { name: "Mehndi / Henna", icon: Sparkles, onClick: () => onNavigate?.("beauty-services") },
    { name: "Nail Care", icon: Sparkles, onClick: () => onNavigate?.("beauty-services") },
    { name: "Facial & Skin Care", icon: Heart, onClick: () => onNavigate?.("beauty-services") },
    { name: "Body Massage", icon: Activity, onClick: () => onNavigate?.("wellness-services") },
    { name: "Waxing & Threading", icon: Scissors, onClick: () => onNavigate?.("beauty-services") },
    { name: "Bridal Package", icon: Sparkles, onClick: () => onNavigate?.("beauty-services") },
  ];

  // ── 5. Doctor & Home Healthcare ──
  const homeHealthcareServices = [
    { name: "General Physician Home Visit", icon: Stethoscope, onClick: () => onNavigate?.("care-services") },
    { name: "Child Specialist Home Visit", icon: Baby, onClick: () => onNavigate?.("care-services") },
    { name: "Gynecologist Home Visit", icon: Heart, onClick: () => onNavigate?.("care-services") },
    { name: "Orthopedic Home Visit", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Dermatologist Home Visit", icon: Sparkles, onClick: () => onNavigate?.("care-services") },
    { name: "Dentist Home Visit", icon: Stethoscope, onClick: () => onNavigate?.("care-services") },
    { name: "ENT Specialist Visit", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Eye Specialist Visit", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Cardiologist Visit", icon: Heart, onClick: () => onNavigate?.("care-services") },
    { name: "Neurologist Visit", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Mental Health Consultation", icon: Heart, onClick: () => onNavigate?.("care-services") },
    { name: "Diabetologist Visit", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Pulmonologist Visit", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Geriatrician (Elderly Care)", icon: Heart, onClick: () => onNavigate?.("care-services") },
    { name: "Nurse Home Visit", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Physiotherapy at Home", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Elderly Care", icon: Heart, onClick: () => onNavigate?.("care-services") },
    { name: "Patient Attendant", icon: Heart, onClick: () => onNavigate?.("care-services") },
    { name: "Post-Hospital Care", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Medical Equipment Rental", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Diagnostic Sample Collection", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Vital Monitoring", icon: Activity, onClick: () => onNavigate?.("care-services") },
    { name: "Lab Tests & Diagnostics", icon: Activity, onClick: () => onNavigate?.("care-services") },
  ];

  // ── 6. Personal & Family Services ──
  const familyServices = [
    { name: "Babysitting", icon: Baby, onClick: () => onNavigate?.("care-services") },
    { name: "Home Tutor", icon: GraduationCap, onClick: () => onNavigate?.("education-services") },
    { name: "Special-Needs Support", icon: Heart, onClick: () => onNavigate?.("care-services") },
    { name: "Pet Grooming", icon: Heart, onClick: () => onNavigate?.("pet-care") },
    { name: "Pet Care", icon: Heart, onClick: () => onNavigate?.("pet-care") },
    { name: "Dog Walking", icon: Heart, onClick: () => onNavigate?.("pet-care") },
  ];

  // ── 7. Vehicle Services at Home ──
  const vehicleAtHomeServices = [
    { name: "Emergency Roadside Assistance (Car)", icon: Zap, onClick: () => onNavigate?.("car-services") },
    { name: "Car Maintenance at Home", icon: Wrench, onClick: () => onNavigate?.("car-services") },
    { name: "Car Cleaning & Detailing", icon: Car, onClick: () => onNavigate?.("car-services") },
    { name: "Car AC Services", icon: Wind, onClick: () => onNavigate?.("car-services") },
    { name: "Car Electrical Services", icon: Zap, onClick: () => onNavigate?.("car-services") },
    { name: "Emergency Roadside Assistance (Bike)", icon: Zap, onClick: () => onNavigate?.("bike-services") },
    { name: "Bike Maintenance at Home", icon: Wrench, onClick: () => onNavigate?.("bike-services") },
    { name: "Bike Washing & Detailing", icon: Car, onClick: () => onNavigate?.("bike-services") },
    { name: "Bike Electrical Services", icon: Zap, onClick: () => onNavigate?.("bike-services") },
    { name: "Highway & Towing Services", icon: Wrench, onClick: () => onNavigate?.("highway-services") },
  ];

  // ── 8. Smart Home & Tech ──
  const techServices = [
    { name: "Wi-Fi / Router Setup", icon: Tv, onClick: () => onNavigate?.("electrical-services") },
    { name: "Computer / Laptop Repair", icon: Tv, onClick: () => onNavigate?.("appliance-repair") },
    { name: "Smart TV Setup", icon: Tv, onClick: () => onNavigate?.("appliance-repair") },
    { name: "Smart Lock / Doorbell Install", icon: Key, onClick: () => onNavigate?.("home-security") },
    { name: "CCTV / Security System", icon: Camera, onClick: () => onNavigate?.("home-security") },
    { name: "Home Automation", icon: Key, onClick: () => onNavigate?.("home-security") },
    { name: "Mobile Repair Pickup", icon: Drill, onClick: () => onNavigate?.("appliance-repair") },
  ];

  // ── 9. Contractor / Construction (Separate Pro Services) ──
  const contractorServices = [
    { name: "Civil & Masonry Work", icon: BrickWall, onClick: () => onNavigate?.("masonry-services") },
    { name: "Tiling & Flooring", icon: Frame, onClick: () => onNavigate?.("flooring-services") },
    { name: "Roofing & Waterproofing", icon: HardHat, onClick: () => onNavigate?.("roofing-services") },
    { name: "Interior Design", icon: Drill, onClick: () => onNavigate?.("interior-design") },
    { name: "Modular Kitchen", icon: UtensilsCrossed, onClick: () => onNavigate?.("interior-design") },
    { name: "False Ceiling / POP", icon: HardHat, onClick: () => onNavigate?.("general-repair") },
    { name: "Home Construction", icon: HardHat, onClick: () => onNavigate?.("construction-services") },
    { name: "Landscaping & Garden", icon: Trees, onClick: () => onNavigate?.("landscaping-services") },
    { name: "Excavation & Foundation", icon: Drill, onClick: () => onNavigate?.("excavation-services") },
    { name: "Packers & Movers", icon: Truck, onClick: () => onNavigate?.("movers-packers") },
  ];

  // ── AMC Plans ──
  const amcOptions = [
    { name: "Home AMC", icon: Home, onClick: onAMCHome },
    { name: "Office AMC", icon: Building2, onClick: onAMCOffice },
    { name: "Commercial AMC", icon: Store, onClick: onAMCCommercial },
    { name: "Industrial AMC", icon: Factory, onClick: onAMCIndustrial },
    { name: "Healthcare AMC", icon: Activity, onClick: onAMCHealthcare },
    { name: "Educational AMC", icon: GraduationCap, onClick: onAMCEducational },
    { name: "Hospitality AMC", icon: UtensilsCrossed, onClick: onAMCHospitality },
    { name: "Society AMC", icon: Building, onClick: onAMCSociety },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div style={{ backgroundColor: "#2563EB" }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center gap-6">
              <a
                href="mailto:contact@visvasahome.com"
                className="flex items-center gap-2 hover:text-blue-100 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">contact@visvasahome.com</span>
              </a>
              <a
                href="tel:+919057567160"
                className="flex items-center gap-2 hover:text-blue-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">+91 905 7567 160</span>
              </a>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/919057567160"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 bg-[#2563EB] hover:bg-blue-700 rounded-md transition-all text-xs font-semibold"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
              <a
                href="tel:+919057567160"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-white text-[#2563EB] hover:bg-blue-50 rounded-md transition-all text-xs font-semibold"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`bg-white/95 backdrop-blur-md border-b border-gray-150 sticky top-0 z-50 shadow-xs ${hideBarOnMobile ? 'hidden lg:block' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={onHome} className="hover:opacity-85 transition-opacity focus:outline-none flex-shrink-0">
              <img src={logoImg} alt="VisvasaHome" className="h-10 w-auto" style={{ maxWidth: "180px" }} />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* ── MEGA MENU: Services Dropdown ── */}
              <div className="relative group">
                <button id="tour-amc-menu" className="text-gray-700 hover:text-[#2563EB] transition-colors flex items-center gap-1 text-sm font-semibold">
                  Services
                  <ChevronDown className="w-4 h-4" />
                </button>
                {/* Mega-menu panel */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[860px] bg-white border border-gray-100 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-50 overflow-hidden">
                  <div className="grid grid-cols-4 divide-x divide-gray-100">

                    {/* Col 1: Home Repair & Painting */}
                    <div className="p-4">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">🔧 Home Repair</p>
                      {repairServices.map((s) => (
                        <button key={s.name} onClick={s.onClick} className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-[13px] group/item">
                          <s.icon className="w-3.5 h-3.5 shrink-0 text-blue-500 group-hover/item:text-blue-700" />
                          {s.name}
                        </button>
                      ))}
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3 mb-2">🎨 Painting & Finishing</p>
                      {paintingServices.map((s) => (
                        <button key={s.name} onClick={s.onClick} className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-[13px] group/item">
                          <s.icon className="w-3.5 h-3.5 shrink-0 text-blue-500 group-hover/item:text-blue-700" />
                          {s.name}
                        </button>
                      ))}
                    </div>

                    {/* Col 2: Cleaning & Healthcare */}
                    <div className="p-4">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">🧹 Cleaning & Home Care</p>
                      {cleaningAndCareServices.map((s) => (
                        <button key={s.name} onClick={s.onClick} className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-[13px] group/item">
                          <s.icon className="w-3.5 h-3.5 shrink-0 text-blue-500 group-hover/item:text-blue-700" />
                          {s.name}
                        </button>
                      ))}
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3 mb-2">🩺 Doctor & Home Healthcare</p>
                      {homeHealthcareServices.map((s) => (
                        <button key={s.name} onClick={s.onClick} className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-[13px] group/item">
                          <s.icon className="w-3.5 h-3.5 shrink-0 text-blue-500 group-hover/item:text-blue-700" />
                          {s.name}
                        </button>
                      ))}
                    </div>

                    {/* Col 3: Beauty, Family & Vehicle */}
                    <div className="p-4">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">💇 Salon, Beauty & Wellness</p>
                      {beautyAndWellnessServices.map((s) => (
                        <button key={s.name} onClick={s.onClick} className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-[13px] group/item">
                          <s.icon className="w-3.5 h-3.5 shrink-0 text-blue-500 group-hover/item:text-blue-700" />
                          {s.name}
                        </button>
                      ))}
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3 mb-2">👨‍👩‍👧 Family & Pet Care</p>
                      {familyServices.map((s) => (
                        <button key={s.name} onClick={s.onClick} className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-[13px] group/item">
                          <s.icon className="w-3.5 h-3.5 shrink-0 text-blue-500 group-hover/item:text-blue-700" />
                          {s.name}
                        </button>
                      ))}
                    </div>

                    {/* Col 4: Vehicle, Tech & Contractor */}
                    <div className="p-4">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">🚗 Vehicle Services</p>
                      {vehicleAtHomeServices.map((s) => (
                        <button key={s.name} onClick={s.onClick} className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-[13px] group/item">
                          <s.icon className="w-3.5 h-3.5 shrink-0 text-blue-500 group-hover/item:text-blue-700" />
                          {s.name}
                        </button>
                      ))}
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-3 mb-2">📡 Smart Home & Tech</p>
                      {techServices.map((s) => (
                        <button key={s.name} onClick={s.onClick} className="flex items-center gap-2 w-full px-2 py-1.5 text-left text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors text-[13px] group/item">
                          <s.icon className="w-3.5 h-3.5 shrink-0 text-blue-500 group-hover/item:text-blue-700" />
                          {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer: Contractor + AMC */}
                  <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-3 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">🏗️ Contractor & Construction Services</p>
                      <div className="flex flex-wrap gap-1">
                        {contractorServices.map((s) => (
                          <button key={s.name} onClick={s.onClick} className="text-[11px] font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-full border border-gray-200 hover:border-blue-200 transition-all">
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">📋 Annual Maintenance Plans (AMC)</p>
                      <div className="flex flex-wrap gap-1">
                        {amcOptions.map((s) => (
                          <button key={s.name} onClick={s.onClick} className="text-[11px] font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 px-2.5 py-1 rounded-full border border-gray-200 hover:border-blue-200 transition-all">
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <LocationSelector selectedLocation={selectedLocation} onLocationSelect={onLocationSelect} />



              {/* ── Live Cart Badge (Swiggy-style) ── */}
              <button
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2.5 hover:bg-blue-50 text-[#2563EB] rounded-xl transition-all flex items-center justify-center border border-blue-100 bg-blue-50/50 group"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span
                    key={cartCount}
                    className="absolute -top-1.5 -right-1.5 bg-[#2563EB] text-white text-[9px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center border-2 border-white shadow-md px-0.5 animate-bounce"
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              <div id="tour-user-menu" className="flex items-center">
                {isAuthenticated ? (
                  <button
                    onClick={onProfile}
                    className="p-2.5 hover:bg-blue-50 text-[#2563EB] rounded-xl transition-all flex items-center justify-center border border-blue-100 bg-blue-50/50"
                    title="Profile"
                  >
                    <User className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={onLogin}
                    className="p-2.5 hover:bg-blue-50 text-[#2563EB] rounded-xl transition-all flex items-center justify-center border border-blue-100 bg-blue-50/50"
                    title="Login"
                  >
                    <LogIn className="w-5 h-5" />
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Cart / Bookings Indicator */}
            {(() => {
              try {
                const cartCount = CartManager.getCart().items.length;
                return (
                  <button
                    onClick={() => setCartDrawerOpen(true)}
                    className="lg:hidden relative p-2 text-[#2563EB] bg-blue-50/60 border border-blue-100 rounded-xl mr-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                );
              } catch (e) { }
              return null;
            })()}

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-100 max-h-[70vh] overflow-y-auto">
              <nav className="flex flex-col gap-2">
                <div>
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="flex items-center justify-between w-full text-gray-700 hover:text-[#2563EB] py-2.5 text-sm font-medium"
                  >
                    <span>Services</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  {mobileServicesOpen && (
                    <div className="mt-1 pl-3 space-y-3">
                      {[
                        { label: "🔧 Home Repair & Maintenance", items: repairServices },
                        { label: "🎨 Painting & Finishing", items: paintingServices },
                        { label: "🧹 Cleaning & Home Care", items: cleaningAndCareServices },
                        { label: "🩺 Doctor & Home Healthcare", items: homeHealthcareServices },
                        { label: "💇 Salon, Beauty & Wellness", items: beautyAndWellnessServices },
                        { label: "👨‍👩‍👧 Family & Pet Care", items: familyServices },
                        { label: "🚗 Vehicle Services", items: vehicleAtHomeServices },
                        { label: "📡 Smart Home & Tech", items: techServices },
                        { label: "🏗️ Contractor & Construction", items: contractorServices },
                      ].map((group) => (
                        <div key={group.label}>
                          <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-1 mt-2">{group.label}</p>
                          {group.items.map((s) => (
                            <button
                              key={s.name}
                              onClick={() => { s.onClick(); setMobileMenuOpen(false); setMobileServicesOpen(false); }}
                              className="flex items-center gap-2 w-full text-left text-gray-600 hover:text-[#2563EB] py-1.5 text-sm"
                            >
                              <s.icon className="w-3.5 h-3.5 text-[#2563EB]" />
                              {s.name}
                            </button>
                          ))}
                        </div>
                      ))}
                      <div>
                        <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-1 mt-2">📋 AMC Plans</p>
                        {amcOptions.map((s) => (
                          <button
                            key={s.name}
                            onClick={() => { s.onClick?.(); setMobileMenuOpen(false); setMobileServicesOpen(false); }}
                            className="flex items-center gap-2 w-full text-left text-gray-600 hover:text-[#2563EB] py-1.5 text-sm"
                          >
                            <s.icon className="w-3.5 h-3.5 text-[#2563EB]" />
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {[
                  { label: "How It Works", action: () => onNavigate?.("how-it-works") },
                  { label: "About Us", action: () => onNavigate?.("about-us") },
                  { label: "Blog", action: () => onNavigate?.("blog") },
                  { label: "Contact", action: () => onNavigate?.("contact") },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { item.action(); setMobileMenuOpen(false); }}
                    className="text-left text-gray-700 hover:text-[#2563EB] py-2.5 text-sm font-medium border-t border-gray-100"
                  >
                    {item.label}
                  </button>
                ))}

                <div className="pt-2 border-t border-gray-100">
                  <LocationSelector selectedLocation={selectedLocation} onLocationSelect={onLocationSelect} />
                </div>



                {isAuthenticated ? (
                  <button
                    onClick={() => { onProfile?.(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#2563EB" }}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                ) : (
                  <button
                    onClick={() => { onLogin?.(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                    style={{ backgroundColor: "#2563EB" }}
                  >
                    <LogIn className="w-4 h-4" />
                    Login / Sign Up
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Global Swiggy-style Drawer and Sticky Bottom Cart Bar */}
      <StickyCartBar onViewCart={() => setCartDrawerOpen(true)} />
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onProceed={onBookService}
      />
    </>
  );
}
