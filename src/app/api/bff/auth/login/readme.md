/api/bff/auth/login — BFF-роут логина

Файл: app/api/bff/auth/login/route.ts
Задача: принять логин-данные с клиента, сходить на реальный бэкенд, получить пару токенов, и безопасно сохранить их в
HttpOnly куках на домене фронта.

⸻

Зачем это нужно
• Безопасность: токены хранятся в HttpOnly куках (bff_at — access, bff_rt — refresh). JS-код их не читает → затрудняет
XSS-кражу.
• Удобство для клиента: дальше фронт делает запросы только на /api/bff/proxy/... без ручной сборки Authorization и без
логики «рефреша».
• Нет CORS: все запросы идут на тот же домен (Next.js), а BFF сам ходит на внешний API.

⸻

Как это использовать на фронте

RTK Query / fetchBaseQuery
• Базовая конфигурация API:

baseUrl: '/api/bff',
credentials: 'include', // куки поедут автоматически

	•	Эндпоинт логина:

login: builder.mutation<{ ok: true }, { email: string; password: string }>({
query: (body) => ({ url: 'auth/login', method: 'POST', body }),
})

👉 Итоговый URL: POST /api/bff/auth/login (наш BFF-роут).

После успешного ответа { ok: true } в браузере появятся:
• bff_at — access-токен (сессионная кука),
• bff_rt — refresh-токен (maxAge: 7 дней).

«Голый» fetch

await fetch('/api/bff/auth/login', {
method: 'POST',
credentials: 'include', // обязательно!
headers: { 'content-type': 'application/json' },
body: JSON.stringify({ email, password }),
});

⸻

Что ожидает бэкенд и что он возвращает
• Ваш бэкенд на POST {API_BASE}/auth/login:
• кладёт access в тело ответа: { accessToken: "<JWT>" };
• кладёт refresh только в Set-Cookie: refreshToken=....
• Если логин неуспешен — отдаёт не-200 с JSON-ошибкой (мы её честно прокинем).

⸻

Как работает этот роут (step-by-step)

1. Читаем логин-данные из тела запроса:

const creds = await req.json();

	2.	Делаем запрос на реальный бэкенд:

await fetch(`${API_BASE}/auth/login`, {
method: 'POST',
headers: { 'content-type': 'application/json' },
body: JSON.stringify(creds),
cache: 'no-store',
});

	3.	Разбираем ответ бэка:

	•	если статус не ok — возвращаем тот же статус и JSON клиенту (пробрасываем ошибку как есть);
	•	если ok — читаем accessToken из JSON и refreshToken из заголовка Set-Cookie:

const access = data?.accessToken; // из JSON
const refresh = parseRefreshFromSetCookie(upstream.headers.get('set-cookie')); // из Set-Cookie

	4.	Ставим наши куки на домене фронта:

res.cookies.set('bff_at', access, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/' });
res.cookies.set('bff_rt', refresh, { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/', maxAge: 60*60*24*7 });

	•	bff_at — сессионная (без maxAge): живёт пока открыт браузер/сессия.
	•	bff_rt — 7 дней (maxAge).

	5.	Возвращаем короткий ответ клиенту:

return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });

⸻

Важные детали кода
• API_BASE читается из окружения (.env.local / настройки хостинга):

API_BASE=https://connectpix.site/api/v1

Без завершающего /.

	•	isProd = process.env.NODE_ENV === 'production'

В проде ставим secure: true у кук (требуется HTTPS). В dev на http://localhost secure будет false.
• parseRefreshFromSetCookie вытаскивает refreshToken=... из Set-Cookie.
Здесь используется decodeURIComponent, потому что бэки иногда процентизируют значение.
• safeJson — «мягкий» парсер JSON, чтобы не падать, если апстрим внезапно вернул не-JSON.
• dynamic = 'force-dynamic', revalidate = 0 — никакого кеширования; это чисто серверный хэндлер.

⸻

Ошибки и что вернётся
• Бэк вернул 401/400/500 → клиент получит тот же статус и тело (мы пробрасываем как есть).
• Бэк вернул 200, но нет accessToken в JSON → ответим 502 { error: 'No accessToken in response' } (страховка).
• Если у бэка не пришёл Set-Cookie с refreshToken — мы всё равно поставим только bff_at (но дальше авто-рефреш работать
не сможет; проверьте бэк).

⸻

Как быстро проверить руками

Браузером

1. Вызови логин (через UI или через консоль — пример выше).
2. Открой DevTools → Application → Cookies → твой сайт:
   • появились bff_at (сессионная) и bff_rt (с Max-Age).
3. Сходи на защищённый эндпоинт через прокси:

fetch('/api/bff/proxy/auth/me', { credentials: 'include' }).then(r => r.json())

Должен прийти профиль.

cURL (с куки-банкой)

# логин

curl -i -c jar.txt -b jar.txt \
-H 'Content-Type: application/json' \
-d '{"email":"EMAIL","password":"PASS"}' \
http://localhost:3000/api/bff/auth/login

# проверка защищённого

curl -i -c jar.txt -b jar.txt \
'http://localhost:3000/api/bff/proxy/auth/me'

⸻

Частые вопросы

Почему мы не возвращаем токены в JSON клиенту?
Чтобы не утащили их JS-кодом/инъекцией. Токены ставятся куками HttpOnly и используются только на сервере в BFF-роутах.

Где потом берётся Authorization?
В прокси-роуте /api/bff/proxy/[...path]: он достаёт bff_at из куки и сам ставит Authorization: Bearer ... в
апстрим-запрос.

Что, если бэк кладёт refresh только в Set-Cookie и никогда в JSON?
Это именно тот кейс, под который и написан этот хэндлер: парсим Set-Cookie и записываем наш bff_rt.

⸻

Итог

Этот роут — «дверь входа» в BFF-схему. Он:
• получает access из тела ответа бэка,
• получает refresh из Set-Cookie бэка,
• ставит обе куки HttpOnly для фронтового домена,
• возвращает { ok: true }.

Дальше все вызовы API делаем через /api/bff/proxy/..., и прокси уже сам подставит токен и обновит его при 401.