import { Phone, LogOut, ChevronRight, Settings, HelpCircle, Gift, AlertCircle, ClipboardList, Smartphone, Calendar, Wallet, Award, Star, MapPin, CreditCard, Info } from 'lucide-react';

interface UserProfilePageProps {
  phoneNumber: string;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function UserProfilePage({ phoneNumber, onLogout, onNavigate }: UserProfilePageProps) {
  const menuItems = [
    { icon: Calendar, label: 'My Plans', action: 'amc-dashboard' },
    { icon: Wallet, label: 'Wallet', action: 'wallet' },
    { icon: Award, label: 'Passes & membership', action: 'loyalty-dashboard' },
    { icon: Star, label: 'My rating', action: 'profile' },
    { icon: MapPin, label: 'Manage addresses', action: 'addresses' },
    { icon: CreditCard, label: 'Manage payment methods', action: 'profile' },
    { icon: Settings, label: 'Settings', action: 'settings' },
    { icon: Info, label: 'About UC', action: 'profile' },
  ];

  return (
    <div className="min-h-[100dvh] bg-white pb-20">
      {/* Header Profile Section */}
      <div className="px-6 pt-10 pb-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-2 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full w-fit">
              <AlertCircle className="w-3.5 h-3.5 fill-red-600 text-white" />
              <span className="text-xs font-bold">Incomplete profile</span>
            </div>
            <h1 className="text-[28px] font-black text-gray-900 leading-tight mb-1">Verified Customer</h1>
            <p className="text-[15px] text-gray-600 font-medium">+91 {phoneNumber || '8949160726'}</p>
          </div>
          <button 
            onClick={() => onNavigate('edit-profile')}
            className="border border-gray-300 text-gray-800 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            Complete
          </button>
        </div>

        {/* 3 Action Cards */}
        <div className="flex items-stretch gap-3 mt-8">
          <button onClick={() => onNavigate('bookings')} className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-start gap-4 shadow-sm hover:border-gray-300 transition-colors">
            <ClipboardList className="w-6 h-6 text-gray-800" />
            <span className="text-[13px] font-bold text-gray-900 leading-tight">My bookings</span>
          </button>
          
          <button className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-start gap-4 shadow-sm hover:border-gray-300 transition-colors">
            <Smartphone className="w-6 h-6 text-gray-800" />
            <span className="text-[13px] font-bold text-gray-900 leading-tight">Native<br/>devices</span>
          </button>

          <button onClick={() => onNavigate('help')} className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-start gap-4 shadow-sm hover:border-gray-300 transition-colors">
            <HelpCircle className="w-6 h-6 text-gray-800" />
            <span className="text-[13px] font-bold text-gray-900 leading-tight">Help &<br/>support</span>
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-2 py-4">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onNavigate(item.action)}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-gray-50 transition-colors rounded-xl"
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-5 h-5 text-gray-800" />
              <span className="text-[15px] font-medium text-gray-900">
                {item.label}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>

      {/* Refer & Earn Banner */}
      <div className="px-6 py-4 mb-4">
        <div className="bg-gradient-to-br from-[#f8f5ff] to-[#f3ecff] rounded-2xl p-6 relative overflow-hidden border border-blue-100 shadow-sm">
          <div className="relative z-10 w-2/3">
            <h3 className="text-lg font-black text-gray-900 mb-2">Refer & earn ₹100</h3>
            <p className="text-sm text-gray-700 font-medium leading-relaxed mb-4">
              Get ₹100 when your friend completes their first booking
            </p>
            <button 
              onClick={() => onNavigate('refer-and-earn')}
              className="bg-blue-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition-colors shadow-md"
            >
              Refer now
            </button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-90">
             <img src="https://cdn-icons-png.flaticon.com/512/2611/2611105.png" alt="Gift" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-6 pb-8">
        <button
          onClick={onLogout}
          className="w-full border border-blue-200 text-blue-600 bg-blue-50/50 rounded-2xl p-4 font-bold text-[15px] hover:bg-blue-50 transition-colors"
        >
          Logout
        </button>
      </div>

    </div>
  );
}
