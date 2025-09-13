import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Поддерживаемые локали
const locales = ['en', 'ru'];

export default async function LocaleLayout({
                                               children,
                                               params: { locale }
                                           }: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    // Валидация локали
    if (!locales.includes(locale as any)) {
        notFound();
    }

    // Загружаем сообщения для текущей локали
    const messages = await getMessages();

    return (

        <NextIntlClientProvider messages={messages}>
            {children}
        </NextIntlClientProvider>

    );
}