import { Card } from "@/components/glass";

export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 h-4 w-20 rounded bg-slate-100" />
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 rounded-lg bg-slate-100" />
        <div className="h-4 w-64 rounded bg-slate-100" />
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-3 w-20 rounded bg-slate-100" />
            <div className="mt-2 h-7 w-14 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-24 rounded bg-slate-100" />
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <div className="mb-4 h-5 w-40 rounded bg-slate-100" />
        <div className="space-y-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-5 rounded-full bg-slate-100" style={{ width: `${90 - i * 9}%` }} />
          ))}
        </div>
      </Card>
      <p className="mt-4 animate-pulse text-center text-[13px] text-slate-400">Bazadan o'qilmoqda…</p>
    </main>
  );
}
