'use client';

import { useParams } from 'next/navigation';

export function useLocale(): string {
    const params = useParams();

    // Проверяем, что locale есть и он валидный
    const locale = params.locale as string;
    const validLocales = ['en', 'ru'];

    return validLocales.includes(locale) ? locale : 'en';
}