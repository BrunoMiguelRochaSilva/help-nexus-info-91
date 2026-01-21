-- Create table to store chat interactions
CREATE TABLE IF NOT EXISTS public.interactions (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  anonymous_id TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_interactions_user_id ON public.interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_interactions_anonymous_id ON public.interactions(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_interactions_created_at ON public.interactions(created_at);

-- Enable Row Level Security
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from proxy server/edge function)
CREATE POLICY "Allow anonymous inserts" ON public.interactions
  FOR INSERT WITH CHECK (true);

-- Allow public read access for analytics
CREATE POLICY "Allow public read" ON public.interactions
  FOR SELECT USING (true);