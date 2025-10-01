'use client'
import { Button } from '@/shared/ui'
import type { Text } from '@/shared/config/sideBarItems/sideBarData'
import { DynamicIcon } from '@/widgets/Sidebar/SidebarItem/DinamicIcon/DinamicIcon'
import s from './SidebarItem.module.scss'
import Link from 'next/link'
import clx from 'classnames'
import { usePathname } from 'next/navigation'
import { TypeOfModalWindow } from '@/widgets/Sidebar/Sidebar'
import { sidebarActions } from '@/widgets/Sidebar/SidebarItem/sidebarActions'

type Props = {
  link: string
  text: Text
  isDisabled: boolean
  onClickAction?: (type: TypeOfModalWindow) => void
  isVisible?: boolean
  spanText: string
}

export const SidebarItem = ({ link, text, isDisabled, onClickAction, isVisible,spanText }: Props) => {
  const pathname = usePathname();

  return (
    <li
      className={clx(s.sidebarItem, {
        [s.disabled]: isDisabled,
      })}
    >
      {text === 'Log Out' ? (
        <Button
          className={clx(s.sidebarItemLink, {
            [s.unvisible]: isVisible,
          })}
          onClick={onClickAction}
        >
          <DynamicIcon text={text} />
          <span className={s.sidebarItemtext}>{spanText}</span>
        </Button>
      ) : (
        <Link href={link} className={clx(s.sidebarItemLink, {
          [s.active]: pathname === link
        })}>
          <DynamicIcon text={text} />
          <span className={s.sidebarItemtext}>{spanText}</span>
        </Link>
      )}
{/*export const SidebarItem = ({*/}
{/*                              link,*/}
{/*                              text,*/}
{/*                              isDisabled,*/}
{/*                              onClickAction,*/}
{/*                              isVisible,*/}
{/*                              spanText,*/}
{/*                            }: Props) => {*/}
{/*  const baseClasses = clx(s.sidebarItemLink, {*/}
{/*    [s.unvisible]: isVisible,*/}
{/*  })*/}

{/*  const action = sidebarActions[text] ?? { type: 'link' }*/}

{/*  const content =*/}
{/*    action.type === 'button' ? (*/}
{/*      <Button className={baseClasses} onClick={() => onClickAction?.(action.actionType)}>*/}
{/*        <DynamicIcon text={text} />*/}
{/*        <span className={s.sidebarItemtext}>{spanText}</span>*/}
{/*      </Button>*/}
{/*    ) : (*/}
{/*      <Link href={link} className={baseClasses}>*/}
{/*        <DynamicIcon text={text} />*/}
{/*        <span className={s.sidebarItemtext}>{spanText}</span>*/}
{/*      </Link>*/}
{/*    )*/}

{/*  return (*/}
{/*    <li*/}
{/*      className={clx(s.sidebarItem, {*/}
{/*        [s.disabled]: isDisabled,*/}
{/*      })}*/}
{/*    >*/}
{/*      {content}*/}
{/*    </li>*/}
{/*  )*/}
{/*}*/}
