import s from './MessengerUsers.module.scss'
import { Input } from '@/shared/ui'
import { useEffect, useState } from 'react'
import { useGetUsersMessengerInfiniteQuery } from '@/features/messenger/api/messenger-api'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { useGetSearchUserInfiniteQuery } from '@/features/publicUserApi/publicUserApi'
import { MessengerUserItem } from '@/features/messenger/ui/MessengerWindow/MessengerUsers/MessengerUserItem/MessengerUserItem'
import { getSocket } from '@/shared/lib/socket/getSocket'
import { useMeQuery } from '@/features/auth/api/authApi'

export const MessengerUsers = () => {
  const messages = useAppSelector(selectCurrentMessages)
  const [search, setSearch] = useState('')
  const [debounceSearch, setDebounceSearch] = useState('')
  const { data: meData } = useMeQuery()
  const { data, refetch, hasNextPage, isFetching, fetchNextPage, isLoading, error } =
    useGetUsersMessengerInfiniteQuery({ search: debounceSearch })
  const messengersUsersItems = data?.pages.flatMap(item => item.items) || []
  const {
    data: userData,
    hasNextPage: userHasNextPage,
    isFetching: userIsFetching,
    fetchNextPage: userFetchNextPage,
    isLoading: userIsLoading,
  } = useGetSearchUserInfiniteQuery(
    { search: debounceSearch },
    {
      skip: !debounceSearch,
      refetchOnMountOrArgChange: true,
    }
  )

  const usersItems =
    userData?.pages.flatMap(item => item.items).filter(item => item.id !== meData?.userId) || []

  const [enabled, setEnabled] = useState(false)
  const { observerRef } = useInfiniteScroll({ hasNextPage, enabled, isFetching, fetchNextPage })
  const { observerRef: userObserverRef } = useInfiniteScroll({
    hasNextPage: userHasNextPage,
    enabled,
    isFetching: userIsFetching,
    fetchNextPage: userFetchNextPage,
  })

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

  if (error) {
    return (
      <div className={s.error}>
        <h2>Error</h2>
        <p>failed to data</p>
      </div>
    )
  }

  const handleClearSearch = () => setSearch('')

  return (
    <div className={s.usersWindow}>
      <div className={s.userWindowTop}>
        <Input
          type={'search'}
          id={'messages-users'}
          placeholder={'Input search'}
          onChange={e => setSearch(e.target.value)}
          value={search}
        />
      </div>
      {messengersUsersItems.length > 0 && (
        <>
          <ul className={s.usersWindowList}>
            {messengersUsersItems.map(user => {
              return (
                <MessengerUserItem
                  key={user.id}
                  user={user}
                  type={'messages'}
                  handleClearSearch={handleClearSearch}
                />
              )
            })}
            {(isFetching || isLoading) && (
              <Spinner
                type="secondary"
                size={16}
                label={messages.common.loading}
                fullWidth
                center
              />
            )}
            <div ref={observerRef} style={{ height: '1px' }} />
          </ul>
          <div className={s.line} />
        </>
      )}
      {usersItems.length > 0 && (
        <ul className={s.usersWindowList}>
          {usersItems.map(user => (
            <MessengerUserItem
              key={user.id}
              user={user}
              type={'user'}
              handleClearSearch={handleClearSearch}
            />
          ))}
          {(userIsFetching || userIsLoading) && (
            <Spinner type="secondary" size={16} label={messages.common.loading} fullWidth center />
          )}
          <div ref={userObserverRef} style={{ height: '1px' }} />
        </ul>
      )}
    </div>
  )
}
