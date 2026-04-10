
-- Fix: Remove admin direct access to denuncias base table to prevent anonymous identity leak
-- Admins should use denuncias_view which masks user_id for anonymous complaints
DROP POLICY IF EXISTS "Admins can view school complaints" ON public.denuncias;

-- Re-create a restrictive admin policy that only allows viewing non-anonymous complaints' user_id
-- Actually, RLS can't hide columns, so we remove admin SELECT on base table entirely
-- Admins must use denuncias_view instead

-- Students can still see their own complaints via existing policy
