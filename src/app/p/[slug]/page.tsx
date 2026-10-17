import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, StatTile, SectionHead, Pill } from "@/components/glass";
import { Bars, AdoptionChart } from "@/components/charts";
import { projectBySlug, DETAIL, PROJECTS, type Project } from "@/lib/sample";
import { getVipDetail } from "@/lib/vip-data";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p) notFound();
  if (slug === "vip-taxi") return <VipReal p={p} />;
  return <SampleDetail p={p} />;
}

function Header({ p, subtitle }: { p: Project; subtitle: string }) {
  return (
    <>
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-[13px] font-medium text-slate-500 hover:text-slate-800">
        ← Hammasi
      </Link>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{p.name}</h1>
          <p className="mt-1 text-[13px] text-slate-500">{subtitle}</p>
        </div>
        <Pill tone={p.active ? "emerald" : "slate"}>{p.active ? "faol" : "pauza"}</Pill>
      </header>
    </>
  );
}

// ---- Real VIP-TAXI (live, read-only) --------------------------------------
async function VipReal({ p }: { p: Project }) {
  let d: Awaited<ReturnType<typeof getVipDetail>> | null = null;
  let err: string | null = null;
  try {
    d = await getVipDetail();
  } catch (e) {
    err = (e as Error).message;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Header p={p} subtitle={`ERP · ${p.host} · haqiqiy ma'lumot (faqat o'qish)`} />

      {err || !d ? (
        <Card className="p-8 text-center text-[14px] text-rose-600">Bazaga ulanib bo'lmadi: {err ?? "ma'lumot yo'q"}</Card>
      ) : (
        <>
          <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Jami hodisa" value={d.totalEvents.toLocaleString("ru-RU")} sub={d.rangeFrom ? `${d.rangeFrom} — ${d.rangeTo}` : undefined} tone="brand" />
            <StatTile label="Faol hisob" value={d.activeAccounts} sub="harakat qilgan" tone="accent" />
            <StatTile label="Faol operator" value={d.activeOperators} sub={`${d.operatorSeats} operatordan`} tone="amber" />
            <StatTile label="Haftalik faol" value={d.weeklyActive} sub="oxirgi 7 kun" />
          </div>

          <Card className="mb-6 p-4">
            <p className="text-[12.5px] leading-relaxed text-slate-600">
              Bu <b>audit jurnali</b> asosida: qidiruv, karta ochish, kirish/chiqish, tahrir va h.k.
              Oddiy <b>sahifa va tab ko'rishlari kuzatilmaydi</b> — shuning uchun jim ko'rib yuradigan
              operatorlar bu yerda ko'rinmaydi. Buning uchun ilovaga qo'shiladigan kuzatuv kerak (hozir pauzada).
            </p>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5 lg:col-span-2">
              <SectionHead title="Harakatlar reytingi" hint="Audit jurnalidagi harakatlar — eng ko'pi" />
              <Bars items={d.actions} />
            </Card>

            <Card className="p-5">
              <SectionHead title="Adaptatsiya" hint="Haftalik faol hisoblar (audit bo'yicha)" />
              {d.adoption.length > 1 ? (
                <AdoptionChart data={d.adoption} seats={d.operatorSeats} />
              ) : (
                <p className="py-8 text-center text-[13px] text-slate-500">Hali grafik uchun yetarli hafta yo'q.</p>
              )}
            </Card>

            {d.parks.length > 0 && (
              <Card className="p-5">
                <SectionHead title="Parklar" hint="Park bo'yicha harakat (nomlar keyin ulanadi)" />
                <Bars items={d.parks} />
              </Card>
            )}
          </div>
        </>
      )}
    </main>
  );
}

// ---- Sample (other projects) ----------------------------------------------
function SampleDetail({ p }: { p: Project }) {
  const d = DETAIL[p.slug];
  const pct = Math.round((p.weeklyActive / p.seats) * 100);
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <Header p={p} subtitle={`${p.kind === "erp" ? "ERP" : "Dashboard"} · ${p.host} · sample ma'lumot`} />
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Haftalik faol" value={p.weeklyActive} sub={`${p.seats} dan`} tone="brand" />
        <StatTile label="Qamrov" value={`${pct}%`} sub="faol / ruxsatli" tone="accent" />
        <StatTile label="Bo'limlar" value={d?.sections.length ?? "—"} sub="kuzatilgan" />
        <StatTile label="Ishlatilmagan" value={d?.unused.length ?? "—"} sub="bo'lim" tone="amber" />
      </div>
      {!d ? (
        <Card className="p-8 text-center text-[14px] text-slate-500">Bu loyiha uchun sample ma'lumot hali yo'q.</Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5 lg:col-span-2">
            <SectionHead title="Bo'limlar reytingi" hint="Qaysi bo'lim ko'proq ochiladi" />
            <Bars items={d.sections} />
          </Card>
          <Card className="p-5">
            <SectionHead title="Adaptatsiya" hint={`Ishga tushgandan beri · haftalik faol (${p.seats} dan)`} />
            <AdoptionChart data={d.adoption} seats={p.seats} />
          </Card>
          <Card className="p-5 lg:col-span-2">
            <SectionHead title="Ishlatilmagan bo'limlar" hint="Deyarli hech ochilmaydi" />
            <div className="flex flex-wrap gap-2">
              {d.unused.map((u) => (
                <span key={u} className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-[13px] font-medium text-amber-700">{u}</span>
              ))}
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
