import { ArrowLeft, Users, TrendingUp, Shield, Star, CheckCircle, Briefcase } from 'lucide-react';

interface JoinProfessionalProps {
  onBack: () => void;
  onRegister: () => void;
}

export function JoinProfessional({ onBack, onRegister }: JoinProfessionalProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#F26522] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#F26522] to-[#c2400c] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-6">Join VisvasaHome Professional Network</h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto mb-8">
            Build a sustainable career with fair income, real relationships, and long-term growth.
            This is not a gig treadmill—this is a professional ecosystem.
          </p>
          <button
            onClick={onRegister}
            className="px-8 py-4 bg-white text-[#F26522] rounded-lg hover:bg-orange-50 transition-colors"
          >
            Start Your Application
          </button>
        </div>
      </div>

      {/* Why Join Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Why Join VisvasaHome?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building a platform where skilled professionals thrive
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#F26522] rounded-lg w-fit mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Local Customer Base</h3>
              <p className="text-gray-600">
                Build your reputation in your community. Become the go-to professional in your neighborhood with consistent local work.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#F26522] rounded-lg w-fit mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Fair Pricing Protection</h3>
              <p className="text-gray-600">
                No race to the bottom. Set fair prices that reflect your skills and experience. We protect your earnings.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#F26522] rounded-lg w-fit mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Build Your Brand</h3>
              <p className="text-gray-600">
                Create a professional profile, showcase your work, and build lasting relationships with customers who value quality.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#F26522] rounded-lg w-fit mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Project Diversity</h3>
              <p className="text-gray-600">
                Access both quick jobs and long-term projects. Grow your business sustainably with varied opportunities.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#F26522] rounded-lg w-fit mb-4">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Professional Support</h3>
              <p className="text-gray-600">
                Training, tools, and dedicated support to help you deliver quality service and grow your skills.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#F26522] rounded-lg w-fit mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Long-Term Career</h3>
              <p className="text-gray-600">
                This is a career platform with real growth potential, not just another gig economy hustle.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Who Can Join */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Who Can Join?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We welcome skilled professionals across all service categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              'Electricians & Plumbers',
              'AC & Appliance Technicians',
              'Carpenters & Masons',
              'Painters & Decorators',
              'Cleaners & Housekeepers',
              'Interior Designers',
              'Event Planners',
              'Gardeners & Landscapers',
              'General Contractors',
              'Home Repair Specialists',
              'Personal Trainers & Coaches'
            ].map((profession, index) => (
              <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200">
                <CheckCircle className="w-5 h-5 text-[#F26522] flex-shrink-0" />
                <span>{profession}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">What You Need</h2>
            <p className="text-xl text-gray-600">
              Simple requirements to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="mb-4">Basic Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F26522] flex-shrink-0 mt-0.5" />
                  <span>Valid government ID proof (Aadhaar/PAN/DL)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F26522] flex-shrink-0 mt-0.5" />
                  <span>Active mobile number and email</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F26522] flex-shrink-0 mt-0.5" />
                  <span>Proof of address (current residence)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F26522] flex-shrink-0 mt-0.5" />
                  <span>Professional photo for profile</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4">Professional Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F26522] flex-shrink-0 mt-0.5" />
                  <span>Minimum 1 year relevant experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F26522] flex-shrink-0 mt-0.5" />
                  <span>Work samples or portfolio (optional)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F26522] flex-shrink-0 mt-0.5" />
                  <span>Relevant certifications (if applicable)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F26522] flex-shrink-0 mt-0.5" />
                  <span>Commitment to quality service</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Process */}
      <div className="py-20 bg-gradient-to-br from-[#F26522] to-[#c2400c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Simple Registration Process</h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Get started in just 3 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white text-[#F26522] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="mb-3">Submit Application</h3>
              <p className="text-orange-100">
                Fill in your personal details, professional information, and upload required documents
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white text-[#F26522] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="mb-3">Verification</h3>
              <p className="text-orange-100">
                Our team verifies your documents and conducts a brief background check (2-3 days)
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white text-[#F26522] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="mb-3">Start Working</h3>
              <p className="text-orange-100">
                Once approved, complete your profile and start receiving service requests immediately
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={onRegister}
              className="px-8 py-4 bg-white text-[#F26522] rounded-lg hover:bg-orange-50 transition-colors"
            >
              Register Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
