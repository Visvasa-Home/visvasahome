import { ArrowLeft, DollarSign, Users, TrendingUp, Shield, Clock, Award, BookOpen, Heart } from 'lucide-react';

interface BenefitsPageProps {
  onBack: () => void;
  onRegister: () => void;
}

export function BenefitsPage({ onBack, onRegister }: BenefitsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1E40AF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-6">Contractor Benefits</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            VisvasaHome isn't just a platform—it's your career partner. 
            Discover how we support your professional growth.
          </p>
        </div>
      </div>

      {/* Financial Benefits */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Financial Benefits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earn fairly and grow your income sustainably
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-xl p-8 border border-blue-200">
              <div className="p-4 bg-[#2563EB] rounded-lg w-fit mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Fair Pricing Model</h3>
              <p className="text-gray-700 mb-4">
                Set your own rates based on your skills and experience. No race to the bottom.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Transparent pricing structure</li>
                <li>• No hidden deductions</li>
                <li>• Protection from undercutting</li>
                <li>• Premium service tier option</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-xl p-8 border border-blue-200">
              <div className="p-4 bg-[#2563EB] rounded-lg w-fit mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Timely Payments</h3>
              <p className="text-gray-700 mb-4">
                Get paid on time, every time. Direct bank transfers within 24-48 hours.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Weekly payment cycles</li>
                <li>• Direct bank deposits</li>
                <li>• Payment tracking dashboard</li>
                <li>• Earnings history & reports</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-xl p-8 border border-blue-200">
              <div className="p-4 bg-[#2563EB] rounded-lg w-fit mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Income Growth</h3>
              <p className="text-gray-700 mb-4">
                Build your income steadily with repeat customers and premium projects.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Performance bonuses</li>
                <li>• Loyalty rewards program</li>
                <li>• Premium job access</li>
                <li>• Referral earnings</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Benefits */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Professional Growth</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tools and support to build your brand
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Users className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="mb-2">Build Your Customer Base</h3>
                  <p className="text-gray-600 mb-4">
                    Develop long-term relationships with customers in your service area
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Local area focus</li>
                    <li>• Repeat customer program</li>
                    <li>• Customer reviews & ratings</li>
                    <li>• Profile visibility boost</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Award className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="mb-2">Professional Recognition</h3>
                  <p className="text-gray-600 mb-4">
                    Get recognized for quality work with badges and certifications
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Quality badges</li>
                    <li>• Top performer status</li>
                    <li>• Service excellence awards</li>
                    <li>• Featured professional listings</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="mb-2">Skill Development</h3>
                  <p className="text-gray-600 mb-4">
                    Access training programs and workshops to enhance your skills
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Free skill training sessions</li>
                    <li>• Industry best practices</li>
                    <li>• Safety certifications</li>
                    <li>• Customer service training</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="mb-2">Business Support</h3>
                  <p className="text-gray-600 mb-4">
                    Get help managing your business with our support tools
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Job scheduling tools</li>
                    <li>• Digital payment receipts</li>
                    <li>• Customer communication</li>
                    <li>• Business analytics dashboard</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Benefits */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Support & Protection</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've got your back
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Heart className="w-10 h-10 text-[#2563EB] mx-auto mb-4" />
              <h4 className="mb-2">Dedicated Support Team</h4>
              <p className="text-sm text-gray-600">
                24/7 support for any issues or queries
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Shield className="w-10 h-10 text-[#2563EB] mx-auto mb-4" />
              <h4 className="mb-2">Insurance Coverage</h4>
              <p className="text-sm text-gray-600">
                Protection for you and your work
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Users className="w-10 h-10 text-[#2563EB] mx-auto mb-4" />
              <h4 className="mb-2">Community Network</h4>
              <p className="text-sm text-gray-600">
                Connect with fellow professionals
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <Award className="w-10 h-10 text-[#2563EB] mx-auto mb-4" />
              <h4 className="mb-2">Quality Standards</h4>
              <p className="text-sm text-gray-600">
                Clear guidelines and quality metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Why VisvasaHome Is Different</h2>
            <p className="text-xl text-gray-300">
              Not just another gig platform
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="mb-4 text-red-400">Other Platforms</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• High commission cuts (20-30%)</li>
                  <li>• Bidding wars and price drops</li>
                  <li>• No long-term relationships</li>
                  <li>• Limited support</li>
                  <li>• Algorithm-based work distribution</li>
                  <li>• Payment delays</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-green-400">VisvasaHome</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Fair, transparent pricing (10-15%)</li>
                  <li>• Protected pricing model</li>
                  <li>• Focus on repeat customers</li>
                  <li>• Dedicated support team</li>
                  <li>• Local area dominance model</li>
                  <li>• Weekly payments guaranteed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-[#2563EB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4">Ready to Experience the Benefits?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals building sustainable careers with VisvasaHome
          </p>
          <button 
            onClick={onRegister}
            className="px-8 py-4 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors"
          >
            Register as Professional
          </button>
        </div>
      </div>
    </div>
  );
}
