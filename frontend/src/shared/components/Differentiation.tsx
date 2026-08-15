import { Users, Building2, Shield, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: Users,
    title: 'Community-First',
    description: 'We build lasting relationships, not just transactions. Every service connects you with trusted local professionals.'
  },
  {
    icon: Building2,
    title: 'Local Empowerment',
    description: 'We strengthen local professionals with systems, branding, and support to deliver exceptional service.'
  },
  {
    icon: Shield,
    title: 'Fair & Protected',
    description: 'Fair pricing for customers. Fair income for professionals. A sustainable ecosystem for everyone.'
  },
  {
    icon: TrendingUp,
    title: 'Long-term Growth',
    description: 'We help professionals build careers, not gigs. Real customer relationships and project-based growth.'
  }
];

export function Differentiation() {
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-gray-900">
            The VisvasaHome Difference
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A professional ecosystem built on trust, fairness, and community values.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-xl hover:border-blue-200 transition-all hover:-translate-y-1">
              <div className="p-4 rounded-xl w-fit mb-5 shadow-lg" style={{ backgroundColor: "#2563EB" }}>
                <value.icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="mb-3 text-xl font-bold text-gray-900">{value.title}</h3>

              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}