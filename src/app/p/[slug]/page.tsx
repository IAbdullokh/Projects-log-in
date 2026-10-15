import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, StatTile, SectionHead, Pill } from "@/components/glass";
import { Bars, AdoptionChart, Legend, CHART_COLORS } from "@/components/charts";
import { projectBySlug, DETAIL, PROJECTS } from "@/lib/sample";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  const d = DETAIL[slug];
  const pct = Math.round((p.weeklyActive / p.seats) * 100);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-[13px] font-medium text-slate-500 hover:text-slate-800">
        ← Hammasi
      </Link>

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{p.name}</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            {p.kind === "erp" ? "ERP" : "Dashboard"} · {p.host} · ishga tushgan {fmtDate(p.launch)}
          </p>
        </div>
        <Pill tone={p.active ? "emerald" : "slate"}>{p.active ? "faol" : "pauza"}</Pill>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Haftalik faol" value={p.weeklyActive} sub={`${p.seats} dan`} tone="brand" />
        <StatTile label="Qamrov" value={`${pct}%`} sub="faol / ruxsatli" tone="accent" />
        <StatTile label="Bo'limlar" value={d?.sections.length ?? "—"} sub="kuzatilgan" />
        <StatTile label="Ishlatilmagan" value={d?.unused.length ?? "—"} sub="bo'lim" tone="amber" />
      </div>

      {!d ? (
        <Card className="p-8 text-center text-[14px] text-slate-500">
          Bu loyiha uchun sample ma'lumot hali yo'q.
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Section ranking */}
          <Card className="p-5 lg:col-span-2">
            <SectionHead title="Bo'limlar reytingi" hint="Qaysi bo'lim ko'proq ochiladi" />
            <Bars items={d.sections} />
          </Card>

          {/* Adoption */}
          <Card className="p-5">
            <SectionHead title="Adaptatsiya" hint={`Ishga tushgandan beri · haftalik faol odam (${p.seats} dan)`} />
            <AdoptionChart data={d.adoption} seats={p.seats} />
          </Card>

          {/* Parks (multi-tenant) */}
          {d.parks && (
            <Card className="p-5">
              <SectionHead title="Parklar" hint="Qaysi park ko'proq ishlatadi" />
              <Bars items={d.parks} categorical />
              <div className="mt-3">
                <Legend items={d.parks.map((pk, i) => ({ label: pk.label, color: CHART_COLORS[i % CHART_COLORS.length] }))} />
              </div>
            </Card>
          )}

          {/* Unused */}
          <Card className="p-5 lg:col-span-2">
            <SectionHead title="Ishlatilmagan bo'limlar" hint="Deyarli hech ochilmaydi — e'tibor talab qiladi" />
            <div className="flex flex-wrap gap-2">
              {d.unused.map((u) => (
                <span key={u} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[13px] font-medium text-amber-700">
                  {u}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}

function fmtDate(iso: string): string {
  const [y, m, dd] = iso.split("-");
  const months = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
  return `${Number(dd)} ${months[Number(m) - 1]} ${y}`;
}
