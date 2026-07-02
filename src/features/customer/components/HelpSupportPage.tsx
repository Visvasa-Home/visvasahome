import { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, Mail, ChevronDown, ChevronUp, Clock, Shield, Star, Wrench } from 'lucide-react';

interface HelpSupportPageProps {
  onBack: () => void;
  onNavigate: (page: string, data?: any) => void;
}

const faqs = [
  {
    q: 'How do I book a service on VisvasaHome?',
    a: 'Tap "Book a Service", choose your service category, fill in your address and preferred date/time, and confirm. Our team assigns a verified professional within 2 hours.',
  },
  {
    q: 'Are the professionals verified?',
    a: 'Yes. Every professional on VisvasaHome goes through identity verification, skill assessment, and background screening before being onboarded.',
  },
  {
    q: 'What is the cancellation policy?',
    a: 'You can cancel up to 2 hours before the scheduled service at no charge. Cancellations within 2 hours may attract a ₹100 convenience fee.',
  },
  {
    q: 'How does AMC (Annual Maintenance Contract) work?',
    a: 'AMC plans cover scheduled maintenance visits throughout the year. You pay once annually and we schedule regular visits with priority support included.',
  },
  {
    q: 'Is there a service warranty?',
    a: 'Yes. All completed services come with a 7-day workmanship warranty. If the issue recurs, we send a professional at no extra cost.',
  },
  {
    q: 'How do I pay for services?',
    a: 'Payments can be made in cash at the time of service, or digitally via UPI/online transfer. You will receive an invoice via WhatsApp.',
  },
  {
    q: 'How do I track my booking?',
    a: 'Go to "My Bookings" from your profile. You will see real-time status: Confirmed → Assigned → En Route → In Progress → Completed.',
  },
  {
    q: 'Can I request a specific professional?',
    a: 'Yes. If you have worked with a professional before, mention their name in the additional notes while booking and we will try to assign them.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-gray-100 last:border-0 transition-colors ${open ? 'bg-blue-50/40' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-4 text-left"
      >
        <span className="text-sm font-semibold text-gray-900 leading-snug flex-1">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#2563EB] shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export function HelpSupportPage({ onBack, onNavigate }: HelpSupportPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-12 pb-8 lg:pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl font-bold">Help & Support</h1>
              <p className="text-blue-100 text-xs">We are here for you</p>
            </div>
          </div>

          {/* Hours Banner */}
          <div className="bg-white/15 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Support Hours</p>
              <p className="text-blue-100 text-xs">Monday – Sunday, 8:00 AM – 8:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-5">
        {/* Contact Options */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">Reach Us</p>
          <div className="grid grid-cols-3 gap-3">
            <a
              href="tel:+919057567160"
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#2563EB]" />
              </div>
              <span className="text-xs font-semibold text-gray-900">Call Us</span>
              <span className="text-xs text-gray-500 leading-tight">Instant support</span>
            </a>
            <a
              href="https://wa.me/919057567160?text=Hello%2C%20I%20need%20support%20from%20VisvasaHome"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-gray-900">WhatsApp</span>
              <span className="text-xs text-gray-500 leading-tight">Fastest reply</span>
            </a>
            <a
              href="mailto:support@visvasahome.com"
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-gray-900">Email</span>
              <span className="text-xs text-gray-500 leading-tight">24hr response</span>
            </a>
          </div>
        </div>

        {/* Quick Help Links */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">Quick Help</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Wrench, label: 'Track My Booking', color: 'bg-blue-100 text-blue-600', action: 'bookings' },
              { icon: Star, label: 'Rate a Service', color: 'bg-yellow-100 text-yellow-600', action: 'bookings' },
              { icon: Shield, label: 'Report an Issue', color: 'bg-red-100 text-red-600', action: 'chat' },
              { icon: MessageCircle, label: 'Full FAQ', color: 'bg-blue-100 text-[#2563EB]', action: 'faq' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.action, item.action === 'chat' ? { isSupport: true } : undefined)}
                className="flex items-center gap-3 p-3.5 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-xs font-semibold text-gray-900 leading-snug">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">Frequently Asked Questions</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-[#2563EB] rounded-2xl p-5 text-center">
          <p className="text-white font-bold mb-1">Need urgent help?</p>
          <p className="text-blue-100 text-xs mb-3">Call our support line directly</p>
          <a
            href="tel:+919057567160"
            className="inline-block bg-white text-[#2563EB] font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            +91 90575 67160
          </a>
        </div>
      </div>
    </div>
  );
}
