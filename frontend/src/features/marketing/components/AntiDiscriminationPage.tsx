import { Shield, Users, AlertCircle, CheckCircle, Mail, Phone, ArrowLeft } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface AntiDiscriminationPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const principles = [
  {
    icon: Users,
    title: 'Equal Access for All Customers',
    body: 'VisvasaHome is committed to providing equal access to all customers regardless of race, caste, religion, gender, age, disability, sexual orientation, national origin, or any other protected characteristic. All customers deserve the same high quality of service.',
  },
  {
    icon: Shield,
    title: 'Zero Tolerance Policy',
    body: 'We maintain a strict zero-tolerance policy against discrimination of any kind. Any service professional or employee found to have discriminated against a customer, colleague, or community member will face immediate action, up to and including removal from the platform.',
  },
  {
    icon: CheckCircle,
    title: 'Inclusive Professional Network',
    body: 'We welcome and support service professionals from all backgrounds. Decisions about professional onboarding, assignment, and ratings are based solely on verified skills, experience, reliability, and quality of work — never on personal characteristics.',
  },
  {
    icon: AlertCircle,
    title: 'Reporting & Accountability',
    body: 'We take all discrimination reports seriously. Every complaint receives prompt investigation by our Trust & Safety team. We maintain confidentiality, protect reporters from retaliation, and communicate outcomes transparently.',
  },
];

const protectedCategories = [
  'Race, Color, Ethnicity', 'Caste or Social Origin', 'Religion or Belief',
  'Gender Identity or Expression', 'Sexual Orientation', 'Age',
  'Disability or Health Status', 'National Origin or Citizenship',
  'Marital or Family Status', 'Economic Background', 'Language',
];

export function AntiDiscriminationPage({ onBack, onNavigate }: AntiDiscriminationPageProps) {
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
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl mb-3" style={{ fontWeight: 700 }}>Anti-Discrimination Policy</h1>
              <p className="text-white/80 text-lg">VisvasaHome is built on inclusion, respect, and equal treatment for everyone in our community.</p>
              <p className="text-white/60 text-sm mt-3">Effective Date: January 1, 2024 · Last Updated: June 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Statement */}
      <section className="py-12 bg-blue-50 border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <blockquote className="text-xl text-gray-800 leading-relaxed text-center italic">
            "At VisvasaHome, we believe every person — whether a customer seeking services or a professional building their livelihood — deserves to be treated with dignity and respect, free from discrimination of any kind."
          </blockquote>
          <p className="text-center text-gray-500 text-sm mt-3">— Kunal Mittal, Founder, VisvasaHome</p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-8" style={{ fontWeight: 700 }}>Our Core Commitments</h2>
          <div className="space-y-6">
            {principles.map((item, i) => (
              <div key={i} className="flex gap-5 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2" style={{ fontWeight: 600 }}>{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Protected Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-3" style={{ fontWeight: 700 }}>Protected Characteristics</h2>
          <p className="text-gray-600 mb-8">VisvasaHome does not tolerate discrimination based on, but not limited to, the following characteristics:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {protectedCategories.map((cat) => (
              <div key={cat} className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-gray-200">
                <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                <span className="text-gray-700 text-sm">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prohibited Conduct */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>Prohibited Conduct</h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>The following behaviors are strictly prohibited on the VisvasaHome platform and within our community:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Refusing or declining to provide service based on a customer's protected characteristics</li>
              <li>Using offensive, derogatory, or discriminatory language toward any platform user</li>
              <li>Rating or reviewing a professional based on personal characteristics rather than service quality</li>
              <li>Requesting or requiring information about a customer's religion, caste, or other protected characteristic as a condition for service</li>
              <li>Harassing or intimidating any user based on protected characteristics</li>
              <li>Creating or sharing content that demeans or stereotypes any group</li>
            </ul>
            <p className="mt-4">Violations may result in account suspension, permanent ban from the platform, and/or reporting to relevant legal authorities where applicable.</p>
          </div>
        </div>
      </section>

      {/* How to Report */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>How to Report a Violation</h2>
          <p className="text-gray-600 mb-6 text-sm">If you experience or witness discriminatory behavior on our platform, please report it immediately. All reports are treated confidentially.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a href="mailto:trust@visvasahome.com" className="flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-[#2563EB] transition-colors group">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                <Mail className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontWeight: 600 }}>Email Trust & Safety</p>
                <p className="text-sm text-gray-500">trust@visvasahome.com</p>
                <p className="text-xs text-gray-400 mt-1">Response within 24 hours</p>
              </div>
            </a>
            <a href="tel:+919057567160" className="flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-200 hover:border-[#2563EB] transition-colors group">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
                <Phone className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontWeight: 600 }}>Call Support</p>
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
