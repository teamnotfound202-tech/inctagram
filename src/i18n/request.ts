import {getRequestConfig} from 'next-intl/server';
import {notFound} from "next/navigation";
const locales = ['en', 'ru'];
export default getRequestConfig(async () => {
    // Static for now, we'll change this later
    const locale = 'ru';

   if (!locales.includes(locale as string)) notFound();
    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});