import { useState } from 'react';
import { ArrowLeft, MapPin, Plus, Trash2, Home, Briefcase, MoreHorizontal, Check } from 'lucide-react';

interface Address {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  line1: string;
  line2: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

interface ManageAddressesPageProps {
  onBack: () => void;
}

const initialAddresses: Address[] = [
  {
    id: '1',
    label: 'Home',
    line1: 'C-42, Vaishali Nagar',
    line2: 'Near Big Bazar',
    city: 'Jaipur',
    pincode: '302021',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    line1: 'B-14, Malviya Nagar',
    line2: '2nd Floor, IT Tower',
    city: 'Jaipur',
    pincode: '302017',
    isDefault: false,
  },
];

const labelIcons = {
  Home: Home,
  Office: Briefcase,
  Other: MapPin,
};

const labelColors = {
  Home: 'bg-blue-100 text-[#2563EB]',
  Office: 'bg-purple-100 text-purple-700',
  Other: 'bg-gray-100 text-gray-700',
};

export function ManageAddressesPage({ onBack }: ManageAddressesPageProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'Home' as Address['label'], line1: '', line2: '', city: 'Jaipur', pincode: '' });

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const addAddress = () => {
    if (!form.line1.trim()) return;
    const newAddr: Address = {
      id: Date.now().toString(),
      label: form.label,
      line1: form.line1,
      line2: form.line2,
      city: form.city,
      pincode: form.pincode,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setForm({ label: 'Home', line1: '', line2: '', city: 'Jaipur', pincode: '' });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] px-6 pt-12 pb-6 lg:pt-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white text-xl font-bold">Manage Addresses</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-3">
        {/* Address Cards */}
        {addresses.map((addr) => {
          const Icon = labelIcons[addr.label];
          return (
            <div key={addr.id} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${labelColors[addr.label]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-gray-900 text-sm">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{addr.line1}</p>
                    {addr.line2 && <p className="text-xs text-gray-500">{addr.line2}</p>}
                    <p className="text-xs text-gray-500">{addr.city} — {addr.pincode}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => setDefault(addr.id)}
                      className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                      title="Set as default"
                    >
                      <Check className="w-4 h-4 text-[#2563EB]" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {addresses.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No saved addresses yet</p>
          </div>
        )}

        {/* Add Address Form */}
        {showForm ? (
          <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3 border-2 border-blue-200">
            <h3 className="font-bold text-gray-900 text-sm">New Address</h3>

            {/* Label Selector */}
            <div className="flex gap-2">
              {(['Home', 'Office', 'Other'] as Address['label'][]).map((l) => (
                <button
                  key={l}
                  onClick={() => setForm({ ...form, label: l })}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    form.label === l ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Address Line 1*"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
            <input
              type="text"
              placeholder="Landmark / Area (optional)"
              value={form.line2}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
              <input
                type="text"
                placeholder="Pincode"
                maxLength={6}
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })}
                className="w-28 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addAddress}
                className="flex-1 py-3 bg-[#2563EB] text-white text-sm font-semibold rounded-xl hover:bg-[#2563EB] transition-colors"
              >
                Save Address
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-dashed border-blue-200 rounded-2xl text-[#2563EB] font-semibold text-sm hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        )}

        <p className="text-center text-xs text-gray-400 py-2">
          Addresses are used to auto-fill service booking forms
        </p>
      </div>
    </div>
  );
}
