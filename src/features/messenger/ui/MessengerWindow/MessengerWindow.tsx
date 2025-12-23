import s from './MessengerWindow.module.scss'
import { MessengerUsers } from '@/features/messenger/ui/MessengerWindow/MessengerUsers/MessengerUsers'
import { ReactNode, useEffect } from 'react'
import { getSocket } from '@/shared/lib/socket/getSocket'

export type User = {
  url: string,
  userName: string,
  ownerId: number
}


export const MessengerWindow = ({ children }: {children: ReactNode }) => {
  useEffect(() => {
    const socket = getSocket()
    socket.connect()
  }, [])
  return (
    <div className={s.messengerWindow}>
      <MessengerUsers />
      {children}
    </div>
  )
}