'use client';

import {useRouter, usePathname} from 'next/navigation';
import {useLocale} from 'next-intl';

export const useLanguageSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();
    const currentLocale = useLocale();

    const changeLanguage = (newLocale: string) => {
        // Сохраняем текущий путь без локали
        const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

        // Перенаправляем на новый путь с выбранной локалью
        router.push(`/${newLocale}${pathWithoutLocale}`);
    };

    return {
        currentLocale,
        changeLanguage
    };
};