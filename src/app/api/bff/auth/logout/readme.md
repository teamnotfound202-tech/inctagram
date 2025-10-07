/api/bff/auth/logout — BFF-роут для выхода из аккаунта

Файл: app/api/bff/auth/logout/route.ts
Назначение: корректно разлогинить пользователя через BFF: вызвать бэкенд-логаут, и всегда очистить наши HttpOnly-куки (
bff_at, bff_rt) на домене фронтенда.

⸻

Коротко: что делает маршрут

1. Достаёт refresh из нашей куки bff_rt.
2. Делает POST на реальный бэкенд: POST {API_BASE}/auth/logout
   (если есть refresh — передаёт его в заголовке Cookie: refreshToken=...).
3. Корректно прокидывает ответ бэка:
   • если статус 204/205/304 — отдаёт ответ без тела;
   • иначе — пытается вернуть JSON (даже если бэк шлёт ошибку).
4. Всегда очищает наши куки bff_at и bff_rt через Set-Cookie: maxAge=0.
5. Возвращает ответ клиенту.

⸻

Зачем BFF-логаут, если можно сразу ходить на бэк?
• Фронт и бэк на одном домене → нет CORS, куки ставятся/чистятся надёжно.
• Токены живут в HttpOnly куках → JS их не видит (безопаснее, чем localStorage).
• Единая точка: как бы ни ответил бэкенд, мы гарантированно стираем куки на фронтовом домене.

⸻

Окружение (env)

В .env.local / переменных окружения:

API_BASE=https://connectpix.site/api/v1   # без завершающего /

NODE_ENV ставит Next сам:
• next dev → "development"
• next build && next start → "production"

В проде куки чистятся с secure: true, в деве — без secure.

⸻

Как дергать из фронта

RTK Query
• Базовая конфигурация: baseUrl: '/api/bff', credentials: 'include'.
• Эндпоинт:

logout: builder.mutation<void, void>({
query: () => ({ url: 'auth/logout', method: 'POST' }), // итого: /api/bff/auth/logout
})

«Голый» fetch

await fetch('/api/bff/auth/logout', {
method: 'POST',
credentials: 'include', // важно, чтобы куки уехали/вернулись
})

⸻

Пошагово внутри кода

1. Читаем refresh из куки

const refresh = req.cookies.get("bff_rt")?.value ?? null;

Если куки нет — всё равно продолжаем (см. пункт 4).

2. Вызываем бэкенд

const upstream = await fetch(`${API_BASE}/auth/logout`, {
method: "POST",
headers: refresh ? { Cookie: `refreshToken=${encodeURIComponent(refresh)}` } : undefined,
cache: "no-store",
});

	•	Если есть refresh, кладём его в Cookie заголовок (бэку так привычнее).
	•	no-store — не кешируем.

	3.	Готовим ответ для клиента

const status = upstream.status;
let res: NextResponse;

if (status === 204 || status === 205 || status === 304) {
// у этих статусов не должно быть тела
res = new NextResponse(null, { status, headers: { "Cache-Control": "no-store" } });
} else {
const payload = await upstream.json().catch(() => ({})); // не падаем, если не JSON
res = NextResponse.json(payload ?? {}, { status, headers: { "Cache-Control": "no-store" } });
}

Почему так:
• У 204/205/304 по стандарту нет тела → NextResponse.json(..., {status: 204}) сломает ответ. Поэтому отдаем null-тело.
• Для любых других статусов честно пытаемся отдать JSON; если апстрим шлёт не-JSON, возвращаем {}.

	4.	Чистим наши куки при любом исходе

res.cookies.set("bff_at", "", { path: "/", httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 0 });
res.cookies.set("bff_rt", "", { path: "/", httpOnly: true, secure: isProd, sameSite: "lax", maxAge: 0 });

Это удалит куки у браузера (по текущему домену/пути).

⸻

Типичные сценарии и ожидания
• Есть refresh, бэк вернул 204
→ Ответ клиенту 204 без тела; куки стёрты.
• Есть refresh, бэк вернул 200 + JSON
→ Прокинем JSON и статус 200; куки стёрты.
• Нет refresh (например, истёк)
→ Мы всё равно сходим на бэк (без Cookie), получим его статус (часто 401/204)
→ Вернём его клиенту и в любом случае стёрнем куки локально.

⸻

Как быстро проверить

В браузере

1. Залогинься (куки bff_at и bff_rt должны появиться).
2. Выполни:

fetch('/api/bff/auth/logout', { method: 'POST', credentials: 'include' })
.then(r => (console.log(r.status), r.text()))

	3.	Открой DevTools → Application → Storage → Cookies и проверь: bff_at, bff_rt удалены.

Через curl

# (опционально) сначала логин, чтобы набить jar.txt

curl -i -c jar.txt -b jar.txt \
-H 'Content-Type: application/json' \
-d '{"email":"...","password":"..."}' \
http://localhost:3000/api/bff/auth/login

# теперь logout

curl -i -c jar.txt -b jar.txt -X POST \
http://localhost:3000/api/bff/auth/logout

Смотри в ответе Set-Cookie с bff_at=; Max-Age=0 и bff_rt=; Max-Age=0.

⸻

Частые вопросы

Что, если бэк вернул ошибку (400/500)?
Мы прокинем этот статус и тело как есть, и всё равно очистим наши куки (чтобы UI считался «разлогиненным» на клиенте).

Почему передаём refresh через Cookie заголовок?
Так ожидает большинство backend-ручек логаута/рефреша. Это зеркалит поведение браузера и упрощает бэку валидацию.

Нужно ли тело запроса для логаута?
Нет. Достаточно POST и, при наличии, refresh в Cookie.

⸻

Важные детали
• export const dynamic = "force-dynamic"; / revalidate = 0 — это серверный роут без кеширования.
• credentials: 'include' на клиентских запросах обязательны, чтобы куки ушли и ответы с Set-Cookie применились.
• Убедись, что в деве ты работаешь по http://localhost. В проде — https, иначе secure-куки не поставятся/не очистятся.

⸻

Готово. Этот роут можно воспринимать как «однокнопочный логаут»: фронту не важно, как именно бэк очищает свою сторону —
мы всегда приводим клиент в «разлогиненное» состояние.