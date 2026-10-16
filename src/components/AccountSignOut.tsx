import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export function AccountSignOut({ expanded = false }: { expanded?: boolean }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return <Button variant="ghost" title="Sair" aria-label="Sair" className={expanded ? 'mt-2 w-full justify-center lg:justify-start text-primary-foreground/70' : 'text-muted-foreground'} onClick={async () => {
    await queryClient.cancelQueries(); queryClient.clear();
    await supabase.auth.signOut();
    localStorage.removeItem('entre_nos_staff_role'); localStorage.removeItem('entre_nos_staff_email');
    await navigate({ to: '/auth', replace: true });
  }}><LogOut className="size-4" />{expanded && <span className="hidden lg:inline">Sair</span>}</Button>;
}