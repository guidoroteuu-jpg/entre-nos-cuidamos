
-- Grant SELECT on the view to authenticated users (RLS on base table still enforces row-level access)
GRANT SELECT ON public.denuncias_view TO authenticated;
