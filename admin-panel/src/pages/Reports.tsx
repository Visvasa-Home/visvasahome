import { useEffect, useState, useMemo } from 'react';
import {
  TrendingUp, DollarSign, Users, Zap, RefreshCw, BarChart3,
  Activity, MapPin
} from 'lucide-react';
import { AdminApi } from '../api/client';

// Simple bar chart component (no external lib needed for basic charts)
function BarChart({ data, label }: { data: { label: string; value: number }[]; label: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <div className="space-y-2">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-16 flex-shrink-0 text-right">{d.label}</span>
            <div className="flex-1 bg-slate-800 rounded-full h-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                style={{ width: `${(d.value / max) * 100}%` }}
              >
                <span className="text-xs text-white font-bold">{d.value.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reports() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Surge pricing simulator state
  const [demand, setDemand] = useState(15);
  const [supply, setSupply] = useState(5);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, jobsRes] = await Promise.all([AdminApi.getAnalytics(), AdminApi.getJobs()]);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      if (jobsRes.data.success) setJobs(jobsRes.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Compute derived analytics from real jobs
  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach(j => { counts[j.status] = (counts[j.status] || 0) + 1; });
    return Object.entries(counts).map(([label, value]) => ({ label: label.replace('_', ' '), value }));
  }, [jobs]);

  // Surge multiplier calculation (same algorithm as backend)
  const surgeMultiplier = useMemo(() => {
    const ratio = demand / Math.max(supply, 1);
    if (ratio < 1.5) return 1.0;
    if (ratio < 3) return 1.0 + (ratio - 1.5) * 0.2;
    return Math.min(1.0 + (ratio - 1.5) * 0.2, 2.0);
  }, [demand, supply]);

  const completedJobs = jobs.filter(j => j.status === 'completed');
  const totalRevenue = completedJobs.reduce((a, j) => a + Number(j.estimated_amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-slate-400 text-sm mt-0.5">Platform performance & algorithm insights</p>
        </div>
        <button onClick={fetchData} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: analytics?.totalCustomers ?? '—', icon: Users, color: 'from-blue-500 to-blue-700' },
          { label: 'Active Partners', value: analytics?.activePartners ?? '—', icon: Activity, color: 'from-emerald-500 to-emerald-700' },
          { label: 'All-time Jobs', value: analytics?.totalOrders ?? '—', icon: BarChart3, color: 'from-purple-500 to-purple-700' },
          { label: 'Platform Revenue', value: analytics?.totalRevenue != null ? `₹${Number(analytics.totalRevenue).toLocaleString('en-IN')}` : '—', icon: DollarSign, color: 'from-amber-500 to-orange-600' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${s.color} opacity-5 rounded-full -translate-y-4 translate-x-4`} />
            <div className={`w-9 h-9 bg-gradient-to-br ${s.color} rounded-lg flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-white">{loading ? '...' : s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Job Status Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-white text-sm">Job Status Breakdown</h3>
          </div>
          {loading ? (
            <div className="py-8 text-slate-500 text-sm text-center">Loading...</div>
          ) : statusBreakdown.length === 0 ? (
            <div className="py-8 text-slate-500 text-sm text-center">No job data yet</div>
          ) : (
            <BarChart data={statusBreakdown} label="Number of jobs per status" />
          )}
        </div>

        {/* Revenue Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="font-semibold text-white text-sm">Revenue Summary</h3>
          </div>
          {loading ? (
            <div className="py-8 text-slate-500 text-sm text-center">Loading...</div>
          ) : (
            <div className="space-y-4">
              {[
                { label: 'Gross Merchandise Value (GMV)', value: totalRevenue, color: 'text-white' },
                { label: 'Platform Revenue (15% comm.)', value: totalRevenue * 0.15, color: 'text-green-400' },
                { label: 'Partner Payouts', value: totalRevenue * 0.85, color: 'text-blue-400' },
                { label: 'Completed Jobs', value: completedJobs.length, color: 'text-amber-400', isCount: true },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{r.label}</span>
                  <span className={`font-bold text-sm ${r.color}`}>
                    {r.isCount ? r.value : `₹${Number(r.value).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Surge Pricing Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="font-semibold text-white text-sm">Surge Pricing Simulator</h3>
          <span className="text-xs text-slate-500">— Same algorithm as production</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="text-sm text-slate-300 font-medium block">
              Active Bookings (Demand): <span className="text-blue-400 font-bold">{demand}</span>
            </label>
            <input type="range" min={1} max={50} value={demand} onChange={e => setDemand(Number(e.target.value))}
              className="w-full accent-blue-500" />
          </div>
          <div className="space-y-3">
            <label className="text-sm text-slate-300 font-medium block">
              Online Partners (Supply): <span className="text-green-400 font-bold">{supply}</span>
            </label>
            <input type="range" min={1} max={30} value={supply} onChange={e => setSupply(Number(e.target.value))}
              className="w-full accent-green-500" />
          </div>
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 flex flex-col items-center justify-center">
            <p className="text-xs text-slate-500 mb-1">Surge Multiplier</p>
            <p className={`text-4xl font-black ${surgeMultiplier >= 1.5 ? 'text-red-400' : surgeMultiplier >= 1.2 ? 'text-amber-400' : 'text-green-400'}`}>
              {surgeMultiplier.toFixed(2)}x
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {surgeMultiplier === 1.0 ? 'Normal pricing' : surgeMultiplier < 1.5 ? 'Mild surge' : surgeMultiplier < 2.0 ? 'High surge' : 'Peak surge (cap)'}
            </p>
            <p className="text-xs text-slate-600 mt-2">Demand/Supply ratio: {(demand / supply).toFixed(1)}x</p>
          </div>
        </div>
      </div>
    </div>
  );
}
