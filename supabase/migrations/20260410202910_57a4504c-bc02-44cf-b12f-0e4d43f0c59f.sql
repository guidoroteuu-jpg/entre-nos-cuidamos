
-- Fix 1: Replace broken admin SELECT policy on denuncias
DROP POLICY "Admins can view school complaints via view" ON public.denuncias;

-- Restore proper admin access scoped to their school
CREATE POLICY "Admins can view school complaints" ON public.denuncias
  FOR SELECT USING (
    auth.uid() = user_id
    OR escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
  );

-- Fix 2: Add INSERT policies on alertas
CREATE POLICY "Teachers can create alerts" ON public.alertas
  FOR INSERT WITH CHECK (
    teacher_id = auth.uid()
    AND turma_id IN (SELECT public.get_teacher_turma_ids(auth.uid()))
  );

CREATE POLICY "Admins can create school alerts" ON public.alertas
  FOR INSERT WITH CHECK (
    turma_id IN (
      SELECT t.id FROM public.turmas t
      WHERE t.escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
    )
  );
