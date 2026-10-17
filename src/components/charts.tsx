import clsx from "clsx";

// Chart hues (defined as CSS vars in globals.css; they flip for dark mode).
// Categorical order is fixed — assigned by position, never cycled.
const CAT = ["var(--chart-blue)", "var(--chart-teal)", "var(--chart-violet)", "var(--chart-amber)", "var(--chart-rose)", "var(--chart-slate)"];

/**
 * Horizontal bar ranking (magnitude). Single hue by default; pass `categorical`
 * to colour each row by position. Direct value labels on every row (the contrast
 * relief the palette needs), 4px rounded data-ends, recessive track.
 */
export function Bars({
  items,
  categorical = false,
  format = (n: number) => n.toLocaleString("ru-RU"),
}: {
  items: { label: string; value: number; note?: string }[];
  categorical?: boolean;
  format?: (n: number) => string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((it, i) => {
        const pct = Math.max(2, Math.round((it.value / max) * 100));
        const color = categorical ? CAT[i % CAT.length] : "var(--chart-blue)";
        return (
          <div key={it.label} className="grid grid-cols-[minmax(8rem,12rem)_1fr_auto] items-center gap-3" title={`${it.label}: ${format(it.value)}`}>
            <div className="truncate text-[13px] text-slate-700">
              {it.label}
              {it.note && <span className="ml-1 text-[11px] text-slate-400">· {it.note}</span>}
            </div>
            <div className="h-5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
            <div className="num w-12 text-right text-[13px] font-semibold text-slate-900">{format(it.value)}</div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Adoption area: distinct active people per week (change over time). One hue,
 * 2px line, markers, direct label on the last point, recessive baseline.
 */
export function AdoptionChart({
  data,
  seats,
  width = 520,
  height = 160,
}: {
  data: { week: string; active: number }[];
  seats?: number;
  width?: number;
  height?: number;
}) {
  if (!data.length) return null;
  const padL = 8;
  const padR = 28;
  const padT = 12;
  const padB = 24;
  const w = width - padL - padR;
  const h = height - padT - padB;
  const maxY = Math.max(seats ?? 0, ...data.map((d) => d.active), 1);
  const x = (i: number) => padL + (data.length === 1 ? w / 2 : (i / (data.length - 1)) * w);
  const y = (v: number) => padT + h - (v / maxY) * h;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.active).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${(padT + h).toFixed(1)} L${x(0).toFixed(1)},${(padT + h).toFixed(1)} Z`;
  const last = data[data.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label="Adaptatsiya: haftalik faol foydalanuvchilar">
      <defs>
        <linearGradient id="adopt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--chart-teal)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--chart-teal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* baseline */}
      <line x1={padL} y1={padT + h} x2={padL + w} y2={padT + h} stroke="var(--chart-axis)" strokeWidth="1" />
      <path d={area} fill="url(#adopt)" />
      <path d={line} fill="none" stroke="var(--chart-teal)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={d.week}>
          <circle cx={x(i)} cy={y(d.active)} r="3.5" fill="var(--chart-teal)" />
          <text x={x(i)} y={padT + h + 15} textAnchor="middle" fontSize="10" fill="var(--chart-slate)">
            {d.week}
          </text>
        </g>
      ))}
      <text x={x(data.length - 1) + 6} y={y(last.active) - 6} fontSize="11" fontWeight="700" fill="var(--chart-teal)">
        {last.active}
      </text>
    </svg>
  );
}

/** Thin legend row (identity, never colour-alone — always a label beside each swatch). */
export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5 text-[12px] text-slate-600">
          <span className={clsx("h-2.5 w-2.5 shrink-0 rounded-[3px]")} style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

export { CAT as CHART_COLORS };
