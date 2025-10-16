'use client'

import { useMeQuery } from '@/features/auth/api/authApi'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { Loader } from '@/shared/ui/Loader/Loader'

export const ProfileRedirect = () => {
  const { data, isLoading, isFetching } = useMeQuery()

  const router = useRouter()

  const redirectedRef = useRef(false)
  const [ready, setReady] = useState(false)
  console.log('isLoading', isLoading)
  console.log('isFetching', isFetching)
  console.log('data', data)
  console.log('ready', ready)

  useEffect(() => {
    if (redirectedRef.current) return
    if (isLoading || isFetching) return
    console.log(data)
    redirectedRef.current = true
    const dest = data?.userId && `/profile/${data.userId}`
    setReady(true)
    console.log(dest)
    if (dest) {
      router.replace(dest)
    }
  }, [isLoading, isFetching, data, router])

  if (isLoading || !ready) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          zIndex: 100,
          backgroundColor: 'black',
          opacity: 0.7,
        }}
      >
        <Loader />
      </div>
    )
  }

  return <></>
}