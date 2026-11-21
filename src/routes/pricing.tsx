import { createFileRoute } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { catalogQuery } from '@/lib/backend-queries';
import { PublicHeader } from '@/components/layout/public-header';
import { IntervalToggle, PlanComparison } from '@/components/billing/plan-comparison';
import { RouteError, RouteMissing, RoutePending } from '@/components/common/route-feedback';
export const Route = createFileRoute('/pricing')({
  validateSearch: (s: Record<string, unknown>) => ({ interval: s['interval'] === 'annual' ? 'annual' as const : 'monthly' as const }),
  head: () => ({ meta: [{ title: 'Pricing · SchoolOS' }, { name: 'description', content: 'Compare SchoolOS subscription plans for your school, billed monthly or annually.' }, { property: 'og:title', content: 'Pricing · SchoolOS' }, { property: 'og:description', content: 'Compare school subscription plans and included features.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  loader: async ({ context }) => { await context.queryClient.ensureQueryData(catalogQuery()); },
  errorComponent: RouteError, notFoundComponent: RouteMissing, pendingComponent: RoutePending,
  component: Pricing,
});
function Pricing() {
  const { data } = useSuspenseQuery(catalogQuery()); const { interval } = Route.useSearch(); const navigate = Route.useNavigate();
  return <><PublicHeader /><main className="mx-auto max-w-7xl space-y-8 px-5 py-10"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="mb-2 text-xs font-semibold uppercase tracking-widest text-teal">SchoolOS subscriptions</p><h1 className="text-3xl font-semibold">A plan for your school</h1></div><IntervalToggle value={interval} onChange={value => void navigate({ search: { interval: value } })} /></div><PlanComparison catalog={data} interval={interval} /></main></>;
}
