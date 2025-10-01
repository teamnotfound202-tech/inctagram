'use client'
import { Button } from '@/shared/ui/Button/Button'
import Link from 'next/link'
import s from './Header.module.scss'
import NotificationIcon from '@/widgets/Header/icons/notification.svg'
import FlagRussia from '@/shared/ui/Select/icon/FlagRussia.svg'
import FlagEngland from '@/shared/ui/Select/icon/FlagEngland.svg'
import { useMeQuery } from '@/features/auth/api/authApi'
import { Path } from '@/shared/config'
import { Container } from '@/shared/ui'
import { useAppDispatch } from '@/shared/lib/hooks/hooks'
import { changeLanguage } from '@/shared/api/appSlice'
import { SelectBox } from '@/shared/ui/Select/Select'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { LANGUAGE } from '@/shared/lib/constants/constants'
import { useEffect } from 'react'
import { Language } from '@/shared/lib/locale/message'

type Props = {
  notification: number
  agreement?: boolean
}

export const Header = ({ notification }: Props) => {
  const { data, isLoading, isError } = useMeQuery()
  const dispatch = useAppDispatch()
  useEffect(() => {
    const languageItem = localStorage.getItem(LANGUAGE)
    const language = (JSON.parse(languageItem  as Language)) || 'en';    dispatch(
      changeLanguage({
        language
      })
    )
  }, [])
  const handleLanguageChange = (value: string) => {
    const languageItem = value === 'option1' ? 'ru' : 'en'
    localStorage.setItem(LANGUAGE, JSON.stringify(languageItem))
    dispatch(
      changeLanguage({
        language: languageItem,
      })
    )
  }

  return (
    <header className={s.header}>
      <Container>
        <div className={s.headerWrapper}>
          <a className={s.headerTitle} href={'/'}>
            Inctagram
          </a>
          {isLoading && (
            <Skeleton
              baseColor="rgba(23, 23, 23, 0.6)"
              highlightColor="rgba(40, 40, 40, 0.8)"
              width={500}
              height={32}
            />
          )}

          {data?.userId && (
            <div className={s.headerGroupContainer}>
              <button className={s.buttonNotification}>
                <NotificationIcon />
                {notification !== 0 && <span className={s.notificationCount}>{notification}</span>}
              </button>
              <SelectBox
                options={[
                  { value: 'option1', icon: <FlagRussia />, label: 'Russia' },
                  { value: 'option2', icon: <FlagEngland />, label: 'England' },
                ]}
                name={'select1'}
                type={'lang'}
                defaultValue={'option2'}
                fullWidth={false}
                onValueChange={handleLanguageChange}
              />
            </div>
          )}
          {isError && (
            <div className={s.buttonGroupLogin}>
              <SelectBox
                options={[
                  { value: 'option1', icon: <FlagRussia />, label: 'Russia' },
                  { value: 'option2', icon: <FlagEngland />, label: 'England' },
                ]}
                name={'select1'}
                type={'lang'}
                defaultValue={'option2'}
                fullWidth={false}
                onValueChange={handleLanguageChange}
              />
              {!data?.userId && (
                <Button variant={'text'} asChild>
                  <Link href={Path.SignIn}>Log in</Link>
                </Button>
              )}

              <Button asChild>
                <Link href={Path.SignUp}>Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </Container>
    </header>
  )
}
