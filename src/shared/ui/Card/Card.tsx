import s from './Card.module.scss'
import React, { ComponentPropsWithRef } from 'react'
import { clsx } from 'clsx'

export type Props = React.PropsWithChildren & ComponentPropsWithRef<'div'>

export const Card = ({ children, title, className, ...rest }: Props) => {
  return (
    <div className={clsx(s.box, className)} {...rest}>
      {title && <h1 className={s.title}>{title}</h1>}
      <div className={s.content}>{children}</div>
    </div>
  )
}
