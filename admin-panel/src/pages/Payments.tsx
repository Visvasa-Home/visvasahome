import { useEffect, useState, useMemo } from 'react';
import { Search, RefreshCw, IndianRupee, TrendingUp, CreditCard, Percent } from 'lucide-react';
import { AdminApi } from '../api/client';

const STATUS_COLOR: Record<string, string> = {
  posted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  assigned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  en_route: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const COMMISSION_RATE = 0.15; // 15%

export default function Payments() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.getPayments();
      if (res.data.success) setJobs(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const filtered = useMemo(() => jobs.filter(j => {
    const matchSearch = !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.job_code?.includes(search) || j.customer_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  }), [jobs, search, statusFilter]);

  const completedJobs = useMemo(() => jobs.filter(j => j.status === 'completed'), [jobs]);
  const totalRevenue = useMemo(() => completedJobs.reduce((a, j) => a + Number(j.estimated_amount || 0), 0), [completedJobs]);
  const platformEarnings = useMemo(() => totalRevenue * COMMISSION_RATE, [totalRevenue]);
  const partnerPayouts = useMemo(() => totalRevenue - platformEarnings, [totalRevenue, platformEarnings]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Payments</h1>
          <p className="text-slate-400 text-sm mt-0.5">Revenue, commissions & partner payouts</p>
        </div>
        <button onClick={fetchPayments} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total GMV', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'from-blue-500 to-blue-700', sub: 'All completed jobs' },
          { label: 'Platform Revenue', value: `₹${platformEarnings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: TrendingUp, color: 'from-green-500 to-emerald-700', sub: `${COMMISSION_RATE * 100}% commission` },
          { label: 'Partner Payouts', value: `₹${partnerPayouts.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: CreditCard, color: 'from-purple-500 to-purple-700', sub: 'Net to partners' },
          { label: 'Completed Jobs', value: completedJobs.length, icon: Percent, color: 'from-amber-500 to-orange-600', sub: 'Revenue generating' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${s.color} opacity-5 rounded-full -translate-y-4 translate-x-4`} />
            <div className={`w-9 h-9 bg-gradient-to-br ${s.color} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-white">{loading ? '...' : s.value}</p>
            <p className="text-sm text-slate-300">{s.label}</p>
            <p className="text-xs text-slate-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Commission Info */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl px-5 py-4 flex items-center gap-4">
        <Percent className="w-5 h-5 text-blue-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-300">Current Commission Rate: <span className="font-bold">15%</span> (Silver) · 15% (Gold) · 10% (Diamond)</p>
          <p className="text-xs text-slate-500 mt-0.5">Commission is auto-deducted when partner completes a job and earnings are settled to wallet.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search job, customer, job code..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
          <option value="all">All Status</option>
          {['posted','assigned','en_route','in_progress','completed','cancelled'].map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">Loading payments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-800">
                  <th className="px-5 py-3 text-left font-medium">Job</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Partner</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Commission</th>
                  <th className="px-4 py-3 text-left font-medium">Payout</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Payment</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((j) => {
                  const amt = Number(j.estimated_amount || 0);
                  const comm = amt * COMMISSION_RATE;
                  const payout = amt - comm;
                  return (
                    <tr key={j.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-white font-medium truncate max-w-[140px]">{j.title || 'Untitled'}</p>
                        <p className="text-slate-500 text-xs">{j.job_code || j.id?.slice(0, 8)}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{j.customer_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-300">{j.partner_name || '—'}</td>
                      <td className="px-4 py-3 text-white font-medium">₹{amt.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-amber-400">₹{comm.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className="px-4 py-3 text-green-400">₹{payout.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[j.status] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                          {j.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex text-xs px-2 py-0.5 rounded-full border font-medium ${j.is_cash_job ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                          {j.is_cash_job ? 'Cash' : 'Online'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
