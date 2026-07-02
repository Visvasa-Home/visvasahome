import { useState } from 'react';
import { ArrowLeft, Sliders, MapPin, Image, ShieldAlert, CheckCircle2, Plus, Trash2, FileText } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';

interface AdminSettingsPageProps {
  onBack: () => void;
}

export function AdminSettingsPage({ onBack }: AdminSettingsPageProps) {
  // 1. Commission rates state
  const [commissionRate, setCommissionRate] = useState(() => {
    const saved = localStorage.getItem('visvasahome_commission_rate');
    return saved ? Number(saved) : 15;
  });
  const [safetyFee, setSafetyFee] = useState(() => {
    const saved = localStorage.getItem('visvasahome_safety_fee');
    return saved ? Number(saved) : 29;
  });

  // 2. Active Cities state
  const [cities, setCities] = useState(() => {
    const saved = localStorage.getItem('visvasahome_cities');
    return saved ? JSON.parse(saved) : [
      { name: 'Jaipur', active: true, count: 124 },
      { name: 'Mumbai', active: true, count: 85 },
      { name: 'Delhi NCR', active: true, count: 96 },
      { name: 'Pune', active: true, count: 42 },
      { name: 'Bengaluru', active: true, count: 52 },
      { name: 'Ahmedabad', active: false, count: 0 },
      { name: 'Chennai', active: false, count: 0 },
      { name: 'Hyderabad', active: false, count: 0 },
    ];
  });

  // 3. App Banners Carousel state
  const [banners, setBanners] = useState(() => {
    const saved = localStorage.getItem('visvasahome_banners');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Monsoon Special A/C Service', image: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=600&auto=format&fit=crop&q=60', link: 'ac-services' },
      { id: '2', title: 'Verified Plumbers at ₹199', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&auto=format&fit=crop&q=60', link: 'plumbing-services' },
      { id: '3', title: 'Complete Home Deep Cleaning 20% OFF', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=60', link: 'cleaning-services' },
    ];
  });
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerUrl, setNewBannerUrl] = useState('');
  const [newBannerLink, setNewBannerLink] = useState('home');

  // 4. Terms & Policies state
  const [termsText, setTermsText] = useState(() => {
    const saved = localStorage.getItem('visvasahome_terms_text');
    return saved || '1. Service bookings placed on VisvasaHome are subject to partner availability.\n2. Platform commission of 15% is automatically calculated from gross service invoices.\n3. Safety checklist verification is mandatory for all service professionals onboarding.';
  });

  const handleToggleCity = (cityName: string) => {
    setCities(prev =>
      prev.map(c => (c.name === cityName ? { ...c, active: !c.active } : c))
    );
  };

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim() || !newBannerUrl.trim()) return;

    const newBanner = {
      id: Date.now().toString(),
      title: newBannerTitle,
      image: newBannerUrl,
      link: newBannerLink
    };

    const updatedBanners = [...banners, newBanner];
    setBanners(updatedBanners);
    localStorage.setItem('visvasahome_banners', JSON.stringify(updatedBanners));
    setNewBannerTitle('');
    setNewBannerUrl('');
    alert('App banner successfully configured and appended to the promotional carousel list.');
  };

  const handleDeleteBanner = (id: string) => {
    const updatedBanners = banners.filter(b => b.id !== id);
    setBanners(updatedBanners);
    localStorage.setItem('visvasahome_banners', JSON.stringify(updatedBanners));
  };

  const handleSaveAll = () => {
    localStorage.setItem('visvasahome_commission_rate', commissionRate.toString());
    localStorage.setItem('visvasahome_safety_fee', safetyFee.toString());
    localStorage.setItem('visvasahome_cities', JSON.stringify(cities));
    localStorage.setItem('visvasahome_banners', JSON.stringify(banners));
    localStorage.setItem('visvasahome_terms_text', termsText);
    alert('Settings configuration successfully compiled and saved permanently in global localStorage configuration database.');
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">App Settings Panel</h1>
            <p className="text-sm text-gray-500">Configure global rates, active service regions, app banner carousels, and policies</p>
          </div>
          <Button onClick={handleSaveAll} className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium shadow-md">
            Save All Changes
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rate & Fee Configuration */}
          <Card className="p-6 border border-gray-200 bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" /> Rates & Fees Settings
            </h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-700">Platform Commission Rate</span>
                  <span className="font-bold text-blue-600 text-base">{commissionRate}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={commissionRate}
                  onChange={e => setCommissionRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <p className="text-[11px] text-gray-500">Deducted from service partner invoice totals per completed service booking.</p>
              </div>

              <div className="space-y-2 border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-700">Customer Safety & Tech Fee</span>
                  <span className="font-bold text-blue-600 text-base">₹{safetyFee}</span>
                </div>
                <Input
                  type="number"
                  value={safetyFee}
                  onChange={e => setSafetyFee(Number(e.target.value))}
                  className="w-32"
                />
                <p className="text-[11px] text-gray-500">Added to customer invoice totals for platform safety checks and backend matching support.</p>
              </div>
            </div>
          </Card>

          {/* Active Cities & Service Areas */}
          <Card className="p-6 border border-gray-200 bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" /> Service Cities & Locations
            </h2>
            <p className="text-xs text-gray-500 mb-4">Toggle city switches to activate/deactivate home-service bookings inside specific areas.</p>
            <div className="grid grid-cols-2 gap-3 max-h-[180px] overflow-y-auto pr-2">
              {cities.map(city => (
                <div
                  key={city.name}
                  onClick={() => handleToggleCity(city.name)}
                  className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all ${
                    city.active ? 'border-blue-200 bg-blue-50/20' : 'border-gray-200 bg-gray-50/50 opacity-60'
                  }`}
                >
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{city.name}</p>
                    <p className="text-[10px] text-gray-500">{city.count} verified workers</p>
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${city.active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-300 ${city.active ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Carousel App Banners */}
        <Card className="p-6 border border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Image className="w-5 h-5 text-blue-600" /> App Promotional Banners (Carousel)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 border-r border-gray-200 lg:pr-6 space-y-4">
              <h3 className="font-bold text-gray-900 text-sm">Add Promo Banner</h3>
              <form onSubmit={handleAddBanner} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Banner Title / Header</label>
                  <Input
                    placeholder="e.g. AC service 20% off"
                    value={newBannerTitle}
                    onChange={e => setNewBannerTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Banner Image URL</label>
                  <Input
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={newBannerUrl}
                    onChange={e => setNewBannerUrl(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Redirect Slug</label>
                  <select
                    value={newBannerLink}
                    onChange={e => setNewBannerLink(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="ac-services">AC Services</option>
                    <option value="plumbing-services">Plumbing Services</option>
                    <option value="cleaning-services">Cleaning Services</option>
                    <option value="home">Home Page</option>
                  </select>
                </div>
                <Button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-xs flex items-center justify-center gap-1.5 h-9">
                  <Plus className="w-4 h-4" /> Add Promo Banner
                </Button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">Active Banners</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map(b => (
                  <div key={b.id} className="relative border border-gray-200 rounded-xl overflow-hidden group shadow-xs">
                    <img src={b.image} alt={b.title} className="w-full h-32 object-cover" />
                    <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-3 text-white">
                      <p className="font-bold text-sm leading-tight mb-1">{b.title}</p>
                      <span className="text-[10px] text-gray-200">Links to: {b.link}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-90 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Terms & Policies Editor */}
        <Card className="p-6 border border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" /> Platform Terms & Policies Config
          </h2>
          <p className="text-xs text-gray-500 mb-4">Edit the raw markdown terms and user safety agreement clauses displayed in client applications.</p>
          <textarea
            value={termsText}
            onChange={e => setTermsText(e.target.value)}
            rows={5}
            className="w-full text-sm font-mono border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
          />
        </Card>
      </div>
    </div>
  );
}
