import { useQuery } from '@tanstack/react-query';
import { useSchool } from '@/components/layout/school-context';
import { entitlementQuery } from '@/lib/backend-queries';
/** UI hints only. Postgres remains the enforcement boundary for every operation. */
export function useEntitlement(featureKey: string) {
  const school = useSchool();
  const query = useQuery({ ...entitlementQuery(school.selected?.school_id ?? '', featureKey), enabled: !!school.selected });
  return { hasFeature: query.data?.hasFeature ?? false, enabled: query.data?.entitlement?.enabled ?? false, limit: query.data?.entitlement?.limit_value ?? null, unlimited: query.data?.entitlement?.is_unlimited ?? false, isLoading: query.isPending, error: query.error };
}
