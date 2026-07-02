import { ArrowLeft, CheckCircle, Clock, Shield, Star, TrendingUp, Home, Building2, HardHat } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';
import { useState } from 'react';

interface ServicesPricingPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onBookNow?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE CATALOGUE — All prices in INR (₹), inclusive of labour
// ─────────────────────────────────────────────────────────────────────────────

const pillars = [
  {
    id: 'home',
    label: '🏠 Home Services',
    desc: 'On-demand repairs, cleaning, and maintenance — professionals at your doorstep',
    color: 'bg-blue-50 border-blue-200',
    headingColor: 'text-[#2563EB]',
    categories: [
      {
        name: 'AC Service & Repair',
        slug: 'ac-services',
        services: [
          { name: 'AC Service & Filter Cleaning (Split)', price: 399, duration: '45–60 min', warranty: '15 days' },
          { name: 'AC Service & Filter Cleaning (Window)', price: 349, duration: '30–45 min', warranty: '15 days' },
          { name: 'AC Gas Charging / Refill', price: 1999, duration: '1–2 hrs', warranty: '90 days', popular: true },
          { name: 'AC Deep Cleaning (Chemical Wash)', price: 1299, duration: '2–3 hrs', warranty: '30 days', popular: true },
          { name: 'AC Installation (Split)', price: 1499, duration: '2–3 hrs', warranty: '30 days' },
          { name: 'AC Installation (Window)', price: 999, duration: '1–2 hrs', warranty: '30 days' },
          { name: 'AC Repair (All Issues)', price: 499, duration: '1–2 hrs', warranty: '30 days', popular: true },
          { name: 'AC Uninstallation & Reinstallation', price: 1799, duration: '3–4 hrs', warranty: '15 days' },
        ],
      },
      {
        name: 'Plumbing',
        slug: 'plumbing-services',
        services: [
          { name: 'Tap / Faucet Repair or Replacement', price: 199, duration: '30–45 min', warranty: '30 days' },
          { name: 'Drain Unclogging (Kitchen / Bathroom)', price: 249, duration: '30–60 min', warranty: '15 days', popular: true },
          { name: 'Flush Tank Repair', price: 299, duration: '30–60 min', warranty: '30 days' },
          { name: 'Geyser Installation', price: 499, duration: '1–2 hrs', warranty: '30 days' },
          { name: 'Water Pipe Leakage Repair', price: 349, duration: '1–2 hrs', warranty: '30 days', popular: true },
          { name: 'Washbasin / Sink Installation', price: 599, duration: '1–2 hrs', warranty: '30 days' },
          { name: 'Bathroom Fitting (Full Set)', price: 1999, duration: '3–5 hrs', warranty: '30 days' },
          { name: 'Motor Pump Repair', price: 699, duration: '1–3 hrs', warranty: '30 days' },
        ],
      },
      {
        name: 'Electrical',
        slug: 'electrical-services',
        services: [
          { name: 'Switch / Socket Replacement', price: 129, duration: '20–30 min', warranty: '30 days', popular: true },
          { name: 'Fan Installation / Repair', price: 199, duration: '30–45 min', warranty: '30 days' },
          { name: 'Light / Tubelight Fitting', price: 149, duration: '20–30 min', warranty: '30 days' },
          { name: 'MCB / Fuse Repair', price: 249, duration: '30–60 min', warranty: '30 days' },
          { name: 'Wiring Work (per room)', price: 999, duration: '3–6 hrs', warranty: '60 days' },
          { name: 'Inverter / Battery Setup', price: 699, duration: '1–2 hrs', warranty: '30 days' },
          { name: 'CCTV Camera Installation (1 cam)', price: 1499, duration: '2–3 hrs', warranty: '90 days', popular: true },
          { name: 'Smart Lock / Door Bell Installation', price: 799, duration: '1–2 hrs', warranty: '30 days' },
        ],
      },
      {
        name: 'Home Cleaning',
        slug: 'cleaning-services',
        services: [
          { name: 'Bathroom Deep Cleaning', price: 499, duration: '2–3 hrs', warranty: '7 days', popular: true },
          { name: 'Kitchen Deep Cleaning', price: 599, duration: '2–3 hrs', warranty: '7 days', popular: true },
          { name: 'Full Home Deep Cleaning (2BHK)', price: 2499, duration: '5–7 hrs', warranty: '7 days' },
          { name: 'Sofa Shampoo Cleaning (3-seater)', price: 699, duration: '1–2 hrs', warranty: '7 days' },
          { name: 'Carpet / Rug Cleaning', price: 499, duration: '1–2 hrs', warranty: '7 days' },
          { name: 'Water Tank Cleaning (1000 L)', price: 999, duration: '2–3 hrs', warranty: '30 days' },
          { name: 'Post-Construction Cleaning', price: 3999, duration: '8–10 hrs', warranty: '7 days' },
          { name: 'Regular Home Cleaning (1 visit)', price: 599, duration: '2–4 hrs', warranty: '—' },
        ],
      },
      {
        name: 'Appliance Repair',
        slug: 'appliance-repair',
        services: [
          { name: 'Refrigerator Repair', price: 499, duration: '1–2 hrs', warranty: '30 days', popular: true },
          { name: 'Washing Machine Repair', price: 399, duration: '1–2 hrs', warranty: '30 days', popular: true },
          { name: 'Microwave Repair', price: 349, duration: '45–90 min', warranty: '30 days' },
          { name: 'TV Repair (LED/LCD)', price: 499, duration: '1–3 hrs', warranty: '30 days' },
          { name: 'Water Purifier (RO) Service', price: 449, duration: '1 hr', warranty: '30 days' },
          { name: 'Chimney / Hood Service', price: 499, duration: '1 hr', warranty: '15 days' },
          { name: 'Geyser Repair', price: 349, duration: '45–90 min', warranty: '30 days' },
          { name: 'Dishwasher Repair', price: 599, duration: '1–2 hrs', warranty: '30 days' },
        ],
      },
      {
        name: 'Pest Control',
        slug: 'pest-control',
        services: [
          { name: 'Cockroach Control (2BHK)', price: 799, duration: '1–2 hrs', warranty: '30 days', popular: true },
          { name: 'Termite Control (per room)', price: 1499, duration: '2–3 hrs', warranty: '1 year' },
          { name: 'Rodent / Rat Control', price: 999, duration: '1–2 hrs', warranty: '30 days' },
          { name: 'Bed Bug Treatment (1 room)', price: 1299, duration: '2–3 hrs', warranty: '90 days' },
          { name: 'Mosquito / Fly Control', price: 699, duration: '1 hr', warranty: '30 days' },
          { name: 'Full Home General Pest Control (2BHK)', price: 1299, duration: '2–3 hrs', warranty: '30 days' },
        ],
      },
    ],
  },
  {
    id: 'amc',
    label: '🛡️ AMC Plans',
    desc: 'Annual Maintenance Contracts — scheduled visits, priority service, zero surprise costs',
    color: 'bg-indigo-50 border-indigo-200',
    headingColor: 'text-indigo-700',
    categories: [
      {
        name: 'Home AMC Plans',
        slug: 'amc-home',
        services: [
          { name: 'Home AMC — Silver (4 visits/year)', price: 2999, duration: '4 scheduled visits', warranty: '1 year', popular: true },
          { name: 'Home AMC — Gold (8 visits/year)', price: 4999, duration: '8 scheduled visits', warranty: '1 year', popular: true },
          { name: 'Home AMC — Platinum (12 visits/year)', price: 7999, duration: '12 visits + emergency', warranty: '1 year' },
        ],
      },
      {
        name: 'Office / Commercial AMC',
        slug: 'amc-office',
        services: [
          { name: 'Small Office AMC (up to 500 sq ft)', price: 5999, duration: '6 visits/year', warranty: '1 year' },
          { name: 'Medium Office AMC (up to 2000 sq ft)', price: 11999, duration: '8 visits/year', warranty: '1 year', popular: true },
          { name: 'Large Office AMC (2000+ sq ft)', price: 19999, duration: '12 visits/year', warranty: '1 year' },
        ],
      },
      {
        name: 'AC Annual Maintenance (AMC)',
        slug: 'amc-home',
        services: [
          { name: 'AC AMC — 1 Unit (2 services/year)', price: 1499, duration: '2 services/year', warranty: '1 year', popular: true },
          { name: 'AC AMC — 1 Unit (4 services/year)', price: 2499, duration: '4 services/year', warranty: '1 year' },
          { name: 'AC AMC — 2 Units (4 services/year)', price: 4499, duration: '4 services/year', warranty: '1 year' },
        ],
      },
      {
        name: 'Specialized AMC',
        slug: 'amc-commercial',
        services: [
          { name: 'Healthcare Facility AMC (per floor)', price: 14999, duration: '12 visits/year', warranty: '1 year' },
          { name: 'Educational Institution AMC', price: 9999, duration: '8 visits/year', warranty: '1 year' },
          { name: 'Hospitality / Hotel AMC', price: 24999, duration: 'Custom schedule', warranty: '1 year', popular: true },
          { name: 'Residential Society AMC', price: 29999, duration: 'Monthly visits', warranty: '1 year' },
          { name: 'Industrial / Warehouse AMC', price: 19999, duration: '8 visits/year', warranty: '1 year' },
        ],
      },
    ],
  },
  {
    id: 'construction',
    label: '🏗️ Construction & Contracting',
    desc: 'Renovation, painting, flooring, interior design — full project management',
    color: 'bg-amber-50 border-amber-200',
    headingColor: 'text-amber-700',
    categories: [
      {
        name: 'Painting Services',
        slug: 'painting-services',
        services: [
          { name: 'Interior Wall Painting (per sq ft)', price: 12, duration: 'Per project', warranty: '2 years' },
          { name: '1BHK Interior Painting (basic emulsion)', price: 8999, duration: '2–3 days', warranty: '2 years' },
          { name: '2BHK Interior Painting (premium)', price: 18999, duration: '4–6 days', warranty: '2 years', popular: true },
          { name: '3BHK Interior Painting (premium)', price: 27999, duration: '6–9 days', warranty: '2 years' },
          { name: 'Exterior Painting (per sq ft)', price: 18, duration: 'Per project', warranty: '3 years' },
          { name: 'Texture / Designer Wall Finish', price: 35, duration: 'Per sq ft', warranty: '2 years' },
          { name: 'Waterproofing (bathroom / terrace)', price: 4999, duration: '1–2 days', warranty: '5 years', popular: true },
        ],
      },
      {
        name: 'Carpentry & Woodwork',
        slug: 'carpentry-services',
        services: [
          { name: 'Wardrobe / Almirah Installation', price: 1499, duration: '2–4 hrs', warranty: '6 months' },
          { name: 'Modular Kitchen Fitting (per unit)', price: 2999, duration: '1 day', warranty: '6 months', popular: true },
          { name: 'Door / Window Repair or Replacement', price: 999, duration: '2–4 hrs', warranty: '30 days' },
          { name: 'Bed / Furniture Assembly', price: 599, duration: '1–3 hrs', warranty: '30 days' },
          { name: 'False Ceiling (per sq ft)', price: 85, duration: 'Per project', warranty: '1 year' },
          { name: 'TV Cabinet / Study Table Fitting', price: 1299, duration: '2–4 hrs', warranty: '6 months' },
        ],
      },
      {
        name: 'Flooring & Masonry',
        slug: 'flooring-services',
        services: [
          { name: 'Tile Laying (per sq ft)', price: 35, duration: 'Per project', warranty: '1 year', popular: true },
          { name: 'Marble / Granite Flooring (per sq ft)', price: 55, duration: 'Per project', warranty: '1 year' },
          { name: 'Tile Grouting & Repair', price: 199, duration: '1–2 hrs', warranty: '30 days' },
          { name: 'Bathroom Renovation (full)', price: 24999, duration: '5–7 days', warranty: '1 year', popular: true },
          { name: 'Waterproof Flooring (vinyl / laminate)', price: 65, duration: 'Per sq ft', warranty: '1 year' },
          { name: 'Brick / Masonry Wall Construction (per sq ft)', price: 120, duration: 'Per project', warranty: '1 year' },
        ],
      },
      {
        name: 'Full Renovation & Construction',
        slug: 'construction-services',
        services: [
          { name: '1BHK Full Home Renovation', price: 149999, duration: '15–20 days', warranty: '1 year', popular: true },
          { name: '2BHK Full Home Renovation', price: 249999, duration: '20–30 days', warranty: '1 year', popular: true },
          { name: '3BHK Full Home Renovation', price: 349999, duration: '30–45 days', warranty: '1 year' },
          { name: 'Office Interior Renovation (per sq ft)', price: 850, duration: 'Per project', warranty: '1 year' },
          { name: 'Modular Kitchen (full, per sq ft)', price: 650, duration: 'Per project', warranty: '1 year' },
        ],
      },
    ],
  },
];

