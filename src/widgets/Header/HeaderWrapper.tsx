import {getTranslations} from 'next-intl/server';
import {Header} from '@/widgets/Header/Header';

export async function HeaderWrapper() {
    const t = await getTranslations();

    const translations = {
        languages: {
            russian: t('languages.russian'),
            english: t('languages.english')
        },
        auth: {
            logIn: t('auth.logIn'),
            signUp: t('auth.signUp')
        }
    };

    return (
        <Header
            isLogin={false}
            notification={0}
            translations={translations}
        />
    );
}