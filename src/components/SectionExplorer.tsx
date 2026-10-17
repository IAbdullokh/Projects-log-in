"use client";

import { useState } from "react";
import clsx from "clsx";

type Sub = { name: string; users: number; calls: number };
type Section = { key: string; name: string; users: number; calls: number; subs: Sub[] };

export function SectionExplorer({ sections }: { sections: Section[] }) {
  const [sel, setSel] = useState<string>(sections[0]?.key ?? "");
  const maxU = Math.max(1, ...sections.map((s) => s.users));
  const active = sections.find((s) => s.key === sel) ?? sections[0];
  const subs = active ? active.subs.slice().sort((a, b) => b.users - a.users) : [];
  const maxSub = Math.max(1, ...subs.map((s) => s.users));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div>
        <div className="mb-2 text-[12px] font-medium text-slate-500">Bo'lim · nechta odam ochgan — bosing</div>
        <div className="flex flex-col gap-1">
          {sections.map((s) => {
            const pct = Math.max(4, Math.round((s.users / maxU) * 100));
            const on = s.key === sel;
            return (
              <button
                key={s.key}
                onClick={() => setSel(s.key)}
                className={clsx(
                  "grid grid-cols-[minmax(6rem,8rem)_1fr_auto] items-center gap-3 rounded-xl px-2.5 py-1.5 text-left transition",
                  on ? "bg-brand-50" : "hover:bg-slate-100",
                )}
              >
                <span className={clsx("truncate text-[13px]", on ? "font-semibold text-brand-700" : "text-slate-700")}>{s.name}</span>
                <span className="h-4 overflow-hidden rounded-full bg-slate-100">
                  <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: on ? "var(--chart-blue)" : "var(--chart-slate)" }} />
                </span>
                <span className="num w-7 text-right text-[13px] font-semibold text-slate-900">{s.users}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-inset ring-slate-200">
        <div className="mb-2 flex items-baseline justify-between px-1">
          <span className="text-[13px] font-semibold text-slate-800">{active?.name}</span>
          <span className="num text-[11px] text-slate-400">{active?.users} odam · {active?.calls} so'rov</span>
        </div>
        {subs.length > 0 ? (
          <div className="flex flex-col gap-1">
            {subs.map((sub) => {
              const pct = Math.max(4, Math.round((sub.users / maxSub) * 100));
              return (
                <div key={sub.name} className="grid grid-cols-[minmax(6rem,9rem)_1fr_auto] items-center gap-3 px-1 py-0.5" title={`${sub.name}: ${sub.users} odam, ${sub.calls} so'rov`}>
                  <span className="truncate text-[12.5px] text-slate-600">{sub.name}</span>
                  <span className="h-3.5 overflow-hidden rounded-full bg-slate-200/70">
                    <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: "var(--chart-teal)" }} />
                  </span>
                  <span className="num w-7 text-right text-[12.5px] font-semibold text-slate-800">{sub.users}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="py-8 text-center text-[13px] text-slate-400">Ichki qismlarga bo'linmagan.</p>
        )}
      </div>
    </div>
  );
}
