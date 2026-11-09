"use server";

import { revalidatePath } from "next/cache";
import { insertCards } from "@/lib/data";
import type { CardInput } from "@/lib/types";

const VERDICTS = ["BUY", "ACCUMULATE", "HOLD", "WAIT", "AVOID"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export type AddState = { ok: boolean; message: string };

export async function addCards(_: AddState, form: FormData): Promise<AddState> {
  const raw = String(form.get("json") ?? "").trim();
  if (!raw) return { ok: false, message: "Paste a card first." };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { ok: false, message: `That isn't valid JSON: ${(e as Error).message}` };
  }
  const list = (Array.isArray(parsed) ? parsed : [parsed]) as CardInput[];
  for (const [i, c] of list.entries()) {
    const where = list.length > 1 ? `Card ${i + 1}: ` : "";
    if (!c || typeof c !== "object") return { ok: false, message: `${where}not an object.` };
    if (!c.ticker || !c.name) return { ok: false, message: `${where}needs "ticker" and "name".` };
    if (!c.card_date || !DATE.test(c.card_date)) return { ok: false, message: `${where}"card_date" must look like 2026-11-09.` };
    if (!VERDICTS.includes(String(c.verdict).toUpperCase())) return { ok: false, message: `${where}"verdict" must be one of ${VERDICTS.join(", ")}.` };
    if (c.recheck_on && !DATE.test(c.recheck_on)) return { ok: false, message: `${where}"recheck_on" must look like 2026-11-12.` };
    c.verdict = String(c.verdict).toUpperCase() as CardInput["verdict"];
    c.ticker = c.ticker.toUpperCase().trim();
  }
  try {
    const saved = await insertCards(list);
    revalidatePath("/");
    saved.forEach((s) => revalidatePath(`/stock/${s.ticker}`));
    return { ok: true, message: `Saved ${saved.map((s) => s.ticker).join(", ")}.` };
  } catch (e) {
    return { ok: false, message: `Couldn't save: ${(e as Error).message}` };
  }
}
