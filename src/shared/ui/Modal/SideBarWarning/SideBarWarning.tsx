import React, { ReactNode } from 'react'
import s from '@/widgets/Sidebar/Sidebar.module.scss'
type Props = {
  children:ReactNode
}
export const SideBarWarning = ({children}:Props )=> {
  return (
    <>
      <p className={s.contentTextModal}>
        {children}
      </p>
    </>
  )
}

