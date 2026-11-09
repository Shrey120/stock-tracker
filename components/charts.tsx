"use client";

import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
const r = (v: number) => "₹" + fmt.format(v);
const shortDate = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
};
const monthYear = (d: string) => {
  const [y, m] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-IN", { month: "short", year: "2-digit", timeZone: "UTC" });
};

const tick = { fill: "var(--muted)", fontSize: 11 };
const tipStyle = {
  background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 8, fontSize: 12, color: "var(--ink)",
};

export function PriceChart({ series, trigger, base }: { series: [string, number][]; trigger?: number | null; base?: number | null }) {
  if (!series?.length) return <p className="text-sm text-muted">No price history on this card.</p>;
  const data = series.map(([date, close]) => ({ date, close }));
  const vals = data.map((d) => d.close).concat(trigger ? [trigger] : [], base ? [base] : []);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.08 || hi * 0.05;
  const step = Math.pow(10, Math.floor(Math.log10(hi - lo + pad * 2 || 1))) / 2;
  const yMin = Math.max(0, Math.floor((lo - pad) / step) * step);
  const yMax = Math.ceil((hi + pad) / step) * step;
  return (
    <div className="h-60" role="img" aria-label={`Price from ${r(data[0].close)} to ${r(data[data.length - 1].close)}`}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pfill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--accent)" stopOpacity={0.18} />
              <stop offset="1" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="date" tickFormatter={monthYear} tick={tick} tickLine={false} axisLine={{ stroke: "var(--line)" }} minTickGap={40} />
          <YAxis domain={[yMin, yMax]} tickCount={6} allowDecimals={false} tickFormatter={(v) => r(v)} tick={tick} tickLine={false} axisLine={false} width={64} />
          <Tooltip contentStyle={tipStyle} labelFormatter={(l) => shortDate(String(l))} formatter={(v: number) => [r(v), "Close"]} />
          {trigger ? <ReferenceLine y={trigger} stroke="var(--bad)" strokeDasharray="4 4" label={{ value: `Trigger ${r(trigger)}`, position: "insideBottomLeft", fill: "var(--bad)", fontSize: 11 }} /> : null}
          {base ? <ReferenceLine y={base} stroke="var(--warn)" strokeDasharray="4 4" label={{ value: `Base ${r(base)}`, position: "insideTopLeft", fill: "var(--warn)", fontSize: 11 }} /> : null}
          <Area type="linear" dataKey="close" stroke="var(--accent)" strokeWidth={2} fill="url(#pfill)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const scenColor = { bear: "var(--bad)", base: "var(--warn)", bull: "var(--good)" } as const;
const scenName = { bear: "Bear", base: "Base", bull: "Bull" } as const;

export function ScenarioChart({ scenarios, cmp }: { scenarios: { case: "bear" | "base" | "bull"; price: number; pct: number }[]; cmp?: number | null }) {
  if (!scenarios?.length) return <p className="text-sm text-muted">No scenarios on this card.</p>;
  const data = scenarios.map((s) => ({ ...s, name: scenName[s.case], label: `${r(s.price)} (${s.pct > 0 ? "+" : ""}${s.pct}%)` }));
  return (
    <div className="h-44" role="img" aria-label={data.map((d) => `${d.name} ${d.label}`).join(", ")}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 96, left: 4, bottom: 4 }}>
          <CartesianGrid stroke="var(--chart-grid)" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => r(v)} tick={tick} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" tick={{ ...tick, fontSize: 12 }} tickLine={false} axisLine={false} width={40} />
          {cmp ? <ReferenceLine x={cmp} stroke="var(--ink)" strokeDasharray="3 3" label={{ value: `Now ${r(cmp)}`, position: "top", fill: "var(--muted)", fontSize: 11 }} /> : null}
          <Bar dataKey="price" barSize={20} radius={[0, 4, 4, 0]} isAnimationActive={false}>
            {data.map((d) => <Cell key={d.case} fill={scenColor[d.case]} />)}
            <LabelList dataKey="label" position="right" fill="var(--ink)" fontSize={12} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart({ points, unit, color = "var(--accent)" }: { points: { date: string; value: number }[]; unit: "rs" | "pct" | "x" | "num"; color?: string }) {
  const f = (v: number) => (unit === "rs" ? r(v) : unit === "pct" ? fmt.format(v) + "%" : unit === "x" ? fmt.format(v) + "x" : fmt.format(v));
  const last = points[points.length - 1];
  const first = points[0];
  const change = points.length > 1 ? last.value - first.value : null;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-lg font-medium num">{f(last.value)}</span>
        {change !== null && (
          <span className="text-xs num text-muted">
            {change > 0 ? "▲" : change < 0 ? "▼" : "■"} {f(Math.abs(change))} since {shortDate(first.date)}
          </span>
        )}
      </div>
      <div className="h-16 mt-1" role="img" aria-label={`${points.length} readings, latest ${f(last.value)}`}>
        <ResponsiveContainer>
          <LineChart data={points} margin={{ top: 6, right: 6, left: 6, bottom: 2 }}>
            <YAxis hide domain={["dataMin", "dataMax"]} />
            <XAxis dataKey="date" hide />
            <Tooltip contentStyle={tipStyle} labelFormatter={(l) => shortDate(String(l))} formatter={(v: number) => [f(v), ""]} separator="" />
            <Line type="linear" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 3, fill: color, strokeWidth: 0 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
