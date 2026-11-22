import { useRouter, Link, type ErrorComponentProps } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
export function RouteError({ error }: ErrorComponentProps) {
  const router = useRouter();
  return <div role="alert" className="mx-auto max-w-lg space-y-4 px-6 py-16"><h1 className="text-xl font-semibold">We couldn’t load this page</h1><p className="break-words text-sm text-muted-foreground">{error instanceof Error ? error.message : 'Please try again.'}</p><div className="flex gap-3"><Button onClick={() => void router.invalidate()}>Try again</Button><Button asChild variant="outline"><Link to="/login">Sign in</Link></Button></div></div>;
}
export function RouteMissing() { return <p className="p-6">This SchoolOS page was not found.</p>; }
export function RoutePending() { return <p role="status" className="p-6 text-sm text-muted-foreground">Loading SchoolOS…</p>; }
