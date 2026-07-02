import { User, Phone, MapPin, LogOut, ChevronRight, Bell, Heart, Settings, HelpCircle, Shield, Wallet, MapPinned, Hammer, Briefcase } from 'lucide-react';

interface UserProfilePageProps {
  phoneNumber: string;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export function UserProfilePage({ phoneNumber, onLogout, onNavigate }: UserProfilePageProps) {
  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', action: 'edit-profile' },
        { icon: MapPin, label: 'Manage Addresses', action: 'addresses' },
        { icon: Bell, label: 'Notifications', action: 'notifications' },
      ],
    },
    {
      title: 'Wallet & Projects',
      items: [
        { icon: Wallet, label: 'My Wallet & Rewards', action: 'wallet' },
        { icon: Hammer, label: 'Contractor Hub', action: 'contractor-hub' },
      ],
    },
    {
      title: 'Partner & Administration',
      items: [
        { icon: Briefcase, label: 'Switch to Partner View', action: 'professional-dashboard' },
        { icon: Shield, label: 'Admin Dashboard Portal', action: 'admin-login' },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Heart, label: 'Saved Services', action: 'saved' },
        { icon: Settings, label: 'Settings', action: 'settings' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', action: 'help' },
        { icon: Shield, label: 'Privacy Policy', action: 'privacy-policy' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-12 pb-8 lg:pt-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-white text-2xl font-bold mb-6">My Profile</h1>

          {/* User Info Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-[#2563EB]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">VisvasaHome User</h2>
                  <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                    {localStorage.getItem('visvasahome_vh_id') || 'VH-NEW'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+91 {phoneNumber}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('edit-profile')}
              className="w-full py-2.5 bg-blue-50 text-[#2563EB] rounded-lg font-semibold hover:bg-blue-100 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {menuSections.map((section, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                {section.title}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigate(item.action)}
                  className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span className="flex-1 text-left font-medium text-gray-900">
                    {item.label}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full bg-white rounded-2xl shadow-sm px-4 py-4 flex items-center gap-4 hover:bg-red-50 transition-colors group"
        >
          <div className="w-10 h-10 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <span className="flex-1 text-left font-bold text-red-600">
            Logout
          </span>
        </button>

        {/* App Version */}
        <p className="text-center text-gray-500 text-sm py-4">
          VisvasaHome v1.0.0
        </p>
      </div>
    </div>
  );
}
