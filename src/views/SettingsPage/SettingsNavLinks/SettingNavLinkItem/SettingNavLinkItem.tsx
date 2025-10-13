'use client';
import Link from 'next/link'
import s from './SettingNavLinkItem.module.scss'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import clx from 'classnames'

type Props = {
  href: string
  text: string
}

export const SettingNavLinkItem = ({ href, text }: Props) => {
  const searchParams = useSearchParams()
  const path = useMemo(() => searchParams.get('part'), [searchParams])

  return (
    <Link
      href={`/settings?part=${href}`}
      className={clx(s.settingNavLinkItem, {
        [s.settingNavLinkItemActive]: path === href,
      })}
    >
      {text}
    </Link>
  )
}