-- Add columns to support multilingual and unified statistics
ALTER TABLE public.chat_disease_searches 
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en',
ADD COLUMN IF NOT EXISTS english_name TEXT;

-- Create index for orphacode searches (unified statistics)
CREATE INDEX IF NOT EXISTS idx_disease_searches_orphacode ON public.chat_disease_searches(orphacode);

-- Create index for language-based searches
CREATE INDEX IF NOT EXISTS idx_disease_searches_language ON public.chat_disease_searches(language);