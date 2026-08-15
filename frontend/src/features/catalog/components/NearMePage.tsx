import { useState } from 'react';
import { MapPin, Search, Star, Clock, Wrench, Droplets, Zap, Wind, Sparkles, Scissors, PaintBucket, Refrigerator, Shield, ChevronRight, ArrowLeft, Phone } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface NearMePageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const cities = [
  'Jaipur', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad', 'Kolkata', 'Chandigarh',
  'Surat', 'Lucknow', 'Jodpur', 'Udaipur', 'Kota', 'Ajmer',
];

const serviceCategories = [
  { icon: Droplets, name: 'Plumbing', professionals: 48, page: 'plumbing-services' },
  { icon: Zap, name: 'Electrical', professionals: 62, page: 'electrical-services' },
  { icon: Wind, name: 'AC & HVAC', professionals: 35, page: 'ac-services' },
  { icon: Sparkles, name: 'Cleaning', professionals: 74, page: 'cleaning-services' },
  { icon: PaintBucket, name: 'Painting', professionals: 41, page: 'painting-services' },
  { icon: Refrigerator, name: 'Appliance Repair', professionals: 55, page: 'appliance-repair' },
  { icon: Shield, name: 'Pest Control', professionals: 23, page: 'pest-control' },
  { icon: Wrench, name: 'General Repair', professionals: 67, page: 'general-repair' },
];

const nearbyProfessionals = [
  { name: 'Ramesh Kumar', specialty: 'Plumber', experience: '8 years', rating: 4.9, reviews: 234, distance: '1.2 km', response: '< 30 min', badge: 'Top Rated' },
  { name: 'Suresh Electricals', specialty: 'Electrician', experience: '12 years', rating: 4.8, reviews: 312, distance: '0.8 km', response: '< 45 min', badge: 'Verified' },
  { name: 'CleanPro Services', specialty: 'Deep Cleaning', experience: '5 years', rating: 4.7, reviews: 189, distance: '2.1 km', response: '< 1 hr', badge: null },
  { name: 'AC Cool Technicians', specialty: 'AC Service & Repair', experience: '9 years', rating: 4.9, reviews: 445, distance: '1.5 km', response: '< 30 min', badge: 'Top Rated' },
  { name: 'Apex Painting Studio', specialty: 'Painting & Texture', experience: '7 years', rating: 4.8, reviews: 142, distance: '2.5 km', response: '< 1 hr', badge: 'Verified' },
  { name: 'HandyFix Solutions', specialty: 'General Repair', experience: '10 years', rating: 4.6, reviews: 278, distance: '1.8 km', response: '< 1 hr', badge: null },
];

export function NearMePage({ onBack, onNavigate }: NearMePageProps) {
  const [selectedCity, setSelectedCity] = useState('Jaipur');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = cities.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

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
        onNavigate={onNavigate}
      />

      {/* Hero */}
      <section className="bg-[#2563EB] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <MapPin className="w-14 h-14 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl sm:text-5xl mb-4" style={{ fontWeight: 700 }}>Professionals Near Me</h1>
          <p className="text-white/80 text-lg mb-8">Find verified service professionals in your city — available today</p>
          <div className="flex gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
            </div>
            <button className="px-6 py-4 bg-white text-[#2563EB] rounded-xl shadow-lg hover:bg-blue-50 transition-colors" style={{ fontWeight: 600 }}>
              Search
            </button>
          </div>
        </div>
      </section>

      {/* City Selector */}
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg text-gray-900 mb-4" style={{ fontWeight: 700 }}>Select Your City</h2>
          <div className="flex flex-wrap gap-2">
            {filteredCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full border-2 text-sm transition-all ${selectedCity === city ? 'border-[#2563EB] bg-[#2563EB] text-white' : 'border-gray-200 text-gray-600 hover:border-[#2563EB] hover:text-[#2563EB] bg-white'}`}
                style={{ fontWeight: selectedCity === city ? 600 : 400 }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Near You */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Services in {selectedCity}</h2>
              <p className="text-gray-500 text-sm mt-1">Tap a category to see available professionals</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#2563EB]">
              <MapPin className="w-4 h-4" />
              <span style={{ fontWeight: 500 }}>{selectedCity}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {serviceCategories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => onNavigate(cat.page)}
                className="bg-white border border-gray-200 rounded-xl p-5 text-left hover:border-[#2563EB] hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#2563EB] transition-colors">
                  <cat.icon className="w-5 h-5 text-[#2563EB] group-hover:text-white transition-colors" />
                </div>
                <p className="text-gray-900 text-sm mb-1" style={{ fontWeight: 600 }}>{cat.name}</p>
                <p className="text-gray-400 text-xs">{cat.professionals} professionals</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Top Professionals Near You */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>Top Rated Professionals in {selectedCity}</h2>
          <p className="text-gray-500 text-sm mb-8">All verified, all available today</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {nearbyProfessionals.map((pro) => (
              <div key={pro.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#2563EB]" style={{ fontWeight: 700 }}>
                      {pro.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{pro.name}</p>
                      <p className="text-gray-500 text-xs">{pro.specialty}</p>
                    </div>
                  </div>
                  {pro.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${pro.badge === 'Top Rated' ? 'bg-blue-50 text-[#2563EB]' : 'bg-blue-50 text-blue-600'}`} style={{ fontWeight: 500 }}>
                      {pro.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-blue-400 fill-yellow-400" />
                    <span style={{ fontWeight: 600 }}>{pro.rating}</span>
                    <span>({pro.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {pro.distance}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {pro.response}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4">{pro.experience} experience</p>
                <button
                  onClick={() => onNavigate('booking-flow')}
                  className="w-full py-2 bg-[#2563EB] text-white rounded-lg text-sm hover:bg-[#E85A1A] transition-colors"
                  style={{ fontWeight: 600 }}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Cities */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-gray-900 mb-3 text-center" style={{ fontWeight: 700 }}>We Serve 20+ Cities Across India</h2>
          <p className="text-gray-500 text-center mb-10">New cities being added every quarter</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-[#2563EB] hover:text-[#2563EB] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB]" />
                  {city}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#2563EB]" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#2563EB] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-3" style={{ fontWeight: 700 }}>Don't see your city yet?</h2>
          <p className="text-white/80 mb-8">Call us or WhatsApp to check availability. We may already have professionals in your area.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+919057567160" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[#2563EB] rounded-xl hover:bg-blue-50 transition-colors" style={{ fontWeight: 600 }}>
              <Phone className="w-5 h-5" /> Call +91 905 7567 160
            </a>
            <a href="https://wa.me/919057567160" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors" style={{ fontWeight: 600 }}>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} onRegisterContractor={() => onNavigate('register-contractor')} />
    </div>
  );
}
