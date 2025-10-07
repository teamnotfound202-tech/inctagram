BFF Proxy Route — понятное объяснение

Файл: app/api/bff/proxy/[...path]/route.ts
Задача: безопасно проксировать все запросы с фронтенда на реальный бэкенд, автоматически подставляя Authorization,
обновляя токены по refresh и защищая от CSRF.

⸻

Зачем он нужен
• Безопасность: токены живут в HttpOnly куках (bff_at, bff_rt), не в localStorage. JS их не читает → сложнее украсть.
• Простота для фронта: на клиенте не нужно добавлять заголовок Authorization, думать о рефреше и сроках жизни токенов —
всё делает BFF.
• Один домен: запросы идут на ваш Next.js (/api/bff/...) → нет CORS, корректные куки.
• Защита: базовая проверка Origin для «опасных» методов (POST/PUT/PATCH/DELETE).

⸻

Как им пользоваться на фронте

1. В RTK Query/fetchBaseQuery сделайте:

baseUrl: '/api/bff',
credentials: 'include', // чтобы куки автоматически уходили

	2.	Любые запросы на реальный бэкенд направляйте через префикс proxy/:

// было:  GET https://backend/api/v1/users/profile
// стало: GET /api/bff/proxy/users/profile

	3.	Параметры в URL сохраняются:

/api/bff/proxy/users/Lucky39/following?pageSize=12&cursor=58

Важно: на клиенте не добавляйте Authorization — это делает BFF на сервере.

⸻

Что требуется в окружении

В .env.local (и на проде в переменных окружения):

API_BASE=https://connectpix.site/api/v1    # без завершающего слэша

NODE_ENV выставляет сам Next:
• next dev → "development"
• next build && next start → "production"

Secure у куки включается только в production.

⸻

Куки, с которыми работает BFF
• bff_at — access-токен, сессионная кука (без maxAge).
• bff_rt — refresh-токен, maxAge: 7 дней.

Обе — HttpOnly, SameSite: "lax", Secure: true в проде.

⸻

Как работает прокси

1. CSRF-проверка Origin
   Для методов из набора UNSAFE = {POST, PUT, PATCH, DELETE}:
   • Берём Origin из запроса и свой origin (req.nextUrl.origin).
   • Если они разные → отвечаем 403 { error: "CSRF: bad origin" }.
2. Сборка целевого URL бэка
   • Из [...path] собираем путь: users/profile → ${API_BASE}/users/profile.
   • Обязательно копируем квери-строку:
   upstreamUrl.search = req.nextUrl.search
   (иначе пагинация/фильтры не дойдут до бэка).
3. Читаем тело один раз
   У запроса тело — это stream, его можно прочитать только один раз.
   Мы буферизуем:

const needsBody = !["GET","HEAD"].includes(req.method)
const bodyBuffer = needsBody ? await req.arrayBuffer() : undefined

	4.	Готовим «проброс» запроса (forward)
	•	Копируем content-type при наличии.
	•	Если есть access-токен → ставим Authorization: Bearer <token>.
	•	Добавляем x-requested-with: XMLHttpRequest (можно использовать для отличия запросов через BFF).
	•	Отправляем fetch(target, { method, headers, body, cache: "no-store" }).
	5.	Первый запрос к бэку
	•	Пытаемся с access-токеном из куки bff_at.
	•	Если не получили 401 или у нас нет bff_rt → сразу возвращаем ответ пользователю

(статус/заголовки/тело прокидываем как есть).

6. Если 401 и есть refresh
   • Делаем POST ${API_BASE}/auth/update-tokens, передаём refreshToken в Cookie заголовке:

headers: { Cookie: `refreshToken=${encodeURIComponent(refresh)}` }

	•	Ждём новый accessToken в JSON-теле и, возможно, новый refreshToken в Set-Cookie.
	•	Если access не пришёл → возвращаем исходный 401 пользователю.

	7.	Повтор запроса
	•	Отправляем тот же запрос ещё раз, но уже с новым access-токеном.
	•	Ставим/обновляем наши куки:
	•	bff_at = newAccess (сессионная),
	•	bff_rt = newRefresh (если бэк прислал новый, на 7 дней).
	8.	Возвращаем ответ как есть
	•	Создаём new NextResponse(retry.body, { status: retry.status, headers: retry.headers }).
	•	Добавляем Set-Cookie с обновлёнными токенами.
	•	Отправляем клиенту.

⸻

Ключевые функции и блоки

parseRefreshFromSetCookie(setCookie)

Достаёт значение refreshToken=... из заголовка Set-Cookie ответа бэка. Ничего не декодируем «насильно», чтобы не
сломаться на нестандартных символах.

refreshPair(refresh: string)

Запрашивает у бэка новую пару токенов:
• шлёт POST /auth/update-tokens с Cookie: refreshToken=...;
• из JSON берёт accessToken;
• из Set-Cookie — новый refreshToken (если ротируется).

forward(token?)

Формирует и отправляет запрос на бэк, копируя метод, заголовки и тело, подставляя Authorization при наличии.

⸻

Почему именно так
• HttpOnly cookies защищают от XSS-кражи токенов.
• Origin-проверка снижает CSRF-риски на опасных методах (даже при SameSite=Lax).
• Повторное чтение тела: мы буферизуем, чтобы можно было повторить запрос после рефреша.
• Параметры в URL: прокидываем ?pageSize=…&cursor=…, иначе пагинация ломается.
• Стримим ответ бэка дальше (не читаем его в память целиком).

⸻

Расхождение по версиям Next.js

В Next 15 ctx.params в Route Handlers может быть Promise. Поэтому для каждого метода мы пишем:

export async function GET(req, ctx) {
const { path } = await ctx.params; // ждём
return handle(req, path);
}

(Аналогично для HEAD/POST/PUT/PATCH/DELETE.)

⸻

Частые ошибки и решения
• «Вторая страница возвращает те же данные»
Не прокинули query-строку к бэку. В этом файле уже есть фикс:
upstreamUrl.search = req.nextUrl.search.
• «Authorization отсутствует в запросах»
Это нормально на клиенте. Заголовок добавляет прокси на сервере, беря bff_at из куки.
• «CORS»
Значит, вы дернули напрямую внешний API. Все вызовы должны идти на /api/bff/proxy/....
• «Куки не ставятся в dev»
Убедитесь, что флаг secure зависит от окружения (isProd), а вы работаете по http://localhost.

⸻

Мини-чеклист перед использованием
• В .env.local задан API_BASE=... (без слэша на конце).
• В RTK Query baseUrl: '/api/bff', credentials: 'include'.
• Все эндпоинты идут через proxy/... (например, proxy/users/profile).
• На клиенте нигде не ставим Authorization вручную.
• Параметры пагинации/поиска добавляем в URL — прокси их прокинет.

⸻

Примеры

// Получить профиль
GET /api/bff/proxy/users/profile

// Пагинация
GET /api/bff/proxy/users/User123/following?pageSize=12&cursor=58

// Создать пост
POST /api/bff/proxy/posts
// тело — как обычно; прокси повторит запрос, если получит 401 и сможет освежить токен

⸻

Если что-то «не едет», включите логи Next и посмотрите:
• статус/URL апстрима,
• есть ли ?query в target,
• пришли ли новые токены после 401,
• что лежит в HttpOnly куках браузера (bff_at, bff_rt) после логина/refresh.