import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, MessageSquare, RefreshCw } from 'lucide-react';
import { Discussion } from './types';
import { DiscussionCard } from './DiscussionCard';
import { DiscussionModal } from './DiscussionModal';
import { NewDiscussionModal } from './NewDiscussionModal';
import { getUserIdentifier } from './utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 5;

export const StayInTouchSection = () => {
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [likedDiscussions, setLikedDiscussions] = useState<Set<string>>(new Set());
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    fetchDiscussions();
    fetchLikedDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('discussions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      toast.error('Failed to load discussions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikedDiscussions = async () => {
    const userIdentifier = getUserIdentifier(user?.name);
    
    try {
      const { data, error } = await supabase
        .from('discussion_likes')
        .select('discussion_id')
        .eq('user_identifier', userIdentifier);

      if (error) throw error;
      setLikedDiscussions(new Set(data?.map((l) => l.discussion_id) || []));
    } catch (error) {
      console.error('Error fetching liked discussions:', error);
    }
  };

  const handleLikeDiscussion = async (discussion: Discussion, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    const userIdentifier = getUserIdentifier(user?.name);
    const isCurrentlyLiked = likedDiscussions.has(discussion.id);

    // Optimistic update
    setLikedDiscussions((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(discussion.id);
      } else {
        newSet.add(discussion.id);
      }
      return newSet;
    });

    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussion.id
          ? { ...d, likes_count: d.likes_count + (isCurrentlyLiked ? -1 : 1) }
          : d
      )
    );

    // Update selected discussion if open
    if (selectedDiscussion?.id === discussion.id) {
      setSelectedDiscussion((prev) =>
        prev
          ? { ...prev, likes_count: prev.likes_count + (isCurrentlyLiked ? -1 : 1) }
          : null
      );
    }

    try {
      if (isCurrentlyLiked) {
        await supabase
          .from('discussion_likes')
          .delete()
          .eq('discussion_id', discussion.id)
          .eq('user_identifier', userIdentifier);

        await supabase
          .from('discussions')
          .update({ likes_count: discussion.likes_count - 1 })
          .eq('id', discussion.id);
      } else {
        await supabase.from('discussion_likes').insert({
          discussion_id: discussion.id,
          user_identifier: userIdentifier,
        });

        await supabase
          .from('discussions')
          .update({ likes_count: discussion.likes_count + 1 })
          .eq('id', discussion.id);
      }
    } catch (error) {
      // Revert on error
      setLikedDiscussions((prev) => {
        const newSet = new Set(prev);
        if (isCurrentlyLiked) {
          newSet.add(discussion.id);
        } else {
          newSet.delete(discussion.id);
        }
        return newSet;
      });
      setDiscussions((prev) =>
        prev.map((d) =>
          d.id === discussion.id
            ? { ...d, likes_count: discussion.likes_count }
            : d
        )
      );
      if (selectedDiscussion?.id === discussion.id) {
        setSelectedDiscussion((prev) =>
          prev
            ? { ...prev, likes_count: discussion.likes_count }
            : null
        );
      }
      toast.error('Failed to update like');
    }
  };

  const handleCreateDiscussion = async (title: string, body: string, authorName: string) => {
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('discussions')
        .insert({
          title,
          body,
          author_name: authorName,
        })
        .select()
        .single();

      if (error) throw error;
      
      setDiscussions((prev) => [data, ...prev]);
      toast.success('Discussion created successfully');
    } catch (error) {
      console.error('Error creating discussion:', error);
      toast.error('Something went wrong. Please try again.');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenDiscussion = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setIsDetailOpen(true);
  };

  const handleUpdateFromModal = () => {
    fetchDiscussions();
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    try {
      const { error } = await supabase
        .from('discussions')
        .update({ is_hidden: true })
        .eq('id', discussionId);

      if (error) throw error;
      
      setDiscussions((prev) => prev.filter((d) => d.id !== discussionId));
      toast.success('Discussion deleted');
    } catch (error) {
      console.error('Error deleting discussion:', error);
      toast.error('Failed to delete discussion');
      throw error;
    }
  };

  const displayedDiscussions = discussions.slice(0, displayCount);
  const hasMore = discussions.length > displayCount;

  return (
    <section className="mt-12">
      <Card className="p-6 bg-card border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-primary" />
              Stay in touch
            </h3>
            <p className="text-muted-foreground mt-1">
              Join the conversation with others in the rare disease community.
            </p>
          </div>
          <Button
            onClick={() => setIsNewDiscussionOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Start a discussion
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : discussions.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">
              No discussions yet. Be the first to start a conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedDiscussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                onClick={() => handleOpenDiscussion(discussion)}
                onLike={(e) => handleLikeDiscussion(discussion, e)}
                isLiked={likedDiscussions.has(discussion.id)}
              />
            ))}

            {hasMore && (
              <div className="text-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDisplayCount((prev) => prev + ITEMS_PER_PAGE)}
                  className="rounded-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Load more
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>

      <DiscussionModal
        discussion={selectedDiscussion}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedDiscussion(null);
        }}
        onLike={() => selectedDiscussion && handleLikeDiscussion(selectedDiscussion)}
        isLiked={selectedDiscussion ? likedDiscussions.has(selectedDiscussion.id) : false}
        onUpdate={handleUpdateFromModal}
        onDelete={handleDeleteDiscussion}
      />

      <NewDiscussionModal
        isOpen={isNewDiscussionOpen}
        onClose={() => setIsNewDiscussionOpen(false)}
        onSubmit={handleCreateDiscussion}
        isSubmitting={isCreating}
      />
    </section>
  );
};
