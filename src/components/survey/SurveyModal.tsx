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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-card rounded-lg shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border bg-card">
            <h2 className="text-xl font-semibold text-foreground">
              {t('survey.title') || 'Tell us more about you'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <CheckCircle className="w-16 h-16 text-success mb-4" />
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {t('survey.thankYouTitle') || 'Thank you for your response!'}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {t('survey.thankYouMessage') || 
                    'Your anonymous feedback helps us understand the needs of people with rare diseases and improve our support.'}
                </p>
                <Button onClick={handleClose} className="mt-6">
                  {t('survey.close') || 'Close'}
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  {t('survey.anonymousNote') || 
                    'This survey is completely anonymous. We do not collect names, emails, or any personally identifiable information.'}
                </p>

                <SurveyDemographics formData={formData} updateFormData={updateFormData} />
                <SurveyDisease formData={formData} updateFormData={updateFormData} />
                <SurveyUsage formData={formData} updateFormData={updateFormData} />
                <SurveyOptional formData={formData} updateFormData={updateFormData} />

                {/* Submit Button */}
                <div className="pt-4 border-t border-border">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting 
                      ? (t('survey.submitting') || 'Submitting...') 
                      : (t('survey.submit') || 'Submit Survey')}
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