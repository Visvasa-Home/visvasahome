import { useState } from 'react';
import { ArrowLeft, Bell, MessageSquare, Tag, Megaphone, Calendar, Shield } from 'lucide-react';

interface NotificationsPageProps {
  onBack: () => void;
}

interface NotifSetting {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  title: string;
  desc: string;
  enabled: boolean;
}

export function NotificationsPage({ onBack }: NotificationsPageProps) {
  const [settings, setSettings] = useState<NotifSetting[]>([
    {
      id: 'booking_updates',
      icon: Calendar,
      iconBg: 'bg-blue-100 text-[#2563EB]',
      title: 'Booking Updates',
      desc: 'Confirmation, assignment, and service reminders',
      enabled: true,
    },
    {
      id: 'whatsapp',
      icon: MessageSquare,
      iconBg: 'bg-blue-100 text-blue-600',
      title: 'WhatsApp Messages',
      desc: 'Receive updates and OTPs via WhatsApp',
      enabled: true,
    },
    {
      id: 'offers',
      icon: Tag,
      iconBg: 'bg-blue-100 text-blue-600',
      title: 'Offers & Discounts',
      desc: 'Exclusive deals, seasonal offers, and coupons',
      enabled: true,
    },
    {
      id: 'sms',
      icon: Bell,
      iconBg: 'bg-blue-100 text-blue-600',
      title: 'SMS Alerts',
      desc: 'Text message notifications for bookings',
      enabled: false,
    },
    {
      id: 'promotions',
      icon: Megaphone,
      iconBg: 'bg-blue-100 text-blue-600',
      title: 'Promotional Emails',
      desc: 'Service tips, blog updates, and newsletters',
      enabled: false,
    },
    {
      id: 'security',
      icon: Shield,
      iconBg: 'bg-slate-100 text-slate-600',
      title: 'Security Alerts',
      desc: 'Login activity and account security notifications',
      enabled: true,
    },
  ]);

  const toggle = (id: string) => {
    setSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  };

  const enableAll = () => setSettings((prev) => prev.map((s) => ({ ...s, enabled: true })));
  const disableAll = () => setSettings((prev) => prev.map((s) => (s.id === 'security' ? s : { ...s, enabled: false })));

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-12 pb-6 lg:pt-8">
        <div className="w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-xl font-bold">Notifications</h1>
              <p className="text-blue-100 text-xs">Manage how we reach you</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 py-5 space-y-4">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={enableAll}
            className="flex-1 py-2.5 bg-[#2563EB] text-white text-xs font-bold rounded-xl hover:bg-[#2563EB] transition-colors"
          >
            Enable All
          </button>
          <button
            onClick={disableAll}
            className="flex-1 py-2.5 bg-white text-gray-600 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Disable All
          </button>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {settings.map((setting, idx) => {
            const Icon = setting.icon;
            return (
              <div
                key={setting.id}
                className={`flex items-center gap-4 px-4 py-4 ${idx < settings.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${setting.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{setting.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{setting.desc}</p>
                  {setting.id === 'security' && (
                    <p className="text-xs text-[#2563EB] mt-0.5 font-medium">Always on for your safety</p>
                  )}
                </div>
                <button
                  onClick={() => setting.id !== 'security' && toggle(setting.id)}
                  disabled={setting.id === 'security'}
                  className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${
                    setting.enabled ? 'bg-[#2563EB]' : 'bg-gray-200'
                  } ${setting.id === 'security' ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      setting.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 py-2">
          Security alerts cannot be disabled. We may still send critical service notifications.
        </p>
      </div>
    </div>
  );
}
