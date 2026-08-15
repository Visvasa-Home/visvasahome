import {
  Activity, Shield, Clock, FileCheck, AlertTriangle,
  Zap, Wind, Droplet, Thermometer, Siren,
} from "lucide-react";
import { AMCPageTemplate, AMCPlan, ServiceCategory, AMCBenefit, AMCFAQ, HeroStat, AMCAccentTheme } from "@amc/components/AMCPageTemplate";

const healthcareAccent: AMCAccentTheme = {
  from: "#065f46",
  to: "#047857",
  light: "#ecfdf5",
  text: "#065f46",
  border: "#a7f3d0",
  badge: "#d1fae5",
  badgeText: "#064e3b",
  ring: "ring-blue-600",
};

interface AMCHealthcareProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function AMCHealthcare({ onBack, onBookNow }: AMCHealthcareProps) {
  const heroStats: HeroStat[] = [
    { value: "800+", label: "Healthcare Facilities" },
    { value: "4.9/5", label: "Client Satisfaction" },
    { value: "15+", label: "Cities Covered" },
    { value: "1hr", label: "Critical Response" },
  ];

  const plans: AMCPlan[] = [
    {
      name: "Clinic",
      price: "₹19,999",
      monthlyEquiv: "₹1,666",
      period: "/ year",
      description: "Essential maintenance for small clinics",
      bestFor: "Single & multi-specialty clinics",
      features: [
        "Monthly electrical inspection",
        "AC & HVAC maintenance — quarterly",
        "Medical equipment power backup",
        "Plumbing & sanitary systems",
        "Lighting & sterilization areas",
        "Emergency support available",
        "12 service visits / year",
        "Digital maintenance log",
      ],
      notIncluded: ["Medical gas pipeline", "ICU/OT HVAC", "Compliance audit reports"],
      popular: false,
      badge: "Clinic",
    },
    {
      name: "Healthcare Center",
      price: "₹79,999",
      monthlyEquiv: "₹6,666",
      period: "/ year",
      description: "Comprehensive facility management",
      bestFor: "Day-care centers & nursing homes",
      features: [
        "Weekly facility inspections",
        "All AC & HVAC systems — monthly",
        "Emergency power backup checkup",
        "Medical gas pipeline inspection",
        "Water purification systems",
        "Biomedical waste area maintenance",
        "Fire & safety compliance",
        "24/7 priority support",
        "Dedicated service coordinator",
        "NABH readiness documentation",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      name: "Hospital Complex",
      price: "Custom",
      monthlyEquiv: undefined,
      period: "tailored pricing",
      description: "Complete hospital facility management",
      bestFor: "Full hospitals & multi-specialty centres",
      features: [
        "Daily critical system monitoring",
        "ICU & OT HVAC management",
        "Central oxygen & medical gas systems",
        "Emergency power & UPS systems",
        "Water treatment & sterilization",
        "Fire safety & sprinkler systems",
        "Infection control area maintenance",
        "On-site technical team deployment",
        "NABH/JCI compliance support",
        "Monthly compliance audit reports",
      ],
      popular: false,
      badge: "Hospital",
    },
  ];

  const servicesIncluded: ServiceCategory[] = [
    {
      icon: Zap,
      title: "Critical Power Systems",
      items: ["Emergency backup generators", "UPS & inverter maintenance", "ICU/OT dedicated circuits", "Medical equipment power"],
    },
    {
      icon: Wind,
      title: "HVAC & Air Quality",
      items: ["OT & ICU temperature control", "HEPA filter maintenance", "Humidity management", "Air quality monitoring"],
    },
    {
      icon: Thermometer,
      title: "Medical Gas Systems",
      items: ["Oxygen pipeline inspection", "Vacuum system maintenance", "Nitrous oxide line checkup", "Pressure monitoring"],
    },
    {
      icon: Droplet,
      title: "Water & Sanitation",
      items: ["RO water purification", "Hot water systems", "Sterilization equipment", "Biomedical waste area"],
    },
    {
      icon: Siren,
      title: "Emergency & Safety",
      items: ["Fire alarm systems", "Sprinkler inspection", "Emergency exit lighting", "Nurse call systems"],
    },
    {
      icon: AlertTriangle,
      title: "Compliance & Safety",
      items: ["NABH/JCI readiness", "Safety audit & inspection", "Infection control standards", "Regulatory documentation"],
    },
  ];

  const benefits: AMCBenefit[] = [
    {
      icon: Shield,
      title: "Patient Safety First",
      description: "Reliable systems ensure uninterrupted critical care and maintain sterile environments for patients.",
      stat: "Zero",
    },
    {
      icon: Clock,
      title: "Zero Downtime",
      description: "24/7 emergency support ensures critical healthcare systems remain operational at all times.",
      stat: "24/7",
    },
    {
      icon: FileCheck,
      title: "Regulatory Compliance",
      description: "Regular inspections and documentation support NABH, JCI, and MoHFW compliance requirements.",
      stat: "100%",
    },
    {
      icon: AlertTriangle,
      title: "Infection Control",
      description: "Specialized HVAC and sanitation maintenance protocols support infection prevention standards.",
      stat: "WHO",
    },
  ];

  const faqs: AMCFAQ[] = [
    {
      question: "Do your technicians understand healthcare facility protocols?",
      answer: "Yes. Our healthcare facility team is trained in hospital safety protocols, infection control procedures, and sterile zone requirements. They follow strict entry and hygiene protocols before and during every visit.",
    },
    {
      question: "How quickly can you respond to a critical system failure?",
      answer: "For the Healthcare Center plan: within 4 hours. For the Hospital Complex plan: within 1 hour, backed by a contractual SLA. Critical systems like backup power and HVAC are prioritized.",
    },
    {
      question: "Can you support NABH accreditation requirements?",
      answer: "Yes. The Healthcare Center plan includes NABH readiness documentation. The Hospital Complex plan includes full NABH/JCI compliance support, safety audits, and documentation suitable for accreditation submissions.",
    },
    {
      question: "Are medical gas pipelines and oxygen systems covered?",
      answer: "Medical gas pipeline inspection is included from the Healthcare Center plan onwards. We coordinate with licensed medical gas equipment specialists where required.",
    },
    {
      question: "Can you work without disrupting patient care?",
      answer: "Absolutely. All maintenance is scheduled in advance and coordinated with your facilities team. Non-critical work is done during low-activity hours. Emergency repairs are done with full awareness of patient zones.",
    },
    {
      question: "What happens if a critical system fails outside office hours?",
      answer: "Healthcare Center and Hospital Complex plans include 24/7 emergency contact. Our on-call technicians are dispatched immediately. Critical system failures are escalated to senior engineers for resolution within the SLA timeframe.",
    },
  ];

  return (
    <AMCPageTemplate
      onBack={onBack}
      onBookNow={onBookNow}
      pageIcon={Activity}
      badge="Healthcare Facility Solutions"
      title="AMC for Healthcare Facilities"
      subtitle="Specialized facility maintenance for hospitals, clinics, and healthcare centers. Ensure critical system reliability with compliance-focused service standards and round-the-clock support."
      heroStats={heroStats}
      plans={plans}
      servicesIncluded={servicesIncluded}
      benefits={benefits}
      faqs={faqs}
      ctaTitle="Ensure Critical Healthcare System Reliability"
      ctaSubtitle="Get a specialized facility assessment and customized maintenance plan for your healthcare property."
      primaryCta="Request Assessment"
      footerNote="All services performed by healthcare-trained professionals. NABH/JCI documentation support included. Terms apply."
      accent={healthcareAccent}
      category="healthcare"
    />
  );
}
