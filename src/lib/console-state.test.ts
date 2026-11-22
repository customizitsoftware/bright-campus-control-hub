import { describe, expect, it } from 'vitest';
import { isRedirect } from '@tanstack/react-router';
import { profileComplete, requireConsoleSession, workspaceNotice } from './console-state';

describe('console session gate', () => {
  it('sends signed-out visitors to login with their current path', () => {
    try {
      requireConsoleSession(null, '/setup?school=123');
      throw new Error('Expected a login redirect');
    } catch (error) {
      expect(isRedirect(error)).toBe(true);
      if (!isRedirect(error)) throw error;
      expect(error.options.to).toBe('/login');
      expect(error.options.search).toEqual({ redirect: '/setup?school=123' });
    }
  });
  it('allows a signed-in user to enter the workspace loader', () => {
    expect(requireConsoleSession({ user: { id: 'signed-in-user' } }, '/dashboard')).toBe('signed-in-user');
  });
});

describe('server-reported workspace state', () => {
  it('shows read-only state only when reported by the server', () => {
    expect(workspaceNotice('read_only')).not.toBeNull();
    expect(workspaceNotice('full')).toBeNull();
  });
  it('shows the payment-required state', () => {
    expect(workspaceNotice('billing_only')).not.toBeNull();
    expect(workspaceNotice('none')).toBeNull();
  });
  it('shows the suspended state', () => {
    expect(workspaceNotice('suspended')).not.toBeNull();
  });
  it('completes the school-profile checklist step only after onboarding is complete', () => {
    expect(profileComplete({ onboarding_completed: true })).toBe(true);
    expect(profileComplete({ onboarding_completed: false })).toBe(false);
    expect(profileComplete(null)).toBe(false);
  });
});