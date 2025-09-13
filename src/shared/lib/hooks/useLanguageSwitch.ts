'use client';

import {useRouter, usePathname} from 'next/navigation';

export const useLanguageSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();

    const changeLanguage = (newLocale: string) => {
        // Извлекаем текущую локаль из пути (если есть)
        const pathSegments = pathname.split('/').filter(Boolean);
        const possibleLocale = pathSegments[0];

        // Список поддерживаемых локалей
        const supportedLocales = ['en', 'ru'];
        const currentLocale = supportedLocales.includes(possibleLocale) ? possibleLocale : 'en';

        // Удаляем текущую локаль из пути
        let pathWithoutLocale = pathname;
        if (supportedLocales.includes(currentLocale)) {
            pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
        }

        // Перенаправляем на новый путь с выбранной локалью
        router.push(`/${newLocale}${pathWithoutLocale}`);
    };

    // Функция для получения текущей локали из URL
    const getCurrentLocale = (): string => {
        const pathSegments = pathname.split('/').filter(Boolean);
        const possibleLocale = pathSegments[0];
        const supportedLocales = ['en', 'ru'];

        return supportedLocales.includes(possibleLocale) ? possibleLocale : 'en';
    };

    return {
        currentLocale: getCurrentLocale(),
        changeLanguage
    };
};