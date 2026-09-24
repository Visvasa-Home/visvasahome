import { useEffect, useState } from 'react';
import { Bell, Send, AlertTriangle, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';
import { AdminApi } from '../api/client';

export default function Notifications() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await AdminApi.getSupportTickets();
      if (res.data.success) setTickets(res.data.data || []);
    } catch {}
    setLoadingTickets(false);
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true);
    try {
      await AdminApi.sendNotification(title, body, 'all');
      setSent(true);
      setTitle('');
      setBody('');
      setTimeout(() => setSent(false), 3000);
    } catch {}
    setSending(false);
  };

  const handleResolve = async (id: string) => {
    setUpdatingId(id);
    try {
      await AdminApi.updateTicket(id, 'Resolved');
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    } catch {}
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Notifications & Support</h1>
        <p className="text-slate-400 text-sm mt-0.5">Broadcast messages and manage support tickets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Broadcast Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-white text-sm">Broadcast Notification</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg px-4 py-3 text-xs text-blue-300">
              This will send a real-time notification to <strong>all connected partners</strong> via Socket.io.
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-1.5">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Platform Maintenance"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-1.5">Message</label>
              <textarea value={body} onChange={e => setBody(e.target.value)} rows={3}
                placeholder="Enter your message here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none" />
            </div>
            <button onClick={handleSend} disabled={sending || !title || !body}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                : sent ? <><CheckCircle className="w-4 h-4" /> Sent Successfully!</>
                : <><Send className="w-4 h-4" /> Send to All Partners</>}
            </button>
          </div>
        </div>

        {/* SOS Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h3 className="font-semibold text-white text-sm">SOS & Emergency Alerts</h3>
          </div>
          <div className="p-5">
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-300 mb-4">
              SOS alerts are automatically received via real-time Socket.io connection. They appear as banners at the top of the screen when triggered.
            </div>
            <div className="space-y-2 text-sm text-slate-400">
              <p>When a partner triggers SOS from their app:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-500 ml-2">
                <li>A red banner appears at the top of this admin panel</li>
                <li>The notification count updates on the sidebar</li>
                <li>Partner's location and job ID are logged</li>
                <li>Admin can take manual action from Bookings page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">Partner Support Tickets</h3>
          <button onClick={fetchTickets} className="text-slate-400 hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
          {loadingTickets ? (
            <div className="flex items-center justify-center py-8 text-slate-500 text-sm">Loading tickets...</div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
              <CheckCircle className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">No open tickets</p>
            </div>
          ) : (
            tickets.map(t => (
              <div key={t.id} className={`border rounded-xl p-4 ${t.status === 'Resolved' ? 'border-slate-800 opacity-60' : 'border-slate-700 bg-slate-800/30'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-medium">{t.title || 'Support Request'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${t.status === 'Resolved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                        {t.status || 'Open'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">{t.description}</p>
                    <p className="text-slate-600 text-xs mt-1">{t.partner_name} · {t.partner_phone}</p>
                  </div>
                  {t.status !== 'Resolved' && (
                    <button disabled={updatingId === t.id} onClick={() => handleResolve(t.id)}
                      className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/20 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors flex-shrink-0">
                      <CheckCircle className="w-3 h-3" /> Resolve
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
