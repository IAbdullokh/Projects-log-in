// SAMPLE data only — for designing the UI. No connection to any real system.
// Replaced with real figures later. Numbers are illustrative.

export type ProjectKind = "erp" | "dashboard";

export type Project = {
  slug: string;
  name: string;
  kind: ProjectKind;
  host: string;
  active: boolean;
  launch: string; // ISO date
  weeklyActive: number; // distinct people active in the last 7 days (sample)
  seats: number; // rough number of people with access (sample)
};

export const PROJECTS: Project[] = [
  { slug: "vip-taxi", name: "VIP-TAXI", kind: "erp", host: "Railway", active: true, launch: "2026-10-03", weeklyActive: 21, seats: 28 },
  { slug: "applekor", name: "Applekor ERP", kind: "erp", host: "Vercel", active: true, launch: "2026-08-01", weeklyActive: 9, seats: 12 },
  { slug: "thompson", name: "Thompson", kind: "dashboard", host: "VPS", active: true, launch: "2026-07-01", weeklyActive: 14, seats: 20 },
  { slug: "hilol", name: "Hilol", kind: "dashboard", host: "VPS", active: true, launch: "2026-08-20", weeklyActive: 8, seats: 14 },
  { slug: "k-davo", name: "K-davo", kind: "dashboard", host: "VPS", active: true, launch: "2026-09-01", weeklyActive: 6, seats: 9 },
  { slug: "ilmi-hol", name: "Ilmi-hol", kind: "dashboard", host: "VPS", active: true, launch: "2026-09-10", weeklyActive: 5, seats: 10 },
  { slug: "powergym", name: "Power Gym", kind: "dashboard", host: "VPS", active: true, launch: "2026-09-01", weeklyActive: 0, seats: 1 },
  { slug: "ethno", name: "Ethno", kind: "dashboard", host: "VPS", active: true, launch: "2026-08-01", weeklyActive: 0, seats: 1 },
];

// Per-project section usage (sample) — a section/feature and how often it was opened.
export type Section = { label: string; value: number; note?: string };

export type ProjectDetail = {
  sections: Section[]; // ranked by use (desc)
  unused: string[]; // sections essentially never opened
  adoption: { week: string; active: number }[]; // distinct active people per week since launch
  parks?: { label: string; value: number }[]; // only for multi-tenant (VIP = 4 parks)
};

export const DETAIL: Record<string, ProjectDetail> = {
  "vip-taxi": {
    sections: [
      { label: "Haydovchi kartasi", value: 1840 },
      { label: "Karta · Zakazlar", value: 1210 },
      { label: "Karta · Daromad", value: 980 },
      { label: "Dashboard", value: 740 },
      { label: "Karta · GPS", value: 610 },
      { label: "Header · qidiruv", value: 520 },
      { label: "Karta · Hujjatlar", value: 430 },
      { label: "Karta · Smenalar", value: 300 },
      { label: "Skoring", value: 180 },
      { label: "Karta · Fotokontrol", value: 95 },
    ],
    unused: ["Kassa (menyuda havola yo'q)", "Qidiruv sahifasi (eski)", "Karta · Bonuslar"],
    adoption: [
      { week: "03 Okt", active: 11 },
      { week: "10 Okt", active: 18 },
      { week: "17 Okt", active: 22 },
      { week: "24 Okt", active: 21 },
    ],
    parks: [
      { label: "NOMER 1 TAXI", value: 2100 },
      { label: "VIP TAXI", value: 1650 },
      { label: "Yan-Tax", value: 980 },
      { label: "SHOX TAXI", value: 540 },
    ],
  },
};

export function projectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
