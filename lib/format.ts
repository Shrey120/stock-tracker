import type { Verdict } from "./types";

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
const inr0 = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export const rupees = (v?: number | null, whole = false) =>
  v === null || v === undefined || Number.isNaN(v) ? "—" : "₹" + (whole ? inr0 : inr).format(v);

export const pct = (v?: number | null, signed = false) =>
  v === null || v === undefined ? "—" : (signed && v > 0 ? "+" : "") + v.toFixed(1).replace(/\.0$/, "") + "%";

/** Today's date in India, as YYYY-MM-DD. */
export function todayIST(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export function daysUntil(date?: string | null): number | null {
  if (!date) return null;
  const [ty, tm, td] = todayIST().split("-").map(Number);
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td)) / 86400000);
}

export function shortDate(date?: string | null, withYear = false): string {
  if (!date) return "—";
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}), timeZone: "UTC" });
}

export function weekday(date?: string | null): string {
  if (!date) return "";
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" });
}

export type DueState = "overdue" | "today" | "soon" | "later" | "none";

export function dueState(date?: string | null): { state: DueState; label: string; days: number | null } {
  const n = daysUntil(date);
  if (n === null) return { state: "none", label: "No date", days: null };
  if (n < 0) return { state: "overdue", label: `Overdue ${-n}d`, days: n };
  if (n === 0) return { state: "today", label: "Today", days: n };
  if (n <= 7) return { state: "soon", label: n === 1 ? "Tomorrow" : `In ${n} days`, days: n };
  return { state: "later", label: `In ${n} days`, days: n };
}

export const verdictTone: Record<Verdict, "good" | "warn" | "bad"> = {
  BUY: "good",
  ACCUMULATE: "good",
  HOLD: "warn",
  WAIT: "warn",
  AVOID: "bad",
};

export const verdictColor: Record<Verdict, string> = {
  BUY: "#11753f",
  ACCUMULATE: "#2f9e5e",
  HOLD: "#c98500",
  WAIT: "#9a7a3a",
  AVOID: "#b42323",
};

export const titleCase = (v: string) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
