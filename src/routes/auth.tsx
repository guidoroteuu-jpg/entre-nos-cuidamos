import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { routeHead } from '@/lib/route-head';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';
import { AccountSignOut } from '@/components/AccountSignOut';

export const Route = createFileRoute('/auth')({ head: () => routeHead('Acesso às contas escolares', 'Entre com sua conta ou crie o acesso administrativo da sua escola.'), component: SchoolAuth });
function SchoolAuth() {
  const navigate = useNavigate();
  const [signup, setSignup] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [name, setName] = useState('');
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user))); }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      if (signup) {
        const result = await supabase.auth.signUp({ email, password, options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/auth` } });
        if (result.error) throw result.error;
        setMessage('Verifique seu e-mail para confirmar a conta. Depois, entre para criar sua escola.'); return;
      }
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw new Error('E-mail ou senha inválidos, ou e-mail ainda não confirmado.');
      const members = await supabase.from('school_members').select('school_role,full_name,escola_id').eq('user_id', result.data.user.id);
      if (members.error) throw new Error('Não foi possível verificar seu perfil.');
      const profile = members.data?.[0];
      if (!profile || profile.school_role === 'administrator') await navigate({ to: '/administracao' });
      else if (profile.school_role === 'director') await navigate({ to: '/direcao/painel' });
      else if (profile.school_role === 'teacher') await navigate({ to: '/professor/dashboard' });
      else {
        localStorage.setItem('entre_nos_nome', profile.full_name); localStorage.setItem('entre_nos_token', result.data.user.id);
        const enrollment = await supabase.from('alunos_turmas').select('turma_id').eq('user_id', result.data.user.id).limit(1).maybeSingle();
        if (enrollment.data) localStorage.setItem('entre_nos_turma_id', enrollment.data.turma_id);
        await navigate({ to: '/aluno/home' });
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Não foi possível entrar.'); }
    finally { setBusy(false); }
  }
  return <main className="min-h-screen flex items-center justify-center p-6"><div className="w-full max-w-md space-y-8"><div className="flex justify-between"><Link to="/"><Logo largura={180} /></Link>{signedIn && <AccountSignOut />}</div>{signedIn && <Link to="/administracao" className="block text-primary">Abrir administração da minha escola</Link>}<div><ShieldCheck className="text-primary size-8 mb-4" /><h1 className="font-heading text-4xl text-foreground">{signup ? 'Criar acesso da escola' : 'Conta escolar'}</h1></div><form onSubmit={submit} className="space-y-4">
    {signup && <><Label htmlFor="admin-name">Seu nome completo</Label><Input id="admin-name" value={name} onChange={e => setName(e.target.value)} minLength={3} required /></>}
    <Label htmlFor="admin-email">E-mail</Label><Input id="admin-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required />
    <Label htmlFor="admin-password">Senha{signup ? ' (mínimo 12 caracteres)' : ''}</Label><Input id="admin-password" type="password" minLength={signup ? 12 : 1} autoComplete={signup ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} required />
    {error && <p role="alert" className="text-destructive text-sm">{error}</p>}{message && <p role="status" className="text-muted-foreground text-sm">{message}</p>}
    <Button type="submit" className="w-full" disabled={busy}>{busy ? 'Aguarde…' : signup ? 'Criar conta' : 'Entrar'}</Button>
  </form><Button variant="outline" className="w-full" onClick={() => { setSignup(!signup); setError(''); setMessage(''); }}>{signup ? 'Já tenho uma conta' : 'Sou administrador de uma nova escola'}</Button><Button variant="ghost" className="w-full" disabled={!email || busy} onClick={async () => { const result = await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${window.location.origin}/auth` } }); setMessage(result.error ? 'Não foi possível reenviar agora. Tente mais tarde.' : 'Se a conta aguarda confirmação, você receberá um e-mail.'); }}>Reenviar confirmação de e-mail</Button><Link to="/login" className="block text-center text-sm text-primary">Acesso por código da turma</Link></div></main>;
}