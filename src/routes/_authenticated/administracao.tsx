import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { Building2, Users, GraduationCap, Plus, LogOut, ShieldCheck } from 'lucide-react';
import { adminOverview, createSchoolClass, createSchoolPerson, setupSchool } from '@/lib/school-admin.functions';
import { routeHead } from '@/lib/route-head';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageHeader, StatTile } from '@/components/ui/kit';
import Logo from '@/components/Logo';

const options = { queryKey: ['school-administration'], queryFn: () => adminOverview() };
export const Route = createFileRoute('/_authenticated/administracao')({
  head: () => routeHead('Administração escolar', 'Gerencie turmas e contas da sua escola com acesso restrito.'),
  loader: ({ context }) => context.queryClient.ensureQueryData(options),
  component: Administration,
});
const roleNames: Record<string, string> = { administrator: 'Administrador', director: 'Direção', teacher: 'Professor', student: 'Aluno' };

function Administration() {
  const { data } = useSuspenseQuery(options);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const setup = useServerFn(setupSchool), addClass = useServerFn(createSchoolClass), addPerson = useServerFn(createSchoolPerson);
  const [schoolId, setSchoolId] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [modal, setModal] = useState<'class' | 'person' | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const school = data.schools.find(s => s.id === schoolId) ?? data.schools[0];
  const people = data.people.filter(p => p.escola_id === school?.id);
  const classes = data.classes.filter(c => c.escola_id === school?.id);
  const [search, setSearch] = useState('');
  async function run(action: () => Promise<unknown>, message: string) {
    setBusy(true); setError(''); setNotice('');
    try { const result = await action(); await queryClient.invalidateQueries({ queryKey: options.queryKey }); setModal(null); setNotice(typeof result === 'string' ? result : message); }
    catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível concluir.'); }
    finally { setBusy(false); }
  }
  async function signOut() {
    await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut();
    await navigate({ to: '/auth', replace: true });
  }
  return <div className="min-h-screen text-foreground">
    <header className="glass-nav flex flex-wrap items-center justify-between gap-4 px-6 py-4">
      <Link to="/"><Logo largura={130} /></Link>
      <div className="flex items-center gap-3"><ShieldCheck className="size-5 text-primary" /><span className="text-sm font-medium">Administração escolar</span><Button variant="ghost" size="icon" title="Sair" aria-label="Sair" onClick={signOut}><LogOut /></Button></div>
    </header>
    <main className="mx-auto max-w-7xl space-y-8 p-5 sm:p-10">
      <PageHeader eyebrow="Gestão da escola" title={school?.name ?? 'Sua escola começa aqui'} />
      {error && <p role="alert" className="text-destructive">{error}</p>}
      {notice && <p role="status" className="text-status-good">{notice}</p>}
      {!school ? <form className="max-w-xl space-y-5" onSubmit={e => { e.preventDefault(); void run(() => setup({ data: { name: schoolName } }), 'Escola criada.'); }}>
        <Label htmlFor="school-name">Nome da escola</Label><Input id="school-name" required minLength={3} maxLength={120} value={schoolName} onChange={e => setSchoolName(e.target.value)} />
        <Button disabled={busy} type="submit"><Building2 />{busy ? 'Criando…' : 'Criar minha escola'}</Button>
      </form> : <>
        {data.schools.length > 1 && <select aria-label="Escola" className="bg-card border border-border rounded-md p-3" value={school.id} onChange={e => setSchoolId(e.target.value)}>{data.schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select>}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><StatTile label="Turmas" value={classes.length} icon={Building2} /><StatTile label="Alunos" value={people.filter(p => p.school_role === 'student').length} icon={Users} /><StatTile label="Professores" value={people.filter(p => p.school_role === 'teacher').length} icon={GraduationCap} /><StatTile label="Direção" value={people.filter(p => p.school_role === 'director').length} icon={ShieldCheck} /></div>
        <Tabs defaultValue="classes">
          <div className="flex flex-wrap gap-4 justify-between items-center"><TabsList><TabsTrigger value="classes">Turmas</TabsTrigger><TabsTrigger value="people">Pessoas</TabsTrigger></TabsList><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setError(''); setModal('class'); }}><Plus />Nova turma</Button><Button onClick={() => { setError(''); setModal('person'); }}><Plus />Cadastrar pessoa</Button></div></div>
          <TabsContent value="classes" className="mt-6">
            {!classes.length ? <p className="py-12 text-muted-foreground">Nenhuma turma cadastrada.</p> : <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{classes.map(c => <article key={c.id} className="surface-card p-6 space-y-3"><Building2 className="text-primary" /><h2 className="font-heading text-2xl">{c.name}</h2><p className="text-muted-foreground">{c.year} · {c.shift}</p><p className="text-sm">{people.find(p => p.user_id === c.teacher_id)?.full_name ?? 'Sem professor vinculado'}</p><p className="text-sm">Código da turma: <code className="font-mono break-all">{c.access_code}</code></p></article>)}</div>}
          </TabsContent>
          <TabsContent value="people" className="mt-6 space-y-4"><Input aria-label="Buscar pessoas" placeholder="Buscar por nome ou e-mail" value={search} onChange={e => setSearch(e.target.value)} /><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left border-b border-border"><th className="py-4 pr-4">Nome</th><th className="pr-4">E-mail</th><th>Perfil</th></tr></thead><tbody>{people.filter(p => `${p.full_name} ${p.email}`.toLowerCase().includes(search.toLowerCase())).map(p => <tr key={p.id} className="border-b border-border"><td className="py-4 pr-4 font-medium">{p.full_name}</td><td className="pr-4 break-all">{p.email}</td><td>{roleNames[p.school_role]}</td></tr>)}</tbody></table></div></TabsContent>
        </Tabs>
      </>}
    </main>
    <Dialog open={modal !== null} onOpenChange={open => { if (!open && !busy) setModal(null); }}><DialogContent className="max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{modal === 'class' ? 'Nova turma' : 'Cadastrar pessoa'}</DialogTitle></DialogHeader>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <form className="space-y-4" onSubmit={e => {
        e.preventDefault(); if (!school) return;
        const f = new FormData(e.currentTarget); const value = (key: string) => String(f.get(key) ?? '');
        if (modal === 'class') void run(() => addClass({ data: { schoolId: school.id, name: value('name'), year: Number(value('year')), shift: value('shift') as 'Manhã' | 'Tarde' | 'Integral', teacherId: value('teacher') } }), 'Turma criada.');
        else void run(async () => {
          await addPerson({ data: { schoolId: school.id, fullName: value('name'), email: value('email'), password: value('password'), role: value('role') as 'student' | 'teacher' | 'director', classId: value('class') } });
          const sent = await supabase.auth.resend({ type: 'signup', email: value('email'), options: { emailRedirectTo: `${window.location.origin}/auth` } });
          if (sent.error) return 'Conta criada. O envio de confirmação falhou; a pessoa poderá reenviar no login.';
          return 'Pessoa cadastrada. Confirme o e-mail antes do primeiro acesso.';
        }, 'Pessoa cadastrada. Confirme o e-mail antes do primeiro acesso.');
      }}>
        <Label htmlFor="entry-name">{modal === 'class' ? 'Nome da turma' : 'Nome completo'}</Label><Input id="entry-name" name="name" required minLength={modal === 'class' ? 1 : 3} maxLength={120} />
        {modal === 'class' ? <><Label htmlFor="entry-year">Ano letivo</Label><Input id="entry-year" name="year" type="number" min={2000} max={2100} defaultValue={2026} required /><Label htmlFor="entry-shift">Turno</Label><select id="entry-shift" name="shift" className="w-full p-3 border border-border bg-card rounded-md">{['Manhã','Tarde','Integral'].map(s => <option key={s}>{s}</option>)}</select><Label htmlFor="entry-teacher">Professor</Label><select id="entry-teacher" name="teacher" className="w-full p-3 border border-border bg-card rounded-md"><option value="">Vincular depois</option>{people.filter(p => p.school_role === 'teacher').map(p => <option key={p.id} value={p.user_id}>{p.full_name}</option>)}</select></> : <>
          <Label htmlFor="entry-email">E-mail</Label><Input id="entry-email" name="email" type="email" required /><Label htmlFor="entry-password">Senha inicial (mínimo 12 caracteres)</Label><Input id="entry-password" name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required /><Label htmlFor="entry-role">Perfil</Label><select id="entry-role" name="role" className="w-full p-3 border border-border bg-card rounded-md"><option value="student">Aluno</option><option value="teacher">Professor</option><option value="director">Direção</option></select><Label htmlFor="entry-class">Turma (obrigatória para alunos)</Label><select id="entry-class" name="class" className="w-full p-3 border border-border bg-card rounded-md"><option value="">Sem turma</option>{classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        </>}
        <Button type="submit" disabled={busy} className="w-full">{busy ? 'Salvando…' : 'Salvar cadastro'}</Button>
      </form>
    </DialogContent></Dialog>
  </div>;
}