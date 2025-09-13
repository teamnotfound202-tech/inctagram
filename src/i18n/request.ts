import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'ru'];

export default getRequestConfig(async ({locale}) => {
    // Проверяем, что локаль поддерживается
    if (!locale || !locales.includes(locale)) {
        return {
            locale: 'en',
            messages: (await import(`../messages/en.json`)).default
        };
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});