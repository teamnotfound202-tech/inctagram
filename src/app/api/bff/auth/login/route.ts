import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const isProd = process.env.NODE_ENV === "production";

// Общие опции для наших кук
const baseCookie = {
  httpOnly: true,
  secure: isProd,          // в проде строго HTTPS
  sameSite: "lax" as const,
  path: "/",
};

// access — сессионная (без maxAge), refresh — 7 дней
const accessCookieOpts  = { ...baseCookie };
const refreshCookieOpts = { ...baseCookie, maxAge: 60 * 60 * 24 * 7 };

function parseRefreshFromSetCookie(setCookie: string | null) {
  if (!setCookie) return null;
  const m = setCookie.match(/(?:^|,) *refreshToken=([^;]+)/i);
  return m ? decodeURIComponent(m[1]) : null;
}

type LoginResp = { accessToken: string };
async function safeJson<T>(res: Response): Promise<T | null> {
  try { return (await res.json()) as T; } catch { return null; }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  const creds = await req.json();

  // 1) зовём реальный логин на бэке
  const upstream = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(creds),
    cache: "no-store",
  });

  // 2) читаем тело + пробрасываем ошибку как есть
  const data = await safeJson<LoginResp>(upstream);
  if (!upstream.ok) {
    return NextResponse.json(data ?? {}, {
      status: upstream.status,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // 3) access — из JSON, refresh — из Set-Cookie
  const access  = data?.accessToken;
  const refresh = parseRefreshFromSetCookie(upstream.headers.get("set-cookie"));

  if (!access) {
    // по твоим правилам на 200 access всегда есть; на всякий случай:
    return NextResponse.json({ error: "No accessToken in response" }, { status: 502 });
  }

  // 4) ставим наши HttpOnly-куки и отвечаем
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set("bff_at", access, accessCookieOpts);
  if (refresh) res.cookies.set("bff_rt", refresh, refreshCookieOpts);
  return res;
}