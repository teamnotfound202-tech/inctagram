'use client'
import s from '@/features/messenger/ui/MessengerWindow/MessengerDialog/MessengerDialog.module.scss'
import * as React from 'react'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

export const NoCurrentUser = () => {
  const messages = useAppSelector(selectCurrentMessages)
  return (
    <div className={s.dialogWindow}>
      <div className={s.dialogWindowTop}></div>
      <div className={s.bannerMessengerInner}>
        <p className={s.bannerMessenger}>{messages.messenger.talkToUser}</p>
      </div>
    </div>
  )
}