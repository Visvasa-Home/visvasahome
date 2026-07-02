import {
  ArrowLeft, Shield, CalendarCheck, Star, Briefcase,
  Clock, Phone, CheckCircle, Play, Sparkles, Lock, 
  Wrench, CreditCard, UserCheck, ChevronDown, Check,
  ChevronRight, MapPin, Wallet, ClipboardCheck
} from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';
import { useState } from 'react';

interface HowItWorksPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const guarantees = [
  { title: 'Transparent Pricing', desc: 'You see the price before any work starts. No hidden charges, no surprises — ever.' },
  { title: 'Background-Verified Professionals', desc: 'Every professional on our platform has passed identity verification and background screening.' },
  { title: 'Service Warranty', desc: 'All services come with a warranty period. If the issue recurs, we send someone back at no extra charge.' },
  { title: 'Accountability at Every Step', desc: 'Every visit is logged digitally. You have a complete record of all service history and work done.' },
  { title: 'Dedicated Support', desc: 'Issues? Our customer support team is available 6 days a week to address any concerns or complaints.' },
  { title: 'Quality Monitoring', desc: 'We continuously monitor contractor quality through customer ratings, follow-up checks, and periodic audits.' },
];

const faqs = [
  { q: "How do I know the professional is trustworthy?", a: "Every professional on VisvasaHome undergoes a strict 5-step background verification process, including identity checks, criminal record checks, and skill assessments before they are allowed on our platform." },
  { q: "What if I am not satisfied with the service?", a: "Your payment is held securely in escrow and is only released to the professional when you are satisfied with the job and share the completion OTP. We also offer a post-service warranty on all jobs." },
  { q: "Are there any hidden charges?", a: "No. VisvasaHome operates on a 100% transparent pricing model. You will see the estimated cost before booking, and any additional material costs are discussed and approved by you before the work begins." },
  { q: "Can I cancel or reschedule my booking?", a: "Yes, you can easily reschedule or cancel your booking through the platform up to 2 hours before the scheduled time without any penalty." }
];

export function HowItWorksPage({ onBack, onNavigate }: HowItWorksPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header
        onRegisterContractor={() => onNavigate('register-contractor')}
        onBookService={() => onNavigate('get-started-customer')}
        selectedLocation={null}
        onLocationSelect={() => { }}
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop" 
            alt="Professional at work" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/50" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700/50 backdrop-blur-sm">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2563EB]/20 border border-[#2563EB]/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300 tracking-wide">TRUST & TRANSPARENCY</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">VisvasaHome</span> Works
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl font-light">
              We've engineered a seamless, secure, and transparent ecosystem connecting skilled professionals with households that need them. Discover how we ensure quality at every step.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => onNavigate('get-started-customer')} className="px-8 py-4 bg-[#2563EB] text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 font-semibold flex items-center gap-2 group">
                Book a Service
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => onNavigate('register-contractor')} className="px-8 py-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all border border-white/10 font-semibold backdrop-blur-sm flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Join as a Partner
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* For Customers Section - Visual Timeline */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-[#2563EB] rounded-2xl mb-6 shadow-sm border border-blue-100">
              <UserCheck className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">For Customers: Simple, Secure Booking</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Get your home chores done by verified experts in three effortless steps. Your peace of mind is guaranteed.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-[#2563EB] to-blue-100 transform -translate-y-1/2 opacity-30"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40 relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-8 shadow-lg shadow-blue-500/30 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  <CalendarCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center md:text-left">1. Book Your Service</h3>
                <p className="text-slate-600 leading-relaxed text-center md:text-left">Browse our catalog of 30+ services. Select a convenient time slot and get an instant, transparent price estimate before confirming.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40 relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-8 shadow-lg shadow-blue-500/30 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center md:text-left">2. Professional Arrives</h3>
                <p className="text-slate-600 leading-relaxed text-center md:text-left">A background-verified, skilled professional arrives at your doorstep on time, fully equipped with the right tools for the job.</p>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl shadow-slate-200/40 relative group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2563EB] to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl mb-8 shadow-lg shadow-blue-500/30 mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center md:text-left">3. Secure Escrow Payment</h3>
                <p className="text-slate-600 leading-relaxed text-center md:text-left">Provide the start OTP to begin. Your payment is held securely in escrow and released only when you share the completion OTP.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Partners Section - Dark Theme Timeline */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl mb-6 shadow-sm">
              <Briefcase className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">For Partners: Grow Your Business</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Join the highest-paying home services network in India. Work on your own terms and let us handle the customers.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                <ClipboardCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Apply & Verify</h3>
              <p className="text-slate-400 leading-relaxed mb-6">Submit your application online. Our team conducts a thorough KYC and background check to maintain platform trust.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300"><Check className="w-4 h-4 text-indigo-400" /> Identity Verification</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><Check className="w-4 h-4 text-indigo-400" /> Criminal Record Check</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Skill Assessment</h3>
              <p className="text-slate-400 leading-relaxed mb-6">Prove your expertise. Pass our rigorous practical and theoretical skill assessments conducted by category experts.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300"><Check className="w-4 h-4 text-indigo-400" /> Standardized Testing</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><Check className="w-4 h-4 text-indigo-400" /> Quality Onboarding</li>
              </ul>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 transition-colors">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-xl mb-6">
                <Wallet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Go Live & Earn</h3>
              <p className="text-slate-400 leading-relaxed mb-6">Get access to hundreds of local jobs. Set your own schedule, complete tasks, and receive payouts directly to your bank.</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-slate-300"><Check className="w-4 h-4 text-indigo-400" /> Flexible Hours</li>
                <li className="flex items-center gap-2 text-sm text-slate-300"><Check className="w-4 h-4 text-indigo-400" /> Secure Payouts</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <button onClick={() => onNavigate('register-contractor')} className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/30 font-semibold inline-flex items-center gap-2">
              Start Partner Onboarding
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* The VisvasaHome Promise */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">The VisvasaHome Promise</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We don't just connect you with professionals; we take responsibility for the entire service experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guarantees.map((g, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{g.title}</h4>
                <p className="text-slate-600 leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics / Trust Indicators */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-500/50 text-center">
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white">30k+</div>
              <div className="text-blue-100 font-medium">Services Delivered</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white">5k+</div>
              <div className="text-blue-100 font-medium">Verified Partners</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white">4.8</div>
              <div className="text-blue-100 font-medium">Average Rating</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 text-white">100%</div>
              <div className="text-blue-100 font-medium">Escrow Protected</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Everything you need to know about how VisvasaHome operates.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="text-lg font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] rounded-3xl p-12 md:p-16 text-white text-center shadow-2xl shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold mb-6 tracking-tight">Ready to Experience the Difference?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Join thousands of satisfied customers who trust VisvasaHome for their everyday household needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                <button onClick={() => onNavigate('get-started-customer')} className="w-full sm:w-auto px-10 py-4 bg-white text-[#2563EB] rounded-xl hover:bg-slate-50 transition-all font-bold text-lg shadow-lg shadow-black/10 flex items-center justify-center gap-2">
                  Book Your First Service
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </button>
                <button onClick={() => onNavigate('contact')} className="w-full sm:w-auto px-10 py-4 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition-all font-semibold text-lg flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}

