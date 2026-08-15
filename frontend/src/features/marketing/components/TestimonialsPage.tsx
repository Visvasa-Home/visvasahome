import { Star, Quote, ArrowLeft, ThumbsUp, Award, Users } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface TestimonialsPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    city: 'Jaipur',
    service: 'Home Cleaning (Deep Clean)',
    rating: 5,
    date: 'March 2025',
    text: "Absolutely outstanding experience. The team from VisvasaHome arrived on time, explained every step they'd take, and left my 3BHK absolutely spotless. The level of professionalism was a welcome change — no haggling, no surprises. I've already booked them for monthly cleaning.",
    verified: true,
    avatar: 'PS',
    color: 'bg-[#2563EB]',
  },
  {
    id: 2,
    name: 'Rahul Mehta',
    city: 'Delhi NCR',
    service: 'AC Service & Gas Refill',
    rating: 5,
    date: 'February 2025',
    text: "Called VisvasaHome for AC servicing before summer hit. The technician was knowledgeable, showed me what was wrong, and fixed two ACs in under 3 hours. Pricing was transparent — I saw the quote before any work started. No hidden charges whatsoever.",
    verified: true,
    avatar: 'RM',
    color: 'bg-blue-600',
  },
  {
    id: 3,
    name: 'Sunita Agarwal',
    city: 'Bengaluru',
    service: 'Electrical Repair & Wiring',
    rating: 5,
    date: 'January 2025',
    text: "I was nervous about letting someone into my home for electrical work but VisvasaHome's verification system gave me confidence. The electrician was certified, wore proper identification, and the entire job was documented digitally. I felt safe throughout.",
    verified: true,
    avatar: 'SA',
    color: 'bg-blue-700',
  },
  {
    id: 4,
    name: 'Amit Joshi',
    city: 'Mumbai',
    service: 'Home AMC – Premium Plan',
    rating: 5,
    date: 'December 2024',
    text: "Signed up for the Home AMC and it's been a game changer. No more scrambling to find contractors for each issue. My dedicated coordinator schedules everything, the team always comes on time, and I get a digital log of every visit. Worth every rupee.",
    verified: true,
    avatar: 'AJ',
    color: 'bg-blue-600',
  },
  {
    id: 5,
    name: 'Deepa Nair',
    city: 'Hyderabad',
    service: 'Plumbing Repair',
    rating: 4,
    date: 'November 2024',
    text: "Had a major pipe leak and VisvasaHome dispatched someone within 2 hours. The plumber diagnosed the issue accurately, fixed it cleanly, and didn't make a mess of my bathroom. Reasonable pricing and great communication throughout.",
    verified: true,
    avatar: 'DN',
    color: 'bg-blue-600',
  },
  {
    id: 6,
    name: 'Vikram Singh',
    city: 'Pune',
    service: 'Interior Painting (2BHK)',
    rating: 5,
    date: 'October 2024',
    text: "Hired VisvasaHome for complete interior painting of my 2BHK. The team was professional, used quality materials, protected all furniture, and finished in exactly the time promised. The walls look beautiful and the cleanup after was thorough.",
    verified: true,
    avatar: 'VS',
    color: 'bg-blue-600',
  },
  {
    id: 7,
    name: 'Kavita Reddy',
    city: 'Chennai',
    service: 'Waterproofing & Seepage Protection',
    rating: 5,
    date: 'September 2024',
    text: "Booked waterproofing services through VisvasaHome for my sister's flat during the monsoon. The team was highly professional, diagnosed the seepage source, and completed the coating beautifully. Great experience.",
    verified: true,
    avatar: 'KR',
    color: 'bg-blue-600',
  },
  {
    id: 8,
    name: 'Nikhil Gupta',
    city: 'Ahmedabad',
    service: 'Refrigerator Repair',
    rating: 4,
    date: 'August 2024',
    text: "My refrigerator stopped cooling and I called VisvasaHome late evening. They scheduled a technician for the next morning, arrived on time, diagnosed the compressor issue, and had it working within the day. 30-day warranty on the repair gave me peace of mind.",
    verified: true,
    avatar: 'NG',
    color: 'bg-[#2563EB]',
  },
  {
    id: 9,
    name: 'Ananya Bose',
    city: 'Kolkata',
    service: 'Pest Control – Comprehensive',
    rating: 5,
    date: 'July 2024',
    text: "Had a severe cockroach and termite problem. VisvasaHome's pest control team did a thorough inspection first, explained the treatment plan, used eco-friendly products, and followed up two weeks later. Not a single cockroach since. Exceptional service.",
    verified: true,
    avatar: 'AB',
    color: 'bg-blue-600',
  },
];

const stats = [
  { value: '4.8/5', label: 'Average Rating', icon: Star },
  { value: '10,000+', label: 'Services Completed', icon: ThumbsUp },
  { value: '98%', label: 'Customer Satisfaction', icon: Award },
  { value: '20+', label: 'Cities Served', icon: Users },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sz} ${star <= rating ? 'text-blue-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export function TestimonialsPage({ onBack, onNavigate }: TestimonialsPageProps) {
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="max-w-4xl">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full mb-6">
              <span className="text-sm">Real Customers. Real Experiences.</span>
            </div>
            <h1 className="text-4xl font-semibold text-white mb-6">What Our Customers Say</h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Trust is built through consistent experiences. Here are verified reviews from customers across India who chose VisvasaHome for reliable, professional local services.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex p-3 bg-blue-50 rounded-full mb-3">
                  <stat.icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overall Rating */}
      <section className="py-12 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 border border-blue-100 shadow-sm max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-center">
                <div className="text-7xl font-bold text-[#2563EB] mb-2">4.8</div>
                <StarRating rating={5} size="lg" />
                <p className="text-sm text-gray-600 mt-2">Based on 10,000+ verified reviews</p>
              </div>
              <div className="space-y-3">
                {[
                  { stars: 5, percent: 82 },
                  { stars: 4, percent: 12 },
                  { stars: 3, percent: 4 },
                  { stars: 2, percent: 1 },
                  { stars: 1, percent: 1 },
                ].map(({ stars, percent }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-4">{stars}</span>
                    <Star className="w-4 h-4 text-blue-400 fill-yellow-400 flex-shrink-0" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">Verified Customer Reviews</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every review below is from a verified customer who booked and completed a service through VisvasaHome.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 ${t.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-semibold text-sm">{t.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900">{t.name}</h4>
                      {t.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{t.city} · {t.date}</p>
                    <StarRating rating={t.rating} />
                  </div>
                </div>

                <div className="relative flex-1">
                  <Quote className="w-8 h-8 text-blue-100 absolute -top-2 -left-1" />
                  <p className="text-gray-700 text-sm leading-relaxed pl-4">{t.text}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-[#2563EB] rounded-full text-xs">
                    {t.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl font-semibold mb-4">Experience the VisvasaHome Difference</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who trust VisvasaHome for verified, reliable, and transparent local services.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('get-started-customer')}
                className="px-8 py-4 bg-white text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors font-medium"
              >
                Book a Service Today
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Talk to Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}
