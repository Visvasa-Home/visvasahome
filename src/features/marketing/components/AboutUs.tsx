import { Target, Users, Shield, TrendingUp } from 'lucide-react';

export function AboutUs() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-4">About VisvasaHome</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building a trusted ecosystem where local professionals thrive and communities get the quality service they deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="mb-4">Our Mission</h3>
            <p className="text-gray-700 mb-4">
              VisvasaHome exists to make local services organized, accountable, and dependable. We connect customers with verified local professionals, ensuring quality-controlled services and transparent experiences at every step.
            </p>
            <p className="text-gray-700">
              Every service booked through VisvasaHome is backed by verification, clear processes, and human accountability. We stand behind every service experience.
            </p>
          </div>

          <div>
            <h3 className="mb-4">Our Vision</h3>
            <p className="text-gray-700 mb-4">
              We envision a future where skilled local professionals are empowered with the tools, systems, and support they need to build sustainable careers while serving their communities with pride.
            </p>
            <p className="text-gray-700">
              Trust, delivered locally – that's not just our tagline, it's our commitment to every customer and professional in our network.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-center mb-8">Our Core Values</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                <Target className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h4 className="mb-2">Trust</h4>
              <p className="text-sm text-gray-600">
                Built through verification, consistency, and accountability
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                <Users className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h4 className="mb-2">Transparency</h4>
              <p className="text-sm text-gray-600">
                Clear pricing, defined scope, honest communication
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                <Shield className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h4 className="mb-2">Quality</h4>
              <p className="text-sm text-gray-600">
                Structured service standards and continuous monitoring
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 bg-blue-50 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-[#2563EB]" />
              </div>
              <h4 className="mb-2">Empowerment</h4>
              <p className="text-sm text-gray-600">
                Supporting and strengthening local professionals
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#2563EB] to-[#1E40AF] rounded-xl p-8 text-white text-center">
          <h3 className="mb-4">Brand Responsibility</h3>
          <p className="text-lg text-blue-50 max-w-3xl mx-auto">
            VisvasaHome recognizes that trust is built over time. Our identity reflects our responsibility to customers, professionals, and communities. Every touchpoint must reinforce safety, reliability, and accountability.
          </p>
        </div>
      </div>
    </section>
  );
}
