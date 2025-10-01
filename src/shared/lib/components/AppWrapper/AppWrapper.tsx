'use client'

import { useMeQuery } from '@/features/auth/api/authApi'
import { type ReactNode} from 'react'
import { Sidebar } from '@/widgets/Sidebar/Sidebar'
import s from './AppWrapper.module.scss'
import { Container } from '@/shared/ui'
import Skeleton from 'react-loading-skeleton'


export const AppWrapper = ({children}: {children: ReactNode}) => {
  const {data,isLoading} = useMeQuery()

  return (
    <div className={s.appWrapper}>
      <Container>
        <div className={s.appInner}>
          {isLoading &&
            <Skeleton
            baseColor="rgba(23, 23, 23, 0.6)"
            highlightColor="rgba(40, 40, 40, 0.8)"
            width={220}
            height={584}
          />}
          {data?.userId && <Sidebar/>}
          {children}
        </div>
      </Container>
    </div>

  )
}