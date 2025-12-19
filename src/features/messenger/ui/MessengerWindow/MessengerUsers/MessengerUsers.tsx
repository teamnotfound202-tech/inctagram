import s from './MessengerUsers.module.scss'
import { Input } from '@/shared/ui'
import { useEffect, useState } from 'react'
import { useGetUsersMessengerInfiniteQuery } from '@/features/messenger/api/messenger-api'
import { Avatar } from '@/entities/user/ui/Avatar'
import { formatCreatedAt } from '@/shared/lib/utils/formatCreatAt'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages, selectLanguage } from '@/shared/api/appSlice'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { clsx } from 'clsx'
import Link from 'next/link'
import { useMeQuery } from '@/features/auth/api/authApi'

export const MessengerUsers = () => {
  const lang = useAppSelector(selectLanguage)
  const {data: meData} = useMeQuery()
  const messages = useAppSelector(selectCurrentMessages)
  const [search, setSearch] = useState('')
  const [debounceSearch, setDebounceSearch] = useState('')
  const { data, refetch, hasNextPage, isFetching, fetchNextPage, isLoading, error } =
    useGetUsersMessengerInfiniteQuery({ search: debounceSearch })
  const [enabled, setEnabled] = useState(false)
  const { observerRef } = useInfiniteScroll({ hasNextPage, enabled, isFetching, fetchNextPage })

  useEffect(() => {
    setEnabled(true)
  }, [])

  useEffect(() => {
    const timerId = setTimeout(() => setDebounceSearch(search.trim()), 500)

    return () => clearTimeout(timerId)
  }, [search])

  useEffect(() => {
    refetch()
  }, [refetch])

  if(error) return <p>failed to data</p>

  const messengersUsersItems = data?.pages.flatMap(item => item.items) || []

  return (
    <div className={s.usersWindow}>
      <div className={s.userWindowTop}>
        <Input
          type={'search'}
          id={'messages-users'}
          placeholder={'Input search'}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <ul>
        {messengersUsersItems.map(user => {
          return (
            <li key={user.id}>
              <Link
                href={`/messenger/${meData?.userId === user.ownerId ? user.receiverId : user.ownerId}`}
                className={clsx(s.usersWindowItem, {
                  [s.messageNotRead]: user.status !== 'READ',
                })}
              >
                <Avatar src={user.avatars[1]?.url} alt={user.userName} />
                <div className={s.usersWindowItemContent}>
                  <div className={s.usersWindowItemTop}>
                    <span className={s.usersWindowItemName}>{user.userName}</span>
                    <span className={s.usersWindowItemDate}>
                      {formatCreatedAt(user.createdAt, { locale: lang })}
                    </span>
                  </div>
                  <div className={s.usersWindowItemText}>
                    {user.messageText.length > 15
                      ? user.messageText.slice(0, 15) + '...'
                      : user.messageText}
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
        {(isFetching || isLoading) && (
          <Spinner type="secondary" size={16} label={messages.common.loading} fullWidth center />
        )}
        <div ref={observerRef} style={{ height: '1px' }} />
      </ul>
    </div>
  )
}
