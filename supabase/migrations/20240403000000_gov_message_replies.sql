
-- Create the table for government message replies from citizens
CREATE TABLE IF NOT EXISTS public.gov_message_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_message_id UUID NOT NULL REFERENCES public.gov_messages(id) ON DELETE CASCADE,
  sender_said TEXT NOT NULL,
  content TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index on sender_said for faster lookups
CREATE INDEX gov_message_replies_sender_said_idx ON public.gov_message_replies (sender_said);

-- Enable Row Level Security
ALTER TABLE public.gov_message_replies ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own replies
CREATE POLICY "Users can view their own replies" 
ON public.gov_message_replies 
FOR SELECT 
USING (
  sender_said = (SELECT sa_id FROM profiles WHERE id = auth.uid())
);

-- Create policy for users to insert their own replies
CREATE POLICY "Users can create their own replies" 
ON public.gov_message_replies 
FOR INSERT 
WITH CHECK (
  sender_said = (SELECT sa_id FROM profiles WHERE id = auth.uid())
);

-- Enable realtime subscriptions on the replies table
ALTER PUBLICATION supabase_realtime ADD TABLE gov_message_replies;

-- Also make sure gov_messages table has realtime enabled
ALTER PUBLICATION supabase_realtime ADD TABLE gov_messages;

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION public.update_gov_message_replies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gov_message_replies_updated_at
BEFORE UPDATE ON public.gov_message_replies
FOR EACH ROW
EXECUTE FUNCTION public.update_gov_message_replies_updated_at();
