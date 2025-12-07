import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SendMessageModal } from './SendMessageModal';

interface UserNameWithMessageProps {
  authorName: string;
  className?: string;
}

export const UserNameWithMessage = ({ authorName, className = '' }: UserNameWithMessageProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const displayName = authorName || 'Anonymous';
  const isOwnName = user?.name?.toLowerCase() === displayName.toLowerCase();
  const canMessage = isAuthenticated && !isOwnName && displayName !== 'Anonymous';

  const handleSendMessageClick = () => {
    setIsPopoverOpen(false);
    setIsSendModalOpen(true);
  };

  if (!canMessage) {
    return <span className={className}>{displayName}</span>;
  }

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className={`font-medium hover:text-primary hover:underline transition-colors cursor-pointer ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {displayName}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-2 bg-card border-border"
          align="start"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleSendMessageClick}
          >
            <Mail className="h-4 w-4" />
            Send message
          </Button>
        </PopoverContent>
      </Popover>

      <SendMessageModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        recipientName={displayName}
      />
    </>
  );
};
