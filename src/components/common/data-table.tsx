import { useMemo, useState, type ReactNode } from "react";
import { Search, Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "./empty-state";
import { LoadingState, ErrorState } from "./states";

export type Column<T> = { key: string; header: string; cell: (row: T) => ReactNode; className?: string };
export type Filter<T> = { key: string; label: string; options: { value: string; label: string }[]; match: (row: T, value: string) => boolean };

export function DataTable<T>({
  columns, rows, getRowId, searchPlaceholder = "Search…", searchText, filters = [],
  loading, error, empty, toolbar,
}: {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  searchPlaceholder?: string;
  searchText?: (row: T) => string;
  filters?: Filter<T>[];
  loading?: boolean;
  error?: string;
  empty: { icon?: LucideIcon; title: string; description: string; action?: ReactNode };
  toolbar?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (q && searchText && !searchText(r).toLowerCase().includes(q)) return false;
      return filters.every((f) => {
        const v = values[f.key];
        return !v || v === "all" || f.match(r, v);
      });
    });
  }, [rows, query, values, filters, searchText]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input aria-label="Search table" placeholder={searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
          </div>
          {filters.map((f) => (
            <Select key={f.key} value={values[f.key] ?? "all"} onValueChange={(v) => setValues((s) => ({ ...s, [f.key]: v }))}>
              <SelectTrigger aria-label={f.label} className="sm:w-44"><SelectValue placeholder={f.label} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All {f.label.toLowerCase()}</SelectItem>
                {f.options.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          ))}
        </div>
        {toolbar}
      </div>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={empty.icon ?? Inbox} title={rows.length ? "No matching results" : empty.title}
          description={rows.length ? "Try a different search or clear filters." : empty.description}
          action={rows.length ? undefined : empty.action} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>{columns.map((c) => <TableHead key={c.key} className={c.className}>{c.header}</TableHead>)}</TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={getRowId(r)}>
                  {columns.map((c) => <TableCell key={c.key} className={c.className}>{c.cell(r)}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
