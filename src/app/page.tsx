import { Suspense } from "react";
import Link from "next/link";
import { Card, SectionHead, Pill } from "@/components/glass";
import { Bars } from "@/components/charts";
import { PROJECTS, type Project } from "@/lib/sample";
import { getVipHomeStat } from "@/lib/vip-data";

export const dynamic = "force-dynamic";

const TABS = [
  { k: "all", label: "Hammasi", href: "/" },
  { k: "erp", label: "ERP", href: "/?view=erp" },
  { k: "dash", label: "Dashboardlar", href: "/?view=dash" },
];

export default async function Home({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view = "all" } = await searchParams;
  const v = ["all", "erp", "dash"].includes(view) ? view : "all";
  const erp = PROJECTS.filter((p) => p.kind === "erp");
  const dash = PROJECTS.filter((p) => p.kind === "dashboard");
  const showErp = v === "all" || v === "erp";
  const showDash = v === "all" || v === "dash";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Studio</h1>
          <p className="mt-1 text-[13px] text-slate-500">Mahsulot foydalanish tahlili</p>
        </div>
        <div className="segmented grid-flow-col auto-cols-max">
          {TABS.map((t) => (
            <Link key={t.k} href={t.href} aria-current={v === t.k ? "page" : undefined}>
              {t.label}
            </Link>
          ))}
        </div>
      </header>

      {showErp && (
        <section className="mb-10">
          <SectionHead title="ERP tizimlari" hint="VIP-TAXI — haqiqiy ma'lumot; qolganlari namuna" />
          <div className="grid gap-3 sm:grid-cols-2">
            {erp.map((p) =>
              p.slug === "vip-taxi" ? (
                <Suspense key={p.slug} fallback={<CardShell p={p} loading href={`/p/${p.slug}`} />}>
                  <VipCardReal p={p} />
                </Suspense>
              ) : (
                <CardShell key={p.slug} p={p} sample href={`/p/${p.slug}`} />
              ),
            )}
          </div>
        </section>
      )}

      {showDash && (
        <section>
          <SectionHead title="Dashboardlar" hint="Reyting — namuna (ulangandan keyin haqiqiy bo'ladi)" />
          <Card className="mb-4 p-5">
            <Bars items={dash.map((p) => ({ label: p.name, value: p.weeklyActive }))} format={(n) => `${n}`} />
            <p className="mt-3 text-[12px] text-slate-400">namuna · haftalik faol foydalanuvchilar</p>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {dash.map((p) => <CardShell key={p.slug} p={p} sample href={`/p/${p.slug}`} />)}
          </div>
        </section>
      )}
    </main>
  );
}

// Real VIP card (live, read-only). Falls back to a plain card on error.
async function VipCardReal({ p }: { p: Project }) {
  try {
    const s = await getVipHomeStat();
    return <CardShell p={p} weeklyActive={s.weeklyActive} seats={s.seats} href={`/p/${p.slug}`} />;
  } catch {
    return <CardShell p={p} href={`/p/${p.slug}`} error />;
  }
}

function CardShell({
  p,
  href,
  weeklyActive,
  seats,
  sample,
  loading,
  error,
}: {
  p: Project;
  href: string;
  weeklyActive?: number;
  seats?: number;
  sample?: boolean;
  loading?: boolean;
  error?: boolean;
}) {
  const wa = weeklyActive ?? p.weeklyActive;
  const st = seats ?? p.seats;
  const pct = Math.round((wa / st) * 100);
  return (
    <Link href={href} className="group block">
      <Card className="p-4 transition-transform duration-200 ease-ios group-hover:-translate-y-0.5 group-active:scale-[0.99]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-slate-900">{p.name}</div>
            <div className="text-[12px] text-slate-500">{p.kind === "erp" ? "ERP" : "Dashboard"} · {p.host}</div>
          </div>
          {sample ? <Pill tone="amber">namuna</Pill> : error ? <Pill tone="rose"> xato</Pill> : <Pill tone="emerald">haqiqiy</Pill>}
        </div>
        {loading ? (
          <div className="mt-3 h-10 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <div className="num text-xl font-bold text-slate-900">
                  {wa}
                  <span className="ml-1 text-[12px] font-medium text-slate-400">/ {st}</span>
                </div>
                <div className="text-[11px] text-slate-500">haftalik faol</div>
              </div>
              <div className="num text-[13px] font-semibold text-brand-600">{Number.isFinite(pct) ? pct : 0}%</div>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(3, Number.isFinite(pct) ? pct : 0)}%` }} />
            </div>
          </>
        )}
      </Card>
    </Link>
  );
}
