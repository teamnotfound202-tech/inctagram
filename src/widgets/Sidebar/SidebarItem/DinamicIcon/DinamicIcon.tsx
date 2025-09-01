import s from '@/widgets/Sidebar/SidebarItem/SidebarItem.module.scss';
import type {SVGProps} from 'react';
import LogOutIcon from '@/widgets/Sidebar/SidebarItem/icons/logout.svg'
import FeedIcon from '@/widgets/Sidebar/SidebarItem/icons/home.svg'
import CreateIcon from '@/widgets/Sidebar/SidebarItem/icons/create.svg'
import MyProfileIcon from '@/widgets/Sidebar/SidebarItem/icons/myProfile.svg'
import MessengerIcon from '@/widgets/Sidebar/SidebarItem/icons/messenger.svg'
import SearchIcon from '@/widgets/Sidebar/SidebarItem/icons/search.svg'
import StatisticsIcon from '@/widgets/Sidebar/SidebarItem/icons/statistics.svg'
import FavoritesIcon from '@/widgets/Sidebar/SidebarItem/icons/favorites.svg'

const iconMap = {
    'Feed': FeedIcon,
    'Create': CreateIcon,
    'My Profile': MyProfileIcon,
    'Messenger': MessengerIcon,
    'Search': SearchIcon,
    'Statistics': StatisticsIcon,
    'Favorites': FavoritesIcon,
    'Log Out': LogOutIcon
};


type IconProp = {
    text: keyof typeof iconMap
} & SVGProps<SVGSVGElement>

export const DynamicIcon = ({ text, ...props }: IconProp) => {
    const IconComponent = iconMap[text];

    if (!IconComponent) {
        return <div>Иконка не найдена</div>;
    }

    return <IconComponent className={s.icon} {...props} />;
};