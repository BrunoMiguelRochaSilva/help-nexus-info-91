import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BarChart3, Activity, Stethoscope, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

type MetricType = 'main_needs' | 'main_medical_followup' | 'disease_name' | 'appointment_frequency';

interface ChartData {
  name: string;
  value: number;
}

const COLORS = [
  'hsl(210, 100%, 45%)',
  'hsl(145, 60%, 45%)',
  'hsl(30, 100%, 50%)',
  'hsl(280, 70%, 50%)',
  'hsl(0, 65%, 50%)',
  'hsl(180, 60%, 45%)',
  'hsl(60, 70%, 45%)',
  'hsl(330, 70%, 50%)',
];

export const SurveyAnalytics = () => {
  const { t } = useTranslation();
  const { settings } = useAccessibility();
  const [activeMetric, setActiveMetric] = useState<MetricType>('main_needs');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalResponses, setTotalResponses] = useState(0);

  const isDarkBg = settings.colorScheme === 'dark-bg';
  const textColor = isDarkBg ? 'hsl(0 0% 95%)' : 'hsl(222.2 47.4% 11.2%)';

  const metrics = [
    { id: 'main_needs' as MetricType, label: 'Main Needs', icon: BarChart3 },
    { id: 'main_medical_followup' as MetricType, label: 'Medical Follow-up', icon: Stethoscope },
    { id: 'disease_name' as MetricType, label: 'Top Searched Diseases', icon: Search },
    { id: 'appointment_frequency' as MetricType, label: 'Medical Monitoring', icon: Activity },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data, error, count } = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact' });

        if (error) throw error;

        setTotalResponses(count || 0);

        if (!data || data.length === 0) {
          setChartData([]);
          return;
        }

        let aggregatedData: Record<string, number> = {};

        if (activeMetric === 'main_needs') {
          // Aggregate array field
          data.forEach((row) => {
            const needs = row.main_needs as string[] | null;
            if (needs) {
              needs.forEach((need) => {
                aggregatedData[need] = (aggregatedData[need] || 0) + 1;
              });
            }
          });
        } else if (activeMetric === 'disease_name') {
          // Aggregate disease names (filter out empty)
          data.forEach((row) => {
            const disease = row.disease_name;
            if (disease && disease.trim()) {
              const normalized = disease.trim().toLowerCase();
              aggregatedData[normalized] = (aggregatedData[normalized] || 0) + 1;
            }
          });
        } else {
          // Aggregate single choice fields
          data.forEach((row) => {
            const value = row[activeMetric] as string | null;
            if (value) {
              aggregatedData[value] = (aggregatedData[value] || 0) + 1;
            }
          });
        }

        // Convert to chart data and sort by value
        const chartDataArray: ChartData[] = Object.entries(aggregatedData)
          .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10); // Top 10

        setChartData(chartDataArray);
      } catch (error) {
        console.error('Error fetching survey data:', error);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('survey-analytics')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'survey_responses' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeMetric]);

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
          <p>{t('dashboard.noData') || 'No survey data available yet'}</p>
          <p className="text-sm mt-2">{t('dashboard.submitSurvey') || 'Submit a survey to see analytics'}</p>
        </div>
      );
    }

    // Use pie chart for smaller datasets, bar chart for larger
    if (chartData.length <= 6 && activeMetric !== 'main_needs') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDarkBg ? 'hsl(0 0% 15%)' : 'white',
                borderColor: isDarkBg ? 'hsl(0 0% 30%)' : 'hsl(220 13% 91%)',
                color: textColor,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkBg ? 'hsl(0 0% 30%)' : 'hsl(220 13% 91%)'} />
          <XAxis type="number" stroke={isDarkBg ? 'hsl(0 0% 80%)' : 'hsl(220 9% 46%)'} />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            stroke={isDarkBg ? 'hsl(0 0% 80%)' : 'hsl(220 9% 46%)'}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkBg ? 'hsl(0 0% 15%)' : 'white',
              borderColor: isDarkBg ? 'hsl(0 0% 30%)' : 'hsl(220 13% 91%)',
              color: textColor,
            }}
          />
          <Bar dataKey="value" fill="hsl(210, 100%, 45%)" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <section className="section-container relative z-10 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                See what people are searching
              </h2>
            </div>
            <div className="px-4 py-2 rounded-full glass-panel border-primary/20 bg-primary/5">
              <span className="text-sm font-medium text-primary-dark">
                <span className="font-bold">{totalResponses}</span> {t('dashboard.responses') || 'responses'}
              </span>
            </div>
          </div>

          {/* Metric Selector */}
          <div className="flex flex-wrap gap-3 mb-8 px-2">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              const isActive = activeMetric === metric.id;
              return (
                <button
                  key={metric.id}
                  onClick={() => setActiveMetric(metric.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                    : 'glass-panel hover:bg-white/60 dark:hover:bg-white/10 hover:border-primary/30 text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary'}`} />
                  {metric.label}
                </button>
              );
            })}
          </div>

          {/* Chart */}
          <div className="glass-card p-6 md:p-8 border-white/40 dark:border-white/10">
            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-10 w-64 bg-primary/10" />
                <Skeleton className="h-[350px] w-full bg-primary/5 rounded-xl" />
              </div>
            ) : (
              <div className="min-h-[350px] w-full">
                {renderChart()}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};