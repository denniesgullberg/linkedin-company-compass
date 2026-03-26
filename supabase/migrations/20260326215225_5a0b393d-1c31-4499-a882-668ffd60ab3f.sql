
-- Create companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  linkedin_url TEXT,
  avg_score NUMERIC DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_companies_name_lower ON public.companies (LOWER(name));

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies are viewable by everyone" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "System can update companies" ON public.companies FOR UPDATE USING (true);

-- Create ratings table
CREATE TABLE public.ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 1 AND overall_score <= 100),
  response_type TEXT NOT NULL CHECK (response_type IN ('automated', 'personal', 'none')),
  got_interview BOOLEAN NOT NULL DEFAULT false,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can create ratings" ON public.ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.ratings FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.ratings FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE UNIQUE INDEX idx_ratings_user_company ON public.ratings (user_id, company_id);

-- Function to update company average score
CREATE OR REPLACE FUNCTION public.update_company_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.companies
  SET avg_score = (SELECT AVG(overall_score) FROM public.ratings WHERE company_id = COALESCE(NEW.company_id, OLD.company_id)),
      total_ratings = (SELECT COUNT(*) FROM public.ratings WHERE company_id = COALESCE(NEW.company_id, OLD.company_id)),
      updated_at = now()
  WHERE id = COALESCE(NEW.company_id, OLD.company_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_company_score_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW EXECUTE FUNCTION public.update_company_score();
