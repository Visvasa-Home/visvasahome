import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface FAQPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const faqSections = [
  {
    category: 'For Customers',
    color: 'blue',
    faqs: [
      {
        q: 'How do I book a service on VisvasaHome?',
        a: 'You can book through our website by clicking "Book Service", calling us at +91 905 7567 160, or messaging us on WhatsApp. Share your service requirement, location, and preferred timing. We confirm your booking within 30 minutes during business hours.',
      },
      {
        q: 'Are all service professionals verified?',
        a: 'Yes, absolutely. Every professional on the VisvasaHome platform goes through identity verification, background screening, and skill assessment before they are approved. We maintain ongoing quality monitoring through customer ratings and periodic audits.',
      },
      {
        q: 'How is the pricing determined?',
        a: 'Pricing is transparent and shared with you before any work begins. Standard service rates are communicated upfront. For customized work, the professional provides a detailed quote after an initial assessment. There are no hidden charges — ever.',
      },
      {
        q: 'What if I\'m not satisfied with the service?',
        a: 'Customer satisfaction is our priority. If a service is not completed to your satisfaction, contact us within 24 hours and we will send another professional to address the issue at no extra charge. Persistent issues are escalated to our quality team.',
      },
      {
        q: 'Is there a warranty on services?',
        a: 'Yes. Most services come with a workmanship warranty ranging from 7 to 30 days depending on the service type. If the same issue recurs within the warranty period, we revisit at no cost. Appliance repairs include 7–30 day service warranties.',
      },
      {
        q: 'Can I schedule services in advance?',
        a: 'Yes, you can schedule services up to 30 days in advance. We recommend booking at least 24–48 hours ahead for specialized services. Emergency bookings are available for urgent plumbing, electrical, or appliance failures.',
      },
      {
        q: 'What cities do you currently serve?',
        a: 'We operate in 20+ cities including Jaipur, Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad, Surat, Noida, Gurgaon, Lucknow, Chandigarh, Bhopal, Indore, and more. Contact us to confirm availability in your specific area.',
      },
      {
        q: 'Are materials and spare parts included in the service price?',
        a: 'Minor consumables (like fasteners, wire connectors, sealants) are generally included. Major components (like AC compressors, new fixtures, paint materials) are billed separately at transparent market rates — always with your approval before purchase.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept UPI payments, bank transfers, cash, and card payments. Payment is collected after the service is completed to your satisfaction, unless a deposit is required for large-scale projects (interior design, renovation, etc.).',
      },
      {
        q: 'Can I choose a specific professional?',
        a: 'For AMC customers and repeat bookings, we assign the same professional wherever possible to ensure consistency. For one-time bookings, you can request a specific professional if you\'ve worked with them before and they are available.',
      },
    ],
  },
  {
    category: 'About AMC Plans',
    color: 'indigo',
    faqs: [
      {
        q: 'What is an Annual Maintenance Contract (AMC)?',
        a: 'An AMC is a yearly service agreement that covers scheduled maintenance visits, priority service for breakdowns, and preventive checks for your home, office, or commercial space. It eliminates the hassle of finding contractors for each issue and provides budget-predictable maintenance.',
      },
      {
        q: 'What types of AMC plans are available?',
        a: 'We offer AMC plans for Homes (1BHK to villas), Offices, Commercial spaces, Industrial facilities, Healthcare institutions, Educational establishments, Hospitality properties, and Residential Societies. Each plan has Basic, Premium, and Elite tiers with different coverage levels.',
      },
      {
        q: 'Can I upgrade my AMC plan during the year?',
        a: 'Yes, you can upgrade your AMC plan at any time by paying the pro-rated difference. Plan downgrades are processed at the next annual renewal date.',
      },
      {
        q: 'How are AMC service visits scheduled?',
        a: 'After signing an AMC contract, your dedicated service coordinator contacts you to schedule all annual visits at your preferred dates and times. For urgent issues, priority support is available based on your plan tier — typically 24–48 hour response.',
      },
      {
        q: 'Are AMC plans available for multiple properties?',
        a: 'Yes. Corporate and multi-property AMC plans are available for businesses with multiple locations. Contact our team for customized multi-property pricing and consolidated management solutions.',
      },
    ],
  },
  {
    category: 'For Professionals & Contractors',
    color: 'green',
    faqs: [
      {
        q: 'How do I register as a professional on VisvasaHome?',
        a: 'Click "Register as Contractor" on our website, fill in your professional profile, upload your credentials and ID documents, and submit your application. Our team reviews applications within 3–5 business days and contacts you for the next steps.',
      },
      {
        q: 'Is there a registration fee?',
        a: 'Registration is free. VisvasaHome operates on a commission model — you only pay a small percentage of each completed job. There are no upfront fees, monthly subscriptions, or registration charges.',
      },
      {
        q: 'What verification documents are required?',
        a: 'You\'ll need a government-issued photo ID (Aadhaar, PAN, or Passport), proof of skill or certification where applicable (for electricians, plumbers, etc.), a selfie for identity verification, and bank account details for payment. References from previous clients are helpful but optional.',
      },
      {
        q: 'Can I set my own availability and service area?',
        a: 'Yes. You control your availability calendar, preferred working hours, and service radius. Job requests are only sent to you when you are marked as available and the job location is within your service area.',
      },
      {
        q: 'How and when are payments made to professionals?',
        a: 'Payments are processed within 2–3 business days after a job is completed and the customer confirms satisfaction. Payments are made directly to your registered bank account via bank transfer or UPI.',
      },
      {
        q: 'What support does VisvasaHome provide to professionals?',
        a: 'We provide onboarding training, digital tools for job management, a dedicated support number for professionals, quality improvement feedback, skill development resources, and priority job allocation for high-rated professionals.',
      },
    ],
  },
  {
    category: 'Safety & Quality',
    color: 'red',
    faqs: [
      {
        q: 'How does VisvasaHome ensure professional safety standards?',
        a: 'All professionals are trained on safety protocols relevant to their trade. Electricians must hold relevant certifications, pest control operators use approved chemicals, and all professionals carry identification. We have a zero-tolerance policy for unsafe practices.',
      },
      {
        q: 'What should I do if a professional asks for payment outside the platform?',
        a: 'Please do not make off-platform payments. All payments go through VisvasaHome\'s verified channels. If a professional requests cash or unauthorized payment, report it to us immediately via WhatsApp or phone. This protects you from fraud and ensures accountability.',
      },
      {
        q: 'Is my personal information secure?',
        a: 'Yes. VisvasaHome collects only the information necessary to facilitate service bookings. Your personal data is not shared with third parties for marketing purposes. All data is stored securely and used only for service delivery and communication.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white border-t border-gray-100">
          <p className="text-gray-600 leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export function FAQPage({ onBack, onNavigate }: FAQPageProps) {
  const [search, setSearch] = useState('');
  const [activeSection, setActiveSection] = useState('All');

  const allFaqs = faqSections.flatMap((s) => s.faqs.map((f) => ({ ...f, category: s.category })));
  const filtered = search.trim()
    ? allFaqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : [];

  const sections = ['All', ...faqSections.map((s) => s.category)];

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
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold text-white mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100 mb-8">
              Clear answers to the most common questions about booking services, AMC plans, contractor registration, and how VisvasaHome works.
            </p>
            {/* Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your question..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 bg-white border-0 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {search.trim() && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {filtered.length > 0 ? `${filtered.length} result(s) for "${search}"` : `No results for "${search}"`}
            </h2>
            <div className="space-y-3">
              {filtered.map((f, idx) => (
                <FAQItem key={idx} q={f.q} a={f.a} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Can't find your answer? Contact us directly.</p>
                <button onClick={() => onNavigate('contact')} className="px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors">
                  Contact Us
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Category Tabs */}
      {!search.trim() && (
        <section className="py-8 bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSection(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === s ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Sections */}
      {!search.trim() && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {faqSections
              .filter((s) => activeSection === 'All' || s.category === activeSection)
              .map((section, sIdx) => (
                <div key={sIdx} className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-[#2563EB] rounded-full" />
                    <h2 className="text-2xl font-semibold text-gray-900">{section.category}</h2>
                  </div>
                  <div className="space-y-3">
                    {section.faqs.map((faq, fIdx) => (
                      <FAQItem key={fIdx} q={faq.q} a={faq.a} />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Still Need Help */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-2xl p-10 text-white text-center">
            <h2 className="text-2xl font-semibold mb-3">Still Have Questions?</h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">Our team is here to help. Reach out via WhatsApp, phone, or email and we'll get back to you quickly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/919057567160"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors font-medium inline-flex items-center gap-2 justify-center"
              >
                WhatsApp Us
              </a>
              <button onClick={() => onNavigate('contact')} className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors">
                Contact Form
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}
