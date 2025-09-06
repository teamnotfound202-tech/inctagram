import { Button } from '@/shared/ui/Button/Button';
import s from './Header.module.scss';
import NotificationIcon from '@/widgets/Header/icons/notification.svg';
import {SelectBox} from "@/shared/ui/Select/Select";
import FlagRussia from '@/shared/ui/Select/icon/FlagRussia.svg'
import FlagEngland from '@/shared/ui/Select/icon/FlagEngland.svg'

type Props = {
    isLogin: boolean;
    notification: number;
    agreement?:boolean;
};

export const Header = ({ isLogin, notification, agreement }: Props) => {
    return (
        <header className={s.header}>

            <a className={s.headerTitle} href={'/'}>Inctagram</a>

                {isLogin
                    ? <div className={s.headerGroupContainer}>

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
                    : agreement
                        ? <div className={s.headerGroupContainer}>
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
                        : <div className={s.buttonGroupLogin}>
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
                        <Button variant={'text'}>Log in</Button>
                        <Button>Sign up</Button>
                    </div>
                }

        </header>
    );
};