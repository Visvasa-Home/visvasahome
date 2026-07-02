import { useState, useEffect } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Tag, ArrowRight, Gift, ShieldCheck, Clock } from 'lucide-react';
import { CartManager, Cart, CartItem } from '@booking/services/cartManager';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  'FIRST50': { discount: 0.5, label: '50% off on first booking' },
  'SAVE20': { discount: 0.2, label: '20% off on your order' },
  'VIP10': { discount: 0.1, label: '10% off — VIP member' },
};

export function CartDrawer({ isOpen, onClose, onProceed }: CartDrawerProps) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setCart(CartManager.getCart());
    refresh();
    window.addEventListener('visvasahome_cart_updated', refresh as any);
    return () => window.removeEventListener('visvasahome_cart_updated', refresh as any);
  }, []);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleAdd = (item: CartItem) => {
    setCart(CartManager.addItem({
      id: item.id,
      serviceName: item.serviceName,
      category: item.category,
      categorySlug: item.categorySlug,
      price: item.price,
      duration: item.duration,
    }));
  };

  const handleDecrement = (itemId: string) => {
    setCart(CartManager.decrementItem(itemId));
  };

  const handleRemove = (itemId: string) => {
    setRemovingId(itemId);
    setTimeout(() => {
      setCart(CartManager.removeItem(itemId));
      setRemovingId(null);
    }, 280);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(PROMO_CODES[code]);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try FIRST50, SAVE20, or VIP10');
      setAppliedPromo(null);
    }
  };

  const discount = appliedPromo ? Math.round(cart.total * appliedPromo.discount) : 0;
  const platformFee = cart.total > 0 ? 19 : 0;
  const finalTotal = cart.total - discount + platformFee;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[998] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[999] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-base">Your Cart</h2>
              {cart.itemCount > 0 && (
                <p className="text-xs text-gray-400 font-semibold">{cart.itemCount} service{cart.itemCount !== 1 ? 's' : ''} · ₹{cart.total}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full px-6 py-16 text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                <ShoppingBag className="w-12 h-12 text-blue-200" />
              </div>
              <h3 className="text-lg font-black text-gray-800 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                Add services from our categories to get started. We'll come to your doorstep!
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-[#2563EB] text-white rounded-2xl font-bold text-sm hover:bg-[#1D4ED8] transition-colors"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="px-4 py-4 space-y-3">
              {/* Free delivery banner */}
              <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                <Gift className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-xs font-bold text-green-700">
                  You qualify for <span className="underline">priority scheduling</span> on this order!
                </p>
              </div>

              {/* Cart Items */}
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm transition-all duration-300 ${removingId === item.id ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Color dot */}
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-500 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-gray-900 text-sm leading-tight">{item.serviceName}</p>
                      <p className="text-xs text-gray-400 font-semibold mt-0.5 capitalize">{item.category}</p>
                      {item.duration && (
                        <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />{item.duration}
                        </p>
                      )}
                    </div>
                    {/* Price + Qty */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <p className="text-sm font-black text-gray-900">₹{item.price * item.quantity}</p>
                      {/* Quantity stepper */}
                      <div className="flex items-center bg-[#2563EB] rounded-xl overflow-hidden shadow-sm shadow-blue-500/20">
                        <button
                          onClick={() => item.quantity === 1 ? handleRemove(item.id) : handleDecrement(item.id)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
                        >
                          {item.quantity === 1
                            ? <Trash2 className="w-3.5 h-3.5 text-white" />
                            : <Minus className="w-3.5 h-3.5 text-white" />
                          }
                        </button>
                        <span className="w-7 text-center text-sm font-black text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleAdd(item)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {item.price > 0 && item.quantity > 1 && (
                    <p className="text-[10px] text-gray-400 mt-2 ml-5 font-semibold">
                      ₹{item.price} × {item.quantity}
                    </p>
                  )}
                </div>
              ))}

              {/* Promo Code */}
              <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-sm font-black text-gray-800">Apply Promo Code</span>
                </div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                    <div>
                      <p className="text-xs font-black text-green-700">{promoCode.toUpperCase()} applied! 🎉</p>
                      <p className="text-[10px] text-green-600 font-semibold mt-0.5">{appliedPromo.label}</p>
                    </div>
                    <button
                      onClick={() => { setAppliedPromo(null); setPromoCode(''); }}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                      onKeyDown={e => e.key === 'Enter' && handleApplyPromo()}
                      placeholder="Enter code (e.g. FIRST50)"
                      className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 font-semibold"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-[#2563EB] text-white text-sm font-bold rounded-xl hover:bg-[#1D4ED8] transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[10px] text-red-500 font-semibold mt-1.5">{promoError}</p>}
              </div>

              {/* Bill Summary */}
              <div className="bg-white border border-gray-100 rounded-2xl p-4">
                <h3 className="text-sm font-black text-gray-900 mb-3">Bill Summary</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Service Total</span>
                    <span className="font-extrabold text-gray-900">₹{cart.total}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-semibold">Promo Discount</span>
                      <span className="font-extrabold">−₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                      Visit Charge
                      <span className="text-[9px] bg-gray-100 rounded-md px-1 py-0.5 text-gray-400 font-bold">Includes GST</span>
                    </span>
                    <span className="font-extrabold text-gray-900">₹{platformFee}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                    <span className="font-black text-gray-900">Total to Pay</span>
                    <span className="font-black text-[#2563EB] text-base">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                  Secure Payment
                </div>
                <div className="w-1 h-1 bg-gray-200 rounded-full" />
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  Verified Pros
                </div>
                <div className="w-1 h-1 bg-gray-200 rounded-full" />
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  90-day Warranty
                </div>
              </div>

              {/* Bottom padding for the sticky button */}
              <div className="h-4" />
            </div>
          )}
        </div>

        {/* Sticky Proceed Button */}
        {cart.items.length > 0 && (
          <div className="border-t border-gray-100 bg-white px-4 py-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
            <button
              onClick={() => { onClose(); onProceed(); }}
              className="w-full flex items-center justify-between bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white rounded-2xl px-5 py-4 font-black text-sm shadow-lg shadow-blue-500/25 transition-all"
            >
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white font-black text-xs px-2.5 py-1 rounded-lg">
                  {cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}
                </span>
                <span>Proceed to Booking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-black">₹{finalTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
