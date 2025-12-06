-- Create discussions table
CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  likes_count INTEGER NOT NULL DEFAULT 0,
  replies_count INTEGER NOT NULL DEFAULT 0,
  is_reported BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false
);

-- Create replies table
CREATE TABLE public.replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  likes_count INTEGER NOT NULL DEFAULT 0,
  is_reported BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false
);

-- Create discussion_likes table (for tracking likes)
CREATE TABLE public.discussion_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(discussion_id, user_identifier)
);

-- Create reply_likes table
CREATE TABLE public.reply_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id UUID NOT NULL REFERENCES public.replies(id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reply_id, user_identifier)
);

-- Enable RLS
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reply_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discussions
CREATE POLICY "Anyone can read discussions" ON public.discussions
  FOR SELECT USING (is_hidden = false);

CREATE POLICY "Anyone can create discussions" ON public.discussions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update discussion likes count" ON public.discussions
  FOR UPDATE USING (true) WITH CHECK (true);

-- RLS Policies for replies
CREATE POLICY "Anyone can read replies" ON public.replies
  FOR SELECT USING (is_hidden = false);

CREATE POLICY "Anyone can create replies" ON public.replies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update reply likes count" ON public.replies
  FOR UPDATE USING (true) WITH CHECK (true);

-- RLS Policies for discussion_likes
CREATE POLICY "Anyone can read discussion likes" ON public.discussion_likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create discussion likes" ON public.discussion_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete own discussion likes" ON public.discussion_likes
  FOR DELETE USING (true);

-- RLS Policies for reply_likes
CREATE POLICY "Anyone can read reply likes" ON public.reply_likes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create reply likes" ON public.reply_likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete own reply likes" ON public.reply_likes
  FOR DELETE USING (true);

-- Function to update discussion updated_at when a reply is added
CREATE OR REPLACE FUNCTION public.update_discussion_on_reply()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.discussions 
  SET updated_at = now(), replies_count = replies_count + 1
  WHERE id = NEW.discussion_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for updating discussion when reply is added
CREATE TRIGGER on_reply_created
  AFTER INSERT ON public.replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_discussion_on_reply();

-- Create indexes for performance
CREATE INDEX idx_discussions_updated_at ON public.discussions(updated_at DESC);
CREATE INDEX idx_replies_discussion_id ON public.replies(discussion_id);
CREATE INDEX idx_discussion_likes_discussion_id ON public.discussion_likes(discussion_id);
CREATE INDEX idx_reply_likes_reply_id ON public.reply_likes(reply_id);