"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LatestCard, Verdict } from "@/lib/types";
import { DueChip, VerdictPill } from "./ui";
import { Term } from "./Glossary";

type SortKey = "recheck" | "verdict" | "weight" | "name" | "updated";
const verdictOrder: Record<Verdict, number> = { AVOID: 0, BUY: 1, ACCUMULATE: 2, WAIT: 3, HOLD: 4 };

const rs = (v?: number | null) => (v === null || v === undefined ? "—" : "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(v));
const sd = (d?: string | null) => {
  if (!d) return "—";
  const [y, m, day] = d.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
};

export default function RecheckTable({ rows, today }: { rows: LatestCard[]; today: string }) {
  const [sort, setSort] = useState<SortKey>("recheck");
  const [q, setQ] = useState("");

  const sorted = useMemo(() => {
    const f = rows.filter((r) => !q || `${r.ticker} ${r.name} ${r.sector ?? ""}`.toLowerCase().includes(q.toLowerCase()));
    const by: Record<SortKey, (a: LatestCard, b: LatestCard) => number> = {
      recheck: (a, b) => (a.recheck_on ?? "9999").localeCompare(b.recheck_on ?? "9999"),
      verdict: (a, b) => verdictOrder[a.verdict] - verdictOrder[b.verdict],
      weight: (a, b) => (b.portfolio?.pct_holdings ?? -1) - (a.portfolio?.pct_holdings ?? -1),
      name: (a, b) => a.name.localeCompare(b.name),
      updated: (a, b) => b.card_date.localeCompare(a.card_date),
    };
    return [...f].sort(by[sort]);
  }, [rows, sort, q]);

  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-line">
        <input
          id="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stocks"
          className="h-9 w-full sm:w-64 rounded-md border border-line bg-bg px-3 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          Sort by
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="h-9 rounded-md border border-line bg-bg px-2 text-sm text-ink">
            <option value="recheck">Next recheck</option>
            <option value="verdict">Verdict (act first)</option>
            <option value="weight">Portfolio weight</option>
            <option value="updated">Last updated</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      {sorted.length === 0 ? (
        <p className="p-6 text-sm text-muted">{rows.length ? "No stocks match that search." : "No cards yet. Ask Claude for a verdict card and it will appear here."}</p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted">
                  {["Stock", "Verdict", "Recheck", "What to do now", "Price", "Trigger", "Weight"].map((h, i) => (
                    <th key={h} className={`px-4 py-2.5 font-medium text-xs ${i >= 4 ? "text-right" : ""}`}>
                      {h === "Trigger" ? <Term place="below end" meaning="The stop or downside trigger price. If the stock closes below it, you act (trim or sell).">Trigger</Term>
                        : h === "Weight" ? <Term place="below end" meaning="How much of your shares this stock is. Your limit is 15% per stock.">Weight</Term>
                        : h === "Price" ? <Term place="below end" meaning="The price on the day of the latest card (date shown below it), not live.">Price</Term> : h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.ticker} className="border-t border-line align-top hover:bg-bg/60">
                    <td className="px-4 py-3">
                      <Link href={`/stock/${encodeURIComponent(r.ticker)}`} className="font-medium hover:text-accent">{r.name}</Link>
                      <div className="text-xs text-muted">{r.ticker} · {r.sector}</div>
                    </td>
                    <td className="px-4 py-3"><VerdictPill verdict={r.verdict} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="num">{sd(r.recheck_on)}</div>
                      <div className="mt-1"><DueChip date={r.recheck_on} today={today} /></div>
                    </td>
                    <td className="px-4 py-3 max-w-md"><p className="line-clamp-3 leading-snug">{r.what_to_do}</p></td>
                    <td className="px-4 py-3 text-right num whitespace-nowrap">{rs(r.cmp)}<div className="text-xs text-muted">{sd(r.card_date)}</div></td>
                    <td className="px-4 py-3 text-right num whitespace-nowrap">{rs(r.levels?.stop ?? r.levels?.trigger)}</td>
                    <td className="px-4 py-3 text-right num">{r.portfolio?.held ? `${r.portfolio.pct_holdings ?? "—"}%` : <span className="text-muted">Not held</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="md:hidden divide-y divide-line">
            {sorted.map((r) => (
              <li key={r.ticker} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/stock/${encodeURIComponent(r.ticker)}`} className="font-medium">{r.name}</Link>
                    <div className="text-xs text-muted">{r.ticker} · {rs(r.cmp)}</div>
                  </div>
                  <VerdictPill verdict={r.verdict} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs"><span className="text-muted">Recheck {sd(r.recheck_on)}</span><DueChip date={r.recheck_on} today={today} /></div>
                <p className="mt-2 text-sm leading-snug line-clamp-3">{r.what_to_do}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
