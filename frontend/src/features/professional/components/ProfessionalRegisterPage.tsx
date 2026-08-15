import { useState } from 'react';
import {
  ArrowLeft, CheckCircle, TrendingUp, Shield, Star,
  IndianRupee, Clock, Award, Briefcase, ChevronDown,
  ChevronUp, ArrowRight, Phone, MessageCircle, Users,
  Zap, BarChart3, Wrench, Minus, Plus
} from 'lucide-react';
import { ImageWithFallback } from '@shared/figma/ImageWithFallback';

interface ProfessionalRegisterPageProps {
  onBack: () => void;
  onRegister: () => void;
}

/* ─────────────────────── DATA ─────────────────────── */

const earningData = [
  { category: 'Electrician',    min: 35000, max: 75000 },
  { category: 'Plumber',        min: 30000, max: 65000 },
  { category: 'AC Technician',  min: 40000, max: 90000 },
  { category: 'Painter',        min: 28000, max: 60000 },
  { category: 'Carpenter',      min: 32000, max: 70000 },
  { category: 'Cleaning Pro',   min: 20000, max: 45000 },
  { category: 'Pest Control Tech', min: 25000, max: 55000 },
  { category: 'Appliance Tech', min: 38000, max: 80000 },
];

const benefits = [
  {
    icon: IndianRupee,
    title: 'Industry-Leading Commission Structure',
    desc: 'Retain 85–90% of every service fee with complete transparency. No hidden charges, no commission bidding wars, no surprises — a business model built on mutual respect and fair partnership.',
    metric: '85–90%',
    sub: 'commission retention',
  },
  {
    icon: Users,
    title: 'Pre-Qualified Customer Network',
    desc: 'Access a continuously growing base of verified customers actively seeking quality service providers. No cold calling, no marketing expenses — we bring customers to you.',
    metric: '500+',
    sub: 'customers per city',
  },
  {
    icon: Shield,
    title: 'Professional Verification & Credibility',
    desc: 'Earn your official VisvasaHome verification badge through our comprehensive background check process. Verified professionals receive 3× more booking requests than unverified providers.',
    metric: '3×',
    sub: 'higher booking rate',
  },
  {
    icon: Clock,
    title: 'Complete Schedule Autonomy',
    desc: 'Maintain full control over your professional calendar. Work full-time, part-time, or flexible hours — accept or decline every job request based on your availability and preferences.',
    metric: '100%',
    sub: 'schedule control',
  },
  {
    icon: Award,
    title: 'Professional Development Program',
    desc: 'Access our comprehensive training academy with 20+ skill enhancement modules, industry certifications, and best practice workshops — all provided at zero cost to verified partners.',
    metric: '20+',
    sub: 'certification courses',
  },
  {
    icon: TrendingUp,
    title: 'Guaranteed AMC Income Stream',
    desc: 'High-performing partners receive exclusive Annual Maintenance Contract assignments, providing stable recurring revenue alongside regular service bookings for sustainable business growth.',
    metric: '₹15,000+',
    sub: 'monthly AMC revenue',
  },
];

const steps = [
  {
    num: '01',
    title: 'Submit Partner Application',
    desc: 'Complete our streamlined 3-step application form with your personal information, professional credentials, and required documentation. The entire process takes approximately 10 minutes.',
    time: '~10 minutes',
    icon: Briefcase,
  },
  {
    num: '02',
    title: 'Verification & Background Check',
    desc: 'Our dedicated verification team conducts a comprehensive review of your government-issued ID, professional credentials, and background. Standard processing time is 2-3 business days.',
    time: '2–3 business days',
    icon: Shield,
  },
  {
    num: '03',
    title: 'Professional Onboarding Session',
    desc: 'Participate in our comprehensive orientation covering quality standards, platform navigation, partner app training, and best practices for customer engagement and service excellence.',
    time: '1–2 hours',
    icon: Award,
  },
  {
    num: '04',
    title: 'Activation & Customer Access',
    desc: 'Your verified professional profile goes live on our platform. Most partners receive their first qualified customer inquiry within 48 hours of activation.',
    time: '48 hours to first job',
    icon: IndianRupee,
  },
];

