const MS = {
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
} as const

type FormatCreatedAtOptions = {
  now?: Date
  locale?: string
  timeZone?: string // e.g. "Europe/Berlin"
}

export function formatCreatedAt(
  createdAtIso: string,
  { now = new Date(), locale = 'en', timeZone }: FormatCreatedAtOptions = {}
): string {
  // createdAtIso example: "2025-12-08T07:44:50.689Z"
  // получаем дату в строковом формате
  const date = new Date(createdAtIso)

  // проверяем что date.getTime() в милисекундах не isNaN
  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }
  // получаем разницу между временем сейчас и переданным временем в милисекундах
  const diffMs = Math.abs(now.getTime() - date.getTime())

  const tzOpt = timeZone ? { timeZone } : undefined

  // если разница меньше дня в милисекундах то выводим в формате часы:минуты
  // < 24h -> time
  if (diffMs < MS.day) {
    return new Intl.DateTimeFormat(locale, {
      ...tzOpt,
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }
  // если разница меньше недели в милисекундах то выводим в формате день недели
  // < 7d -> weekday
  if (diffMs < MS.week) {
    return new Intl.DateTimeFormat(locale, {
      ...tzOpt,
      weekday: 'short',
    }).format(date)
  }
  // если разница больше или равна недели в милисекундах то выводим в формате день месяц год
  // >= 7d -> day month year
  return new Intl.DateTimeFormat(locale, {
    ...tzOpt,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

