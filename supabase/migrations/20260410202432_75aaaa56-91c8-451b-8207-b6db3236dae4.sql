
-- Create a secure view that masks user_id for anonymous reports
CREATE VIEW public.denuncias_view
WITH (security_invoker = on) AS
SELECT
  id,
  CASE WHEN is_anonymous = true THEN NULL ELSE user_id END AS user_id,
  escola_id,
  type,
  description,
  status,
  is_anonymous,
  internal_notes,
  created_at,
  updated_at
FROM public.denuncias;

-- Drop the existing admin SELECT policy on the base table
DROP POLICY "Admins can view school complaints" ON public.denuncias;

-- Replace with a deny-direct-read policy for admins (they must use the view)
CREATE POLICY "Admins can view school complaints via view" ON public.denuncias
  FOR SELECT USING (
    auth.uid() = user_id
  );
