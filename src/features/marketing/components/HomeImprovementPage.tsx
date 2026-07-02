import {
  ArrowLeft,
  Home,
  CheckCircle,
  Clock,
  Shield,
  Star,
  Wrench,
  ThumbsUp,
  Users,
  Award,
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

interface HomeImprovementPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

const services = [
  {
    name: "Curtain & Blind Installation",
    description: "Track/rod fitting and installation of all curtain types including eyelet, pencil pleat, roller and roman blinds.",
    startingPrice: "₹399",
    duration: "1-2 hrs",
    warranty: "15 days",
    popular: true,
  },
  {
    name: "Curtain Removal & Reinstallation",
    description: "Safe removal of existing curtains/blinds and clean reinstallation at the same or new location.",
    startingPrice: "₹299",
    duration: "1 hr",
    warranty: "15 days",
    popular: false,
  },
  {
    name: "Wallpaper Installation",
    description: "Per room bubble-free wallpaper installation with professional surface prep and seamless finish.",
    startingPrice: "₹1,499",
    duration: "3-4 hrs",
    warranty: "30 days",
    popular: true,
  },
  {
    name: "Wallpaper Removal",
    description: "Clean removal of existing wallpaper with minimal wall damage and surface smoothing.",
    startingPrice: "₹799",
    duration: "2-3 hrs",
    warranty: "15 days",
    popular: false,
  },
  {
    name: "Mosquito Net / Mesh Installation",
    description: "Custom fitting of mosquito nets for doors, windows and sliding configurations.",
    startingPrice: "₹599",
    duration: "1-2 hrs",
    warranty: "30 days",
    popular: true,
  },
  {
    name: "Grill, Gate & Railing Fabrication & Fitting",
    description: "Custom fabrication and installation of MS/SS grills, gates and railings for security and aesthetics.",
    startingPrice: "₹2,999",
    duration: "4-6 hrs",
    warranty: "90 days",
    popular: false,
  },
  {
    name: "Aluminium Door & Window Installation/Repair",
    description: "Professional installation and repair of aluminium doors, windows, sliding panels and casement frames.",
    startingPrice: "₹1,999",
    duration: "3-5 hrs",
    warranty: "90 days",
    popular: true,
  },
  {
    name: "False Ceiling / POP Work",
    description: "Per room false ceiling and POP work including gypsum boards, cornice finishing and light cutouts.",
    startingPrice: "₹3,499",
    duration: "1-2 days",
    warranty: "90 days",
    popular: false,
  },
];

const whyChooseUs = [
  {
    icon: <Shield className="w-7 h-7 text-blue-500" />,
    title: "Vetted Professionals",
    description: "Every technician is background-verified, trained and insured for your peace of mind.",
  },
  {
    icon: <Clock className="w-7 h-7 text-blue-500" />,
    title: "On-Time Service",
    description: "We respect your schedule. Timely arrival with a 30-minute buffer window guarantee.",
  },
  {
    icon: <ThumbsUp className="w-7 h-7 text-blue-500" />,
    title: "Quality Workmanship",
    description: "We use premium materials and industry-standard techniques for lasting results.",
  },
  {
    icon: <Award className="w-7 h-7 text-blue-500" />,
    title: "Service Warranty",
    description: "All installations come with a defined warranty period. We fix it free if anything goes wrong.",
  },
];

const faqs = [
  {
    question: "Do I need to arrange materials or tools beforehand?",
    answer:
      "Our professionals carry all necessary tools. For installation services, if you already have the curtains, wallpaper or materials, we bring the hardware. For fabrication services like grills we can source materials on your behalf — just let us know during booking.",
  },
  {
    question: "How do I prepare my room before the wallpaper installation?",
    answer:
      "Please ensure the walls are clean, dry and free of loose paint or existing wallpaper before the technician arrives. Remove furniture away from walls where possible to give the professional ample working space.",
  },
  {
    question: "Can I book multiple services in a single visit?",
    answer:
      "Yes! You can club multiple services during booking. Our professional will handle all tasks sequentially. Combined bookings often save time and may qualify for a bundled discount.",
  },
  {
    question: "What happens if I am not satisfied with the work?",
    answer:
      "We offer a re-do within the warranty period at no extra charge. If the issue persists, our support team will escalate it and send a senior technician to resolve it.",
  },
  {
    question: "Are your grills and railings custom-fabricated or off-the-shelf?",
    answer:
      "All grill, gate and railing work is custom-fabricated to your exact measurements and design preferences. Our professional will take measurements on-site and confirm the design before fabrication begins.",
  },
];

export function HomeImprovementPage({ onBack, onBookNow }: HomeImprovementPageProps) {
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
          <span className="font-semibold text-gray-800">Home Improvement</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-500 to-amber-500 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-5">
            <Home className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Home Improvement</h1>
          <p className="text-lg text-blue-50 max-w-2xl mx-auto">
            Curtains, blinds, wallpaper, grills, doors &amp; windows — professional installation
          </p>
          <Button
            onClick={onBookNow}
            className="mt-6 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-2 rounded-full"
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Services</h2>
        <p className="text-gray-500 mb-8">Choose from our wide range of home improvement solutions</p>
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
                  <Star className="w-3.5 h-3.5 text-blue-400" />
                  Starting {service.startingPrice}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {service.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-green-500" />
                  {service.warranty}
                </span>
              </div>
              <Button
                onClick={onBookNow}
                className="mt-2 w-full bg-[#2563EB] hover:bg-blue-600 text-white text-sm font-medium rounded-lg"
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
          <p className="text-gray-500 text-center mb-10">Trusted by thousands of happy homeowners</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3 p-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
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
        <p className="text-gray-500 text-center mb-8">Everything you need to know before booking</p>
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
          <Wrench className="w-10 h-10 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Transform Your Home?</h2>
          <p className="text-blue-100 mb-7">
            Book a skilled professional today and get your home looking its best.
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
