import { Button } from '@/shared/ui/Button/Button';
import s from './Header.module.scss';
import NotificationIcon from '@/widgets/Header/icons/notification.svg';

type Props = {
    isLogin: boolean;
    notification: number;
};

export const Header = ({ isLogin, notification }: Props) => {
    return (
        <header className={s.header}>

            <a className={s.headerTitle} href={'/'}>Inctagram</a>

            <div>
                {isLogin ? (
                    <div className={s.headerGroupContainer}>

                        <button className={s.buttonNotification}>
                            <NotificationIcon />
                            { notification!== 0 && <span className={s.notoficationCount}>{notification}</span>}
                        </button>

                        <select style={{width: '163px', height:'36px', backgroundColor: 'transparent'}}>
                            <option>Пункт 1</option>
                            <option>Пункт 2</option>
                        </select>
                    </div>
                ) : (
                    <div className={s.buttonGroupLogin}>
                        <select style={{width: '163px', height:'36px', backgroundColor: 'transparent'}}>
                            <option>Пункт 1</option>
                            <option>Пункт 2</option>
                        </select>
                        <Button variant={'text'}>Log in</Button>
                        <Button>Sign up</Button>
                    </div>
                )}
            </div>
        </header>
    );
};