import { ArrowLeft, CheckCircle, Star, Award, Phone, Sparkles, Heart } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';

interface PetCarePageProps {
  onBack: () => void;
  onBookNow: () => void;
}

const services = [
  {
    name: 'Dog Grooming (At-Home)',
    desc: 'Bathing, brushing, haircut, nail clipping, and ear cleaning by professional pet groomers.',
    price: '₹799',
    time: '1-2 hrs',
    popular: true,
    features: ['Sanitized grooming kit', 'Breed-specific shampoo', 'Hair trimming/clipping', 'Nail clipping & ear cleanup'],
  },
  {
    name: 'Dog Walking (Monthly Package)',
    desc: 'Daily 30-40 minute outdoor walks for physical and mental exercise. Tracked routing reports.',
    price: '₹1,499/month',
    time: 'Daily (30-40 min)',
    popular: true,
    features: ['Regular trained walkers', 'Fixed daily timings', 'Route tracking updates', 'Basic behavior checks'],
  },
  {
    name: 'Vet at Home Consultation',
    desc: 'At-home general health checkups, vaccination schedules, and prescription by certified veterinarians.',
    price: '₹999',
    time: '45 min',
    popular: false,
    features: ['Certified veterinarians', 'Prescription sheet provided', 'At-home vaccination kits', 'Safe, stress-free checkup'],
  },
  {
    name: 'Pet Boarding & Sitting',
    desc: 'Verified, pet-loving hosts to take care of your dog/cat in a cage-free home environment while you are away.',
    price: '₹499/day',
    time: '24 hrs (Full-day)',
    popular: false,
    features: ['Cage-free host homes', 'Daily video/photo updates', 'Regular meals & walks', 'On-call vet support'],
  },
];

const highlights = [
  { icon: Award, title: 'Certified Handlers', desc: 'Trained pet handlers, groomers, and certified vets' },
  { icon: Star, title: '4.9/5 Rating', desc: 'Loved by 6,000+ pet parents across major cities' },
  { icon: CheckCircle, title: 'Stress-Free Environment', desc: 'Safe, familiar environment of your home' },
  { icon: Heart, title: 'Pet First-Aid Trained', desc: 'All walkers and sitters are trained in basic pet first-aid' },
];

export function PetCarePage({ onBack, onBookNow }: PetCarePageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={onBack} className="flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" /><span>Back to Home</span>
          </button>
          <div className="py-10 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-white/15 rounded-2xl">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Pet Care Services</h1>
                <p className="text-blue-100 text-lg">Professional dog grooming, walking, vet visits, and cage-free home boarding</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Certified Vet & Groomers</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ GPS Tracked Walks</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Cage-Free Home Boarding</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Sanitized Grooming Kits</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button onClick={onBookNow} size="lg" className="bg-white text-blue-750 hover:bg-blue-50 font-bold px-8 py-3 text-base">
                Book Pet Service
              </Button>
              <a href="tel:+919057567160" className="flex items-center gap-2 px-6 py-3 border-2 border-white/40 rounded-xl text-white hover:bg-white/10 transition-colors font-semibold">
                <Phone className="w-4 h-4" /> +91 905 7567 160
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-blue-50/50 border-b border-blue-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                  <h.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{h.title}</h3>
                <p className="text-gray-500 text-sm">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Professional Pet Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Expert care for your pets at home. Safe, professional handling of your furry family members by verified animal lovers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
          {services.map((s, i) => (
            <Card key={i} className="p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-base text-gray-900 leading-tight">{s.name}</h3>
                {s.popular && <Badge className="bg-blue-600 text-white text-xs flex-shrink-0 ml-2">Popular</Badge>}
              </div>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">{s.desc}</p>
              <ul className="space-y-1 mb-4">
                {s.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mb-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Starting from</p>
                  <p className="font-bold text-blue-600 text-lg">{s.price}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-xs text-gray-700 font-medium">{s.time}</p>
                </div>
              </div>
              <Button onClick={onBookNow} className="w-full bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-sm font-bold">
                Book Now
              </Button>
            </Card>
          ))}
        </div>

        {/* Steps */}
        <div className="bg-blue-50/50 rounded-3xl p-10 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Choose Pet Service', desc: 'Select grooming, walking package, home vet visit, or host boarding dates' },
              { step: '2', title: 'Match Helper Profile', desc: 'Review walker or sitter profiles verified and rated in your neighborhood' },
              { step: '3', title: 'Schedule Service', desc: 'Technician/walker arrives on time. Sitters provide daily video reports' },
              { step: '4', title: 'Happy Pet guaranteed', desc: 'Your pet gets the highest care. Rate the handler post-service' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-14 text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">Pamper Your Furry Friends Today</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Book professional grooming, scheduled walking, or host boarding packages with certified handlers.
          </p>
          <Button onClick={onBookNow} size="lg" className="bg-white text-blue-750 hover:bg-blue-50 font-bold px-12">
            Book Pet Service Today
          </Button>
        </section>
      </div>
    </div>
  );
}
