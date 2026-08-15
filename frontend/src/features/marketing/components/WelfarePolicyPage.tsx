import { Heart, Shield, TrendingUp, Users, CheckCircle, Phone, Mail, ArrowLeft, BookOpen, Award, Stethoscope } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface WelfarePolicyPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const pillars = [
  {
    icon: TrendingUp,
    title: 'Fair & Transparent Earnings',
    color: 'bg-blue-50 text-[#2563EB]',
    points: [
      'Earnings shared upfront before job acceptance',
      'No undisclosed deductions or arbitrary cuts',
      'Weekly payment settlements with full breakdown',
      'Incentive programs for high-rated professionals',
      'Bonus structures for long-term platform partners',
    ],
  },
  {
    icon: Shield,
    title: 'Safety & Security',
    color: 'bg-blue-50 text-[#2563EB]',
    points: [
      'Mandatory background verification for all professionals',
      'Emergency contact protocols for on-site incidents',
      'Accident insurance coverage while on job',
      'Zero-tolerance policy against customer harassment',
      '24/7 safety helpline for active professionals',
    ],
  },
  {
    icon: BookOpen,
    title: 'Training & Skill Development',
    color: 'bg-blue-50 text-blue-600',
    points: [
      'Free onboarding training for all new professionals',
      'Advanced skill certification programs',
      'Digital literacy support for app and tools',
      'Safety and compliance training modules',
      'Access to ongoing refresher courses',
    ],
  },
  {
    icon: Stethoscope,
    title: 'Health & Well-being',
    color: 'bg-blue-50 text-blue-600',
    points: [
      'Group health insurance access for active partners',
      'Subsidized medical consultation network',
      'Mental health support resources',
      'Periodic health camps in partner cities',
      'Preventive health check-up support',
    ],
  },
  {
    icon: Award,
    title: 'Recognition & Career Growth',
    color: 'bg-blue-50 text-blue-600',
    points: [
      'Verified badge and Top Rated recognition',
      'Monthly Spotlight Professional features',
      'Annual Partner Excellence Awards',
      'Pathway to senior and training roles',
      'Priority job assignment for high performers',
    ],
  },
  {
    icon: Users,
    title: 'Community & Support',
    color: 'bg-blue-50 text-blue-600',
    points: [
      'Dedicated professional support team',
      'WhatsApp community groups by city',
      'Grievance redressal within 48 hours',
      'Input channels for policy improvements',
      'Peer mentoring program',
    ],
  },
];

export function WelfarePolicyPage({ onBack, onNavigate }: WelfarePolicyPageProps) {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl mb-3" style={{ fontWeight: 700 }}>Partner Welfare Policy</h1>
              <p className="text-white/80 text-lg">Our commitment to the professionals who are the backbone of VisvasaHome</p>
              <p className="text-white/60 text-sm mt-3">Effective Date: January 1, 2024 · Last Updated: June 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Statement */}
      <section className="py-12 bg-blue-50 border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-700 leading-relaxed text-center text-lg">
            At VisvasaHome, our service professionals are not just contractors — they are partners. This policy defines our obligations to their well-being, livelihood, dignity, and professional growth. We believe a thriving professional community is the foundation of a trustworthy service platform.
          </p>
        </div>
      </section>

      {/* Welfare Pillars */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-3 text-center" style={{ fontWeight: 700 }}>Our Welfare Commitments</h2>
          <p className="text-gray-500 text-center mb-10">Six pillars that guide how we support every professional on our platform</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pillar.color}`}>
                  <pillar.icon className="w-6 h-6" />
                </div>
                <h3 className="text-gray-900 mb-4" style={{ fontWeight: 600 }}>{pillar.title}</h3>
                <ul className="space-y-2">
                  {pillar.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Rights */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>Professional Rights & Protections</h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>Every professional on the VisvasaHome platform has the following rights:</p>
            <ul className="space-y-3 list-none">
              {[
                'Right to reject any job without penalty or impact on standing, provided adequate notice is given',
                'Right to transparent and fair dispute resolution for payment and rating disagreements',
                'Right to be treated with dignity and respect by customers and VisvasaHome staff',
                'Right to clear, accurate information about job requirements before acceptance',
                'Right to feedback on performance with specific, constructive, and actionable guidance',
                'Right to appeal any suspension or account action through a defined review process',
                'Right to data privacy — personal information will never be shared without consent',
              ].map((right) => (
                <li key={right} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  {right}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Grievance */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>Grievance & Support Channels</h2>
          <p className="text-gray-600 text-sm mb-8">If you face any issue related to payments, safety, customer behavior, or platform policies, reach out immediately. All complaints are handled with confidentiality and resolved within 48 hours.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a href="mailto:partners@visvasahome.com" className="flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-[#2563EB] transition-colors group">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                <Mail className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontWeight: 600 }}>Partner Support Email</p>
                <p className="text-sm text-gray-500">partners@visvasahome.com</p>
                <p className="text-xs text-gray-400 mt-1">Response within 24 hours</p>
              </div>
            </a>
            <a href="tel:+919057567160" className="flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-[#2563EB] transition-colors group">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                <Phone className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontWeight: 600 }}>Partner Helpline</p>
                <p className="text-sm text-gray-500">+91 905 7567 160</p>
                <p className="text-xs text-gray-400 mt-1">8 AM – 10 PM IST</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} onRegisterContractor={() => onNavigate('register-contractor')} />
    </div>
  );
}
