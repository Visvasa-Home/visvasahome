import { useEffect, useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, CheckCircle, XCircle, Clock, ChevronDown, Plus, UserPlus } from 'lucide-react';
import { AdminApi } from '../api/client';
import { PartnerSelectModal } from '../components/PartnerSelectModal';
import { CreateBookingModal } from '../components/CreateBookingModal';

const STATUS_OPTIONS = ['all', 'posted', 'assigned', 'en_route', 'in_progress', 'completed', 'cancelled'];
const STATUS_COLOR: Record<string, string> = {
  posted: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  assigned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  en_route: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  in_progress: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Bookings() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assigningBookingId, setAssigningBookingId] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.getJobs();
      if (res.data.success) setJobs(res.data.data || []);
    } catch { /* fallback */ }
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const filtered = useMemo(() => jobs.filter(j => {
    const matchSearch = !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.job_code?.includes(search) || j.customer_name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchSearch && matchStatus;
  }), [jobs, search, statusFilter]);

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await AdminApi.updateJobStatus(id, status);
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
      setSelectedJob((prev: any) => prev?.id === id ? { ...prev, status } : prev);
    } catch {}
    setUpdatingId(null);
  };

  const stats = useMemo(() => ({
    total: jobs.length,
    active: jobs.filter(j => ['assigned', 'en_route', 'in_progress'].includes(j.status)).length,
    completed: jobs.filter(j => j.status === 'completed').length,
    cancelled: jobs.filter(j => j.status === 'cancelled').length,
  }), [jobs]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage all service bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchJobs} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-white' },
          { label: 'Active', value: stats.active, color: 'text-blue-400' },
          { label: 'Completed', value: stats.completed, color: 'text-green-400' },
          { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search bookings, customer, job code..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s.replace('_', ' ')}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Clock className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No bookings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-800 bg-slate-900/80">
                  <th className="px-5 py-3 text-left font-medium">Job</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Partner</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => (
                  <tr key={job.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-white font-medium truncate max-w-[160px]">{job.title || 'Untitled'}</p>
                      <p className="text-slate-500 text-xs">{job.job_code || job.id?.slice(0, 8)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300">{job.customer_name || '—'}</p>
                      <p className="text-slate-500 text-xs">{job.customer_phone || ''}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{job.partner_name || '—'}</td>
                    <td className="px-4 py-3 text-slate-200 font-medium">₹{Number(job.estimated_amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[job.status] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                        {job.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          disabled={updatingId === job.id}
                          value={job.status}
                          onChange={e => handleStatusChange(job.id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                        {(job.status === 'SEARCHING' || job.status === 'posted' || job.status === 'cancelled') && (
                          <button
                            onClick={() => setAssigningBookingId(job.id)}
                            title="Manually Assign Partner"
                            className="p-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg transition-colors"
                          >
                            <UserPlus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateBookingModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            fetchJobs();
          }}
        />
      )}
      
      {assigningBookingId && (
        <PartnerSelectModal
          bookingId={assigningBookingId}
          onClose={() => setAssigningBookingId(null)}
          onAssigned={() => {
            setAssigningBookingId(null);
            fetchJobs();
          }}
        />
      )}
    </div>
  );
}
