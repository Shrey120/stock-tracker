import { NextResponse, type NextRequest } from "next/server";

/** Password-protects every page with the browser's built-in login prompt. */
export function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;
  if (!password) {
    if (process.env.ST_FIXTURE === "1") return NextResponse.next();
    return new NextResponse("SITE_PASSWORD is not set", { status: 500 });
  }
  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    const given = decoded.slice(decoded.indexOf(":") + 1);
    if (given === password) return NextResponse.next();
  }
  return new NextResponse("Login required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="stock-tracker", charset="UTF-8"' },
  });
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
