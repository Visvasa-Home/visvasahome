import { ArrowLeft, Target, Users, Shield, TrendingUp, Award, Heart, CheckCircle, Linkedin, Quote, MapPin, Calendar } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';
import founderPhoto from '@/imports/PHOTO.jpeg';

interface AboutUsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const milestones = [
  { year: '2022', title: 'Foundation', desc: 'VisvasaHome founded by Kunal Mittal in Jaipur with a mission to organize and professionalize local services.' },
  { year: '2023', title: 'First 100 Professionals', desc: 'Onboarded 100+ verified contractors across Jaipur. Introduced structured verification and quality standards.' },
  { year: '2024', title: 'Multi-City Expansion', desc: 'Expanded to 10+ cities across Rajasthan and beyond. Launched AMC plans for homes, offices, and commercial spaces.' },
  { year: '2025', title: '10,000+ Services', desc: 'Surpassed 10,000 completed services with a 4.8/5 customer rating. Now active in 20+ cities across India.' },
];

const teamValues = [
  { icon: Target, title: 'Trust', description: 'Built through verification, consistency, and accountability in every service interaction' },
  { icon: Users, title: 'Transparency', description: 'Clear pricing, defined scope, and honest communication at every step' },
  { icon: Shield, title: 'Quality', description: 'Structured service standards and continuous monitoring ensure excellence' },
  { icon: TrendingUp, title: 'Empowerment', description: 'Supporting and strengthening local professionals to build sustainable careers' },
];

const stats = [
  { value: '10,000+', label: 'Services Completed' },
  { value: '20+', label: 'Cities Served' },
  { value: '500+', label: 'Verified Professionals' },
  { value: '4.8/5', label: 'Customer Rating' },
  { value: '8', label: 'AMC Plan Categories' },
  { value: '20+', label: 'Service Categories' },
];

