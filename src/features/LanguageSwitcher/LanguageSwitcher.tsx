'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LanguageSwitcher({ initialLocale }: { initialLocale: string }) {
    const [locale, setLocale] = useState(initialLocale);
    const router = useRouter();

    // Синхронизация при монтировании
    useEffect(() => {
        const savedLocale = localStorage.getItem('locale');
        if (savedLocale && savedLocale !== initialLocale) {
            setLocale(savedLocale);
            router.refresh();
        }
    }, [initialLocale, router]);

    const changeLocale = (newLocale: string) => {
        localStorage.setItem('locale', newLocale);
        setLocale(newLocale);
        router.refresh();
    };

    return (
        <select
            value={locale}
            onChange={(e) => changeLocale(e.target.value)}
        >
            <option value="ru">Русский</option>
            <option value="en">English</option>
        </select>
    );
}