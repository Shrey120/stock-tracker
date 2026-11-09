"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { addCards, type AddState } from "./actions";

const EXAMPLE = `{
  "ticker": "CUPID", "name": "Cupid Ltd", "sector": "FMCG / personal care",
  "card_date": "2026-11-09", "verdict": "HOLD", "recheck_on": "2026-11-12",
  "what_to_do": "Keep all 50 shares; don't add.",
  "cmp": 342.7,
  "scenarios": [{ "case": "base", "price": 354, "pct": 3, "condition": "..." }]
}`;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="h-10 rounded-md bg-accent px-4 text-sm font-medium text-white disabled:opacity-60">
      {pending ? "Saving…" : "Save card"}
    </button>
  );
}

export default function AddPage() {
  const [state, action] = useFormState<AddState, FormData>(addCards, { ok: false, message: "" });
  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Add a card</h1>
        <p className="text-sm text-muted mt-1">
          Claude normally saves cards here for you. Use this box if you have a card as JSON (one card, or a list of cards). Each save adds a new dated card and keeps the old ones.
        </p>
      </div>
      <form action={action} className="space-y-3">
        <label htmlFor="json" className="label">Card JSON</label>
        <textarea id="json" name="json" rows={18} spellCheck={false} placeholder={EXAMPLE}
          className="w-full rounded-[10px] border border-line bg-panel p-3 font-mono text-xs leading-relaxed" />
        <div className="flex items-center gap-4">
          <Submit />
          {state.message && (
            <p role="status" className={`text-sm ${state.ok ? "text-good" : "text-bad"}`}>
              {state.message} {state.ok && <Link href="/" className="underline">See rechecks</Link>}
            </p>
          )}
        </div>
      </form>
      <details className="card p-4 text-sm">
        <summary className="cursor-pointer font-medium">Fields the site understands</summary>
        <p className="mt-2 text-muted leading-relaxed">
          Required: <code>ticker</code>, <code>name</code>, <code>card_date</code>, <code>verdict</code>. Everything else is optional: <code>why</code>, <code>what_to_do</code>, <code>cmp</code>, <code>recheck_on</code>, <code>levels_valid_until</code>, <code>hold_horizon</code>, <code>watch</code>, <code>fundamentals</code>/<code>technicals</code> (lists of label/value/read), <code>market</code>, <code>news</code>, <code>levels</code>, <code>scenarios</code>, <code>portfolio</code>, <code>metrics</code> (numbers for the trend charts), <code>price_series</code>, <code>plain</code>, <code>sources</code>. The README in the repo has the full format.
        </p>
      </details>
    </div>
  );
}
