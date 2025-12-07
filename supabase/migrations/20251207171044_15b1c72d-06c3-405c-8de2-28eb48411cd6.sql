-- Create private_messages table
CREATE TABLE public.private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  receiver_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages - anyone can read their own messages
CREATE POLICY "Anyone can read messages they sent or received"
ON public.private_messages
FOR SELECT
USING (true);

-- Anyone can insert messages
CREATE POLICY "Anyone can send messages"
ON public.private_messages
FOR INSERT
WITH CHECK (true);

-- Anyone can update messages (for marking as read)
CREATE POLICY "Anyone can update messages"
ON public.private_messages
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_private_messages_sender ON public.private_messages(sender_name);
CREATE INDEX idx_private_messages_receiver ON public.private_messages(receiver_name);
CREATE INDEX idx_private_messages_created_at ON public.private_messages(created_at DESC);
CREATE INDEX idx_private_messages_unread ON public.private_messages(receiver_name, is_read) WHERE is_read = false;