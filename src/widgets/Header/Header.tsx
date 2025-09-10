'use client'
import {Button} from '@/shared/ui/Button/Button';
import Link from 'next/link';
import s from './Header.module.scss';
import NotificationIcon from '@/widgets/Header/icons/notification.svg';
import {SelectBox} from "@/shared/ui/Select/Select";
import FlagRussia from '@/shared/ui/Select/icon/FlagRussia.svg'
import FlagEngland from '@/shared/ui/Select/icon/FlagEngland.svg'
import {Path} from "@/shared/config";
import {useAppDispatch, useAppSelector} from "@/shared/lib/hooks/hooks";
import {loginTC, selectIsLoggedIn} from "@/shared/api/appSlice";
import {ACCESS_TOKEN} from "@/shared/lib";
import {useLayoutEffect, useState} from "react";
import {useLogoutMutation} from "@/features/auth/api/authApi";

type Props = {
    isLogin: boolean;
    notification: number;
    agreement?: boolean;
};

export const Header = ({isLogin, notification, agreement}: Props) => {
    const [isLoggined, setIsLoggedIn] = useState(false);
    const loginedWithSignIn = useAppSelector(selectIsLoggedIn);
const [logout] = useLogoutMutation()
    const dispatch = useAppDispatch();
    useLayoutEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        setIsLoggedIn(!!token);
    }, [loginedWithSignIn]);
    const signUpHandle = () => {
        dispatch(loginTC({isLoggedIn: false}));
        localStorage.removeItem(ACCESS_TOKEN);
    }

    return (
        <header className={s.header}>

            <a className={s.headerTitle} href={'/'}>Inctagram</a>

            {isLoggined
                ? <div className={s.headerGroupContainer}>

                    <button className={s.buttonNotification}>
                        <NotificationIcon/>
                        {notification !== 0 && <span className={s.notificationCount}>{notification}</span>}
                    </button>
                    <SelectBox
                        options={[
                            {value: 'option1', icon: <FlagRussia/>, label: 'Russia'},
                            {value: 'option2', icon: <FlagEngland/>, label: 'England'},
                        ]}
                        name={'select1'}
                        type={'lang'}
                        defaultValue={'option2'}
                        fullWidth={false}
                    />
                </div>
                : agreement
                    ? <div className={s.headerGroupContainer}>
                        <SelectBox
                            options={[
                                {value: 'option1', icon: <FlagRussia/>, label: 'Russia'},
                                {value: 'option2', icon: <FlagEngland/>, label: 'England'},
                            ]}
                            name={'select1'}
                            type={'lang'}
                            defaultValue={'option2'}
                            fullWidth={false}
                        />
                    </div>
                    : <div className={s.buttonGroupLogin}>
                        <SelectBox
                            options={[
                                {value: 'option1', icon: <FlagRussia/>, label: 'Russia'},
                                {value: 'option2', icon: <FlagEngland/>, label: 'England'},
                            ]}
                            name={'select1'}
                            type={'lang'}
                            defaultValue={'option2'}
                            fullWidth={false}
                        />
                        {!isLoggined && <Button variant={'text'} asChild>
                            <Link href={Path.SignIn}>Log in</Link>
                        </Button>}

                        <Button onClick={signUpHandle} asChild>
                            <Link href={Path.SignUp}>Sign up</Link>
                        </Button>
                    </div>
            }


        </header>
    );
};