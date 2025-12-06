import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

interface HighlightsData {
  weeklyTrend: string;
  monthlyRating: number;
  recentActivity: number;
}

export const CommunityHighlights = () => {
  const { t } = useTranslation();
  const [highlights, setHighlights] = useState<HighlightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('dashboard-metrics');

        if (error) throw error;

        if (data?.highlights) {
          setHighlights({
            weeklyTrend: data.highlights.weeklyTrend > 0 
              ? `${data.highlights.weeklyTrend} ${t('dashboard.conversations') || 'conversations'}`
              : t('dashboard.noActivity') || 'No activity yet',
            monthlyRating: data.highlights.monthlyRating,
            recentActivity: data.highlights.recentActivity,
          });
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching highlights:', error);
        }
        setHighlights({
          weeklyTrend: t('dashboard.noActivity') || 'No activity yet',
          monthlyRating: 0,
          recentActivity: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlights();
  }, [t]);

  if (isLoading || !highlights) {
    return null;
  }

  return (
    <section className="section-container pb-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center text-foreground mb-8">
          {t('dashboard.communityHighlights') || 'Community Highlights'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Weekly Trend */}
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-light rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  {t('dashboard.weeklyTrend') || 'Most Searched This Week'}
                </h3>
                <p className="text-lg font-bold text-foreground truncate" title={highlights.weeklyTrend}>
                  {highlights.weeklyTrend}
                </p>
              </div>
            </div>
          </Card>

          {/* Monthly Rating */}
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-light rounded-lg">
                <Star className="w-6 h-6 text-primary" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  {t('dashboard.monthlyRating') || 'Average Rating This Month'}
                </h3>
                <p className="text-lg font-bold text-foreground">
                  {highlights.monthlyRating > 0 
                    ? `${highlights.monthlyRating.toFixed(1)} / 5 ⭐` 
                    : t('dashboard.noRatings') || 'No ratings yet'}
                </p>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 bg-card border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-light rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  {t('dashboard.recentActivity') || 'Conversations This Week'}
                </h3>
                <p className="text-lg font-bold text-foreground">
                  {highlights.recentActivity.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </section>
  );
};
