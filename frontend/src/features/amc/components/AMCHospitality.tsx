import {
  UtensilsCrossed, Shield, Clock, FileCheck, Star,
  Zap, Wind, Droplet, ChefHat, Wifi,
} from "lucide-react";
import { AMCPageTemplate, AMCPlan, ServiceCategory, AMCBenefit, AMCFAQ, HeroStat, AMCAccentTheme } from "@amc/components/AMCPageTemplate";

const hospitalityAccent: AMCAccentTheme = {
  from: "#9d174d",
  to: "#be185d",
  light: "#fff1f2",
  text: "#9d174d",
  border: "#fecdd3",
  badge: "#ffe4e6",
  badgeText: "#881337",
  ring: "ring-blue-600",
};

interface AMCHospitalityProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function AMCHospitality({ onBack, onBookNow }: AMCHospitalityProps) {
  const heroStats: HeroStat[] = [
    { value: "1,500+", label: "Properties Maintained" },
    { value: "4.8/5", label: "Client Satisfaction" },
    { value: "18+", label: "Cities Covered" },
    { value: "24/7", label: "Emergency Support" },
  ];

  const plans: AMCPlan[] = [
    {
      name: "Restaurant",
      price: "₹19,999",
      monthlyEquiv: "₹1,666",
      period: "/ year",
      description: "Essential maintenance for food outlets",
      bestFor: "QSRs, cafes & standalone restaurants",
      features: [
        "Monthly electrical inspection",
        "AC & ventilation — quarterly",
        "Kitchen equipment power backup",
        "Plumbing & drainage systems",
        "Exhaust & chimney cleaning",
        "Dining area maintenance",
        "Emergency support available",
        "Digital service log",
      ],
      notIncluded: ["Swimming pool systems", "Laundry equipment", "24/7 dedicated support"],
      popular: false,
      badge: "F&B",
    },
    {
      name: "Hotel",
      price: "₹1,29,999",
      monthlyEquiv: "₹10,833",
      period: "/ year",
      description: "Comprehensive facility management",
      bestFor: "3-star & 4-star hotels",
      features: [
        "Weekly facility inspections",
        "All room AC maintenance — monthly",
        "Guest room electrical systems",
        "Kitchen & restaurant equipment",
        "Lobby & common area upkeep",
        "Swimming pool systems",
        "Laundry equipment maintenance",
        "Fire & safety compliance",
        "24/7 priority support",
        "Dedicated facility manager",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      name: "Resort Complex",
      price: "Custom",
      monthlyEquiv: undefined,
      period: "tailored pricing",
      description: "Complete hospitality facility management",
      bestFor: "Resorts, heritage hotels & 5-star properties",
      features: [
        "Comprehensive property assessment",
        "All guest accommodation systems",
        "Multi-restaurant kitchen equipment",
        "Spa & wellness facility systems",
        "Outdoor & landscape maintenance",
        "Event & banquet hall systems",
        "Central HVAC management",
        "Water treatment & pools",
        "On-site technical team",
        "Guest experience-first protocols",
      ],
      popular: false,
      badge: "Resort",
    },
  ];

  const servicesIncluded: ServiceCategory[] = [
    {
      icon: Zap,
      title: "Electrical Systems",
      items: ["Guest room wiring & outlets", "Lobby & common area lighting", "Kitchen equipment circuits", "Emergency backup systems"],
    },
    {
      icon: Wind,
      title: "HVAC & Comfort",
      items: ["Room AC individual servicing", "Central air conditioning", "Kitchen ventilation", "Temperature control systems"],
    },
    {
      icon: ChefHat,
      title: "Kitchen Equipment",
      items: ["Commercial appliance maintenance", "Exhaust & chimney cleaning", "Refrigeration systems", "Gas pipeline inspection"],
    },
    {
      icon: Droplet,
      title: "Water & Sanitation",
      items: ["Hot water systems", "Swimming pool filtration", "Bathroom fixture maintenance", "Water treatment systems"],
    },
    {
      icon: Wifi,
      title: "Guest Services",
      items: ["Electrical outlet functionality", "Lighting in all guest areas", "Climate control systems", "Safety equipment checkup"],
    },
    {
      icon: Star,
      title: "Compliance & Quality",
      items: ["Fire safety inspection", "Health department compliance", "Emergency exit maintenance", "Quality standards documentation"],
    },
  ];

  const benefits: AMCBenefit[] = [
    {
      icon: Shield,
      title: "Guest Satisfaction",
      description: "Reliable facility systems ensure comfortable stays and protect your property's reputation.",
      stat: "5★",
    },
    {
      icon: Clock,
      title: "Round-the-Clock",
      description: "24/7 emergency support ensures guest comfort is never compromised by a facility issue.",
      stat: "24/7",
    },
    {
      icon: FileCheck,
      title: "Regulatory Compliance",
      description: "Regular inspections ensure compliance with hospitality, health, and fire safety regulations.",
      stat: "100%",
    },
    {
      icon: Star,
      title: "Star Rating Ready",
      description: "Consistent maintenance supports star ratings and quality certifications for your property.",
      stat: "Audit",
    },
  ];

  const faqs: AMCFAQ[] = [
    {
      question: "How do you ensure guest experience isn't disrupted?",
      answer: "All routine maintenance is scheduled during low-occupancy periods or early morning/late night hours. Our team coordinates with your front desk and housekeeping before entering guest areas. Guest-facing work is always done discreetly.",
    },
    {
      question: "Are kitchen and commercial refrigeration systems covered?",
      answer: "Yes. Commercial kitchen appliances, exhaust hoods, chimneys, gas pipelines, and refrigeration systems are all covered. The scope is defined based on your kitchen size and equipment inventory during the property assessment.",
    },
    {
      question: "Is swimming pool maintenance included?",
      answer: "Pool filtration and circulation systems are included from the Hotel plan onwards. Physical pool cleaning and water treatment chemical management can be added as a supplementary service.",
    },
    {
      question: "Can you help maintain our fire safety compliance?",
      answer: "Yes. All plans include fire safety inspections and maintenance of fire extinguishers, emergency lighting, exit signage, and fire alarms. We provide documentation suitable for fire NOC renewals and hotel licensing.",
    },
    {
      question: "Do you handle spa and wellness equipment?",
      answer: "Yes. The Resort Complex plan includes spa and wellness facility systems — HVAC in treatment rooms, water heating, jacuzzi systems, and steam generator maintenance.",
    },
    {
      question: "What if a critical system fails at 2 AM?",
      answer: "The Hotel and Resort Complex plans include 24/7 emergency support. Our on-call technicians are dispatched immediately. Critical guest-facing systems (AC, hot water, power) are treated as priority emergencies at all hours.",
    },
  ];

  return (
    <AMCPageTemplate
      onBack={onBack}
      onBookNow={onBookNow}
      pageIcon={UtensilsCrossed}
      badge="Hospitality Facility Solutions"
      title="AMC for Hospitality Properties"
      subtitle="Specialized facility maintenance for hotels, restaurants, and resorts. Protect guest experience and reputation with reliable systems and quality-focused service standards."
      heroStats={heroStats}
      plans={plans}
      servicesIncluded={servicesIncluded}
      benefits={benefits}
      faqs={faqs}
      ctaTitle="Elevate Guest Experience with Reliable Systems"
      ctaSubtitle="Get a specialized facility assessment and customized maintenance plan for your hospitality property."
      primaryCta="Request Assessment"
      footerNote="All services performed by hospitality facility maintenance specialists. Guest-first protocols followed at all times. Terms apply."
      accent={hospitalityAccent}
      category="hospitality"
    />
  );
}
