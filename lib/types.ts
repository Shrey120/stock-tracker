export type Verdict = "BUY" | "ACCUMULATE" | "HOLD" | "WAIT" | "AVOID";

export type Row = { label: string; value: string; read?: string };
export type NewsItem = { date: string; text: string; tone?: "positive" | "negative" | "neutral" };
export type Scenario = { case: "bear" | "base" | "bull"; price: number; pct: number; condition: string };

export type Card = {
  id?: string;
  ticker: string;
  card_date: string;
  as_of?: string | null;
  verdict: Verdict;
  why?: string | null;
  what_to_do?: string | null;
  cmp?: number | null;
  mcap_cr?: number | null;
  off_high_pct?: number | null;
  hold_horizon?: string | null;
  recheck_on?: string | null;
  levels_valid_until?: string | null;
  watch?: string | null;
  data_confidence?: string | null;
  confidence_note?: string | null;
  fundamentals: Row[];
  technicals: Row[];
  market: {
    mood?: string;
    nifty_pct?: number;
    sector_index?: string;
    sector_pct?: number;
    drivers?: string[];
    exposure?: string;
    next_macro?: { event: string; date: string }[];
    plain?: string;
  };
  news: NewsItem[];
  levels: {
    kind?: "entry" | "conditional";
    trigger?: number | null;
    stop?: number | null;
    entry_low?: number | null;
    entry_high?: number | null;
    ceiling?: number | null;
    lines?: { label: string; text: string }[];
  };
  scenarios: Scenario[];
  portfolio: {
    held?: boolean;
    qty?: number;
    avg?: number;
    pnl?: number;
    pct_holdings?: number;
    pct_total?: number;
    sector_label?: string;
    sector_pct?: number;
  };
  metrics: Record<string, number | null>;
  price_series: [string, number][];
  plain: {
    going_right?: string[];
    to_watch?: string[];
    next_event?: { text: string; date: string };
  };
  notes?: string | null;
  sources: { title: string; url: string }[];
  created_at?: string;
};

export type Stock = {
  ticker: string;
  name: string;
  sector?: string | null;
  exchange?: string | null;
  description?: string | null;
  archived?: boolean;
};

export type LatestCard = Card & Stock & { card_count: number };

/** What the paste box and Claude send: the card plus the stock fields. */
export type CardInput = Card & Stock;
