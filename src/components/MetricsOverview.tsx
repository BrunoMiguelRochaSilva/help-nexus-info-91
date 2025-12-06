import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Activity, Globe, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface MetricsData {
  totalUsers: number;
  totalInteractions: number;
  mostSearchedDisease: string;
  mostActiveCountry: string;
  averageRating: number;
}

export const MetricsOverview = () => {
  const { t } = useTranslation();
  const { settings } = useAccessibility();
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isDarkBg = settings.colorScheme === 'dark-bg';
  const textColor = isDarkBg ? 'hsl(0 0% 95%)' : 'hsl(222.2 47.4% 11.2%)';
  const mutedTextColor = isDarkBg ? 'hsl(0 0% 80%)' : 'hsl(215.4 16.3% 46.9%)';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('dashboard-metrics');

        if (error) throw error;

        if (data?.metrics) {
          setMetrics(data.metrics);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching metrics:', error);
        }
        // Set placeholder data on error
        setMetrics({
          totalUsers: 0,
          totalInteractions: 0,
          mostSearchedDisease: 'General Health',
          mostActiveCountry: 'Worldwide',
          averageRating: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section-container">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
      >
        {/* Total Users */}
        <motion.div variants={itemVariants}>
          <div className="group relative bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-light rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: mutedTextColor }}>
                  {t('dashboard.totalUsers') || 'Total Users'}
                </p>
                <p className="text-4xl font-bold" style={{ color: textColor }}>
                  {metrics?.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Conversations */}
        <motion.div variants={itemVariants}>
          <div className="group relative bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-light rounded-lg">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: mutedTextColor }}>
                  {t('dashboard.totalConversations') || 'Total Conversations'}
                </p>
                <p className="text-4xl font-bold" style={{ color: textColor }}>
                  {metrics?.totalInteractions.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Most Searched Condition */}
        <motion.div variants={itemVariants}>
          <div className="group relative bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-light rounded-lg">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-2" style={{ color: mutedTextColor }}>
                  {t('dashboard.mostSearched') || 'Most Searched'}
                </p>
                <p className="text-2xl font-bold truncate" style={{ color: textColor }} title={metrics?.mostSearchedDisease}>
                  {metrics?.mostSearchedDisease}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Most Active Country */}
        <motion.div variants={itemVariants}>
          <div className="group relative bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-light rounded-lg">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: mutedTextColor }}>
                  {t('dashboard.mostActive') || 'Most Active Country'}
                </p>
                <p className="text-3xl font-bold" style={{ color: textColor }}>
                  {metrics?.mostActiveCountry}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Average Rating */}
        <motion.div variants={itemVariants}>
          <div className="group relative bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary-light rounded-lg">
                  <Star className="w-6 h-6 text-primary" fill="currentColor" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: mutedTextColor }}>
                  {t('dashboard.avgRating') || 'Average Rating'}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-bold" style={{ color: textColor }}>
                    {metrics?.averageRating > 0 ? metrics.averageRating.toFixed(1) : 'N/A'}
                  </p>
                  {metrics?.averageRating > 0 && <span className="text-2xl">⭐</span>}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
