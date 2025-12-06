-- Create survey_responses table for anonymous survey data
CREATE TABLE public.survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Demographic (anonymous)
  age_range TEXT,
  country TEXT,
  mother_tongue TEXT,
  mother_tongue_other TEXT,
  area_of_residence TEXT,
  
  -- Disease-related
  disease_name TEXT,
  orpha_code TEXT,
  time_since_diagnosis TEXT,
  main_medical_followup TEXT,
  appointment_frequency TEXT,
  
  -- Usage context
  discovery_source TEXT,
  main_needs TEXT[], -- Array for multiple choice
  main_device TEXT,
  tech_comfort TEXT,
  
  -- Optional
  relationship_with_condition TEXT,
  has_other_chronic_conditions TEXT,
  patient_association_support TEXT
);

-- Enable Row Level Security
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous inserts (anyone can submit)
CREATE POLICY "Anyone can submit anonymous survey" 
ON public.survey_responses 
FOR INSERT 
WITH CHECK (true);

-- Create policy for reading aggregated data (public for dashboard)
CREATE POLICY "Anyone can read survey responses for analytics" 
ON public.survey_responses 
FOR SELECT 
USING (true);

-- Enable realtime for dashboard updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.survey_responses;