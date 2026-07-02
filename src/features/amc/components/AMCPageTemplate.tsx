import { useState, useEffect, useRef } from "react";
import type { ElementType } from "react";
import {
  CheckCircle,
  ArrowLeft,
  Phone,
  ChevronDown,
  ChevronUp,
  X,
  Star,
  MapPin,
  BadgeCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Shield,
} from "lucide-react";
import logoImg from "@/imports/vh_logo.jpg";

export interface AMCPlan {
  name: string;
  price: string;
  monthlyEquiv?: string;
  period: string;
  description: string;
  bestFor?: string;
  features: string[];
  notIncluded?: string[];
  popular?: boolean;
  badge?: string;
}

export interface ServiceCategory {
  icon: ElementType;
  title: string;
  items: string[];
}

export interface AMCBenefit {
  icon: ElementType;
  title: string;
  description: string;
  stat?: string;
}

export interface AMCFAQ {
  question: string;
  answer: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

// Accent colour theme per segment
export interface AMCAccentTheme {
  from: string;       // gradient-from CSS value
  to: string;         // gradient-to CSS value
  light: string;      // light tint bg
  text: string;       // dark text on white
  border: string;     // border colour
  badge: string;      // badge bg
  badgeText: string;  // badge text
  ring: string;       // Tailwind ring class
}

interface AMCPageTemplateProps {
  onBack: () => void;
  onBookNow: () => void;
  pageIcon: ElementType;
  badge: string;
  title: string;
  subtitle: string;
  heroStats?: HeroStat[];
  plans: AMCPlan[];
  servicesIncluded: ServiceCategory[];
  benefits: AMCBenefit[];
  faqs: AMCFAQ[];
  processSteps?: ProcessStep[];
  ctaTitle: string;
  ctaSubtitle: string;
  primaryCta: string;
  footerNote?: string;
  accent?: AMCAccentTheme;
  category: string;
}

// Default blue accent (original)
const defaultAccent: AMCAccentTheme = {
  from: "#1D4ED8",
  to: "#1E40AF",
  light: "#eff6ff",
  text: "#1D4ED8",
  border: "#bfdbfe",
  badge: "#dbeafe",
  badgeText: "#1e40af",
  ring: "ring-blue-500",
};

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

export function AMCPageTemplate({
  onBack,
  onBookNow,
  pageIcon: PageIcon,
  badge,
  title,
  subtitle,
  heroStats,
  plans,
  servicesIncluded,
  benefits,
  faqs,
  processSteps,
  ctaTitle,
  ctaSubtitle,
  primaryCta,
  footerNote,
  accent = defaultAccent,
  category,
}: AMCPageTemplateProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { ref: plansRef, inView: plansVisible } = useInView();
  const { ref: benefitsRef, inView: benefitsVisible } = useInView();
  const { ref: servicesRef, inView: servicesVisible } = useInView();

  const defaultStats: HeroStat[] = heroStats || [
    { value: "10,000+", label: "Active Contracts" },
    { value: "4.8/5", label: "Customer Rating" },
    { value: "20+", label: "Cities Served" },
    { value: "48hr", label: "Avg. Response Time" },
  ];

  const defaultSteps: ProcessStep[] = processSteps || [
    { title: "Request Assessment", description: "Share your facility details. Our team schedules a free on-site inspection at a convenient time." },
    { title: "Get a Tailored Quote", description: "We present a clear, itemised plan with defined scope, schedules, and transparent pricing — no surprises." },
    { title: "Sign & Activate", description: "Sign the agreement and your dedicated service coordinator takes over immediately." },
    { title: "Ongoing Maintenance", description: "Scheduled visits, digital service logs, and priority support — all year long." },
  ];

  const accentGradient = `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`;

  function handlePlanCTA(plan: AMCPlan) {
    let pkgId = "";
    const planName = plan.name.toLowerCase();
    const cat = category.toLowerCase();

    // Map each category + tier/name to the real packageId
    if (cat === 'home') {
      if (planName.includes('basic')) pkgId = 'AMC-HOME-BASIC';
      else if (planName.includes('premium')) pkgId = 'AMC-HOME-PREMIUM';
      else if (planName.includes('elite') || planName.includes('complete')) pkgId = 'AMC-HOME-ELITE';
    } else if (cat === 'office') {
      if (planName.includes('essential')) pkgId = 'AMC-OFFICE-ESSENTIAL';
      else if (planName.includes('professional')) pkgId = 'AMC-OFFICE-PROFESSIONAL';
      else if (planName.includes('enterprise')) pkgId = 'AMC-OFFICE-ENTERPRISE';
    } else if (cat === 'commercial') {
      if (planName.includes('starter')) pkgId = 'AMC-COMMERCIAL-STARTER';
      else if (planName.includes('business')) pkgId = 'AMC-COMMERCIAL-BUSINESS';
      else if (planName.includes('enterprise')) pkgId = 'AMC-COMMERCIAL-ENTERPRISE';
    } else if (cat === 'industrial') {
      if (planName.includes('standard')) pkgId = 'AMC-INDUSTRIAL-STANDARD';
      else if (planName.includes('professional')) pkgId = 'AMC-INDUSTRIAL-PROFESSIONAL';
    } else if (cat === 'healthcare') {
      if (planName.includes('clinic')) pkgId = 'AMC-HEALTHCARE-CLINIC';
      else if (planName.includes('hospital')) pkgId = 'AMC-HEALTHCARE-HOSPITAL';
    } else if (cat === 'educational') {
      if (planName.includes('school')) pkgId = 'AMC-EDU-SCHOOL';
      else if (planName.includes('university')) pkgId = 'AMC-EDU-UNIVERSITY';
    } else if (cat === 'hospitality') {
      if (planName.includes('boutique')) pkgId = 'AMC-HOSPITALITY-BOUTIQUE';
      else if (planName.includes('luxury')) pkgId = 'AMC-HOSPITALITY-LUXURY';
    } else if (cat === 'society') {
      if (planName.includes('standard')) pkgId = 'AMC-SOCIETY-STANDARD';
      else if (planName.includes('premium')) pkgId = 'AMC-SOCIETY-PREMIUM';
    }

    // Fallback if not found
    if (!pkgId) {
      pkgId = 'AMC005';
    }

    window.location.hash = `#/amc-booking?packageId=${pkgId}&category=${cat}`;
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "inherit" }}>

