import { useEffect, useState } from 'react';
import {
  Users, UserCog, ShoppingBag, IndianRupee, Zap,
  CheckCircle, XCircle, Clock, TrendingUp, AlertTriangle,
  RefreshCw, Activity, Wifi
} from 'lucide-react';
import { AdminApi } from '../../api/client';

const STATUS_COLOR: Record<string, string> = {
  posted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  assigned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  en_route: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  penalized: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [live, setLive] = useState<any>(null);
  const [pendingKyc, setPendingKyc] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kycLoading, setKycLoading] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [analyticsRes, liveRes, kycRes, jobsRes] = await Promise.all([
        AdminApi.getAnalytics(),
        AdminApi.getLiveDashboard(),
        AdminApi.getPendingKyc(),
        AdminApi.getJobs(),
      ]);
      if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
      if (liveRes.data.success) setLive(liveRes.data.data);
      if (kycRes.data.success) setPendingKyc(kycRes.data.data);
      if (jobsRes.data.success) setRecentJobs((jobsRes.data.data || []).slice(0, 8));
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); const t = setInterval(fetchAll, 30000); return () => clearInterval(t); }, []);

  const handleKyc = async (id: string, action: 'approve' | 'reject') => {
    setKycLoading(id);
    try {
      await AdminApi.approveKyc(id, action);
      setPendingKyc(prev => prev.filter(p => p.id !== id));
    } catch {}
    setKycLoading(null);
  };

  const handleTestLead = async () => {
    try {
      await AdminApi.generateTestLead({ title: 'Test Admin Lead', location: 'Jaipur, Rajasthan', estimated_amount: 1500 });
      alert('✅ Test Lead dispatched to online Partners!');
    } catch { alert('❌ Failed. Is backend running?'); }
  };

  const STAT_CARDS = [
    { label: 'Total Customers', value: analytics?.totalCustomers ?? '—', icon: Users, color: 'from-blue-500 to-blue-700', sub: 'Registered users' },
    { label: 'Active Partners', value: analytics?.activePartners ?? '—', icon: UserCog, color: 'from-emerald-500 to-emerald-700', sub: 'Verified & active' },
    { label: 'Total Bookings', value: analytics?.totalOrders ?? '—', icon: ShoppingBag, color: 'from-purple-500 to-purple-700', sub: 'All time jobs' },
    { label: 'Platform Revenue', value: analytics?.totalRevenue != null ? `₹${Number(analytics.totalRevenue).toLocaleString('en-IN')}` : '—', icon: IndianRupee, color: 'from-amber-500 to-orange-600', sub: 'From commissions' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">VisvasaHome Operations Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleTestLead}
            className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Zap className="w-4 h-4" /> Send Test Lead
          </button>
          <button onClick={fetchAll}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Live Counters Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
            <Wifi className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{live?.onlinePartners ?? 0}</p>
            <p className="text-xs text-slate-400">Online Partners</p>
          </div>
          <span className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{live?.activeJobs ?? 0}</p>
            <p className="text-xs text-slate-400">Active Jobs</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">₹{(live?.todayRevenue ?? 0).toLocaleString('en-IN')}</p>
            <p className="text-xs text-slate-400">Today's Revenue</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{live?.pendingKyc ?? pendingKyc.length}</p>
            <p className="text-xs text-slate-400">Pending KYC</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-5 rounded-full -translate-y-6 translate-x-6`} />
            <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center mb-3 shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{loading ? '...' : value}</p>
            <p className="text-sm text-slate-300 font-medium">{label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Recent Jobs */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">Recent Bookings</h3>
            <a href="/dashboard/bookings" className="text-xs text-blue-400 hover:text-blue-300">View all →</a>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-slate-500 text-sm">Loading...</div>
            ) : recentJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <ShoppingBag className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">No bookings yet</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 border-b border-slate-800">
                    <th className="px-5 py-2.5 text-left font-medium">Job</th>
                    <th className="px-4 py-2.5 text-left font-medium">Amount</th>
                    <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job, i) => (
                    <tr key={job.id || i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3">
                        <p className="text-white font-medium truncate max-w-[160px]">{job.title || 'Untitled'}</p>
                        <p className="text-slate-500 text-xs">{job.job_code || job.id?.slice(0, 8)}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300">₹{Number(job.estimated_amount || 0).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[job.status] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                          {job.status?.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* KYC Approvals */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">KYC Pending</h3>
            {pendingKyc.length > 0 && (
              <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs px-2 py-0.5 rounded-full">{pendingKyc.length} pending</span>
            )}
          </div>
          <div className="p-4 space-y-3 max-h-72 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-slate-500 text-sm">Loading...</div>
            ) : pendingKyc.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                <CheckCircle className="w-10 h-10 mb-2 text-green-500/30" />
                <p className="text-sm">All KYC verified! ✅</p>
              </div>
            ) : (
              pendingKyc.map(p => (
                <div key={p.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white text-sm font-medium">{p.name}</p>
                      <p className="text-slate-400 text-xs">{p.phone} · {p.city}</p>
                    </div>
                    <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full flex-shrink-0">Pending</span>
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <button
                      disabled={kycLoading === p.id}
                      onClick={() => handleKyc(p.id, 'approve')}
                      className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/20 text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <CheckCircle className="w-3 h-3" /> Approve
                    </button>
                    <button
                      disabled={kycLoading === p.id}
                      onClick={() => handleKyc(p.id, 'reject')}
                      className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3 h-3" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
