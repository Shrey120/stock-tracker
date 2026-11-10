import { meaningOf, splitTerms } from "@/lib/glossary";

/** One explained term: dotted underline, plain-language meaning on hover, or on tap/focus on phones. */
export function Term({ children, meaning, place }: { children: React.ReactNode; meaning?: string; place?: "below" | "end" | "below end" }) {
  const m = meaning ?? (typeof children === "string" ? meaningOf(children) : undefined);
  if (!m) return <>{children}</>;
  return (
    <span className={`term ${place ?? ""}`} tabIndex={0} data-tip={m} aria-label={`${typeof children === "string" ? children : ""}: ${m}`}>
      {children}
    </span>
  );
}

/** Renders text with every glossary term explained (first appearance only, so the text stays readable). */
export function G({ text }: { text?: string | null }) {
  if (!text) return null;
  const seen = new Set<string>();
  return (
    <>
      {splitTerms(text, seen).map((p, i) =>
        typeof p === "string" ? <span key={i}>{p}</span> : <Term key={i} meaning={p.meaning}>{p.term}</Term>,
      )}
    </>
  );
}
