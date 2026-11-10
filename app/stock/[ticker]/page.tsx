import Link from "next/link";
import { notFound } from "next/navigation";
import { PriceChart, ScenarioChart, TrendChart } from "@/components/charts";
import { DueChip, ReadTag, Section, VerdictPill, tone } from "@/components/ui";
import { getStock } from "@/lib/data";
import { pct, rupees, shortDate, titleCase, verdictColor, verdictTone, weekday } from "@/lib/format";
import type { Card } from "@/lib/types";
import { G, Term } from "@/components/Glossary";
import { SCENARIO_MEANING } from "@/lib/glossary";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

type TrendDef = { key: string; label: string; unit: "rs" | "pct" | "x" | "num"; get: (c: Card) => number | null | undefined; color?: string };

const TRENDS: TrendDef[] = [
  { key: "cmp", label: "Price at each card", unit: "rs", get: (c) => c.cmp },
  { key: "base", label: "Base-case target", unit: "rs", get: (c) => c.metrics?.base_target ?? c.scenarios?.find((s) => s.case === "base")?.price, color: "var(--warn)" },
  { key: "trigger", label: "Stop / downside trigger", unit: "rs", get: (c) => c.levels?.stop ?? c.levels?.trigger ?? c.metrics?.trigger_level, color: "var(--bad)" },
  { key: "weight", label: "Share of your holdings", unit: "pct", get: (c) => c.portfolio?.pct_holdings },
  { key: "pe", label: "P/E (trailing)", unit: "x", get: (c) => c.metrics?.pe },
  { key: "pe_forward", label: "P/E (forward)", unit: "x", get: (c) => c.metrics?.pe_forward },
  { key: "roe", label: "ROE", unit: "pct", get: (c) => c.metrics?.roe, color: "var(--good)" },
  { key: "rev", label: "Revenue growth, YoY", unit: "pct", get: (c) => c.metrics?.rev_growth_yoy, color: "var(--good)" },
  { key: "pat", label: "Profit growth, YoY", unit: "pct", get: (c) => c.metrics?.pat_growth_yoy, color: "var(--good)" },
  { key: "pb", label: "P/B", unit: "x", get: (c) => c.metrics?.pb },
  { key: "gnpa", label: "Gross NPA (banks)", unit: "pct", get: (c) => c.metrics?.gnpa, color: "var(--bad)" },
  { key: "car", label: "Capital adequacy (banks)", unit: "pct", get: (c) => c.metrics?.car, color: "var(--good)" },
  { key: "casa", label: "CASA ratio (banks)", unit: "pct", get: (c) => c.metrics?.casa },
  { key: "rsi", label: "RSI (14)", unit: "num", get: (c) => c.metrics?.rsi },
  { key: "promoter", label: "Promoter holding", unit: "pct", get: (c) => c.metrics?.promoter_pct },
  { key: "fii", label: "FII holding", unit: "pct", get: (c) => c.metrics?.fii_pct },
];

const toneDot = { positive: "bg-good", negative: "bg-bad", neutral: "bg-warn" } as const;

