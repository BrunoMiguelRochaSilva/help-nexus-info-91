import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DISCOVERY_SOURCES,
  MAIN_NEEDS,
  MAIN_DEVICES,
  TECH_COMFORT,
  type SurveySectionProps,
} from './types';

export const SurveyUsage = ({ formData, updateFormData }: SurveySectionProps) => {
  const { t } = useTranslation();

  const handleNeedToggle = (need: string) => {
    const currentNeeds = formData.main_needs;
    if (currentNeeds.includes(need)) {
      updateFormData('main_needs', currentNeeds.filter((n) => n !== need));
    } else {
      updateFormData('main_needs', [...currentNeeds, need]);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
        {t('survey.usageContext') || 'Usage Context'}
      </h3>

      {/* Discovery Source */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.discoverySource') || 'How did you discover the app?'}
        </Label>
        <RadioGroup
          value={formData.discovery_source}
          onValueChange={(value) => updateFormData('discovery_source', value)}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {DISCOVERY_SOURCES.map((source) => (
            <div key={source} className="flex items-center space-x-2">
              <RadioGroupItem value={source} id={`source-${source}`} />
              <Label htmlFor={`source-${source}`} className="cursor-pointer text-sm">
                {source}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Main Needs - Multiple Choice */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.mainNeeds') || 'Main Needs (Select all that apply)'}
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MAIN_NEEDS.map((need) => (
            <div key={need} className="flex items-center space-x-2">
              <Checkbox
                id={`need-${need}`}
                checked={formData.main_needs.includes(need)}
                onCheckedChange={() => handleNeedToggle(need)}
              />
              <Label htmlFor={`need-${need}`} className="cursor-pointer text-sm">
                {need}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Main Device */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.mainDevice') || 'Main Device'}
        </Label>
        <RadioGroup
          value={formData.main_device}
          onValueChange={(value) => updateFormData('main_device', value)}
          className="flex flex-wrap gap-4"
        >
          {MAIN_DEVICES.map((device) => (
            <div key={device} className="flex items-center space-x-2">
              <RadioGroupItem value={device} id={`device-${device}`} />
              <Label htmlFor={`device-${device}`} className="cursor-pointer">
                {device}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Tech Comfort */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.techComfort') || 'Comfort with Technology'}
        </Label>
        <RadioGroup
          value={formData.tech_comfort}
          onValueChange={(value) => updateFormData('tech_comfort', value)}
          className="grid grid-cols-2 gap-2"
        >
          {TECH_COMFORT.map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem value={level} id={`tech-${level}`} />
              <Label htmlFor={`tech-${level}`} className="cursor-pointer text-sm">
                {level}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};