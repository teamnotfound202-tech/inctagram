'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export function useLanguageSwitch() {
    const router = useRouter();
    const pathname = usePathname();

    const switchLanguage = useCallback((newLocale: string) => {
        // Разбиваем путь на сегменты
        const segments = pathname.split('/');

        // Заменяем локаль (второй сегмент, если первый - пустая строка)
        const localeIndex = segments[1] ? 1 : 0;
        segments[localeIndex] = newLocale;

        // Собираем новый путь
        const newPath = segments.join('/');

        // Переходим на новый путь
        router.push(newPath);
    }, [pathname, router]);

    return switchLanguage;
}