export function AboutUsPage({ onBack, onNavigate }: AboutUsPageProps) {
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

      {/* Legal Operator Notice */}
      <div className="bg-gray-950 text-gray-300 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
          This website is operated by <strong className="text-white">Visvasahome Private Limited</strong>, a B2C technology company registered in India | Jaipur, Rajasthan — 302001
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>

          <div className="max-w-4xl">
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <span className="text-sm">Our Story &amp; Identity</span>
            </div>
            <h1 className="text-4xl font-semibold text-white mb-6">About VisvasaHome</h1>
            <p className="text-xl text-blue-50 leading-relaxed max-w-3xl">
              <strong>Visvasahome Private Limited</strong> is a B2C technology platform that connects households and businesses with verified local service professionals across India. We operate across three service pillars: Home Services, Annual Maintenance Contracts (AMC), and Construction &amp; Contracting.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-[#2563EB] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#2563EB] rounded-full mb-6">
                <span className="text-sm font-medium">Our Origin</span>
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-700 mb-5 leading-relaxed">
                VisvasaHome was founded in 2022 by <strong>Kunal Mittal</strong> in Jaipur, Rajasthan. Kunal observed a critical gap in local services: skilled professionals existed in abundance, but customers had no reliable way to find them, verify them, or hold them accountable.
              </p>
              <p className="text-gray-700 mb-5 leading-relaxed">
                The traditional model relied on word-of-mouth, unverified listings, and luck. Disputes were common, quality was inconsistent, and skilled workers were underpaid while customers overpaid. There was no structure, no accountability, and no trust.
              </p>
              <p className="text-gray-700 leading-relaxed">
                VisvasaHome was built to change that — creating a platform that brings organization, verification, transparency, and accountability to the local services ecosystem. Not just a marketplace, but a complete service ecosystem built on trust.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-2xl p-8 border border-blue-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Verified Professionals</h4>
                    <p className="text-sm text-gray-600">
                      Every service provider undergoes thorough identity verification and background checks before joining the network.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Quality Assurance</h4>
                    <p className="text-sm text-gray-600">
                      Structured service standards, documented visits, and continuous monitoring ensure consistent excellence.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Community First</h4>
                    <p className="text-sm text-gray-600">
                      Supporting local professionals and strengthening community bonds — not just facilitating transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full mb-4">
              <span className="text-sm font-medium">Leadership</span>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Meet Our Founder</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {/* Photo / Initials Block */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] p-12 flex flex-col items-center justify-center text-white">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white/30 shadow-xl">
                    <img
                      src={founderPhoto}
                      alt="Kunal Mittal - Founder & CEO, VisvasaHome"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-1">Kunal Mittal</h3>
                  <p className="text-blue-200 text-sm mb-4">Founder &amp; CEO, VisvasaHome</p>
                  <div className="flex items-center gap-2 text-blue-200 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    Jaipur, Rajasthan, India
                  </div>
                  <div className="flex items-center gap-2 text-blue-200 text-sm mb-6">
                    <Calendar className="w-4 h-4" />
                    Founded VisvasaHome in 2022
                  </div>
                  <a
                    href="https://www.linkedin.com/company/110911374/admin/dashboard/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>

                {/* Content */}
                <div className="lg:col-span-3 p-10">
                  <div className="relative mb-6">
                    <Quote className="w-10 h-10 text-blue-100 absolute -top-2 -left-2" />
                    <blockquote className="pl-8 text-gray-700 leading-relaxed italic">
                      "Local services in India have always been driven by trust — trust built face to face, through community networks, and over years of relationships. VisvasaHome exists to digitize that trust: to take what was informal, unorganized, and unreliable, and give it the structure, accountability, and dignity it deserves."
                    </blockquote>
                  </div>

                  <div className="space-y-4 text-gray-700">
                    <p className="leading-relaxed">
                      Kunal Mittal founded VisvasaHome after recognizing that the local services industry — one of India's largest employment sectors — lacked the trust infrastructure that customers and professionals both desperately needed.
                    </p>
                    <p className="leading-relaxed">
                      With a vision rooted in community empowerment, Kunal built VisvasaHome not as a typical gig platform, but as a trust ecosystem — one where professionals are treated as partners, customers are protected by accountability, and quality is non-negotiable.
                    </p>
                    <p className="leading-relaxed">
                      Under his leadership, VisvasaHome has grown from a Jaipur-based startup to a multi-city platform serving 20+ cities across India, with 500+ verified professionals and 10,000+ completed services.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#2563EB]">2022</div>
                      <div className="text-xs text-gray-500">Founded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#2563EB]">20+</div>
                      <div className="text-xs text-gray-500">Cities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#2563EB]">500+</div>
                      <div className="text-xs text-gray-500">Professionals</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">From a single city to a growing national platform — built step by step on trust, accountability, and community.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-100 transform -translate-x-1/2" />
            <div className="space-y-10">
              {milestones.map((m, idx) => (
                <div key={idx} className={`flex flex-col md:flex-row gap-8 items-center ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 md:max-w-sm">
                    <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-xl p-6 border border-blue-100">
                      <div className="text-[#2563EB] font-bold mb-2">{m.year}</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{m.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-[#2563EB] items-center justify-center flex-shrink-0 z-10 shadow-lg">
                    <span className="text-white font-bold text-sm">{m.year.slice(2)}</span>
                  </div>
                  <div className="flex-1 md:max-w-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make and every interaction we facilitate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamValues.map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow border border-gray-100">
                <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-[#2563EB]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantage CTA */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-6">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium">Competitive Advantage</span>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Why Choose VisvasaHome?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              See how we compare with Urban Company, Housejoy, and other platforms. Our 8 specialized AMC segments and trust-first approach set us apart.
            </p>
            <button
              onClick={() => onNavigate('competitive-analysis')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-medium"
            >
              View Detailed Comparison
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Line of Business & Legal Info ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Our Line of Business</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">Legal and operational overview of Visvasahome Private Limited</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                title: 'Legal Entity',
                content: 'Visvasahome Private Limited — registered as a Private Limited Company in India under the Companies Act, 2013.',
                icon: '🏢'
              },
              {
                title: 'Business Type',
                content: 'B2C Technology Platform — an online aggregator and marketplace connecting customers with verified local service professionals.',
                icon: '💻'
              },
              {
                title: 'Industry',
                content: 'Home Services, Facility Management, Annual Maintenance Contracts (AMC), and Construction & Renovation.',
                icon: '🏠'
              },
              {
                title: 'Services Offered',
                content: '3 pillars: (1) Home Services — on-demand repairs, cleaning, AC, plumbing, electrical; (2) AMC Plans — annual maintenance for homes, offices, commercial, industrial, healthcare, and hospitality; (3) Construction & Contracting — renovation, painting, masonry, interior design, flooring.',
                icon: '🛠️'
              },
              {
                title: 'Revenue Model',
                content: 'Platform commission on each completed service booking. Subscription revenue from AMC annual plans. Project management fees on large construction contracts.',
                icon: '💰'
              },
              {
                title: 'Registered Office',
                content: 'Visvasahome Private Limited, Jaipur, Rajasthan, India — 302001. Email: contact@visvasahome.com | Phone: +91 905 7567 160',
                icon: '📍'
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>

          {/* Payment Gateway Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              💳 Why We Use a Payment Gateway
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              VisvasaHome collects payments online from customers for services booked on our platform. To ensure <strong>security, fraud prevention, and regulatory compliance</strong>, we integrate with a PCI-DSS certified payment gateway (Razorpay). Here is how we use it:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Secure Payment Collection', desc: 'We accept UPI, Debit Cards, Credit Cards, Net Banking, and EMI. All payments are encrypted using 256-bit SSL.' },
                { title: 'No Card Data on Our Servers', desc: 'VisvasaHome never stores your card number, CVV, or bank credentials. All sensitive data is handled by Razorpay.' },
                { title: 'Escrow for Large Projects', desc: 'For construction and renovation projects, customer payments are held in escrow and released to professionals only upon milestone completion.' },
                { title: 'Instant Refunds', desc: 'Refunds for cancellations and failed services are processed back to the original payment instrument within 5–7 business days.' },
                { title: 'AMC Subscriptions', desc: 'Annual Maintenance Contract plans are processed as one-time or recurring payments as per the customer\'s chosen plan.' },
                { title: 'GST Compliant Invoicing', desc: 'Every transaction generates a GST-compliant invoice, delivered digitally to the customer\'s registered email.' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Responsibility */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-semibold text-white mb-6">Brand Responsibility</h2>
            <p className="text-xl text-blue-50 leading-relaxed max-w-4xl mx-auto mb-10">
              VisvasaHome recognizes that trust is built over time. Our identity reflects our responsibility to customers, professionals, and communities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-10">
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold text-white mb-2">Safety</h4>
                <p className="text-sm text-blue-100">Every touchpoint prioritizes the safety of customers and professionals</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold text-white mb-2">Reliability</h4>
                <p className="text-sm text-blue-100">Consistent quality and dependable service delivery, every time</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h4 className="font-semibold text-white mb-2">Accountability</h4>
                <p className="text-sm text-blue-100">We stand behind every service experience and take responsibility</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('our-mission')}
                className="px-8 py-4 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Read Our Mission
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}