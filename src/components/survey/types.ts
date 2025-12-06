export interface SurveyFormData {
  // Demographics
  age_range: string;
  country: string;
  mother_tongue: string;
  mother_tongue_other: string;
  area_of_residence: string;
  
  // Disease-related
  disease_name: string;
  orpha_code: string;
  time_since_diagnosis: string;
  main_medical_followup: string;
  appointment_frequency: string;
  
  // Usage context
  discovery_source: string;
  main_needs: string[];
  main_device: string;
  tech_comfort: string;
  
  // Optional
  relationship_with_condition: string;
  has_other_chronic_conditions: string;
  patient_association_support: string;
}

export interface SurveySectionProps {
  formData: SurveyFormData;
  updateFormData: (field: keyof SurveyFormData, value: string | string[]) => void;
}

export const AGE_RANGES = [
  '0-12',
  '13-17',
  '18-24',
  '25-34',
  '35-44',
  '45-54',
  '55-64',
  '65+',
];

export const MOTHER_TONGUES = [
  'Portuguese',
  'English',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Chinese',
  'Hindi',
  'Russian',
  'Other',
];

export const AREAS_OF_RESIDENCE = ['Urban', 'Suburban', 'Rural'];

export const TIME_SINCE_DIAGNOSIS = [
  '< 1 year',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
  'Not diagnosed yet',
];

export const MEDICAL_FOLLOWUP = [
  'Family doctor',
  'Specialist',
  'Reference center',
  'Multiple specialists',
  'No regular follow-up',
];

export const APPOINTMENT_FREQUENCY = [
  'Weekly',
  'Monthly',
  'Quarterly',
  'Semi-annual',
  'Annual',
  'Irregular',
];

export const DISCOVERY_SOURCES = [
  'Health professional',
  'Social media',
  'Search engine',
  'Patient association',
  'Family/friend',
  'Other',
];

export const MAIN_NEEDS = [
  'Disease information',
  'Symptom management',
  'Contact with other patients',
  'Local resources',
  'Medical follow-up',
  'Personal organization (appointments, reports)',
  'Daily monitoring',
  'Other',
];

export const MAIN_DEVICES = ['Smartphone', 'Tablet', 'Computer'];

export const TECH_COMFORT = [
  'Very comfortable',
  'Comfortable',
  'Not very comfortable',
  'I need help',
];

export const RELATIONSHIP_OPTIONS = [
  'Patient',
  'Family / caregiver',
  'Health professional',
  'Other',
];

export const YES_NO_OPTIONS = ['Yes', 'No'];

export const ASSOCIATION_SUPPORT = ['Yes', 'No', "Don't know"];