import { useEffect, useState } from 'react';
import { Star, RefreshCw, MessageSquare } from 'lucide-react';
import { AdminApi } from '../api/client';

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await AdminApi.getReviews();
      if (res.data.success) setReviews(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Reviews</h1>
          <p className="text-slate-400 text-sm mt-0.5">All customer reviews & ratings</p>
        </div>
        <button onClick={fetchReviews} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex items-center gap-4">
          <Star className="w-6 h-6 text-amber-400" />
          <div>
            <p className="text-2xl font-bold text-white">{avgRating}</p>
            <p className="text-xs text-slate-500">Average Rating</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex items-center gap-4">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          <div>
            <p className="text-2xl font-bold text-white">{reviews.length}</p>
            <p className="text-xs text-slate-500">Total Reviews</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex items-center gap-4">
          <Star className="w-6 h-6 text-green-400" />
          <div>
            <p className="text-2xl font-bold text-white">{reviews.filter(r => Number(r.rating) >= 4).length}</p>
            <p className="text-xs text-slate-500">4★+ Reviews</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center py-16 text-slate-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center py-16 text-slate-500">
            <Star className="w-10 h-10 mb-2 opacity-30" />
            <p className="text-sm">No reviews yet</p>
          </div>
        ) : (
          reviews.map((r, i) => (
            <div key={r.id || i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Number(r.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{Number(r.rating).toFixed(1)}/5</span>
                  </div>
                  <p className="text-slate-300 text-sm">{r.comment || r.review || 'No comment provided.'}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span>Partner: <span className="text-slate-400">{r.partner_name || '—'}</span></span>
                    {r.created_at && <span>· {new Date(r.created_at).toLocaleDateString('en-IN')}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
