import {SidebarItem} from '@/widgets/Sidebar/SidebarItem/SidebarItem';
import s from './Sidebar.module.scss';
import {useState} from 'react';
import {Modal} from '@/shared/ui/Modal/Modal';
import {Button} from '@/shared/ui';
import {useLogoutMutation} from '@/features/auth/api/authApi';
import {useRouter} from 'next/navigation';
import {ACCESS_TOKEN} from "@/shared/lib";
import {sideBarData} from "@/shared/config/sideBarItems/sideBarData";
import type {ResponsesMe} from "@/shared/api";
import {useAppDispatch, useAppSelector} from "@/shared/lib/hooks/hooks";
import {loginTC, selectIsLoggedIn} from "@/shared/api/appSlice";
import clx from "classnames";
import {useLocale, useTranslations} from 'next-intl';


type Props = {
    data: ResponsesMe | undefined
}

export const Sidebar = ({data}: Props) => {
    const [logout] = useLogoutMutation();
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const islogined = useAppSelector(selectIsLoggedIn)
    const dispatch = useAppDispatch()
    const locale = useLocale()
    // Добавляем хук для переводов
    const t = useTranslations('navigation');
    const modalT = useTranslations('modals');
    const commonT = useTranslations('common');

    const handleModelOpen = () => setModalOpen(true);
    const handleModelClose = () => setModalOpen(false);

    const handleLogout = () => {
        logout()
            .unwrap()
            .then((res) => {
                console.log(res);
                localStorage.removeItem(ACCESS_TOKEN);
                dispatch(loginTC({isLoggedIn: false}))
                handleModelClose()
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const isVisible = !islogined

    return (
        <ul className={clx(
            s.sidebar,
            {[s.unvisible]: isVisible}
        )}>
            {sideBarData.map((item) => {
                return (
                    <SidebarItem
                        key={item.key}
                        text={t(item.text) as any} // Используем перевод для текста
                        link={item.link}
                        isDisabled={item.isDisabled}
                        {...(item.onclick && {onClickAction: handleModelOpen})}
                    />
                )
            })}

            {isModalOpen && (
                <Modal title={modalT('confirmLogout')} onClose={handleModelClose}>
                    <p className={s.contentTextModal}>
                        {modalT('confirmLogoutMessage')}{' '}
                        <span>{data?.email}</span>?
                    </p>
                    <div className={s.buttonWrapper}>
                        <Button variant={'outline'} onClick={handleLogout}>
                            {commonT('yes')}
                        </Button>
                        <Button onClick={handleModelClose}>
                            {commonT('no')}
                        </Button>
                    </div>
                </Modal>
            )}
        </ul>
    );
};