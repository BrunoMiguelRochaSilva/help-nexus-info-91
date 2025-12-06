import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageSquare, ChevronRight, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface FeedbackItem {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user_id: string | null;
  full_name: string | null;
}

export const RecentFeedback = () => {
  const { t } = useTranslation();
  const { settings } = useAccessibility();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const isDarkBg = settings.colorScheme === 'dark-bg';
  const textColor = isDarkBg ? 'hsl(0 0% 95%)' : 'hsl(222.2 47.4% 11.2%)';
  const mutedTextColor = isDarkBg ? 'hsl(0 0% 80%)' : 'hsl(215.4 16.3% 46.9%)';

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select(`
            id,
            rating,
            comment,
            created_at,
            user_id,
            profiles:user_id (full_name)
          `)
          .not('comment', 'is', null)
          .neq('comment', '')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        const formattedData = data?.map(item => ({
          id: item.id,
          rating: item.rating,
          comment: item.comment,
          created_at: item.created_at,
          user_id: item.user_id,
          full_name: (item.profiles as any)?.full_name || null
        })) || [];

        setFeedback(formattedData);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        setFeedback([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const displayedFeedback = showAll ? feedback : feedback.slice(0, 3);

  const getInitials = (name: string | null) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <section className="section-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (feedback.length === 0) {
    return null;
  }

  return (
    <section className="section-container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <MessageSquare className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold" style={{ color: textColor }}>
            {t('dashboard.recentFeedback') || 'Community Voices'}
          </h2>
        </div>

        <div className="space-y-6">
          {displayedFeedback.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex gap-4 pb-6 border-b border-border last:border-0"
            >
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarFallback className="bg-primary-light text-primary font-semibold">
                  {getInitials(item.full_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold" style={{ color: textColor }}>
                    {item.full_name || 'Anonymous'}
                  </span>
                  <span className="text-sm" style={{ color: mutedTextColor }}>
                    •
                  </span>
                  <span className="text-sm" style={{ color: mutedTextColor }}>
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </span>
                  <div className="flex items-center gap-1 ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < item.rating
                            ? 'text-primary fill-primary'
                            : 'text-muted stroke-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="leading-relaxed" style={{ color: textColor }}>
                  {item.comment}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {feedback.length > 3 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="gap-2"
            >
              {showAll ? 'Show Less' : 'View All Feedback'}
              <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
