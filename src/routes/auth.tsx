import { createFileRoute, redirect } from '@tanstack/react-router';
import { safeDestination } from '@/lib/backend-model';
export const Route = createFileRoute('/auth')({
  validateSearch: (s: Record<string, unknown>) => ({ redirect: safeDestination(s['redirect']) }),
  head: () => ({ meta: [{ title: 'Account access · SchoolOS' }, { name: 'description', content: 'Access your SchoolOS account securely.' }, { property: 'og:title', content: 'Account access · SchoolOS' }, { property: 'og:description', content: 'Access your school account.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }),
  beforeLoad: ({ search }) => { throw redirect({ to: '/login', search }); },
});
