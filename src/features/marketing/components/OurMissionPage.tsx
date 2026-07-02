import { ArrowLeft, Target, Compass, Eye, Lightbulb, Users2, Globe, Award, TrendingUp } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface OurMissionPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function OurMissionPage({ onBack, onNavigate }: OurMissionPageProps) {
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
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-20">
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
              <span className="text-sm">Our Purpose & Direction</span>
            </div>
            <h1 className="mb-6">Our Mission</h1>
            <p className="text-xl text-blue-50 leading-relaxed">
              To make local services organized, accountable, and dependable—connecting verified professionals with communities that value quality and trust.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#2563EB] rounded-full mb-6">
                <Target className="w-4 h-4" />
                <span className="text-sm">Mission</span>
              </div>
              <h2 className="mb-6">What We Stand For</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                VisvasaHome exists to make local services organized, accountable, and dependable. We connect customers with verified local professionals, ensuring quality-controlled services and transparent experiences at every step.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Every service booked through VisvasaHome is backed by verification, clear processes, and human accountability. We stand behind every service experience.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our mission is not just about convenience—it's about building a foundation of trust between communities and the professionals who serve them.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-amber-50 rounded-2xl p-8 lg:p-12">
              <h3 className="mb-6">Our Commitments</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <Users2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1">To Customers</h4>
                    <p className="text-sm text-gray-600">
                      Verified professionals, transparent pricing, and quality assurance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1">To Professionals</h4>
                    <p className="text-sm text-gray-600">
                      Fair opportunities, skill development, and sustainable income
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1">To Communities</h4>
                    <p className="text-sm text-gray-600">
                      Local empowerment, economic growth, and strengthened trust
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
              <h3 className="mb-6">How We Achieve Our Mission</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-[#2563EB]">1</span>
                    </div>
                    <h4>Rigorous Verification</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    Every professional undergoes background checks and skill assessments
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-[#2563EB]">2</span>
                    </div>
                    <h4>Transparent Processes</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    Clear pricing, defined scopes, and honest communication at every step
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-[#2563EB]">3</span>
                    </div>
                    <h4>Continuous Monitoring</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    Quality checks and customer feedback ensure consistent excellence
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-[#2563EB]">4</span>
                    </div>
                    <h4>Professional Development</h4>
                  </div>
                  <p className="text-sm text-gray-600 ml-11">
                    Training, tools, and support to help professionals grow their careers
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full mb-6">
                <Eye className="w-4 h-4" />
                <span className="text-sm">Vision</span>
              </div>
              <h2 className="mb-6">Our Vision</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We envision a future where skilled local professionals are empowered with the tools, systems, and support they need to build sustainable careers while serving their communities with pride.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                A future where customers don't have to worry about service quality, pricing transparency, or professional reliability—because trust is the foundation of every interaction.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Trust, delivered locally – that's not just our tagline, it's our commitment to every customer and professional in our network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Goals */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="mb-4">Our Impact Goals</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We measure our success by the positive impact we create for customers, professionals, and communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="inline-flex p-4 bg-white rounded-full mb-4">
                <Lightbulb className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="mb-3">Innovation</h3>
              <p className="text-gray-700 leading-relaxed">
                Continuously improving our platform to make service delivery more efficient, transparent, and accessible
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-8 text-center">
              <div className="inline-flex p-4 bg-white rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="mb-3">Growth</h3>
              <p className="text-gray-700 leading-relaxed">
                Expanding our network to empower more professionals and serve more communities across regions
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="inline-flex p-4 bg-white rounded-full mb-4">
                <Compass className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h3 className="mb-3">Leadership</h3>
              <p className="text-gray-700 leading-relaxed">
                Setting new standards for trust, quality, and accountability in the local services industry
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] rounded-2xl p-12 text-white text-center">
            <h2 className="mb-4">Join Our Mission</h2>
            <p className="text-xl text-blue-50 mb-8 max-w-3xl mx-auto leading-relaxed">
              Whether you're a customer seeking reliable services or a professional ready to grow your career, you have a place in the VisvasaHome community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('get-started-customer')}
                className="px-8 py-4 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors"
              >
                Book a Service
              </button>
              <button
                onClick={() => onNavigate('register-contractor')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Join as Professional
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}
