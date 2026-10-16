import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';
import { classInput, personInput } from './school-admin.schemas';

export const adminOverview = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: links, error } = await context.supabase.from('escola_admins').select('escola_id').eq('user_id', context.userId);
  if (error) throw new Error('Não foi possível consultar suas escolas.');
  const ids = (links ?? []).map(l => l.escola_id);
  if (!ids.length) return { schools: [], classes: [], people: [] };
  const [schools, classes, people] = await Promise.all([
    context.supabase.from('escolas').select('id,name').in('id', ids),
    context.supabase.from('turmas').select('id,escola_id,name,year,shift,teacher_id,access_code').in('escola_id', ids).order('name'),
    context.supabase.from('school_members').select('id,escola_id,user_id,full_name,email,school_role').in('escola_id', ids).order('full_name'),
  ]);
  if (schools.error || classes.error || people.error) throw new Error('Não foi possível carregar os cadastros.');
  const allowed = ids.filter(id => (people.data ?? []).some(p => p.escola_id === id && p.user_id === context.userId && p.school_role === 'administrator'));
  return { schools: (schools.data ?? []).filter(s => allowed.includes(s.id)), classes: (classes.data ?? []).filter(c => allowed.includes(c.escola_id)), people: (people.data ?? []).filter(p => allowed.includes(p.escola_id)) };
});

export const setupSchool = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ name: z.string().trim().min(3).max(120) }))
  .handler(async ({ data, context }) => {
    const result = await context.supabase.rpc('setup_own_school', { school_name: data.name });
    if (result.error) throw new Error('Não foi possível criar a escola. Esta conta pode já estar vinculada a uma escola.');
    return result.data;
  });

export const createSchoolClass = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(classInput)
  .handler(async ({ data, context }) => {
    const { data: membership } = await context.supabase.from('school_members').select('id').eq('escola_id', data.schoolId).eq('user_id', context.userId).eq('school_role', 'administrator').maybeSingle();
    if (!membership) throw new Error('Você não administra esta escola.');
    if (data.teacherId) {
      const { data: teacher } = await context.supabase.from('school_members').select('id').eq('escola_id', data.schoolId).eq('user_id', data.teacherId).eq('school_role', 'teacher').maybeSingle();
      if (!teacher) throw new Error('Professor não pertence a esta escola.');
    }
    const { error } = await context.supabase.from('turmas').insert({ escola_id: data.schoolId, name: data.name, year: data.year, shift: data.shift, teacher_id: data.teacherId || null });
    if (error) throw new Error('Não foi possível criar a turma.');
    return { ok: true };
  });

export const createSchoolPerson = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator(personInput)
  .handler(async ({ data, context }) => {
    const { data: membership } = await context.supabase.from('school_members').select('id').eq('escola_id', data.schoolId).eq('user_id', context.userId).eq('school_role', 'administrator').maybeSingle();
    if (!membership) throw new Error('Você não administra esta escola.');
    if (data.classId) {
      const { data: turma } = await context.supabase.from('turmas').select('id').eq('id', data.classId).eq('escola_id', data.schoolId).maybeSingle();
      if (!turma) throw new Error('Turma não pertence a esta escola.');
    }
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    // Email confirmation remains required. No user-editable metadata assigns roles.
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({ email: data.email, password: data.password, user_metadata: { full_name: data.fullName } });
    if (error || !created.user) throw new Error('Não foi possível criar a conta. Verifique o e-mail e os requisitos da senha.');
    const userId = created.user.id;
    try {
      const member = await supabaseAdmin.from('school_members').insert({ escola_id: data.schoolId, user_id: userId, full_name: data.fullName, email: data.email, school_role: data.role });
      if (member.error) throw member.error;
      const roles = await supabaseAdmin.from('user_roles').upsert({ user_id: userId, role: data.role === 'director' ? 'admin' : data.role }, { onConflict: 'user_id,role' });
      if (roles.error) throw roles.error;
      if (data.role === 'director') {
        const link = await supabaseAdmin.from('escola_admins').insert({ escola_id: data.schoolId, user_id: userId });
        if (link.error) throw link.error;
      }
      if (data.role === 'student' && data.classId) {
        const enrollment = await supabaseAdmin.from('alunos_turmas').insert({ turma_id: data.classId, user_id: userId });
        if (enrollment.error) throw enrollment.error;
      }
    } catch {
      await supabaseAdmin.from('alunos_turmas').delete().eq('user_id', userId);
      await supabaseAdmin.from('escola_admins').delete().eq('user_id', userId);
      await supabaseAdmin.from('school_members').delete().eq('user_id', userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error('Cadastro não concluído. Tente novamente.');
    }
    return { ok: true };
  });