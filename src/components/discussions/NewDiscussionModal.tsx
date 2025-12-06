import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';

interface NewDiscussionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, body: string, authorName: string) => Promise<void>;
  isSubmitting: boolean;
}

export const NewDiscussionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: NewDiscussionModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const resetForm = () => {
    setTitle('');
    setBody('');
    setAuthorName('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validate = (): boolean => {
    const newErrors: { title?: string; body?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!body.trim()) {
      newErrors.body = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    const name = isAuthenticated && user ? user.name : authorName.trim() || 'Anonymous';
    
    await onSubmit(title.trim(), body.trim(), name);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Start a discussion
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="discussion-title" className="text-foreground">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="discussion-title"
              type="text"
              placeholder="Example: Struggling to get a diagnosis for my child"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className="bg-background border-input text-foreground"
              aria-required="true"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="discussion-body" className="text-foreground">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="discussion-body"
              placeholder="Share your story, questions, or tips. Please avoid sharing personal contact details."
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setErrors((prev) => ({ ...prev, body: undefined }));
              }}
              className="min-h-[120px] bg-background border-input text-foreground resize-none"
              aria-required="true"
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body}</p>
            )}
          </div>

          {!isAuthenticated && (
            <div className="space-y-2">
              <Label htmlFor="discussion-author" className="text-foreground">
                Your name (optional)
              </Label>
              <Input
                id="discussion-author"
                type="text"
                placeholder="Anonymous"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="bg-background border-input text-foreground"
              />
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Please be respectful and supportive. Avoid sharing personal contact information like emails, phone numbers, or addresses.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                'Create discussion'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
