import { ArrowLeft, MapPin, Clock, Briefcase, Users, Target, Award, TrendingUp, Heart, Shield, Zap, Coffee, Laptop, Plane, GraduationCap, Home, DollarSign, Star, Quote } from 'lucide-react';

interface CareersPageProps {
  onBack: () => void;
}

export function CareersPage({ onBack }: CareersPageProps) {
  const openPositions = [
    {
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Jaipur, India',
      type: 'Full-time',
      description: 'Build scalable web applications and APIs for our growing platform',
      experience: '3-5 years',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Jaipur, India',
      type: 'Full-time',
      description: 'Create beautiful, user-friendly experiences for customers and professionals',
      experience: '2-4 years',
    },
    {
      title: 'Mobile App Developer (React Native)',
      department: 'Engineering',
      location: 'Jaipur, India',
      type: 'Full-time',
      description: 'Develop cross-platform mobile applications for iOS and Android',
      experience: '2-4 years',
    },
    {
      title: 'Business Development Manager',
      department: 'Sales',
      location: 'Delhi NCR',
      type: 'Full-time',
      description: 'Drive growth by expanding our service professional network',
      experience: '3-6 years',
    },
    {
      title: 'Operations Manager',
      department: 'Operations',
      location: 'Mumbai',
      type: 'Full-time',
      description: 'Optimize operations and ensure quality service delivery',
      experience: '4-7 years',
    },
    {
      title: 'Digital Marketing Lead',
      department: 'Marketing',
      location: 'Bangalore',
      type: 'Full-time',
      description: 'Lead digital marketing campaigns and growth strategies',
      experience: '3-5 years',
    },
    {
      title: 'Data Analyst',
      department: 'Product',
      location: 'Jaipur, India',
      type: 'Full-time',
      description: 'Analyze user behavior and business metrics to drive product decisions',
      experience: '1-3 years',
    },
    {
      title: 'Customer Success Manager',
      department: 'Operations',
      location: 'Jaipur, India',
      type: 'Full-time',
      description: 'Ensure customer satisfaction and build long-term relationships',
      experience: '2-4 years',
    },
  ];

  const cultureValues = [
    {
      title: 'Customer First',
      color: 'bg-[#2563EB]',
      description: 'Every decision we make starts with the customer in mind',
    },
    {
      title: 'Quality Obsessed',
      color: 'bg-blue-500',
      description: 'We never compromise on the quality of service we deliver',
    },
    {
      title: 'Move Fast',
      color: 'bg-blue-500',
      description: 'Speed matters. We iterate quickly and ship often',
    },
    {
      title: 'Local Impact',
      color: 'bg-blue-600',
      description: 'Empowering local service professionals and communities',
    },
    {
      title: 'Transparency',
      color: 'bg-blue-500',
      description: 'Open communication and honest relationships with all stakeholders',
    },
    {
      title: 'Innovation',
      color: 'bg-blue-500',
      description: 'Constantly finding better ways to serve our customers',
    },
  ];

  const journeyMilestones = [
    {
      year: '2022',
      title: 'The Beginning',
      description: 'Founded in Jaipur with a vision to transform local home services',
      color: 'bg-brown-700',
    },
    {
      year: '2023',
      title: 'Rapid Growth',
      description: 'Expanded to 5 cities, onboarded 500+ verified professionals',
      color: 'bg-brown-600',
    },
    {
      year: '2024',
      title: 'Going National',
      description: 'Launched in 12 major cities across India, 10,000+ happy customers',
      color: 'bg-brown-500',
    },
    {
      year: '2025',
      title: 'Innovation Era',
      description: 'Launched mobile app, AMC plans, and AI-powered service matching',
      color: 'bg-brown-400',
    },
  ];

  const insideSections = [
    {
      title: 'Engineering',
      color: 'bg-gradient-to-br from-slate-700 to-slate-900',
      description: 'Building technology that powers local service delivery',
    },
    {
      title: 'Design',
      color: 'bg-gradient-to-br from-gray-800 to-black',
      description: 'Crafting delightful experiences for millions of users',
    },
    {
      title: 'Culture',
      color: 'bg-gradient-to-br from-gray-700 to-gray-900',
      description: 'Creating an environment where everyone thrives',
    },
  ];

  const perks = [
    { icon: Heart, title: 'Health Insurance', description: 'Comprehensive medical coverage for you and your family', color: 'bg-blue-50 text-blue-600' },
    { icon: Coffee, title: 'Flexible Work', description: 'Work-life balance with flexible hours and remote options', color: 'bg-blue-50 text-blue-600' },
    { icon: GraduationCap, title: 'Learning Budget', description: '₹50,000/year for courses, conferences, and certifications', color: 'bg-blue-50 text-[#2563EB]' },
    { icon: Award, title: 'Performance Bonus', description: 'Quarterly bonuses based on performance and company growth', color: 'bg-blue-50 text-blue-600' },
    { icon: Plane, title: 'Team Retreats', description: 'Annual all-expense-paid team trips and quarterly outings', color: 'bg-blue-50 text-blue-600' },
    { icon: Laptop, title: 'Latest Tech', description: 'MacBook Pro, ergonomic setup, and premium tools', color: 'bg-blue-50 text-blue-600' },
    { icon: Home, title: 'WFH Setup', description: '₹20,000 budget for home office setup', color: 'bg-blue-50 text-blue-600' },
    { icon: DollarSign, title: 'Competitive Salary', description: 'Market-leading compensation with ESOPs for early employees', color: 'bg-blue-50 text-blue-600' },
    { icon: Users, title: 'Inclusive Culture', description: 'Diverse, welcoming environment where everyone belongs', color: 'bg-blue-50 text-blue-600' },
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Senior Engineer',
      quote: 'Best decision of my career. The freedom to innovate and the impact we create every day is incredible.',
      rating: 5,
    },
    {
      name: 'Anjali Patel',
      role: 'Product Designer',
      quote: 'I love how we prioritize user experience and genuinely care about making life better for our customers.',
      rating: 5,
    },
    {
      name: 'Vikram Singh',
      role: 'Operations Lead',
      quote: 'Working at VisvasaHome means working with passionate people solving real problems for millions of Indians.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-blue-100 text-[#2563EB] rounded-full text-sm font-semibold mb-6">
                We're hiring!
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Build the future of local services
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Join our mission to empower millions of service professionals and transform how India accesses quality home services
              </p>
              <div className="flex flex-wrap gap-12 mb-8">
                <div>
                  <div className="text-5xl font-bold text-[#2563EB] mb-1">50+</div>
                  <div className="text-gray-600 font-medium">Team Members</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-blue-600 mb-1">12</div>
                  <div className="text-gray-600 font-medium">Cities</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-blue-600 mb-1">10K+</div>
                  <div className="text-gray-600 font-medium">Happy Customers</div>
                </div>
              </div>
              <button className="bg-[#2563EB] hover:bg-[#2563EB] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl">
                View Open Positions
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 relative">
              <div className="col-span-1 space-y-4">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl h-32 shadow-lg"></div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl h-40 shadow-lg"></div>
              </div>
              <div className="col-span-1 space-y-4 mt-8">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl h-40 shadow-lg"></div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl h-32 shadow-lg"></div>
              </div>
              <div className="col-span-1 space-y-4">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl h-36 shadow-lg"></div>
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl h-36 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inside VH Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Life at VisvasaHome</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A glimpse into what it's like to work with us
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {insideSections.map((section, index) => (
              <div key={index} className={`${section.color} rounded-3xl p-10 text-white min-h-[320px] flex flex-col justify-end hover:scale-105 transition-transform shadow-xl`}>
                <h3 className="text-3xl font-bold mb-4">{section.title}</h3>
                <p className="text-white/90 text-lg leading-relaxed">{section.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find your perfect role and start making an impact
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-2xl p-7 hover:shadow-xl transition-all border border-gray-200 hover:border-blue-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-50 text-[#2563EB] text-xs font-semibold rounded-full mb-3">
                      {position.department}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">{position.title}</h3>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">{position.description}</p>
                <div className="space-y-2 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{position.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{position.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>{position.experience} experience</span>
                  </div>
                </div>
                <button className="w-full bg-[#2563EB] hover:bg-[#2563EB] text-white py-3 px-4 rounded-xl font-semibold transition-all group-hover:shadow-lg">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks & Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perks & Benefits</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We invest in our people because they're our greatest asset
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => (
              <div key={index} className="bg-white rounded-2xl p-7 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all group">
                <div className={`w-14 h-14 ${perk.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <perk.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{perk.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Culture & Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cultureValues.map((value, index) => (
              <div key={index} className={`${value.color} rounded-3xl p-9 text-white min-h-[220px] flex flex-col justify-end hover:scale-105 transition-transform shadow-xl`}>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-white/95 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Team Says</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from the people who work here every day
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl transition-all">
                <Quote className="w-10 h-10 text-blue-200 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-2 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-blue-400 fill-yellow-400" />
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VH Journey */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From a small startup to transforming local services across India
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {journeyMilestones.map((milestone, index) => (
              <div key={index} className={`${milestone.color} rounded-3xl p-9 text-white min-h-[280px] flex flex-col justify-between hover:scale-105 transition-transform shadow-xl`}>
                <div className="text-5xl font-bold mb-6 opacity-90">{milestone.year}</div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">{milestone.title}</h3>
                  <p className="text-white/95 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders & Leadership */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experts bringing together technology, operations, and customer excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Amit Sharma', role: 'Chief Technology Officer', initial: 'AS', gradient: 'from-blue-400 to-blue-600' },
              { name: 'Priya Verma', role: 'Head of Operations', initial: 'PV', gradient: 'from-blue-400 to-blue-600' },
              { name: 'Rajesh Kumar', role: 'Head of Product', initial: 'RK', gradient: 'from-blue-400 to-blue-600' },
              { name: 'Sneha Gupta', role: 'Head of Marketing', initial: 'SG', gradient: 'from-blue-400 to-blue-600' },
            ].map((leader, index) => (
              <div key={index} className="text-center group">
                <div className={`w-36 h-36 bg-gradient-to-br ${leader.gradient} rounded-3xl mx-auto mb-5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <div className="text-4xl text-white font-bold">{leader.initial}</div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{leader.name}</h3>
                <p className="text-gray-600 text-sm">{leader.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#2563EB] via-blue-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            Ready to make an impact?
          </h2>
          <p className="text-2xl text-white/90 mb-10 leading-relaxed">
            Join our team and help us transform local services across India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#2563EB] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl hover:scale-105">
              View Open Positions
            </button>
            <button className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              Learn More About Us
            </button>
          </div>
          <p className="text-white/80 mt-8 text-sm">
            Questions? Email us at <a href="mailto:careers@visvasahome.com" className="underline font-semibold">careers@visvasahome.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}
