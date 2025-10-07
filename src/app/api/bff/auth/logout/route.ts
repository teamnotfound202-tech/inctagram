import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const isProd = process.env.NODE_ENV === "production";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const refresh = req.cookies.get("bff_rt")?.value ?? null;

  const upstream = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: refresh ? { Cookie: `refreshToken=${encodeURIComponent(refresh)}` } : undefined,
    cache: "no-store",
  });

  const status = upstream.status;                                  // [CHANGED]
  let res: NextResponse;                                           // [CHANGED]

  // статусы без тела: 204/205/304
  if (status === 204 || status === 205 || status === 304) {        // [CHANGED]
    res = new NextResponse(null, {                                  // [CHANGED]
      status,
      headers: { "Cache-Control": "no-store" },
    });
  } else {
    const payload = await upstream.json().catch(() => ({}));       // [CHANGED]
    res = NextResponse.json(payload ?? {}, {                        // [CHANGED]
      status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // чистим наши куки в любом случае
  res.cookies.set("bff_at", "", { path: "/", httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 0 });
  res.cookies.set("bff_rt", "", { path: "/", httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 0 });

  return res;
}