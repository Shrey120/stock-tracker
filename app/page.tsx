import Link from "next/link";
import RecheckTable from "@/components/RecheckTable";
import { getLatest } from "@/lib/data";
import { dueState, shortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Home() {
  const rows = await getLatest();
  const states = rows.map((r) => dueState(r.recheck_on).state);
  const overdue = states.filter((s) => s === "overdue" || s === "today").length;
  const soon = states.filter((s) => s === "soon").length;
  const next = rows.map((r) => r.recheck_on).filter(Boolean).sort()[0] as string | undefined;
  const nextStock = rows.find((r) => r.recheck_on === next);
  const act = rows.filter((r) => ["BUY", "ACCUMULATE", "AVOID"].includes(r.verdict)).length;

  const tiles = [
    { label: "Due today or overdue", value: overdue, tone: overdue ? "text-bad" : "" },
    { label: "Due in the next 7 days", value: soon, tone: soon ? "text-warn" : "" },
    { label: "Next recheck", value: next ? shortDate(next) : "—", sub: nextStock?.name },
    { label: "Stocks tracked", value: rows.length, sub: act ? `${act} with a buy or sell call` : "All on hold or wait" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Rechecks</h1>
        <p className="text-sm text-muted mt-1">Every stock's latest verdict, sorted by when it needs another look.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {tiles.map((t) => (
          <div key={t.label} className="card p-4">
            <div className="label">{t.label}</div>
            <div className={`mt-1.5 text-2xl font-medium num ${t.tone ?? ""}`}>{t.value}</div>
            {t.sub && <div className="text-xs text-muted mt-0.5 truncate">{t.sub}</div>}
          </div>
        ))}
      </div>

      <RecheckTable rows={rows} />

      <p className="text-xs text-muted">
        Cards are added by Claude after each verdict, or by hand on <Link href="/add" className="underline">Add card</Link>. Analysis, not licensed investment advice.
      </p>
    </div>
  );
}
