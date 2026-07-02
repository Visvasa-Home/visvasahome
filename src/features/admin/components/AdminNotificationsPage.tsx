import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Bell, Mail, MessageSquare, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';

interface AdminNotificationsPageProps {
  onBack: () => void;
}

interface NotificationBroadcast {
  id: string;
  title: string;
  body: string;
  audience: string;
  channel: 'sms' | 'email' | 'push';
  sentAt: string;
  status: 'sent' | 'processing';
  deliveredCount: number;
}

export function AdminNotificationsPage({ onBack }: AdminNotificationsPageProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all_customers');
  const [channel, setChannel] = useState<'push' | 'sms' | 'email'>('push');
  const [isSending, setIsSending] = useState(false);

  // Sent Notifications log database with localStorage persistence
  const [broadcasts, setBroadcasts] = useState<NotificationBroadcast[]>(() => {
    const saved = localStorage.getItem('visvasahome_broadcasts');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'BC-2093', title: 'Monsoon Service Safety Offers!', body: 'Get 20% discount on all Annual Maintenance contracts this monsoon. Use coupon SAFETY20.', audience: 'All Customers', channel: 'push', sentAt: '2026-06-12 11:30 AM', status: 'sent', deliveredCount: 5892 },
      { id: 'BC-2092', title: 'Mandatory Safety KYC Verification', body: 'Please verify your Aadhar card document inside the profile tab before accepting bookings.', audience: 'All Service Providers', channel: 'sms', sentAt: '2026-06-11 04:15 PM', status: 'sent', deliveredCount: 342 },
      { id: 'BC-2091', title: 'Welcome to VisvasaHome Network', body: 'Thank you for registering. Let us help you keep your home appliances safe and serviced.', audience: 'New Signups (Jaipur)', channel: 'email', sentAt: '2026-06-10 09:00 AM', status: 'sent', deliveredCount: 145 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('visvasahome_broadcasts', JSON.stringify(broadcasts));
  }, [broadcasts]);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      alert('Please fill out both the Notification Title and Message Body!');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      // Create new record
      const audienceLabels: Record<string, string> = {
        all_customers: 'All Customers',
        all_providers: 'All Service Providers',
        low_rated_providers: 'Low Rated Providers (<4.5 Stars)',
        jaipur_city: 'Jaipur Active Users',
        specific_phone: 'Specific Target Phone'
      };

      const countMap: Record<string, number> = {
        all_customers: 5892,
        all_providers: 342,
        low_rated_providers: 24,
        jaipur_city: 812,
        specific_phone: 1
      };

      const newBroadcast: NotificationBroadcast = {
        id: `BC-${Math.floor(1000 + Math.random() * 9000)}`,
        title,
        body,
        audience: audienceLabels[audience] || 'Selected Targets',
        channel,
        sentAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        deliveredCount: countMap[audience] || 1
      };

      setBroadcasts(prev => [newBroadcast, ...prev]);
      setIsSending(false);
      setTitle('');
      setBody('');
      alert(`Notification broadcasted successfully via ${channel.toUpperCase()} to ${newBroadcast.deliveredCount} receivers.`);
    }, 1500);
  };

  const getChannelIcon = (c: NotificationBroadcast['channel']) => {
    switch (c) {
      case 'push':
        return <Bell className="w-4 h-4 text-blue-600" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4 text-amber-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications & Alert Center</h1>
            <p className="text-sm text-gray-500">Send push, SMS, and email alerts directly to customers and service providers</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Broadcast Sender Form */}
        <Card className="p-6 lg:col-span-2 border border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" /> Draft Broadcast Message
          </h2>
          <form onSubmit={handleSendNotification} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Notification Title</label>
              <Input
                type="text"
                placeholder="Enter alert header / title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Message Body</label>
              <textarea
                placeholder="Enter description or discount coupon offer details..."
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={4}
                required
                className="w-full text-sm border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Target Audience</label>
                <select
                  value={audience}
                  onChange={e => setAudience(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500 bg-white"
                >
                  <option value="all_customers">All Customers (5.8k)</option>
                  <option value="all_providers">All Service Providers (342)</option>
                  <option value="low_rated_providers">Low Rated Providers (24)</option>
                  <option value="jaipur_city">Jaipur Active Users (812)</option>
                  <option value="specific_phone">Specific Target (1)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Channel Type</label>
                <select
                  value={channel}
                  onChange={e => setChannel(e.target.value as any)}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-500 bg-white"
                >
                  <option value="push">In-App Push Notification</option>
                  <option value="sms">SMS Text Messaging</option>
                  <option value="email">Direct Email Inbox</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSending}
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white flex items-center justify-center gap-2 h-10 mt-2"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Broadcasting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Broadcast Now
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Dispatch Logs History */}
        <Card className="p-6 lg:col-span-3 border border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Past Dispatch Log History</h2>
          <div className="space-y-4 overflow-y-auto max-h-[450px] pr-2">
            {broadcasts.map(b => (
              <div key={b.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-xs border border-gray-100 flex items-center justify-center">
                      {getChannelIcon(b.channel)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{b.title}</h4>
                      <p className="text-[10px] text-gray-400">ID: {b.id} &bull; Delivered via {b.channel.toUpperCase()}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    <CheckCircle className="w-3 h-3 mr-1" /> Sent
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3 pl-10 italic">
                  "{b.body}"
                </p>
                <div className="flex items-center justify-between pl-10 text-[10px] text-gray-500 font-semibold border-t border-gray-100 pt-2">
                  <span>Target: <strong className="text-gray-700">{b.audience}</strong></span>
                  <span>Sent: <strong>{b.sentAt}</strong></span>
                  <span>Deliveries: <strong className="text-blue-600">{b.deliveredCount} success</strong></span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
