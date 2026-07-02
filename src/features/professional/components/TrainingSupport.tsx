import { ArrowLeft, BookOpen, Users, Video, Award, CheckCircle, Wrench, MessageCircle, FileText } from 'lucide-react';

interface TrainingSupportProps {
  onBack: () => void;
  onRegister: () => void;
}

export function TrainingSupport({ onBack, onRegister }: TrainingSupportProps) {
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
          <h1 className="mb-6">Training & Support</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Comprehensive training programs and dedicated support to help you succeed. 
            We invest in your growth because your success is our success.
          </p>
        </div>
      </div>

      {/* Training Programs */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Training Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Continuous learning opportunities to enhance your skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#2563EB] rounded-lg w-fit mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Onboarding Training</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive orientation program for new professionals
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Platform navigation & tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Job acceptance process</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Payment & billing system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Quality standards overview</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#2563EB] rounded-lg w-fit mb-4">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Technical Skills</h3>
              <p className="text-gray-600 mb-4">
                Advanced training in your service domain
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Latest tools & techniques</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Safety protocols & standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Problem-solving methods</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Industry best practices</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#2563EB] rounded-lg w-fit mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Customer Service</h3>
              <p className="text-gray-600 mb-4">
                Build lasting relationships with customers
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Professional communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Handling complaints gracefully</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Building trust & rapport</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Exceeding expectations</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#2563EB] rounded-lg w-fit mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Video Tutorials</h3>
              <p className="text-gray-600 mb-4">
                Learn at your own pace with video content
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Step-by-step guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Real-world scenarios</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Expert demonstrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Available 24/7 online</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#2563EB] rounded-lg w-fit mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Certification Programs</h3>
              <p className="text-gray-600 mb-4">
                Earn recognized certifications
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>VisvasaHome certified badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Safety certifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Specialty skill badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Premium professional status</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <div className="p-4 bg-[#2563EB] rounded-lg w-fit mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">Resource Library</h3>
              <p className="text-gray-600 mb-4">
                Access guides, manuals, and resources
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Service manuals & guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Quality checklists</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Troubleshooting guides</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span>Download & print materials</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Support Services */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">24/7 Support Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're always here when you need us
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="mb-3">Dedicated Support Team</h3>
                  <p className="text-gray-600 mb-4">
                    Get help whenever you need it from our professional support team
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span>24/7 phone support hotline</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span>Live chat assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span>Email support within 2 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span>WhatsApp support group</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <Users className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div>
                  <h3 className="mb-3">Community Support</h3>
                  <p className="text-gray-600 mb-4">
                    Learn from and connect with fellow professionals
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span>Professional community forums</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span>Local meetups & events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span>Peer mentorship program</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                      <span>Share tips & best practices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#2563EB] to-[#1E40AF] rounded-xl p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-2">24/7</div>
                <p className="text-blue-100">Available Support</p>
              </div>
              <div>
                <div className="text-4xl mb-2">&lt;2h</div>
                <p className="text-blue-100">Average Response Time</p>
              </div>
              <div>
                <div className="text-4xl mb-2">98%</div>
                <p className="text-blue-100">Issue Resolution Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workshop Schedule */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">Upcoming Workshops</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join live training sessions and workshops
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#2563EB]">
              <div className="flex items-start justify-between mb-3">
                <h4>Customer Service Excellence</h4>
                <span className="px-3 py-1 bg-blue-100 text-[#2563EB] text-sm rounded-full">Free</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Learn advanced customer service techniques to build lasting relationships
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📅 Every Saturday</span>
                <span>🕐 10:00 AM</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#2563EB]">
              <div className="flex items-start justify-between mb-3">
                <h4>Safety Standards & Protocols</h4>
                <span className="px-3 py-1 bg-blue-100 text-[#2563EB] text-sm rounded-full">Free</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Essential safety training for all service professionals
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📅 1st Sunday</span>
                <span>🕐 11:00 AM</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#2563EB]">
              <div className="flex items-start justify-between mb-3">
                <h4>Digital Tools for Professionals</h4>
                <span className="px-3 py-1 bg-blue-100 text-[#2563EB] text-sm rounded-full">Free</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Master the VisvasaHome app and other digital tools
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📅 Every Tuesday</span>
                <span>🕐 6:00 PM</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-[#2563EB]">
              <div className="flex items-start justify-between mb-3">
                <h4>Business Growth Strategies</h4>
                <span className="px-3 py-1 bg-blue-100 text-[#2563EB] text-sm rounded-full">Free</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Learn how to grow your income and build your professional brand
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📅 2nd Saturday</span>
                <span>🕐 2:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-[#2563EB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mb-4">Ready to Grow Your Skills?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join VisvasaHome and access world-class training and support
          </p>
          <button 
            onClick={onRegister}
            className="px-8 py-4 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
}
