import { X, Clock, Star, Info, Plus, Sparkles, Check, Droplets, Zap } from 'lucide-react';
import { ServiceItem } from '@catalog/components/ServiceCategoryPageTemplate';

interface ServiceDetailModalProps {
  service: ServiceItem;
  onClose: () => void;
  onAdd: () => void;
}

export function ServiceDetailModal({ service, onClose, onAdd }: ServiceDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4 z-[100]">
      {/* Overlay click area */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative z-10 animate-fade-in">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white z-20 border-b border-gray-100 rounded-t-3xl px-5 py-4 flex items-center justify-between shadow-xs">
          <div className="pr-4">
            <h3 className="text-base font-black text-gray-900 line-clamp-1">{service.name}</h3>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-1">
              <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-blue-400" /> 4.8 (10k+ reviews)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onAdd}
              className="px-4 py-1.5 bg-white border-2 border-[#2563EB] text-[#2563EB] hover:bg-blue-50 font-black text-sm rounded-xl transition-all shadow-sm active:scale-95"
            >
              Add
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-thin">
          
          {/* Price & Duration Strip */}
          <div className="px-6 py-4 flex items-center gap-3 text-sm font-semibold text-gray-600 bg-gray-50/50">
            <span className="text-[#2563EB] font-black text-lg">
              {service.price === 0 ? 'Get Quote' : `₹${service.price}`}
            </span>
            <span className="text-gray-400 line-through text-xs font-medium">₹{Math.floor(service.price * 1.2)}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {service.duration}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span>{service.warranty}</span>
          </div>

          <div className="border-t-4 border-gray-100" />

          {/* ✨ Highlights Section */}
          <div className="px-6 py-6">
            <h4 className="flex items-center gap-2 text-sm font-black text-gray-900 mb-4 tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-blue-500" /> Highlights
            </h4>
            
            <p className="font-bold text-gray-800 text-sm mb-4 leading-relaxed">
              Highly rated by customers for professional execution and overall service quality.
            </p>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 font-medium">Verified professional experts assigned</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 font-medium">Use of genuine parts & eco-friendly materials</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 font-medium">Post-service cleanup included</span>
              </li>
            </ul>
          </div>

          <div className="border-t-4 border-gray-100" />

          {/* Service Details & Description */}
          <div className="px-6 py-6 bg-gray-50/30">
            <h4 className="text-lg font-black text-gray-900 mb-4">{service.name} details</h4>
            <p className="text-sm text-gray-600 leading-relaxed font-medium mb-6">
              {service.description}
            </p>

            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <h5 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-2">
                <Info className="w-4 h-4" /> Service Included
              </h5>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start gap-2 text-sm text-blue-800/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Complete diagnosis and professional execution</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-800/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Tools, standard equipment, and basic supplies</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-800/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Labor charges for the specified duration</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 mt-4">
              <h5 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-2">
                <X className="w-4 h-4" /> Excluded
              </h5>
              <ul className="space-y-2 mt-3">
                <li className="flex items-start gap-2 text-sm text-blue-800/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Cost of spare parts or replacement materials</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-blue-800/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <span>Additional scope of work beyond description</span>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
