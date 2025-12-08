import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Heart, Clock, MessageCircle, Pencil, Trash2, X, Check, Plus } from 'lucide-react';
import { Discussion, Reply } from './types';
import { getRelativeTime, getUserIdentifier } from './utils';
import { ReplyItem } from './ReplyItem';
import { NewReplyForm } from './NewReplyForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserNameWithMessage } from '@/components/messaging';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface DiscussionModalProps {
  discussion: Discussion | null;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  isLiked: boolean;
  onUpdate: () => void;
  onDelete?: (discussionId: string) => Promise<void>;
}

export const DiscussionModal = ({
  discussion,
  isOpen,
  onClose,
  onLike,
  isLiked,
  onUpdate,
  onDelete,
}: DiscussionModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  
  // Edit discussion state
  const [isEditingDiscussion, setIsEditingDiscussion] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [isSavingDiscussion, setIsSavingDiscussion] = useState(false);

  const isDiscussionAuthor = isAuthenticated && user?.name === discussion?.author_name;

  useEffect(() => {
    if (discussion && isOpen) {
      fetchReplies();
      fetchLikedReplies();
      setEditTitle(discussion.title);
      setEditBody(discussion.body);
      setIsReplyFormOpen(false);
      setIsEditingDiscussion(false);
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
      setIsReplyFormOpen(false);
      onUpdate();
      toast.success('Reply posted successfully');
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Something went wrong saving your reply. Please try again.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleEditReply = async (replyId: string, newBody: string) => {
    try {
      const { error } = await supabase
        .from('replies')
        .update({ body: newBody })
        .eq('id', replyId);

      if (error) throw error;
      
      setReplies((prev) =>
        prev.map((r) => (r.id === replyId ? { ...r, body: newBody } : r))
      );
      toast.success('Reply updated');
    } catch (error) {
      console.error('Error updating reply:', error);
      toast.error('Failed to update reply');
      throw error;
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      const { error } = await supabase
        .from('replies')
        .update({ is_hidden: true })
        .eq('id', replyId);

      if (error) throw error;
      
      setReplies((prev) => prev.filter((r) => r.id !== replyId));
      onUpdate();
      toast.success('Reply deleted');
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error('Failed to delete reply');
      throw error;
    }
  };

  const handleSaveDiscussionEdit = async () => {
    if (!discussion || !editTitle.trim() || !editBody.trim()) return;
    
    setIsSavingDiscussion(true);
    try {
      const { error } = await supabase
        .from('discussions')
        .update({ title: editTitle.trim(), body: editBody.trim() })
        .eq('id', discussion.id);

      if (error) throw error;
      
      setIsEditingDiscussion(false);
      onUpdate();
      toast.success('Discussion updated');
    } catch (error) {
      console.error('Error updating discussion:', error);
      toast.error('Failed to update discussion');
    } finally {
      setIsSavingDiscussion(false);
    }
  };

  const handleDeleteDiscussion = async () => {
    if (!discussion || !onDelete) return;
    try {
      await onDelete(discussion.id);
      onClose();
    } catch (error) {
      console.error('Error deleting discussion:', error);
    }
  };

  if (!discussion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 shrink-0">
          {isEditingDiscussion ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-xl font-semibold bg-background border-input"
              placeholder="Discussion title"
            />
          ) : (
            <DialogTitle className="text-xl font-semibold text-foreground pr-8">
              {discussion.title}
            </DialogTitle>
          )}
          <DialogDescription className="sr-only">
            Discussion thread with replies
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0 px-6">
          <div className="space-y-4">
            {/* Main discussion content */}
            <div className="space-y-3">
              {isEditingDiscussion ? (
                <div className="space-y-2">
                  <Textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    className="min-h-[100px] bg-background border-input text-foreground resize-none"
                    placeholder="Discussion content"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveDiscussionEdit}
                      disabled={isSavingDiscussion || !editTitle.trim() || !editBody.trim()}
                      className="rounded-full"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditingDiscussion(false);
                        setEditTitle(discussion.title);
                        setEditBody(discussion.body);
                      }}
                      className="rounded-full"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-foreground whitespace-pre-wrap">{discussion.body}</p>
              )}
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
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
                  
                  {isDiscussionAuthor && !isEditingDiscussion && (
                    <>
                      <button
                        onClick={() => setIsEditingDiscussion(true)}
                        className="flex items-center gap-1 transition-colors hover:text-primary"
                        aria-label="Edit discussion"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="flex items-center gap-1 transition-colors hover:text-destructive"
                            aria-label="Delete discussion"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Discussion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this discussion? This will also remove all replies. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteDiscussion} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
                
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
                      onEdit={handleEditReply}
                      onDelete={handleDeleteReply}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* New reply form - collapsible */}
        <div className="border-t border-border p-6 shrink-0 bg-card">
          <Collapsible open={isReplyFormOpen} onOpenChange={setIsReplyFormOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant={isReplyFormOpen ? "outline" : "default"}
                className="w-full rounded-full"
              >
                {isReplyFormOpen ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add a reply
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <NewReplyForm
                onSubmit={handleSubmitReply}
                isSubmitting={isSubmittingReply}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DialogContent>
    </Dialog>
  );
};
