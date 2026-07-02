import { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Phone, Mail, MessageCircle, BookOpen, Shield, CreditCard, Calendar, Star, Wrench, HelpCircle, ArrowLeft } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface HelpCenterPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const categories = [
  {
    id: 'bookings',
    icon: Calendar,
    title: 'Bookings & Scheduling',
    color: 'bg-blue-50 text-[#2563EB]',
    articles: [
      'How to book a service',
      'How to reschedule or cancel a booking',
      'What happens after I book?',
      'Can I book same-day services?',
      'How do I track my service professional?',
      'What is the OTP-based service confirmation?',
    ],
  },
  {
    id: 'payments',
    icon: CreditCard,
    title: 'Payments & Pricing',
    color: 'bg-green-50 text-green-600',
    articles: [
      'What payment methods are accepted?',
      'How are service prices determined?',
      'When am I charged for a booking?',
      'How do I get a refund?',
      'What is the VisvasaHome wallet?',
      'Are there any hidden charges?',
    ],
  },
  {
    id: 'professionals',
    icon: Star,
    title: 'Service Professionals',
    color: 'bg-yellow-50 text-yellow-600',
    articles: [
      'How are professionals verified?',
      'Can I request a specific professional?',
      'How do I rate my service experience?',
      'What if the professional doesn\'t show up?',
      'How do professionals maintain quality standards?',
    ],
  },
  {
    id: 'amc',
    icon: Shield,
    title: 'AMC & Subscriptions',
    color: 'bg-blue-50 text-[#2563EB]',
    articles: [
      'What is an AMC plan?',
      'Which AMC plan is right for me?',
      'How do I schedule AMC visits?',
      'Can I pause or cancel my AMC subscription?',
      'What services are included in AMC?',
      'How is AMC pricing calculated?',
    ],
  },
  {
    id: 'account',
    icon: BookOpen,
    title: 'Account & Profile',
    color: 'bg-purple-50 text-purple-600',
    articles: [
      'How do I create an account?',
      'How do I update my address?',
      'How do I change my phone number?',
      'How do I delete my account?',
      'How do I manage notifications?',
    ],
  },
  {
    id: 'quality',
    icon: Wrench,
    title: 'Service Quality & Warranty',
    color: 'bg-red-50 text-red-600',
    articles: [
      'What is the VisvasaHome service warranty?',
      'How do I raise a quality complaint?',
      'What happens if I\'m not satisfied?',
      'How long does warranty coverage last?',
    ],
  },
];

const popularQuestions = [
  {
    q: 'How do I book a service on VisvasaHome?',
    a: 'Booking is simple: Choose your service category, select the specific service you need, pick a date and time slot, confirm your address, and complete payment. You\'ll receive a booking confirmation with the professional\'s details.',
  },
  {
    q: 'Are all professionals verified?',
    a: 'Yes. Every professional on VisvasaHome goes through a multi-step verification process including background checks, skill assessment, identity verification, and training. Only verified professionals are listed on the platform.',
  },
  {
    q: 'What if I need to cancel my booking?',
    a: 'You can cancel your booking up to 2 hours before the scheduled time for a full refund. Cancellations within 2 hours may attract a small cancellation fee. Go to My Bookings → select the booking → Cancel.',
  },
  {
    q: 'How does the service warranty work?',
    a: 'VisvasaHome provides a service warranty on most categories. If you\'re not satisfied with the work quality within the warranty period (typically 7-30 days depending on service type), we\'ll send a professional back at no extra cost.',
  },
  {
    q: 'What is the OTP confirmation process?',
    a: 'When the professional arrives, you\'ll share an OTP from the app to confirm their arrival. Once the job is complete, the professional marks it done and you rate the experience. This ensures accountability and proper service tracking.',
  },
  {
    q: 'How do I get a refund?',
    a: 'Refunds are processed within 5-7 business days to your original payment method. For wallet refunds, it\'s instant. Raise a refund request from My Bookings or contact support.',
  },
];

export function HelpCenterPage({ onBack, onNavigate }: HelpCenterPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = popularQuestions.filter(
    (faq) =>
      !searchQuery ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Header
        onRegisterContractor={() => onNavigate('register-contractor')}
        onBookService={() => onNavigate('get-started-customer')}
        selectedLocation={null}
        onLocationSelect={() => {}}
        onAMCOffice={() => onNavigate('amc-office')}
        onAMCHome={() => onNavigate('amc-home')}
        onAMCCommercial={() => onNavigate('amc-commercial')}
        onAMCIndustrial={() => onNavigate('amc-industrial')}
        onAMCHealthcare={() => onNavigate('amc-healthcare')}
        onAMCEducational={() => onNavigate('amc-educational')}
        onAMCHospitality={() => onNavigate('amc-hospitality')}
        onAMCSociety={() => onNavigate('amc-society')}
        onHome={onBack}
        onNavigate={onNavigate}
      />

      {/* Hero */}
      <section className="bg-[#2563EB] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <HelpCircle className="w-14 h-14 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl sm:text-5xl mb-4" style={{ fontWeight: 700 }}>How can we help you?</h1>
          <p className="text-lg text-white/80 mb-8">Find answers to your questions or contact our support team</p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-8 text-center" style={{ fontWeight: 700 }}>Browse by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color}`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 mb-3" style={{ fontWeight: 600 }}>{cat.title}</h3>
                <ul className="space-y-1.5">
                  {cat.articles.slice(0, 4).map((article) => (
                    <li key={article} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#2563EB] cursor-pointer transition-colors">
                      <ChevronRight className="w-3 h-3 flex-shrink-0" />
                      {article}
                    </li>
                  ))}
                  {cat.articles.length > 4 && (
                    <li className="text-sm text-[#2563EB] cursor-pointer" style={{ fontWeight: 500 }}>
                      +{cat.articles.length - 4} more articles
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>Frequently Asked Questions</h2>
          <p className="text-gray-500 text-center mb-8">Quick answers to the most common questions</p>
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-800" style={{ fontWeight: 500 }}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                    <p className="pt-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="text-center text-gray-500 py-8">No results found for "{searchQuery}". Try different keywords or contact support.</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>Still need help?</h2>
          <p className="text-gray-500 mb-10">Our support team is available 7 days a week, 8 AM – 10 PM IST</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <a href="tel:+919057567160" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                <Phone className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontWeight: 600 }}>Call Us</p>
                <p className="text-sm text-gray-500">+91 905 7567 160</p>
                <p className="text-xs text-gray-400 mt-1">8 AM – 10 PM IST</p>
              </div>
            </a>
            <a href="https://wa.me/919057567160" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontWeight: 600 }}>WhatsApp</p>
                <p className="text-sm text-gray-500">Chat with us</p>
                <p className="text-xs text-gray-400 mt-1">Typically replies in minutes</p>
              </div>
            </a>
            <a href="mailto:support@visvasahome.com" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col items-center gap-3 group">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                <Mail className="w-6 h-6 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontWeight: 600 }}>Email Support</p>
                <p className="text-sm text-gray-500">support@visvasahome.com</p>
                <p className="text-xs text-gray-400 mt-1">Response within 4 hours</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} onRegisterContractor={() => onNavigate('register-contractor')} />
    </div>
  );
}
