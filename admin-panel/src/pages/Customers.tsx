import { useEffect, useState, useMemo } from 'react';
import { Search, RefreshCw, Users, Phone, ShoppingBag, IndianRupee } from 'lucide-react';
import { AdminApi } from '../api/client';

export default function Customers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.getCustomers();
      if (res.data.success) setCustomers(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCustomers(); }, []);

  const filtered = useMemo(() => customers.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.phone?.includes(search)
  ), [customers, search]);

  const totalRevenue = useMemo(() => customers.reduce((acc, c) => acc + (Number(c.total_spent) || 0), 0), [customers]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 text-sm mt-0.5">All registered customers</p>
        </div>
        <button onClick={fetchCustomers} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-blue-400' },
          { label: 'Total Bookings', value: customers.reduce((a, c) => a + (Number(c.total_bookings) || 0), 0), icon: ShoppingBag, color: 'text-purple-400' },
          { label: 'Total Revenue (from completions)', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex items-center gap-4">
            <s.icon className={`w-6 h-6 ${s.color} flex-shrink-0`} />
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search customer name or phone..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">Loading customers...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Users className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-800">
                  <th className="px-5 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Phone</th>
                  <th className="px-4 py-3 text-left font-medium">Total Bookings</th>
                  <th className="px-4 py-3 text-left font-medium">Total Spent</th>
                  <th className="px-4 py-3 text-left font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {c.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{c.name || 'Unknown'}</p>
                          <p className="text-slate-500 text-xs">{c.id?.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Phone className="w-3 h-3 text-slate-500" />{c.phone || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{c.total_bookings || 0}</td>
                    <td className="px-4 py-3 text-slate-200 font-medium">₹{Number(c.total_spent || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
