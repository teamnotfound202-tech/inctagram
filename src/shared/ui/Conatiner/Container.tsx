import type { ReactNode } from 'react'
import s from './Container.module.scss'
import { clsx } from 'clsx'
type Props = {
  children: ReactNode
  className?: string
}

export const Container = ({ children, className }: Props) => {
  return <div className={clsx(s.container, className && className)}>{children}</div>
}
