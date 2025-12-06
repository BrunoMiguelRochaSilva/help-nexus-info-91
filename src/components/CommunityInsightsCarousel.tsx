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
import supportImg from '@/assets/dashboard-support.jpg';
import communityImg from '@/assets/dashboard-community.jpg';
import hopeImg from '@/assets/dashboard-hope.jpg';

export const CommunityInsightsCarousel = () => {
  const { t, i18n } = useTranslation();
  const plugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

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
    <section className="section-container py-12 md:py-20 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {i18n.language === 'pt' ? 'Insights da Comunidade Rare Help' : 'Rare Help Community Insights'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            {i18n.language === 'pt'
              ? 'Não estás sozinho. Há outros nesta jornada contigo. A tua voz importa.'
              : 'You are not alone. There are others on this journey with you. Your voice matters.'}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>{i18n.language === 'pt' ? 'Comunidade Ativa' : 'Community Activity'}</span>
          </div>
        </motion.div>

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
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <img
                        src={slide.image}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="text-xl md:text-2xl font-semibold text-foreground leading-tight">
                        {slide.message}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="left-0 -translate-x-12" />
            <CarouselNext className="right-0 translate-x-12" />
          </div>
        </Carousel>

        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Carousel navigation">
          {slides.map((_, index) => (
            <button
              key={index}
              className="w-2 h-2 rounded-full bg-muted hover:bg-primary transition-colors duration-300"
              aria-label={`Go to slide ${index + 1}`}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
