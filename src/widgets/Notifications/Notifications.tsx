import s from '@/widgets/Notifications/Notifications.module.scss'
import NotificationIcon from '@/widgets/Header/icons/notification.svg'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Card } from '@/shared/ui'
import { NotificationItem } from '@/widgets/Notifications/NotificationItem/NotificationItem'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import {
  useGetNotificationsInfiniteQuery,
  useMarkAsReadNotificationsMutation,
} from '@/features/notificationsApi/notificationsApi'
import { PAGINATION } from '@/features/notificationsApi/notificationsConstants'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'

export const Notifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const { data, hasNextPage, fetchNextPage, isFetching } = useGetNotificationsInfiniteQuery({
    isRead: undefined,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    sortDirection: 'desc',
  })
  const [markAsRead] = useMarkAsReadNotificationsMutation()

  const { observerRef } = useInfiniteScroll({
    hasNextPage,
    isFetching,
    fetchNextPage,
    rootRef: scrollRef,
    rootMargin: '0px 0px 100px 0px',
    threshold: 0.01,
    enabled: isModalOpen,
  })

  const notificationsDataRaw = useMemo(() => data?.pages.flatMap(p => p.items) ?? [], [data?.pages])
  const notReadNotificationsCount = data?.pages[0].notReadCount
  const [arrIds, setArrIds] = useState<number[]>([])

  const notificationsData = useMemo(() => {
    const seen = new Set<string>()
    const arrIds = []
    const unique: typeof notificationsDataRaw = []
    for (const it of notificationsDataRaw) {
      const k = String(it.id)
      if (!seen.has(k)) {
        seen.add(k)
        unique.push(it)
      }
      if (!it.isRead) {
        arrIds.push(it.id)
      }
    }
    setArrIds(arrIds)
    return { unique }
  }, [notificationsDataRaw])

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  //const socketRef = useRef<Socket | null>(null)
  const messages = useAppSelector(selectCurrentMessages)


  useEffect(() => {
    if (!isModalOpen) return
    const onDocPointer = (e: MouseEvent | TouchEvent) => {
      const root = wrapperRef.current
      if (root && !root.contains(e.target as Node)) {
        setIsModalOpen(false)
        if(arrIds.length > 0){
          markAsRead({ ids: arrIds })
            .unwrap()
            .then(() => {
              setArrIds([])
            })
        }

      }
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('mousedown', onDocPointer, true)
    document.addEventListener('touchstart', onDocPointer, true)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('mousedown', onDocPointer, true)
      document.removeEventListener('touchstart', onDocPointer, true)
    }
  }, [isModalOpen, arrIds, markAsRead, wrapperRef])

  return (
    <div className={s.notificationsWrapper} ref={wrapperRef}>
      <button className={s.buttonNotification} onClick={() => setIsModalOpen(prev => !prev)}>
        <NotificationIcon />
        {notReadNotificationsCount && notReadNotificationsCount >= 1 ? (
          <span className={s.notificationCount}>{notReadNotificationsCount}</span>
        ) : null}
      </button>

      {isModalOpen && (
        <Card className={s.notificationsCard}>
          <h3 className={s.cardTitle}>Notifications</h3>

          <div className={s.scrollArea} ref={scrollRef}>
            {notificationsData.unique.map(n => (
              <NotificationItem notification={n} key={n.id} />
            ))}
            {hasNextPage && (
              <div ref={observerRef} className={s.sentinel}>
                {isFetching ? (
                  <Spinner
                    type="secondary"
                    size={10}
                    label={messages.common.loading}
                    fullWidth
                    center
                  />
                ) : (
                  ''
                )}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
