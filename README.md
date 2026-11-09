# Stock Tracker

A private log of stock verdict cards. Every card is kept with its date, so you can see how each stock's verdict, triggers, targets and fundamentals change over time. The home page sorts every stock by its next recheck date.

- **Rechecks** (`/`): latest card per stock, sorted by recheck date, with overdue and due-soon flags.
- **Stock page** (`/stock/CUPID`): the latest card in full, trend charts across cards, and every past card.
- **Add card** (`/add`): paste one card or a list of cards as JSON.

Built with Next.js 14 (App Router), Tailwind and Recharts. Data lives in Supabase (`fitness-hub` project) in two tables, `st_stocks` and `st_cards`, plus a `st_latest` view. Row level security is on with no policies, so the browser keys can't read them. The app reads and writes only on the server, using the service-role key.

## Setup

1. Import this repo in Vercel.
2. Add these environment variables (Project → Settings → Environment Variables):
   - `SUPABASE_URL` = `https://dcdnwpcvvgyklcqdndmt.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = from Supabase → Project Settings → API Keys → `service_role` (secret; keep it server-side only)
   - `SITE_PASSWORD` = any password. The browser asks for it, and any username works.
3. Deploy.

Local preview without Supabase: `ST_FIXTURE=1 npm run dev`. This renders from `fixtures/*.json`, and saving is off.

## Card format

```jsonc
{
  "ticker": "CUPID", "name": "Cupid Ltd", "sector": "FMCG / personal care", "exchange": "NSE",
  "description": "What the company does, in one line",
  "card_date": "2026-11-09", "as_of": "2026-11-09T12:47:00+05:30",
  "verdict": "HOLD",                       // BUY | ACCUMULATE | HOLD | WAIT | AVOID
  "why": "…", "what_to_do": "…",
  "cmp": 342.7, "mcap_cr": 46115, "off_high_pct": -7.4,
  "hold_horizon": "9–12 months", "recheck_on": "2026-11-12", "levels_valid_until": "Until results on 11 Nov",
  "watch": "…", "data_confidence": "Moderate", "confidence_note": "…",
  "fundamentals": [{ "label": "Valuation", "value": "P/E 332 vs industry 36", "read": "Expensive" }],
  "technicals":   [{ "label": "Trend", "value": "50DMA ₹307 · 200DMA ₹185", "read": "Uptrend" }],
  "market": { "mood": "Neutral", "nifty_pct": -0.3, "sector_index": "Nifty FMCG", "sector_pct": -0.6,
              "drivers": ["…"], "exposure": "…", "plain": "…", "next_macro": [{ "event": "India CPI", "date": "2026-11-12" }] },
  "news": [{ "date": "2026-11-04", "text": "…", "tone": "positive" }],      // positive | negative | neutral
  "levels": { "kind": "conditional", "trigger": 278, "stop": null,          // kind "entry" also uses entry_low/entry_high/ceiling/stop
              "lines": [{ "label": "Turns to Trim", "text": "…" }] },
  "scenarios": [{ "case": "bear", "price": 171, "pct": -50, "condition": "…" }, { "case": "base", … }, { "case": "bull", … }],
  "portfolio": { "held": true, "qty": 50, "avg": 283.3, "pnl": 2975, "pct_holdings": 17.8, "pct_total": 15.7, "sector_label": "FMCG", "sector_pct": 19.8 },
  "metrics": { "pe": 332, "pe_forward": 183, "roe": 27.6, "rsi": 59.9, "rev_growth_yoy": 158, "pat_growth_yoy": 193,
               "promoter_pct": 47.69, "fii_pct": 4.69, "trigger_level": 278, "base_target": 354 },
  "price_series": [["2025-11-10", 52.3], ["2026-11-08", 342.7]],
  "plain": { "going_right": ["…"], "to_watch": ["…"], "next_event": { "text": "Q2 results", "date": "2026-11-11" } },
  "notes": "…",
  "sources": [{ "title": "Screener", "url": "https://…" }]
}
```

Numbers in `metrics` become the trend charts on the stock page. Each new card adds one point per metric.

Analysis, not licensed investment advice.
