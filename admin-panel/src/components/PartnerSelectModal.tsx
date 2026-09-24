import React, { useEffect, useState } from 'react';
import { X, Search, CheckCircle } from 'lucide-react';
import { AdminApi } from '../api/client';

export function PartnerSelectModal({ bookingId, onClose, onAssigned }: { bookingId: string, onClose: () => void, onAssigned: (partnerId: string) => void }) {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const res = await AdminApi.getAvailablePartners();
        if (res.data.success) {
          setPartners(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPartners();
  }, []);

  const handleAssign = async (partnerId: string) => {
    setAssigningId(partnerId);
    try {
      await AdminApi.assignPartner(bookingId, partnerId);
      onAssigned(partnerId);
    } catch (err) {
      console.error(err);
      alert('Failed to assign partner');
    }
    setAssigningId(null);
  };

  const filtered = partners.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Select Partner to Assign</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              autoFocus
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search partner by name or phone..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading partners...</div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No partners found</div>
          ) : (
            <div className="space-y-2 p-3">
              {filtered.map(partner => (
                <div key={partner.id} className="flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl transition-colors">
                  <div>
                    <p className="text-white font-medium">{partner.name || 'Unnamed Partner'}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{partner.phone} • {partner.service_areas?.join(', ') || 'Any Area'}</p>
                  </div>
                  <button
                    disabled={assigningId === partner.id}
                    onClick={() => handleAssign(partner.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {assigningId === partner.id ? (
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <>Assign <CheckCircle className="w-3.5 h-3.5" /></>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
