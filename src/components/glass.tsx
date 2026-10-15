import clsx from "clsx";

/** Frosted-glass container. */
export function Card({
  className,
  dense,
  children,
}: {
  className?: string;
  dense?: boolean;
  children: React.ReactNode;
}) {
  return <div className={clsx("card", dense && "card-dense", className)}>{children}</div>;
}

/** A single KPI tile. */
export function StatTile({
  label,
  value,
  sub,
  tone = "slate",
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  tone?: "slate" | "brand" | "accent" | "emerald" | "amber" | "rose" | "violet";
}) {
  const toneText: Record<string, string> = {
    slate: "text-slate-900",
    brand: "text-brand-600",
    accent: "text-accent-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    violet: "text-violet-600",
  };
  return (
    <Card className="p-4">
      <div className="text-[12px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={clsx("num mt-1.5 text-2xl font-bold leading-none", toneText[tone])}>{value}</div>
      {sub != null && <div className="mt-1.5 text-[12px] text-slate-500">{sub}</div>}
    </Card>
  );
}

/** Section heading with optional right-side slot. */
export function SectionHead({
  title,
  hint,
  right,
}: {
  title: string;
  hint?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>
        {hint && <p className="mt-0.5 text-[12px] text-slate-500">{hint}</p>}
      </div>
      {right}
    </div>
  );
}

/** Small status pill. */
export function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "brand" | "emerald" | "amber" | "rose";
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600",
    brand: "bg-brand-50 text-brand-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={clsx("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
