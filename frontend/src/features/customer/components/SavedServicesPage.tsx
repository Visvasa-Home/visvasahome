import { useState } from 'react';
import { ArrowLeft, Heart, Wrench, Zap, Droplets, Wind, Paintbrush2, Scissors, Trash2 } from 'lucide-react';

interface SavedServicesPageProps {
  onBack: () => void;
  onBookService: () => void;
}

interface SavedService {
  id: string;
  name: string;
  category: string;
  icon: React.ElementType;
  iconBg: string;
  startingFrom: number;
  rating: number;
  reviews: number;
  saved: boolean;
}

const initialSaved: SavedService[] = [
  { id: '1', name: 'Deep Home Cleaning', category: 'Cleaning', icon: Heart, iconBg: 'bg-blue-100 text-blue-600', startingFrom: 1299, rating: 4.8, reviews: 2341, saved: true },
  { id: '2', name: 'AC Service & Repair', category: 'Appliance Repair', icon: Wind, iconBg: 'bg-blue-100 text-blue-600', startingFrom: 599, rating: 4.7, reviews: 1876, saved: true },
  { id: '3', name: 'Full Home Painting', category: 'Painting', icon: Paintbrush2, iconBg: 'bg-blue-100 text-blue-600', startingFrom: 8000, rating: 4.9, reviews: 987, saved: true },
  { id: '4', name: 'Electrical Wiring & Fitting', category: 'Electrical', icon: Zap, iconBg: 'bg-blue-100 text-blue-600', startingFrom: 299, rating: 4.6, reviews: 3210, saved: true },
  { id: '5', name: 'Plumbing — All Works', category: 'Plumbing', icon: Droplets, iconBg: 'bg-blue-100 text-[#2563EB]', startingFrom: 249, rating: 4.7, reviews: 2890, saved: true },
  { id: '6', name: 'Salon at Home', category: 'Beauty', icon: Scissors, iconBg: 'bg-blue-100 text-blue-600', startingFrom: 399, rating: 4.9, reviews: 5432, saved: true },
];

export function SavedServicesPage({ onBack, onBookService }: SavedServicesPageProps) {
  const [services, setServices] = useState<SavedService[]>(initialSaved);

  const remove = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-12 pb-6 lg:pt-8">
        <div className="w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl font-bold">Saved Services</h1>
              <p className="text-blue-100 text-xs">{services.length} services saved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 py-5">
        {services.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center mt-4">
            <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="font-bold text-gray-700 mb-1">No saved services</p>
            <p className="text-gray-500 text-sm mb-6">Tap the heart icon on any service to save it here</p>
            <button
              onClick={onBookService}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-semibold text-sm hover:bg-[#2563EB] transition-colors"
            >
              Explore Services
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div key={svc.id} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 border border-gray-100">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${svc.iconBg}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm leading-snug">{svc.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{svc.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-gray-900">From ₹{svc.startingFrom.toLocaleString()}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs text-blue-600 font-semibold">★ {svc.rating}</span>
                      <span className="text-xs text-gray-400">({svc.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={onBookService}
                      className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-semibold rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                      Book
                    </button>
                    <button
                      onClick={() => remove(svc.id)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-500 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <button
              onClick={onBookService}
              className="w-full py-4 border-2 border-dashed border-blue-200 rounded-2xl text-[#2563EB] font-semibold text-sm hover:bg-blue-50 transition-colors mt-2"
            >
              + Discover More Services
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
