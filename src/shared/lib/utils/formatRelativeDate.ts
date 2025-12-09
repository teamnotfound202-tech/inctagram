type Locale = 'en' | 'ru';

export function formatRelativeDate(iso: string, locale: Locale = 'en'): string {
    const date = new Date(iso);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = 7 * dayMs;
    const yearMs = 365 * dayMs;

    const isEn = locale === 'en';

    // < 1 day → 17:33
    if (diffMs < dayMs) {
        return date.toLocaleTimeString(isEn ? 'en-US' : 'ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }

    // < 1 week → Mon / Пн
    if (diffMs < weekMs) {
        const weekday = date.toLocaleDateString(isEn ? 'en-US' : 'ru-RU', {
            weekday: 'short',
        });
        // уберём точку в русском (Пн., Ср. → Пн, Ср)
        return isEn ? weekday : weekday.replace('.', '');
    }

    // > 1 year → 4 Oct 2024 / 4 окт 2024
    if (diffMs > yearMs) {
        const day = date.getDate();
        const month = date.toLocaleDateString(isEn ? 'en-US' : 'ru-RU', {
            month: 'short',
        });

        const year = date.getFullYear();
        const monthClean = isEn
            ? month
            : month.replace('.', ''); // окт. → окт

        return `${day} ${monthClean} ${year}`;
    }

    // else (> week, <= year) → 4 Oct / 4 окт
    const day = date.getDate();
    const month = date.toLocaleDateString(isEn ? 'en-US' : 'ru-RU', {
        month: 'short',
    });
    const monthClean = isEn ? month : month.replace('.', '');
    return `${day} ${monthClean}`;
}
