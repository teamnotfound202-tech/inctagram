'use client'
import type {Text} from '@/widgets/Sidebar/Sidebar';
import {DynamicIcon} from '@/widgets/Sidebar/SidebarItem/DinamicIcon/DinamicIcon';
import s from './SidebarItem.module.scss'
import Link from 'next/link'
import clx from 'classnames'

type Props = {
    link: string,
    text: Text,
    isDisabled: boolean
}


export const SidebarItem = ({link, text, isDisabled}: Props) => {
    return (
        <li className={clx(s.sidebarItem, {
            [s.disabled]: isDisabled
        })}>
            <Link href={link} className={s.sidebarItemLink}>
                <DynamicIcon text={text}/>
                <span className={s.sidebarItemtext}>{text}</span>
            </Link>
        </li>
    )
}