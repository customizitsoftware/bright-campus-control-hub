import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GraduationCap, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function PublicHeader() {
  const queryClient = useQueryClient();
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    queryClient.clear();
    window.location.assign("/login");
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <GraduationCap className="size-6 text-teal" />
          SchoolOS
        </Link>
        <nav className="flex items-center gap-2" aria-label="Account navigation">
          <Button asChild variant="ghost"><Link to="/pricing">Pricing</Link></Button>
          {signedIn ? (
            <>
              <Button asChild variant="outline"><Link to="/dashboard">My school</Link></Button>
              <Button variant="ghost" size="icon" aria-label="Sign out" title="Sign out" onClick={() => void logout()}>
                <LogOut />
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost"><Link to="/login">Sign in</Link></Button>
              <Button asChild><Link to="/register">Get started</Link></Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
