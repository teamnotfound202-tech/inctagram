'use client'
import s from './MessengerDialog.module.scss'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/hooks'
import { changeCurrentDialogId, selectCurrentMessages } from '@/shared/api/appSlice'
import { Avatar } from '@/entities/user/ui/Avatar'
import {
  useChangeStatusMessageMutation,
  useGetMessagesInfiniteQuery,
} from '@/features/messenger/api/messenger-api'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { Button, Input } from '@/shared/ui'
import MicroIcon from './icons/micro.svg'
import ImageIcon from './icons/image.svg'
import { useFetchMyProfileQuery, useFetchUserQuery } from '@/features/publicUserApi/publicUserApi'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { emitWithAuth } from '@/shared/lib/socket/getSocket'
import { MessengerListItem } from '@/features/messenger/ui/MessengerWindow/MessengerDialog/MessengerListItem/MessengerListItem'
import { SOCKET_EVENTS } from '@/shared/lib/constants/constants'

export const MessengerDialog = () => {
  const params = useParams<{ userId: string }>()
  const { userId } = params

  const messages = useAppSelector(selectCurrentMessages)
  const dispatch = useAppDispatch()
  const [isLoadingSend, setIsLoadingSend] = useState(false)

  const [value, setValue] = useState('')
  const [enabled, setEnabled] = useState(false)

  const {
    data: user,
    error,
    isLoading: isLoadingGetUser,
  } = useFetchUserQuery(userId ? +userId : 0, { skip: !userId })
  const { data: myUserData} = useFetchMyProfileQuery()
  const { data, hasNextPage, isFetching, fetchNextPage, isLoading } = useGetMessagesInfiniteQuery({
    dialoguePartnerId: user?.id ?? 0,
  })
  const [changeStatusMessages] =
    useChangeStatusMessageMutation()

  const listRef = useRef<HTMLUListElement>(null)

  const { observerRef } = useInfiniteScroll({ hasNextPage, enabled, isFetching, fetchNextPage })

  useEffect(() => {
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (user && user.id) {
      dispatch(changeCurrentDialogId({ dialogId: user.id }))
    }
  }, [user, user?.id, dispatch])

  useEffect(() => {
    if (data) {
      const messagesItems = data.pages.flatMap(item => item.items)
      const receiverItems = messagesItems.filter(item => item.ownerId !== myUserData?.id && item.status !== 'READ')
      const receiverIds = receiverItems.map(item => item.id)
      if (!receiverIds || !receiverIds.length) return
      if (user && user.id) {
        changeStatusMessages({ ids: receiverIds, dialoguePartnerId: user.id })
      }
    }
  }, [data, changeStatusMessages, myUserData?.id, user])

  if (error)
    return (
      <div className={s.error}>
        <h2>Error</h2>
        <p>Error loading user</p>
      </div>
    )

  const handleSendMessage =  async (message: string) => {
    if (user && user.id && message.trim().length > 0) {
      setIsLoadingSend(true)
      // emitToEvent(SOCKET_EVENTS.RECEIVE_MESSAGE, { receiverId: user.id, message }, () => {})
      setValue('')
      setIsLoadingSend(false)
      await emitWithAuth(SOCKET_EVENTS.RECEIVE_MESSAGE, { receiverId: user.id, message })
    }
  }

  const messagesArr = data?.pages.flatMap(page => page.items) ?? []

  if (isLoading || isLoadingGetUser) {
    return (
      <div className={s.dialogWindow}>
        <div className={s.dialogWindowTop}></div>
        <div className={s.dialogWrapperLoader}>
          <Spinner type="secondary" size={24} label={messages.common.loading} fullWidth center />
        </div>
      </div>
    )
  }

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
                <MessengerListItem
                  key={message.id}
                  message={message}
                  user={user}
                  isLoading={isFetching}
                />
              ))}

              {isFetching && (
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
                onKeyDown={async event => {
                  if (event.code === 'Enter') {
                      await handleSendMessage(value)
                  }
                }}
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
                <Button
                  variant={'text'}
                  onClick={async () => {
                    await handleSendMessage(value)
                  }}
                  onKeyDown={async event => {
                    if (event.code === 'Enter') {
                        await handleSendMessage(value)
                    }
                  }}
                  disabled={isLoadingSend || !value.trim().length}
                >
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
