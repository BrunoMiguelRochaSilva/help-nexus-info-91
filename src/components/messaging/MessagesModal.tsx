import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { PrivateMessage, Conversation } from './types';
import { ConversationList } from './ConversationList';
import { MessageThread } from './MessageThread';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
}

export const MessagesModal = ({ isOpen, onClose, onUnreadCountChange }: MessagesModalProps) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!user?.name) return;

    setIsLoading(true);
    try {
      // Get all messages where user is sender or receiver
      const { data, error } = await supabase
        .from('private_messages')
        .select('*')
        .or(`sender_name.eq.${user.name},receiver_name.eq.${user.name}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation partner
      const conversationMap = new Map<string, { messages: PrivateMessage[]; unreadCount: number }>();
      
      (data || []).forEach((msg: PrivateMessage) => {
        const otherUser = msg.sender_name.toLowerCase() === user.name.toLowerCase()
          ? msg.receiver_name
          : msg.sender_name;
        
        if (!conversationMap.has(otherUser)) {
          conversationMap.set(otherUser, { messages: [], unreadCount: 0 });
        }
        
        const conv = conversationMap.get(otherUser)!;
        conv.messages.push(msg);
        
        if (!msg.is_read && msg.receiver_name.toLowerCase() === user.name.toLowerCase()) {
          conv.unreadCount++;
        }
      });

      const convList: Conversation[] = [];
      let totalUnread = 0;

      conversationMap.forEach((value, otherUser) => {
        convList.push({
          otherUser,
          lastMessage: value.messages[0],
          unreadCount: value.unreadCount,
        });
        totalUnread += value.unreadCount;
      });

      // Sort by last message time
      convList.sort((a, b) => 
        new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
      );

      setConversations(convList);
      onUnreadCountChange(totalUnread);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [user?.name, onUnreadCountChange]);

  const fetchMessages = useCallback(async (otherUser: string) => {
    if (!user?.name) return;

    try {
      const { data, error } = await supabase
        .from('private_messages')
        .select('*')
        .or(
          `and(sender_name.eq.${user.name},receiver_name.eq.${otherUser}),and(sender_name.eq.${otherUser},receiver_name.eq.${user.name})`
        )
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      const unreadIds = (data || [])
        .filter((m: PrivateMessage) => !m.is_read && m.receiver_name.toLowerCase() === user.name.toLowerCase())
        .map((m: PrivateMessage) => m.id);

      if (unreadIds.length > 0) {
        await supabase
          .from('private_messages')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in('id', unreadIds);
        
        // Refetch to update unread counts
        fetchConversations();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  }, [user?.name, fetchConversations]);

  useEffect(() => {
    if (isOpen && user?.name) {
      fetchConversations();
    }
  }, [isOpen, user?.name, fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation, fetchMessages]);

  const handleSelectConversation = (otherUser: string) => {
    setSelectedConversation(otherUser);
  };

  const handleSendMessage = async (content: string) => {
    if (!user?.name || !selectedConversation) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase
        .from('private_messages')
        .insert({
          sender_name: user.name,
          receiver_name: selectedConversation,
          content,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, data]);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const showConversationList = !isMobileView || !selectedConversation;
  const showMessageThread = !isMobileView || selectedConversation;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-card border-border max-h-[80vh] h-[600px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            {isMobileView && selectedConversation && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-lg font-semibold text-foreground">
              Messages
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="flex flex-1 min-h-0">
          {/* Conversation List */}
          {showConversationList && (
            <div className={`${isMobileView ? 'w-full' : 'w-1/3 border-r border-border'} h-full`}>
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <span className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : (
                <ConversationList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onSelectConversation={handleSelectConversation}
                />
              )}
            </div>
          )}

          {/* Message Thread */}
          {showMessageThread && (
            <div className={`${isMobileView ? 'w-full' : 'w-2/3'} h-full`}>
              <MessageThread
                messages={messages}
                currentUserName={user?.name || ''}
                otherUserName={selectedConversation || ''}
                onSendMessage={handleSendMessage}
                isSending={isSending}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
