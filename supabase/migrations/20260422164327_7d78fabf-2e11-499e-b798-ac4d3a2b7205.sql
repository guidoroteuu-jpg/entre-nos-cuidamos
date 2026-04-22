CREATE TABLE public.conselho_tutelar_auditoria (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  acionamento_id uuid NOT NULL REFERENCES public.conselho_tutelar_acionamentos(id) ON DELETE RESTRICT,
  actor_id uuid NOT NULL,
  actor_name text NOT NULL,
  action text NOT NULL,
  previous_status text,
  new_status text,
  reasons text[] NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.conselho_tutelar_auditoria ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_conselho_tutelar_auditoria_acionamento
ON public.conselho_tutelar_auditoria (acionamento_id, created_at DESC);

CREATE INDEX idx_conselho_tutelar_auditoria_actor
ON public.conselho_tutelar_auditoria (actor_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.enforce_conselho_tutelar_status_only_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF OLD.student_full_name IS DISTINCT FROM NEW.student_full_name
    OR OLD.class_or_grade IS DISTINCT FROM NEW.class_or_grade
    OR OLD.student_birth_date IS DISTINCT FROM NEW.student_birth_date
    OR OLD.guardian_name IS DISTINCT FROM NEW.guardian_name
    OR OLD.guardian_contact IS DISTINCT FROM NEW.guardian_contact
    OR OLD.reasons IS DISTINCT FROM NEW.reasons
    OR OLD.other_reason IS DISTINCT FROM NEW.other_reason
    OR OLD.detailed_description IS DISTINCT FROM NEW.detailed_description
    OR OLD.absences_count IS DISTINCT FROM NEW.absences_count
    OR OLD.last_occurrence_date IS DISTINCT FROM NEW.last_occurrence_date
    OR OLD.family_contact_attempt IS DISTINCT FROM NEW.family_contact_attempt
    OR OLD.registrant_name IS DISTINCT FROM NEW.registrant_name
    OR OLD.escola_id IS DISTINCT FROM NEW.escola_id
    OR OLD.registered_by IS DISTINCT FROM NEW.registered_by
    OR OLD.protocolo IS DISTINCT FROM NEW.protocolo
  THEN
    RAISE EXCEPTION 'Apenas o status do acionamento pode ser atualizado.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_conselho_tutelar_status_only_update_trigger
BEFORE UPDATE ON public.conselho_tutelar_acionamentos
FOR EACH ROW
EXECUTE FUNCTION public.enforce_conselho_tutelar_status_only_update();

CREATE OR REPLACE FUNCTION public.audit_conselho_tutelar_acionamento()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid;
  actor_display_name text;
BEGIN
  actor := COALESCE(auth.uid(), NEW.registered_by);

  SELECT COALESCE(NULLIF(full_name, ''), 'Usuário autenticado')
  INTO actor_display_name
  FROM public.profiles
  WHERE user_id = actor
  LIMIT 1;

  IF actor_display_name IS NULL THEN
    actor_display_name := COALESCE(NEW.registrant_name, 'Usuário autenticado');
  END IF;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.conselho_tutelar_auditoria (
      acionamento_id,
      actor_id,
      actor_name,
      action,
      previous_status,
      new_status,
      reasons
    ) VALUES (
      NEW.id,
      NEW.registered_by,
      NEW.registrant_name,
      'created',
      NULL,
      NEW.status,
      NEW.reasons
    );
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.conselho_tutelar_auditoria (
      acionamento_id,
      actor_id,
      actor_name,
      action,
      previous_status,
      new_status,
      reasons
    ) VALUES (
      NEW.id,
      actor,
      actor_display_name,
      'status_updated',
      OLD.status,
      NEW.status,
      NEW.reasons
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER audit_conselho_tutelar_insert_trigger
AFTER INSERT ON public.conselho_tutelar_acionamentos
FOR EACH ROW
EXECUTE FUNCTION public.audit_conselho_tutelar_acionamento();

CREATE TRIGGER audit_conselho_tutelar_status_update_trigger
AFTER UPDATE OF status ON public.conselho_tutelar_acionamentos
FOR EACH ROW
EXECUTE FUNCTION public.audit_conselho_tutelar_acionamento();

CREATE POLICY "Teachers can view own council audit"
ON public.conselho_tutelar_auditoria
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.conselho_tutelar_acionamentos a
    WHERE a.id = conselho_tutelar_auditoria.acionamento_id
      AND a.registered_by = auth.uid()
      AND public.has_role(auth.uid(), 'teacher')
  )
);

CREATE POLICY "Admins can view school council audit"
ON public.conselho_tutelar_auditoria
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.conselho_tutelar_acionamentos a
    WHERE a.id = conselho_tutelar_auditoria.acionamento_id
      AND public.has_role(auth.uid(), 'admin')
      AND a.escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
  )
);