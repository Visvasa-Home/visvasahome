import { MapPin, User, LogIn, ShoppingBag } from 'lucide-react';
import { LocationSelector } from '@shared/components/LocationSelector';
import { CartManager } from '@booking/services/cartManager';
import { useState, useEffect } from 'react';

interface MobileTopBarProps {
  selectedLocation: string | null;
  onLocationSelect: (location: string) => void;
  isAuthenticated: boolean;
  onLogin: () => void;
  onProfile: () => void;
  onCartOpen: () => void;
}

export function MobileTopBar({
  selectedLocation,
  onLocationSelect,
  isAuthenticated,
  onLogin,
  onProfile,
  onCartOpen
}: MobileTopBarProps) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => setCartCount(CartManager.getCart().items.length);
    updateCart();
    window.addEventListener('visvasahome_cart_updated', updateCart as EventListener);
    return () => window.removeEventListener('visvasahome_cart_updated', updateCart as EventListener);
  }, []);

  return (
    <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between px-4 py-2.5">
        
        {/* Left: Location */}
        <div className="flex-1 min-w-0 pr-4">
          <LocationSelector 
            selectedLocation={selectedLocation} 
            onLocationSelect={onLocationSelect} 
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onCartOpen}
            className="relative p-2 text-gray-700 bg-gray-50 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
          
          <button
            onClick={isAuthenticated ? onProfile : onLogin}
            className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] overflow-hidden"
          >
            {isAuthenticated ? (
              <User className="w-5 h-5" />
            ) : (
              <LogIn className="w-4 h-4 ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
