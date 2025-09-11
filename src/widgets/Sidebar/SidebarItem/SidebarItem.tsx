'use client'
import {Button} from '@/shared/ui';
import type {Text} from '@/widgets/Sidebar/Sidebar';
import {DynamicIcon} from '@/widgets/Sidebar/SidebarItem/DinamicIcon/DinamicIcon';
import s from './SidebarItem.module.scss'
import Link from 'next/link'
import clx from 'classnames'

type Props = {
    link: string,
    text: Text,
    isDisabled: boolean
    onClickAction?: () => void
}


export const SidebarItem = ({link, text, isDisabled, onClickAction}: Props) => {
    return (
        <li className={clx(s.sidebarItem, {
            [s.disabled]: isDisabled
        })}>
            { text === 'Log Out' ? (
                    <Button className={s.sidebarItemLink} onClick={onClickAction}>
                        <DynamicIcon text={text}/>
                        <span className={s.sidebarItemtext}>{text}</span>
                    </Button>
                ) : (
                        <Link href={link} className={s.sidebarItemLink}>
                            <DynamicIcon text={text}/>
                            <span className={s.sidebarItemtext}>{text}</span>
                        </Link>
                    )
            }

        </li>
    )
}