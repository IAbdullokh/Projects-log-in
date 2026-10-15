import { Card, StatTile, SectionHead, Pill } from "@/components/glass";

// NOTE: placeholder content — proves the glass design renders.
// Real data (VIP-TAXI usage) is wired in the next step.

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Studio</h1>
          <p className="mt-1 text-[13px] text-slate-500">Mahsulot foydalanish tahlili · internal</p>
        </div>
        <div className="segmented grid-flow-col auto-cols-max">
          <button aria-current="page" type="button">ERP</button>
          <button type="button">Dashboardlar</button>
        </div>
      </header>

      <section className="mb-8">
        <SectionHead title="ERP tizimlari" hint="Qancha va qanday ishlatilmoqda" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Loyihalar" value="2" sub="VIP-TAXI, Applekor" />
          <StatTile label="Faol xodimlar" value="—" sub="oxirgi 7 kun" tone="brand" />
          <StatTile label="Eng ko'p bo'lim" value="—" tone="accent" />
          <StatTile label="Ishlatilmagan" value="—" sub="bo'limlar" tone="amber" />
        </div>
      </section>

      <section>
        <SectionHead title="Loyihalar" hint="VIP-TAXI birinchi ulanadi" />
        <Card className="divide-y divide-slate-200 overflow-hidden">
          <ProjectRow name="VIP-TAXI" kind="ERP · Railway" status="tayyor" tone="emerald" />
          <ProjectRow name="Applekor ERP" kind="ERP · Vercel" status="navbatda" tone="slate" />
        </Card>
      </section>
    </main>
  );
}

function ProjectRow({
  name,
  kind,
  status,
  tone,
}: {
  name: string;
  kind: string;
  status: string;
  tone: "emerald" | "slate";
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div>
        <div className="text-[14px] font-semibold text-slate-900">{name}</div>
        <div className="text-[12px] text-slate-500">{kind}</div>
      </div>
      <Pill tone={tone}>{status}</Pill>
    </div>
  );
}
