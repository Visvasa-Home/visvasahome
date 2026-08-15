import {
  Store, Shield, Clock, FileCheck, HeadphonesIcon,
  Zap, Wind, ShoppingBag, Camera,
} from "lucide-react";
import { AMCPageTemplate, AMCPlan, ServiceCategory, AMCBenefit, AMCFAQ, HeroStat, AMCAccentTheme } from "@amc/components/AMCPageTemplate";

const commercialAccent: AMCAccentTheme = {
  from: "#b45309",
  to: "#d97706",
  light: "#fffbeb",
  text: "#b45309",
  border: "#fde68a",
  badge: "#fef3c7",
  badgeText: "#92400e",
  ring: "ring-blue-500",
};

interface AMCCommercialProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function AMCCommercial({ onBack, onBookNow }: AMCCommercialProps) {
  const heroStats: HeroStat[] = [
    { value: "2,000+", label: "Retail Spaces Maintained" },
    { value: "4.8/5", label: "Client Satisfaction" },
    { value: "20+", label: "Cities Covered" },
    { value: "Off-peak", label: "Maintenance Scheduling" },
  ];

  const plans: AMCPlan[] = [
    {
      name: "Retail Basic",
      price: "₹9,999",
      monthlyEquiv: "₹833",
      period: "/ year",
      description: "Essential maintenance for small shops",
      bestFor: "Small retail outlets & kiosks",
      features: [
        "Quarterly electrical inspection",
        "AC servicing — 2 units, quarterly",
        "Plumbing & drainage maintenance",
        "Lighting fixture repairs",
        "Minor civil work included",
        "Business hours support",
        "Digital service log",
      ],
      notIncluded: ["CCTV checkup", "Facade maintenance", "24/7 support"],
      popular: false,
      badge: "Starter",
    },
    {
      name: "Commercial Plus",
      price: "₹29,999",
      monthlyEquiv: "₹2,499",
      period: "/ year",
      description: "Complete coverage for retail spaces",
      bestFor: "Showrooms & multi-floor outlets",
      features: [
        "Monthly electrical & lighting inspection",
        "AC servicing — up to 8 units, monthly",
        "24/7 emergency support",
        "All plumbing & sanitary work",
        "Signage & facade maintenance",
        "CCTV & security system checkup",
        "Flooring & wall repairs",
        "Dedicated service coordinator",
        "Quarterly compliance reports",
      ],
      popular: true,
      badge: "Best Value",
    },
    {
      name: "Mall / Complex",
      price: "Custom",
      monthlyEquiv: undefined,
      period: "tailored pricing",
      description: "Full facility management for large properties",
      bestFor: "Malls, complexes & commercial hubs",
      features: [
        "Full facility assessment & planning",
        "Unlimited AC & HVAC servicing",
        "Central electrical system management",
        "Common area maintenance",
        "Fire safety system inspection",
        "Parking & lighting management",
        "Escalator & elevator coordination",
        "On-site technician deployment",
        "Compliance & safety reporting",
      ],
      popular: false,
      badge: "Enterprise",
    },
  ];

  const servicesIncluded: ServiceCategory[] = [
    {
      icon: Zap,
      title: "Electrical & Lighting",
      items: ["Display lighting maintenance", "Power backup systems", "Energy meter monitoring", "Emergency lighting"],
    },
    {
      icon: Wind,
      title: "HVAC Systems",
      items: ["AC & ventilation servicing", "Duct cleaning", "Temperature control", "Air quality management"],
    },
    {
      icon: ShoppingBag,
      title: "Retail Infrastructure",
      items: ["Signage & branding maintenance", "Display fixture repairs", "Facade upkeep", "Entrance & exit systems"],
    },
    {
      icon: Camera,
      title: "Security & Safety",
      items: ["CCTV system checkup", "Fire extinguisher inspection", "Emergency exit maintenance", "Access control systems"],
    },
  ];

  const benefits: AMCBenefit[] = [
    {
      icon: Shield,
      title: "Business Continuity",
      description: "Prevent downtime with scheduled maintenance. Keep your space operational and welcoming.",
      stat: "99%",
    },
    {
      icon: Clock,
      title: "Off-Peak Scheduling",
      description: "Maintenance done during off-hours to avoid disruption to your business operations.",
      stat: "0",
    },
    {
      icon: FileCheck,
      title: "Compliance Ready",
      description: "Regular inspections and documentation ensure compliance with commercial building regulations.",
      stat: "100%",
    },
    {
      icon: HeadphonesIcon,
      title: "Priority Response",
      description: "Emergency support available 24/7 for critical issues affecting business operations.",
      stat: "24/7",
    },
  ];

  const faqs: AMCFAQ[] = [
    {
      question: "What is covered under the Commercial AMC?",
      answer: "Coverage includes electrical, HVAC, plumbing, lighting, security systems, and civil repairs depending on your selected plan. A detailed scope is provided before signing.",
    },
    {
      question: "Can maintenance be done outside business hours?",
      answer: "Yes. We schedule all maintenance during off-peak hours — early mornings, late evenings, or weekends — based on your preference to ensure zero disruption.",
    },
    {
      question: "Is the Mall/Complex plan truly custom?",
      answer: "Yes. For large commercial properties, we conduct a free facility assessment and then propose a plan tailored to your exact requirements — number of floors, systems, amenities, and compliance needs.",
    },
    {
      question: "Are CCTV and fire safety systems included?",
      answer: "CCTV and fire safety checkups are included from the Commercial Plus plan onwards. The Retail Basic plan covers core electrical, HVAC, and plumbing only.",
    },
    {
      question: "Do you provide service reports for audits?",
      answer: "Yes. All plans include digital service logs. Commercial Plus and Enterprise plans include quarterly compliance reports suitable for FSSAI, fire safety, and building management audits.",
    },
  ];

  return (
    <AMCPageTemplate
      onBack={onBack}
      onBookNow={onBookNow}
      pageIcon={Store}
      badge="Commercial & Retail Solutions"
      title="AMC for Retail & Commercial Spaces"
      subtitle="Structured facility maintenance for shops, showrooms, and commercial complexes. Keep operations consistent with verified professionals and transparent service standards."
      heroStats={heroStats}
      plans={plans}
      servicesIncluded={servicesIncluded}
      benefits={benefits}
      faqs={faqs}
      ctaTitle="Maintain Your Commercial Space Professionally"
      ctaSubtitle="Get a customized quote based on your retail or commercial space size and requirements."
      primaryCta="Request a Quote"
      footerNote="All services performed by verified professionals. Off-peak scheduling available. Terms apply."
      accent={commercialAccent}
      category="commercial"
    />
  );
}
