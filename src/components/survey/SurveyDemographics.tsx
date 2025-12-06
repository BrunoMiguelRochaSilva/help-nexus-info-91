import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES } from './countries';
import {
  AGE_RANGES,
  MOTHER_TONGUES,
  AREAS_OF_RESIDENCE,
  type SurveySectionProps,
} from './types';

export const SurveyDemographics = ({ formData, updateFormData }: SurveySectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
        {t('survey.demographics') || 'Demographics (Anonymous)'}
      </h3>

      {/* Age Range */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.ageRange') || 'Age Range'}
        </Label>
        <RadioGroup
          value={formData.age_range}
          onValueChange={(value) => updateFormData('age_range', value)}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        >
          {AGE_RANGES.map((range) => (
            <div key={range} className="flex items-center space-x-2">
              <RadioGroupItem value={range} id={`age-${range}`} />
              <Label htmlFor={`age-${range}`} className="cursor-pointer">
                {range}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Country */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.country') || 'Country of Origin'}
        </Label>
        <Select
          value={formData.country}
          onValueChange={(value) => updateFormData('country', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('survey.selectCountry') || 'Select a country'} />
          </SelectTrigger>
          <SelectContent className="max-h-60 bg-card">
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mother Tongue */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.motherTongue') || 'Mother Tongue'}
        </Label>
        <RadioGroup
          value={formData.mother_tongue}
          onValueChange={(value) => updateFormData('mother_tongue', value)}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
        >
          {MOTHER_TONGUES.map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <RadioGroupItem value={lang} id={`lang-${lang}`} />
              <Label htmlFor={`lang-${lang}`} className="cursor-pointer">
                {lang}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {formData.mother_tongue === 'Other' && (
          <Input
            placeholder={t('survey.specifyLanguage') || 'Please specify...'}
            value={formData.mother_tongue_other}
            onChange={(e) => updateFormData('mother_tongue_other', e.target.value)}
            className="mt-2"
          />
        )}
      </div>

      {/* Area of Residence */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          {t('survey.areaOfResidence') || 'Area of Residence'}
        </Label>
        <RadioGroup
          value={formData.area_of_residence}
          onValueChange={(value) => updateFormData('area_of_residence', value)}
          className="flex flex-wrap gap-4"
        >
          {AREAS_OF_RESIDENCE.map((area) => (
            <div key={area} className="flex items-center space-x-2">
              <RadioGroupItem value={area} id={`area-${area}`} />
              <Label htmlFor={`area-${area}`} className="cursor-pointer">
                {area}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};