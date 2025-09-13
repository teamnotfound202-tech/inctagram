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
import {LocalizedLink} from '@/shared/ui/LocalizedLink';

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
        t = useTranslations();
    } catch (error) {
        // Контекст intl не доступен
        t = (key: string) => {
            const fallbackTexts: {[key: string]: string} = {
                'languages.russian': currentLocale === 'ru' ? 'Русский' : 'Russian',
                'languages.english': currentLocale === 'ru' ? 'Английский' : 'English',
                'auth.logIn': currentLocale === 'ru' ? 'Войти' : 'Log in',
                'auth.signUp': currentLocale === 'ru' ? 'Регистрация' : 'Sign up'
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
    return (
        <header className={s.header}>
            <Container>
                <div className={s.headerWrapper}>
                    <LocalizedLink className={s.headerTitle} href={'/'}>Inctagram</LocalizedLink>

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
                                    <LocalizedLink href={Path.SignIn}>{t('auth.logIn')}</LocalizedLink>
                                </Button>}

                                <Button onClick={signUpHandle} asChild>
                                    <LocalizedLink href={Path.SignUp}>{t('auth.signUp')}</LocalizedLink>
                                </Button>
                            </div>
                    }
                </div>
            </Container>
        </header>
    );
};