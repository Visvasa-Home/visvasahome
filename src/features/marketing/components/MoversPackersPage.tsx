import { ArrowLeft, Truck, CheckCircle, Star, Shield, Phone, Sparkles } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';

interface MoversPackersPageProps {
  onBack: () => void;
  onBookNow: () => void;
}

const services = [
  {
    name: 'Local Shifting (1/2/3 BHK)',
    desc: 'Baggage packing, loading, transportation, and unpacking within your city. Experienced handlers.',
    price: '₹2,499',
    time: '4-8 hrs',
    popular: true,
    features: ['Includes packaging material', 'Safe transport vehicle', 'Loading & unloading', 'Transit damage cover'],
  },
  {
    name: 'Inter-City Moving',
    desc: 'Long-distance packing and relocation across states. Direct container shipping and tracking.',
    price: '₹8,999',
    time: '1-3 days',
    popular: true,
    features: ['Premium layered packing', 'Closed container trucks', 'Dedicated supervisor', 'Detailed item checklist'],
  },
  {
    name: 'Furniture Assembly & Fit',
    desc: 'Dismantling and re-assembling beds, wardrobes, dining tables, and modular sets.',
    price: '₹499',
    time: '1-2 hrs',
    popular: false,
    features: ['Experienced carpenters', 'Equipped with power tools', 'Fast & scratch-free fit', 'Includes hardware checks'],
  },
  {
    name: 'Load & Unload Service',
    desc: 'Heavy loading and unloading assistance for self-transported items or commercial delivery.',
    price: '₹1,199',
    time: '2-4 hrs',
    popular: false,
    features: ['Sturdy helper crew', 'Safety gear equipped', 'Careful handling of glass', 'No hidden costs'],
  },
];

const highlights = [
  { icon: Shield, title: 'Safe Relocation Cover', desc: 'Complimentary insurance cover on local goods movement' },
  { icon: Star, title: '4.8/5 Rating', desc: 'Over 12,000+ homes shifted safely in India' },
  { icon: CheckCircle, title: 'No Hidden Charges', desc: 'Clear quotation based on item list and floor distance' },
  { icon: Truck, title: 'Verified Crew', desc: 'All loaders and drivers are background checked' },
];

export function MoversPackersPage({ onBack, onBookNow }: MoversPackersPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-800 text-white relative overflow-hidden">
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
                <Truck className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">Movers & Packers</h1>
                <p className="text-indigo-100 text-lg">Safe packing, secure transportation, and damage cover — local or inter-city</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Background Verified Crew</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Comprehensive Transit Cover</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Multi-Layer Bubble Packing</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Transparent Price Calculator</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button onClick={onBookNow} size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold px-8 py-3 text-base">
                Get Relocation Quote
              </Button>
              <a href="tel:+919057567160" className="flex items-center gap-2 px-6 py-3 border-2 border-white/40 rounded-xl text-white hover:bg-white/10 transition-colors font-semibold">
                <Phone className="w-4 h-4" /> +91 905 7567 160
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-indigo-50/50 border-b border-indigo-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((h, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-3">
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
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Relocation & Shifting Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">From single item courier assembly to full 3BHK home relocation, we handle your goods with the highest safety standards.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-16">
          {services.map((s, i) => (
            <Card key={i} className="p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 rounded-2xl">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-base text-gray-900 leading-tight">{s.name}</h3>
                {s.popular && <Badge className="bg-indigo-600 text-white text-xs flex-shrink-0 ml-2">Popular</Badge>}
              </div>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">{s.desc}</p>
              <ul className="space-y-1 mb-4">
                {s.features.map((f, fi) => (
                  <li key={fi} className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mb-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Starting from</p>
                  <p className="font-bold text-indigo-600 text-lg">{s.price}</p>
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

        {/* Shifting Steps */}
        <div className="bg-indigo-50/50 rounded-3xl p-10 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How We Relocate You Safely</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Share Shifting Details', desc: 'List your major items, shifting dates, and origin/destination addresses' },
              { step: '2', title: 'Get Instant Pricing', desc: 'Get transparent quotation with zero price changes on moving day' },
              { step: '3', title: 'Layered Safe Packing', desc: 'Our crew packs electronics, glass, and furniture in safe multi-layer bubbles' },
              { step: '4', title: 'Seamless Drop & Fit', desc: 'Unloading and assembly at your new location with expert checks' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-14 text-white">
          <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">Relocate Hassle-Free With VisvasaHome</h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
            Book professional movers for a damage-free relocation process. Get your free moving quote today.
          </p>
          <Button onClick={onBookNow} size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-12">
            Get Shifting Quote
          </Button>
        </section>
      </div>
    </div>
  );
}
