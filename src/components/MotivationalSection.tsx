import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import supportImg from '@/assets/dashboard-support.jpg';
import communityImg from '@/assets/dashboard-community.jpg';
import hopeImg from '@/assets/dashboard-hope.jpg';

export const MotivationalSection = () => {
  const { t, i18n } = useTranslation();
  const { settings } = useAccessibility();
  const plugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const isDarkBg = settings.colorScheme === 'dark-bg';
  const textColor = isDarkBg ? 'hsl(0 0% 95%)' : 'hsl(222.2 47.4% 11.2%)';
  const mutedTextColor = isDarkBg ? 'hsl(0 0% 80%)' : 'hsl(215.4 16.3% 46.9%)';

  const slides = i18n.language === 'pt'
    ? [
        {
          image: supportImg,
          message: 'Não estás sozinho.',
          description: 'Milhares de pessoas partilham experiências semelhantes todos os dias.',
        },
        {
          image: communityImg,
          message: 'Há outros nesta jornada contigo.',
          description: 'Uma comunidade unida por empatia, compreensão e apoio.',
        },
        {
          image: hopeImg,
          message: 'A tua voz importa.',
          description: 'Cada história partilhada fortalece a nossa comunidade.',
        },
      ]
    : [
        {
          image: supportImg,
          message: 'You are not alone.',
          description: 'Thousands of people share similar experiences every day.',
        },
        {
          image: communityImg,
          message: 'There are others on this journey with you.',
          description: 'A community united by empathy, understanding, and support.',
        },
        {
          image: hopeImg,
          message: 'Your voice matters.',
          description: 'Every story shared strengthens our community.',
        },
      ];

  return (
    <section className="section-container py-8 pb-12">
      <div className="max-w-6xl mx-auto">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={() => plugin.current.stop()}
          onMouseLeave={() => plugin.current.play()}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <div className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-elegant transition-all duration-300 h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={slide.image}
                        alt=""
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 motivational-text">
                      <h3 className="text-xl font-semibold mb-2 leading-snug" style={{ color: textColor }}>
                        {slide.message}
                      </h3>
                      <p className="leading-relaxed" style={{ color: mutedTextColor }}>
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 mt-6">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};
