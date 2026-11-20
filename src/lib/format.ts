const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

export const formatNaira = (n: number) => naira.format(n).replace("NGN", "₦").replace(/\s/g, "");
export const formatNairaCompact = (n: number) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}m` : n >= 1_000 ? `₦${Math.round(n / 1_000)}k` : `₦${n}`;
export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
