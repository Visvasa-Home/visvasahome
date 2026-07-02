import {
  Building, Shield, Clock, FileCheck, Users,
  Zap, Wind, Droplet, TreePine, Lightbulb,
} from "lucide-react";
import { AMCPageTemplate, AMCPlan, ServiceCategory, AMCBenefit, AMCFAQ, HeroStat, AMCAccentTheme } from "@amc/components/AMCPageTemplate";

const societyAccent: AMCAccentTheme = {
  from: "#0f766e",
  to: "#0d9488",
  light: "#f0fdfa",
  text: "#0f766e",
  border: "#99f6e4",
  badge: "#ccfbf1",
  badgeText: "#134e4a",
  ring: "ring-teal-600",
};

interface AMCSocietyProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function AMCSociety({ onBack, onBookNow }: AMCSocietyProps) {
  const heroStats: HeroStat[] = [
    { value: "600+", label: "Societies Managed" },
    { value: "4.8/5", label: "Resident Satisfaction" },
    { value: "15+", label: "Cities Covered" },
    { value: "24/7", label: "Emergency Support" },
  ];

  const plans: AMCPlan[] = [
    {
      name: "Small Society",
      price: "₹39,999",
      monthlyEquiv: "₹3,333",
      period: "/ year",
      description: "Essential maintenance for compact societies",
      bestFor: "Up to 50 residential units",
      features: [
        "Monthly common area inspection",
        "Lift maintenance — up to 2 lifts",
        "Common area lighting & electrical",
        "Water pump & motor servicing",
        "Plumbing in common areas",
        "Gate & entrance systems",
        "Garden & landscape basic upkeep",
        "12 service visits / year",
        "Digital maintenance log",
      ],
      notIncluded: ["Swimming pool", "Gym equipment", "24/7 dedicated support"],
      popular: false,
      badge: "Starter",
    },
    {
      name: "Residential Complex",
      price: "₹1,49,999",
      monthlyEquiv: "₹12,499",
      period: "/ year",
      description: "Comprehensive maintenance for mid-size complexes",
      bestFor: "Up to 200 residential units",
      features: [
        "Weekly facility inspections",
        "All lift maintenance — monthly",
        "Common area AC & ventilation",
        "Street light & common lighting",
        "Swimming pool maintenance",
        "Gym equipment checkup",
        "Water treatment & tanks",
        "Fire safety systems",
        "Club house maintenance",
        "24/7 emergency support",
        "Dedicated facility manager",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      name: "Large Township",
      price: "Custom",
      monthlyEquiv: undefined,
      period: "tailored pricing",
      description: "Complete township facility management",
      bestFor: "200+ unit townships & gated communities",
      features: [
        "Comprehensive campus management",
        "Multiple tower maintenance",
        "All amenity facility upkeep",
        "Sewage treatment plant",
        "Generator & power backup systems",
        "Security system maintenance",
        "Landscape & parks management",
        "Community center facilities",
        "Sports complex maintenance",
        "On-site technical team",
        "Resident digital service portal",
      ],
      popular: false,
      badge: "Township",
    },
  ];

  const servicesIncluded: ServiceCategory[] = [
    {
      icon: Zap,
      title: "Electrical Systems",
      items: ["Common area lighting", "Street light maintenance", "Lift electrical systems", "Generator servicing"],
    },
    {
      icon: Wind,
      title: "Lift & Equipment",
      items: ["Elevator regular servicing", "Emergency rescue readiness", "Safety certification", "Gym equipment maintenance"],
    },
    {
      icon: Droplet,
      title: "Water Management",
      items: ["Water pump maintenance", "Overhead tank cleaning", "Underground tank servicing", "Water treatment systems"],
    },
    {
      icon: TreePine,
      title: "Landscape & Outdoor",
      items: ["Garden maintenance coordination", "Playground equipment checkup", "Outdoor lighting", "Parking area upkeep"],
    },
    {
      icon: Lightbulb,
      title: "Common Amenities",
      items: ["Club house maintenance", "Swimming pool systems", "Community hall facilities", "Security cabin systems"],
    },
    {
      icon: Users,
      title: "Safety & Compliance",
      items: ["Fire safety inspection", "Fire extinguisher checkup", "Emergency exit maintenance", "Compliance documentation"],
    },
  ];

  const benefits: AMCBenefit[] = [
    {
      icon: Shield,
      title: "Resident Satisfaction",
      description: "Well-maintained amenities enhance property value and ensure comfortable living for all residents.",
      stat: "↑ 20%",
    },
    {
      icon: Clock,
      title: "Proactive Maintenance",
      description: "Scheduled inspections prevent major issues and reduce emergency repair costs for the society.",
      stat: "35%",
    },
    {
      icon: FileCheck,
      title: "Transparent Accounting",
      description: "Detailed service reports and logs ensure full accountability to the society management committee.",
      stat: "100%",
    },
    {
      icon: Users,
      title: "Single Point of Contact",
      description: "Dedicated facility manager handles all maintenance, so committee members can focus on governance.",
      stat: "1",
    },
  ];

  const faqs: AMCFAQ[] = [
    {
      question: "What does the Society AMC cover?",
      answer: "The AMC covers all common area systems: electrical, lifts, water pumps, plumbing, fire safety, lighting, garden, club house, swimming pool, gym equipment, and more — based on your plan. Individual flat internal maintenance is not included.",
    },
    {
      question: "How is lift maintenance handled?",
      answer: "Lifts are serviced monthly with a complete checkup including mechanical, electrical, and safety system inspection. Emergency rescue readiness is tested quarterly. Annual safety certificates are arranged in coordination with the lift OEM or authorized service partner.",
    },
    {
      question: "Can you manage the swimming pool and gym?",
      answer: "Yes. The Residential Complex plan includes swimming pool filtration, pumping systems, and gym equipment checkups. Physical pool water treatment can be included as a supplementary service.",
    },
    {
      question: "How does the management committee receive updates?",
      answer: "All plans include a digital maintenance log accessible to the RWA/MC. The Residential Complex and Township plans include a dedicated facility manager who presents monthly reports to the management committee.",
    },
    {
      question: "Does the AMC cover generator maintenance?",
      answer: "Generators are included from the Residential Complex plan. Generator electrical health checkups, fuel system inspection, and load testing are part of the scheduled maintenance calendar.",
    },
    {
      question: "How do you handle emergency breakdowns — e.g., a lift failure?",
      answer: "All plans include emergency support. For the Small Society plan, emergency response is within 8 hours. For the Residential Complex and Township plans, emergency response is 24/7 within 2–4 hours depending on the issue.",
    },
  ];

  return (
    <AMCPageTemplate
      onBack={onBack}
      onBookNow={onBookNow}
      pageIcon={Building}
      badge="Residential Society Solutions"
      title="AMC for Residential Societies & Townships"
      subtitle="Comprehensive facility management for apartment complexes and gated communities. Ensure resident satisfaction with structured maintenance and complete accountability."
      heroStats={heroStats}
      plans={plans}
      servicesIncluded={servicesIncluded}
      benefits={benefits}
      faqs={faqs}
      ctaTitle="Enhance Your Society's Living Experience"
      ctaSubtitle="Get a comprehensive assessment and customized maintenance plan for your residential society."
      primaryCta="Request Assessment"
      footerNote="All services performed by verified facility management professionals. Detailed service schedules and RWA-ready reporting included. Terms apply."
      accent={societyAccent}
      category="society"
    />
  );
}
