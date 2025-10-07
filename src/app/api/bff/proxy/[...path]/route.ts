import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const isProd = process.env.NODE_ENV === "production";

const baseCookie = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};
const accessCookieOpts  = { ...baseCookie };                          // сессионная
const refreshCookieOpts = { ...baseCookie, maxAge: 60 * 60 * 24 * 7 };// 7 дней

export const dynamic = "force-dynamic";
export const revalidate = 0;

const UNSAFE = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function parseRefreshFromSetCookie(setCookie: string | null) {
  if (!setCookie) return null;
  const m = setCookie.match(/(?:^|,) *refreshToken=([^;]+)/i);
  return m ? m[1] : null; // не декодируем насильно
}

type UpdateTokensResp = { accessToken: string };

async function refreshPair(refresh: string) {
  const r = await fetch(`${API_BASE}/auth/update-tokens`, {
    method: "POST",
    headers: { Cookie: `refreshToken=${encodeURIComponent(refresh)}` },
    cache: "no-store",
  });
  if (!r.ok) return null;

  const data: UpdateTokensResp | null = await r.json().catch(() => null);
  const newAccess = data?.accessToken;
  const newRefresh = parseRefreshFromSetCookie(r.headers.get("set-cookie"));
  if (!newAccess) return null;
  return { newAccess, newRefresh: newRefresh ?? null };
}

// общая логика прокси
async function handle(req: NextRequest, segments: string[]) {
  // CSRF по Origin для "опасных" методов
  if (UNSAFE.has(req.method)) {
    const origin = req.headers.get("origin");
    const self = req.nextUrl.origin;
    if (origin && origin !== self) {
      return NextResponse.json({ error: "CSRF: bad origin" }, { status: 403 });
    }
  }

  // целевой URL бэка
  const upstreamUrl = new URL(`${API_BASE}/${(segments ?? []).join("/")}`);
  upstreamUrl.search = req.nextUrl.search;
  const target = upstreamUrl.toString();

  // наши куки
  const access  = req.cookies.get("bff_at")?.value ?? null;
  const refresh = req.cookies.get("bff_rt")?.value ?? null;

  // читаем тело один раз (для ретрая)
  const needsBody = !["GET", "HEAD"].includes(req.method);
  const bodyBuffer = needsBody ? await req.arrayBuffer() : undefined;

  const forward = (token?: string) => {
    const ct = req.headers.get("content-type");
    const headers = new Headers();
    if (ct) headers.set("content-type", ct);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("x-requested-with", "XMLHttpRequest");

    return fetch(target, {
      method: req.method,
      headers,
      body: needsBody ? bodyBuffer : undefined,
      cache: "no-store",
    });
  };

  // первый заход
  const upstream = await forward(access ?? undefined);
  if (upstream.status !== 401 || !refresh) {
    return new NextResponse(upstream.body, { status: upstream.status, headers: upstream.headers });
  }

  // 401 → обновляем пару и повторяем запрос
  const pair = await refreshPair(refresh);
  if (!pair) {
    return new NextResponse(upstream.body, { status: upstream.status, headers: upstream.headers });
  }

  const retry = await forward(pair.newAccess);

  // обновляем наши куки и отдаём ответ
  const out = new NextResponse(retry.body, { status: retry.status, headers: retry.headers });
  out.cookies.set("bff_at", pair.newAccess, accessCookieOpts);
  if (pair.newRefresh) out.cookies.set("bff_rt", pair.newRefresh, refreshCookieOpts);
  return out;
}

// экспорт на все методы (ctx.params теперь промис → ждём)
export async function GET   (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { const { path } = await ctx.params; return handle(req, path); }
export async function HEAD  (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { const { path } = await ctx.params; return handle(req, path); }
export async function POST  (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { const { path } = await ctx.params; return handle(req, path); }
export async function PUT   (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { const { path } = await ctx.params; return handle(req, path); }
export async function PATCH (req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { const { path } = await ctx.params; return handle(req, path); }
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) { const { path } = await ctx.params; return handle(req, path); }