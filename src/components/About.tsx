import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Clock, Library, Globe2, Accessibility } from 'lucide-react';
import { motion } from 'framer-motion';

export const About = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Clock,
      title: t('about.feature1'),
      description: 'Round-the-clock access to information and support resources'
    },
    {
      icon: Library,
      title: t('about.feature2'),
      description: 'Carefully selected and verified medical content from trusted sources'
    },
    {
      icon: Globe2,
      title: t('about.feature3'),
      description: 'Available in multiple languages to serve diverse communities'
    },
    {
      icon: Accessibility,
      title: t('about.feature4'),
      description: 'Built with accessibility features for all users'
    }
  ];

  return (
    <section id="about" className="section-container bg-background">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-2 text-foreground">{t('about.title')}</h2>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="card-medical shadow-card">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">{t('about.mission')}</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.missionText')}
            </p>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div>
          <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
            {t('about.features')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                 <Card className="card-medical h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-md flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-2 text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
