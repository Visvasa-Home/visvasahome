import {
  GraduationCap, Shield, Clock, FileCheck, Users,
  Zap, Wind, Droplet, BookOpen, FlaskConical,
} from "lucide-react";
import { AMCPageTemplate, AMCPlan, ServiceCategory, AMCBenefit, AMCFAQ, HeroStat, AMCAccentTheme } from "@amc/components/AMCPageTemplate";

const educationalAccent: AMCAccentTheme = {
  from: "#5b21b6",
  to: "#7c3aed",
  light: "#f5f3ff",
  text: "#5b21b6",
  border: "#ddd6fe",
  badge: "#ede9fe",
  badgeText: "#4c1d95",
  ring: "ring-blue-600",
};

interface AMCEducationalProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function AMCEducational({ onBack, onBookNow }: AMCEducationalProps) {
  const heroStats: HeroStat[] = [
    { value: "1,200+", label: "Institutions Served" },
    { value: "4.8/5", label: "Client Satisfaction" },
    { value: "18+", label: "Cities Covered" },
    { value: "Break-time", label: "Maintenance Scheduling" },
  ];

  const plans: AMCPlan[] = [
    {
      name: "School Basic",
      price: "₹24,999",
      monthlyEquiv: "₹2,083",
      period: "/ year",
      description: "Essential maintenance for small schools",
      bestFor: "Primary & secondary schools",
      features: [
        "Monthly electrical inspection",
        "AC servicing in key areas — quarterly",
        "Classroom lighting maintenance",
        "Plumbing & sanitary systems",
        "Playground equipment checkup",
        "Safety compliance review",
        "12 service visits / year",
        "Digital maintenance log",
      ],
      notIncluded: ["Laboratory gas systems", "Sports complex", "24/7 support"],
      popular: false,
      badge: "School",
    },
    {
      name: "Educational Campus",
      price: "₹89,999",
      monthlyEquiv: "₹7,499",
      period: "/ year",
      description: "Comprehensive multi-building management",
      bestFor: "Senior secondary & junior colleges",
      features: [
        "Weekly facility inspections",
        "All AC & ventilation systems",
        "Laboratory equipment power backup",
        "Sports facility maintenance",
        "Auditorium & library upkeep",
        "Computer lab electrical systems",
        "Water purification & tanks",
        "Fire & safety compliance",
        "24/7 emergency support",
        "Dedicated facility coordinator",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      name: "University Complex",
      price: "Custom",
      monthlyEquiv: undefined,
      period: "tailored pricing",
      description: "Complete campus facility management",
      bestFor: "Universities & engineering colleges",
      features: [
        "Comprehensive campus assessment",
        "All academic building maintenance",
        "Hostel & residential facilities",
        "Laboratory & research area systems",
        "Sports complex management",
        "Cafeteria & kitchen systems",
        "Campus-wide electrical & HVAC",
        "Fire safety & emergency systems",
        "On-site technical team",
        "Quarterly compliance reporting",
      ],
      popular: false,
      badge: "University",
    },
  ];

  const servicesIncluded: ServiceCategory[] = [
    {
      icon: Zap,
      title: "Electrical Systems",
      items: ["Classroom lighting maintenance", "Power backup systems", "Computer lab circuits", "Campus-wide distribution"],
    },
    {
      icon: Wind,
      title: "HVAC & Ventilation",
      items: ["Classroom AC servicing", "Auditorium cooling systems", "Lab ventilation", "Air quality control"],
    },
    {
      icon: FlaskConical,
      title: "Laboratory Systems",
      items: ["Science lab electrical work", "Fume hood maintenance", "Gas pipeline inspection", "Safety equipment checkup"],
    },
    {
      icon: Droplet,
      title: "Water & Sanitation",
      items: ["RO water purification", "Washroom maintenance", "Water tank cleaning", "Drainage systems"],
    },
    {
      icon: BookOpen,
      title: "Learning Spaces",
      items: ["Library maintenance", "Auditorium systems", "Smart classroom equipment", "Furniture & fixture repairs"],
    },
    {
      icon: Users,
      title: "Safety & Compliance",
      items: ["Fire safety inspection", "Emergency exit maintenance", "Playground safety checkup", "Regulatory compliance"],
    },
  ];

  const benefits: AMCBenefit[] = [
    {
      icon: Shield,
      title: "Student Safety",
      description: "Regular maintenance ensures safe learning environments with compliant electrical, fire, and structural systems.",
      stat: "Zero",
    },
    {
      icon: Clock,
      title: "Minimal Disruption",
      description: "Maintenance scheduled during breaks and vacations to ensure uninterrupted academic activities.",
      stat: "0 hrs",
    },
    {
      icon: FileCheck,
      title: "Compliance Ready",
      description: "Regular inspections and documentation ensure compliance with educational facility safety regulations.",
      stat: "100%",
    },
    {
      icon: Users,
      title: "Focus on Education",
      description: "Reliable facility systems let teachers and staff focus on education — not maintenance problems.",
      stat: "Always",
    },
  ];

  const faqs: AMCFAQ[] = [
    {
      question: "When are maintenance visits typically scheduled?",
      answer: "We schedule all routine maintenance during school vacations, weekends, or after school hours — so academic activities are never disrupted. Emergency repairs are handled within SLA response times regardless of timing.",
    },
    {
      question: "Are laboratory gas and fume hood systems covered?",
      answer: "Yes, from the Educational Campus plan onwards. Science lab electrical systems, fume hood maintenance, and gas pipeline inspection are included. Specialized chemistry lab gas systems may require a separate assessment.",
    },
    {
      question: "Can you manage hostel and residential facility maintenance?",
      answer: "Yes. The University Complex plan includes hostel and residential facility maintenance. This covers electrical, plumbing, HVAC, and common area systems for residential blocks.",
    },
    {
      question: "Do you provide fire safety compliance documentation?",
      answer: "Yes. All plans include fire safety inspection and documentation. The University Complex plan includes quarterly compliance reports suitable for regulatory submissions to education boards and local fire authorities.",
    },
    {
      question: "How do you handle multiple buildings on a campus?",
      answer: "A dedicated facility coordinator manages the entire campus. Maintenance is planned building-by-building on a scheduled rotation, with a centralized digital log accessible to your facilities team.",
    },
    {
      question: "Is smart classroom and AV equipment covered?",
      answer: "Electrical systems supporting smart classrooms (projectors, screens, speakers) are covered. Repair of the AV hardware itself is assessed separately. Basic fixture repairs and power connections are included.",
    },
  ];

  return (
    <AMCPageTemplate
      onBack={onBack}
      onBookNow={onBookNow}
      pageIcon={GraduationCap}
      badge="Educational Facility Solutions"
      title="AMC for Educational Institutions"
      subtitle="Structured facility maintenance for schools, colleges, and universities. Ensure safe, well-functioning learning environments with comprehensive maintenance and compliance."
      heroStats={heroStats}
      plans={plans}
      servicesIncluded={servicesIncluded}
      benefits={benefits}
      faqs={faqs}
      ctaTitle="Maintain Safe Learning Environments"
      ctaSubtitle="Get a comprehensive facility assessment and customized maintenance plan for your educational institution."
      primaryCta="Request Assessment"
      footerNote="All services performed by verified educational facility professionals. Safety compliance documentation included. Terms apply."
      accent={educationalAccent}
      category="educational"
    />
  );
}
