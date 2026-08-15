import { useState } from 'react';
import { ArrowLeft, User, Mail, MapPin, Camera, Check } from 'lucide-react';

interface EditProfilePageProps {
  onBack: () => void;
  phoneNumber: string;
}

export function EditProfilePage({ onBack, phoneNumber }: EditProfilePageProps) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    city: 'Jaipur',
    pincode: '',
  });

  const cities = ['Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Surat'];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-12 pb-8 lg:pt-8">
        <div className="w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-bold">Edit Profile</h1>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/40">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-50 transition-colors">
                <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
              </button>
            </div>
            <p className="text-blue-100 text-xs mt-2">Tap to change photo</p>
          </div>
        </div>
      </div>

      <div className="w-full md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          {/* Phone (read-only) */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Phone Number
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-gray-400">+91</span>
              <span className="flex-1 text-gray-700 font-medium">{phoneNumber || '98765 43210'}</span>
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">Verified</span>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors appearance-none"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
              Pincode
            </label>
            <input
              type="text"
              placeholder="e.g. 302001"
              maxLength={6}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            saved
              ? 'bg-blue-500 text-white'
              : 'bg-[#2563EB] hover:bg-[#2563EB] text-white'
          }`}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Profile Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </button>

        <p className="text-center text-xs text-gray-400">
          Your information is kept private and secure
        </p>
      </div>
    </div>
  );
}
