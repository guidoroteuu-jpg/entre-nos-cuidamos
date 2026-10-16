CREATE TABLE public.school_members (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), escola_id uuid NOT NULL REFERENCES public.escolas(id), user_id uuid NOT NULL, full_name text NOT NULL, email text NOT NULL, school_role text NOT NULL CHECK (school_role IN ('administrator','director','teacher','student')), created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(escola_id,user_id)
);
GRANT SELECT ON public.school_members TO authenticated;
GRANT ALL ON public.school_members TO service_role;
ALTER TABLE public.school_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY school_members_read ON public.school_members FOR SELECT TO authenticated USING (user_id=auth.uid() OR EXISTS (SELECT 1 FROM public.escola_admins a WHERE a.user_id=auth.uid() AND a.escola_id=school_members.escola_id));
ALTER TABLE public.turmas ADD COLUMN access_code text DEFAULT encode(gen_random_bytes(6),'hex');
CREATE UNIQUE INDEX turmas_access_code_unique ON public.turmas(access_code);
CREATE OR REPLACE FUNCTION private.handle_new_user_role() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ BEGIN INSERT INTO public.user_roles(user_id,role) VALUES (NEW.id,'student') ON CONFLICT(user_id,role) DO NOTHING; RETURN NEW; END; $$;
REVOKE ALL ON FUNCTION private.handle_new_user_role() FROM PUBLIC,anon,authenticated;
CREATE OR REPLACE FUNCTION public.setup_own_school(school_name text) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE school_id uuid; BEGIN
 IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Autenticação necessária'; END IF;
 IF length(trim(school_name))<3 OR length(school_name)>120 THEN RAISE EXCEPTION 'Nome da escola inválido'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
 IF EXISTS(SELECT 1 FROM public.school_members WHERE user_id=auth.uid()) OR EXISTS(SELECT 1 FROM public.escola_admins WHERE user_id=auth.uid()) THEN RAISE EXCEPTION 'Esta conta já está vinculada a uma escola'; END IF;
 INSERT INTO public.escolas(name) VALUES(trim(school_name)) RETURNING id INTO school_id;
 INSERT INTO public.escola_admins(escola_id,user_id) VALUES(school_id,auth.uid());
 INSERT INTO public.school_members(escola_id,user_id,full_name,email,school_role) SELECT school_id,auth.uid(),coalesce(p.full_name,'Administrador'),coalesce(auth.jwt()->>'email',''),'administrator' FROM public.profiles p WHERE p.user_id=auth.uid() LIMIT 1;
 INSERT INTO public.user_roles(user_id,role) VALUES(auth.uid(),'admin') ON CONFLICT(user_id,role) DO NOTHING;
 RETURN school_id; END; $$;
REVOKE ALL ON FUNCTION public.setup_own_school(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.setup_own_school(text) TO authenticated;
GRANT SELECT,INSERT,UPDATE,DELETE ON public.turmas,public.alunos_turmas TO authenticated;
GRANT SELECT ON public.escola_admins,public.escolas,public.profiles,public.user_roles TO authenticated;
GRANT ALL ON public.school_members,public.turmas,public.alunos_turmas,public.escola_admins,public.escolas,public.profiles,public.user_roles TO service_role;