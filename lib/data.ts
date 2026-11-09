import "server-only";
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import type { Card, CardInput, LatestCard, Stock } from "./types";

const fixtureMode = process.env.ST_FIXTURE === "1";

function db() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  return createClient(url, key, { auth: { persistSession: false } });
}

function fixtures(): CardInput[] {
  const dir = path.join(process.cwd(), "fixtures");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .flatMap((f) => {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      return Array.isArray(d) ? d : [d];
    });
}

const STOCK_KEYS = ["name", "sector", "exchange", "description"] as const;

export async function getLatest(): Promise<LatestCard[]> {
  if (fixtureMode) {
    const all = fixtures();
    const by = new Map<string, CardInput[]>();
    all.forEach((c) => by.set(c.ticker, [...(by.get(c.ticker) ?? []), c]));
    return [...by.values()].map((cs) => {
      const s = [...cs].sort((a, b) => b.card_date.localeCompare(a.card_date));
      return { ...s[0], card_count: cs.length } as LatestCard;
    });
  }
  const { data, error } = await db().from("st_latest").select("*").eq("archived", false);
  if (error) throw new Error(error.message);
  return (data ?? []) as LatestCard[];
}

export async function getStock(ticker: string): Promise<{ stock: Stock | null; cards: Card[] }> {
  if (fixtureMode) {
    const cs = fixtures().filter((c) => c.ticker === ticker);
    if (!cs.length) return { stock: null, cards: [] };
    const sorted = cs.sort((a, b) => b.card_date.localeCompare(a.card_date));
    return { stock: sorted[0], cards: sorted };
  }
  const client = db();
  const [{ data: stock, error: e1 }, { data: cards, error: e2 }] = await Promise.all([
    client.from("st_stocks").select("*").eq("ticker", ticker).maybeSingle(),
    client.from("st_cards").select("*").eq("ticker", ticker).order("card_date", { ascending: false }).order("created_at", { ascending: false }),
  ]);
  if (e1) throw new Error(e1.message);
  if (e2) throw new Error(e2.message);
  return { stock: (stock as Stock) ?? null, cards: (cards ?? []) as Card[] };
}

export async function insertCards(inputs: CardInput[]): Promise<{ ticker: string; card_date: string }[]> {
  if (fixtureMode) throw new Error("Saving is turned off in preview mode");
  const client = db();
  const out: { ticker: string; card_date: string }[] = [];
  for (const input of inputs) {
    const stock: Stock = { ticker: input.ticker, name: input.name };
    STOCK_KEYS.forEach((k) => {
      if (input[k] !== undefined) (stock as Record<string, unknown>)[k] = input[k];
    });
    const { error: se } = await client.from("st_stocks").upsert(stock, { onConflict: "ticker" });
    if (se) throw new Error(`${input.ticker}: ${se.message}`);
    const card: Record<string, unknown> = { ...input };
    STOCK_KEYS.forEach((k) => delete card[k]);
    delete card.id;
    delete card.created_at;
    delete card.card_count;
    delete card.archived;
    const { error: ce } = await client.from("st_cards").insert(card);
    if (ce) throw new Error(`${input.ticker}: ${ce.message}`);
    out.push({ ticker: input.ticker, card_date: input.card_date });
  }
  return out;
}
