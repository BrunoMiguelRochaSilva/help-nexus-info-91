import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export const DashboardHeader = () => {
  const { t } = useTranslation();
  const { settings } = useAccessibility();

  const isDarkBg = settings.colorScheme === 'dark-bg';
  const textColor = isDarkBg ? 'hsl(0 0% 95%)' : 'hsl(222.2 47.4% 11.2%)';

  return (
    <section className="section-container text-center pt-16 pb-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight" style={{ color: textColor }}>
          {t('dashboard.title') || 'Rare Help Community Insights'}
        </h1>
      </motion.div>
    </section>
  );
};
