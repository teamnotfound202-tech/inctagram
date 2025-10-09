'use client'

import { useMeQuery } from '@/features/auth/api/authApi'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Loader } from '@/shared/ui/Loader/Loader'

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
      <div style={{display:'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
        <Loader/>
      </div>
  )
}