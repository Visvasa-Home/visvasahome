import { useState } from 'react';
import { Settings as SettingsIcon, MapPin, Percent, Plus, Trash2, Shield, Globe, CheckCircle } from 'lucide-react';

const DEFAULT_CITIES = [
  { name: 'Jaipur', active: true },
  { name: 'Mumbai', active: true },
  { name: 'Delhi NCR', active: true },
  { name: 'Bengaluru', active: true },
  { name: 'Pune', active: false },
  { name: 'Ahmedabad', active: false },
  { name: 'Chennai', active: false },
  { name: 'Hyderabad', active: false },
];

export default function Settings() {
  const [commission, setCommission] = useState(15);
  const [safetyFee, setSafetyFee] = useState(29);
  const [cities, setCities] = useState(DEFAULT_CITIES);
  const [newCity, setNewCity] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleCity = (name: string) =>
    setCities(prev => prev.map(c => c.name === name ? { ...c, active: !c.active } : c));

  const addCity = () => {
    if (!newCity.trim()) return;
    setCities(prev => [...prev, { name: newCity.trim(), active: true }]);
    setNewCity('');
  };

  const removeCity = (name: string) =>
    setCities(prev => prev.filter(c => c.name !== name));

  const ADMIN_ACCOUNTS = [
    { name: 'Super Admin', email: 'admin@visvasahome.com', role: 'Full access — all sections', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { name: 'Operations Manager', email: 'ops@visvasahome.com', role: 'Bookings, Professionals, Reports', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    { name: 'Support Agent', email: 'support@visvasahome.com', role: 'Read-only + Support tickets', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-0.5">Platform configuration & admin roles</p>
      </div>

      {/* Commission Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Percent className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-white text-sm">Commission & Fees</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-slate-300 font-medium block mb-1.5">
              Platform Commission Rate: <span className="text-blue-400 font-bold">{commission}%</span>
            </label>
            <input type="range" min={5} max={30} value={commission}
              onChange={e => setCommission(Number(e.target.value))}
              className="w-full accent-blue-500 mb-2" />
            <p className="text-xs text-slate-500">Applied to Silver & Gold tier partners. Diamond = 10%.</p>
          </div>
          <div>
            <label className="text-sm text-slate-300 font-medium block mb-1.5">
              Safety Fee per Booking: <span className="text-amber-400 font-bold">₹{safetyFee}</span>
            </label>
            <input type="range" min={0} max={99} value={safetyFee}
              onChange={e => setSafetyFee(Number(e.target.value))}
              className="w-full accent-amber-500 mb-2" />
            <p className="text-xs text-slate-500">Charged from customer. Covers background checks & insurance.</p>
          </div>
        </div>
      </div>

      {/* Active Cities */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="w-4 h-4 text-green-400" />
          <h3 className="font-semibold text-white text-sm">Active Service Cities</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {cities.map(city => (
            <div key={city.name} className={`flex items-center justify-between px-4 py-2.5 rounded-lg border transition-colors ${city.active ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-800 border-slate-700'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${city.active ? 'bg-green-400' : 'bg-slate-500'}`} />
                <span className={`text-sm ${city.active ? 'text-white' : 'text-slate-400'}`}>{city.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleCity(city.name)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-colors ${city.active ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}>
                  {city.active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => removeCity(city.name)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newCity} onChange={e => setNewCity(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCity()}
            placeholder="Add new city..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <button onClick={addCity} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Admin Roles */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-purple-400" />
          <h3 className="font-semibold text-white text-sm">Admin Accounts & Roles</h3>
        </div>
        <div className="space-y-3">
          {ADMIN_ACCOUNTS.map(a => (
            <div key={a.email} className={`flex items-start justify-between px-4 py-3 rounded-xl border ${a.color}`}>
              <div>
                <p className="font-semibold text-sm">{a.name}</p>
                <p className="text-xs opacity-70">{a.email}</p>
                <p className="text-xs opacity-60 mt-0.5">{a.role}</p>
              </div>
              <Globe className="w-4 h-4 opacity-50 flex-shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-4">To add/modify admin accounts, update the credentials in <code className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">backend/index.js</code> ADMINS array.</p>
      </div>

      {/* Save Button */}
      <button onClick={handleSave}
        className={`w-full py-3 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
        {saved ? <><CheckCircle className="w-4 h-4" /> Settings Saved!</> : <><SettingsIcon className="w-4 h-4" /> Save Settings</>}
      </button>
    </div>
  );
}
