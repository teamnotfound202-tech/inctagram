export const locales = ['en', 'ru'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

// Проверка что локаль поддерживается
export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}