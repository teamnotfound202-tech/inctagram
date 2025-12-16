import s from './MessengerWindow.module.scss'
import { MessengerUsers } from '@/features/messenger/ui/MessengerWindow/MessengerUsers/MessengerUsers'
import { MessengerDialog } from '@/features/messenger/ui/MessengerWindow/MessengerDialog/MessengerDialog'
import { useState } from 'react'

export type User = {
  url: string,
  userName: string,
  ownerId: number
}


export const MessengerWindow = () => {
  const [user, setUser] = useState<User | null>(null)

  const changeReadUser = (user: User)=> setUser(user)

  return (
    <div className={s.messengerWindow}>
      <MessengerUsers changeReadUser={changeReadUser} />
      <MessengerDialog user={user} />
    </div>
  )
}