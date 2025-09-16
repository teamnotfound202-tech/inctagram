'use client'
import {Button} from '@/shared/ui/Button/Button'
import Link from 'next/link'
import s from './Header.module.scss'
import NotificationIcon from '@/widgets/Header/icons/notification.svg'
import {SelectBox} from '@/shared/ui/Select/Select'
import FlagRussia from '@/shared/ui/Select/icon/FlagRussia.svg'
import FlagEngland from '@/shared/ui/Select/icon/FlagEngland.svg'
import {Path} from '@/shared/config'
import {Container} from '@/shared/ui'
import {useAppDispatch, useAppSelector} from '@/shared/lib/hooks/hooks'
import {meAC,selectIsLoggedIn} from '@/shared/api/appSlice'
import {useEffect} from 'react'
import {useMeQuery} from "@/features/auth/api/authApi";

type Props = {
  notification: number
  agreement?: boolean
}

export const Header = ({notification, agreement }: Props) => {
  const {data} = useMeQuery()
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  useEffect(() => {
    if(data) {
      dispatch(meAC({...data, isLoggedIn: true}))
    }
  }, [data,dispatch]);



  // const loginedWithSignIn = useAppSelector(selectIsLoggedIn)
  // useEffect(() => {
  //   const token = localStorage.getItem(ACCESS_TOKEN)
  //   setIsLoggedIn(!!token)
  // }, [loginedWithSignIn])

  return (
    <header className={s.header}>
      <Container>
        <div className={s.headerWrapper}>
          <a className={s.headerTitle} href={'/'}>
            Inctagram
          </a>

          {isLoggedIn ? (
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
              />
              {!isLoggedIn && (
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
