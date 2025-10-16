'use client'

import { useMeQuery } from '@/features/auth/api/authApi'
import { type ReactNode } from 'react'
import { Sidebar } from '@/widgets/Sidebar/Sidebar'
import s from './AppWrapper.module.scss'
import { Container } from '@/shared/ui'

export const AppWrapper = ({ children }: { children: ReactNode }) => {
  const { data} = useMeQuery()

  return (
    <div className={s.appWrapper}>
      <Container>
        <div className={s.appInner}>
          {data?.userId && <Sidebar />}
            {children}
        </div>
      </Container>
    </div>
  )
}