'use client'
import {Button} from '@/shared/ui/Button/Button';
import Link from 'next/link';
import s from './Header.module.scss';
import NotificationIcon from '@/widgets/Header/icons/notification.svg';
import {SelectBox} from "@/shared/ui/Select/Select";
import FlagRussia from '@/shared/ui/Select/icon/FlagRussia.svg'
import FlagEngland from '@/shared/ui/Select/icon/FlagEngland.svg'
import {Path} from "@/shared/config";
import {Container} from "@/shared/ui";
import {useAppDispatch, useAppSelector} from "@/shared/lib/hooks/hooks";
import {loginTC, selectIsLoggedIn} from "@/shared/api/appSlice";
import {ACCESS_TOKEN} from "@/shared/lib";
import {useEffect, useState} from "react";
import {useLanguageSwitcher} from "@/shared/lib/hooks/useLanguageSwitch";
import {useTranslations} from 'next-intl';


type Props = {
    isLogin: boolean;
    notification: number;
    agreement?: boolean;
};

export const Header = ({isLogin, notification, agreement}: Props) => {
    const [isLoggined, setIsLoggedIn] = useState(false);
    const loginedWithSignIn = useAppSelector(selectIsLoggedIn);
    const dispatch = useAppDispatch();
    const { currentLocale, changeLanguage } = useLanguageSwitcher();

    // Пытаемся получить переводы, а если контекст не доступен - используем статичные значения
    let t: any;
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        t = useTranslations();
    } catch (error) {
        // Контекст intl не доступен
        t = (key: string) => {
            const fallbackTexts: {[key: string]: string} = {
                'languages.russian': 'Русский',
                'languages.english': 'English',
                'auth.logIn': 'Log in',
                'auth.signUp': 'Sign up'
            };
            return fallbackTexts[key] || key;
        };
    }

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        setIsLoggedIn(!!token);
    }, [loginedWithSignIn]);

    const signUpHandle = () => {
        dispatch(loginTC({isLoggedIn: false}));
        localStorage.removeItem(ACCESS_TOKEN);
    }

    // Опции для языкового селектора
    const languageOptions = [
        {
            value: 'ru',
            icon: <FlagRussia/>,
            label: t('languages.russian')
        },
        {
            value: 'en',
            icon: <FlagEngland/>,
            label: t('languages.english')
        }
    ];

    const handleLanguageChange = (value: string) => {
        changeLanguage(value);
    };

    // Функция для получения корректных путей с учетом локали
    const getLocalizedPath = (path: string) => {
        return `/${currentLocale}${path}`;
    };

    return (
        <header className={s.header}>
            <Container>
                <div className={s.headerWrapper}>
                    <a className={s.headerTitle} href={getLocalizedPath('/')}>Inctagram</a>

                    {isLoggined
                        ? <div className={s.headerGroupContainer}>

                            <button className={s.buttonNotification}>
                                <NotificationIcon/>
                                {notification !== 0 && <span className={s.notificationCount}>{notification}</span>}
                            </button>
                            <SelectBox
                                options={languageOptions}
                                name={'language-select'}
                                type={'lang'}
                                value={currentLocale}
                                onValueChange={handleLanguageChange}
                                fullWidth={false}
                            />
                        </div>
                        : agreement
                            ? <div className={s.headerGroupContainer}>
                                <SelectBox
                                    options={languageOptions}
                                    name={'language-select'}
                                    type={'lang'}
                                    value={currentLocale}
                                    onValueChange={handleLanguageChange}
                                    fullWidth={false}
                                />
                            </div>
                            : <div className={s.buttonGroupLogin}>
                                <SelectBox
                                    options={languageOptions}
                                    name={'language-select'}
                                    type={'lang'}
                                    value={currentLocale}
                                    onValueChange={handleLanguageChange}
                                    fullWidth={false}
                                />
                                {!isLoggined && <Button variant={'text'} asChild>
                                    <Link href={getLocalizedPath(Path.SignIn)}>{t('auth.logIn')}</Link>
                                </Button>}

                                <Button onClick={signUpHandle} asChild>
                                    <Link href={getLocalizedPath(Path.SignUp)}>{t('auth.signUp')}</Link>
                                </Button>
                            </div>
                    }
                </div>
            </Container>
        </header>
    );
};