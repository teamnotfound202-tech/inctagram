type Locale = 'en' | 'ru' | 'de' | 'fr' | 'es';

export function getTimeDifference(
    postDate: string | Date,
    locale: Locale = 'en'
): string {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    const now = new Date();
    const postTime = new Date(postDate);
    const diffInMs = postTime.getTime() - now.getTime();

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (Math.abs(diffInYears) > 0) {
        return rtf.format(diffInYears, 'year');
    } else if (Math.abs(diffInMonths) > 0) {
        return rtf.format(diffInMonths, 'month');
    } else if (Math.abs(diffInDays) > 0) {
        return rtf.format(diffInDays, 'day');
    } else if (Math.abs(diffInHours) > 0) {
        return rtf.format(diffInHours, 'hour');
    } else if (Math.abs(diffInMinutes) > 0) {
        return rtf.format(diffInMinutes, 'minute');
    } else {
        return locale === 'ru' ? 'Только что' : 'Just now';
    }
}
