import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  TIME_SINCE_DIAGNOSIS,
  MEDICAL_FOLLOWUP,
  APPOINTMENT_FREQUENCY,
  type SurveySectionProps,
} from './types';

export const SurveyDisease = ({ formData, updateFormData }: SurveySectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
        About your condition
      </h3>

      {/* Disease Name */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Disease Name (Optional)
        </Label>
        <Input
          placeholder="e.g., Cystic fibrosis (optional)"
          value={formData.disease_name}
          onChange={(e) => updateFormData('disease_name', e.target.value)}
        />
      </div>

      {/* ORPHA Code */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          ORPHA Code (Optional)
        </Label>
        <Input
          placeholder="e.g., ORPHA1234 (optional)"
          value={formData.orpha_code}
          onChange={(e) => updateFormData('orpha_code', e.target.value)}
        />
      </div>

      {/* Time Since Diagnosis */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Time Since Diagnosis
        </Label>
        <RadioGroup
          value={formData.time_since_diagnosis}
          onValueChange={(value) => updateFormData('time_since_diagnosis', value)}
          className="flex flex-col space-y-2"
        >
          {TIME_SINCE_DIAGNOSIS.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <RadioGroupItem value={time} id={`time-${time}`} />
              <Label htmlFor={`time-${time}`} className="cursor-pointer">
                {time}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Main Medical Follow-up */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Main Medical Follow-up
        </Label>
        <RadioGroup
          value={formData.main_medical_followup}
          onValueChange={(value) => updateFormData('main_medical_followup', value)}
          className="flex flex-col space-y-2"
        >
          {MEDICAL_FOLLOWUP.map((followup) => (
            <div key={followup} className="flex items-center space-x-2">
              <RadioGroupItem value={followup} id={`followup-${followup}`} />
              <Label htmlFor={`followup-${followup}`} className="cursor-pointer">
                {followup}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Appointment Frequency */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          Frequency of Medical Appointments
        </Label>
        <RadioGroup
          value={formData.appointment_frequency}
          onValueChange={(value) => updateFormData('appointment_frequency', value)}
          className="flex flex-col space-y-2"
        >
          {APPOINTMENT_FREQUENCY.map((freq) => (
            <div key={freq} className="flex items-center space-x-2">
              <RadioGroupItem value={freq} id={`freq-${freq}`} />
              <Label htmlFor={`freq-${freq}`} className="cursor-pointer">
                {freq}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};