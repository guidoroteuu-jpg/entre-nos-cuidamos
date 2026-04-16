-- Trigger to auto-assign role from raw_user_meta_data on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_role text;
  resolved_role public.app_role;
BEGIN
  meta_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');

  IF meta_role NOT IN ('admin', 'teacher', 'student') THEN
    meta_role := 'student';
  END IF;

  resolved_role := meta_role::public.app_role;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, resolved_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();