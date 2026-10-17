// Real dashboard usage from collected server-log counts (no PII, no IPs stored).
// Snapshots live in src/lib/data/<project>.json, refreshed from nginx logs.
import hilol from "@/lib/data/hilol.json";
import powergym from "@/lib/data/powergym.json";

export type DayStat = { date: string; users: number; calls: number };
export type SubFeature = { name: string; users: number; calls: number };
export type Section = { key: string; name: string; users: number; calls: number; subs: SubFeature[] };

export type DashUsage = {
  days: DayStat[];
  avgUsers: number; // avg distinct daily visitors over the last 7 days
  peakUsers: number;
  totalCalls: number;
  peopleTotal: number; // how many DIFFERENT people used it over the whole period
  entries: number; // how many TIMES it was opened (opens, not people)
  sections: Section[]; // which part they use, ranked by distinct users
  lastDate: string | null;
  source: string;
};

type Raw = {
  days: DayStat[];
  people?: number;
  entries?: number;
  sections?: Section[];
  source: string;
  updated?: string | null;
};

function summarize(raw: Raw): DashUsage {
  const days = raw.days;
  const last7 = days.slice(-7);
  const avgUsers = last7.length ? Math.round(last7.reduce((s, d) => s + d.users, 0) / last7.length) : 0;
  const peakUsers = days.length ? Math.max(...days.map((d) => d.users)) : 0;
  const totalCalls = days.reduce((s, d) => s + d.calls, 0);
  const sections = (raw.sections ?? []).slice().sort((a, b) => b.users - a.users || b.calls - a.calls);
  return {
    days,
    avgUsers,
    peakUsers,
    totalCalls,
    peopleTotal: raw.people ?? 0,
    entries: raw.entries ?? 0,
    sections,
    lastDate: raw.updated ?? null,
    source: raw.source,
  };
}

const REGISTRY: Record<string, DashUsage | undefined> = {
  hilol: summarize(hilol as Raw),
  powergym: summarize(powergym as Raw),
};

/** Real usage for a dashboard, or null if it isn't connected yet. */
export function getDashUsage(slug: string): DashUsage | null {
  return REGISTRY[slug] ?? null;
}
