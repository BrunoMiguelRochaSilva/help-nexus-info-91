-- Create rate_limits table for server-side rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  identifier TEXT PRIMARY KEY,
  submission_count INTEGER DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_submission TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Admin-only access to rate_limits table
CREATE POLICY "Admins can manage rate limits"
  ON public.rate_limits
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.rate_limits(identifier);

-- Function to cleanup old rate limit entries (optional, for maintenance)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.rate_limits
  WHERE last_submission < now() - interval '24 hours';
END;
$$;