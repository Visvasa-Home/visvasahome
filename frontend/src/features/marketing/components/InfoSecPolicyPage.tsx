import { Lock, Shield, Server, Eye, AlertTriangle, CheckCircle, Mail, ArrowLeft, Key, Globe, Database } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface InfoSecPolicyPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const objectives = [
  { icon: Lock, title: 'Confidentiality', desc: 'Ensuring that information is accessible only to those authorized to have access.' },
  { icon: Shield, title: 'Integrity', desc: 'Safeguarding the accuracy and completeness of information and processing methods.' },
  { icon: Server, title: 'Availability', desc: 'Ensuring that authorized users have access to information and associated assets when required.' },
  { icon: Eye, title: 'Accountability', desc: 'Maintaining audit trails and accountability for all information security events.' },
];

const controls = [
  {
    category: 'Access Control',
    icon: Key,
    items: [
      'Role-based access control (RBAC) for all systems',
      'Multi-factor authentication (MFA) for admin accounts',
      'Principle of least privilege enforced throughout',
      'Regular access reviews and privilege revocations',
    ],
  },
  {
    category: 'Data Protection',
    icon: Database,
    items: [
      'All data encrypted at rest using AES-256',
      'Data in transit encrypted via TLS 1.3+',
      'Personal data anonymized in non-production environments',
      'Data retention policies aligned with legal requirements',
    ],
  },
  {
    category: 'Network Security',
    icon: Globe,
    items: [
      'Web Application Firewall (WAF) protection',
      'Regular vulnerability assessments and penetration testing',
      'DDoS protection on all public-facing endpoints',
      'Intrusion detection and prevention systems',
    ],
  },
  {
    category: 'Incident Response',
    icon: AlertTriangle,
    items: [
      'Defined incident classification and escalation procedures',
      'Security incident response team on call 24/7',
      'Customer notification within 72 hours of confirmed breach',
      'Post-incident review and remediation tracking',
    ],
  },
];

export function InfoSecPolicyPage({ onBack, onNavigate }: InfoSecPolicyPageProps) {
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
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl mb-3" style={{ fontWeight: 700 }}>Information Security Policy</h1>
              <p className="text-white/80 text-lg">Our statement and objectives for protecting information assets across the VisvasaHome platform</p>
              <p className="text-white/60 text-sm mt-3">Effective Date: January 1, 2024 · Version 2.1 · Last Updated: June 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Statement */}
      <section className="py-12 bg-blue-50 border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg text-gray-900 mb-3" style={{ fontWeight: 700 }}>Policy Statement</h2>
          <p className="text-gray-700 leading-relaxed">
            VisvasaHome Private Limited is committed to protecting the confidentiality, integrity, and availability of all information assets under its control. This policy establishes the framework for managing information security risks across our platform, products, and operations. All employees, contractors, vendors, and partners who access VisvasaHome systems and data are bound by this policy.
          </p>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-8" style={{ fontWeight: 700 }}>Security Objectives</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {objectives.map((obj) => (
              <div key={obj.title} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <obj.icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-gray-900 mb-2 text-sm" style={{ fontWeight: 600 }}>{obj.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Controls */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-3" style={{ fontWeight: 700 }}>Security Controls & Measures</h2>
          <p className="text-gray-500 mb-10">VisvasaHome implements layered security controls aligned with industry best practices and applicable regulations including IT Act 2000, DPDP Act 2023, and ISO/IEC 27001 principles.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {controls.map((ctrl) => (
              <div key={ctrl.category} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <ctrl.icon className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="text-gray-900" style={{ fontWeight: 600 }}>{ctrl.category}</h3>
                </div>
                <ul className="space-y-2">
                  {ctrl.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsibilities */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-6" style={{ fontWeight: 700 }}>Roles & Responsibilities</h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-gray-900 mb-2" style={{ fontWeight: 600 }}>Chief Information Security Officer (CISO)</h4>
              <p>Owns overall information security strategy, policy framework, risk management, and compliance oversight. Reports directly to the CEO.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-gray-900 mb-2" style={{ fontWeight: 600 }}>Engineering & Product Teams</h4>
              <p>Responsible for implementing security by design in all products, conducting code reviews for security vulnerabilities, and promptly addressing security issues in their domains.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h4 className="text-gray-900 mb-2" style={{ fontWeight: 600 }}>All Employees & Contractors</h4>
              <p>Must adhere to this policy, complete mandatory security awareness training, report suspected incidents promptly, and protect credentials and access at all times.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>Security Contact</h2>
          <p className="text-gray-600 text-sm mb-6">To report a security vulnerability, suspected breach, or policy concern, contact our security team directly.</p>
          <a href="mailto:security@visvasahome.com" className="inline-flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-gray-200 hover:border-[#2563EB] transition-colors group shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-[#2563EB] transition-colors">
              <Mail className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-gray-900" style={{ fontWeight: 600 }}>security@visvasahome.com</p>
              <p className="text-xs text-gray-500">Responsible disclosure welcomed · PGP key available on request</p>
            </div>
          </a>
        </div>
      </section>

      <Footer onNavigate={onNavigate} onRegisterContractor={() => onNavigate('register-contractor')} />
    </div>
  );
}
