
-- 1. Role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- user_roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- 2. Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Escolas
CREATE TABLE public.escolas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT,
  state TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.escolas ENABLE ROW LEVEL SECURITY;

-- Admin-school link
CREATE TABLE public.escola_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escola_id UUID NOT NULL REFERENCES public.escolas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (escola_id, user_id)
);
ALTER TABLE public.escola_admins ENABLE ROW LEVEL SECURITY;

-- Helper: get school IDs for an admin
CREATE OR REPLACE FUNCTION public.get_admin_escola_ids(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT escola_id FROM public.escola_admins WHERE user_id = _user_id
$$;

CREATE POLICY "Admins can view their schools" ON public.escolas
  FOR SELECT USING (id IN (SELECT public.get_admin_escola_ids(auth.uid())));
CREATE POLICY "Admins can update their schools" ON public.escolas
  FOR UPDATE USING (id IN (SELECT public.get_admin_escola_ids(auth.uid())));

CREATE POLICY "Admins can view own links" ON public.escola_admins
  FOR SELECT USING (auth.uid() = user_id);

-- 4. Turmas
CREATE TABLE public.turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escola_id UUID NOT NULL REFERENCES public.escolas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  year INT NOT NULL DEFAULT EXTRACT(YEAR FROM now()),
  shift TEXT DEFAULT 'manhã',
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view their classes" ON public.turmas
  FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Admins can view school classes" ON public.turmas
  FOR SELECT USING (escola_id IN (SELECT public.get_admin_escola_ids(auth.uid())));
CREATE POLICY "Admins can insert classes" ON public.turmas
  FOR INSERT WITH CHECK (escola_id IN (SELECT public.get_admin_escola_ids(auth.uid())));
CREATE POLICY "Admins can update classes" ON public.turmas
  FOR UPDATE USING (escola_id IN (SELECT public.get_admin_escola_ids(auth.uid())));
CREATE POLICY "Admins can delete classes" ON public.turmas
  FOR DELETE USING (escola_id IN (SELECT public.get_admin_escola_ids(auth.uid())));

-- 5. Alunos-Turmas (student-class enrollment)
CREATE TABLE public.alunos_turmas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  turma_id UUID NOT NULL REFERENCES public.turmas(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (turma_id, user_id)
);
ALTER TABLE public.alunos_turmas ENABLE ROW LEVEL SECURITY;

-- Helper: get turma IDs for a student
CREATE OR REPLACE FUNCTION public.get_student_turma_ids(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT turma_id FROM public.alunos_turmas WHERE user_id = _user_id
$$;

-- Helper: get turma IDs for a teacher
CREATE OR REPLACE FUNCTION public.get_teacher_turma_ids(_user_id UUID)
RETURNS SETOF UUID
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.turmas WHERE teacher_id = _user_id
$$;

CREATE POLICY "Students can view own enrollments" ON public.alunos_turmas
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view their class enrollments" ON public.alunos_turmas
  FOR SELECT USING (turma_id IN (SELECT public.get_teacher_turma_ids(auth.uid())));
CREATE POLICY "Admins can manage enrollments" ON public.alunos_turmas
  FOR ALL USING (
    turma_id IN (
      SELECT t.id FROM public.turmas t
      WHERE t.escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
    )
  );

-- 6. Check-ins
CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE SET NULL,
  mood INT NOT NULL CHECK (mood BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own checkins" ON public.checkins
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can create own checkins" ON public.checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Teachers can view class checkins" ON public.checkins
  FOR SELECT USING (turma_id IN (SELECT public.get_teacher_turma_ids(auth.uid())));
CREATE POLICY "Admins can view school checkins" ON public.checkins
  FOR SELECT USING (
    turma_id IN (
      SELECT t.id FROM public.turmas t
      WHERE t.escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
    )
  );

-- 7. Denúncias (complaints/reports)
CREATE TABLE public.denuncias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  escola_id UUID NOT NULL REFERENCES public.escolas(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  is_anonymous BOOLEAN DEFAULT false,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.denuncias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own complaints" ON public.denuncias
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can create complaints" ON public.denuncias
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view school complaints" ON public.denuncias
  FOR SELECT USING (escola_id IN (SELECT public.get_admin_escola_ids(auth.uid())));
CREATE POLICY "Admins can update school complaints" ON public.denuncias
  FOR UPDATE USING (escola_id IN (SELECT public.get_admin_escola_ids(auth.uid())));

-- 8. Diário (private diary entries)
CREATE TABLE public.diario_entradas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  mood INT CHECK (mood BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.diario_entradas ENABLE ROW LEVEL SECURITY;

-- Strictly private: only the student can access their own diary
CREATE POLICY "Students can view own diary" ON public.diario_entradas
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Students can create diary entries" ON public.diario_entradas
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Students can update own diary" ON public.diario_entradas
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Students can delete own diary" ON public.diario_entradas
  FOR DELETE USING (auth.uid() = user_id);

-- 9. Alertas (risk alerts for teachers)
CREATE TABLE public.alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  turma_id UUID REFERENCES public.turmas(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium',
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alertas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view their alerts" ON public.alertas
  FOR SELECT USING (teacher_id = auth.uid());
CREATE POLICY "Teachers can update their alerts" ON public.alertas
  FOR UPDATE USING (teacher_id = auth.uid());
CREATE POLICY "Admins can view school alerts" ON public.alertas
  FOR SELECT USING (
    turma_id IN (
      SELECT t.id FROM public.turmas t
      WHERE t.escola_id IN (SELECT public.get_admin_escola_ids(auth.uid()))
    )
  );

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_escolas_updated_at BEFORE UPDATE ON public.escolas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_turmas_updated_at BEFORE UPDATE ON public.turmas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_denuncias_updated_at BEFORE UPDATE ON public.denuncias FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_diario_updated_at BEFORE UPDATE ON public.diario_entradas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alertas_updated_at BEFORE UPDATE ON public.alertas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_checkins_user_id ON public.checkins(user_id);
CREATE INDEX idx_checkins_turma_id ON public.checkins(turma_id);
CREATE INDEX idx_denuncias_escola_id ON public.denuncias(escola_id);
CREATE INDEX idx_denuncias_user_id ON public.denuncias(user_id);
CREATE INDEX idx_diario_user_id ON public.diario_entradas(user_id);
CREATE INDEX idx_alertas_teacher_id ON public.alertas(teacher_id);
CREATE INDEX idx_alertas_turma_id ON public.alertas(turma_id);
CREATE INDEX idx_alunos_turmas_turma_id ON public.alunos_turmas(turma_id);
CREATE INDEX idx_alunos_turmas_user_id ON public.alunos_turmas(user_id);
