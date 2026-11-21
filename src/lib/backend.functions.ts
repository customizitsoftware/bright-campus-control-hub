import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { Database, Json } from '@/integrations/supabase/types';
import { accessMode, type Catalog } from './backend-model';

function checked<T>(result: { data: T; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}
const schoolInput = z.object({ schoolId: z.string().uuid() });
const pageInput = z.object({ page: z.number().int().min(0).max(100000).default(0) });
const interval = z.enum(['monthly', 'annual']);
export const PAGE_SIZE = 20;

export const getCatalog = createServerFn({ method: 'GET' }).handler(async (): Promise<Catalog> => {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) throw new Error('The connected project’s public configuration is unavailable.');
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      if (headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization');
      headers.set('apikey', key);
      return fetch(input, { ...init, headers });
    } },
  });
  const [plans, prices, features, entitlements] = await Promise.all([
    client.from('plans').select('*').eq('is_active', true).eq('is_public', true).order('sort_order'),
    client.from('plan_prices').select('id,plan_id,interval,currency,amount_minor').eq('is_active', true).eq('currency', 'NGN'),
    client.from('features').select('*').order('sort_order'),
    client.from('plan_entitlements').select('*'),
  ]);
  return { plans: checked(plans) ?? [], prices: checked(prices) ?? [], features: checked(features) ?? [], entitlements: checked(entitlements) ?? [] };
});

export const getWorkspace = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ schoolId: z.string().uuid().optional() }))
  .handler(async ({ context, data }) => {
    const [members, profile, platform] = await Promise.all([
      context.supabase.from('school_members').select('id,school_id,role,status,schools(id,name,slug,country,status)').eq('user_id', context.userId).eq('status', 'active').order('created_at'),
      context.supabase.from('profiles').select('full_name,phone').eq('id', context.userId).maybeSingle(),
      context.supabase.rpc('is_platform_admin'),
    ]);
    const memberships = checked(members) ?? [];
    const selected = data.schoolId ? memberships.find(m => m.school_id === data.schoolId) : memberships[0];
    if (data.schoolId && !selected) throw new Error('You do not have an active membership in this school.');
    const mode = selected ? accessMode(checked(await context.supabase.rpc('school_access_mode', { _school_id: selected.school_id }))) : 'none';
    return { userId: context.userId, memberships, selected: selected ?? null, mode, profile: checked(profile), isPlatformAdmin: checked(platform) };
  });

export const getEntitlement = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(schoolInput.extend({ featureKey: z.string().min(1).max(200) }))
  .handler(async ({ context, data }) => {
    const [feature, entitlement] = await Promise.all([
      context.supabase.rpc('has_feature', { _school_id: data.schoolId, _key: data.featureKey }),
      context.supabase.rpc('get_entitlement', { _school_id: data.schoolId, _key: data.featureKey }),
    ]);
    return { hasFeature: checked(feature), entitlement: checked(entitlement)?.[0] ?? null };
  });

export const registerSchool = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ name: z.string().trim().min(1).max(200), slug: z.string().trim().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), country: z.string().length(2), email: z.string().email(), phone: z.string().trim().max(50), planCode: z.string().min(1), interval, startTrial: z.boolean() }))
  .handler(async ({ context, data }) => checked(await context.supabase.rpc('register_school', {
    _name: data.name, _slug: data.slug, _country: data.country.toUpperCase(), _contact_email: data.email,
    _contact_phone: data.phone, _plan_code: data.planCode, _interval: data.interval, _start_trial: data.startTrial,
  })));

export const checkoutInvoice = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(schoolInput.extend({ planCode: z.string().min(1), interval }))
  .handler(async ({ context, data }): Promise<string | null> => checked(await context.supabase.rpc('create_checkout_invoice', { _school_id: data.schoolId, _plan_code: data.planCode, _interval: data.interval })));

export const cancelSubscription = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(schoolInput.extend({ immediately: z.boolean() }))
  .handler(async ({ context, data }) => {
    checked(await context.supabase.rpc('cancel_subscription', { _school_id: data.schoolId, _immediately: data.immediately }));
    return { ok: true };
  });
export const resumeSubscription = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(schoolInput).handler(async ({ context, data }) => {
    checked(await context.supabase.rpc('resume_subscription', { _school_id: data.schoolId }));
    return { ok: true };
  });

