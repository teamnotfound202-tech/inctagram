'use client';

import {useRouter, usePathname} from 'next/navigation';
import {useLocale} from 'next-intl';

export const useLanguageSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();
    
    // Пытаемся получить текущую локаль, а если контекст не доступен - используем по умолчанию
    let currentLocale = 'en';
    try {
        currentLocale = useLocale();
    } catch (error) {
        // Контекст intl не доступен, используем локаль из URL
        const localeFromPath = pathname.split('/')[1];
        if (['en', 'ru'].includes(localeFromPath)) {
            currentLocale = localeFromPath;
        }
    }

    const changeLanguage = (newLocale: string) => {
        // Сохраняем текущий путь без локали
        const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

        // Перенаправляем на новый путь с выбранной локалью
        router.push(`/${newLocale}${pathWithoutLocale}`);
        router.refresh();
    };

    return {
        currentLocale,
        changeLanguage,
        availableLocales: ['en', 'ru'] as const
    };
};