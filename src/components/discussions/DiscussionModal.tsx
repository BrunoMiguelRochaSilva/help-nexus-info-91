import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heart, Clock, MessageCircle } from 'lucide-react';
import { Discussion, Reply } from './types';
import { getRelativeTime, getUserIdentifier } from './utils';
import { ReplyItem } from './ReplyItem';
import { NewReplyForm } from './NewReplyForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserNameWithMessage } from '@/components/messaging';

interface DiscussionModalProps {
  discussion: Discussion | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  isLiked: boolean;
  onUpdate: () => void;
}

export const DiscussionModal = ({
  discussion,
  isOpen,
  onClose,
  onLike,
  isLiked,
  onUpdate,
}: DiscussionModalProps) => {
  const { user } = useAuth();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    if (discussion && isOpen) {
      fetchReplies();
      fetchLikedReplies();
    }
  }, [discussion, isOpen]);

  const fetchReplies = async () => {
    if (!discussion) return;
    
    setIsLoadingReplies(true);
    try {
      const { data, error } = await supabase
        .from('replies')
        .select('*')
        .eq('discussion_id', discussion.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
      toast.error('Failed to load replies');
    } finally {
      setIsLoadingReplies(false);
    }
  };

  const fetchLikedReplies = async () => {
    const userIdentifier = getUserIdentifier(user?.name);
    
    try {
      const { data, error } = await supabase
        .from('reply_likes')
        .select('reply_id')
        .eq('user_identifier', userIdentifier);

      if (error) throw error;
      setLikedReplies(new Set(data?.map((l) => l.reply_id) || []));
    } catch (error) {
      console.error('Error fetching liked replies:', error);
    }
  };

  const handleReplyLike = async (reply: Reply) => {
    const userIdentifier = getUserIdentifier(user?.name);
    const isCurrentlyLiked = likedReplies.has(reply.id);

    // Optimistic update
    setLikedReplies((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(reply.id);
      } else {
        newSet.add(reply.id);
      }
      return newSet;
    });

    setReplies((prev) =>
      prev.map((r) =>
        r.id === reply.id
          ? { ...r, likes_count: r.likes_count + (isCurrentlyLiked ? -1 : 1) }
          : r
      )
    );

    try {
      if (isCurrentlyLiked) {
        await supabase
          .from('reply_likes')
          .delete()
          .eq('reply_id', reply.id)
          .eq('user_identifier', userIdentifier);

        await supabase
          .from('replies')
          .update({ likes_count: reply.likes_count - 1 })
          .eq('id', reply.id);
      } else {
        await supabase.from('reply_likes').insert({
          reply_id: reply.id,
          user_identifier: userIdentifier,
        });

        await supabase
          .from('replies')
          .update({ likes_count: reply.likes_count + 1 })
          .eq('id', reply.id);
      }
    } catch (error) {
      // Revert on error
      setLikedReplies((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(reply.id);
        } else {
          newSet.delete(reply.id);
        }
        return newSet;
      });
      setReplies((prev) =>
        prev.map((r) =>
          r.id === reply.id
            ? { ...r, likes_count: reply.likes_count }
            : r
        )
      );
      toast.error('Failed to update like');
    }
  };

  const handleSubmitReply = async (body: string, authorName: string) => {
    if (!discussion) return;
    
    setIsSubmittingReply(true);
    try {
      const { data, error } = await supabase
        .from('replies')
        .insert({
          discussion_id: discussion.id,
          body,
          author_name: authorName,
        })
        .select()
        .single();

      if (error) throw error;
      
      setReplies((prev) => [...prev, data]);
      onUpdate();
      toast.success('Reply posted successfully');
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Something went wrong saving your reply. Please try again.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (!discussion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 shrink-0">
          <DialogTitle className="text-xl font-semibold text-foreground pr-8">
            {discussion.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 px-6">
          <div className="space-y-4">
            {/* Main discussion content */}
            <div className="space-y-3">
              <p className="text-foreground whitespace-pre-wrap">{discussion.body}</p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <button
                  onClick={onLike}
                  className={`flex items-center gap-1.5 transition-colors hover:text-primary ${
                    isLiked ? 'text-primary' : ''
                  }`}
                  aria-label={isLiked ? 'Unlike discussion' : 'Like discussion'}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-primary' : ''}`} />
                  <span>{discussion.likes_count} likes</span>
                </button>
                <div className="flex items-center gap-2">
                  <UserNameWithMessage authorName={discussion.author_name || 'Anonymous'} />
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getRelativeTime(discussion.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Replies section */}
            <div className="border-t border-border pt-4">
              <h4 className="flex items-center gap-2 font-medium text-foreground mb-3">
                <MessageCircle className="h-4 w-4" />
                Replies ({replies.length})
              </h4>

              {isLoadingReplies ? (
                <div className="flex justify-center py-8">
                  <span className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : replies.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No replies yet. Be the first to share your thoughts!
                </p>
              ) : (
                <div className="border border-border rounded-lg overflow-hidden">
                  {replies.map((reply) => (
                    <ReplyItem
                      key={reply.id}
                      reply={reply}
                      onLike={() => handleReplyLike(reply)}
                      isLiked={likedReplies.has(reply.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* New reply form - always visible at bottom */}
        <div className="border-t border-border p-6 shrink-0 bg-card">
          <h4 className="font-medium text-foreground mb-3">Add a reply</h4>
          <NewReplyForm
            onSubmit={handleSubmitReply}
            isSubmitting={isSubmittingReply}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