const testimonials = [
  {
    name: 'Ramesh Kumar',
    role: 'AC Technician Specialist',
    city: 'Jaipur',
    quote: 'Before joining VisvasaHome, I struggled to find consistent clients. Now I receive 15-20 verified bookings monthly through the platform. My income has doubled, and I can focus entirely on delivering quality service rather than marketing.',
    earnings: '₹68,000',
    since: 'Verified Partner since 2023',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
  },
  {
    name: 'Karan Singh',
    role: 'Professional Painter Specialist',
    city: 'Jaipur',
    quote: 'The platform has transformed my independent painting business. The verified badge builds instant credibility with new clients. I now earn over ₹52,000 monthly with complete flexibility to manage my schedule and crew commitments.',
    earnings: '₹52,000',
    since: 'Verified Partner since 2022',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
  },
  {
    name: 'Suresh Meena',
    role: 'Licensed Electrician & Plumber',
    city: 'Jaipur',
    quote: 'The AMC contract program provides stable recurring income that covers my baseline expenses. Combined with additional service bookings, I have achieved financial predictability that was impossible as an independent contractor.',
    earnings: '₹55,000',
    since: 'Verified Partner since 2023',
    img: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200',
  },
];

const faqs = [
  {
    q: 'What are the costs associated with becoming a VisvasaHome partner?',
    a: 'Partner registration is completely free with zero upfront costs, no subscription fees, and no hidden charges. We operate on a transparent commission model where a nominal platform fee of 10-15% applies only to successfully completed and paid services. You retain 85-90% of all earnings.',
  },
  {
    q: 'What is the typical timeline to receive my first customer booking?',
    a: 'Most verified partners in high-demand service categories (AC repair, electrical work, plumbing, beauty services) receive their first confirmed customer booking within 48-72 hours of profile activation. Actual timing depends on your location, service category, and profile completeness.',
  },
  {
    q: 'Can I maintain my current job and work as a part-time partner?',
    a: 'Absolutely. Our platform is designed to accommodate flexible schedules. You maintain complete control over your availability and can accept or decline jobs based on your schedule. Many successful partners begin part-time and transition to full-time as their client base grows.',
  },
  {
    q: 'How does the payment settlement process work?',
    a: 'Payments are processed directly to your registered bank account or UPI ID immediately after service completion and customer payment confirmation. Verified partners with strong performance records can opt for weekly consolidated settlements for improved cash flow management.',
  },
  {
    q: 'Is participation in the onboarding training program mandatory?',
    a: 'The initial 1-2 hour orientation session is required for all new partners to ensure quality standards and platform familiarity. Additional specialized training modules are optional but highly recommended — our data shows that certified partners receive approximately 40% more booking requests.',
  },
  {
    q: 'What are the requirements to qualify for AMC contract assignments?',
    a: 'Partners become eligible for lucrative AMC (Annual Maintenance Contract) assignments after maintaining a minimum 4.5-star rating and successfully completing at least 20 verified service bookings. AMC contracts provide predictable recurring revenue in addition to regular one-time service bookings.',
  },
];

const comparisonRows = [
  ['Registration & Setup',     '₹0 — Completely Free',              '₹500–₹2,000 annual fee'],
  ['Platform Commission',      '10–15% fair rate',       '20–35% per transaction'],
  ['Payment Processing',   'Same-day / Weekly payout',  '15–30 day payment delay'],
  ['Lead Quality',     'Pre-verified local customers',    'Unfiltered mass leads'],
  ['Professional Training',       'Free comprehensive program',  'Paid courses or none'],
  ['AMC Revenue Stream',    'Exclusive contract program',          'Not available'],
  ['Profile Ownership',      'Complete partner control',        'Platform-owned profiles'],
  ['Partner Support',       'Dedicated success team',     'Automated support only'],
  ['Quality Standards',       'ISO 9001 certified process',     'No standardization'],
];

/* ─────────────────────── COMPONENT ─────────────────────── */

