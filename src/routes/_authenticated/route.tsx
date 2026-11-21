import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { RouteError, RouteMissing, RoutePending } from '@/components/common/route-feedback';
export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: '/auth', search: { redirect: location.href } });
    return { signedInUserId: data.user.id };
  },
  component: Outlet, errorComponent: RouteError, notFoundComponent: RouteMissing, pendingComponent: RoutePending,
});
