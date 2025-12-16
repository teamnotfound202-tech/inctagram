import s from './MessengerDialog.module.scss'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages, selectLanguage } from '@/shared/api/appSlice'
import { User } from '@/features/messenger/ui/MessengerWindow/MessengerWindow'
import { Avatar } from '@/entities/user/ui/Avatar'
import { useGetMessagesInfiniteQuery } from '@/features/messenger/api/messenger-api'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { current } from 'immer'

type Props = {
  user: User | null
}
export const MessengerDialog = ({ user }: Props) => {
  const messages = useAppSelector(selectCurrentMessages)
  const { data, hasNextPage, isFetching, fetchNextPage, isLoading, isFetchingNextPage } = useGetMessagesInfiniteQuery({
    dialoguePartnerId: user?.ownerId ?? 0,
  })
  const listRef = useRef<HTMLUListElement>(null)

  const [enabled, setEnabled] = useState(false)

  const { observerRef } = useInfiniteScroll({ hasNextPage, enabled, isFetching, fetchNextPage })

  useEffect(() => {
    setEnabled(true)
  }, [])

  // useLayoutEffect(() => {
  //   const list = listRef.current;
  //   console.log('list 0', list)
  //   if (!enabled) return
  //   console.log('list',list)
  //   list?.scrollTo({ top: list.scrollHeight, behavior: 'auto' })
  // }, [enabled])

  const messagesArr = data?.pages.flatMap(page=> page.items) ?? []
  return (
    <div className={s.dialogWindow}>
      <div className={s.dialogWindowTop}>
        {user && (
          <div className={s.dialogWindowUser}>
            <Avatar src={user.url} alt={user.userName} />
            <p className={s.dialogWindowUser}>{user.userName}</p>
          </div>
        )}
      </div>
      <div className={s.bannerMessengerWrapper}>
        {!user ? (
          <div className={s.bannerMessengerInner}>
            <p className={s.bannerMessenger}>{messages.messenger.talkToUser}</p>
          </div>
        ) : (
          <ul className={s.dialog} ref={listRef}>
            {messagesArr.map(message => (
              <li key={message.id} className={s.dialogItem}>
                <Avatar src={user.url} alt={user.userName} />
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
        )}
      </div>
    </div>
  )
}
