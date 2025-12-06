-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for secure role management
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update is_admin function to use the new role system
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT public.has_role(user_id, 'admin'::app_role);
$function$;

-- Make user_id nullable in interactions table for anonymous users
ALTER TABLE public.interactions ALTER COLUMN user_id DROP NOT NULL;

-- Make user_id nullable in feedback table for anonymous users
ALTER TABLE public.feedback ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Admins can view all interactions" ON public.interactions;
DROP POLICY IF EXISTS "Admins can view all feedback" ON public.feedback;

-- Add RLS policy for admins to view all interactions using new role system
CREATE POLICY "Admins can view all interactions via roles" 
ON public.interactions 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Add RLS policy for admins to view all feedback using new role system
CREATE POLICY "Admins can view all feedback via roles" 
ON public.feedback 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow anonymous users to insert interactions
CREATE POLICY "Anonymous users can create interactions" 
ON public.interactions 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Allow anonymous users to insert feedback
CREATE POLICY "Anonymous users can create feedback" 
ON public.feedback 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Allow anonymous users to view interactions (for their session)
CREATE POLICY "Anonymous users can view interactions" 
ON public.interactions 
FOR SELECT 
TO anon
USING (true);

-- Create policy for user_roles table
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));