export function ServicesPricingPage({ onBack, onNavigate, onBookNow }: ServicesPricingPageProps) {
  const [activePillar, setActivePillar] = useState<'home' | 'amc' | 'construction'>('home');

  const currentPillar = pillars.find(p => p.id === activePillar)!;

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

      {/* Legal Notice */}
      <div className="bg-gray-950 text-gray-300 py-2.5">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs">
          Services provided by <strong className="text-white">Visvasahome Private Limited</strong> &nbsp;|&nbsp; All prices in INR (₹) inclusive of labour &nbsp;|&nbsp; GST extra as applicable
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </button>
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-white mb-4">Services & Pricing</h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-6">
              Transparent, fixed pricing across all our 3 service pillars. No hidden charges. All prices in INR — inclusive of labour cost.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/15 rounded-full text-sm font-semibold">✅ No Hidden Charges</span>
              <span className="px-4 py-2 bg-white/15 rounded-full text-sm font-semibold">🔒 Verified Professionals</span>
              <span className="px-4 py-2 bg-white/15 rounded-full text-sm font-semibold">🛡️ Warranty on Every Service</span>
              <span className="px-4 py-2 bg-white/15 rounded-full text-sm font-semibold">💳 Pay After Service / Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 py-5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { v: '26+', l: 'Service Categories' },
            { v: '150+', l: 'Service Items' },
            { v: '4.8★', l: 'Platform Rating' },
            { v: '₹99+', l: 'Prices Starting From' },
          ].map(s => (
            <div key={s.l}>
              <div className="text-xl font-black text-[#2563EB]">{s.v}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pillar Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {pillars.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePillar(p.id as any)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activePillar === p.id
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Pillar Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Pillar intro */}
          <div className={`rounded-2xl border p-6 mb-10 ${currentPillar.color}`}>
            <p className="text-sm text-gray-700 font-medium">{currentPillar.desc}</p>
          </div>

          {/* Categories */}
          {currentPillar.categories.map((cat) => (
            <div key={cat.name} className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-xl font-black ${currentPillar.headingColor}`}>{cat.name}</h2>
                <button
                  onClick={() => onNavigate(cat.slug)}
                  className="text-xs font-bold text-[#2563EB] border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Book This Category →
                </button>
              </div>

              {/* Services table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 px-6 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-wide">
                  <div className="col-span-5">Service</div>
                  <div className="col-span-2 text-right">Price (INR)</div>
                  <div className="col-span-2 text-center">Duration</div>
                  <div className="col-span-2 text-center">Warranty</div>
                  <div className="col-span-1 text-center">Book</div>
                </div>

                {cat.services.map((svc, idx) => (
                  <div
                    key={svc.name}
                    className={`grid grid-cols-1 sm:grid-cols-12 px-6 py-4 items-center gap-2 sm:gap-0 ${
                      idx < cat.services.length - 1 ? 'border-b border-gray-100' : ''
                    } ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/30 transition-colors`}
                  >
                    {/* Name */}
                    <div className="sm:col-span-5 flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{svc.name}</span>
                      {(svc as any).popular && (
                        <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-blue-100 text-[#2563EB] rounded-full flex-shrink-0">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="sm:col-span-2 sm:text-right">
                      <span className="text-base font-black text-gray-900">
                        {svc.price >= 1000 ? `₹${(svc.price / 1000).toFixed(svc.price % 1000 === 0 ? 0 : 1)}K` : `₹${svc.price}`}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">
                        {String(svc.duration).includes('sq ft') ? '/sq ft' : ''}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="sm:col-span-2 sm:text-center flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span>{svc.duration}</span>
                    </div>

                    {/* Warranty */}
                    <div className="sm:col-span-2 sm:text-center flex items-center gap-1 text-xs text-gray-500">
                      <Shield className="w-3 h-3 flex-shrink-0" />
                      <span>{svc.warranty}</span>
                    </div>

                    {/* Book CTA */}
                    <div className="sm:col-span-1 sm:text-center">
                      <button
                        onClick={() => onNavigate('get-started-customer')}
                        className="px-3 py-1.5 bg-[#2563EB] hover:bg-blue-600 text-white text-[10px] font-black rounded-lg transition-colors"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-black text-gray-900 mb-5">📋 Important Pricing Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '💰', title: 'All Prices in INR', desc: 'Prices shown are in Indian Rupees (₹) and are inclusive of service labour cost. Spare parts, if required, will be charged separately with prior customer consent.' },
              { icon: '🧾', title: 'GST Applicable', desc: '18% GST is applicable on all services as per Indian tax regulations. A GST-compliant invoice will be provided for every transaction.' },
              { icon: '📍', title: 'Visit / Travel Charges', desc: 'Service visit charges are included in the displayed price. No separate travel or conveyance fee.' },
              { icon: '🛡️', title: 'Warranty Coverage', desc: 'Warranty covers only the specific work performed. It does not cover misuse, damage by a third party, or natural wear & tear.' },
              { icon: '💳', title: 'Payment Terms', desc: 'Payment accepted online (UPI, Card, Net Banking) or cash after service completion. Online payments processed via Razorpay (PCI-DSS certified).' },
              { icon: '📞', title: 'Custom Quotes', desc: 'For large projects, construction contracts, or multi-property AMC plans, contact us for a custom quote: contact@visvasahome.com | +91 905 7567 160' },
            ].map(note => (
              <div key={note.title} className="p-5 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="text-2xl mb-2">{note.icon}</p>
                <p className="font-bold text-gray-900 text-sm mb-1">{note.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{note.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#2563EB] to-[#1E40AF] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book?</h2>
          <p className="text-blue-100 mb-8 text-lg">Verified professionals at your doorstep. Transparent pricing. No surprise bills.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('get-started-customer')}
              className="px-8 py-4 bg-white text-[#2563EB] rounded-xl font-bold hover:bg-blue-50 transition-colors"
            >
              Book a Service Now
            </button>
            <a
              href="https://wa.me/919057567160"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
            >
              💬 WhatsApp for Custom Quote
            </a>
          </div>
          <p className="mt-6 text-blue-200 text-xs">
            Visvasahome Private Limited | Jaipur, Rajasthan — 302001 | contact@visvasahome.com
          </p>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}
