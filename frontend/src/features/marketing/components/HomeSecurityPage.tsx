import { ArrowLeft, Shield, Star, Clock, CheckCircle, Camera, Lock, Zap, Bell } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@shared/ui/accordion';
import { Badge } from '@shared/ui/badge';

interface HomeSecurityPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

const services = [
  {
    id: 1,
    name: 'CCTV Installation & Setup',
    description: 'Indoor/outdoor cameras, DVR/NVR setup, complete cable routing and configuration for full home coverage.',
    startingPrice: 2499,
    duration: '3–4 hrs',
    warranty: '90 days',
    popular: true,
  },
  {
    id: 2,
    name: 'CCTV Maintenance & Repair',
    description: 'Camera not working, blurry footage, cable faults, DVR/NVR issues — diagnosed and fixed on-site.',
    startingPrice: 499,
    duration: '1–2 hrs',
    warranty: '30 days',
    popular: true,
  },
  {
    id: 3,
    name: 'Smart Lock Installation',
    description: 'Professional installation of digital and biometric door locks with setup, programming and handover.',
    startingPrice: 1499,
    duration: '1–2 hrs',
    warranty: '30 days',
    popular: true,
  },
  {
    id: 4,
    name: 'Smart Lock Repair & Battery Replacement',
    description: 'Fix unresponsive locks, fingerprint sensor issues, keypad faults, and battery swap for all brands.',
    startingPrice: 349,
    duration: '45–60 min',
    warranty: '15 days',
    popular: false,
  },
  {
    id: 5,
    name: 'Inverter/UPS Installation',
    description: 'Home inverter setup, battery bank connections, wiring and load balancing for uninterrupted power.',
    startingPrice: 999,
    duration: '1–2 hrs',
    warranty: '30 days',
    popular: true,
  },
  {
    id: 6,
    name: 'Inverter Battery Replacement & Checkup',
    description: 'Battery health check, electrolyte top-up, terminal cleaning, and old battery swap with disposal.',
    startingPrice: 499,
    duration: '1 hr',
    warranty: '15 days',
    popular: false,
  },
  {
    id: 7,
    name: 'Video Door Bell Installation',
    description: 'Wired or Wi-Fi video doorbell fitting, app pairing, motion zone setup and live-view testing.',
    startingPrice: 799,
    duration: '1 hr',
    warranty: '30 days',
    popular: false,
  },
  {
    id: 8,
    name: 'Home Alarm System Installation',
    description: 'Full perimeter alarm with door/window sensors, siren, control panel wiring and siren testing.',
    startingPrice: 3499,
    duration: '3–5 hrs',
    warranty: '90 days',
    popular: false,
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: 'Background Verified',
    description: 'Every technician passes police verification and skills assessment before onboarding.',
  },
  {
    icon: Star,
    title: '4.8-Star Rated',
    description: 'Consistently top-rated by thousands of happy VisvasaHome customers.',
  },
  {
    icon: Clock,
    title: 'On-Time Arrival',
    description: 'We respect your schedule — punctual arrival with prior notification.',
  },
  {
    icon: CheckCircle,
    title: 'Service Warranty',
    description: 'All installations and repairs come with a written service warranty.',
  },
];

const faqs = [
  {
    question: 'Do you supply CCTV cameras and equipment, or do I need to buy them?',
    answer:
      'We offer both options. Our technicians can supply and install cameras from leading brands, or install equipment you have already purchased. Prices shown are for labour; material costs are quoted separately when we supply hardware.',
  },
  {
    question: 'Which brands of smart locks and security systems do you support?',
    answer:
      'We work with all major brands including CP Plus, Hikvision, Dahua, Yale, Godrej, Samsung, Qubo, and Xiaomi. If you have a brand not listed, contact us and we will confirm availability.',
  },
  {
    question: 'Is my inverter covered under the service warranty?',
    answer:
      'The warranty covers the workmanship and connections made by our technician. Battery and inverter manufacturer warranties are separate and remain with the respective brand.',
  },
  {
    question: 'How long does CCTV installation take for a 2BHK home?',
    answer:
      'A standard 4-camera setup with DVR for a 2BHK typically takes 3–4 hours. Larger homes or additional cameras may require more time, which will be confirmed at the time of booking.',
  },
  {
    question: 'What if the security system stops working after the service?',
    answer:
      'Any issue related to our work within the warranty period is fixed at no extra charge. Simply raise a re-service request via the app or call our support line and we will send a technician at the earliest slot.',
  },
];

export function HomeSecurityPage({ onBack, onBookNow }: HomeSecurityPageProps) {
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
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Home Security Services</h1>
              <p className="text-lg text-white/90 mt-1">
                Protect what matters most — CCTV, smart locks, alarms &amp; inverters
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
              <Star className="w-4 h-4 text-blue-400 fill-yellow-400" />
              <span>4.8 (1.9K reviews)</span>
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
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs font-semibold shrink-0">
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
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-3">Secure Your Home Today</h2>
          <p className="text-xl text-white/90 mb-8">
            Book a verified security expert and get same-day service
          </p>
          <Button
            onClick={onBookNow}
            size="lg"
            className="bg-white text-[#2563EB] hover:bg-gray-100 font-bold text-lg px-10 py-6 rounded-xl"
          >
            Book Security Service
          </Button>
        </div>
      </div>
    </div>
  );
}
