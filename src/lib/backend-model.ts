import type { Database, Tables } from '@/integrations/supabase/types';

export type Interval = Database['public']['Enums']['billing_interval'];
export type SchoolRole = Database['public']['Enums']['school_role'];
export type AccessMode = 'full' | 'read_only' | 'billing_only' | 'suspended' | 'none';
export type Catalog = { plans: Tables<'plans'>[]; prices: Pick<Tables<'plan_prices'>, 'id' | 'plan_id' | 'interval' | 'currency' | 'amount_minor'>[]; features: Tables<'features'>[]; entitlements: Tables<'plan_entitlements'>[] };

export function formatMinor(amount: number | null, currency = 'NGN') {
  if (amount === null || !Number.isFinite(amount)) return '—';
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount / 100);
}
export function safeDestination(value: unknown, fallback = '/dashboard') {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !/[\\\r\n]/.test(value) ? value : fallback;
}
export function accessMode(value: string | null): AccessMode {
  return value === 'full' || value === 'read_only' || value === 'billing_only' || value === 'suspended' ? value : 'none';
}
export function priceFor(catalog: Catalog, planId: string, interval: Interval) {
  return catalog.prices.find(p => p.plan_id === planId && p.interval === interval && p.currency === 'NGN');
}
// "1 campuses" reads wrong, so singularise the unit when the limit is exactly one.
const SINGULAR_UNITS: Record<string, string> = { students: 'student', accounts: 'account', campuses: 'campus', credits: 'credit' };
export function entitlementLabel(entitlement: Tables<'plan_entitlements'> | undefined, feature: Tables<'features'>) {
  if (!entitlement?.enabled) return 'Not included';
  if (feature.kind === 'boolean') return 'Included';
  if (entitlement.is_unlimited) return 'Unlimited';
  if (entitlement.limit_value == null) return 'Not specified';
  const unit = feature.unit && entitlement.limit_value === 1 ? (SINGULAR_UNITS[feature.unit] ?? feature.unit) : feature.unit;
  return `${entitlement.limit_value.toLocaleString('en-NG')}${unit ? ` ${unit}` : ''}`;
}
export const dateTime = (value: string | null) => value ? new Date(value).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Lagos' }) : '—';