export default async function StockPage({ params }: { params: { ticker: string } }) {
  const ticker = decodeURIComponent(params.ticker);
  const { stock, cards } = await getStock(ticker);
  if (!stock || !cards.length) notFound();
  const c = cards[0];
  const prev = cards[1];
  const chrono = [...cards].reverse();
  const trends = TRENDS.map((t) => ({
    ...t,
    points: chrono.map((x) => ({ date: x.card_date, value: t.get(x) })).filter((p): p is { date: string; value: number } => typeof p.value === "number"),
  })).filter((t) => t.points.length > 0);
  const vt = verdictTone[c.verdict];
  const isEntry = c.levels?.kind === "entry";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href="/" className="text-sm text-muted hover:text-ink">← All rechecks</Link>
        <span className="text-xs text-muted">Words with a <span className="term" style={{cursor:"default"}}>dotted underline</span> explain themselves: hover, or tap on a phone.</span>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight">{stock.name}</h1>
          <p className="text-sm text-muted mt-0.5">{[stock.ticker, stock.exchange, stock.sector].filter(Boolean).join(" · ")}</p>
          {stock.description && <p className="text-sm mt-2 leading-relaxed">{stock.description}</p>}
        </div>
        <div className="text-right">
          <div className="text-3xl font-medium num">{rupees(c.cmp)}</div>
          <div className="text-sm text-muted num">{c.off_high_pct !== null && c.off_high_pct !== undefined ? <>{Math.abs(c.off_high_pct)}% below <Term>52-week high</Term></> : ""}</div>
          <div className="text-xs text-muted mt-1">Card of {shortDate(c.card_date, true)}{c.mcap_cr ? <> · <Term>Mcap</Term> ₹{new Intl.NumberFormat("en-IN").format(c.mcap_cr)} Cr</> : ""}</div>
        </div>
      </header>

      <div className={`rounded-[10px] p-4 sm:p-5 ${tone[vt]}`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xl font-semibold">{titleCase(c.verdict)}</span>
          {prev && (
            <span className="text-xs opacity-80">
              {prev.verdict === c.verdict ? `Unchanged since ${shortDate(prev.card_date)}` : `Was ${titleCase(prev.verdict)} on ${shortDate(prev.card_date)}`}
            </span>
          )}
        </div>
        {c.why && <p className="mt-2 text-sm leading-relaxed text-ink"><G text={c.why} /></p>}
      </div>

      <div className="card p-4 sm:p-5 border-2" style={{ borderColor: verdictColor[c.verdict] }}>
        <div className="label">What to do now</div>
        <p className="mt-1.5 text-base sm:text-lg leading-relaxed font-medium"><G text={c.what_to_do} /></p>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <div className="label">Recheck on</div>
          <div className="mt-1.5 font-medium num">{weekday(c.recheck_on)} {shortDate(c.recheck_on, true)}</div>
          <div className="mt-1.5"><DueChip date={c.recheck_on} /></div>
        </div>
        <div className="card p-4"><div className="label">Levels valid</div><div className="mt-1.5 text-sm">{c.levels_valid_until ?? "—"}</div></div>
        <div className="card p-4"><div className="label">Hold horizon</div><div className="mt-1.5 text-sm">{c.hold_horizon ?? "—"}</div></div>
        <div className="card p-4"><div className="label">Data confidence</div><div className="mt-1.5 text-sm font-medium">{c.data_confidence ?? "—"}</div>{c.confidence_note && <div className="text-xs text-muted mt-1">{c.confidence_note}</div>}</div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title={isEntry ? "Entry and stop" : "Conditional triggers"} note="All levels on a daily close, not an intraday dip">
          {isEntry && (
            <dl className="grid grid-cols-2 gap-3 mb-3 text-sm">
              <div><dt className="label">Entry zone</dt><dd className="num font-medium">{rupees(c.levels.entry_low)} – {rupees(c.levels.entry_high)}</dd></div>
              <div><dt className="label">Ceiling</dt><dd className="num font-medium">{rupees(c.levels.ceiling)}</dd></div>
              <div><dt className="label"><Term>Stop</Term></dt><dd className="num font-medium text-bad">{rupees(c.levels.stop)}</dd></div>
            </dl>
          )}
          <ul className="space-y-2.5 text-sm">
            {(c.levels?.lines ?? []).map((l) => (
              <li key={l.label}><span className="font-medium">{l.label}:</span> <span className="leading-relaxed"><G text={l.text} /></span></li>
            ))}
          </ul>
        </Section>
        <Section title="Watch" note="The one thing most likely to break this view">
          <p className="text-sm leading-relaxed">{c.watch ? <G text={c.watch} /> : "—"}</p>
          {c.plain?.next_event && (
            <p className="text-sm mt-3"><span className="label mr-2">Next event</span>{c.plain.next_event.text} · {weekday(c.plain.next_event.date)} {shortDate(c.plain.next_event.date, true)}</p>
          )}
        </Section>
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <Section title="Price, last year" note="With the downside trigger and base-case target" className="lg:col-span-3">
          <PriceChart series={c.price_series} trigger={c.levels?.stop ?? c.levels?.trigger} base={c.scenarios?.find((s) => s.case === "base")?.price} />
        </Section>
        <Section title="9–12 month view" note="Scenarios, not forecasts" className="lg:col-span-2">
          <ScenarioChart scenarios={c.scenarios} cmp={c.cmp} />
          <ul className="mt-2 space-y-1.5 text-xs text-muted">
            {c.scenarios.map((s) => <li key={s.case}><span className="font-medium text-ink"><Term meaning={SCENARIO_MEANING[s.case]}>{titleCase(s.case)}</Term>:</span> <G text={s.condition} /></li>)}
          </ul>
        </Section>
      </div>

      <Section title="How it's changing across cards" note={cards.length > 1 ? `${cards.length} cards since ${shortDate(chrono[0].card_date, true)}` : "One card so far. Each new card adds a point, so these lines fill in over time."}>
        <div className="mb-4">
          <div className="label mb-2">Verdict history</div>
          <ol className="flex flex-wrap items-center gap-2">
            {chrono.map((x, i) => (
              <li key={x.id ?? i} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs">
                  <span className="h-2 w-2 rounded-full" style={{ background: verdictColor[x.verdict] }} />
                  {titleCase(x.verdict)} <span className="text-muted num">{shortDate(x.card_date)}</span>
                </span>
                {i < chrono.length - 1 && <span className="text-muted" aria-hidden>→</span>}
              </li>
            ))}
          </ol>
        </div>
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {trends.map((t) => (
            <div key={t.key} className="min-w-0">
              <div className="label"><G text={t.label} /></div>
              <TrendChart points={t.points} unit={t.unit} color={t.color} />
            </div>
          ))}
        </div>
      </Section>

      {!!(c.plain?.going_right?.length || c.plain?.to_watch?.length) && <div className="grid gap-5 lg:grid-cols-2">
        <Section title="What's going right">
          <ul className="list-disc pl-5 space-y-1.5 text-sm">{(c.plain?.going_right ?? []).map((x) => <li key={x}><G text={x} /></li>)}</ul>
        </Section>
        <Section title="What to watch">
          <ul className="list-disc pl-5 space-y-1.5 text-sm">{(c.plain?.to_watch ?? []).map((x) => <li key={x}><G text={x} /></li>)}</ul>
        </Section>
      </div>}

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Fundamentals"><RowTable rows={c.fundamentals} /></Section>
        <Section title="Technicals"><RowTable rows={c.technicals} /></Section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {(c.market?.mood || c.market?.plain || c.market?.drivers?.length) ? <Section title="Market backdrop" note={c.market?.mood ? `Mood: ${c.market.mood}` : undefined}>
          <div className="flex flex-wrap gap-2 text-xs mb-3">
            {c.market?.nifty_pct !== undefined && <span className={`rounded px-2 py-1 num ${c.market.nifty_pct >= 0 ? tone.good : tone.bad}`}><Term>Nifty</Term> {pct(c.market.nifty_pct, true)}</span>}
            {c.market?.sector_index && c.market.sector_pct !== undefined && <span className={`rounded px-2 py-1 num ${c.market.sector_pct >= 0 ? tone.good : tone.bad}`}>{c.market.sector_index} {pct(c.market.sector_pct, true)}</span>}
          </div>
          {c.market?.plain && <p className="text-sm leading-relaxed"><G text={c.market.plain} /></p>}
          {!!c.market?.drivers?.length && <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">{c.market.drivers.map((d) => <li key={d}><G text={d} /></li>)}</ul>}
          {c.market?.exposure && <p className="text-sm mt-2 text-muted leading-relaxed"><G text={c.market.exposure} /></p>}
          {!!c.market?.next_macro?.length && (
            <p className="text-sm mt-3"><span className="label mr-2">Next macro</span>{c.market.next_macro.map((m) => `${m.event} ${shortDate(m.date)}`).join(" · ")}</p>
          )}
        </Section> : <Section title="Market backdrop"><p className="text-sm text-muted">Not recorded on this card.</p></Section>}
        <Section title="News to know">
          {c.news?.length ? (
            <ol className="space-y-3">
              {c.news.map((n, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${toneDot[n.tone ?? "neutral"]}`} aria-label={n.tone ?? "neutral"} />
                  <div><span className="text-muted num mr-2">{shortDate(n.date)}</span><G text={n.text} /></div>
                </li>
              ))}
            </ol>
          ) : <p className="text-sm text-muted">No material news in the last 90 days.</p>}
        </Section>
      </div>

      {c.portfolio?.held && (
        <Section title="Your position">
          <dl className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
            <div><dt className="label">Shares</dt><dd className="num font-medium">{c.portfolio.qty}</dd></div>
            <div><dt className="label">Avg price</dt><dd className="num font-medium">{rupees(c.portfolio.avg)}</dd></div>
            <div><dt className="label">P&amp;L</dt><dd className={`num font-medium ${(c.portfolio.pnl ?? 0) >= 0 ? "text-good" : "text-bad"}`}>{rupees(c.portfolio.pnl, true)}</dd></div>
            <div><dt className="label">Of holdings</dt><dd className="num font-medium">{pct(c.portfolio.pct_holdings)}</dd></div>
            <div><dt className="label">{c.portfolio.sector_label ?? "Sector"}</dt><dd className="num font-medium">{pct(c.portfolio.sector_pct)}</dd></div>
          </dl>
          {typeof c.portfolio.pct_holdings === "number" && (
            <div className="mt-4">
              <div className="relative h-3 rounded-full bg-bg overflow-hidden">
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100, (c.portfolio.pct_holdings / 30) * 100)}%`, background: c.portfolio.pct_holdings > 15 ? "var(--warn)" : "var(--accent)" }} />
                <div className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: "50%" }} />
              </div>
              <div className="flex justify-between text-[11px] text-muted mt-1"><span>0%</span><span><Term>15% cap</Term></span><span>30%</span></div>
            </div>
          )}
        </Section>
      )}

      {c.notes && <Section title="Notes"><p className="text-sm leading-relaxed"><G text={c.notes} /></p></Section>}

      <Section title="All cards" note="Newest first. Open one to see what it said at the time.">
        <ul className="divide-y divide-line">
          {cards.map((x, i) => (
            <li key={x.id ?? i}>
              <details className="group py-3">
                <summary className="flex flex-wrap items-center gap-3 cursor-pointer list-none">
                  <span className="text-sm font-medium num w-24">{shortDate(x.card_date, true)}</span>
                  <VerdictPill verdict={x.verdict} />
                  <span className="text-sm num text-muted">{rupees(x.cmp)}</span>
                  <span className="text-sm text-muted">Recheck {shortDate(x.recheck_on)}</span>
                  <span className="ml-auto text-xs text-muted group-open:hidden">Show</span>
                  <span className="ml-auto text-xs text-muted hidden group-open:inline">Hide</span>
                </summary>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div><div className="label">What to do</div><p className="mt-1 leading-relaxed"><G text={x.what_to_do} /></p></div>
                  <div><div className="label">Why</div><p className="mt-1 leading-relaxed text-muted"><G text={x.why} /></p></div>
                  {(x.levels?.lines ?? []).length > 0 && (
                    <div className="sm:col-span-2"><div className="label">Levels</div>
                      <ul className="mt-1 space-y-1">{x.levels.lines!.map((l) => <li key={l.label}><span className="font-medium">{l.label}:</span> <G text={l.text} /></li>)}</ul>
                    </div>
                  )}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </Section>

      {!!c.sources?.length && (
        <div className="text-xs text-muted">
          <span className="label mr-2">Sources</span>
          {c.sources.map((s, i) => (
            <span key={s.url}>{i > 0 && " · "}<a href={s.url} target="_blank" rel="noreferrer" className="underline hover:text-ink">{s.title}</a></span>
          ))}
        </div>
      )}
      <p className="text-xs text-muted">Analysis, not licensed investment advice. Verify figures before acting.</p>
    </div>
  );
}

function RowTable({ rows }: { rows: { label: string; value: string; read?: string }[] }) {
  if (!rows?.length) return <p className="text-sm text-muted">Not recorded on this card.</p>;
  return (
    <dl className="divide-y divide-line">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[6.5rem_1fr_auto] gap-3 py-2.5 text-sm items-start">
          <dt className="font-medium"><G text={r.label} /></dt>
          <dd className="text-muted leading-snug min-w-0"><G text={r.value} /></dd>
          <dd><ReadTag read={r.read} /></dd>
        </div>
      ))}
    </dl>
  );
}
