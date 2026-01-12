import s from './MessengerWindow.module.scss'
import { MessengerUsers } from '@/features/messenger/ui/MessengerWindow/MessengerUsers/MessengerUsers'
import { ReactNode } from 'react'

export type User = {
  url: string
  userName: string
  ownerId: number
}


export const MessengerWindow = ({ children }: {children: ReactNode }) => {
  return (
    <div className={s.messengerWindow}>
      <MessengerUsers />
      {children}
    </div>
  )
}