export const getBilling = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(schoolInput.extend({ invoicePage: pageInput.shape.page, paymentPage: pageInput.shape.page }))
  .handler(async ({ context, data }) => {
    const admin = checked(await context.supabase.rpc('has_school_role', { _school_id: data.schoolId, _roles: ['school_admin'] }));
    if (!admin) throw new Error('Only a school administrator can view this billing page.');
    const [subscriptions, invoices, payments] = await Promise.all([
      context.supabase.from('subscriptions').select('*,plans!subscriptions_plan_id_fkey(name,code),pending_plan:plans!subscriptions_pending_plan_id_fkey(name)').eq('school_id', data.schoolId).order('created_at', { ascending: false }).limit(20),
      context.supabase.from('invoices').select('id,number,status,currency,total_minor,due_at,paid_at,created_at').eq('school_id', data.schoolId).order('created_at', { ascending: false }).order('id').range(data.invoicePage * PAGE_SIZE, (data.invoicePage + 1) * PAGE_SIZE),
      context.supabase.from('payments').select('id,provider_reference,amount_minor,currency,status,receipt_number,failure_reason,verified_at,created_at').eq('school_id', data.schoolId).order('created_at', { ascending: false }).order('id').range(data.paymentPage * PAGE_SIZE, (data.paymentPage + 1) * PAGE_SIZE),
    ]);
    const inv = checked(invoices) ?? []; const pay = checked(payments) ?? [];
    const subs = checked(subscriptions) ?? [];
    const current = subs.find(s => s.status !== 'pending_payment') ?? subs[0] ?? null;
    return { subscription: current, invoices: inv.slice(0, PAGE_SIZE), payments: pay.slice(0, PAGE_SIZE), moreInvoices: inv.length > PAGE_SIZE, morePayments: pay.length > PAGE_SIZE };
  });

export const getPlatform = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(pageInput.extend({ search: z.string().max(200).default('') }))
  .handler(async ({ context, data }) => {
    if (!checked(await context.supabase.rpc('is_platform_admin'))) throw new Error('Platform administrator access is required.');
    let schools = context.supabase.from('schools').select('id,name,slug,country,status,created_at', { count: 'exact' }).order('created_at', { ascending: false }).order('id');
    if (data.search) schools = schools.ilike('name', `%${data.search.replace(/[%_]/g, '')}%`);
    const [metrics, list] = await Promise.all([
      context.supabase.rpc('get_platform_metrics'),
      schools.range(data.page * PAGE_SIZE, (data.page + 1) * PAGE_SIZE - 1),
    ]);
    return { metrics: checked(metrics), schools: checked(list) ?? [], total: list.count ?? 0 };
  });

export const initializePayment = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ invoiceId: z.string().uuid(), callbackUrl: z.string().url() }))
  .handler(async ({ context, data }) => {
    // Confirm RLS-visible invoice ownership before sending the authenticated request.
    const invoice = checked(await context.supabase.from('invoices').select('id,status').eq('id', data.invoiceId).maybeSingle());
    if (!invoice || invoice.status !== 'open') throw new Error('This invoice is unavailable or is no longer open.');
    const callback = new URL(data.callbackUrl);
    const origin = getRequestHeader('origin');
    if (!origin || callback.origin !== origin || callback.pathname !== '/payment-return') throw new Error('Invalid payment return address.');
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    const bearer = getRequestHeader('authorization');
    if (!url || !key || !bearer) throw new Error('Payment connection is unavailable.');
    const response = await fetch(`${url}/functions/v1/payments/initialize`, { method: 'POST', headers: { Authorization: bearer, apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ invoice_id: data.invoiceId, callback_url: data.callbackUrl }) });
    if (!response.ok) throw new Error(`Payment initialization failed (${response.status}): ${await response.text()}`);
    const result = z.object({ authorization_url: z.string().url() }).parse(await response.json());
    const destination = new URL(result.authorization_url);
    if (destination.protocol !== 'https:' || destination.username || destination.password) throw new Error('The payment provider returned an unsafe address.');
    return result;
  });

export const verifyPayment = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator(z.object({ reference: z.string().min(1).max(300) }))
  .handler(async ({ data }) => {
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    const bearer = getRequestHeader('authorization');
    if (!url || !key || !bearer) throw new Error('Payment connection is unavailable.');
    const response = await fetch(`${url}/functions/v1/payments/verify`, { method: 'POST', headers: { Authorization: bearer, apikey: key, 'Content-Type': 'application/json' }, body: JSON.stringify({ reference: data.reference }) });
    if (!response.ok) throw new Error(`Payment verification failed (${response.status}): ${await response.text()}`);
    return await response.json() as Json;
  });
