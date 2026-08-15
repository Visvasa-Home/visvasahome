import { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { CartManager, Cart } from '@booking/services/cartManager';

interface StickyCartBarProps {
  onViewCart: () => void;
}

export function StickyCartBar({ onViewCart }: StickyCartBarProps) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0, itemCount: 0 });

  useEffect(() => {
    const refresh = () => setCart(CartManager.getCart());
    refresh();
    window.addEventListener('visvasahome_cart_updated', refresh as any);
    return () => window.removeEventListener('visvasahome_cart_updated', refresh as any);
  }, []);

  const hasItems = cart.itemCount > 0;
  const platformFee = 19;
  const totalWithFee = cart.total + platformFee;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 transform ${
        hasItems ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 pb-4 lg:pb-5">
        <button
          onClick={onViewCart}
          className="w-full flex items-center justify-between bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white rounded-2xl px-5 py-4 shadow-2xl shadow-blue-500/40 transition-all border border-blue-400/20"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm font-black">{cart.itemCount}</span>
            </div>
            <div className="text-left">
              <p className="font-black text-sm">View Cart</p>
              <p className="text-white/70 text-[10px] font-semibold">
                {cart.itemCount} service{cart.itemCount !== 1 ? 's' : ''} added
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-black text-base">₹{cart.total}</p>
              <p className="text-white/60 text-[10px] font-semibold">+ ₹{platformFee} visit charge</p>
            </div>
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </div>
  );
}
