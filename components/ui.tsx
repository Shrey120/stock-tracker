import type { Verdict } from "@/lib/types";
import { dueState, titleCase, verdictTone, type DueState } from "@/lib/format";

const toneClass = {
  good: "bg-goodbg text-good",
  warn: "bg-warnbg text-warn",
  bad: "bg-badbg text-bad",
  accent: "bg-accentbg text-accent",
  neutral: "bg-bg text-muted",
} as const;

export function VerdictPill({ verdict, large = false }: { verdict: Verdict; large?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${toneClass[verdictTone[verdict]]} ${large ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs"}`}>
      {titleCase(verdict)}
    </span>
  );
}

const dueClass: Record<DueState, string> = {
  overdue: toneClass.bad,
  today: toneClass.bad,
  soon: toneClass.warn,
  later: toneClass.neutral,
  none: toneClass.neutral,
};

export function DueChip({ date }: { date?: string | null }) {
  const d = dueState(date);
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${dueClass[d.state]}`}>{d.label}</span>;
}

export function ReadTag({ read }: { read?: string }) {
  if (!read) return null;
  const r = read.toLowerCase();
  const tone =
    /good|strong|safe|cheap|accelerat|uptrend|improv|positive|healthy|comfortable/.test(r) ? "good"
    : /concern|weak|risk|declin|downtrend|leveraged|negative/.test(r) ? "bad"
    : /expensive|watch|slow|overbought|moderate|range|transition/.test(r) ? "warn"
    : "neutral";
  return <span className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${toneClass[tone]}`}>{read}</span>;
}

export function Section({ title, note, children, className = "" }: { title: string; note?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`card p-4 sm:p-5 min-w-0 ${className}`}>
      <h2 className="text-[15px] font-semibold">{title}</h2>
      {note && <p className="text-xs text-muted mt-0.5">{note}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export const tone = toneClass;