export function ProfessionalRegisterPage({ onBack, onRegister }: ProfessionalRegisterPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(2);
  const [jobsPerMonth, setJobsPerMonth] = useState(20);

  const sel = earningData[selectedCategory];
  const avg = (sel.min + sel.max) / 2;
  const estimated = Math.round((avg / 20) * jobsPerMonth);

  return (
    <div className="min-h-screen bg-white">

      {/* ── STICKY NAV ── */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] border-b border-[#2563EB]/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="hidden lg:flex items-center gap-2 text-blue-200 text-xs">
            
            <span></span>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <a href="tel:+919057567160"
               className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors text-sm font-medium">
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">+91 905 7567 160</span>
            </a>
            <button
              onClick={onRegister}
              className="px-6 py-2.5 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg font-bold text-sm"
            >Register Now</button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO — full-bleed gradient with photo
      ══════════════════════════════════════════ */}
      <section className="relative flex items-center overflow-hidden bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF]" style={{ minHeight: '92vh' }}>

        {/* Background photo — right half */}
        <div style={{
          position: 'absolute', right: 0, top: 0,
          width: '52%', height: '100%',
        }}>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1623662346414-af98877cab19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900"
            alt="VisvasaHome professional partner"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          {/* Gradient overlay from left */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgb(37, 99, 235) 5%, rgb(37, 99, 235) 30%, transparent 75%)',
          }} />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to top, rgb(37, 99, 235), transparent)',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 w-full">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-0.5 bg-blue-300" />
              <span className="text-blue-200 text-xs font-semibold tracking-widest uppercase">
                Professional Partner Program
              </span>
            </div>

            <h1 className="text-white font-bold leading-tight tracking-tight mb-6" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
              Transform Your Skills Into<br />
              <span className="text-blue-200">Sustainable Revenue.</span>
            </h1>

            <p className="text-blue-100 text-lg leading-relaxed mb-10 max-w-xl">
              Join India's premier professional services network trusted by 2,000+ verified partners. Build a thriving independent business with pre-qualified customers, industry-leading commission rates (retain 85-90%), comprehensive training certifications, and exclusive AMC revenue streams. Professional earning potential: ₹30,000–₹90,000 monthly.
            </p>

            {/* Stat row */}
            <div className="flex flex-wrap gap-8 mb-10">
              {[
                { val: '₹30K–90K', label: 'Monthly earning potential' },
                { val: '2,000+',   label: 'Verified active partners' },
                { val: '20+ Cities', label: 'Pan-India presence' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-white text-2xl font-extrabold leading-none">{s.val}</div>
                  <div className="text-blue-300 text-xs mt-1.5 font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onRegister}
                className="flex items-center justify-center gap-2 px-10 py-4 bg-white text-[#2563EB] rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl font-bold text-base"
              >
                Start Application — Free
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/919057567160?text=I%20want%20to%20join%20VisvasaHome%20as%20a%20professional%20partner"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/40 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
              >
                <MessageCircle className="w-4 h-4" />
                Speak to Partnership Team
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 mt-6 pt-6 border-t border-white/10">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-green-400" />
                ₹0 Registration Cost
              </span>
              <span className="text-blue-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-green-400" />
                2-3 Day Verification
              </span>
              <span className="text-blue-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-green-400" />
                48hr First Booking
              </span>
              <span className="text-blue-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-green-400" />
                85-90% Commission
              </span>
            </div>
          </div>

          {/* floating trust card — desktop only */}
          <div className="hidden lg:flex items-end justify-end pb-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-7 max-w-xs w-full shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <div className="text-blue-200 text-xs font-bold tracking-wider uppercase">LIVE PLATFORM ACTIVITY</div>
              </div>
              {[
                { action: 'New Booking Confirmed', detail: 'AC Repair · ₹1,500', t: '2m ago', icon: '🔧' },
                { action: 'Professional Verified', detail: 'Electrician · Jaipur', t: '11m ago', icon: '✓' },
                { action: 'Payment Processed', detail: '₹3,200 to Partner', t: '25m ago', icon: '💰' },
                { action: 'AMC Contract Assigned', detail: 'Office Maintenance', t: '1h ago', icon: '📋' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 mb-3 pb-3 last:mb-0 last:pb-0 border-b border-white/10 last:border-0">
                  <div className="text-lg leading-none">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-semibold mb-0.5">{item.action}</div>
                    <div className="text-blue-300 text-xs">{item.detail}</div>
                  </div>
                  <div className="text-[#2563EB] text-xs whitespace-nowrap">{item.t}</div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <div className="text-blue-200 text-xs">
                  Join <span className="text-white font-bold">2,000+</span> active professionals
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TRUST STRIP & STATS
      ══════════════════════════════════════════ */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { metric: '2,000+', label: 'Verified Professionals', sublabel: 'Actively Earning' },
              { metric: '10,000+', label: 'Monthly Services', sublabel: 'Successfully Completed' },
              { metric: '₹4.5 Cr+', label: 'Annual Partner Revenue', sublabel: 'FY 2024-25' },
              { metric: '20+ Cities', label: 'National Coverage', sublabel: 'Expanding Network' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="text-3xl md:text-4xl font-black text-[#2563EB] leading-none mb-2">
                  {stat.metric}
                </div>
                <div className="text-sm font-bold text-gray-800 mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-600">
                  {stat.sublabel}
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-8 border-t border-gray-200">
            {[
              '₹0 Registration Investment',
              'Retain 85–90% Commission',
              'ISO 9001:2015 Certified',
              'Verification Within 72 Hours',
              'Comprehensive Training Academy',
              'Exclusive AMC Revenue Program',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2.5 text-gray-700 text-sm font-semibold">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-[#2563EB]" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EARNINGS CALCULATOR
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '96px 0' }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">

          {/* Section header */}
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#2563EB]" />
              <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">
                INCOME POTENTIAL CALCULATOR
              </span>
              <div className="w-8 h-0.5 bg-[#2563EB]" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              Professional Income Projection Calculator
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Calculate your realistic monthly revenue potential based on your professional category and service capacity. All projections derived from verified earnings data of 2,000+ active VisvasaHome partners across India.
            </p>
          </div>

          <div style={{
            border: '1px solid #E5E7EB',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
          }}>
            <div className="grid grid-cols-1 lg:grid-cols-2">

              {/* Left controls */}
              <div className="p-10 border-r border-gray-200">
                <p className="text-xs font-bold text-gray-700 tracking-wider uppercase mb-4">
                  SELECT YOUR TRADE
                </p>
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {earningData.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCategory(i)}
                      className={`px-3.5 py-2.5 rounded-lg text-sm text-left cursor-pointer transition-all ${
                        selectedCategory === i
                          ? 'bg-[#2563EB] text-white border-2 border-[#2563EB] font-semibold'
                          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {item.category}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-bold text-gray-700 tracking-wider uppercase mb-3">
                  JOBS PER MONTH
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setJobsPerMonth(Math.max(5, jobsPerMonth - 5))}
                    className="w-9 h-9 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-3xl font-black text-[#2563EB]">{jobsPerMonth}</span>
                    <span className="text-gray-500 text-sm ml-2">jobs / month</span>
                  </div>
                  <button
                    onClick={() => setJobsPerMonth(Math.min(40, jobsPerMonth + 5))}
                    className="w-9 h-9 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-500 text-xs">5 — Part-time</span>
                  <span className="text-gray-500 text-xs">40 — Full-time</span>
                </div>
              </div>

              {/* Right — result */}
              <div className="p-10 bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex flex-col justify-between">
                <div>
                  <p className="text-blue-300 text-xs font-semibold tracking-wider uppercase mb-2">
                    YOUR ESTIMATED EARNINGS AS {sel.category.toUpperCase()}
                  </p>
                  <div className="text-5xl md:text-6xl font-black text-white leading-none mb-1">
                    ₹{estimated.toLocaleString('en-IN')}
                  </div>
                  <p className="text-blue-200 text-sm">per month (estimated)</p>
                </div>

                <div className="grid grid-cols-2 gap-3 my-8">
                  {[
                    { label: 'Low Season Min', val: `₹${sel.min.toLocaleString('en-IN')}` },
                    { label: 'Peak Season Max', val: `₹${sel.max.toLocaleString('en-IN')}` },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/10 border border-white/20 rounded-xl p-4">
                      <div className="text-blue-300 text-xs font-semibold mb-1">{item.label}</div>
                      <div className="text-white text-lg font-bold">{item.val}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-900/30 border border-[#2563EB]/30 rounded-xl p-4 mb-6">
                  <div className="text-blue-200 text-xs font-bold mb-1">
                    + AMC BONUS POTENTIAL
                  </div>
                  <div className="text-blue-100 text-sm leading-relaxed">
                    Add ₹5,000–₹15,000 per month in guaranteed AMC income once eligible.
                  </div>
                </div>

                <button
                  onClick={onRegister}
                  className="w-full py-4 bg-white text-[#2563EB] rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-base"
                >
                  Begin Free Application Process
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BENEFITS — clean 3-col grid
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#F8F9FA', padding: '96px 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#2563EB]" />
              <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">WHY CHOOSE VISVASAHOME</span>
              <div className="w-8 h-0.5 bg-[#2563EB]" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              A Complete Professional Ecosystem,<br />Not Just Another Gig Platform.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              We've built a comprehensive support infrastructure designed for serious professionals who want to establish sustainable, growing businesses — not freelancers seeking occasional side income.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '16px',
                  padding: '32px',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
                className="hover:shadow-md"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center mb-5">
                  <b.icon className="w-5 h-5 text-white" />
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2.5">
                  {b.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {b.desc}
                </p>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-2xl font-black text-[#2563EB] leading-none">{b.metric}</div>
                  <div className="text-gray-500 text-xs mt-1">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PROCESS — horizontal numbered steps
      ══════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-blue-300" />
              <span className="text-blue-200 text-xs font-bold tracking-widest uppercase">SIMPLE ONBOARDING PROCESS</span>
              <div className="w-8 h-0.5 bg-blue-300" />
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              From Application to First Earning — 4 Simple Steps
            </h2>
            <p className="text-blue-200 text-base leading-relaxed">
              Our streamlined verification and onboarding process gets you earning within a week
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i}>
                {/* Step number */}
                <div className="text-5xl font-black text-white/20 leading-none mb-4">
                  {step.num}
                </div>

                {/* Icon */}
                <div className="w-11 h-11 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-blue-200" />
                </div>

                {/* Time badge */}
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-blue-300 font-semibold mb-3">
                  {step.time}
                </div>

                <h3 className="text-base font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-blue-300 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 pt-10 border-t border-white/10 text-center">
            <button
              onClick={onRegister}
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#2563EB] rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-base"
            >
              Start Partner Application
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-blue-300 text-sm mt-4">
              Complete verification process in 2-3 business days • Start earning within 48 hours of approval
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS — editorial cards with video section
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '96px 0' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-0.5 bg-[#2563EB]" />
              <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">Verified Partner Testimonials</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-3">
              Real Professionals. Verified Earnings.<br />Sustainable Growth.
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Authentic success stories from verified partners who have built thriving independent businesses through our professional services platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {testimonials.map((t, i) => (
              <div key={i} style={{
                border: '1px solid #E5E7EB',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
              }}>
                {/* Top band */}
                <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-blue-50 text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                {/* Bottom — person */}
                <div className="p-5 flex items-center gap-3.5 bg-gray-50 flex-1">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-900">{t.name}</div>
                    <div className="text-gray-600 text-xs">{t.role} · {t.city}</div>
                    <div className="text-gray-500 text-xs">{t.since}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-base text-[#2563EB]">{t.earnings}</div>
                    <div className="text-gray-500 text-xs">/ month avg</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video testimonials CTA */}
          <div className="bg-gradient-to-br from-blue-50 to-amber-50 border border-blue-200 rounded-2xl p-12 text-center shadow-lg">
            <div className="w-16 h-16 bg-[#2563EB] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginLeft: '2px' }}>
                <path d="M8 5v14l11-7z" fill="white"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Watch Verified Partner Success Interviews
            </h3>
            <p className="text-gray-600 text-base leading-relaxed max-w-2xl mx-auto mb-6">
              View in-depth video interviews with our highest-performing partners as they share authentic insights into their revenue growth, customer acquisition strategies, and professional development journey with VisvasaHome.
            </p>
            <a
              href="https://www.youtube.com/@visvasahomes"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#2563EB] transition-all shadow-md hover:shadow-lg font-bold text-base"
            >
              Watch Success Stories
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMPARISON TABLE
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#F8F9FA', padding: '96px 0' }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-14 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#2563EB]" />
              <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">COMPETITIVE ADVANTAGE</span>
              <div className="w-8 h-0.5 bg-[#2563EB]" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              Why VisvasaHome Stands Apart
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Compare our professional partner program with typical gig platforms — the difference is clear.
            </p>
          </div>

          {/* Table */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]">
              <div className="px-6 py-4 text-blue-300 text-xs font-bold tracking-wider uppercase">FEATURE</div>
              <div className="px-6 py-4 text-white text-xs font-bold tracking-wider uppercase border-l border-[#2563EB]/20">VISVASA HOME</div>
              <div className="px-6 py-4 text-blue-200 text-xs font-bold tracking-wider uppercase border-l border-[#2563EB]/20">OTHER PLATFORMS</div>
            </div>

            {comparisonRows.map(([feat, us, them], i) => (
              <div
                key={i}
                className={`grid grid-cols-3 border-t border-gray-200 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="px-6 py-3.5 text-sm text-gray-700 font-medium">{feat}</div>
                <div className="px-6 py-3.5 border-l border-gray-200 text-sm text-[#2563EB] font-bold">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-[#2563EB]" />
                    {us}
                  </span>
                </div>
                <div className="px-6 py-3.5 border-l border-gray-200 text-sm text-gray-500">{them}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '96px 0' }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#2563EB]" />
              <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">FREQUENTLY ASKED QUESTIONS</span>
              <div className="w-8 h-0.5 bg-[#2563EB]" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              Partner Program — Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Comprehensive answers to common inquiries about partnership requirements, registration process, commission structure, and platform operations.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '8px',
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={`w-full flex items-center justify-between p-5 text-left cursor-pointer border-none gap-4 transition-colors ${
                    openFaq === i ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 flex-shrink-0 text-[#2563EB]" />
                    : <ChevronDown className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 border-t border-blue-100 bg-blue-50">
                    <p className="text-gray-600 text-sm leading-relaxed pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PARTNER APP & TOOLS SHOWCASE
      ══════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '96px 0', borderBottom: '1px solid #E5E7EB' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#2563EB]" />
              <span className="text-[#2563EB] text-xs font-bold tracking-widest uppercase">PROFESSIONAL TOOLS & PLATFORM</span>
              <div className="w-8 h-0.5 bg-[#2563EB]" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
              Everything You Need to Manage Your Professional Business
            </h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Access our comprehensive partner app and professional tools designed specifically for service professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Award,
                title: 'Skill Certifications',
                desc: '20+ industry-recognized training modules with official certificates to boost your credibility',
              },
              {
                icon: Users,
                title: '24/7 Partner Support',
                desc: 'Dedicated support team, field coordinators, and instant helpline for all your queries',
              },
              {
                icon: BarChart3,
                title: 'Earnings Dashboard',
                desc: 'Real-time income tracking, performance analytics, and booking insights at your fingertips',
              },
              {
                icon: Briefcase,
                title: 'Business Management',
                desc: 'Professional invoicing, customer CRM, appointment scheduling, and payment tracking',
              },
            ].map((item, i) => (
              <div key={i} style={{
                backgroundColor: '#F8F9FA',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                padding: '28px',
                textAlign: 'center',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              className="hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-[#2563EB] rounded-xl flex items-center justify-center mx-auto mb-4.5">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2.5">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Partner App Features */}
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-2xl p-12 grid gap-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-white mb-3">
                VisvasaHome Partner Mobile App
              </h3>
              <p className="text-blue-100 text-base leading-relaxed max-w-2xl mx-auto">
                Manage your entire professional business from your smartphone — accept bookings, track earnings, communicate with customers, and access training materials on the go.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '📱', label: 'Mobile App Access', desc: 'iOS & Android' },
                { icon: '🔔', label: 'Instant Notifications', desc: 'Never miss a booking' },
                { icon: '💬', label: 'Customer Chat', desc: 'Direct communication' },
                { icon: '📊', label: 'Live Analytics', desc: 'Track performance' },
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <div className="text-sm font-semibold text-white mb-1">{feature.label}</div>
                  <div className="text-xs text-blue-300">{feature.desc}</div>
                </div>
              ))}
            </div>

            <div className="text-center pt-6 border-t border-white/10">
              <p className="text-blue-200 text-sm mb-4 font-medium">
                Complete installation and training guide provided upon successful verification
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Google Play Store (Android 7.0+)
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Apple App Store (iOS 12+)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FINAL CTA — gradient background
      ══════════════════════════════════════════ */}
      <section className="relative py-24 bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-[-100px] top-[-100px] w-[500px] h-[500px] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute right-[-50px] top-[-50px] w-[320px] h-[320px] rounded-full border border-white/5 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-px bg-blue-300" />
            <span className="text-blue-200 text-xs font-bold tracking-widest uppercase">
              India's Premier Professional Services Network
            </span>
            <div className="w-10 h-px bg-blue-300" />
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5 tracking-tight">
            Join 2,000+ Verified Partners Generating<br />
            <span className="text-blue-200">₹4.5 Crore+ in Annual Revenue.</span>
          </h2>

          <p className="text-blue-100 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Become part of India's most trusted professional services ecosystem. Built on principles of transparency, fair commission structures, and sustainable partnership growth. Zero registration investment. Zero hidden fees. Complete professional autonomy.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onRegister}
              className="flex items-center gap-2 px-10 py-4 bg-white text-[#2563EB] rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
            >Register as Professional</button>
            <a
              href="https://wa.me/919057567160?text=I%20want%20to%20join%20VisvasaHome%20as%20a%20professional%20partner"
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-all font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-white/10">
            {[
              { icon: Shield, text: 'Government-Verified Professionals Only' },
              { icon: Award,  text: 'ISO 9001:2015 Certified Operations' },
              { icon: Zap,    text: 'Profile Active Within 48-72 Hours' },
              { icon: Users,  text: '2,000+ Verified Active Partners' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-blue-100 text-sm font-semibold">
                <item.icon className="w-4 h-4 text-blue-300" />
                {item.text}
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-blue-200 text-base font-medium mb-4">
              Partnership Inquiries & Application Support
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <a href="tel:+919057567160" className="flex items-center gap-2.5 text-blue-100 hover:text-white transition-colors text-sm font-medium">
                <Phone className="w-4 h-4" />
                +91 905 7567 160
              </a>
              <span className="text-[#2563EB]">•</span>
              <a href="mailto:partners@visvasahome.com" className="flex items-center gap-2.5 text-blue-100 hover:text-white transition-colors text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                partners@visvasahome.com
              </a>
            </div>
            <p className="text-blue-300 text-xs mt-4">
              Monday – Saturday: 9:00 AM – 7:00 PM IST • Average response time: &lt;2 hours
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="bg-gray-900 py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center m-0">
              © 2025 VisvasaHome (Visvasahomes Pvt. Ltd.) · Jaipur, Rajasthan, India
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="tel:+919057567160" className="text-gray-500 hover:text-gray-300 transition-colors">
                +91 905 7567 160
              </a>
              <a href="mailto:partners@visvasahome.com" className="text-gray-500 hover:text-gray-300 transition-colors">
                partners@visvasahome.com
              </a>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs m-0">
              Reliable · Transparent · Local-First · Quality-Driven · ISO 9001 Certified Platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
