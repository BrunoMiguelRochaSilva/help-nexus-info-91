import React from 'react';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Discussion } from './types';
import { getRelativeTime, truncateText } from './utils';

interface DiscussionCardProps {
  discussion: Discussion;
  onClick: () => void;
  onLike: (e: React.MouseEvent) => void;
  isLiked: boolean;
}

export const DiscussionCard = ({ discussion, onClick, onLike, isLiked }: DiscussionCardProps) => {
  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.01] bg-card border-border"
      onClick={onClick}
    >
      <div className="space-y-2">
        <h4 className="font-semibold text-foreground line-clamp-2">
          {discussion.title}
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {truncateText(discussion.body)}
        </p>
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <button
              onClick={onLike}
              className={`flex items-center gap-1 transition-colors hover:text-primary ${
                isLiked ? 'text-primary' : ''
              }`}
              aria-label={isLiked ? 'Unlike discussion' : 'Like discussion'}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-primary' : ''}`} />
              <span>{discussion.likes_count}</span>
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {discussion.replies_count}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{discussion.author_name || 'Anonymous'}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getRelativeTime(discussion.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
