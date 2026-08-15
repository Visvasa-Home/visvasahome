import { ArrowLeft, CheckCircle2, XCircle, Clock, TrendingUp, Users, Shield, Star, Zap, Building2, Home, Award, Target, DollarSign, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface CompetitiveAnalysisPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

type CompetitorTab = 'urban-company' | 'housejoy' | 'pronto' | 'comparison';

export function CompetitiveAnalysisPage({ onBack, onNavigate }: CompetitiveAnalysisPageProps) {
  const [activeTab, setActiveTab] = useState<CompetitorTab>('comparison');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Competitive Analysis</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'comparison'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Feature Comparison
            </button>
            <button
              onClick={() => setActiveTab('urban-company')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'urban-company'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Urban Company
            </button>
            <button
              onClick={() => setActiveTab('housejoy')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'housejoy'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Housejoy
            </button>
            <button
              onClick={() => setActiveTab('pronto')}
              className={`px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'pronto'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Pronto (Case Study)
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'comparison' && <ComparisonView onNavigate={onNavigate} />}
        {activeTab === 'urban-company' && <UrbanCompanyView />}
        {activeTab === 'housejoy' && <HousejoyView />}
        {activeTab === 'pronto' && <ProntoView />}
      </div>
    </div>
  );
}

function ComparisonView({ onNavigate }: { onNavigate: (page: string) => void }) {
  const features = [
    {
      category: 'Service Offerings',
      items: [
        { name: 'Total Service Categories', visvasahome: '10+', urbanCompany: '15+', housejoy: '12+', pronto: '8 (defunct)' },
        { name: 'AMC Segments', visvasahome: '8 Segments', urbanCompany: '1 (Basic)', housejoy: 'Limited', pronto: 'None', highlight: true },
        { name: 'Home Services', visvasahome: true, urbanCompany: true, housejoy: true, pronto: false },
        { name: 'B2B/Enterprise AMC', visvasahome: true, urbanCompany: false, housejoy: false, pronto: false, highlight: true },
      ]
    },
    {
      category: 'Technology & Features',
      items: [
        { name: 'Real-Time Tracking', visvasahome: 'Live GPS Enabled', urbanCompany: true, housejoy: false, pronto: false, highlight: true },
        { name: 'WhatsApp OTP Login', visvasahome: true, urbanCompany: false, housejoy: false, pronto: false },
        { name: 'In-App Chat', visvasahome: 'Live Chat Support', urbanCompany: true, housejoy: false, pronto: false },
        { name: 'Mobile App', visvasahome: 'PWA Ready', urbanCompany: '50M+ downloads', housejoy: '5M+ downloads', pronto: 'Shut down' },
        { name: 'SEO Optimized', visvasahome: true, urbanCompany: true, housejoy: 'Medium', pronto: false, highlight: true },
      ]
    },
    {
      category: 'Trust & Quality',
      items: [
        { name: 'Professional Vetting', visvasahome: '5-Stage Process', urbanCompany: '7-Stage Process', housejoy: 'Basic', pronto: 'Minimal' },
        { name: 'Service Guarantee', visvasahome: '90-Day Warranty', urbanCompany: 'Money-back', housejoy: '7-Day', pronto: 'None' },
        { name: 'Transparent Pricing', visvasahome: true, urbanCompany: true, housejoy: true, pronto: false, highlight: true },
        { name: 'Founder Visibility', visvasahome: 'High', urbanCompany: 'Medium', housejoy: 'Low', pronto: 'Low', highlight: true },
      ]
    },
    {
      category: 'Market Presence',
      items: [
        { name: 'City Coverage', visvasahome: 'Launching', urbanCompany: '40+ cities', housejoy: '15+ cities', pronto: '0 (defunct)' },
        { name: 'Professional Network', visvasahome: 'Building', urbanCompany: '50,000+', housejoy: '10,000+', pronto: '0' },
        { name: 'Completed Services', visvasahome: 'Starting', urbanCompany: '10M+ per year', housejoy: '2M+ per year', pronto: '0' },
        { name: 'Market Focus', visvasahome: 'Tier-2 Cities + AMC', urbanCompany: 'Metro Cities', housejoy: 'Tier-1/2', pronto: 'Failed', highlight: true },
      ]
    },
    {
      category: 'Pricing & Business Model',
      items: [
        { name: 'Commission to Partners', visvasahome: '15-25% (Category-based)', urbanCompany: '20-30%', housejoy: '18-25%', pronto: 'N/A', highlight: true },
        { name: 'Subscription Plans', visvasahome: 'Visvasa Plus + AMC', urbanCompany: 'UC Shield', housejoy: 'HJ Care', pronto: 'None' },
        { name: 'Payment Options', visvasahome: 'UPI / Cards / Escrow Wallet', urbanCompany: 'UPI/Cards/EMI', housejoy: 'UPI/Cards', pronto: 'Limited' },
        { name: 'Dynamic Pricing', visvasahome: 'Log-Ratio Surge Pricing', urbanCompany: 'Surge Pricing', housejoy: 'Fixed', pronto: 'Discounts', highlight: true },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Building2 className="w-8 h-8" />
            <h3 className="font-semibold">VisvasaHome</h3>
          </div>
          <p className="text-2xl font-bold mb-2">8 AMC Segments</p>
          <p className="text-blue-100 text-sm">Unique competitive advantage in B2B contracts</p>
          <div className="mt-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium">AMC Market Leader</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-8 h-8 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Urban Company</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">Market Leader</p>
          <p className="text-gray-600 text-sm">50,000+ professionals, 40+ cities, ₹2.1B valuation</p>
          <div className="mt-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">10M+ services/year</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Home className="w-8 h-8 text-green-600" />
            <h3 className="font-semibold text-gray-900">Housejoy</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">Second Tier</p>
          <p className="text-gray-600 text-sm">15+ cities, struggled with profitability</p>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Budget option</span>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-6 border border-gray-300">
          <div className="flex items-center gap-3 mb-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <h3 className="font-semibold text-gray-900">Pronto</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">Failed (2019)</p>
          <p className="text-gray-600 text-sm">Case study in what NOT to do</p>
          <div className="mt-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Lessons learned</span>
          </div>
        </div>
      </div>

      {/* Our Competitive Advantages */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-6 h-6 text-green-600" />
          VisvasaHome's Unique Strengths
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">8 Specialized AMC Segments</h3>
              <p className="text-sm text-gray-700">Home, Office, Commercial, Industrial, Healthcare, Educational, Hospitality, Society — competitors only have basic home AMC</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Trust-First Brand Identity</h3>
              <p className="text-sm text-gray-700">Clear positioning: "Trust, Delivered Locally" with strong founder visibility building credibility</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Tier-2 City Strategy</h3>
              <p className="text-sm text-gray-700">Smart positioning in tier-2 cities before Urban Company enters these markets</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Fair Partner Commission</h3>
              <p className="text-sm text-gray-700">15-20% commission vs Urban Company's 20-30% — better value for professional partners</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Comprehensive SEO Strategy</h3>
              <p className="text-sm text-gray-700">30+ optimized pages, educational content, blog, guides — strong organic visibility</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Transparent Pricing Model</h3>
              <p className="text-sm text-gray-700">Clear AMC tiers (Basic, Standard, Premium, Enterprise) with no hidden charges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison Tables */}
      {features.map((section) => (
        <div key={section.category} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{section.category}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Feature</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-[#2563EB] bg-blue-50">VisvasaHome</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Urban Company</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Housejoy</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">Pronto</th>
                </tr>
              </thead>
              <tbody>
                {section.items.map((item, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-gray-100 ${item.highlight ? 'bg-green-50' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {item.name}
                      {item.highlight && (
                        <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
                          <Star className="w-3 h-3" />
                          Advantage
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm bg-blue-50">
                      {typeof item.visvasahome === 'boolean' ? (
                        item.visvasahome ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="font-medium text-gray-900">{item.visvasahome}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {typeof item.urbanCompany === 'boolean' ? (
                        item.urbanCompany ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{item.urbanCompany}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {typeof item.housejoy === 'boolean' ? (
                        item.housejoy ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{item.housejoy}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {typeof item.pronto === 'boolean' ? (
                        item.pronto ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700">{item.pronto}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] rounded-xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Experience the VisvasaHome Difference</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          With 8 specialized AMC segments, transparent pricing, and a trust-first approach, we're redefining local services in tier-2 India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('get-started-customer')}
            className="px-8 py-3 bg-white text-[#2563EB] font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Book a Service
          </button>
          <button
            onClick={() => onNavigate('professional-register')}
            className="px-8 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors border-2 border-[#2563EB]"
          >
            Join as Professional
          </button>
        </div>
      </div>
    </div>
  );
}

function UrbanCompanyView() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Urban Company</h2>
            <p className="text-gray-600">Market leader in India's local services marketplace</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-600 mb-1">Founded</p>
            <p className="text-xl font-bold text-gray-900">2014</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Valuation</p>
            <p className="text-xl font-bold text-gray-900">₹2.1B+</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Cities</p>
            <p className="text-xl font-bold text-gray-900">40+</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Professionals</p>
            <p className="text-xl font-bold text-gray-900">50,000+</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Key Strengths
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>15+ service categories with deep market penetration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>50M+ app downloads, strong brand recognition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Real-time tracking, in-app chat, AI-powered matching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>7-stage professional vetting process with UC Academy training</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>UC Shield subscription for recurring revenue (₹999-4,999/month)</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Weaknesses
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>High commission rates (20-30%) leading to partner dissatisfaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Limited AMC focus — only basic home maintenance contracts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Weak B2B/enterprise AMC offerings (Office, Industrial, Healthcare)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Inconsistent service quality across cities and professionals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Reports of hidden charges and unclear cancellation policies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">How VisvasaHome Competes</h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start gap-2">
            <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span><strong>8 AMC Segments:</strong> We offer comprehensive AMC across Home, Office, Commercial, Industrial, Healthcare, Educational, Hospitality, and Society — Urban Company only has basic home AMC</span>
          </p>
          <p className="flex items-start gap-2">
            <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span><strong>Fair Partner Commission:</strong> 15-20% vs their 20-30% — better value for professionals means better service quality</span>
          </p>
          <p className="flex items-start gap-2">
            <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span><strong>Tier-2 Focus:</strong> We target tier-2 cities where UC has less presence, building local trust before they enter</span>
          </p>
          <p className="flex items-start gap-2">
            <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span><strong>Transparent Pricing:</strong> Clear pricing tiers with no hidden charges or surge pricing</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function HousejoyView() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Housejoy</h2>
            <p className="text-gray-600">Second-tier player with profitability challenges</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-600 mb-1">Founded</p>
            <p className="text-xl font-bold text-gray-900">2014</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Funding</p>
            <p className="text-xl font-bold text-gray-900">$40M+</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Cities</p>
            <p className="text-xl font-bold text-gray-900">15+</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <p className="text-xl font-bold text-blue-600">Struggling</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Key Strengths
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>12+ service categories including interior design focus</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Standardized pricing with fixed rates (less dynamic pricing)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>HJ Care subscription plans (₹799-2,499/month)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Wedding services hub — one-stop for wedding-related needs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Corporate tie-ups for B2B employee benefits</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Weaknesses
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Limited city coverage — reduced from 20+ to 15 cities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Inconsistent service availability in tier-2 cities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Outdated app with slower performance and infrequent updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Brand perception as "budget" option with lower quality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>No real-time tracking — professionals often delay without notification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>High professional churn rate and slow customer support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">How VisvasaHome Competes</h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start gap-2">
            <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span><strong>Better Technology:</strong> Modern React stack, SEO-optimized, mobile-responsive design vs Housejoy's outdated app</span>
          </p>
          <p className="flex items-start gap-2">
            <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span><strong>Premium Positioning:</strong> Trust-first brand vs "budget" perception — we compete on quality, not price</span>
          </p>
          <p className="flex items-start gap-2">
            <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span><strong>AMC Differentiation:</strong> 8 specialized AMC segments vs Housejoy's limited AMC offerings</span>
          </p>
          <p className="flex items-start gap-2">
            <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <span><strong>Professional Retention:</strong> Fair commission and training programs to reduce churn</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ProntoView() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pronto (Case Study)</h2>
            <p className="text-gray-600">Failed startup — shut down in 2019 after burning $6M</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-medium">⚠️ Pronto shut down in 2019. This is a case study in what NOT to do when building a local services platform.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-sm text-gray-600 mb-1">Founded</p>
            <p className="text-xl font-bold text-gray-900">2015</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Shut Down</p>
            <p className="text-xl font-bold text-red-600">2019</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Funding Raised</p>
            <p className="text-xl font-bold text-gray-900">$6M</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Outcome</p>
            <p className="text-xl font-bold text-red-600">Failed</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Why Pronto Failed: Critical Mistakes
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">1.</span>
                <span><strong>No Quality Control:</strong> Minimal vetting of service professionals led to unreliable service delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">2.</span>
                <span><strong>Poor Unit Economics:</strong> Customer acquisition cost exceeded lifetime value — unsustainable business model</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">3.</span>
                <span><strong>Inconsistent Supply:</strong> Professionals often didn't show up, destroying customer trust</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">4.</span>
                <span><strong>No Differentiation:</strong> Nothing unique compared to Urban Company — just another clone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">5.</span>
                <span><strong>Weak Technology:</strong> App crashed frequently, terrible user experience drove customers away</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">6.</span>
                <span><strong>Geographic Overexpansion:</strong> Tried to scale too fast without city-level profitability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">7.</span>
                <span><strong>Price Wars:</strong> Aggressive discounting eroded margins and attracted wrong customer segment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">8.</span>
                <span><strong>Partner Dissatisfaction:</strong> Low payouts led to high professional attrition</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">9.</span>
                <span><strong>No Customer Loyalty:</strong> No repeat usage, extremely high customer churn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1 font-bold">10.</span>
                <span><strong>Lack of Focus:</strong> Tried too many service categories without mastering any</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          Lessons Learned: How VisvasaHome Avoids Pronto's Mistakes
        </h3>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>Quality First:</strong> 5-stage professional vetting process ensures reliable service delivery</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>AMC Differentiation:</strong> 8 specialized AMC segments — clear competitive advantage vs generic services</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>Controlled Expansion:</strong> Launch in Jaipur, prove model works, then expand methodically to tier-2 cities</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>Fair Partner Economics:</strong> 15-20% commission vs low payouts — retain quality professionals</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>No Discount Wars:</strong> Compete on trust and quality, not aggressive discounting</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>Modern Technology:</strong> React + Tailwind stack, SEO-optimized, mobile-responsive — reliable platform</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>Customer Loyalty via AMC:</strong> Recurring contracts build long-term relationships, not one-time transactions</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <span><strong>Focus:</strong> Master AMC model before expanding to too many one-time service categories</span>
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-yellow-600" />
          Key Takeaway
        </h3>
        <p className="text-gray-700">
          Pronto's failure shows that <strong>technology and funding alone don't guarantee success</strong>. You need: (1) Clear differentiation, (2) Quality control, (3) Fair partner economics, (4) Customer loyalty mechanisms, and (5) Controlled expansion. VisvasaHome's AMC-first approach addresses all these lessons.
        </p>
      </div>
    </div>
  );
}
