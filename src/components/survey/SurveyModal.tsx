import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { SurveyDemographics } from './SurveyDemographics';
import { SurveyDisease } from './SurveyDisease';
import { SurveyUsage } from './SurveyUsage';
import { SurveyOptional } from './SurveyOptional';
import type { SurveyFormData } from './types';

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: SurveyFormData = {
  age_range: '',
  country: '',
  mother_tongue: '',
  mother_tongue_other: '',
  area_of_residence: '',
  disease_name: '',
  orpha_code: '',
  time_since_diagnosis: '',
  main_medical_followup: '',
  appointment_frequency: '',
  discovery_source: '',
  main_needs: [],
  main_device: '',
  tech_comfort: '',
  relationship_with_condition: '',
  has_other_chronic_conditions: '',
  patient_association_support: '',
};

export const SurveyModal = ({ isOpen, onClose }: SurveyModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<SurveyFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (field: keyof SurveyFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          age_range: formData.age_range || null,
          country: formData.country || null,
          mother_tongue: formData.mother_tongue || null,
          mother_tongue_other: formData.mother_tongue_other || null,
          area_of_residence: formData.area_of_residence || null,
          disease_name: formData.disease_name || null,
          orpha_code: formData.orpha_code || null,
          time_since_diagnosis: formData.time_since_diagnosis || null,
          main_medical_followup: formData.main_medical_followup || null,
          appointment_frequency: formData.appointment_frequency || null,
          discovery_source: formData.discovery_source || null,
          main_needs: formData.main_needs.length > 0 ? formData.main_needs : null,
          main_device: formData.main_device || null,
          tech_comfort: formData.tech_comfort || null,
          relationship_with_condition: formData.relationship_with_condition || null,
          has_other_chronic_conditions: formData.has_other_chronic_conditions || null,
          patient_association_support: formData.patient_association_support || null,
        });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: t('survey.thankYou') || 'Thank you!',
        description: t('survey.responseRecorded') || 'Your response has been recorded anonymously.',
      });
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: t('survey.error') || 'Error',
        description: t('survey.errorMessage') || 'Failed to submit survey. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop with Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-background/60 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.5, type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl max-h-[85vh] glass-panel rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-white/40 dark:border-white/10"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-white/20 bg-white/40 dark:bg-black/20 backdrop-blur-xl">
            <div>
              <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                Tell us more about you
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Help us improve Rare Help for everyone</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2.5 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors group"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white/30 dark:bg-black/10">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center h-full"
              >
                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-12 h-12 text-success" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Thank you for your response!
                </h3>
                <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                  Your anonymous feedback helps us understand the needs of people with rare diseases and improve our support.
                </p>
                <Button onClick={handleClose} size="lg" className="mt-8 rounded-full px-8 btn-primary">
                  Close Window
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-sm text-foreground/80 bg-primary/5 border border-primary/10 p-4 rounded-xl flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <p>
                    Your answers are anonymous and will only be used to improve Rare Help for people living with rare diseases. Please do not include names, phone numbers, or other personal identifiers.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="bg-white/40 dark:bg-black/20 rounded-xl p-6 border border-white/20">
                    <SurveyDemographics formData={formData} updateFormData={updateFormData} />
                  </div>
                  <div className="bg-white/40 dark:bg-black/20 rounded-xl p-6 border border-white/20">
                    <SurveyDisease formData={formData} updateFormData={updateFormData} />
                  </div>
                  <div className="bg-white/40 dark:bg-black/20 rounded-xl p-6 border border-white/20">
                    <SurveyUsage formData={formData} updateFormData={updateFormData} />
                  </div>
                  <div className="bg-white/40 dark:bg-black/20 rounded-xl p-6 border border-white/20">
                    <SurveyOptional formData={formData} updateFormData={updateFormData} />
                  </div>
                </div>

                {/* Sticky Footer for Submit */}
                <div className="sticky bottom-0 -mx-8 -mb-8 p-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-white/20 flex justify-end">
                  <Button
                    type="submit"
                    className="w-full md:w-auto min-w-[200px] btn-primary shadow-lg shadow-primary/25"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};