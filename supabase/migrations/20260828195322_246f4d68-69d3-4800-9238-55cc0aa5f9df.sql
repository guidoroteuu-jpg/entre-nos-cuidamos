-- 1. Move SECURITY DEFINER helper/trigger functions out of the exposed API schema
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

ALTER FUNCTION public.has_role(uuid, app_role) SET SCHEMA private;
ALTER FUNCTION public.get_admin_escola_ids(uuid) SET SCHEMA private;
ALTER FUNCTION public.get_student_turma_ids(uuid) SET SCHEMA private;
ALTER FUNCTION public.get_teacher_turma_ids(uuid) SET SCHEMA private;
ALTER FUNCTION public.handle_new_user() SET SCHEMA private;
ALTER FUNCTION public.handle_new_user_role() SET SCHEMA private;
ALTER FUNCTION public.audit_conselho_tutelar_acionamento() SET SCHEMA private;

-- helpers used inside RLS policies still need execute for the querying role
GRANT EXECUTE ON FUNCTION private.has_role(uuid, app_role) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.get_admin_escola_ids(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.get_student_turma_ids(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.get_teacher_turma_ids(uuid) TO anon, authenticated;

-- trigger-only functions must not be callable by API roles
REVOKE ALL ON FUNCTION private.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.handle_new_user_role() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.audit_conselho_tutelar_acionamento() FROM PUBLIC, anon, authenticated;

-- 2. Council audit trail: append-only via trigger / service role, never by API roles
REVOKE INSERT, UPDATE, DELETE ON public.conselho_tutelar_auditoria FROM anon, authenticated;
GRANT SELECT ON public.conselho_tutelar_auditoria TO authenticated;
GRANT ALL ON public.conselho_tutelar_auditoria TO service_role;

-- 3. Complaints: no deletion, and updates only by verified school admins
REVOKE DELETE ON public.denuncias FROM anon, authenticated;
DROP POLICY IF EXISTS "Admins can update school complaints" ON public.denuncias;
CREATE POLICY "Admins can update school complaints"
ON public.denuncias FOR UPDATE TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role) AND escola_id IN (SELECT private.get_admin_escola_ids(auth.uid())))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role) AND escola_id IN (SELECT private.get_admin_escola_ids(auth.uid())));

-- 4. Facial check-ins: readable only by school staff, not by anonymous visitors
DROP POLICY IF EXISTS "Anyone can read anonymous aggregates" ON public.expressao_checkins;
CREATE POLICY "Staff can read anonymous aggregates"
ON public.expressao_checkins FOR SELECT TO authenticated
USING (private.has_role(auth.uid(), 'teacher'::app_role) OR private.has_role(auth.uid(), 'admin'::app_role));
REVOKE SELECT ON public.expressao_checkins FROM anon;