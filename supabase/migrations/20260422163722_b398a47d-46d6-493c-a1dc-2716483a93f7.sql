CREATE TABLE public.conselho_tutelar_acionamentos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  protocolo text NOT NULL UNIQUE DEFAULT ('CT-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  escola_id uuid NOT NULL,
  registered_by uuid NOT NULL,
  student_full_name text NOT NULL,
  class_or_grade text NOT NULL,
  student_birth_date date NOT NULL,
  guardian_name text NOT NULL,
  guardian_contact text NOT NULL,
  reasons text[] NOT NULL,
  other_reason text,
  detailed_description text NOT NULL,
  absences_count integer,
  last_occurrence_date date,
  family_contact_attempt text NOT NULL,
  registrant_name text NOT NULL,
  status text NOT NULL DEFAULT 'registrado',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.conselho_tutelar_acionamentos ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_conselho_tutelar_escola_created_at
ON public.conselho_tutelar_acionamentos (escola_id, created_at DESC);

CREATE INDEX idx_conselho_tutelar_registered_by
ON public.conselho_tutelar_acionamentos (registered_by);

CREATE OR REPLACE FUNCTION public.validate_conselho_tutelar_acionamento()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF length(trim(NEW.student_full_name)) < 3 THEN
    RAISE EXCEPTION 'Nome completo do aluno é obrigatório.';
  END IF;

  IF length(trim(NEW.class_or_grade)) < 1 THEN
    RAISE EXCEPTION 'Turma/Série é obrigatória.';
  END IF;

  IF NEW.student_birth_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Data de nascimento não pode ser futura.';
  END IF;

  IF length(trim(NEW.guardian_name)) < 3 THEN
    RAISE EXCEPTION 'Nome do responsável é obrigatório.';
  END IF;

  IF length(trim(NEW.guardian_contact)) < 5 THEN
    RAISE EXCEPTION 'Contato do responsável é obrigatório.';
  END IF;

  IF array_length(NEW.reasons, 1) IS NULL OR array_length(NEW.reasons, 1) = 0 THEN
    RAISE EXCEPTION 'Selecione ao menos um motivo.';
  END IF;

  IF 'Outro' = ANY(NEW.reasons) AND (NEW.other_reason IS NULL OR length(trim(NEW.other_reason)) < 3) THEN
    RAISE EXCEPTION 'Descreva o outro motivo.';
  END IF;

  IF length(trim(NEW.detailed_description)) < 50 THEN
    RAISE EXCEPTION 'Descrição detalhada deve ter pelo menos 50 caracteres.';
  END IF;

  IF NEW.absences_count IS NOT NULL AND NEW.absences_count < 0 THEN
    RAISE EXCEPTION 'Número de faltas não pode ser negativo.';
  END IF;

  IF NEW.last_occurrence_date IS NOT NULL AND NEW.last_occurrence_date > CURRENT_DATE THEN
    RAISE EXCEPTION 'Data da última ocorrência não pode ser futura.';
  END IF;

  IF NEW.family_contact_attempt NOT IN ('Sim', 'Não', 'Tentativa sem sucesso') THEN
    RAISE EXCEPTION 'Tentativa de contato inválida.';
  END IF;

  IF NEW.status NOT IN ('registrado', 'encaminhado', 'em_acompanhamento', 'concluido') THEN
    RAISE EXCEPTION 'Status inválido.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_conselho_tutelar_acionamento_trigger
BEFORE INSERT OR UPDATE ON public.conselho_tutelar_acionamentos
FOR EACH ROW
EXECUTE FUNCTION public.validate_conselho_tutelar_acionamento();

CREATE TRIGGER update_conselho_tutelar_acionamentos_updated_at
BEFORE UPDATE ON public.conselho_tutelar_acionamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Teachers can create council referrals"
ON public.conselho_tutelar_acionamentos
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = registered_by
  AND public.has_role(auth.uid(), 'teacher')
  AND escola_id IN (
    SELECT t.escola_id
    FROM public.turmas t
    WHERE t.teacher_id = auth.uid()
  )
);

CREATE POLICY "Admins can create council referrals"
ON public.conselho_tutelar_acionamentos
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = registered_by
  AND public.has_role(auth.uid(), 'admin')
  AND escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
);

CREATE POLICY "Teachers can view own council referrals"
ON public.conselho_tutelar_acionamentos
FOR SELECT
TO authenticated
USING (
  registered_by = auth.uid()
  AND public.has_role(auth.uid(), 'teacher')
);

CREATE POLICY "Admins can view school council referrals"
ON public.conselho_tutelar_acionamentos
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
);

CREATE POLICY "Admins can update school council referrals"
ON public.conselho_tutelar_acionamentos
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  AND escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  AND escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
);