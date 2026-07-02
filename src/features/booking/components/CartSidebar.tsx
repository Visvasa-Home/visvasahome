import { ShoppingBag, ArrowRight, Minus, Plus, Trash2 } from 'lucide-react';
import { Cart, CartManager } from '@booking/services/cartManager';

interface CartSidebarProps {
  cart: Cart;
  onUpdateQuantity: (serviceId: string, delta: number) => void;
  onCheckout: () => void;
}

export function CartSidebar({ cart, onUpdateQuantity, onCheckout }: CartSidebarProps) {
  if (cart.items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="font-extrabold text-gray-900 text-sm mb-1">No items in your cart</h3>
        <p className="text-xs text-gray-500">Add services to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
          Cart <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-[10px] font-black">{cart.itemCount}</span>
        </h3>
      </div>
      
      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
        {cart.items.map(item => (
          <div key={item.id} className="flex justify-between gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
            <div className="flex-1">
              <h4 className="text-xs font-bold text-gray-900 mb-1 leading-tight">{item.serviceName}</h4>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400 line-through">₹{Math.round(item.price * item.quantity * 1.2).toLocaleString('en-IN')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-0 bg-blue-50 rounded-xl overflow-hidden shadow-sm shadow-blue-500/5 h-8">
              <button
                onClick={() => onUpdateQuantity(item.id, -1)}
                className="w-8 h-full flex items-center justify-center hover:bg-blue-100 transition-colors text-blue-600"
              >
                {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5 font-bold" />}
              </button>
              <span className="w-6 text-center text-[11px] font-black text-blue-900 tabular-nums">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, 1)}
                className="w-8 h-full flex items-center justify-center hover:bg-blue-100 transition-colors text-blue-600"
              >
                <Plus className="w-3.5 h-3.5 font-bold" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50/80 border-t border-gray-100 space-y-3">
        <div className="flex justify-between text-xs text-gray-600 font-semibold">
          <span>Item Total</span>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 line-through text-[10px]">₹{Math.round(cart.total * 1.2).toLocaleString('en-IN')}</span>
            <span className="font-bold text-gray-900">₹{cart.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="flex justify-between text-xs text-emerald-600 font-semibold">
          <span>You save</span>
          <span className="font-bold">₹{Math.round(cart.total * 0.2).toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-600 font-semibold">
          <span>Taxes & Fee</span>
          <span className="font-bold text-gray-900">₹19</span>
        </div>
        <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm font-black text-gray-900">Total</span>
          <span className="text-base font-black text-gray-900">₹{cart.total + 19}</span>
        </div>

        <button
          onClick={onCheckout}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-[#6b2ac8] hover:bg-[#5b24aa] text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md shadow-purple-500/20 active:scale-[0.98]"
        >
          View Cart <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
