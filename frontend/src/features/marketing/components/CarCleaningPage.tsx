import {
  ArrowLeft,
  Car,
  Clock,
  Shield,
  Star,
  Droplets,
  CheckCircle,
  Sparkles,
  CalendarCheck,
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

interface CarCleaningPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

const services = [
  {
    name: "Basic Car Wash",
    description: "Full exterior wash, thorough rinse and hand dry leaving your car spotless and streak-free.",
    startingPrice: "₹299",
    duration: "30-45 min",
    warranty: "Satisfaction",
    popular: true,
  },
  {
    name: "Interior Cleaning",
    description: "Deep vacuum of seats and carpets, dashboard wipe-down, and crystal-clear glass cleaning.",
    startingPrice: "₹499",
    duration: "1 hr",
    warranty: "Satisfaction",
    popular: true,
  },
  {
    name: "Full Car Wash + Interior",
    description: "Best-value combo — complete exterior wash plus full interior cleaning in one visit.",
    startingPrice: "₹699",
    duration: "1.5-2 hrs",
    warranty: "Satisfaction",
    popular: true,
  },
  {
    name: "Car Detailing",
    description: "Multi-stage machine polish, hand wax coat and deep interior cleaning for a showroom finish.",
    startingPrice: "₹2,499",
    duration: "3-5 hrs",
    warranty: "30 days",
    popular: false,
  },
  {
    name: "Engine Bay Cleaning",
    description: "Safe degreaser-based engine bay cleaning to remove grime, oil residue and dust buildup.",
    startingPrice: "₹999",
    duration: "1.5-2 hrs",
    warranty: "Satisfaction",
    popular: false,
  },
  {
    name: "Ceramic Coating",
    description: "Professional 9H ceramic coating for superior paint protection, gloss and hydrophobic effect.",
    startingPrice: "₹8,999",
    duration: "6-8 hrs",
    warranty: "1 year",
    popular: true,
  },
  {
    name: "Headlight Restoration",
    description: "Restore yellowed or hazy headlights to clear condition, improving night visibility and looks.",
    startingPrice: "₹599",
    duration: "1 hr",
    warranty: "30 days",
    popular: false,
  },
  {
    name: "Monthly Car Wash Subscription",
    description: "8 exterior washes per month at your location — the most economical way to keep your car clean.",
    startingPrice: "₹1,499/month",
    duration: "Flexible",
    warranty: "Monthly",
    popular: true,
  },
];

const whyChooseUs = [
  {
    icon: <Droplets className="w-7 h-7 text-blue-500" />,
    title: "Waterless Options Available",
    description: "Eco-friendly waterless wash available for water-scarce areas or apartment restrictions.",
  },
  {
    icon: <CheckCircle className="w-7 h-7 text-blue-500" />,
    title: "Trained Detailers",
    description: "All professionals are trained in paint-safe techniques to protect your vehicle's finish.",
  },
  {
    icon: <Sparkles className="w-7 h-7 text-blue-500" />,
    title: "Premium Products",
    description: "We use pH-neutral shampoos, microfibre cloths and brand-name detailing compounds only.",
  },
  {
    icon: <CalendarCheck className="w-7 h-7 text-blue-500" />,
    title: "Doorstep Convenience",
    description: "No driving to a service centre. We come to your home, office or parking lot.",
  },
];

const faqs = [
  {
    question: "How much water is used in a standard car wash?",
    answer:
      "Our standard wash uses approximately 15–20 litres of water per car, compared to 150+ litres at a traditional car wash. We also offer a waterless wash option that uses zero water — ideal for apartment complexes with restrictions or water-scarce areas.",
  },
  {
    question: "Is ceramic coating worth it for my car?",
    answer:
      "Ceramic coating provides a semi-permanent protective layer that repels water, dirt and UV rays while enhancing gloss. For cars parked outdoors or driven in harsh conditions, it significantly reduces maintenance effort and keeps the paint looking new for 1–3 years depending on the grade applied.",
  },
  {
    question: "How do I book the monthly subscription?",
    answer:
      "Select the Monthly Car Wash Subscription during booking and choose your preferred days of the week. We will assign a dedicated professional to your location. You can pause or cancel the subscription anytime with 48 hours' notice.",
  },
  {
    question: "Will the professional need access to electricity or water at my location?",
    answer:
      "For standard washes, a water source (tap or bucket) is helpful but not always mandatory. For detailing services, access to a power outlet may be required for machine polishers. If neither is available, let us know during booking and we will bring our own equipment.",
  },
  {
    question: "How long does ceramic coating last?",
    answer:
      "With our professional-grade 9H ceramic coating, you can expect protection lasting 12 months under normal conditions. The longevity depends on parking conditions, washing frequency and climate. We recommend a maintenance wash every 2 months to preserve the coating's hydrophobic properties.",
  },
];

export function CarCleaningPage({ onBack, onBookNow }: CarCleaningPageProps) {
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
          <span className="font-semibold text-gray-800">Car Cleaning & Detailing</span>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-5">
            <Car className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Car Cleaning & Detailing</h1>
          <p className="text-lg text-blue-50 max-w-2xl mx-auto">
            Professional car washing &amp; detailing at your doorstep — no need to visit a service centre
          </p>
          <Button
            onClick={onBookNow}
            className="mt-6 bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 py-2 rounded-full"
          >
            Book Now
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Our Services</h2>
        <p className="text-gray-500 mb-8">From a quick wash to a full detail — we have it covered</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.name} className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow relative">
              {service.popular && (
                <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-700 border-blue-200 text-xs font-semibold">
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
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  {service.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  {service.warranty}
                </span>
              </div>
              <Button
                onClick={onBookNow}
                className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
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
          <p className="text-gray-500 text-center mb-10">The most convenient car care experience in India</p>
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
        <p className="text-gray-500 text-center mb-8">Everything you need to know about our car care services</p>
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
          <Car className="w-10 h-10 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Keep Your Car Spotless</h2>
          <p className="text-blue-100 mb-7">
            Book a professional car wash or detailing service right at your doorstep.
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
