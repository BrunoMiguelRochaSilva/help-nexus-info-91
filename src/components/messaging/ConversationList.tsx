import React from 'react';
import { Conversation } from './types';
import { getRelativeTime } from '@/components/discussions/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (otherUser: string) => void;
}

export const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) => {
  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-muted-foreground text-sm">
        No conversations yet
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {conversations.map((conv) => (
          <button
            key={conv.otherUser}
            onClick={() => onSelectConversation(conv.otherUser)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedConversation === conv.otherUser
                ? 'bg-primary/10 border border-primary/20'
                : 'hover:bg-muted/50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-foreground truncate ${
                    conv.unreadCount > 0 ? 'font-bold' : ''
                  }`}>
                    {conv.otherUser}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="flex-shrink-0 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                  )}
                </div>
                <p className={`text-sm truncate mt-0.5 ${
                  conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {conv.lastMessage.content}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {getRelativeTime(conv.lastMessage.created_at)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};
