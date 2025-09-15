'use client'
import { Container } from '@/shared/ui'
import { TotalRegisteredUsers } from '@/shared/ui/TotalRegisteredUsers/TotalRegisteredUsers'
import s from './HomePage.module.scss'
import { useGetTotalRegisteredUsersQuery } from '@/features/publicUserApi/publicUserApi'
import { Sidebar } from '@/widgets/Sidebar/Sidebar'
import { useMeQuery } from '@/features/auth/api/authApi'
import { useEffect, useState } from 'react'
import { ACCESS_TOKEN } from '@/shared/lib'
import { loginTC } from '@/shared/api/appSlice'
import { useAppDispatch } from '@/shared/lib/hooks/hooks'

export const HomePage = () => {
  const dispatch = useAppDispatch()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (token) {
      dispatch(loginTC({ isLoggedIn: true }))
    }
  }, [])
  const { data } = useMeQuery(undefined, { skip: !mounted })
  const { data: totalCountUser } = useGetTotalRegisteredUsersQuery()
   if(data?.isBlocked){
    localStorage.removeItem(ACCESS_TOKEN)
    dispatch(loginTC({ isLoggedIn: false }))
  }
  return (
    <Container className={s.container}>
      <div className={s.homePageWrapper}>
        <Sidebar data={data} />
        <div className={s.homePageContent}>
          {totalCountUser && <TotalRegisteredUsers totalCount={totalCountUser.totalCount} />}
        </div>
      </div>
    </Container>
  )
}
