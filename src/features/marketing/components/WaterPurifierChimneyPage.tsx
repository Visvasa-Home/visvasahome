import { ArrowLeft, Shield, Star, Clock, CheckCircle, Droplets, Wind, Flame } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shared/ui/accordion';
import { Badge } from '@shared/ui/badge';

interface WaterPurifierChimneyPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

const services = [
  {
    id: 1,
    name: 'RO Water Purifier Installation',
    description: 'Wall mounting, inlet connection to tap or main pipeline, drain line setup and full purifier testing.',
    startingPrice: 499,
    duration: '1–2 hrs',
    warranty: '30 days',
    popular: true,
  },
  {
    id: 2,
    name: 'RO Servicing & Filter Change',
    description: 'Sediment, carbon and membrane filter replacement, UV lamp swap, sanitisation and flow-rate check.',
    startingPrice: 699,
    duration: '1–2 hrs',
    warranty: '30 days',
    popular: true,
  },
  {
    id: 3,
    name: 'RO Repair',
    description: 'Low water pressure, no output, bad taste or odour — root cause diagnosis and on-site repair.',
    startingPrice: 399,
    duration: '1 hr',
    warranty: '15 days',
    popular: false,
  },
  {
    id: 4,
    name: 'Water Softener Installation & Servicing',
    description: 'Hard-water softener unit installation, resin media check, brine tank setup and annual servicing.',
    startingPrice: 1499,
    duration: '2–3 hrs',
    warranty: '30 days',
    popular: false,
  },
  {
    id: 5,
    name: 'Chimney Deep Cleaning',
    description: 'Complete degreasing of baffle/mesh filters, blower fan, grease trap and internal duct using professional degreasers.',
    startingPrice: 599,
    duration: '1–2 hrs',
    warranty: '30 days',
    popular: true,
  },
  {
    id: 6,
    name: 'Chimney Repair',
    description: 'Weak suction, noisy motor, auto-clean not working, LED strip faults — diagnosed and repaired.',
    startingPrice: 449,
    duration: '1 hr',
    warranty: '15 days',
    popular: false,
  },
  {
    id: 7,
    name: 'Gas Hob / Cooktop Cleaning & Repair',
    description: 'Burner jet cleaning, ignition repair, brass burner replacement, and pan-support refitting.',
    startingPrice: 399,
    duration: '45–60 min',
    warranty: '15 days',
    popular: true,
  },
  {
    id: 8,
    name: 'Chimney + Hob Combo Service',
    description: 'Deep chimney clean combined with full hob service at a bundled discount — best value kitchen care.',
    startingPrice: 849,
    duration: '2–3 hrs',
    warranty: '30 days',
    popular: true,
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: 'Background Verified',
    description: 'All technicians are police-verified and skill-tested before joining VisvasaHome.',
  },
  {
    icon: Star,
    title: '4.8-Star Rated',
    description: 'Trusted by thousands of households for kitchen and water appliance care.',
  },
  {
    icon: Clock,
    title: 'Flexible Slots',
    description: 'Morning, afternoon and evening appointments available 7 days a week.',
  },
  {
    icon: CheckCircle,
    title: 'Service Warranty',
    description: 'Every job is backed by a written warranty — no fix, no fee within the period.',
  },
];

const faqs = [
  {
    question: 'Which RO brands do you service and repair?',
    answer:
      'We service all major brands including Kent, Aquaguard, Pureit, LG, Havells, Livpure, AO Smith, and Blue Star. If your brand is not listed, contact us and we will confirm availability.',
  },
  {
    question: 'How often should I service my RO water purifier?',
    answer:
      'We recommend servicing every 6–12 months depending on water quality and daily usage. Regular filter changes maintain water purity and extend the life of the membrane.',
  },
  {
    question: 'Do you bring cleaning materials for chimney deep cleaning?',
    answer:
      'Yes, our technicians carry all required degreasers, cleaning agents and tools. You do not need to arrange anything — just ensure the chimney power is accessible.',
  },
  {
    question: 'What is included in the Chimney + Hob Combo Service?',
    answer:
      'The combo covers a complete chimney deep clean (filters, blower, grease trap) and a full hob service (burner cleaning, ignition check, jet clearing). It is priced at a discount versus booking both separately.',
  },
  {
    question: 'Is the repair warranty covered even if I use the appliance daily?',
    answer:
      'Yes. The warranty covers the specific repair carried out by our technician for the stated period regardless of normal daily usage. Damage due to misuse or unrelated components is not covered.',
  },
];

export function WaterPurifierChimneyPage({ onBack, onBookNow }: WaterPurifierChimneyPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Droplets className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Water Purifier &amp; Chimney Services</h1>
              <p className="text-lg text-white/90 mt-1">
                Clean water and a spotless kitchen — expert RO, chimney &amp; hob care
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>4.8 (2.1K reviews)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
              <Clock className="w-4 h-4" />
              <span>Same-day slots available</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
              <Shield className="w-4 h-4" />
              <span>Verified professionals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Services</h2>
          <p className="text-gray-600">Choose a service and book instantly at transparent prices</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col"
            >
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1">
                    {service.name}
                  </h3>
                  {service.popular && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-xs font-semibold shrink-0">
                      Popular
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 flex-1">{service.description}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span>{service.warranty} warranty</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-xs text-gray-400 block">Starting at</span>
                    <span className="text-2xl font-bold text-gray-900">₹{service.startingPrice}</span>
                  </div>
                  <Button
                    onClick={onBookNow}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-5"
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Why Choose VisvasaHome?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="bg-white rounded-xl border border-gray-200 px-6 data-[state=open]:border-blue-200"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-sm pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 text-center">
          <Wind className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-3">Book Your Kitchen Service Today</h2>
          <p className="text-xl text-white/90 mb-8">
            Pure water and a clean kitchen — one tap away
          </p>
          <Button
            onClick={onBookNow}
            size="lg"
            className="bg-white text-[#2563EB] hover:bg-gray-100 font-bold text-lg px-10 py-6 rounded-xl"
          >
            Book Service Now
          </Button>
        </div>
      </div>
    </div>
  );
}
