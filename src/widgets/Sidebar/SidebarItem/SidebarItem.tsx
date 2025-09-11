'use client'
import {Button} from '@/shared/ui';
import type {Text} from '@/shared/config/sideBarItems/sideBarData';
import {DynamicIcon} from '@/widgets/Sidebar/SidebarItem/DinamicIcon/DinamicIcon';
import s from './SidebarItem.module.scss'
import Link from 'next/link'
import clx from 'classnames'

type Props = {
    link: string,
    text: Text,
    isDisabled: boolean
    onClickAction?: () => void
    isVisible?: boolean
}


export const SidebarItem = ({link, text, isDisabled, onClickAction, isVisible}: Props) => {
    return (
        <li className={clx(s.sidebarItem, {
            [s.disabled]: isDisabled

        })}>
            {text === 'Log Out' ? (
                <Button className={clx(s.sidebarItemLink, {
                    [s.unvisible]: isVisible
                })}
                        onClick={onClickAction}>
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