import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Phone, Mail, MapPin, AlertCircle, MessageSquare, CheckCircle, Clock, Send, ShieldAlert } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';

interface AdminSupportPageProps {
  onBack: () => void;
}

interface TicketMessage {
  sender: 'admin' | 'user';
  text: string;
  time: string;
}

interface SupportTicket {
  id: string;
  userType: 'customer' | 'provider';
  userName: string;
  userPhone: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  messages: TicketMessage[];
}

export function AdminSupportPage({ onBack }: AdminSupportPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'customer' | 'provider'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>('TCK-901');

  // Input reply state
  const [replyText, setReplyText] = useState('');

  // Mock Support Tickets Database with localStorage persistence
  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('visvasahome_tickets');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'TCK-901',
        userType: 'customer',
        userName: 'Rajesh Kumar',
        userPhone: '+91-9876543210',
        subject: 'Refund not received for cancelled plumbing job',
        description: 'My plumbing booking BK10243 was cancelled due to no availability of Amit Sharma on that slot, but money hasn\'t been refunded back to UPI account yet.',
        status: 'open',
        priority: 'high',
        createdAt: '2026-06-12 10:30 AM',
        messages: [
          { sender: 'user', text: 'Hi, I cancelled booking BK10243 yesterday. The system said refund initiated but I have not received it yet.', time: '10:30 AM' },
        ],
      },
      {
        id: 'TCK-902',
        userType: 'provider',
        userName: 'Amit Sharma',
        userPhone: '+91-9123456789',
        subject: 'Payout Hold in Dashboard',
        description: 'My dashboard is showing payout held for job BK10247. Please release, job was successfully completed and customer rated me 5 stars.',
        status: 'in-progress',
        priority: 'medium',
        createdAt: '2026-06-12 11:15 AM',
        messages: [
          { sender: 'user', text: 'Please release my payout. I need to buy plumbing inventory.', time: '11:15 AM' },
          { sender: 'admin', text: 'Hello Amit, your payout was held because of a general account review check. Our executive is inspecting the job logs. It will be released soon.', time: '11:45 AM' },
          { sender: 'user', text: 'Ok, thank you. Please do it soon.', time: '12:00 PM' },
        ],
      },
      {
        id: 'TCK-903',
        userType: 'customer',
        userName: 'Priya Singh',
        userPhone: '+91-9876543211',
        subject: 'Cleaning lady arrived late',
        description: 'The deep cleaning provider arrived 30 minutes late today. Please warn them, my entire schedule was disrupted.',
        status: 'resolved',
        priority: 'low',
        createdAt: '2026-06-11 02:40 PM',
        messages: [
          { sender: 'user', text: 'The cleaner arrived 30 mins late.', time: '02:40 PM' },
          { sender: 'admin', text: 'We sincerely apologize. We have warned the service provider and added 50 loyalty points to your wallet.', time: '03:10 PM' },
          { sender: 'user', text: 'Thank you for resolving it.', time: '03:15 PM' },
        ],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('visvasahome_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicketId) return;

    setTickets(prev =>
      prev.map(t => {
        if (t.id === selectedTicketId) {
          const newMsg: TicketMessage = {
            sender: 'admin',
            text: replyText,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          };
          return {
            ...t,
            messages: [...t.messages, newMsg],
            status: t.status === 'open' ? 'in-progress' : t.status
          };
        }
        return t;
      })
    );

    setReplyText('');
  };

  const handleResolveTicket = (id: string) => {
    setTickets(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'resolved' } : t))
    );
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUserType = userTypeFilter === 'all' || t.userType === userTypeFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesUserType && matchesStatus;
  });

  const activeTicket = tickets.find(t => t.id === selectedTicketId);

  const getPriorityBadge = (p: SupportTicket['priority']) => {
    switch (p) {
      case 'high':
        return <Badge className="bg-red-50 text-red-700 border-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Low</Badge>;
    }
  };

  const getStatusBadge = (s: SupportTicket['status']) => {
    switch (s) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800">Open</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support & Complaints Hub</h1>
            <p className="text-sm text-gray-500">Respond to customer issues, verify payout hold disputes, and resolve tickets</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search Ticket ID, subject, name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex gap-1.5 items-center">
              <span className="text-xs font-semibold text-gray-500">Audience:</span>
              {(['all', 'customer', 'provider'] as const).map(type => (
                <Button
                  key={type}
                  onClick={() => setUserTypeFilter(type)}
                  variant={userTypeFilter === type ? 'default' : 'outline'}
                  className="capitalize text-xs h-8 px-3 rounded-lg"
                >
                  {type === 'all' ? 'All' : type}
                </Button>
              ))}
            </div>
            <div className="flex gap-1.5 items-center">
              <span className="text-xs font-semibold text-gray-500">Status:</span>
              {['all', 'open', 'in-progress', 'resolved'].map(status => (
                <Button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  className="capitalize text-xs h-8 px-2.5 rounded-lg"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Split Window Layout */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Tickets List Column */}
        <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredTickets.length === 0 ? (
            <Card className="p-8 text-center text-gray-500 border-gray-200">
              No tickets found matching criteria.
            </Card>
          ) : (
            filteredTickets.map(t => (
              <Card
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`p-4 cursor-pointer hover:shadow-md transition-all border ${
                  selectedTicketId === t.id ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500">{t.id}</span>
                  <div className="flex gap-1.5">
                    {getPriorityBadge(t.priority)}
                    {getStatusBadge(t.status)}
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">{t.subject}</h3>
                <p className="text-xs text-gray-500 mb-2 truncate">{t.description}</p>
                <div className="flex justify-between items-center text-[10px] text-gray-400 font-semibold border-t border-gray-100 pt-2">
                  <span className="capitalize">{t.userType}: {t.userName}</span>
                  <span>{t.createdAt}</span>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Chat Detail & Action Panel Column */}
        <div className="lg:col-span-3">
          {activeTicket ? (
            <Card className="h-[600px] border border-gray-200 bg-white flex flex-col overflow-hidden">
              {/* Ticket Details Header */}
              <div className="p-4 border-b border-gray-150 bg-gray-50/50 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold text-gray-900">{activeTicket.id}</span>
                    <span className="text-xs text-gray-500 font-medium capitalize">({activeTicket.userType})</span>
                  </div>
                  <h2 className="text-sm font-bold text-gray-800 leading-tight">{activeTicket.subject}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {activeTicket.status !== 'resolved' && (
                    <Button
                      size="sm"
                      onClick={() => handleResolveTicket(activeTicket.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium text-xs h-8"
                    >
                      Resolve Ticket
                    </Button>
                  )}
                  {getStatusBadge(activeTicket.status)}
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/20">
                {/* Initial Description */}
                <div className="p-3 bg-blue-50/35 border border-blue-100/50 rounded-xl mb-4">
                  <p className="text-xs font-semibold text-blue-700 mb-1">Original Issue Description:</p>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">{activeTicket.description}</p>
                  <p className="text-[10px] text-gray-400 mt-2 font-semibold flex items-center gap-3">
                    <span>Phone: {activeTicket.userPhone}</span>
                    <span>Created: {activeTicket.createdAt}</span>
                  </p>
                </div>

                {activeTicket.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] ${
                      m.sender === 'admin' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'admin'
                          ? 'bg-[#2563EB] text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/50'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 font-semibold px-1">{m.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-3 border-t border-gray-150 bg-white">
                {activeTicket.status === 'resolved' ? (
                  <div className="text-center py-2 text-xs font-semibold text-green-700 bg-green-50 rounded-lg">
                    This support ticket has been resolved. Open state to continue replies.
                  </div>
                ) : (
                  <form onSubmit={handleSendReply} className="flex gap-2">
                    <Input
                      placeholder="Type reply message to user..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="flex-1 text-xs"
                      required
                    />
                    <Button type="submit" className="bg-[#2563EB] text-white hover:bg-blue-700 h-9 px-3">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                )}
              </div>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center text-gray-500 border-gray-200 bg-white">
              Select a ticket from the left panel to inspect details and chat.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
