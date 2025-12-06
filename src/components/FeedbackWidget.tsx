import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';

const feedbackSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().trim().max(500, 'Comment must be less than 500 characters'),
  interaction_id: z.number().int().positive('Invalid interaction ID')
});

interface FeedbackWidgetProps {
  interactionId: number;
}

export const FeedbackWidget = ({ interactionId }: FeedbackWidgetProps) => {
  const { t } = useTranslation();
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      // Validate input
      const validated = feedbackSchema.parse({
        rating,
        comment,
        interaction_id: interactionId
      });

      // Submit via edge function with server-side rate limiting
      const { data, error } = await supabase.functions.invoke('submit-feedback', {
        body: {
          interactionId: validated.interaction_id,
          rating: validated.rating,
          comment: validated.comment || null
        }
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      toast.success(t('feedback.success'));
      setSubmitted(true);
      setShowFeedback(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error && error.message.includes('429')) {
        toast.error('Please wait before submitting another feedback');
      } else {
        toast.error('Failed to submit feedback');
      }
      
      // Log only in development
      if (import.meta.env.DEV) {
        console.error('Error submitting feedback:', error);
      }
    }
  };

  if (submitted) {
    return (
      <div className="text-xs text-success mt-2">
        ✓ {t('feedback.success')}
      </div>
    );
  }

  return (
    <div className="mt-2">
      {!showFeedback ? (
        <button
          onClick={() => setShowFeedback(true)}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {t('feedback.title')}
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-lg p-3 mt-2 space-y-2"
          >
            <p className="text-xs font-medium">{t('feedback.rating')}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            <Textarea
              placeholder={t('feedback.comment')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-sm"
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSubmit} className="bg-primary hover:bg-primary-dark text-white rounded-md">
                {t('feedback.submit')}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowFeedback(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
