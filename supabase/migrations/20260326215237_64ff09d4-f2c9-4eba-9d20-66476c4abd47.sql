
-- Drop overly permissive update policy and restrict to the trigger function only
DROP POLICY "System can update companies" ON public.companies;

-- No direct update policy needed - the trigger function runs as SECURITY DEFINER
-- and bypasses RLS. No user should directly update companies.
