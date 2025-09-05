'use client'
import { Button } from '@/shared/ui/Button/Button';
import Link from 'next/link';
import s from './Header.module.scss';
import NotificationIcon from '@/widgets/Header/icons/notification.svg';
import {SelectBox} from "@/shared/ui/Select/Select";
import FlagRussia from '@/shared/ui/Select/icon/FlagRussia.svg'
import FlagEngland from '@/shared/ui/Select/icon/FlagEngland.svg'

type Props = {
    isLogin: boolean;
    notification: number;
};

export const Header = ({ isLogin, notification }: Props) => {
    return (
        <header className={s.header}>

            <a className={s.headerTitle} href={'/'}>Inctagram</a>


                {isLogin ? (
                    <div className={s.headerGroupContainer}>

                        <button className={s.buttonNotification}>
                            <NotificationIcon />
                            { notification!== 0 && <span className={s.notoficationCount}>{notification}</span>}
                        </button>
                        <SelectBox
                            options={[
                            {value:'option1', icon:<FlagRussia/>, label:'Russia'},
                            {value:'option2', icon:<FlagEngland/>, label:'England'},
                        ]}
                            name={'select1'}
                            type={'lang'}
                            defaultValue={'option2'}
                            fullWidth={false}
                        />
                    </div>
                ) : (
                    <div className={s.buttonGroupLogin}>
                        <SelectBox
                            options={[
                                {value:'option1', icon:<FlagRussia/>, label:'Russia'},
                                {value:'option2', icon:<FlagEngland/>, label:'England'},
                            ]}
                            name={'select1'}
                            type={'lang'}
                            defaultValue={'option2'}
                            fullWidth={false}
                        />
                        <Button variant={'text'} asChild>
                            <Link href={'/auth/login'}>Log in</Link>
                        </Button>
                        <Button asChild>
                            <Link href={'/auth/register'}>Sign up</Link>
                        </Button>
                    </div>
                )}

        </header>
    );
};