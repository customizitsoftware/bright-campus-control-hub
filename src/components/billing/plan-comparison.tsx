import { Check, Minus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { entitlementLabel, formatMinor, priceFor, type Catalog, type Interval } from '@/lib/backend-model';
export function IntervalToggle({ value, onChange }: { value: Interval; onChange: (value: Interval) => void }) {
  return <Tabs value={value} onValueChange={v => onChange(v === 'annual' ? 'annual' : 'monthly')}><TabsList aria-label="Billing interval"><TabsTrigger value="monthly">Monthly</TabsTrigger><TabsTrigger value="annual">Annual</TabsTrigger></TabsList></Tabs>;
}
export function PlanComparison({ catalog, interval, selected, onSelect }: { catalog: Catalog; interval: Interval; selected?: string; onSelect?: (code: string) => void }) {
  if (!catalog.plans.length) return <p role="status" className="py-12 text-center text-muted-foreground">No public plans are available yet.</p>;
  return <div className="space-y-10"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{catalog.plans.map(plan => {
    const price = priceFor(catalog, plan.id, interval);
    return <article key={plan.id} className={`flex min-w-0 flex-col rounded-lg border bg-card p-6 shadow-card ${selected === plan.code ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
      <h2 className="text-xl font-semibold">{plan.name}</h2><p className="mt-2 min-h-10 text-sm text-muted-foreground">{plan.description}</p><p className="mt-6 break-words text-3xl font-semibold tabular-nums">{price ? formatMinor(price.amount_minor) : 'Unavailable'}</p><p className="mt-1 text-sm text-muted-foreground">{interval === 'annual' ? 'per year' : 'per month'}</p>
      {plan.trial_days > 0 && <p className="mt-4 text-sm font-medium text-teal">{plan.trial_days}-day free trial</p>}
      <ul className="my-6 flex-1 space-y-3 text-sm">{catalog.features.map(feature => {
        const e = catalog.entitlements.find(row => row.plan_id === plan.id && row.feature_key === feature.key);
        return <li key={feature.key} className="flex items-start gap-2">{e?.enabled ? <Check className="mt-0.5 size-4 shrink-0 text-success" /> : <Minus className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}<span><span className="block">{feature.name}</span><span className="text-xs text-muted-foreground">{entitlementLabel(e, feature)}</span></span></li>;
      })}</ul>
      {onSelect ? <Button type="button" disabled={!price} variant={selected === plan.code ? 'secondary' : 'default'} onClick={() => onSelect(plan.code)}>{selected === plan.code ? 'Selected' : 'Select plan'}</Button> : price ? <Button asChild><Link to="/register" search={{ plan: plan.code, interval }}>Choose {plan.name}</Link></Button> : <Button disabled title="No price is available for this interval">Unavailable</Button>}
    </article>;
  })}</div><section aria-labelledby="comparison"><h2 id="comparison" className="mb-4 text-lg font-semibold">Compare every feature</h2><div className="overflow-x-auto"><table className="w-full min-w-max text-left text-sm"><thead><tr className="border-b border-border"><th className="p-3 font-medium">Feature</th>{catalog.plans.map(p => <th key={p.id} className="p-3 font-medium">{p.name}</th>)}</tr></thead><tbody>{catalog.features.map(f => <tr key={f.key} className="border-b border-border"><th scope="row" className="p-3 font-medium">{f.name}</th>{catalog.plans.map(p => <td key={p.id} className="p-3">{entitlementLabel(catalog.entitlements.find(e => e.plan_id === p.id && e.feature_key === f.key), f)}</td>)}</tr>)}</tbody></table></div></section></div>;
}
