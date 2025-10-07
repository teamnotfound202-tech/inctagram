'use client'

import {
  useLazyFollowersUserQuery,
  useLazyFollowingsUserQuery,
} from '@/features/publicUserApi/publicUserApi'
import { Modal } from '@/shared/ui/Modal/Modal'
import { useCallback, useEffect, useRef, useState } from 'react'
import { UserItem, UserProfileResponse } from '@/features/publicUserApi/types'
import { ResponsesMe } from '@/shared/api'
import { UserListItem } from '@/shared/lib/components/ModalUserFollowers/UserListItem/UserListItem'
import Skeleton from 'react-loading-skeleton'
import { Input } from '@/shared/ui'
import s from './ModalUsers.module.scss'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

type Props = {
  type: 'following' | 'followers'
  userName: string
  currentUser: ResponsesMe | undefined
  isOpen: boolean
  onCloseAction: () => void
  userStats: UserProfileResponse
}

const PAGE_SIZE = 12

// утилита дедупликации по id
function uniqById<T extends { id: number | string }>(arr: T[]): T[] {
  const map = new Map<string | number, T>()
  for (const item of arr) map.set(item.id, item)
  return Array.from(map.values())
}

export const ModalUsers = ({ type, isOpen, onCloseAction, userName, userStats }: Props) => {
  const [getUserFollowings, followingsState] = useLazyFollowingsUserQuery()
  const [getUserFollowers, followersState] = useLazyFollowersUserQuery()

  const messages = useAppSelector(selectCurrentMessages)

  const [title, setTitle] = useState('')
  const [users, setUsers] = useState<UserItem[]>([])
  const [skeletonCount, setSkeletonCount] = useState<number>(0)

  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [bootLoading, setBootLoading] = useState(false)
  const [nextLoading, setNextLoading] = useState(false)

  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 300)
    return () => clearTimeout(id)
  }, [search])

  const scrollBoxRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const isFetching = followingsState.isFetching || followersState.isFetching
  const isLoading = bootLoading || (isFetching && users.length === 0)

  // защита от частых триггеров IO
  const loadingGateRef = useRef(false)
  // запоминаем последний запрошенный курсор, чтобы не дёргать одну и ту же страницу
  const lastRequestedCursorRef = useRef<number | null>(null)

  // общий раннер запроса
  const runQuery = useCallback(
    async (args: { pageSize: number; cursor?: number | 0; search?: string }) => {
      if (type === 'following') {
        return getUserFollowings({ userName, ...args }).unwrap()
      }
      return getUserFollowers({ userName, ...args }).unwrap()
    },
    [type, userName, getUserFollowings, getUserFollowers]
  )

  // первая пачка / перезапуск при смене type/userName/поиска
  const loadFirst = useCallback(async () => {
    setBootLoading(true)
    setUsers([])
    setHasMore(true)
    setNextCursor(null)
    lastRequestedCursorRef.current = null

    if (type === 'following') {
      setSkeletonCount(Math.min(PAGE_SIZE, userStats.followingCount))
      setTitle(`${userStats.followingCount} ${messages.profile.following}`)
    } else {
      setSkeletonCount(Math.min(PAGE_SIZE, userStats.followersCount))
      setTitle(`${userStats.followersCount} ${messages.profile.followers}`)
    }

    try {
      const res = await runQuery({ pageSize: PAGE_SIZE, cursor: 0, search: debounced || undefined })
      const items: UserItem[] = Array.isArray(res.items) ? res.items : []
      const unique = uniqById(items)
      setUsers(unique)
      setNextCursor(res.nextCursor ?? null)
      setHasMore(unique.length === PAGE_SIZE && !!res.nextCursor && res.nextCursor !== 0)
    } finally {
      setBootLoading(false)
    }
  }, [runQuery, debounced, type, userStats, messages.profile.following, messages.profile.followers])

  // догрузка следующих пачек
  const loadNext = useCallback(async () => {
    if (nextCursor == null) return
    if (!hasMore || nextLoading || bootLoading) return

    // 1) Частые срабатывания IO и защита от одинакового курсора
    if (loadingGateRef.current) return
    if (lastRequestedCursorRef.current === nextCursor) return

    loadingGateRef.current = true
    lastRequestedCursorRef.current = nextCursor
    setNextLoading(true)

    try {
      const res = await runQuery({
        pageSize: PAGE_SIZE,
        cursor: nextCursor,
        search: debounced || undefined,
      })

      const items: UserItem[] = Array.isArray(res.items) ? res.items : []
      const newCursor = res.nextCursor ?? null

      // 2) Склеиваем и проверяем, стало ли элементов больше
      let increased = false
      setUsers(prev => {
        const merged = uniqById([...prev, ...items])
        increased = merged.length > prev.length
        return merged
      })

      // 3) Решаем, есть ли ещё страницы
      //    — есть курсор для следующего запроса
      //    — и пришла полная страница
      if (increased && newCursor && newCursor !== nextCursor && items.length === PAGE_SIZE) {
        setNextCursor(newCursor)
        setHasMore(true)
      } else {
        // либо новых записей нет, либо курсора нет/не сменился, либо страница неполная — стоп
        setNextCursor(newCursor)
        setHasMore(false)
      }
    } finally {
      setNextLoading(false)
      loadingGateRef.current = false
    }
  }, [hasMore, nextLoading, bootLoading, runQuery, nextCursor, debounced])
  // стартовая загрузка и перезапуск
  useEffect(() => {
    if (isOpen) loadFirst()
  }, [isOpen, type, userName, debounced, loadFirst])

  // IntersectionObserver для подгрузки
  useEffect(() => {
    if (!isOpen || !sentinelRef.current || !scrollBoxRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadNext()
      },
      { root: scrollBoxRef.current, rootMargin: '0px 0px 300px 0px', threshold: 0.01 }
    )
    io.observe(sentinelRef.current)
    return () => io.disconnect()
  }, [isOpen, loadNext])

  const keyPrefix = type
  if (!isOpen) return null

  return (
    <Modal title={title} onClick={onCloseAction}>
      <Input
        className={s.searchInput}
        type="search"
        placeholder={messages.navigation.search}
        onChange={e => setSearch(e.target.value)}
        value={search}
      />

      <div ref={scrollBoxRef} className={s.usersScrollArea}>
        {isLoading && (
          <div className={s.skeletonWrapper}>
            <Skeleton
              className={s.skeleton}
              baseColor="rgba(23, 23, 23, 0.6)"
              highlightColor="rgba(40, 40, 40, 0.8)"
              width={572}
              height={33}
              count={skeletonCount || PAGE_SIZE}
            />
          </div>
        )}

        <div className={s.usersList}>
          {!isLoading && users.length === 0 && (
            <div className={s.notFoundMessage}>
              {debounced ? messages.profile.noSearchUsers : messages.profile.noUsersShow}
            </div>
          )}

          {users.map(user => (
            <UserListItem
              key={`${keyPrefix}-${user.id}`}
              user={user}
              isLoading={false}
              type={type}
            />
          ))}

          {nextLoading && <Spinner type="secondary" size={16} label={messages.common.loading} fullWidth center />}

          <div ref={sentinelRef} style={{ height: 1 }} />
          {!hasMore && users.length > 0 && <div className={s.endMessage}>{messages.profile.thatsAll}</div>}
        </div>
      </div>
    </Modal>
  )
}