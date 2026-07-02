import {
  ArrowLeft,
  Zap,
  Clock,
  Shield,
  Star,
  Leaf,
  Sun,
  TrendingDown,
  Users,
} from "lucide-react";
import { Button } from "@shared/ui/button";
import { Card } from "@shared/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/accordion";
import { Badge } from "@shared/ui/badge";

interface GreenEnergyPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

const services = [
  {
    name: "Solar Panel Installation",
    description: "Residential rooftop solar systems from 1kW to 10kW with full wiring, mounting and commissioning.",
    startingPrice: "₹45,000",
    duration: "2-3 days",
    warranty: "5 years",
    popular: true,
  },
  {
    name: "Solar Panel Cleaning & Maintenance",
    description: "Professional cleaning and performance check to maximise energy output of your solar array.",
    startingPrice: "₹499",
    duration: "1-2 hrs",
    warranty: "30 days",
    popular: true,
  },
  {
    name: "Solar Inverter Repair & Replacement",
    description: "Diagnosis, repair or replacement of faulty solar inverters to restore your system's efficiency.",
    startingPrice: "₹1,499",
    duration: "2-3 hrs",
    warranty: "90 days",
    popular: false,
  },
  {
    name: "Net Metering Application Assistance",
    description: "End-to-end documentation support for net metering registration with your local DISCOM.",
    startingPrice: "₹999",
    duration: "Documentation",
    warranty: "30 days",
    popular: false,
  },
  {
    name: "EV Charger Installation",
    description: "Home wall charger installation for 7kW and 11kW AC chargers with dedicated circuit wiring.",
    startingPrice: "₹3,999",
    duration: "3-5 hrs",
    warranty: "1 year",
    popular: true,
  },
  {
    name: "EV Charging Cable & Outlet Setup",
    description: "Installation of dedicated EV-grade outlet, cable management and safety circuit breaker.",
    startingPrice: "₹1,499",
    duration: "2-3 hrs",
    warranty: "90 days",
    popular: false,
  },
  {
    name: "Energy Audit & Consultation",
    description: "Comprehensive home energy assessment with actionable recommendations to cut electricity bills.",
    startingPrice: "₹1,999",
    duration: "2-3 hrs",
    warranty: "NA",
    popular: false,
  },
];

const whyChooseUs = [
  {
    icon: <Sun className="w-7 h-7 text-green-600" />,
    title: "Certified Installers",
    description: "All solar and EV professionals are MNRE-certified and trained on the latest systems.",
  },
  {
    icon: <TrendingDown className="w-7 h-7 text-green-600" />,
    title: "Lower Bills",
    description: "Our customers report 40–80% reduction in electricity bills within the first year.",
  },
  {
    icon: <Shield className="w-7 h-7 text-green-600" />,
    title: "Long Warranties",
    description: "Industry-leading warranties on all installations backed by our service guarantee.",
  },
  {
    icon: <Leaf className="w-7 h-7 text-green-600" />,
    title: "Eco-Friendly Disposal",
    description: "Old equipment is disposed of responsibly following e-waste norms — no landfill dumping.",
  },
];

const faqs = [
  {
    question: "How much roof space do I need for a 1kW solar system?",
    answer:
      "A 1kW system typically requires around 10–12 sq ft of shadow-free roof space. Our technician will conduct a site survey during consultation and recommend the optimal system size based on your roof area, orientation and monthly consumption.",
  },
  {
    question: "What is net metering and how does it benefit me?",
    answer:
      "Net metering allows you to export surplus solar energy back to the grid and receive credits on your electricity bill. When your panels produce more than you consume — especially on sunny days — the excess units are credited and offset future bills, effectively making the grid act as a free battery.",
  },
  {
    question: "Which EV charger is right for my car?",
    answer:
      "Most home EV owners opt for a 7kW AC wall charger which can fully charge a standard EV overnight. If you have a high-capacity battery or need faster top-ups, a 11kW charger is recommended. Our professional will check your existing electrical panel capacity before installation.",
  },
  {
    question: "How often should solar panels be cleaned?",
    answer:
      "In Indian conditions with dust and pollution, we recommend cleaning every 2–3 months. Dirty panels can lose up to 25% of their efficiency. Our maintenance plans make it easy to schedule recurring visits at a discounted rate.",
  },
  {
    question: "What subsidies are available for solar installation?",
    answer:
      "The PM Surya Ghar Muft Bijli Yojana offers subsidies of up to ₹78,000 for residential rooftop systems. Our team assists with subsidy application and DISCOM paperwork as part of the installation package at no extra charge.",
  },
];

export function GreenEnergyPage({ onBack, onBookNow }: GreenEnergyPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-800">Green Energy</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-5">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Green Energy</h1>
          <p className="text-lg text-green-50 max-w-2xl mx-auto">
            Solar panel installation, EV charging — sustainable energy solutions for your home
          </p>
          <Button
            onClick={onBookNow}
            className="mt-6 bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-2 rounded-full"
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Services</h2>
        <p className="text-gray-500 mb-8">Clean energy solutions tailored for Indian homes</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.name} className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow relative">
              {service.popular && (
                <Badge className="absolute top-4 right-4 bg-amber-100 text-amber-700 border-amber-200 text-xs font-semibold">
                  Popular
                </Badge>
              )}
              <h3 className="font-semibold text-gray-800 pr-16 leading-snug">{service.name}</h3>
              <p className="text-sm text-gray-500 flex-1">{service.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-green-500" />
                  Starting {service.startingPrice}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {service.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-teal-500" />
                  {service.warranty}
                </span>
              </div>
              <Button
                onClick={onBookNow}
                className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
              >
                Book Service
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Why Choose Us</h2>
          <p className="text-gray-500 text-center mb-10">Helping Indian homes go green since 2019</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Frequently Asked Questions</h2>
        <p className="text-gray-500 text-center mb-8">Answers to common green energy questions</p>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-white rounded-lg border border-gray-200 px-4"
            >
              <AccordionTrigger className="text-left font-medium text-gray-800 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-500 text-sm pb-4">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#2563EB] to-blue-400 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <Leaf className="w-10 h-10 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Start Your Green Energy Journey</h2>
          <p className="text-blue-100 mb-7">
            Save money and the planet. Book your solar or EV service today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={onBookNow}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-2 rounded-full text-base"
            >
              Book Now
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-2 rounded-full text-base bg-transparent"
            >
              Explore More Services
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
