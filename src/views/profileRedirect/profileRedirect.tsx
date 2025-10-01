'use client'

import { useMeQuery } from '@/features/auth/api/authApi'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import s from './profileRedirect.module.scss'

export const ProfileRedirect = () => {
  const { data, isLoading, isFetching } = useMeQuery()
  const router = useRouter()

  const redirectedRef = useRef(false)

  useEffect(() => {
    if (redirectedRef.current) return
    if (isLoading || isFetching) return

    redirectedRef.current = true
    const dest = data?.userId ? `/profile/${data.userId}` : '/'
    router.replace(dest)
  }, [isLoading, isFetching, data?.userId, router])

  return (
    <div style={{ width: '100%' }}>
      <Skeleton
        className={s.skeletonProfileHeader}
        baseColor="rgba(23, 23, 23, 0.6)"
        highlightColor="rgba(40, 40, 40, 0.8)"
      />
      <div className={s.skeletonWrapper}>
        <Skeleton
          baseColor="rgba(23, 23, 23, 0.6)"
          highlightColor="rgba(40, 40, 40, 0.8)"
          width={228}
          height={228}
          count={8}
        />
      </div>
    </div>
  )
}