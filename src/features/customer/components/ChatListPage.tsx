import { useState, useEffect } from 'react';
import { Search, MessageCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';
import { isSupabaseConfigured } from '@core/db/supabaseClient';

interface Conversation {
  id: string;
  bookingId: string;
  otherUser: {
    id: string;
    name: string;
    role: 'customer' | 'professional';
    profileImage?: string;
    online: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    isRead: boolean;
    senderId: string;
  };
  unreadCount: number;
}

interface ChatListPageProps {
  currentUserId: string;
  onBack: () => void;
  onSelectChat: (conversation: Conversation) => void;
}

export function ChatListPage({ currentUserId, onBack, onSelectChat }: ChatListPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations from Supabase or use mock data
  useEffect(() => {
    const fetchConversations = async () => {
      if (isSupabaseConfigured) {
        try {
          // TODO: Implement query to fetch conversations with latest messages
          // This would involve joining bookings, messages, and users tables
          setConversations(getMockConversations());
        } catch (error) {
          console.error('Error fetching conversations:', error);
          setConversations(getMockConversations());
        }
      } else {
        setConversations(getMockConversations());
      }
      setLoading(false);
    };

    fetchConversations();
  }, [currentUserId]);

  const getMockConversations = (): Conversation[] => [
    {
      id: 'conv_001',
      bookingId: 'BK10245',
      otherUser: {
        id: 'prof_001',
        name: 'Amit Sharma',
        role: 'professional',
        online: true
      },
      lastMessage: {
        text: 'Understood. I will bring all necessary tools and spare parts. See you tomorrow!',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        isRead: true,
        senderId: 'prof_001'
      },
      unreadCount: 0
    },
    {
      id: 'conv_002',
      bookingId: 'BK10246',
      otherUser: {
        id: 'prof_002',
        name: 'Meera Patel',
        role: 'professional',
        online: false
      },
      lastMessage: {
        text: 'Thank you! The cleaning service is scheduled for 2:00 PM today.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        isRead: false,
        senderId: 'prof_002'
      },
      unreadCount: 2
    },
    {
      id: 'conv_003',
      bookingId: 'BK10247',
      otherUser: {
        id: 'prof_003',
        name: 'Ravi Kumar',
        role: 'professional',
        online: true
      },
      lastMessage: {
        text: 'Great! I have completed the AC servicing. Please check and confirm.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
        isRead: true,
        senderId: 'prof_003'
      },
      unreadCount: 0
    },
    {
      id: 'conv_004',
      bookingId: 'BK10248',
      otherUser: {
        id: 'cust_001',
        name: 'Rajesh Kumar',
        role: 'customer',
        online: false
      },
      lastMessage: {
        text: 'Can you arrive 30 minutes earlier?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isRead: false,
        senderId: 'cust_001'
      },
      unreadCount: 1
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-sm text-gray-500">
                  {totalUnread > 0
                    ? `${totalUnread} unread message${totalUnread !== 1 ? 's' : ''}`
                    : 'All caught up!'}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredConversations.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversations</h3>
            <p className="text-gray-600">
              {searchQuery
                ? 'No conversations match your search'
                : 'Start a conversation by booking a service'}
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                onClick={() => onSelectChat(conversation)}
                className={`p-4 hover:shadow-md transition-all cursor-pointer ${
                  conversation.unreadCount > 0 ? 'bg-blue-50 border-l-4 border-[#2563EB]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {conversation.otherUser.name.charAt(0)}
                    </div>
                    {conversation.otherUser.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-semibold ${
                          conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {conversation.otherUser.name}
                        </h3>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 border text-xs">
                          {conversation.otherUser.role === 'professional' ? 'Pro' : 'Customer'}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {getTimeAgo(conversation.lastMessage.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      Booking: <span className="font-medium">{conversation.bookingId}</span>
                    </p>

                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage.senderId === currentUserId && (
                          <span className="text-gray-500 mr-1">You:</span>
                        )}
                        {conversation.lastMessage.text}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-[#2563EB] text-white border-0 ml-2 flex-shrink-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
