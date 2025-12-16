'use client'
import s from './Messenger.module.scss';
import { MessengerWindow } from '@/features/messenger/ui/MessengerWindow/MessengerWindow'

export const Messenger = () => {
  return (
    <div className={s.messenger}>
      <h2 className={s.messengerTitle}>Messenger</h2>
      <MessengerWindow/>
    </div>
  )
}