import { queryOptions } from '@tanstack/react-query';
import { getCatalog, getWorkspace, getBilling, getPlatform, getEntitlement } from './backend.functions';
export const catalogQuery = () => queryOptions({ queryKey: ['catalog'], queryFn: () => getCatalog(), staleTime: 60000 });
export const workspaceQuery = (schoolId?: string) => queryOptions({ queryKey: ['workspace', schoolId ?? null], queryFn: () => getWorkspace({ data: schoolId ? { schoolId } : {} }), staleTime: 0 });
export const billingQuery = (schoolId: string, invoicePage: number, paymentPage: number) => queryOptions({ queryKey: ['billing', schoolId, invoicePage, paymentPage], queryFn: () => getBilling({ data: { schoolId, invoicePage, paymentPage } }) });
export const platformQuery = (page: number, search: string) => queryOptions({ queryKey: ['platform', page, search], queryFn: () => getPlatform({ data: { page, search } }) });
export const entitlementQuery = (schoolId: string, featureKey: string) => queryOptions({ queryKey: ['entitlement', schoolId, featureKey], queryFn: () => getEntitlement({ data: { schoolId, featureKey } }), staleTime: 30000 });
