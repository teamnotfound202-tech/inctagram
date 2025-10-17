type Locale = 'en' | 'ru' | 'de' | 'fr' | 'es';

export function getTimeDifference(postDate: string | Date, locale: Locale = 'en'): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const now = new Date();
  const then = new Date(postDate);
  if (isNaN(then.getTime())) return locale === 'ru' ? 'Неверная дата' : 'Invalid date';

  // diff < 0 => past, diff > 0 => future
  const diffMs = then.getTime() - now.getTime();
  const absMs = Math.abs(diffMs);

  // Средняя длина месяца ~30.44 дня — меньше скачков "11 мес" ↔ "1 год"
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year',   1000 * 60 * 60 * 24 * 365],
    ['month',  1000 * 60 * 60 * 24 * 30.4375],
    ['day',    1000 * 60 * 60 * 24],
    ['hour',   1000 * 60 * 60],
    ['minute', 1000 * 60],
    ['second', 1000],
  ];

  for (const [unit, ms] of units) {
    // выбираем первый подходящий юнит по порогу
    if (absMs >= ms || unit === 'second') {
      const value = Math.round(diffMs / ms); // округляем к ближайшему, а не floor
      if (unit === 'second' && Math.abs(value) < 10) {
        return locale === 'ru' ? 'Только что' : 'Just now';
      }
      return rtf.format(value, unit);
    }
  }

  return locale === 'ru' ? 'Только что' : 'Just now';
}