      {/* ── Sticky Header ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md border-b border-gray-100" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <img src={logoImg} alt="VisvasaHome" className="h-8 w-auto" style={{ maxWidth: 160 }} />
            <div className="flex items-center gap-2">
              <a
                href="tel:+919057567160"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <button
                onClick={onBookNow}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: accentGradient }}
              >
                {primaryCta}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-0" style={{ background: accentGradient }}>
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10 bg-white" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.07] bg-white" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
            <defs>
              <pattern id="amcgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#amcgrid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto pb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full border border-white/25 mb-6">
              <PageIcon className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold tracking-wide">{badge}</span>
            </div>
            <h1 className="text-white font-black mb-5 leading-tight" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", lineHeight: 1.15 }}>
              {title}
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">{subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onBookNow}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
                style={{ color: accent.from }}
              >
                <Sparkles className="w-4 h-4" />
                {primaryCta}
              </button>
              <a
                href="tel:+919057567160"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/50 text-white rounded-2xl text-sm font-semibold hover:bg-white/10 transition-all"
              >
                <Phone className="w-4 h-4" />
                Speak with Expert
              </a>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative bg-white border-t border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {defaultStats.map((stat, i) => (
                <div key={i} className="py-5 text-center">
                  <div className="text-2xl font-black mb-0.5" style={{ color: accent.from }}>{stat.value}</div>
                  <div className="text-gray-500 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Strip ── */}
      <section className="py-3 border-b border-gray-100 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-gray-500 text-xs font-medium">
            {[
              { icon: BadgeCheck, label: "Background-verified professionals" },
              { icon: Star, label: "Rated 4.8/5 by 5,000+ clients" },
              { icon: MapPin, label: "Serving 20+ cities across India" },
              { icon: TrendingUp, label: "Transparent pricing, no hidden charges" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" style={{ color: accent.from }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Plans ── */}
      <section className="py-20 bg-white" ref={plansRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 transition-all duration-700 ${plansVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ background: accent.badge, color: accent.badgeText }}
            >
              Transparent Pricing
            </span>
            <h2 className="text-gray-900 font-black mb-4" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)" }}>
              Choose Your Plan
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
              Clearly defined scope, fixed annual pricing, and no surprise charges. Pick the tier that fits your facility.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan, pi) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl overflow-hidden flex flex-col transition-all duration-700 ${plansVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{
                  transitionDelay: `${pi * 100}ms`,
                  border: plan.popular ? `2px solid ${accent.from}` : "1.5px solid #e5e7eb",
                  boxShadow: plan.popular ? `0 8px 40px ${accent.from}22` : "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                {/* Popular banner */}
                {plan.popular && (
                  <div
                    className="py-2.5 text-center text-white text-xs font-black tracking-wide"
                    style={{ background: accentGradient }}
                  >
                    ★ {plan.badge || "Most Popular"}
                  </div>
                )}
                {!plan.popular && plan.badge && (
                  <div className="py-2.5 text-center text-gray-600 text-xs font-bold tracking-wide bg-gray-50 border-b border-gray-100">
                    {plan.badge}
                  </div>
                )}

                {/* Card body */}
                <div
                  className="flex-1 flex flex-col p-7"
                  style={plan.popular ? { background: accentGradient, color: "white" } : {}}
                >
                  <div className="mb-5">
                    <h3 className={`text-xl font-black mb-1 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm leading-relaxed ${plan.popular ? "text-white/75" : "text-gray-500"}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-1 flex items-end gap-2">
                    <span
                      className={`font-black leading-none ${plan.popular ? "text-white" : "text-gray-900"}`}
                      style={{ fontSize: "2.1rem" }}
                    >
                      {plan.price}
                    </span>
                    <span className={`mb-0.5 text-sm ${plan.popular ? "text-white/60" : "text-gray-400"}`}>
                      {plan.period}
                    </span>
                  </div>
                  {plan.monthlyEquiv && (
                    <p className={`text-xs mb-2 ${plan.popular ? "text-white/65" : "text-gray-400"}`}>
                      ≈ {plan.monthlyEquiv} / month
                    </p>
                  )}
                  {plan.bestFor && (
                    <div
                      className="inline-block text-xs px-2.5 py-1 rounded-full mb-5 mt-1 font-semibold"
                      style={plan.popular
                        ? { background: "rgba(255,255,255,0.15)", color: "white" }
                        : { background: accent.badge, color: accent.badgeText }}
                    >
                      Best for: {plan.bestFor}
                    </div>
                  )}

                  <div className={`border-t mb-5 ${plan.popular ? "border-white/20" : "border-gray-100"}`} />

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle
                          className="w-4 h-4 flex-shrink-0 mt-0.5"
                          style={{ color: plan.popular ? "#86efac" : "#22c55e" }}
                        />
                        <span className={`text-sm leading-relaxed ${plan.popular ? "text-white/85" : "text-gray-700"}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((f, i) => (
                      <li key={`ni-${i}`} className="flex items-start gap-2.5 opacity-40">
                        <X className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.popular ? "text-white" : "text-gray-400"}`} />
                        <span className={`text-sm line-through leading-relaxed ${plan.popular ? "text-white" : "text-gray-400"}`}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handlePlanCTA(plan)}
                    className="w-full py-3 rounded-2xl text-sm font-bold transition-all hover:scale-[1.01] active:scale-[0.99]"
                    style={plan.popular
                      ? { background: "white", color: accent.from }
                      : { background: accentGradient, color: "white" }}
                  >
                    {plan.price === "Custom" ? "Get Custom Quote" : "Get Started"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            All plans include a service agreement, digital maintenance logs, and escalation support.
          </p>
        </div>
      </section>

      {/* ── What We Cover (tabbed) ── */}
      <section className="py-20 bg-gray-50" ref={servicesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-700 ${servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ background: accent.badge, color: accent.badgeText }}
            >
              Coverage
            </span>
            <h2 className="text-gray-900 font-black mb-4" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)" }}>
              What's Covered
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
              Comprehensive maintenance across every critical system, performed by trained and verified technicians.
            </p>
          </div>

          {/* Tab pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {servicesIncluded.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    activeTab === i
                      ? "text-white border-transparent shadow-sm"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                  style={activeTab === i ? { background: accentGradient } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.title}
                </button>
              );
            })}
          </div>

          {/* Active tab panel */}
          <div className={`transition-all duration-500 ${servicesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {servicesIncluded[activeTab] && (() => {
              const Icon = servicesIncluded[activeTab].icon;
              return (
                <div
                  className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border shadow-sm"
                  style={{ borderColor: accent.border }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: accent.light }}>
                      <Icon className="w-6 h-6" style={{ color: accent.from }} />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg">{servicesIncluded[activeTab].title}</h3>
                      <p className="text-gray-400 text-sm">{servicesIncluded[activeTab].items.length} services included</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {servicesIncluded[activeTab].items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: accent.from }} />
                        <span className="text-sm text-gray-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* All categories grid (below fold) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {servicesIncluded.map((service, i) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.title}
                  onClick={() => setActiveTab(i)}
                  className={`text-left rounded-2xl p-5 border transition-all duration-200 hover:shadow-md ${
                    activeTab === i ? "shadow-md" : "bg-white border-gray-100"
                  }`}
                  style={activeTab === i ? { background: accent.light, borderColor: accent.border } : {}}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: activeTab === i ? "white" : accent.light }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: accent.from }} />
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{service.title}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {service.items.slice(0, 2).join(" · ")} & more
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 bg-white" ref={benefitsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-14 transition-all duration-700 ${benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ background: accent.badge, color: accent.badgeText }}
            >
              Why AMC?
            </span>
            <h2 className="text-gray-900 font-black mb-4" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)" }}>
              Why Choose an AMC?
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
              A structured maintenance contract prevents costly emergencies and ensures consistent quality all year.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className={`rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all duration-500 group ${benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-transform group-hover:scale-110"
                    style={{ background: accent.light }}
                  >
                    <Icon className="w-7 h-7" style={{ color: accent.from }} />
                  </div>
                  {b.stat && (
                    <div className="font-black mb-1" style={{ fontSize: "1.5rem", color: accent.from }}>
                      {b.stat}
                    </div>
                  )}
                  <h3 className="text-gray-900 font-bold mb-2 text-sm">{b.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20" style={{ background: `linear-gradient(180deg, ${accent.light} 0%, #f9fafb 100%)` }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ background: accent.badge, color: accent.badgeText }}
            >
              Process
            </span>
            <h2 className="text-gray-900 font-black mb-4" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)" }}>
              How It Works
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
              Four simple steps to reliable annual maintenance.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px" style={{ background: `linear-gradient(90deg, ${accent.from}33 0%, ${accent.from}99 50%, ${accent.from}33 100%)` }} />
            {defaultSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow relative z-10">
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white font-black text-lg mb-4"
                    style={{ background: accentGradient }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-gray-900 font-bold mb-2 text-sm">{step.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ background: accent.badge, color: accent.badgeText }}
            >
              FAQs
            </span>
            <h2 className="text-gray-900 font-black mb-4" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Clear answers about how the AMC works, what's covered, and what to expect.
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border overflow-hidden transition-all duration-200"
                style={{ borderColor: openFaq === i ? accent.border : "#e5e7eb" }}
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors gap-4"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-gray-800 text-sm font-semibold leading-relaxed">{faq.question}</span>
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={openFaq === i ? { background: accent.light } : { background: "#f3f4f6" }}
                  >
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4" style={{ color: accent.from }} />
                      : <ChevronDown className="w-4 h-4 text-gray-400" />
                    }
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: openFaq === i ? "300px" : "0px" }}
                >
                  <div className="px-5 pb-5 pt-1" style={{ background: accent.light + "55" }}>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative py-20 overflow-hidden" style={{ background: accentGradient }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/8" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-6">
            <Shield className="w-3.5 h-3.5 text-white" />
            <span className="text-white/90 text-xs font-semibold">VisvasaHome Annual Maintenance</span>
          </div>
          <h2 className="text-white font-black mb-4" style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)" }}>
            {ctaTitle}
          </h2>
          <p className="text-white/80 text-base leading-relaxed mb-10 max-w-2xl mx-auto">{ctaSubtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBookNow}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
              style={{ color: accent.from }}
            >
              <Sparkles className="w-4 h-4" />
              {primaryCta}
            </button>
            <a
              href="tel:+919057567160"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/50 text-white rounded-2xl text-sm font-semibold hover:bg-white/10 transition-all"
            >
              <Phone className="w-4 h-4" />
              +91 905 7567 160
            </a>
          </div>

          {/* Mini trust row */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/70 text-xs">
            {["Background-verified professionals", "Transparent pricing", "Digital service logs", "Escalation support"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-green-300" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chat CTA strip ── */}
      <div className="bg-gray-900 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-green-400" />
            <span className="text-white text-sm font-semibold">Have questions? Chat with us on WhatsApp — we respond within minutes.</span>
          </div>
          <a
            href="https://wa.me/919057567160?text=Hi%20VisvasaHome%2C%20I%27m%20interested%20in%20an%20AMC%20plan."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white rounded-xl text-sm font-bold transition-colors flex-shrink-0"
          >
            <span>💬</span> WhatsApp Us
          </a>
        </div>
      </div>

      {/* ── Footer Note ── */}
      <div className="bg-gray-50 py-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-xs leading-relaxed">
            {footerNote || "All services performed by background-verified professionals. Contracts include detailed service schedules and accountability measures. Terms apply."}
          </p>
        </div>
      </div>
    </div>
  );
}