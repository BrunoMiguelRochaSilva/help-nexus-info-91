-- Create table to track disease searches from chat
CREATE TABLE IF NOT EXISTS public.chat_disease_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disease_name TEXT NOT NULL,
  normalized_name TEXT NOT NULL,
  orphacode TEXT,
  anonymous_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster aggregation queries
CREATE INDEX IF NOT EXISTS idx_chat_disease_searches_normalized_name ON public.chat_disease_searches(normalized_name);
CREATE INDEX IF NOT EXISTS idx_chat_disease_searches_created_at ON public.chat_disease_searches(created_at);

-- Enable Row Level Security
ALTER TABLE public.chat_disease_searches ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from proxy server)
CREATE POLICY "Allow anonymous inserts" ON public.chat_disease_searches
  FOR INSERT WITH CHECK (true);

-- Allow public read access for dashboard
CREATE POLICY "Allow public read" ON public.chat_disease_searches
  FOR SELECT USING (true);