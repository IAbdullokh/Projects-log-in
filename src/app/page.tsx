import Link from "next/link";
import { Card, StatTile, SectionHead, Pill } from "@/components/glass";
import { Bars } from "@/components/charts";
import { PROJECTS, DETAIL, type Project } from "@/lib/sample";

// Sample data — designing the UI. Real figures plug in later.

export default function Home() {
  const erp = PROJECTS.filter((p) => p.kind === "erp");
  const dash = PROJECTS.filter((p) => p.kind === "dashboard");
  const vip = DETAIL["vip-taxi"];
  const topSection = vip?.sections[0];
  const unusedCount = vip?.unused.length ?? 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Studio</h1>
          <p className="mt-1 text-[13px] text-slate-500">Mahsulot foydalanish tahlili · sample ma'lumot</p>
        </div>
        <div className="segmented grid-flow-col auto-cols-max">
          <button aria-current="page" type="button">Hammasi</button>
          <button type="button">ERP</button>
          <button type="button">Dashboardlar</button>
        </div>
      </header>

      {/* ERP */}
      <section className="mb-10">
        <SectionHead title="ERP tizimlari" hint="Qancha va qaysi bo'lim ishlatilmoqda" />
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Loyihalar" value={erp.length} sub="VIP-TAXI, Applekor" />
          <StatTile label="Haftalik faol" value={erp.reduce((s, p) => s + p.weeklyActive, 0)} sub="odam · oxirgi 7 kun" tone="brand" />
          <StatTile label="Eng ko'p bo'lim" value={topSection ? topSection.label.split(" ")[0] : "—"} sub={topSection ? topSection.value.toLocaleString("ru-RU") : undefined} tone="accent" />
          <StatTile label="Ishlatilmagan" value={unusedCount} sub="bo'lim (VIP)" tone="amber" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {erp.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
      </section>

      {/* Dashboards */}
      <section>
        <SectionHead title="Dashboardlar" hint="Qaysi mijoz ko'proq ishlatadi — reyting" />
        <Card className="mb-4 p-5">
          <Bars items={dash.map((p) => ({ label: p.name, value: p.weeklyActive }))} format={(n) => `${n}`} />
          <p className="mt-3 text-[12px] text-slate-500">Haftalik faol foydalanuvchilar soni bo'yicha</p>
        </Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dash.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
      </section>
    </main>
  );
}

function ProjectCard({ p }: { p: Project }) {
  const pct = Math.round((p.weeklyActive / p.seats) * 100);
  return (
    <Link href={`/p/${p.slug}`} className="group block">
      <Card className="p-4 transition-transform duration-200 ease-ios group-hover:-translate-y-0.5 group-active:scale-[0.99]">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-slate-900">{p.name}</div>
            <div className="text-[12px] text-slate-500">
              {p.kind === "erp" ? "ERP" : "Dashboard"} · {p.host}
            </div>
          </div>
          <Pill tone={p.active ? "emerald" : "slate"}>{p.active ? "faol" : "pauza"}</Pill>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="num text-xl font-bold text-slate-900">
              {p.weeklyActive}
              <span className="ml-1 text-[12px] font-medium text-slate-400">/ {p.seats}</span>
            </div>
            <div className="text-[11px] text-slate-500">haftalik faol</div>
          </div>
          <div className="num text-[13px] font-semibold text-brand-600">{pct}%</div>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(3, pct)}%` }} />
        </div>
      </Card>
    </Link>
  );
}
