import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Send } from 'lucide-react';

interface NewReplyFormProps {
  onSubmit: (body: string, authorName: string) => Promise<void>;
  isSubmitting: boolean;
}

export const NewReplyForm = ({ onSubmit, isSubmitting }: NewReplyFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const [body, setBody] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!body.trim()) {
      setError('Please write a reply');
      return;
    }

    const name = isAuthenticated && user ? user.name : authorName.trim() || 'Anonymous';
    
    await onSubmit(body.trim(), name);
    setBody('');
    setAuthorName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Textarea
          placeholder="Share your thoughts or experience…"
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setError('');
          }}
          className="min-h-[80px] bg-background border-input text-foreground resize-none"
          aria-label="Reply content"
        />
      </div>

      {!isAuthenticated && (
        <div>
          <Label htmlFor="reply-author" className="text-sm text-muted-foreground">
            Your name (optional)
          </Label>
          <Input
            id="reply-author"
            type="text"
            placeholder="Anonymous"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="mt-1 bg-background border-input text-foreground"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !body.trim()}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Submit reply
          </span>
        )}
      </Button>
    </form>
  );
};
