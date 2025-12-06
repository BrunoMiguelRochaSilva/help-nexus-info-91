import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  RELATIONSHIP_OPTIONS,
  YES_NO_OPTIONS,
  ASSOCIATION_SUPPORT,
  type SurveySectionProps,
} from './types';

export const SurveyOptional = ({ formData, updateFormData }: SurveySectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
        {t('survey.optional') || 'Optional Information'}
      </h3>

      {/* Relationship with Condition */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.relationship') || 'Your relationship with the condition'}
        </Label>
        <RadioGroup
          value={formData.relationship_with_condition}
          onValueChange={(value) => updateFormData('relationship_with_condition', value)}
          className="flex flex-wrap gap-4"
        >
          {RELATIONSHIP_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`rel-${option}`} />
              <Label htmlFor={`rel-${option}`} className="cursor-pointer text-sm">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Other Chronic Conditions */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.otherConditions') || 'Do you have other chronic conditions?'}
        </Label>
        <RadioGroup
          value={formData.has_other_chronic_conditions}
          onValueChange={(value) => updateFormData('has_other_chronic_conditions', value)}
          className="flex gap-6"
        >
          {YES_NO_OPTIONS.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`chronic-${option}`} />
              <Label htmlFor={`chronic-${option}`} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Patient Association Support */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.associationSupport') || 'Do you receive support from a patient association?'}
        </Label>
        <RadioGroup
          value={formData.patient_association_support}
          onValueChange={(value) => updateFormData('patient_association_support', value)}
          className="flex flex-wrap gap-4"
        >
          {ASSOCIATION_SUPPORT.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`assoc-${option}`} />
              <Label htmlFor={`assoc-${option}`} className="cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
