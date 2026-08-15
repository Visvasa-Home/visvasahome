import { useState } from 'react';
import { ArrowLeft, Globe, Moon, MapPin, Eye, Smartphone, Trash2, ChevronRight } from 'lucide-react';

interface AppSettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

export function AppSettingsPage({ onBack, onLogout }: AppSettingsPageProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);
  const [dataUsage, setDataUsage] = useState(false);
  const [language, setLanguage] = useState('English');
  const [city, setCity] = useState('Jaipur');

  const languages = ['English', 'Hindi', 'Rajasthani', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada'];
  const cities = ['Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata'];

  const ToggleRow = ({
    icon: Icon,
    iconBg,
    title,
    desc,
    value,
    onChange,
  }: {
    icon: React.ElementType;
    iconBg: string;
    title: string;
    desc: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-100 last:border-0">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-[#2563EB]' : 'bg-gray-200'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-12 pb-6 lg:pt-8">
        <div className="w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-bold">App Settings</h1>
          </div>
        </div>
      </div>

      <div className="w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 py-5 space-y-5">
        {/* Preferences */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 px-1">Preferences</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <ToggleRow
              icon={Moon}
              iconBg="bg-blue-100 text-blue-600"
              title="Dark Mode"
              desc="Use dark theme across the app"
              value={darkMode}
              onChange={setDarkMode}
            />
            <ToggleRow
              icon={MapPin}
              iconBg="bg-blue-100 text-[#2563EB]"
              title="Location Access"
              desc="Auto-detect your location for faster booking"
              value={locationAccess}
              onChange={setLocationAccess}
            />
            <ToggleRow
              icon={Eye}
              iconBg="bg-blue-100 text-blue-600"
              title="Low Data Mode"
              desc="Reduce image quality to save mobile data"
              value={dataUsage}
              onChange={setDataUsage}
            />
          </div>
        </div>

        {/* Language */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 px-1">Language</p>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">App Language</p>
                <p className="text-xs text-gray-500">Currently: {language}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`py-2 text-sm font-medium rounded-xl border transition-colors ${
                    language === lang
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Default City */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 px-1">Default City</p>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#2563EB]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Service City</p>
                <p className="text-xs text-gray-500">Currently: {city}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`py-2 text-sm font-medium rounded-xl border transition-colors ${
                    city === c
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* App Info */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 px-1">About App</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {[
              { label: 'App Version', value: 'v1.0.0' },
              { label: 'Build Number', value: '2026.05.001' },
              { label: 'Platform', value: 'Web App' },
            ].map(({ label, value }, idx) => (
              <div key={label} className={`flex items-center justify-between px-4 py-3.5 ${idx < 2 ? 'border-b border-gray-100' : ''}`}>
                <span className="text-sm text-gray-700">{label}</span>
                <span className="text-sm font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 px-1">Account</p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <button className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-500" />
              </div>
              <span className="flex-1 text-left text-sm font-medium text-gray-900">Clear App Cache</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-4 py-4 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-blue-500" />
              </div>
              <span className="flex-1 text-left text-sm font-semibold text-blue-600">Delete Account</span>
              <ChevronRight className="w-4 h-4 text-blue-300" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 py-2">
          VisvasaHome v1.0.0 · © 2026 Visvasa Technologies Pvt. Ltd.
        </p>
      </div>
    </div>
  );
}
