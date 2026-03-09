
CREATE TABLE public.shared_presentations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  views INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.shared_presentations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shared presentations" 
ON public.shared_presentations FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create shared presentations" 
ON public.shared_presentations FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update view count" 
ON public.shared_presentations FOR UPDATE 
USING (true)
WITH CHECK (true);
