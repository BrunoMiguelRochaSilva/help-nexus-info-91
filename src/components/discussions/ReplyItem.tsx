import React, { useState } from 'react';
import { Heart, Clock, Pencil, Trash2, X, Check } from 'lucide-react';
import { Reply } from './types';
import { getRelativeTime } from './utils';
import { UserNameWithMessage } from '@/components/messaging';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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

interface ReplyItemProps {
  reply: Reply;
  onLike: () => void;
  isLiked: boolean;
  onEdit?: (replyId: string, newBody: string) => Promise<void>;
  onDelete?: (replyId: string) => Promise<void>;
}

export const ReplyItem = ({ reply, onLike, isLiked, onEdit, onDelete }: ReplyItemProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(reply.body);
  const [isSaving, setIsSaving] = useState(false);

  const isAuthor = isAuthenticated && user?.name === reply.author_name;

  const handleSaveEdit = async () => {
    if (!editBody.trim() || !onEdit) return;
    setIsSaving(true);
    try {
      await onEdit(reply.id, editBody.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save edit:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete(reply.id);
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="p-4 border-b border-border last:border-b-0">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            className="min-h-[60px] bg-background border-input text-foreground resize-none"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={isSaving || !editBody.trim()}
              className="rounded-full"
            >
              <Check className="h-3 w-3 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditBody(reply.body);
              }}
              className="rounded-full"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-foreground whitespace-pre-wrap">{reply.body}</p>
      )}
      
      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
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
          
          {isAuthor && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 transition-colors hover:text-primary"
                aria-label="Edit reply"
              >
                <Pencil className="h-3 w-3" />
                Edit
              </button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="flex items-center gap-1 transition-colors hover:text-destructive"
                    aria-label="Delete reply"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this reply? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
        
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
