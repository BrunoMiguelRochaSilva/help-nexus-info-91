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
    <section id="about" className="section-container relative z-10 py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
      <div className="absolute -left-20 top-40 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">{t('about.title')}</h2>
        <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="glass-card p-8 md:p-12 border-white/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-all duration-700 group-hover:bg-primary/20"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                {t('about.mission')}
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                {t('about.missionText')}
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Features Tier */}
        <div>
          <h3 className="text-2xl font-semibold mb-10 text-center text-foreground/80 tracking-wide uppercase text-sm">
            {t('about.features')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-panel h-full p-6 hover:shadow-glow hover:border-primary/30 transition-all duration-300 group">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                      <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-dark transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
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
