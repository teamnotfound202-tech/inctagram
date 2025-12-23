'use client'
import { Input } from '@/shared/ui'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import s from './SearchUsers.module.scss'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { useGetSearchUserInfiniteQuery } from '@/features/publicUserApi/publicUserApi'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import { UserFromSearch } from '@/features/publicUserApi/types'
import { UserListItem } from '@/views/SearchUsers/UserListItem/UserListItem'

export const SearchUsers = () => {
  const messages = useAppSelector(selectCurrentMessages)

  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [usersFromSearch, setUsersFromSearch] = useState<UserFromSearch[]>([])

  const { data, hasNextPage, isFetching, isLoading, fetchNextPage } = useGetSearchUserInfiniteQuery(
    { search: debounced },
    { skip: debounced === '', refetchOnMountOrArgChange: true }
  )

  useEffect(() => {
    const usersFromSearch = localStorage.getItem('usersFromSearch')
    setUsersFromSearch(usersFromSearch ? JSON.parse(usersFromSearch) : [])
  }, [])

  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 500)
    return () => clearTimeout(id)
  }, [search])

  const handleUsersFromSearch = (filteredUsers: UserFromSearch[]) => {
    setUsersFromSearch(filteredUsers)
  }

  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetching,
    enabled: true,
    fetchNextPage,
  })

  const users = data?.pages.flatMap(item => item.items) ?? []
  const usersForRender = debounced ? users : usersFromSearch

  return (
    <div className={s.searchPage}>
      <h2 className={s.title}>Search</h2>
      <Input
        id={'usersSearch'}
        className={s.searchInput}
        type="search"
        placeholder={messages.navigation.search}
        onChange={e => setSearch(e.target.value)}
        value={search}
      />

      <div className={s.usersList}>
        <h3 className={s.listTitle}>Recent requests</h3>

        {!isLoading && users.length === 0 && usersFromSearch.length === 0 && !debounced && (
          <div className={s.notFoundMessage}>{messages.messenger.noRecentRequests}</div>
        )}
        {!isLoading && users.length === 0 && debounced && (
          <div className={s.notFoundMessage}>{messages.profile.noSearchUsers}</div>
        )}

        {usersForRender.map(user => (
          <UserListItem
            key={user.id}
            user={user}
            handleUsersFromSearch={handleUsersFromSearch}
            debounced={debounced}
          />
        ))}
        {(isFetching || isLoading) && (
          <Spinner type="secondary" size={16} label={messages.common.loading} fullWidth center />
        )}
      </div>
      <div ref={observerRef} style={{ height: '1px' }} />
    </div>
  )
}
