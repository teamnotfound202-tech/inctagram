'use client'
import s from './Messenger.module.scss';
import { MessengerWindow } from '@/features/messenger/ui/MessengerWindow/MessengerWindow'
import { ReactNode } from 'react'

export const Messenger = ({ children }: { children: ReactNode }) => {
  return (
    <div className={s.messenger}>
      <h2 className={s.messengerTitle}>Messenger</h2>
      <MessengerWindow>{children}</MessengerWindow>
    </div>
  )
}