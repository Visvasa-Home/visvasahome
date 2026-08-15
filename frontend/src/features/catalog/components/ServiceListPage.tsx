import { useState } from 'react';
import { ArrowLeft, Search, Share2, Star, Menu as MenuIcon, X, ChevronDown, ChevronUp, Percent } from 'lucide-react';
import { toast } from 'sonner';

interface ServiceListPageProps {
  onBack: () => void;
}

export function ServiceListPage({ onBack }: ServiceListPageProps) {
  const [showCoupons, setShowCoupons] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [expandedCoupon, setExpandedCoupon] = useState<string | null>(null);

  const services = [
    {
      id: 's1',
      title: 'O3+ skin brightening facial',
      rating: '4.79',
      reviews: '9K reviews',
      price: '₹2,000',
      originalPrice: '₹2,100',
      time: '1 hr 5 mins',
      desc: 'Enhances the skin texture & boosting the glow of the skin for a longer period',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&auto=format&fit=crop'
    },
    {
      id: 's2',
      title: 'Repechage skin brightening facial',
      rating: '4.81',
      reviews: '6K reviews',
      price: '₹2,000',
      originalPrice: '₹2,100',
      time: '60 mins',
      desc: 'Power-packed seaweed to improve skin texture & fight ageing',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&auto=format&fit=crop'
    },
    {
      id: 's3',
      title: 'O3+ face & neck detan',
      rating: '4.83',
      reviews: '10K reviews',
      price: '₹699',
      originalPrice: '',
      time: '30 mins',
      desc: 'Tan removal with reduction of dark spots, blemishes & pigmentation',
      image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71c9?w=400&auto=format&fit=crop'
    },
    {
      id: 's4',
      title: 'O3+ cleanup',
      rating: '4.84',
      reviews: '6K reviews',
      price: '₹1,299',
      originalPrice: '',
      time: '40 mins',
      desc: 'Deep cleansing and exfoliation to remove dead skin cells and blackheads',
      image: 'https://images.unsplash.com/photo-1512496015851-a1fbaf6928e4?w=400&auto=format&fit=crop'
    }
  ];

  const subCategories = [
    { title: 'Super saver packages', icon: 'Upto 20% OFF', isTextIcon: true },
    { title: 'Face care', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&auto=format&fit=crop', badge: 'New' },
    { title: 'Waxing & threading', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71c9?w=200&auto=format&fit=crop' },
    { title: 'Japanese rituals', image: 'https://images.unsplash.com/photo-1512496015851-a1fbaf6928e4?w=200&auto=format&fit=crop' },
  ];

  const coupons = [
    {
      code: 'TEEJ25',
      label: 'teej_25',
      details: [
        'Valid for first-time salon users only',
        '25% off on your first salon booking'
      ]
    },
    {
      code: 'STYLE200',
      label: 'style200',
      details: [
        'Flat ₹200 off on services above ₹999',
        'Applicable once per user'
      ]
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-white flex flex-col relative pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full -ml-2 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-base font-semibold text-gray-900">Salon Royale for kids & men</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.info('Search feature coming soon')} className="p-2 border border-gray-200 hover:bg-gray-50 rounded-full transition-colors">
            <Search className="w-4 h-4 text-gray-800" />
          </button>
          <button onClick={() => toast.info('Share feature coming soon')} className="p-2 border border-gray-200 hover:bg-gray-50 rounded-full transition-colors">
            <Share2 className="w-4 h-4 text-gray-800" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        {/* Category Sticky Header */}
        <div className="sticky top-[60px] z-30 bg-white px-4 py-3 border-b border-gray-100">
          <h2 className="text-[15px] font-bold text-gray-900">Face care</h2>
        </div>

        {/* Service List */}
        <div className="space-y-0">
          {services.map(service => (
            <div key={service.id} className="bg-white p-5 flex gap-4 border-b border-gray-100">
              <div className="flex-1 pr-2">
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug">{service.title}</h3>
                
                <div className="flex items-center gap-1 mt-1.5 mb-2">
                  <Star className="w-3.5 h-3.5 text-gray-600 fill-gray-600" />
                  <span className="text-xs font-medium text-gray-500">{service.rating} ({service.reviews})</span>
                </div>

                <div className="flex items-center gap-2 text-[13px] mb-2.5">
                  <span className="font-bold text-gray-900">{service.price}</span>
                  {service.originalPrice && (
                    <span className="text-gray-400 line-through">{service.originalPrice}</span>
                  )}
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 font-medium">{service.time}</span>
                </div>

                <div className="border-b border-dashed border-gray-200 mb-2.5 w-full"></div>

                <p className="text-[12px] text-gray-500 leading-relaxed mb-3 font-medium">{service.desc}</p>
                <button onClick={() => toast.info('Showing details...')} className="text-blue-700 text-[13px] font-semibold">View details</button>
              </div>
              
              <div className="w-[110px] flex flex-col items-center flex-shrink-0 pt-2">
                <div className="w-[110px] h-[110px] rounded-[16px] overflow-hidden relative shadow-sm bg-gray-50">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] flex justify-center">
                    <button onClick={() => toast.success('Service added to cart!')} className="bg-white text-blue-700 border border-gray-200 px-6 py-1.5 rounded-[10px] text-[13px] font-bold shadow-md hover:bg-blue-50 transition-colors w-full cursor-pointer">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* OVERLAYS / BOTTOM SHEETS */}
      
      {/* Trigger for Sub-categories (Floating Menu Button) */}
      <button 
        onClick={() => setShowCategories(true)}
        className="fixed bottom-[40px] left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-full text-[13px] font-semibold shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center gap-2 hover:bg-black transition-colors z-30"
      >
        <MenuIcon className="w-4 h-4" />
        Menu
      </button>
      
      {/* 1. Offers & Coupons Bottom Sheet */}
      {showCoupons && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 transition-opacity">
          <div className="absolute inset-0" onClick={() => setShowCoupons(false)} />
          <div className="bg-white w-full max-w-md rounded-t-3xl min-h-[60vh] max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-[slideUp_0.3s_ease-out]">
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Offers & Coupons</h2>
              <button onClick={() => setShowCoupons(false)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {coupons.map(coupon => {
                const isExpanded = expandedCoupon === coupon.code;
                return (
                  <div key={coupon.code} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setExpandedCoupon(isExpanded ? null : coupon.code)}
                      className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                          <Percent className="w-5 h-5 text-blue-700" />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-gray-900 uppercase tracking-wide">{coupon.code}</h4>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">Code : {coupon.label}</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-gray-100 border-dashed mx-4">
                        <ul className="list-disc list-outside pl-4 space-y-2 mt-3 text-xs text-gray-600 font-medium">
                          {coupon.details.map((detail, idx) => (
                            <li key={idx}>{detail}</li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => {
                            toast.success(`Coupon ${coupon.code} applied successfully!`);
                            setShowCoupons(false);
                          }}
                          className="w-full mt-4 bg-blue-50 text-blue-700 font-bold py-2 rounded-xl text-xs hover:bg-blue-100 transition-colors"
                        >
                          Apply {coupon.code}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Sub-categories Bottom Sheet */}
      {showCategories && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 transition-opacity">
          <div className="absolute inset-0" onClick={() => setShowCategories(false)} />
          <div className="bg-white w-full max-w-md rounded-t-[32px] overflow-hidden flex flex-col relative z-10 animate-[slideUp_0.3s_ease-out]">
            <button onClick={() => setShowCategories(false)} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 p-3 bg-white border border-gray-200 hover:bg-gray-100 rounded-full transition-colors shadow-lg">
              <X className="w-6 h-6 text-gray-800" />
            </button>
            <div className="p-6 pt-10 pb-24 max-h-[85vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                {subCategories.map((sub, idx) => (
                  <button key={idx} className="flex flex-col items-center group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 mb-2 relative flex items-center justify-center">
                      {sub.isTextIcon ? (
                        <div className="text-center p-2 flex flex-col items-center justify-center w-full h-full">
                          <span className="text-[10px] text-blue-700 font-bold block leading-tight">Upto</span>
                          <span className="text-xl text-blue-700 font-black leading-tight block">20%</span>
                          <span className="text-lg text-blue-700 font-black leading-tight block">OFF</span>
                        </div>
                      ) : (
                        <img src={sub.image} alt={sub.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      )}
                      {sub.badge && (
                        <span className="absolute top-0 right-0 bg-blue-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                          {sub.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-gray-800 text-center leading-tight px-1">
                      {sub.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-\\[slideUp_0\\.3s_ease-out\\] {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
