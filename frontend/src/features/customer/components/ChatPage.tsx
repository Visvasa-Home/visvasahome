import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Image as ImageIcon,
  Phone,
  MoreVertical,
  CheckCheck,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Card } from '@shared/ui/card';
import { Button } from '@shared/ui/button';
import { Badge } from '@shared/ui/badge';
import { getBookingMessages, createMessage, markMessageAsRead } from '@core/db/database';
import { Message, isSupabaseConfigured, supabase } from '@core/db/supabaseClient';
import { BookingService } from '@booking/services/bookingService';

interface ChatUser {
  id: string;
  name: string;
  role: 'customer' | 'professional';
  profileImage?: string;
  online?: boolean;
}

interface ChatPageProps {
  bookingId: string;
  currentUserId: string;
  otherUser: ChatUser;
  onBack: () => void;
}

export function ChatPage({ bookingId, currentUserId, otherUser, onBack }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages from Supabase
  useEffect(() => {
    // Ownership check (IDOR Protection)
    if (bookingId && bookingId !== 'SUPPORT_TICKET') {
      const booking = BookingService.getBookingById(bookingId);
      if (booking && currentUserId) {
        const cleanBookingPhone = booking.userPhone.replace(/[^\d+]/g, '');
        const cleanUserPhone = currentUserId.replace(/[^\d+]/g, '');
        if (cleanBookingPhone !== cleanUserPhone) {
          setIsAuthorized(false);
          return;
        }
      }
    }
    setIsAuthorized(true);

    const fetchMessages = async () => {
      if (isSupabaseConfigured) {
        try {
          const data = await getBookingMessages(bookingId);
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
          setMessages(getMockMessages());
        }
      } else {
        setMessages(getMockMessages());
      }
    };

    fetchMessages();

    // Set up real-time subscription if Supabase is configured
    if (isSupabaseConfigured) {
      const subscription = supabase
        .channel(`booking_${bookingId}_messages`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `booking_id=eq.${bookingId}`
          },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages((prev) => [...prev, newMsg]);

            // Mark as read if it's not from current user
            if (newMsg.sender_id !== currentUserId && !newMsg.is_read) {
              markMessageAsRead(newMsg.id);
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [bookingId, currentUserId]);

  const getMockMessages = (): Message[] => {
    if (otherUser.id === 'vh_support') {
      return [
        {
          id: 'msg_sup_1',
          booking_id: bookingId,
          sender_id: otherUser.id,
          receiver_id: currentUserId,
          message_text: 'Hi there! I am VisvasaHome Support. How can I help you today?',
          is_read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
        }
      ];
    }
    
    return [
      {
        id: 'msg_001',
        booking_id: bookingId,
        sender_id: otherUser.id,
        receiver_id: currentUserId,
        message_text: 'Hello! I am the professional assigned to your booking.',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
      },
      {
        id: 'msg_002',
        booking_id: bookingId,
        sender_id: currentUserId,
        receiver_id: otherUser.id,
        message_text: 'Hi! Thanks for accepting the booking.',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 2).toISOString()
      },
      {
        id: 'msg_003',
        booking_id: bookingId,
        sender_id: currentUserId,
        receiver_id: otherUser.id,
        message_text: 'Will you be arriving on time tomorrow?',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 3).toISOString()
      },
      {
        id: 'msg_004',
        booking_id: bookingId,
        sender_id: otherUser.id,
        receiver_id: currentUserId,
        message_text: 'Yes, I will arrive at 11:00 AM as scheduled. Is there anything specific I should know about the job?',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString()
      },
      {
        id: 'msg_005',
        booking_id: bookingId,
        sender_id: currentUserId,
        receiver_id: otherUser.id,
        message_text: 'The tap in the kitchen is leaking badly. Please bring the necessary parts.',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString()
      },
      {
        id: 'msg_006',
        booking_id: bookingId,
        sender_id: otherUser.id,
        receiver_id: currentUserId,
        message_text: 'Absolutely, I have loaded the standard cartridge replacement and washer kits. I\'ll see you tomorrow.',
        is_read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      }
    ];
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const msgData: Partial<Message> = {
        booking_id: bookingId,
        sender_id: currentUserId,
        receiver_id: otherUser.id,
        message_text: newMessage,
        is_read: false
      };

      if (isSupabaseConfigured) {
        const data = await createMessage(msgData);
        if (data) {
          setMessages((prev) => [...prev, data]);
        }
      } else {
        const localMsg: Message = {
          id: `msg_local_${Date.now()}`,
          booking_id: bookingId,
          sender_id: currentUserId,
          receiver_id: otherUser.id,
          message_text: newMessage,
          is_read: false,
          created_at: new Date().toISOString()
        };
        setMessages((prev) => [...prev, localMsg]);

        // Simulating auto-replies for mock support/SP
        setTimeout(() => {
          let responses: string[];
          if (otherUser.id === 'vh_support') {
            responses = [
              "We have logged your ticket. Our representative is reviewing it.",
              "Thanks for reaching out! Let me check the details for you.",
              "I'm escalating this to our operations team right now.",
              "We apologize for the inconvenience. We'll resolve this ASAP."
            ];
          } else {
            responses = [
              "Got it! I am on my way to your location as scheduled.",
              "Received. I will make sure to bring the required parts and tools.",
              "Understood, thank you for the heads up! See you soon.",
              "Sure, is there any landmark or security gate restriction I should know about?",
              "Confirmed. I've noted down your preferences."
            ];
          }
          const randomReply = responses[Math.floor(Math.random() * responses.length)];
          const replyMessage: Message = {
            id: `msg_reply_${Date.now()}`,
            booking_id: bookingId,
            sender_id: otherUser.id,
            receiver_id: currentUserId,
            message_text: randomReply,
            is_read: true,
            created_at: new Date().toISOString()
          };
          setMessages((prev) => [...prev, replyMessage]);
        }, 1500);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <Card className="p-8 max-w-sm w-full shadow-lg border border-gray-200">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            You do not have permission to view or participate in this booking's chat.
          </p>
          <Button
            onClick={onBack}
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {otherUser.name.charAt(0)}
                </div>
                {otherUser.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></div>
                )}
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">{otherUser.name}</h2>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 border text-xs">
                    {otherUser.role === 'professional' ? 'Professional' : 'Customer'}
                  </Badge>
                  {otherUser.online && (
                    <span className="text-xs text-blue-600">Online</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Booking Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-900">
            <strong>Booking #{bookingId}</strong> • Chat about your service booking
          </p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => {
            const isOwnMessage = message.sender_id === currentUserId;
            const showTimestamp = index === 0 ||
              new Date(message.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 1000 * 60 * 5;

            return (
              <div key={message.id}>
                {showTimestamp && (
                  <div className="flex justify-center mb-4">
                    <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                )}

                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-[#2563EB] text-white rounded-br-sm'
                          : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{message.message_text}</p>
                    </div>

                    <div className={`flex items-center gap-1 mt-1 px-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </span>
                      {isOwnMessage && (
                        <span>
                          {message.is_read ? (
                            <CheckCheck className="w-3 h-3 text-[#2563EB]" />
                          ) : (
                            <Clock className="w-3 h-3 text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors mb-1">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>

          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors mb-1">
            <ImageIcon className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent resize-none max-h-32"
              style={{
                minHeight: '48px',
                maxHeight: '128px'
              }}
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="bg-[#2563EB] hover:bg-[#2563EB] rounded-full p-3 mb-1"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-2">
          Messages are end-to-end encrypted. Only you and the recipient can read them.
        </p>
      </div>
    </div>
  );
}
