import {
  Building2, Shield, Clock, FileCheck, HeadphonesIcon,
  Zap, Wind, Droplet, Wrench,
} from "lucide-react";
import { AMCPageTemplate, AMCPlan, ServiceCategory, AMCBenefit, AMCFAQ, HeroStat, AMCAccentTheme } from "@amc/components/AMCPageTemplate";

const officeAccent: AMCAccentTheme = {
  from: "#0f172a",
  to: "#1e3a5f",
  light: "#f0f4f8",
  text: "#1e3a5f",
  border: "#cbd5e1",
  badge: "#e2e8f0",
  badgeText: "#334155",
  ring: "ring-slate-600",
};

interface AMCOfficeProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function AMCOffice({ onBack, onBookNow }: AMCOfficeProps) {
  const heroStats: HeroStat[] = [
    { value: "3,500+", label: "Offices Maintained" },
    { value: "4.8/5", label: "Client Satisfaction" },
    { value: "20+", label: "Cities Covered" },
    { value: "4hr", label: "Priority Response" },
  ];

  const plans: AMCPlan[] = [
    {
      name: "Essential",
      price: "₹12,999",
      monthlyEquiv: "₹1,083",
      period: "/ year",
      description: "Core maintenance for small offices",
      bestFor: "Up to 20-seat offices",
      features: [
        "Quarterly electrical inspection",
        "AC servicing — 2 units, twice a year",
        "Plumbing checkup — quarterly",
        "Minor repairs included",
        "8 AM – 6 PM support",
        "48-hour response time",
        "Digital maintenance log",
      ],
      notIncluded: ["Deep cleaning", "Painting", "24/7 emergency support"],
      popular: false,
      badge: "Starter",
    },
    {
      name: "Professional",
      price: "₹24,999",
      monthlyEquiv: "₹2,083",
      period: "/ year",
      description: "Complete coverage for growing businesses",
      bestFor: "20–100 seat offices",
      features: [
        "Monthly electrical inspection",
        "AC servicing — up to 5 units, quarterly",
        "Plumbing & sanitary maintenance",
        "Carpentry & furniture repairs",
        "Painting touch-ups — once a year",
        "Priority response — within 24 hrs",
        "Dedicated service manager",
        "Quarterly service reports",
        "Digital maintenance dashboard",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      price: "Custom",
      monthlyEquiv: undefined,
      period: "tailored pricing",
      description: "Comprehensive facility management",
      bestFor: "Large offices & corporate campuses",
      features: [
        "Full facility assessment",
        "Unlimited AC servicing",
        "24/7 emergency support",
        "Preventive maintenance schedule",
        "All electrical & plumbing work",
        "Annual deep cleaning included",
        "Quarterly compliance reporting",
        "Dedicated on-site technician option",
        "SLA-backed service guarantees",
      ],
      popular: false,
      badge: "Enterprise",
    },
  ];

  const servicesIncluded: ServiceCategory[] = [
    {
      icon: Zap,
      title: "Electrical Systems",
      items: ["Wiring inspection", "Switch & socket repair", "Light fixture maintenance", "Circuit breaker checkup"],
    },
    {
      icon: Wind,
      title: "Air Conditioning",
      items: ["Filter cleaning & replacement", "Gas charging & leak check", "Compressor maintenance", "Duct cleaning"],
    },
    {
      icon: Droplet,
      title: "Plumbing & Sanitary",
      items: ["Pipe inspection & leak detection", "Tap & fixture repair", "Drainage maintenance", "Water tank cleaning"],
    },
    {
      icon: Wrench,
      title: "General Repairs",
      items: ["Door & window repair", "Furniture & fixture fixing", "Wall & ceiling maintenance", "False ceiling work"],
    },
  ];

  const benefits: AMCBenefit[] = [
    {
      icon: Shield,
      title: "Peace of Mind",
      description: "Focus on your business while we handle all maintenance with scheduled inspections.",
      stat: "Zero",
    },
    {
      icon: Clock,
      title: "Time Savings",
      description: "One call resolves all facility maintenance needs. No contractor hunting.",
      stat: "15hr+",
    },
    {
      icon: FileCheck,
      title: "Cost Predictability",
      description: "Fixed annual pricing eliminates surprise expenses. Budget accurately with upfront costs.",
      stat: "25%",
    },
    {
      icon: HeadphonesIcon,
      title: "Priority Support",
      description: "Dedicated service managers ensure faster response times and consistent quality.",
      stat: "24/7",
    },
  ];

  const faqs: AMCFAQ[] = [
    {
      question: "What does the Office AMC cover?",
      answer: "Coverage is defined by your plan. All plans include scheduled electrical, plumbing, AC, and general repair services. Higher plans add painting, deep cleaning, and 24/7 emergency support. A detailed scope document is provided before signing.",
    },
    {
      question: "Can I get a customized plan for my office size?",
      answer: "Yes. Our Enterprise plan is fully customizable. Share your office area, number of floors, AC units, and specific requirements and we'll propose a tailored scope and pricing.",
    },
    {
      question: "How quickly can you respond to an emergency?",
      answer: "Essential plan: up to 48 hours. Professional plan: within 24 hours. Enterprise plan: custom SLA, typically 2–4 hours. Emergency after-hours service is available for higher plans.",
    },
    {
      question: "Are spare parts and materials included?",
      answer: "Minor consumables are included. Significant components (compressors, fixtures, wiring) are quoted separately at transparent rates before work proceeds.",
    },
    {
      question: "Will maintenance visits disrupt office operations?",
      answer: "We schedule visits at times that minimize disruption — early morning, lunch hours, or weekends — as per your preference.",
    },
    {
      question: "Do you provide compliance documentation?",
      answer: "Yes. All plans include digital service logs. The Enterprise plan includes quarterly compliance reports suitable for audits and regulatory submissions.",
    },
  ];

  return (
    <AMCPageTemplate
      onBack={onBack}
      onBookNow={onBookNow}
      pageIcon={Building2}
      badge="Office Maintenance Solutions"
      title="Annual Maintenance Contracts for Offices"
      subtitle="Structured facility maintenance backed by verified professionals. Keep your office running smoothly with scheduled inspections, priority service, and predictable costs."
      heroStats={heroStats}
      plans={plans}
      servicesIncluded={servicesIncluded}
      benefits={benefits}
      faqs={faqs}
      ctaTitle="Ready to Streamline Office Maintenance?"
      ctaSubtitle="Get a customized quote based on your office size and specific requirements. No obligation."
      primaryCta="Request a Quote"
      footerNote="All services performed by verified professionals. Contracts include detailed service schedules and accountability measures. Terms apply."
      accent={officeAccent}
      category="office"
    />
  );
}
