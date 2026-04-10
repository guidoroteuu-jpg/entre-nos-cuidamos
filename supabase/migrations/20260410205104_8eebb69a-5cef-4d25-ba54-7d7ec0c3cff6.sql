
-- Drop and recreate denuncias_view without security_invoker
-- This way the view runs as the owner (bypasses RLS), and we filter inside the view
DROP VIEW IF EXISTS public.denuncias_view;

CREATE VIEW public.denuncias_view AS
SELECT
  id,
  CASE WHEN is_anonymous = true THEN NULL::uuid ELSE user_id END AS user_id,
  escola_id,
  type,
  description,
  status,
  is_anonymous,
  internal_notes,
  created_at,
  updated_at
FROM public.denuncias
WHERE
  -- User can see their own complaints
  auth.uid() = user_id
  -- Or admin can see complaints from their schools
  OR escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()));

-- Grant access to authenticated users
GRANT SELECT ON public.denuncias_view TO authenticated;
