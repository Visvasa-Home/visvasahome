import { useEffect, useState, useMemo } from 'react';
import { Search, RefreshCw, CheckCircle, XCircle, Shield, ShieldOff, UserCog, Phone } from 'lucide-react';
import { AdminApi } from '../api/client';

const KYC_COLOR: Record<string, string> = {
  verified: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  unverified: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_COLOR: Record<string, string> = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  suspended: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function Professionals() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'kyc'>('all');

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.getPartners();
      if (res.data.success) setPartners(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  const fetchKyc = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.getPendingKyc();
      if (res.data.success) setPartners(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'all') fetchPartners();
    else fetchKyc();
  }, [activeTab]);

  const filtered = useMemo(() => partners.filter(p => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search);
    const matchKyc = kycFilter === 'all' || p.kyc_status === kycFilter;
    return matchSearch && matchKyc;
  }), [partners, search, kycFilter]);

  const handleKyc = async (id: string, action: 'approve' | 'reject') => {
    setUpdatingId(id);
    try {
      await AdminApi.approveKyc(id, action);
      setPartners(prev => prev.map(p => p.id === id ? { ...p, kyc_status: action === 'approve' ? 'verified' : 'unverified' } : p));
    } catch {}
    setUpdatingId(null);
  };

  const handleStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await AdminApi.updatePartnerStatus(id, status);
      setPartners(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    } catch {}
    setUpdatingId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Professionals</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage partners & KYC approvals</p>
        </div>
        <button onClick={() => activeTab === 'all' ? fetchPartners() : fetchKyc()} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit">
        {(['all', 'kyc'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {tab === 'all' ? 'All Partners' : 'KYC Pending'}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500" />
        </div>
        {activeTab === 'all' && (
          <select value={kycFilter} onChange={e => setKycFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
            <option value="all">All KYC</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="unverified">Unverified</option>
          </select>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">Loading partners...</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <UserCog className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No partners found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 border-b border-slate-800 bg-slate-900/80">
                  <th className="px-5 py-3 text-left font-medium">Partner</th>
                  <th className="px-4 py-3 text-left font-medium">Phone</th>
                  <th className="px-4 py-3 text-left font-medium">KYC Status</th>
                  <th className="px-4 py-3 text-left font-medium">Account Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          {p.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{p.name || '—'}</p>
                          <p className="text-slate-500 text-xs">ID: {p.id?.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Phone className="w-3 h-3 text-slate-500" />
                        {p.phone || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex text-xs px-2 py-0.5 rounded-full border font-medium ${KYC_COLOR[p.kyc_status] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                        {p.kyc_status || 'unverified'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[p.status] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                        {p.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {p.kyc_status === 'pending' && (
                          <>
                            <button disabled={updatingId === p.id} onClick={() => handleKyc(p.id, 'approve')}
                              className="text-xs bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors">
                              <CheckCircle className="w-3 h-3" /> Approve
                            </button>
                            <button disabled={updatingId === p.id} onClick={() => handleKyc(p.id, 'reject')}
                              className="text-xs bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors">
                              <XCircle className="w-3 h-3" /> Reject
                            </button>
                          </>
                        )}
                        {p.status !== 'suspended' ? (
                          <button disabled={updatingId === p.id} onClick={() => handleStatus(p.id, 'suspended')}
                            className="text-xs bg-slate-700 hover:bg-red-900/30 text-slate-400 hover:text-red-400 border border-slate-600 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors">
                            <ShieldOff className="w-3 h-3" /> Suspend
                          </button>
                        ) : (
                          <button disabled={updatingId === p.id} onClick={() => handleStatus(p.id, 'active')}
                            className="text-xs bg-slate-700 hover:bg-green-900/30 text-slate-400 hover:text-green-400 border border-slate-600 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors">
                            <Shield className="w-3 h-3" /> Activate
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
    </div>
  );
}
