import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export const DashboardSeparator = () => {
  return (
    <div className="section-container py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 max-w-5xl mx-auto"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex items-center gap-2 px-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Community Activity</h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </motion.div>
    </div>
  );
};
