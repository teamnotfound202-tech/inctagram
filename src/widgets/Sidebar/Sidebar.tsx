import {SidebarItem} from '@/widgets/Sidebar/SidebarItem/SidebarItem';
import s from './Sidebar.module.scss'

export type Text = 'Feed'
    | 'Create'
    | 'My Profile'
    | 'Messenger'
    | 'Search'
    | 'Statistics'
    | 'Favorites'
    | 'Log Out'

export const Sidebar = () => {
    const handleLogOut = () => alert('Log out')
    return (
        <ul className={s.sidebar}>
            <SidebarItem
                key={'Feed'}
                text={'Feed'}
                link={''}
                isDisabled={false}
            />
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
                onClickAction={handleLogOut}
            />
        </ul>
    )
}