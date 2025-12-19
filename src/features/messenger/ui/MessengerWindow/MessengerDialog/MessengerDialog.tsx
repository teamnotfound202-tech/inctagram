'use client'
import s from './MessengerDialog.module.scss'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { Avatar } from '@/entities/user/ui/Avatar'
import { useGetMessagesInfiniteQuery } from '@/features/messenger/api/messenger-api'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { Button, Input } from '@/shared/ui'
import MicroIcon from './icons/micro.svg'
import ImageIcon from './icons/image.svg'
import { MessageItemType} from '@/features/messenger/api/type'
import { emitToEvent } from '@/shared/lib/socket/emitToEvent'
import { SOCKET_EVENTS } from '@/shared/lib/constants/constants'
import { useFetchMyProfileQuery, useFetchUserQuery } from '@/features/publicUserApi/publicUserApi'
import { clsx } from 'clsx'
import * as React from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export const MessengerDialog = () => {
  const params = useParams<{ userId: string }>()
  const {userId} = params
  const { data: user } = useFetchUserQuery(userId ? +userId : 0, {
    skip: !userId,
  })
  const [value, setValue] = useState('')
  const { data: myUserData } = useFetchMyProfileQuery()
  const messages = useAppSelector(selectCurrentMessages)
  const { data, hasNextPage, isFetching, fetchNextPage, isLoading } = useGetMessagesInfiniteQuery({
    dialoguePartnerId: user?.id ?? 0,
  })
  const listRef = useRef<HTMLUListElement>(null)

  const [enabled, setEnabled] = useState(false)

  const { observerRef } = useInfiniteScroll({ hasNextPage, enabled, isFetching, fetchNextPage })

  useEffect(() => {
    setEnabled(true)
  }, [])

  const handleSendMessage = (message: string) => {
    emitToEvent(
      SOCKET_EVENTS.RECEIVE_MESSAGE,
      { receiverId: user?.id, message },
      (data: MessageItemType) => {
        console.log(data)
      }
    )
    setValue('')
  }

  const messagesArr = data?.pages.flatMap(page => page.items) ?? []

  return (
    <div className={s.dialogWindow}>
      {user && (
        <>
          <div className={s.dialogWindowTop}>
            <Link className={s.dialogWindowUser} href={`/profile/${user.id}`}>
              <Avatar src={user.avatars[0]?.url} alt={user.userName} />
              <p className={s.dialogWindowUser}>{user.userName}</p>
            </Link>
          </div>
          <div className={s.bannerMessengerWrapper}>
            <ul className={s.dialog} ref={listRef}>
              {messagesArr.map(message => (
                <li
                  key={message.id}
                  className={clsx(s.dialogItem, {
                    [s.dialogItemMyProfile]: myUserData?.id === message.ownerId,
                  })}
                >
                  <Avatar
                    src={
                      myUserData?.id === message.ownerId
                        ? myUserData.avatars[0]?.url
                        : user.avatars[0]?.url
                    }
                    alt={myUserData?.id === message.ownerId ? myUserData.userName : user.userName}
                  />
                  <div className={s.dialogContent}>
                    <p className={s.dialogText}>{message.messageText}</p>
                    <p className={s.date}>
                      {new Intl.DateTimeFormat('ru-Ru', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }).format(new Date(message.createdAt))}
                    </p>
                  </div>
                </li>
              ))}

              {(isFetching || isLoading) && (
                <Spinner
                  type="secondary"
                  size={16}
                  label={messages.common.loading}
                  fullWidth
                  center
                />
              )}
              {hasNextPage && (
                <div ref={observerRef}>
                  <div style={{ height: '20px' }} />
                </div>
              )}
            </ul>
            <div className={s.dialogInputWrapper}>
              <Input
                className={s.dialogInput}
                type={'text'}
                id={'userMessage'}
                placeholder={'Type Message...'}
                value={value}
                onChange={e => setValue(e.target.value)}
              />
              {!value ? (
                <div className={s.btnWrapper}>
                  <button className={s.btnIcon}>
                    <MicroIcon />
                  </button>
                  <button className={s.btnIcon}>
                    <ImageIcon />
                  </button>
                </div>
              ) : (
                <Button variant={'text'} onClick={() => handleSendMessage(value)}>
                  Send message
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
