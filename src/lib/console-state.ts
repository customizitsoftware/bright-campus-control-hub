import { redirect } from '@tanstack/react-router';
import type { AccessMode } from './backend-model';

/** Navigation only; private operations still validate the bearer on the server. */
export function requireConsoleSession(session: { user: { id: string } } | null, path: string) {
  if (!session) throw redirect({ to: '/login', search: { redirect: path } });
  return session.user.id;
}

export function workspaceNotice(mode: AccessMode): string | null {
  switch (mode) {
    case 'read_only': return 'Subscription expired: view only. Renew to edit.';
    case 'billing_only': return 'Complete payment to activate your workspace.';
    case 'suspended': return 'Your workspace is suspended. Contact your school administrator.';
    default: return null;
  }
}

export function profileComplete(school: { onboarding_completed: boolean } | null | undefined) {
  return school?.onboarding_completed === true;
}