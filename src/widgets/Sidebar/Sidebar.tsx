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

type SideBarElement = {
    text: Text
    link: string
    isDisabled: boolean
}

const sidebarElements1: SideBarElement[] = [
    {
        text: 'Feed',
        link: '#',
        isDisabled: true
    },
    {
        text: 'Create',
        link: '#',
        isDisabled: false
    },
    {
        text: 'My Profile',
        link: '#',
        isDisabled: false
    },
    {
        text: 'Messenger',
        link: '#',
        isDisabled: false
    },
    {
        text: 'Search',
        link: '#',
        isDisabled: false
    },
    {
        text: 'Statistics',
        link: '#',
        isDisabled: false

    },
    {
        text: 'Favorites',
        link: '#',
        isDisabled: false
    },
    {
        text: 'Log Out',
        link: '#',
        isDisabled: false
    },
]

export const Sidebar = () => {
    return (
        <ul className={s.sidebar}>
            {
                sidebarElements1.map(item => (
                    <SidebarItem
                        key={item.text}
                        text={item.text}
                        link={item.link}
                        isDisabled={item.isDisabled}
                    />
                ))
            }
        </ul>
    )
}