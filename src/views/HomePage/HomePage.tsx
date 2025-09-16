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
import {useTranslations} from 'next-intl';
import {LanguageSwitcher} from "@/features/LanguageSwitcher/LanguageSwitcher";
import {getMessages} from "../../../messages/message";

export const HomePage = () => {
  const t = useTranslations('navigation');

  const m = getMessages( 'ru')
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

  return (
    <Container className={s.container}>
      <div className={s.homePageWrapper}>
        <Sidebar data={data} />
        <div className={s.homePageContent}>
        {/*  <h1>{t('profile')}</h1>*/}
          <h1>{m.auth.logIn}</h1>
          <LanguageSwitcher initialLocale={'ru'}/>
          {totalCountUser && <TotalRegisteredUsers totalCount={totalCountUser.totalCount} />}
        </div>
      </div>
    </Container>
  )
}
