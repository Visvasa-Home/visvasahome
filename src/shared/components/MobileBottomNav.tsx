import { Home, Search, Calendar, User, Wallet } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onMenuOpen: () => void;
}

export function MobileBottomNav({ currentPage, onNavigate, onMenuOpen }: MobileBottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-[999] shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.12)] rounded-t-3xl">
      <div className="grid grid-cols-5 px-2 py-1">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="relative flex flex-col items-center justify-center py-3 px-1 transition-all group focus:outline-none"
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-1 bg-[#2563EB] rounded-b-full shadow-[0_2px_8px_rgba(37,99,235,0.5)]" />
              )}
              <div className={`relative flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-300 ${isActive ? 'bg-blue-50 text-[#2563EB] scale-110' : 'text-gray-400 group-hover:bg-gray-50 group-hover:text-gray-600'}`}>
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold mt-1 transition-all duration-300 ${isActive ? 'text-[#2563EB]' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
