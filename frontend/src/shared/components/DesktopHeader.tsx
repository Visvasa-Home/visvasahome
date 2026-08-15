import { Search, MapPin, User, ShoppingBag, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CartManager } from '@booking/services/cartManager';
import { LocationSelector } from './LocationSelector';

interface DesktopHeaderProps {
  selectedLocation: string | null;
  onLocationSelect: (location: string) => void;
  isAuthenticated: boolean;
  onLogin: () => void;
  onProfile: () => void;
  onCartOpen: () => void;
}

export function DesktopHeader({
  selectedLocation,
  onLocationSelect,
  isAuthenticated,
  onLogin,
  onProfile,
  onCartOpen
}: DesktopHeaderProps) {
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateCart = () => setCartCount(CartManager.getCart().items.length);
    updateCart();
    window.addEventListener('visvasahome_cart_updated', updateCart as EventListener);
    return () => window.removeEventListener('visvasahome_cart_updated', updateCart as EventListener);
  }, []);

  return (
    <div className="hidden md:flex bg-white border-b border-gray-200 sticky top-0 z-[100] h-[72px] items-center px-6 lg:px-10 justify-between">
      
      {/* Left: Logo & Location */}
      <div className="flex items-center gap-6 lg:gap-10 h-full">
        <div className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-xl leading-none">V</span>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight hidden lg:block">VisvasaHome</span>
        </div>
        
        <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>

        <div className="hidden md:block w-48 lg:w-64">
          <LocationSelector 
            selectedLocation={selectedLocation} 
            onLocationSelect={onLocationSelect}
            customTrigger={
              <div className="flex items-center gap-1.5 cursor-pointer text-gray-700 hover:text-black group">
                <MapPin className="w-5 h-5 text-gray-500 group-hover:text-black transition-colors" />
                <span className="text-sm font-semibold truncate max-w-[150px]">
                  {selectedLocation || 'Select location'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
              </div>
            }
          />
        </div>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex-1 max-w-xl px-4 lg:px-8">
        <div className="bg-gray-100/80 hover:bg-gray-100 rounded-xl flex items-center gap-3 px-4 py-2.5 transition-colors border border-transparent focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-sm">
          <Search className="w-5 h-5 text-gray-500 shrink-0" />
          <input 
            type="text"
            placeholder="Search for 'AC Service'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent w-full outline-none text-[15px] font-medium text-gray-900 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6 h-full shrink-0">
        <button 
          onClick={onCartOpen}
          className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold text-[15px] transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="hidden lg:block">Cart</span>
        </button>

        <button 
          onClick={isAuthenticated ? onProfile : onLogin}
          className="flex items-center gap-2 text-gray-700 hover:text-black font-semibold text-[15px] transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="hidden lg:block">{isAuthenticated ? 'Profile' : 'Login'}</span>
        </button>
      </div>

    </div>
  );
}
