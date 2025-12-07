import React from 'react';
import { Heart, Clock } from 'lucide-react';
import { Reply } from './types';
import { getRelativeTime } from './utils';
import { UserNameWithMessage } from '@/components/messaging';

interface ReplyItemProps {
  reply: Reply;
  onLike: () => void;
  isLiked: boolean;
}

export const ReplyItem = ({ reply, onLike, isLiked }: ReplyItemProps) => {
  return (
    <div className="p-4 border-b border-border last:border-b-0">
      <p className="text-foreground whitespace-pre-wrap">{reply.body}</p>
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <button
          onClick={onLike}
          className={`flex items-center gap-1 transition-colors hover:text-primary ${
            isLiked ? 'text-primary' : ''
          }`}
          aria-label={isLiked ? 'Unlike reply' : 'Like reply'}
        >
          <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-primary' : ''}`} />
          <span>{reply.likes_count}</span>
        </button>
        <div className="flex items-center gap-2">
          <UserNameWithMessage authorName={reply.author_name || 'Anonymous'} />
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getRelativeTime(reply.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};
