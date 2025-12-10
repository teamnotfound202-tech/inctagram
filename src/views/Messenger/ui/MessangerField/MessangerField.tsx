'use client'
import { format, parseISO } from 'date-fns'
import { usePathname } from 'next/navigation'
import { MessageItem } from '@/views/Messenger/ui/MessageItem/MessageItem'
import s from './MessangerField.module.scss'
import { Status } from '@/features/messengerApi/types'
import { MessengerInput } from '@/views/Messenger/ui/MessengerInput/MessengerInput'
import { getIdFromPath } from '@/views/Messenger/model/helpers'
import { useGetMessagesByDialogPartnerInfiniteQuery } from '@/features/messengerApi/messengerApi'
import * as React from 'react'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import { useEffect } from 'react'
import { ScrollBox } from '@/shared/ui'

type Props = {
  dialogPartnerId: number
}
export const MessangerField = ({ dialogPartnerId }: Props) => {
  const path = usePathname()
  const conversationId = getIdFromPath(path)
  const { data, isFetching, isLoading, fetchNextPage, hasNextPage,refetch } =
    useGetMessagesByDialogPartnerInfiniteQuery({ dialogPartnerId, ownerId: conversationId || 52 })

  const dataToDisplay = data?.pages.flatMap(item => item.items) || []
  const {observerRef} = useInfiniteScroll({
    hasNextPage,isFetching,fetchNextPage,enabled:true
  })
  return (
    <div className={s.messageFieldWrapper}>
      <ScrollBox>
      <div className={s.messagesContainer}>
        {dataToDisplay.map(item => {
          const date = parseISO(item.updatedAt)
          const time = format(date, 'HH:mm')
          return (
            <MessageItem
              key={item.id}
              owner={item.ownerId === conversationId}
              message={item.messageText}
              date={time}
              status={item.status as Status}
            />
          )
        })}
        <div ref={observerRef} style={{ height: '1px' }}></div>
      </div>
      </ScrollBox>
      <div>
        <MessengerInput dialogPartnerId={dialogPartnerId} ownerId={conversationId || 52} />
      </div>
    </div>
  )
}
