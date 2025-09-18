'use client'
import {Button} from '@/shared/ui/Button/Button'
import Link from 'next/link'
import s from './Header.module.scss'
import NotificationIcon from '@/widgets/Header/icons/notification.svg'
import FlagRussia from '@/shared/ui/Select/icon/FlagRussia.svg'
import FlagEngland from '@/shared/ui/Select/icon/FlagEngland.svg'
import {useMeQuery} from "@/features/auth/api/authApi";
import { Path } from '@/shared/config'
import { Container } from '@/shared/ui'
import { useAppDispatch, useAppSelector } from '@/shared/lib/hooks/hooks'
import { changeLanguage} from '@/shared/api/appSlice'
import { ACCESS_TOKEN } from '@/shared/lib'
import { useEffect, useState } from 'react'
import { SelectBox } from '@/shared/ui/Select/Select'


type Props = {
  notification: number
  agreement?: boolean
}

export const Header = ({notification, agreement }: Props) => {
  const {data} = useMeQuery()
  const dispatch = useAppDispatch()

  const handleLanguageChange = (value:string) => {
    dispatch(changeLanguage({
      language: value === 'option1' ? "ru" : "en"
    }));
  };

  return (
    <header className={s.header}>
      <Container>
        <div className={s.headerWrapper}>
          <a className={s.headerTitle} href={'/'}>
            Inctagram
          </a>

          {data?.userId ? (
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
          ) : agreement ? (
            <div className={s.headerGroupContainer}>
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
          ) : (
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
