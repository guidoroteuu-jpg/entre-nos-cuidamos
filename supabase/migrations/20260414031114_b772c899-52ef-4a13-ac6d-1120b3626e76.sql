
-- Fix 1: Allow students to view their own alerts
CREATE POLICY "Students can view own alerts"
ON public.alertas
FOR SELECT
USING (auth.uid() = user_id);

-- Fix 2: Drop and recreate teacher INSERT policy to also validate user_id belongs to a student in the turma
DROP POLICY IF EXISTS "Teachers can create alerts" ON public.alertas;

CREATE POLICY "Teachers can create alerts"
ON public.alertas
FOR INSERT
WITH CHECK (
  teacher_id = auth.uid()
  AND turma_id IN (SELECT public.get_teacher_turma_ids(auth.uid()))
  AND user_id IN (SELECT at.user_id FROM public.alunos_turmas at WHERE at.turma_id = alertas.turma_id)
);
