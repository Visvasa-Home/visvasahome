import {
  Factory, Shield, Clock, FileCheck, AlertTriangle,
  Zap, Wind, Droplet, Cog, Flame,
} from "lucide-react";
import { AMCPageTemplate, AMCPlan, ServiceCategory, AMCBenefit, AMCFAQ, HeroStat, AMCAccentTheme } from "@amc/components/AMCPageTemplate";

const industrialAccent: AMCAccentTheme = {
  from: "#374151",
  to: "#1f2937",
  light: "#f3f4f6",
  text: "#374151",
  border: "#d1d5db",
  badge: "#e5e7eb",
  badgeText: "#374151",
  ring: "ring-gray-600",
};

interface AMCIndustrialProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function AMCIndustrial({ onBack, onBookNow }: AMCIndustrialProps) {
  const heroStats: HeroStat[] = [
    { value: "500+", label: "Industrial Units Served" },
    { value: "4.7/5", label: "Client Satisfaction" },
    { value: "15+", label: "Cities Covered" },
    { value: "2hr", label: "Emergency Response" },
  ];

  const plans: AMCPlan[] = [
    {
      name: "Workshop",
      price: "₹49,999",
      monthlyEquiv: "₹4,166",
      period: "/ year",
      description: "Essential maintenance for small industrial units",
      bestFor: "Small workshops & fabrication units",
      features: [
        "Monthly electrical inspection",
        "Heavy machinery basic checkup",
        "Industrial AC maintenance",
        "Plumbing & drainage systems",
        "Lighting & power distribution",
        "Safety compliance review",
        "Standard response time",
        "Digital maintenance log",
      ],
      notIncluded: ["Effluent treatment systems", "On-site technician", "Regulatory reporting"],
      popular: false,
      badge: "Starter",
    },
    {
      name: "Manufacturing",
      price: "₹1,49,999",
      monthlyEquiv: "₹12,499",
      period: "/ year",
      description: "Comprehensive facility management",
      bestFor: "Mid-scale manufacturing plants",
      features: [
        "Weekly facility inspections",
        "All electrical systems management",
        "HVAC & ventilation systems",
        "Fire safety system maintenance",
        "Emergency power backup checkup",
        "Water & waste management",
        "Safety equipment inspection",
        "24/7 priority support",
        "Dedicated facility manager",
        "Monthly compliance reporting",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      name: "Large Industrial",
      price: "Custom",
      monthlyEquiv: undefined,
      period: "tailored pricing",
      description: "Complete industrial facility management",
      bestFor: "Large factories & industrial parks",
      features: [
        "Comprehensive facility assessment",
        "Preventive maintenance scheduling",
        "All heavy equipment servicing",
        "Central power system management",
        "Effluent treatment monitoring",
        "Fire & safety compliance",
        "On-site technician team",
        "Quarterly regulatory reporting",
        "Emergency response protocol",
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
      items: ["HT/LT panel maintenance", "Transformer servicing", "Generator checkup", "Power distribution systems"],
    },
    {
      icon: Wind,
      title: "HVAC & Ventilation",
      items: ["Industrial AC servicing", "Exhaust system maintenance", "Air quality control", "Cooling tower upkeep"],
    },
    {
      icon: Flame,
      title: "Fire & Safety",
      items: ["Fire extinguisher inspection", "Sprinkler system testing", "Emergency exit maintenance", "Safety signage updates"],
    },
    {
      icon: Cog,
      title: "Machinery Support",
      items: ["Equipment lubrication", "Belt & pulley inspection", "Motor maintenance", "Conveyor system checkup"],
    },
    {
      icon: Droplet,
      title: "Water & Waste",
      items: ["Water treatment systems", "Drainage maintenance", "Sewage system upkeep", "Tank cleaning services"],
    },
    {
      icon: AlertTriangle,
      title: "Safety Compliance",
      items: ["Safety audit & inspection", "Compliance documentation", "Emergency protocol review", "Regulatory reporting"],
    },
  ];

  const benefits: AMCBenefit[] = [
    {
      icon: Shield,
      title: "Operational Continuity",
      description: "Preventive maintenance reduces unexpected breakdowns and ensures smooth production operations.",
      stat: "40%",
    },
    {
      icon: Clock,
      title: "Scheduled Downtime",
      description: "Coordinated maintenance schedules minimize production downtime and maximize facility efficiency.",
      stat: "Min.",
    },
    {
      icon: FileCheck,
      title: "Regulatory Compliance",
      description: "Regular safety inspections and documentation ensure compliance with industrial regulations.",
      stat: "100%",
    },
    {
      icon: AlertTriangle,
      title: "Safety First",
      description: "Comprehensive safety system maintenance protects workers and ensures a secure environment.",
      stat: "Zero",
    },
  ];

  const faqs: AMCFAQ[] = [
    {
      question: "What industrial facility types do you service?",
      answer: "We maintain workshops, fabrication units, small to mid-scale manufacturing plants, warehouses, food processing units, and large industrial parks. The scope is customized based on your facility type.",
    },
    {
      question: "Do you handle hazardous areas or specialized equipment?",
      answer: "Yes, for specific hazardous zones. Our technicians are trained in industrial safety protocols. Highly specialized equipment (CNC machines, custom automation) is assessed separately during the facility visit.",
    },
    {
      question: "How is the emergency response managed?",
      answer: "All plans include emergency support. The Manufacturing plan guarantees a 4-hour on-site response. Large Industrial plans include a dedicated emergency response protocol with 2-hour response SLAs.",
    },
    {
      question: "Are statutory compliance reports provided?",
      answer: "Yes. The Manufacturing plan includes monthly compliance logs. The Large Industrial plan includes quarterly reports for factory inspectors, fire safety authorities, and pollution control boards.",
    },
    {
      question: "Can you provide an on-site full-time technician?",
      answer: "Yes, the Large Industrial plan includes the option for dedicated on-site technician deployment. This can be included as part of the custom scope during the facility assessment.",
    },
    {
      question: "How do you handle routine vs. breakdown maintenance?",
      answer: "Routine preventive maintenance is scheduled as per a fixed calendar agreed upon contract signing. Breakdown maintenance is attended within the SLA response time of your plan with no additional call-out charges.",
    },
  ];

  return (
    <AMCPageTemplate
      onBack={onBack}
      onBookNow={onBookNow}
      pageIcon={Factory}
      badge="Industrial Facility Solutions"
      title="AMC for Industrial Facilities"
      subtitle="Structured preventive maintenance for factories, warehouses, and manufacturing units. Ensure operational continuity, safety compliance, and maximum uptime."
      heroStats={heroStats}
      plans={plans}
      servicesIncluded={servicesIncluded}
      benefits={benefits}
      faqs={faqs}
      ctaTitle="Ensure Industrial Safety & Continuity"
      ctaSubtitle="Get a comprehensive facility assessment and customized maintenance plan for your industrial unit."
      primaryCta="Request Assessment"
      footerNote="All services performed by industrial maintenance specialists. Contracts include safety compliance and regulatory reporting. Terms apply."
      accent={industrialAccent}
      category="industrial"
    />
  );
}
