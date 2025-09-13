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
    const {currentLocale, changeLanguage} = useLanguageSwitcher();
    const t = useTranslations();

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        setIsLoggedIn(!!token);
    }, [loginedWithSignIn]);

    const signUpHandle = () => {
        dispatch(loginTC({isLoggedIn: false}));
        localStorage.removeItem(ACCESS_TOKEN);
    }

    const handleLanguageChange = (value: string) => {
        const localeMap: { [key: string]: string } = {
            'option1': 'ru',
            'option2': 'en'
        };

        const newLocale = localeMap[value];
        if (newLocale) {
            changeLanguage(newLocale);
        }
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
                                options={[
                                    {value: 'option1', icon: <FlagRussia/>, label: t('languages.russian')},
                                    {value: 'option2', icon: <FlagEngland/>, label: t('languages.english')},
                                ]}
                                name={'language'}
                                type={'lang'}
                                defaultValue={currentLocale === 'ru' ? 'option1' : 'option2'}
                                fullWidth={false}
                                onValueChange={handleLanguageChange}
                            />
                        </div>
                        : agreement
                            ? <div className={s.headerGroupContainer}>
                                <SelectBox
                                    options={[
                                        {value: 'option1', icon: <FlagRussia/>, label: t('languages.russian')},
                                        {value: 'option2', icon: <FlagEngland/>, label: t('languages.english')},
                                    ]}
                                    name={'language'}
                                    type={'lang'}
                                    defaultValue={currentLocale === 'ru' ? 'option1' : 'option2'}
                                    fullWidth={false}
                                    onValueChange={handleLanguageChange}
                                />
                            </div>
                            : <div className={s.buttonGroupLogin}>
                                <SelectBox
                                    options={[
                                        {value: 'option1', icon: <FlagRussia/>, label: t('languages.russian')},
                                        {value: 'option2', icon: <FlagEngland/>, label: t('languages.english')},
                                    ]}
                                    name={'language'}
                                    type={'lang'}
                                    defaultValue={currentLocale === 'ru' ? 'option1' : 'option2'}
                                    fullWidth={false}
                                    onValueChange={handleLanguageChange}
                                />
                                {!isLoggined && <Button variant={'text'} asChild>
                                    <Link href={getLocalizedPath(Path.SignIn)}>
                                        {t('auth.signIn')}
                                    </Link>
                                </Button>}

                                <Button onClick={signUpHandle} asChild>
                                    <Link href={getLocalizedPath(Path.SignUp)}>
                                        {t('auth.signUp')}
                                    </Link>
                                </Button>
                            </div>
                    }
                </div>
            </Container>
        </header>
    );
};