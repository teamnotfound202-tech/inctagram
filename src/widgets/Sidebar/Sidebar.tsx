import { SidebarItem } from '@/widgets/Sidebar/SidebarItem/SidebarItem';
import s from './Sidebar.module.scss';
import { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui';
import { useLogoutMutation, useMeQuery } from '@/features/auth/api/authApi';
import { useRouter } from 'next/navigation';

export type Text =
  | 'Feed'
  | 'Create'
  | 'My Profile'
  | 'Messenger'
  | 'Search'
  | 'Statistics'
  | 'Favorites'
  | 'Log Out';

export const Sidebar = () => {
  const [mounted, setMounted] = useState(false);
  const { data } = useMeQuery(undefined, { skip: !mounted });
  const [logout] = useLogoutMutation();

  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const handleModelOpen = () => setModalOpen(true);
  const handleModelClose = () => setModalOpen(false);
  const handleLogout = () => {
    logout()
      .unwrap()
      .then((res) => {
        console.log(res);
        router.push('/login');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ul className={s.sidebar}>
      <SidebarItem key={'Feed'} text={'Feed'} link={''} isDisabled={false} />
      <SidebarItem
        key={'Create'}
        text={'Create'}
        link={''}
        isDisabled={false}
      />
      <SidebarItem
        key={'My Profile'}
        text={'My Profile'}
        link={''}
        isDisabled={false}
      />
      <SidebarItem
        key={'Messenger'}
        text={'Messenger'}
        link={''}
        isDisabled={false}
      />
      <SidebarItem
        key={'Search'}
        text={'Search'}
        link={''}
        isDisabled={false}
      />
      <SidebarItem
        key={'Statistics'}
        text={'Statistics'}
        link={''}
        isDisabled={false}
      />
      <SidebarItem
        key={'Favorites'}
        text={'Favorites'}
        link={''}
        isDisabled={false}
      />
      <SidebarItem
        key={'Log Out'}
        text={'Log Out'}
        link={''}
        isDisabled={false}
        onClickAction={handleModelOpen}
      />
      {isModalOpen && (
        <Modal title={'Log Out'} onClick={handleModelClose}>
          <p className={s.contentTextModal}>
            Are you really want to log out of your account{' '}
            <span>{data?.email}</span>
          </p>
          <div className={s.buttonWrapper}>
            <Button variant={'outline'} onClick={handleLogout}>
              Yes
            </Button>
            <Button onClick={handleModelClose}>No</Button>
          </div>
        </Modal>
      )}
    </ul>
  );
};
