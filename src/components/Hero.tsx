import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero = () => {
  const { t } = useTranslation();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-primary-light to-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </div>

      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 text-foreground">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-normal text-foreground/80 mb-3">
            {t('hero.subtitle')}
          </p>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <Button
              onClick={() => scrollToSection('chat')}
              size="lg"
              className="bg-primary text-white font-medium px-8 py-3 text-base rounded-md shadow-sm hover:bg-primary-dark transition-colors"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('hero.cta')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
