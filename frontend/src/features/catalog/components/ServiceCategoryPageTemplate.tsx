import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Clock, Shield, Star, CheckCircle, ShoppingBag, Plus, Minus, Info, ArrowRight, Trash2 } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { CartManager, Cart } from '@booking/services/cartManager';
import { CartDrawer } from '@booking/components/CartDrawer';
import { CartSidebar } from '@booking/components/CartSidebar';
import { ServiceDetailModal } from '@booking/components/ServiceDetailModal';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  warranty: string;
  popular?: boolean;
  subcategory: string;
}

interface ServiceCategoryPageTemplateProps {
  categoryName: string;
  categorySlug: string;
  categoryIcon: any;
  themeColor: string;
  services: ServiceItem[];
  subcategories: string[];
  onBack: () => void;
  onBookNow: () => void;
}

export function ServiceCategoryPageTemplate({
  categoryName,
  categorySlug,
  categoryIcon: CategoryIcon,
  themeColor,
  services,
  subcategories,
  onBack,
  onBookNow,
}: ServiceCategoryPageTemplateProps) {
  const [activeSubcategory, setActiveSubcategory] = useState(subcategories[0] || '');
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });
  const [selectedServiceDetails, setSelectedServiceDetails] = useState<ServiceItem | null>(null);
  const [categoryConflict, setCategoryConflict] = useState<ServiceItem | null>(null);
  const [addedFlash, setAddedFlash] = useState<string | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Sync cart from storage + listen for cross-component updates
  const refreshCart = useCallback(() => setCart(CartManager.getCart()), []);
  useEffect(() => {
    refreshCart();
    window.addEventListener('visvasahome_cart_updated', refreshCart as any);
    return () => window.removeEventListener('visvasahome_cart_updated', refreshCart as any);
  }, [refreshCart]);

  const getQty = (serviceId: string) => cart.items.find(i => i.id === serviceId)?.quantity ?? 0;

  const handleAdd = (service: ServiceItem, force = false) => {
    if (cart.items.length > 0 && cart.categorySlug && cart.categorySlug !== categorySlug && !force) {
      setCategoryConflict(service);
      return;
    }

    setCart(CartManager.addItem({
      id: service.id,
      serviceName: service.name,
      category: categoryName,
      categorySlug,
      price: service.price,
      duration: service.duration,
    }));

    // flash animation
    setAddedFlash(service.id);
    setTimeout(() => setAddedFlash(null), 600);
  };

  const handleDecrement = (service: ServiceItem) => {
    setCart(CartManager.decrementItem(service.id));
  };

  const filteredServices = services.filter(
    s => s.subcategory.toLowerCase() === activeSubcategory.toLowerCase()
  );

  const thisCartItems = cart.categorySlug === categorySlug ? cart.items : [];
  const thisTotal = thisCartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const thisCount = thisCartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header Banner */}
      <div className={`bg-gradient-to-r ${themeColor} text-white shadow-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-5 h-5" /><span>Back to Home</span>
          </button>
          <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm shadow-inner shrink-0">
                <CategoryIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-tight">{categoryName}</h1>
                <p className="text-white/80 text-sm mt-1 max-w-xl">
                  Doorstep professional services by certified experts. Background verified, insured, and guaranteed.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-white/95 font-semibold">
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-400 text-blue-400" /> 4.85 (82k bookings)</span>
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5" /> 90-day warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── UC-style Promotional Cover Banner ── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none">
            <span className="shrink-0 inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
              <Shield className="w-3.5 h-3.5" /> Visvasahome Cover
            </span>
            <span className="text-xs font-semibold text-white/90 shrink-0">
              Upto 90-day warranty on all repairs · Free re-service if unsatisfied
            </span>
            <span className="ml-auto shrink-0 bg-white text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide cursor-pointer hover:bg-blue-50 transition-colors">
              SAVE20 — 20% off
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left: Subcategory Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-150 p-3 sticky top-24 shadow-xs">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2.5">Subcategories</p>
              <div className="space-y-1">
                {subcategories.map((sub) => {
                  const isActive = sub.toLowerCase() === activeSubcategory.toLowerCase();
                  return (
                    <button
                      key={sub}
                      onClick={() => setActiveSubcategory(sub)}
                      className={`w-full flex items-center justify-between px-3 py-3 text-left rounded-xl transition-all font-semibold text-sm
                        ${isActive
                          ? 'bg-blue-50 text-[#2563EB] border-l-4 border-l-[#2563EB]'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Horizontal Tabs (Mobile) */}
          <div className="lg:hidden -mx-4 px-4 sticky top-0 bg-gray-50/95 backdrop-blur-md py-3 z-30 border-b border-gray-200 shadow-xs overflow-x-auto scrollbar-none">
            <div className="flex gap-2 flex-nowrap">
              {subcategories.map((sub) => {
                const isActive = sub.toLowerCase() === activeSubcategory.toLowerCase();
                return (
                  <button
                    key={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    className={`shrink-0 px-4 py-2 text-xs font-bold rounded-full transition-all border ${isActive
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm shadow-blue-500/10'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center: Service Listings */}
          <div className="lg:col-span-2 space-y-4">
            {/* Social Proof Bar — UC Style */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-blue-400" />
                4.85
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-500 font-semibold">82,000+ bookings</span>
              <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                ✓ Verified
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                🛡️ 90-day Warranty
              </span>
            </div>

            <h2 className="text-xl font-black text-gray-900 border-b border-gray-150 pb-2.5">
              {activeSubcategory}
            </h2>

            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500 font-medium">
                No services available in this category.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredServices.map((service) => {
                  const qty = getQty(service.id);
                  const isFlashing = addedFlash === service.id;
                  return (
                    <Card
                      key={service.id}
                      className={`p-5 transition-all duration-200 border bg-white flex flex-col sm:flex-row justify-between gap-4
                        ${qty > 0 ? 'border-blue-200 shadow-md shadow-blue-500/5' : 'border-gray-200 hover:shadow-md'}
                        ${isFlashing ? 'scale-[1.01]' : 'scale-100'}
                      `}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h3 className="font-extrabold text-base text-gray-950">{service.name}</h3>
                          {service.popular && (
                            <Badge className="bg-blue-500 text-white font-bold text-[9px] px-2 py-0.5 uppercase tracking-wide">
                              Bestseller
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-base text-gray-900">
                              {service.price === 0 ? 'Get Quote' : `₹${service.price}`}
                            </span>
                            {service.price > 0 && (
                              <span className="text-gray-400 line-through text-xs font-semibold">
                                ₹{Math.round(service.price * 1.2).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {service.duration}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-gray-700">{service.warranty} warranty</span>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed max-w-xl">{service.description}</p>
                        <button
                          onClick={() => setSelectedServiceDetails(service)}
                          className="mt-3 text-xs text-[#2563EB] font-bold hover:underline flex items-center gap-1 focus:outline-none"
                        >
                          <Info className="w-3.5 h-3.5" /> View Details
                        </button>
                      </div>

                      {/* ── Swiggy-style Add Button ── */}
                      <div className="sm:self-center shrink-0">
                        {qty === 0 ? (
                          <button
                            onClick={() => handleAdd(service)}
                            className="relative flex items-center justify-center gap-1.5 px-7 py-2.5 bg-white border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white font-black text-sm rounded-2xl transition-all shadow-sm hover:shadow-blue-500/20 active:scale-95 group"
                          >
                            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
                            <span>ADD</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-0 bg-[#2563EB] rounded-2xl overflow-hidden shadow-md shadow-blue-500/20">
                            <button
                              onClick={() => handleDecrement(service)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors active:scale-90"
                            >
                              {qty === 1
                                ? <Trash2 className="w-4 h-4 text-white" />
                                : <Minus className="w-4 h-4 text-white font-bold" />
                              }
                            </button>
                            <span className="w-9 text-center text-sm font-black text-white tabular-nums">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleAdd(service)}
                              className="w-10 h-10 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors active:scale-90"
                            >
                              <Plus className="w-4 h-4 text-white font-bold" />
                            </button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Trust Banners & Cart Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">
              <CartSidebar
                cart={cart}
                onUpdateQuantity={(id, delta) => {
                  if (delta > 0) {
                    const svc = services.find(s => s.id === id);
                    if (svc) handleAdd(svc);
                  } else {
                    setCart(CartManager.decrementItem(id));
                  }
                }}
                onCheckout={onBookNow}
              />

              {/* Visvasa Promise Card — UC Style */}
              <div className="bg-white rounded-2xl border border-gray-150 p-5 shadow-xs overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -translate-y-6 translate-x-6" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🏅</span>
                    <h3 className="font-extrabold text-gray-900 text-sm">Visvasa Promise</h3>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-blue-600" />
                      </span>
                      <div>
                        <p className="font-bold text-gray-800">Verified Professionals</p>
                        <p className="text-gray-500 mt-0.5">Background checked · Trained · Insured</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-blue-600" />
                      </span>
                      <div>
                        <p className="font-bold text-gray-800">Hassle-Free Booking</p>
                        <p className="text-gray-500 mt-0.5">Same-day slots · Real-time tracking</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-start">
                      <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle className="w-3 h-3 text-blue-600" />
                      </span>
                      <div>
                        <p className="font-bold text-gray-800">Transparent Pricing</p>
                        <p className="text-gray-500 mt-0.5">No hidden charges · Fixed rates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══ Swiggy-Style Floating Bottom Cart Bar ═══ */}
      <div
        className={`fixed bottom-[68px] lg:bottom-0 left-0 right-0 z-40 transition-all duration-500 ease-out
          ${thisCount > 0
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
          }`}
      >
        <div className="max-w-3xl mx-auto px-4 pb-4 lg:pb-5">
          <button
            onClick={() => setCartDrawerOpen(true)}
            className="w-full flex items-center justify-between bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white rounded-2xl px-5 py-4 shadow-2xl shadow-blue-500/40 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
                <ShoppingBag className="w-4 h-4" />
                <span className="text-sm font-black">{thisCount}</span>
              </div>
              <div className="text-left">
                <p className="font-black text-sm">View Cart</p>
                <p className="text-white/70 text-[10px] font-semibold">
                  {thisCount} service{thisCount !== 1 ? 's' : ''} added
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-black text-base">₹{thisTotal}</p>
                <p className="text-white/60 text-[10px] font-semibold">+ ₹19 fee</p>
              </div>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>

      {/* ── CartDrawer (Swiggy-style slide-in) ── */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        onProceed={onBookNow}
      />

      {/* ── Category Conflict Dialog ── */}
      {categoryConflict && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-2">Items already in cart</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Your cart has services from a different category. Do you want to clear it and add <strong>{categoryConflict.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCategoryConflict(null)}
                className="flex-1 py-3 border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Keep Existing
              </button>
              <button
                onClick={() => {
                  CartManager.clearCart();
                  const item = categoryConflict;
                  setCategoryConflict(null);
                  handleAdd(item, true);
                }}
                className="flex-1 py-3 bg-[#2563EB] rounded-2xl text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors"
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Service Details Modal ── */}
      {selectedServiceDetails && (
        <ServiceDetailModal
          service={selectedServiceDetails}
          onClose={() => setSelectedServiceDetails(null)}
          onAdd={() => {
            handleAdd(selectedServiceDetails);
            setSelectedServiceDetails(null);
          }}
        />
      )}
    </div>
  );
}
