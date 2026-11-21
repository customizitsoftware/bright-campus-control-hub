import { Link, useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { GraduationCap, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuthIdentity } from './auth-context';
import { toast } from 'sonner';
export function PublicHeader() {
  const { user } = useAuthIdentity(); const queryClient = useQueryClient(); const navigate = useNavigate();
  async function logout() {
    await queryClient.cancelQueries(); queryClient.clear();
    const { error } = await supabase.auth.signOut();
    if (error) { toast.error(error.message); return; }
    await navigate({ to: '/login', replace: true });
  }
  return <header className="border-b border-border bg-card"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4"><Link to="/pricing" className="flex items-center gap-2 font-display text-xl font-semibold"><GraduationCap className="size-6 text-teal" />SchoolOS</Link><nav className="flex items-center gap-2" aria-label="Account navigation"><Button asChild variant="ghost"><Link to="/pricing">Pricing</Link></Button>{user ? <><Button asChild variant="outline"><Link to="/dashboard">My school</Link></Button><Button variant="ghost" size="icon" aria-label="Sign out" title="Sign out" onClick={() => void logout()}><LogOut /></Button></> : <><Button asChild variant="ghost"><Link to="/login">Sign in</Link></Button><Button asChild><Link to="/register">Get started</Link></Button></>}</nav></div></header>;
}
