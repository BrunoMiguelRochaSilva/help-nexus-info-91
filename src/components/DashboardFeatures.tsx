import { Heart, Users, BookOpen, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export const DashboardFeatures = () => {
  const { settings } = useAccessibility();
  const isDarkBg = settings.colorScheme === 'dark-bg';
  const textColor = isDarkBg ? 'hsl(0 0% 95%)' : 'hsl(222.2 47.4% 11.2%)';
  const mutedTextColor = isDarkBg ? 'hsl(0 0% 80%)' : 'hsl(215.4 16.3% 46.9%)';

  const features = [
    {
      icon: Heart,
      title: 'Expert Support',
      description: 'Personalized assistance from rare disease specialists with deep knowledge and clinical experience.'
    },
    {
      icon: Users,
      title: 'Global Community',
      description: 'Connect with other families and patients facing similar challenges around the world.'
    },
    {
      icon: BookOpen,
      title: 'Trusted Resources',
      description: 'Access up-to-date medical information, clinical trials, and evidence-based treatment options.'
    },
    {
      icon: Shield,
      title: 'Confidential & Secure',
      description: 'Your information is protected with the highest standards of healthcare data security and privacy.'
    }
  ];

  return (
    <section className="section-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="card-medical card-scalable-text h-full">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: textColor }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: mutedTextColor }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
