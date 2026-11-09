import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card p-8 text-center max-w-md mx-auto">
      <h1 className="text-lg font-semibold">No cards for this stock yet</h1>
      <p className="text-sm text-muted mt-1">Ask Claude for a verdict card and it will show up here.</p>
      <Link href="/" className="inline-block mt-4 text-sm underline">Back to rechecks</Link>
    </div>
  );
}
