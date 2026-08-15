import {
  Home, Shield, Clock, FileCheck, Users,
  Zap, Wind, Droplet, Wrench, Paintbrush, LightbulbIcon,
} from "lucide-react";
import { AMCPageTemplate, AMCPlan, ServiceCategory, AMCBenefit, AMCFAQ, HeroStat, AMCAccentTheme } from "@amc/components/AMCPageTemplate";

const homeAccent: AMCAccentTheme = {
  from: "#1D4ED8",
  to: "#4338CA",
  light: "#eff6ff",
  text: "#1D4ED8",
  border: "#c7d2fe",
  badge: "#e0e7ff",
  badgeText: "#3730a3",
  ring: "ring-blue-500",
};

interface AMCHomeProps {
  onBack: () => void;
  onBookNow: () => void;
}

export function AMCHome({ onBack, onBookNow }: AMCHomeProps) {
  const heroStats: HeroStat[] = [
    { value: "8,000+", label: "Homes Covered" },
    { value: "4.9/5", label: "Customer Rating" },
    { value: "20+", label: "Cities Served" },
    { value: "24hr", label: "Emergency Response" },
  ];

  const plans: AMCPlan[] = [
    {
      name: "Basic",
      price: "₹6,999",
      monthlyEquiv: "₹583",
      period: "/ year",
      description: "Essential protection for compact homes",
      bestFor: "1–2 BHK apartments",
      features: [
        "Electrical inspection — quarterly",
        "AC servicing — 1 unit, twice a year",
        "Plumbing checkup — quarterly",
        "Minor repairs included",
        "Standard response time (48 hrs)",
        "4 scheduled service visits / year",
        "Digital service log",
      ],
      notIncluded: ["Painting touch-ups", "Pest control", "Deep cleaning"],
      popular: false,
      badge: "Starter",
    },
    {
      name: "Premium",
      price: "₹14,999",
      monthlyEquiv: "₹1,249",
      period: "/ year",
      description: "Comprehensive cover for family homes",
      bestFor: "3 BHK homes & above",
      features: [
        "Monthly electrical inspection",
        "AC servicing — up to 3 units, quarterly",
        "Plumbing & carpentry repairs",
        "Painting touch-ups — once a year",
        "Appliance maintenance checkup",
        "Priority response — within 24 hrs",
        "12 scheduled service visits / year",
        "Dedicated service coordinator",
        "Digital service log & reports",
      ],
      popular: true,
      badge: "Best Value",
    },
    {
      name: "Elite",
      price: "₹24,999",
      monthlyEquiv: "₹2,083",
      period: "/ year",
      description: "Total home management solution",
      bestFor: "Villas & large homes",
      features: [
        "Unlimited service visits",
        "All AC units — quarterly servicing",
        "24/7 emergency support",
        "All electrical & plumbing work",
        "Annual deep cleaning",
        "Pest control — quarterly",
        "Painting & waterproofing",
        "Home safety inspection",
        "Personal service manager",
        "Priority on-call response",
      ],
      popular: false,
      badge: "Complete",
    },
  ];

  const servicesIncluded: ServiceCategory[] = [
    {
      icon: Zap,
      title: "Electrical",
      items: ["Wiring & circuit inspection", "Switch & socket repair", "Fan & light fixture work", "MCB & DB maintenance"],
    },
    {
      icon: Wind,
      title: "AC & Appliances",
      items: ["AC cleaning & servicing", "Gas charging & repairs", "Geyser maintenance", "Appliance health checkup"],
    },
    {
      icon: Droplet,
      title: "Plumbing",
      items: ["Tap & faucet repair", "Pipe leak detection", "Drainage cleaning", "Water tank cleaning"],
    },
    {
      icon: Wrench,
      title: "Carpentry & Repairs",
      items: ["Door & window repair", "Cabinet & furniture fixing", "False ceiling work", "Wall mounting services"],
    },
    {
      icon: Paintbrush,
      title: "Painting",
      items: ["Wall touch-ups", "Ceiling painting", "Door & window painting", "Exterior touch-ups"],
    },
    {
      icon: LightbulbIcon,
      title: "General Maintenance",
      items: ["Lock & latch repair", "Tile & grouting work", "Seepage & leakage fixing", "General home repairs"],
    },
  ];

  const benefits: AMCBenefit[] = [
    {
      icon: Shield,
      title: "Consistent Care",
      description: "Scheduled maintenance prevents major failures and extends the life of all home systems.",
      stat: "3×",
    },
    {
      icon: Clock,
      title: "Time Savings",
      description: "One annual contract covers all maintenance needs. No more searching for contractors.",
      stat: "10hr+",
    },
    {
      icon: FileCheck,
      title: "Budget Control",
      description: "Fixed annual pricing eliminates surprise repair bills. Plan your home maintenance accurately.",
      stat: "30%",
    },
    {
      icon: Users,
      title: "Verified Professionals",
      description: "All work done by background-checked technicians with accountability at every visit.",
      stat: "100%",
    },
  ];

  const faqs: AMCFAQ[] = [
    {
      question: "What exactly is covered under the Home AMC?",
      answer: "Coverage depends on the selected plan. All plans include scheduled inspections and repairs for electrical, plumbing, and general maintenance. The Premium and Elite plans add AC servicing, painting, pest control, and more. A detailed scope document is shared before signing.",
    },
    {
      question: "How are service visits scheduled?",
      answer: "Your dedicated service coordinator contacts you to schedule all visits at your preferred time. For urgent issues, priority support is available based on your plan tier — typically 24–48 hours.",
    },
    {
      question: "Are materials and spare parts included?",
      answer: "Minor consumables (fasteners, washers, wire connectors, etc.) are included. Major components (AC compressors, new fixtures, paint material) are billed separately at transparent market rates, shared with you before work begins.",
    },
    {
      question: "Can I upgrade my plan mid-year?",
      answer: "Yes. You can upgrade your plan at any time by paying the pro-rated difference. Downgrades are processed at the next renewal date.",
    },
    {
      question: "What happens if I'm not satisfied with a service visit?",
      answer: "We have a structured escalation process. If a job isn't completed satisfactorily, we re-visit within 48 hours at no extra charge. Persistent issues are reviewed by our quality team.",
    },
    {
      question: "Which cities do you currently serve?",
      answer: "We currently operate in 20+ major cities including Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad, and more. Select your city to confirm availability.",
    },
  ];

  return (
    <AMCPageTemplate
      onBack={onBack}
      onBookNow={onBookNow}
      pageIcon={Home}
      badge="Home Maintenance Solutions"
      title="Annual Maintenance Contracts for Homes"
      subtitle="Reliable, scheduled home maintenance backed by verified professionals. Keep your home in peak condition with transparent pricing and full accountability."
      heroStats={heroStats}
      plans={plans}
      servicesIncluded={servicesIncluded}
      benefits={benefits}
      faqs={faqs}
      ctaTitle="Protect Your Home with Structured Maintenance"
      ctaSubtitle="Join thousands of families across India who trust VisvasaHome for reliable, transparent annual home care."
      primaryCta="Choose Your Plan"
      footerNote="All services performed by background-verified professionals. Contracts include detailed service schedules and digital logs. Minor consumables included; major parts billed at transparent rates. Terms apply."
      accent={homeAccent}
      category="home"
    />
  );
}
