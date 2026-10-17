// Real dashboard usage from collected server-log counts (no PII, no IPs stored).
// Snapshots live in src/lib/data/<project>.json, refreshed from nginx logs.
import hilol from "@/lib/data/hilol.json";

export type DayStat = { date: string; users: number; calls: number };

export type DashUsage = {
  days: DayStat[];
  avgUsers: number; // avg distinct daily visitors over the last 7 days
  peakUsers: number;
  totalCalls: number;
  lastDate: string | null;
  source: string;
};

function summarize(days: DayStat[], source: string, updated: string | null): DashUsage {
  const last7 = days.slice(-7);
  const avgUsers = last7.length ? Math.round(last7.reduce((s, d) => s + d.users, 0) / last7.length) : 0;
  const peakUsers = days.length ? Math.max(...days.map((d) => d.users)) : 0;
  const totalCalls = days.reduce((s, d) => s + d.calls, 0);
  return { days, avgUsers, peakUsers, totalCalls, lastDate: updated, source };
}

const REGISTRY: Record<string, DashUsage | undefined> = {
  hilol: summarize(hilol.days as DayStat[], hilol.source, hilol.updated ?? null),
};

/** Real usage for a dashboard, or null if it isn't connected yet. */
export function getDashUsage(slug: string): DashUsage | null {
  return REGISTRY[slug] ?? null;
}
